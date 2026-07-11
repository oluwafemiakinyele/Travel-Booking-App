using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TrvelBooking.Application.Interfaces.IRepositories;
using TrvelBooking.Domain.Entities;

namespace TrvelBooking.Infrastructure.Persistence.Repositories
{
    public class BookingRepository : GenericRepository<Booking>, IBookingRepository
    {
        public BookingRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Booking?> GetBookingDetailsAsync(Guid bookingId)
        {
            return await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Flight)
                .Include(b => b.Hotel)
                .Include(b => b.Payments)
                .FirstOrDefaultAsync(b => b.Id == bookingId);
        }

        public async Task<IEnumerable<Booking>> GetUserBookingsAsync(Guid userId)
        {
            return await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Flight)
                .Include(b => b.Hotel)
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Booking>> GetAllBookingsWithDetailsAsync()
        {
            return await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Flight)
                .Include(b => b.Hotel)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }
    }
}
