using AutoMapper;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TrvelBooking.Application.DTOs.Flight;
using TrvelBooking.Application.Exceptions;
using TrvelBooking.Application.Interfaces.IRepositories;
using TrvelBooking.Application.Interfaces.IServices;
using TrvelBooking.Application.Interfaces.IExternal;
using TrvelBooking.Domain.Entities;

namespace TrvelBooking.Application.Services
{
    public class FlightService : IFlightService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IAmadeusFlightService _externalFlightService;
        private readonly ILogger<FlightService> _logger;

        public FlightService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IAmadeusFlightService externalFlightService,
            ILogger<FlightService> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _externalFlightService = externalFlightService;
            _logger = logger;
        }

        public async Task<IEnumerable<FlightDto>> SearchFlightsAsync(FlightSearchDto searchDto)
        {
            _logger.LogInformation("Searching flights for Departure: {Dep}, Arrival: {Arr}", 
                searchDto.DepartureCity, searchDto.ArrivalCity);

            // 1. Search locally
            var localFlights = await _unitOfWork.Flights.SearchFlightsAsync(
                searchDto.DepartureCity, 
                searchDto.ArrivalCity, 
                searchDto.DepartureDate, 
                searchDto.MaxPrice);

            var flightsList = localFlights.ToList();

            // 2. If no local flights are found and departure/arrival cities are specified, query external Amadeus API
            if (!flightsList.Any() && !string.IsNullOrWhiteSpace(searchDto.DepartureCity) && !string.IsNullOrWhiteSpace(searchDto.ArrivalCity))
            {
                var depCode = MapCityToAirportCode(searchDto.DepartureCity);
                var arrCode = MapCityToAirportCode(searchDto.ArrivalCity);
                var depDate = searchDto.DepartureDate ?? DateTime.UtcNow.AddDays(7);

                _logger.LogInformation("No local flights found. Querying external Flight Provider API (Amadeus) for {DepCode} -> {ArrCode}", depCode, arrCode);

                var externalOffers = await _externalFlightService.SearchFlightOffersAsync(depCode, arrCode, depDate, 1);

                // Save external flight offers to local DB so they can be booked
                foreach (var offer in externalOffers)
                {
                    var flight = new Flight
                    {
                        Id = Guid.NewGuid(),
                        FlightNumber = offer.FlightNumber,
                        Airline = offer.Airline,
                        DepartureCity = searchDto.DepartureCity,
                        ArrivalCity = searchDto.ArrivalCity,
                        DepartureTime = offer.DepartureTime,
                        ArrivalTime = offer.ArrivalTime,
                        Price = offer.Price,
                        AvailableSeats = offer.AvailableSeats,
                        Status = "Scheduled"
                    };

                    // Check if flight number already exists in DB to prevent duplicate key errors
                    var exists = await _unitOfWork.Flights.FindAsync(f => f.FlightNumber == flight.FlightNumber);
                    if (!exists.Any())
                    {
                        await _unitOfWork.Flights.AddAsync(flight);
                        flightsList.Add(flight);
                    }
                }

                if (externalOffers.Any())
                {
                    await _unitOfWork.CompleteAsync();
                }
            }

            // Apply price filter if we got external flights that exceeded max price
            var result = flightsList.AsQueryable();
            if (searchDto.MaxPrice.HasValue)
            {
                result = result.Where(f => f.Price <= searchDto.MaxPrice.Value);
            }

            return _mapper.Map<IEnumerable<FlightDto>>(result);
        }

        public async Task<FlightDto?> GetFlightByIdAsync(Guid id)
        {
            var flight = await _unitOfWork.Flights.GetByIdAsync(id);
            if (flight == null)
            {
                throw new NotFoundException(nameof(Flight), id);
            }
            return _mapper.Map<FlightDto>(flight);
        }

        public async Task<FlightDto> CreateFlightAsync(CreateFlightDto flightDto)
        {
            // Verify flight number is unique
            var existing = await _unitOfWork.Flights.FindAsync(f => f.FlightNumber == flightDto.FlightNumber);
            if (existing.Any())
            {
                throw new BadRequestException($"Flight number '{flightDto.FlightNumber}' already exists.");
            }

            var flight = _mapper.Map<Flight>(flightDto);
            await _unitOfWork.Flights.AddAsync(flight);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<FlightDto>(flight);
        }

        public async Task<FlightDto> UpdateFlightAsync(Guid id, UpdateFlightDto flightDto)
        {
            var flight = await _unitOfWork.Flights.GetByIdAsync(id);
            if (flight == null)
            {
                throw new NotFoundException(nameof(Flight), id);
            }

            // If flight number is changing, verify the new one is unique
            if (flight.FlightNumber != flightDto.FlightNumber)
            {
                var existing = await _unitOfWork.Flights.FindAsync(f => f.FlightNumber == flightDto.FlightNumber);
                if (existing.Any())
                {
                    throw new BadRequestException($"Flight number '{flightDto.FlightNumber}' already exists.");
                }
            }

            _mapper.Map(flightDto, flight);
            _unitOfWork.Flights.Update(flight);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<FlightDto>(flight);
        }

        public async Task DeleteFlightAsync(Guid id)
        {
            var flight = await _unitOfWork.Flights.GetByIdAsync(id);
            if (flight == null)
            {
                throw new NotFoundException(nameof(Flight), id);
            }

            // Check if there are active bookings for this flight
            var bookings = await _unitOfWork.Bookings.FindAsync(b => b.FlightId == id);
            if (bookings.Any())
            {
                throw new BadRequestException("Cannot delete flight because it has associated bookings.");
            }

            _unitOfWork.Flights.Remove(flight);
            await _unitOfWork.CompleteAsync();
        }

        private static string MapCityToAirportCode(string city)
        {
            var clean = city.Trim().ToLower();
            return clean switch
            {
                "lagos" => "LOS",
                "abuja" => "ABV",
                "london" => "LHR",
                "new york" => "JFK",
                "paris" => "CDG",
                _ => clean.Length >= 3 ? clean[..3].ToUpper() : "LOS"
            };
        }
    }
}
