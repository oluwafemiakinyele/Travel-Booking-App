using System;

namespace TrvelBooking.Application.DTOs.Booking
{
    public class CreateBookingDto
    {
        public string BookingType { get; set; } = string.Empty; // "Flight" or "Hotel"
        
        // For flights
        public Guid? FlightId { get; set; }
        
        // For hotels
        public Guid? HotelId { get; set; }
        public DateTime? CheckInDate { get; set; }
        public DateTime? CheckOutDate { get; set; }
        
        public int NumberOfGuests { get; set; }
    }
}
