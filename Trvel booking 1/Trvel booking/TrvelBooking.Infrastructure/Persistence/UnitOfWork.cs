using System.Threading.Tasks;
using TrvelBooking.Application.Interfaces.IRepositories;
using TrvelBooking.Infrastructure.Persistence.Repositories;

namespace TrvelBooking.Infrastructure.Persistence
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
            Users = new UserRepository(_context);
            Flights = new FlightRepository(_context);
            Hotels = new HotelRepository(_context);
            Bookings = new BookingRepository(_context);
            Payments = new PaymentRepository(_context);
        }

        public IUserRepository Users { get; }
        public IFlightRepository Flights { get; }
        public IHotelRepository Hotels { get; }
        public IBookingRepository Bookings { get; }
        public IPaymentRepository Payments { get; }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
