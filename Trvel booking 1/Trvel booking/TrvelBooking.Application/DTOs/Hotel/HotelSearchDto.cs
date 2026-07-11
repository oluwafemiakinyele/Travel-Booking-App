namespace TrvelBooking.Application.DTOs.Hotel
{
    public class HotelSearchDto
    {
        public string? City { get; set; }
        public decimal? MaxPricePerNight { get; set; }
        public double? MinRating { get; set; }
    }
}
