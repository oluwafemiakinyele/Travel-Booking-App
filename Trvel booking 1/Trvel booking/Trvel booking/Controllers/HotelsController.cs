using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TrvelBooking.Application.DTOs.Hotel;
using TrvelBooking.Application.Interfaces.IServices;

namespace Trvel_booking.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HotelsController : ControllerBase
    {
        private readonly IHotelService _hotelService;

        public HotelsController(IHotelService hotelService)
        {
            _hotelService = hotelService;
        }

        [HttpGet]
        public async Task<IActionResult> Search([FromQuery] HotelSearchDto searchDto)
        {
            var results = await _hotelService.SearchHotelsAsync(searchDto);
            return Ok(results);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _hotelService.GetHotelByIdAsync(id);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateHotelDto hotelDto)
        {
            var result = await _hotelService.CreateHotelAsync(hotelDto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateHotelDto hotelDto)
        {
            var result = await _hotelService.UpdateHotelAsync(id, hotelDto);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _hotelService.DeleteHotelAsync(id);
            return NoContent();
        }
    }
}
