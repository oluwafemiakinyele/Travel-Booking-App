using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using TrvelBooking.Application.Interfaces.IRepositories;
using TrvelBooking.Domain.Entities;

namespace TrvelBooking.Infrastructure.Persistence.Repositories
{
    public class PaymentRepository : GenericRepository<Payment>, IPaymentRepository
    {
        public PaymentRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Payment?> GetByReferenceAsync(string reference)
        {
            return await _context.Payments
                .Include(p => p.Booking)
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.PaystackReference == reference);
        }
    }
}
