using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using TrvelBooking.Application.DTOs.Booking;
using TrvelBooking.Application.Interfaces.IServices;

namespace Trvel_booking.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingsController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBookingDto bookingDto)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            var result = await _bookingService.CreateBookingAsync(userId, bookingDto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            if (role == "Admin")
            {
                var allBookings = await _bookingService.GetAllBookingsAsync();
                return Ok(allBookings);
            }
            else
            {
                var userBookings = await _bookingService.GetUserBookingsAsync(userId);
                return Ok(userBookings);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId) || string.IsNullOrEmpty(role))
            {
                return Unauthorized();
            }

            var result = await _bookingService.GetBookingByIdAsync(id, userId, role);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Cancel(Guid id)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId) || string.IsNullOrEmpty(role))
            {
                return Unauthorized();
            }

            await _bookingService.CancelBookingAsync(id, userId, role);
            return NoContent();
        }
    }
}
