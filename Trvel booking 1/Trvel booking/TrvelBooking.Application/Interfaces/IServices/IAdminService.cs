using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TrvelBooking.Application.DTOs.Admin;
using TrvelBooking.Application.DTOs.Auth;

namespace TrvelBooking.Application.Interfaces.IServices
{
    public interface IAdminService
    {
        Task<AdminDashboardDto> GetDashboardStatsAsync();
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task UpdateUserRoleAsync(Guid userId, string newRole);
    }
}
