using System;

namespace TrvelBooking.Application.DTOs.Flight
{
    public class FlightSearchDto
    {
        public string? DepartureCity { get; set; }
        public string? ArrivalCity { get; set; }
        public DateTime? DepartureDate { get; set; }
        public decimal? MaxPrice { get; set; }
    }
}
