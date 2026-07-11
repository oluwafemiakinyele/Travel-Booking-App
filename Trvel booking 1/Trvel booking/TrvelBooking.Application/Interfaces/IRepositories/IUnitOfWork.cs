using System;
using System.Threading.Tasks;

namespace TrvelBooking.Application.Interfaces.IRepositories
{
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository Users { get; }
        IFlightRepository Flights { get; }
        IHotelRepository Hotels { get; }
        IBookingRepository Bookings { get; }
        IPaymentRepository Payments { get; }
        Task<int> CompleteAsync();
    }
}
