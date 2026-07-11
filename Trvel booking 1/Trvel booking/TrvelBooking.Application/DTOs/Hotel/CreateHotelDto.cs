using System.Collections.Generic;

namespace TrvelBooking.Application.DTOs.Hotel
{
    public class CreateHotelDto
    {
        public string Name { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal PricePerNight { get; set; }
        public int AvailableRooms { get; set; }
        public double Rating { get; set; }
        public List<string> Images { get; set; } = new List<string>();
    }
}
