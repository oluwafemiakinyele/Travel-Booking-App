using AutoMapper;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TrvelBooking.Application.DTOs.Booking;
using TrvelBooking.Application.Exceptions;
using TrvelBooking.Application.Interfaces.IRepositories;
using TrvelBooking.Application.Interfaces.IServices;
using TrvelBooking.Domain.Entities;
using TrvelBooking.Domain.Enums;

namespace TrvelBooking.Application.Services
{
    public class BookingService : IBookingService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<BookingService> _logger;

        public BookingService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ILogger<BookingService> _logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            this._logger = _logger;
        }

        public async Task<BookingDto> CreateBookingAsync(Guid userId, CreateBookingDto bookingDto)
        {
            _logger.LogInformation("Creating booking for User: {User}, Type: {Type}", userId, bookingDto.BookingType);

            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
            {
                throw new NotFoundException("User not found.");
            }

            var booking = _mapper.Map<Booking>(bookingDto);
            booking.UserId = userId;

            if (booking.BookingType == BookingType.Flight)
            {
                if (!bookingDto.FlightId.HasValue)
                {
                    throw new BadRequestException("Flight ID is required for a flight booking.");
                }

                var flight = await _unitOfWork.Flights.GetByIdAsync(bookingDto.FlightId.Value);
                if (flight == null)
                {
                    throw new NotFoundException(nameof(Flight), bookingDto.FlightId.Value);
                }

                if (flight.AvailableSeats < bookingDto.NumberOfGuests)
                {
                    throw new BadRequestException($"Not enough seats available. Requested: {bookingDto.NumberOfGuests}, Available: {flight.AvailableSeats}");
                }

                // Reserve seats
                flight.AvailableSeats -= bookingDto.NumberOfGuests;
                _unitOfWork.Flights.Update(flight);

                booking.TotalAmount = flight.Price * bookingDto.NumberOfGuests;
            }
            else if (booking.BookingType == BookingType.Hotel)
            {
                if (!bookingDto.HotelId.HasValue || !bookingDto.CheckInDate.HasValue || !bookingDto.CheckOutDate.HasValue)
                {
                    throw new BadRequestException("Hotel ID, Check-in, and Check-out dates are required for a hotel booking.");
                }

                var hotel = await _unitOfWork.Hotels.GetByIdAsync(bookingDto.HotelId.Value);
                if (hotel == null)
                {
                    throw new NotFoundException(nameof(Hotel), bookingDto.HotelId.Value);
                }

                if (hotel.AvailableRooms < 1)
                {
                    throw new BadRequestException("No rooms available at this hotel.");
                }

                // Reserve room
                hotel.AvailableRooms -= 1;
                _unitOfWork.Hotels.Update(hotel);

                var nights = (bookingDto.CheckOutDate.Value.Date - bookingDto.CheckInDate.Value.Date).Days;
                if (nights <= 0)
                {
                    throw new BadRequestException("Check-out date must be at least one day after Check-in date.");
                }

                booking.TotalAmount = hotel.PricePerNight * nights;
            }

            await _unitOfWork.Bookings.AddAsync(booking);
            await _unitOfWork.CompleteAsync();

            _logger.LogInformation("Successfully created booking {BookingId}", booking.Id);

            // Fetch fully populated booking object for return DTO
            var details = await _unitOfWork.Bookings.GetBookingDetailsAsync(booking.Id);
            return _mapper.Map<BookingDto>(details);
        }

        public async Task<BookingDto?> GetBookingByIdAsync(Guid id, Guid userId, string role)
        {
            var booking = await _unitOfWork.Bookings.GetBookingDetailsAsync(id);
            if (booking == null)
            {
                throw new NotFoundException(nameof(Booking), id);
            }

            // Authorization check: User can only see their own booking unless they are Admin
            if (role != "Admin" && booking.UserId != userId)
            {
                throw new UnauthorizedException("You are not authorized to view this booking.");
            }

            return _mapper.Map<BookingDto>(booking);
        }

        public async Task<IEnumerable<BookingDto>> GetUserBookingsAsync(Guid userId)
        {
            var bookings = await _unitOfWork.Bookings.GetUserBookingsAsync(userId);
            return _mapper.Map<IEnumerable<BookingDto>>(bookings);
        }

        public async Task CancelBookingAsync(Guid id, Guid userId, string role)
        {
            _logger.LogInformation("Cancelling booking {BookingId} requested by User: {User}", id, userId);

            var booking = await _unitOfWork.Bookings.GetBookingDetailsAsync(id);
            if (booking == null)
            {
                throw new NotFoundException(nameof(Booking), id);
            }

            // Authorization check
            if (role != "Admin" && booking.UserId != userId)
            {
                throw new UnauthorizedException("You are not authorized to cancel this booking.");
            }

            if (booking.BookingStatus == BookingStatus.Cancelled)
            {
                throw new BadRequestException("Booking is already cancelled.");
            }

            // Restore seats/rooms
            if (booking.BookingType == BookingType.Flight && booking.FlightId.HasValue)
            {
                var flight = await _unitOfWork.Flights.GetByIdAsync(booking.FlightId.Value);
                if (flight != null)
                {
                    flight.AvailableSeats += booking.NumberOfGuests;
                    _unitOfWork.Flights.Update(flight);
                }
            }
            else if (booking.BookingType == BookingType.Hotel && booking.HotelId.HasValue)
            {
                var hotel = await _unitOfWork.Hotels.GetByIdAsync(booking.HotelId.Value);
                if (hotel != null)
                {
                    hotel.AvailableRooms += 1;
                    _unitOfWork.Hotels.Update(hotel);
                }
            }

            booking.BookingStatus = BookingStatus.Cancelled;
            _unitOfWork.Bookings.Update(booking);
            await _unitOfWork.CompleteAsync();

            _logger.LogInformation("Successfully cancelled booking {BookingId}", id);
        }

        public async Task<IEnumerable<BookingDto>> GetAllBookingsAsync()
        {
            var bookings = await _unitOfWork.Bookings.GetAllBookingsWithDetailsAsync();
            return _mapper.Map<IEnumerable<BookingDto>>(bookings);
        }
    }
}
