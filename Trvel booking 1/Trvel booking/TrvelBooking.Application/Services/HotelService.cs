using AutoMapper;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TrvelBooking.Application.DTOs.Hotel;
using TrvelBooking.Application.Exceptions;
using TrvelBooking.Application.Interfaces.IRepositories;
using TrvelBooking.Application.Interfaces.IServices;
using TrvelBooking.Application.Interfaces.IExternal;
using TrvelBooking.Domain.Entities;

namespace TrvelBooking.Application.Services
{
    public class HotelService : IHotelService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IHotelProviderService _externalHotelService;
        private readonly ILogger<HotelService> _logger;

        public HotelService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IHotelProviderService externalHotelService,
            ILogger<HotelService> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _externalHotelService = externalHotelService;
            _logger = logger;
        }

        public async Task<IEnumerable<HotelDto>> SearchHotelsAsync(HotelSearchDto searchDto)
        {
            _logger.LogInformation("Searching hotels in City: {City}", searchDto.City);

            // 1. Search locally
            var localHotels = await _unitOfWork.Hotels.SearchHotelsAsync(
                searchDto.City, 
                searchDto.MaxPricePerNight, 
                searchDto.MinRating);

            var hotelsList = localHotels.ToList();

            // 2. If no hotels are found locally and city is specified, call external hotel service
            if (!hotelsList.Any() && !string.IsNullOrWhiteSpace(searchDto.City))
            {
                _logger.LogInformation("No local hotels found. Querying external Hotel Provider API for city '{City}'", searchDto.City);

                var externalOffers = await _externalHotelService.GetHotelsInCityAsync(searchDto.City);

                foreach (var offer in externalOffers)
                {
                    var hotel = new Hotel
                    {
                        Id = Guid.NewGuid(),
                        Name = offer.Name,
                        City = offer.City,
                        Address = offer.Address,
                        Description = offer.Description,
                        PricePerNight = offer.PricePerNight,
                        AvailableRooms = 10, // default rooms
                        Rating = offer.Rating,
                        Images = offer.Images
                    };

                    // Prevent duplicates by name in the same city
                    var exists = await _unitOfWork.Hotels.FindAsync(h => h.Name.ToLower() == hotel.Name.ToLower() && h.City.ToLower() == hotel.City.ToLower());
                    if (!exists.Any())
                    {
                        await _unitOfWork.Hotels.AddAsync(hotel);
                        hotelsList.Add(hotel);
                    }
                }

                if (externalOffers.Any())
                {
                    await _unitOfWork.CompleteAsync();
                }
            }

            // Apply filters if we got external hotels
            var result = hotelsList.AsQueryable();
            if (searchDto.MaxPricePerNight.HasValue)
            {
                result = result.Where(h => h.PricePerNight <= searchDto.MaxPricePerNight.Value);
            }
            if (searchDto.MinRating.HasValue)
            {
                result = result.Where(h => h.Rating >= searchDto.MinRating.Value);
            }

            return _mapper.Map<IEnumerable<HotelDto>>(result);
        }

        public async Task<HotelDto?> GetHotelByIdAsync(Guid id)
        {
            var hotel = await _unitOfWork.Hotels.GetByIdAsync(id);
            if (hotel == null)
            {
                throw new NotFoundException(nameof(Hotel), id);
            }
            return _mapper.Map<HotelDto>(hotel);
        }

        public async Task<HotelDto> CreateHotelAsync(CreateHotelDto hotelDto)
        {
            var hotel = _mapper.Map<Hotel>(hotelDto);
            await _unitOfWork.Hotels.AddAsync(hotel);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<HotelDto>(hotel);
        }

        public async Task<HotelDto> UpdateHotelAsync(Guid id, UpdateHotelDto hotelDto)
        {
            var hotel = await _unitOfWork.Hotels.GetByIdAsync(id);
            if (hotel == null)
            {
                throw new NotFoundException(nameof(Hotel), id);
            }

            _mapper.Map(hotelDto, hotel);
            _unitOfWork.Hotels.Update(hotel);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<HotelDto>(hotel);
        }

        public async Task DeleteHotelAsync(Guid id)
        {
            var hotel = await _unitOfWork.Hotels.GetByIdAsync(id);
            if (hotel == null)
            {
                throw new NotFoundException(nameof(Hotel), id);
            }

            // Check if there are active bookings for this hotel
            var bookings = await _unitOfWork.Bookings.FindAsync(b => b.HotelId == id);
            if (bookings.Any())
            {
                throw new BadRequestException("Cannot delete hotel because it has associated bookings.");
            }

            _unitOfWork.Hotels.Remove(hotel);
            await _unitOfWork.CompleteAsync();
        }
    }
}
