using System.Collections.Generic;
using TrvelBooking.Application.DTOs.Booking;

namespace TrvelBooking.Application.DTOs.Admin
{
    public class AdminDashboardDto
    {
        public int TotalBookings { get; set; }
        public int TotalUsers { get; set; }
        public decimal TotalRevenue { get; set; }
        public int FlightBookingsCount { get; set; }
        public int HotelBookingsCount { get; set; }
        public List<BookingDto> RecentBookings { get; set; } = new List<BookingDto>();
    }
}
