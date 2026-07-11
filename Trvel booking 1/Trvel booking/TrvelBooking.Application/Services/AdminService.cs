using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TrvelBooking.Application.DTOs.Admin;
using TrvelBooking.Application.DTOs.Auth;
using TrvelBooking.Application.DTOs.Booking;
using TrvelBooking.Application.Exceptions;
using TrvelBooking.Application.Interfaces.IRepositories;
using TrvelBooking.Application.Interfaces.IServices;
using TrvelBooking.Domain.Enums;

namespace TrvelBooking.Application.Services
{
    public class AdminService : IAdminService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AdminService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<AdminDashboardDto> GetDashboardStatsAsync()
        {
            var bookings = await _unitOfWork.Bookings.GetAllBookingsWithDetailsAsync();
            var users = await _unitOfWork.Users.GetAllAsync();
            var payments = await _unitOfWork.Payments.GetAllAsync();

            var successfulPayments = payments.Where(p => p.PaymentStatus == PaymentStatus.Successful);
            var totalRevenue = successfulPayments.Sum(p => p.Amount);

            var flightBookingsCount = bookings.Count(b => b.BookingType == BookingType.Flight);
            var hotelBookingsCount = bookings.Count(b => b.BookingType == BookingType.Hotel);

            var recentBookings = bookings.Take(5);

            return new AdminDashboardDto
            {
                TotalBookings = bookings.Count(),
                TotalUsers = users.Count(),
                TotalRevenue = totalRevenue,
                FlightBookingsCount = flightBookingsCount,
                HotelBookingsCount = hotelBookingsCount,
                RecentBookings = _mapper.Map<List<BookingDto>>(recentBookings)
            };
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _unitOfWork.Users.GetAllAsync();
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task UpdateUserRoleAsync(Guid userId, string newRole)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
            {
                throw new NotFoundException("User not found.");
            }

            if (!Enum.TryParse<UserRole>(newRole, true, out var roleEnum))
            {
                throw new BadRequestException($"Invalid role name '{newRole}'. Allowed roles: Admin, Customer");
            }

            user.Role = roleEnum;
            _unitOfWork.Users.Update(user);
            await _unitOfWork.CompleteAsync();
        }
    }
}
