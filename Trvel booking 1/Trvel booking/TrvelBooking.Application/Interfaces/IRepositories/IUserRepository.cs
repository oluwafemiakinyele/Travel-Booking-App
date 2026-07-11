using System.Threading.Tasks;
using TrvelBooking.Domain.Entities;

namespace TrvelBooking.Application.Interfaces.IRepositories
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByRefreshTokenAsync(string token);
        Task<User?> GetByPasswordResetTokenAsync(string token);
    }
}
