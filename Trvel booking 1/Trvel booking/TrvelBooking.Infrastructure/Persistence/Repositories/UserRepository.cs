using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using TrvelBooking.Application.Interfaces.IRepositories;
using TrvelBooking.Domain.Entities;

namespace TrvelBooking.Infrastructure.Persistence.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users
                .Include(u => u.RefreshTokens)
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
        }

        public async Task<User?> GetByRefreshTokenAsync(string token)
        {
            return await _context.Users
                .Include(u => u.RefreshTokens)
                .FirstOrDefaultAsync(u => u.RefreshTokens.Any(t => t.Token == token));
        }

        public async Task<User?> GetByPasswordResetTokenAsync(string token)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.PasswordResetToken == token);
        }
    }
}
