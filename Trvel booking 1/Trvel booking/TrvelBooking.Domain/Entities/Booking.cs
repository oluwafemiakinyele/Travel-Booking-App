using System;
using System.Collections.Generic;
using TrvelBooking.Domain.Enums;

namespace TrvelBooking.Domain.Entities
{
    public class Booking
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;

        public BookingType BookingType { get; set; }
        
        public Guid? FlightId { get; set; }
        public Flight? Flight { get; set; }

        public Guid? HotelId { get; set; }
        public Hotel? Hotel { get; set; }

        public DateTime? CheckInDate { get; set; }
        public DateTime? CheckOutDate { get; set; }
        
        public int NumberOfGuests { get; set; }
        public decimal TotalAmount { get; set; }
        public BookingStatus BookingStatus { get; set; } = BookingStatus.PendingPayment;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}
