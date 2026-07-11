using System.Threading.Tasks;
using TrvelBooking.Domain.Entities;

namespace TrvelBooking.Application.Interfaces.IRepositories
{
    public interface IPaymentRepository : IGenericRepository<Payment>
    {
        Task<Payment?> GetByReferenceAsync(string reference);
    }
}
