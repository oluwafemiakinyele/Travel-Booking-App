using AutoMapper;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TrvelBooking.Application.DTOs.Booking;
using TrvelBooking.Application.Exceptions;
using TrvelBooking.Application.Interfaces.IRepositories;
using TrvelBooking.Application.Services;
using TrvelBooking.Domain.Entities;
using TrvelBooking.Domain.Enums;
using Xunit;

namespace TrvelBooking.Tests
{
    public class BookingServiceTests
    {
        private readonly Mock<IUnitOfWork> _mockUow;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<ILogger<BookingService>> _mockLogger;
        private readonly BookingService _bookingService;

        public BookingServiceTests()
        {
            _mockUow = new Mock<IUnitOfWork>();
            _mockMapper = new Mock<IMapper>();
            _mockLogger = new Mock<ILogger<BookingService>>();
            _bookingService = new BookingService(_mockUow.Object, _mockMapper.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task CreateBookingAsync_ShouldReserveSeats_WhenFlightBookingIsSuccessful()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var flightId = Guid.NewGuid();
            var createBookingDto = new CreateBookingDto
            {
                BookingType = "Flight",
                FlightId = flightId,
                NumberOfGuests = 2
            };

            var user = new User { Id = userId };
            var flight = new Flight
            {
                Id = flightId,
                Price = 100.00m,
                AvailableSeats = 5,
                Status = "Scheduled"
            };

            var booking = new Booking
            {
                UserId = userId,
                BookingType = BookingType.Flight,
                FlightId = flightId,
                NumberOfGuests = 2
            };

            _mockUow.Setup(u => u.Users.GetByIdAsync(userId))
                .ReturnsAsync(user);

            _mockUow.Setup(u => u.Flights.GetByIdAsync(flightId))
                .ReturnsAsync(flight);

            _mockMapper.Setup(m => m.Map<Booking>(createBookingDto))
                .Returns(booking);

            // Set up return details
            _mockUow.Setup(u => u.Bookings.GetBookingDetailsAsync(It.IsAny<Guid>()))
                .ReturnsAsync(booking);

            // Act
            await _bookingService.CreateBookingAsync(userId, createBookingDto);

            // Assert
            Assert.Equal(3, flight.AvailableSeats); // 5 - 2 = 3
            _mockUow.Verify(u => u.Flights.Update(flight), Times.Once);
            _mockUow.Verify(u => u.Bookings.AddAsync(booking), Times.Once);
            _mockUow.Verify(u => u.CompleteAsync(), Times.Once);
        }

        [Fact]
        public async Task CreateBookingAsync_ShouldThrowBadRequestException_WhenNotEnoughSeats()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var flightId = Guid.NewGuid();
            var createBookingDto = new CreateBookingDto
            {
                BookingType = "Flight",
                FlightId = flightId,
                NumberOfGuests = 10
            };

            var user = new User { Id = userId };
            var flight = new Flight
            {
                Id = flightId,
                AvailableSeats = 5
            };

            var booking = new Booking
            {
                UserId = userId,
                BookingType = BookingType.Flight,
                FlightId = flightId,
                NumberOfGuests = 10
            };

            _mockUow.Setup(u => u.Users.GetByIdAsync(userId))
                .ReturnsAsync(user);

            _mockUow.Setup(u => u.Flights.GetByIdAsync(flightId))
                .ReturnsAsync(flight);

            _mockMapper.Setup(m => m.Map<Booking>(createBookingDto))
                .Returns(booking);

            // Act & Assert
            await Assert.ThrowsAsync<BadRequestException>(() => _bookingService.CreateBookingAsync(userId, createBookingDto));
        }
    }
}
