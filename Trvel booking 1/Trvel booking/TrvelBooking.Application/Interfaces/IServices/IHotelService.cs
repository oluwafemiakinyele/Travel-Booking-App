using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TrvelBooking.Application.DTOs.Hotel;

namespace TrvelBooking.Application.Interfaces.IServices
{
    public interface IHotelService
    {
        Task<IEnumerable<HotelDto>> SearchHotelsAsync(HotelSearchDto searchDto);
        Task<HotelDto?> GetHotelByIdAsync(Guid id);
        Task<HotelDto> CreateHotelAsync(CreateHotelDto hotelDto);
        Task<HotelDto> UpdateHotelAsync(Guid id, UpdateHotelDto hotelDto);
        Task DeleteHotelAsync(Guid id);
    }
}
