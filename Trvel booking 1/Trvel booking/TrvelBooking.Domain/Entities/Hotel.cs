using System;
using System.Collections.Generic;

namespace TrvelBooking.Domain.Entities
{
    public class Hotel
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal PricePerNight { get; set; }
        public int AvailableRooms { get; set; }
        public double Rating { get; set; }
        
        // Primitive collection for images, which EF Core 9 natively maps to JSON in PostgreSQL
        public List<string> Images { get; set; } = new List<string>();

        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
