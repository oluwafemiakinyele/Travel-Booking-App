using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TrvelBooking.Application.DTOs.Flight;
using TrvelBooking.Application.Interfaces.IServices;

namespace Trvel_booking.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FlightsController : ControllerBase
    {
        private readonly IFlightService _flightService;

        public FlightsController(IFlightService flightService)
        {
            _flightService = flightService;
        }

        [HttpGet]
        public async Task<IActionResult> Search([FromQuery] FlightSearchDto searchDto)
        {
            var results = await _flightService.SearchFlightsAsync(searchDto);
            return Ok(results);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _flightService.GetFlightByIdAsync(id);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateFlightDto flightDto)
        {
            var result = await _flightService.CreateFlightAsync(flightDto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateFlightDto flightDto)
        {
            var result = await _flightService.UpdateFlightAsync(id, flightDto);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _flightService.DeleteFlightAsync(id);
            return NoContent();
        }
    }
}
