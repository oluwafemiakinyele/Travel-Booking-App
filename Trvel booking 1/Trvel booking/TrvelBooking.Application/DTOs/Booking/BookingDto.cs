using System;
using TrvelBooking.Application.DTOs.Auth;
using TrvelBooking.Application.DTOs.Flight;
using TrvelBooking.Application.DTOs.Hotel;

namespace TrvelBooking.Application.DTOs.Booking
{
    public class BookingDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public UserDto User { get; set; } = null!;
        
        public string BookingType { get; set; } = string.Empty;
        
        public Guid? FlightId { get; set; }
        public FlightDto? Flight { get; set; }

        public Guid? HotelId { get; set; }
        public HotelDto? Hotel { get; set; }

        public DateTime? CheckInDate { get; set; }
        public DateTime? CheckOutDate { get; set; }
        
        public int NumberOfGuests { get; set; }
        public decimal TotalAmount { get; set; }
        public string BookingStatus { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
