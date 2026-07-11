using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TrvelBooking.Domain.Entities;

namespace TrvelBooking.Application.Interfaces.IRepositories
{
    public interface IFlightRepository : IGenericRepository<Flight>
    {
        Task<IEnumerable<Flight>> SearchFlightsAsync(string? departureCity, string? arrivalCity, DateTime? departureDate, decimal? maxPrice);
    }
}
