using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TrvelBooking.Application.DTOs.Booking;

namespace TrvelBooking.Application.Interfaces.IServices
{
    public interface IBookingService
    {
        Task<BookingDto> CreateBookingAsync(Guid userId, CreateBookingDto bookingDto);
        Task<BookingDto?> GetBookingByIdAsync(Guid id, Guid userId, string role);
        Task<IEnumerable<BookingDto>> GetUserBookingsAsync(Guid userId);
        Task CancelBookingAsync(Guid id, Guid userId, string role);
        Task<IEnumerable<BookingDto>> GetAllBookingsAsync();
    }
}
