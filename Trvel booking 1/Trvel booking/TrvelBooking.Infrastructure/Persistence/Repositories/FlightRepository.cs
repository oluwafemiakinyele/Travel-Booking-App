using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TrvelBooking.Application.Interfaces.IRepositories;
using TrvelBooking.Domain.Entities;

namespace TrvelBooking.Infrastructure.Persistence.Repositories
{
    public class FlightRepository : GenericRepository<Flight>, IFlightRepository
    {
        public FlightRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Flight>> SearchFlightsAsync(
            string? departureCity, 
            string? arrivalCity, 
            DateTime? departureDate, 
            decimal? maxPrice)
        {
            var query = _context.Flights.AsQueryable();

            if (!string.IsNullOrWhiteSpace(departureCity))
            {
                query = query.Where(f => f.DepartureCity.ToLower().Contains(departureCity.ToLower()));
            }

            if (!string.IsNullOrWhiteSpace(arrivalCity))
            {
                query = query.Where(f => f.ArrivalCity.ToLower().Contains(arrivalCity.ToLower()));
            }

            if (departureDate.HasValue)
            {
                var targetDate = departureDate.Value.Date;
                query = query.Where(f => f.DepartureTime.Date == targetDate);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(f => f.Price <= maxPrice.Value);
            }

            // Only show flights with available seats and Scheduled status by default
            query = query.Where(f => f.AvailableSeats > 0 && f.Status == "Scheduled");

            return await query.ToListAsync();
        }
    }
}
