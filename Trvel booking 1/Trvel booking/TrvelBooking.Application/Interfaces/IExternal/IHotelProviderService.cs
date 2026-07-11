using System.Collections.Generic;
using System.Threading.Tasks;

namespace TrvelBooking.Application.Interfaces.IExternal
{
    public interface IHotelProviderService
    {
        Task<IEnumerable<ExternalHotelOffer>> GetHotelsInCityAsync(string city);
    }

    public class ExternalHotelOffer
    {
        public string Name { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal PricePerNight { get; set; }
        public double Rating { get; set; }
        public List<string> Images { get; set; } = new List<string>();
    }
}
