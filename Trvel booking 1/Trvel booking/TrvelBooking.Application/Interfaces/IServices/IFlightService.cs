using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TrvelBooking.Application.DTOs.Flight;

namespace TrvelBooking.Application.Interfaces.IServices
{
    public interface IFlightService
    {
        Task<IEnumerable<FlightDto>> SearchFlightsAsync(FlightSearchDto searchDto);
        Task<FlightDto?> GetFlightByIdAsync(Guid id);
        Task<FlightDto> CreateFlightAsync(CreateFlightDto flightDto);
        Task<FlightDto> UpdateFlightAsync(Guid id, UpdateFlightDto flightDto);
        Task DeleteFlightAsync(Guid id);
    }
}
