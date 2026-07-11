using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TrvelBooking.Domain.Entities;

namespace TrvelBooking.Application.Interfaces.IRepositories
{
    public interface IBookingRepository : IGenericRepository<Booking>
    {
        Task<Booking?> GetBookingDetailsAsync(Guid bookingId);
        Task<IEnumerable<Booking>> GetUserBookingsAsync(Guid userId);
        Task<IEnumerable<Booking>> GetAllBookingsWithDetailsAsync();
    }
}
