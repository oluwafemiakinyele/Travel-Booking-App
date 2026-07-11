using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TrvelBooking.Application.Interfaces.IRepositories;
using TrvelBooking.Domain.Entities;

namespace TrvelBooking.Infrastructure.Persistence.Repositories
{
    public class HotelRepository : GenericRepository<Hotel>, IHotelRepository
    {
        public HotelRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Hotel>> SearchHotelsAsync(
            string? city, 
            decimal? maxPricePerNight, 
            double? minRating)
        {
            var query = _context.Hotels.AsQueryable();

            if (!string.IsNullOrWhiteSpace(city))
            {
                query = query.Where(h => h.City.ToLower().Contains(city.ToLower()));
            }

            if (maxPricePerNight.HasValue)
            {
                query = query.Where(h => h.PricePerNight <= maxPricePerNight.Value);
            }

            if (minRating.HasValue)
            {
                query = query.Where(h => h.Rating >= minRating.Value);
            }

            // Only show hotels with available rooms
            query = query.Where(h => h.AvailableRooms > 0);

            return await query.ToListAsync();
        }
    }
}
