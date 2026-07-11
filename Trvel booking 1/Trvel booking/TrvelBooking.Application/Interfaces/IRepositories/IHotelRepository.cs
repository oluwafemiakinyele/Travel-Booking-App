using System.Collections.Generic;
using System.Threading.Tasks;
using TrvelBooking.Domain.Entities;

namespace TrvelBooking.Application.Interfaces.IRepositories
{
    public interface IHotelRepository : IGenericRepository<Hotel>
    {
        Task<IEnumerable<Hotel>> SearchHotelsAsync(string? city, decimal? maxPricePerNight, double? minRating);
    }
}
