using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TrvelBooking.Application.Interfaces.IServices;

namespace Trvel_booking.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var stats = await _adminService.GetDashboardStatsAsync();
            return Ok(stats);
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _adminService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpPut("users/{id}/role")]
        public async Task<IActionResult> UpdateRole(Guid id, [FromBody] UpdateRoleModel model)
        {
            await _adminService.UpdateUserRoleAsync(id, model.Role);
            return Ok(new { message = $"User role successfully updated to {model.Role}." });
        }
    }

    public class UpdateRoleModel
    {
        public string Role { get; set; } = string.Empty;
    }
}
