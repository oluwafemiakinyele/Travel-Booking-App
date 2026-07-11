using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using TrvelBooking.Application.Interfaces.IExternal;

namespace TrvelBooking.Infrastructure.Services.External
{
    public class HotelProviderService : IHotelProviderService
    {
        private readonly HttpClient _httpClient;

        public HotelProviderService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public Task<IEnumerable<ExternalHotelOffer>> GetHotelsInCityAsync(string city)
        {
            // For this project, we simulate an external Hotel Provider API.
            // We return realistic hotels based on the queried city.
            var cityLower = city.ToLower();
            var offers = new List<ExternalHotelOffer>();

            if (cityLower.Contains("lagos"))
            {
                offers.Add(new ExternalHotelOffer
                {
                    Name = "The Eko Hotels & Suites",
                    City = "Lagos",
                    Address = "Plot 1415 Adetokunbo Ademola Street, Victoria Island",
                    Description = "A luxurious 5-star hotel in the heart of Victoria Island, featuring grand pools, multi-cuisine restaurants, and beautiful ocean views.",
                    PricePerNight = 150.00m,
                    Rating = 4.7,
                    Images = new List<string> { "https://example.com/eko1.jpg", "https://example.com/eko2.jpg" }
                });
                offers.Add(new ExternalHotelOffer
                {
                    Name = "Radisson Blu Anchorage Hotel",
                    City = "Lagos",
                    Address = "1a Ozumba Mbadiwe Avenue, Victoria Island",
                    Description = "Situated on the banks of the upscale Lagos Lagoon, this hotel features gorgeous scenery, a fitness center, and free high-speed Wi-Fi.",
                    PricePerNight = 120.00m,
                    Rating = 4.4,
                    Images = new List<string> { "https://example.com/radisson1.jpg" }
                });
            }
            else if (cityLower.Contains("abuja"))
            {
                offers.Add(new ExternalHotelOffer
                {
                    Name = "Transcorp Hilton Abuja",
                    City = "Abuja",
                    Address = "1 Aguiyi Ironsi Street, Maitama",
                    Description = "Set in beautifully landscaped gardens, this landmark hotel offers an outdoor pool, tennis courts, and 24-hour business facilities.",
                    PricePerNight = 200.00m,
                    Rating = 4.8,
                    Images = new List<string> { "https://example.com/hilton1.jpg", "https://example.com/hilton2.jpg" }
                });
                offers.Add(new ExternalHotelOffer
                {
                    Name = "Sheraton Abuja Hotel",
                    City = "Abuja",
                    Address = "Ladi Kwali Street, Wuse Zone 4",
                    Description = "A warm, welcoming place in central Abuja with excellent dining choices, sports facilities, and friendly hospitality.",
                    PricePerNight = 130.00m,
                    Rating = 4.2,
                    Images = new List<string> { "https://example.com/sheraton1.jpg" }
                });
            }
            else
            {
                // Generic fallback for any other city
                var cityName = char.ToUpper(city[0]) + city[1..].ToLower();
                offers.Add(new ExternalHotelOffer
                {
                    Name = $"{cityName} Grand Plaza Hotel",
                    City = cityName,
                    Address = $"10 Main Avenue, {cityName}",
                    Description = $"The leading luxury hotel in {cityName}, catering to both leisure and business travellers.",
                    PricePerNight = 95.00m,
                    Rating = 4.0,
                    Images = new List<string> { "https://example.com/generic1.jpg" }
                });
            }

            return Task.FromResult<IEnumerable<ExternalHotelOffer>>(offers);
        }
    }
}
