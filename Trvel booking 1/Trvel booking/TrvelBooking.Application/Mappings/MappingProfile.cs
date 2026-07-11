using AutoMapper;
using TrvelBooking.Application.DTOs.Auth;
using TrvelBooking.Application.DTOs.Flight;
using TrvelBooking.Application.DTOs.Hotel;
using TrvelBooking.Application.DTOs.Booking;
using TrvelBooking.Domain.Entities;
using TrvelBooking.Domain.Enums;
using System;

namespace TrvelBooking.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Auth Maps
            CreateMap<User, UserDto>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));
            CreateMap<RegisterDto, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => UserRole.Customer))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

            // Flight Maps
            CreateMap<Flight, FlightDto>();
            CreateMap<CreateFlightDto, Flight>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "Scheduled"));
            CreateMap<UpdateFlightDto, Flight>();

            // Hotel Maps
            CreateMap<Hotel, HotelDto>();
            CreateMap<CreateHotelDto, Hotel>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());
            CreateMap<UpdateHotelDto, Hotel>();

            // Booking Maps
            CreateMap<Booking, BookingDto>()
                .ForMember(dest => dest.BookingType, opt => opt.MapFrom(src => src.BookingType.ToString()))
                .ForMember(dest => dest.BookingStatus, opt => opt.MapFrom(src => src.BookingStatus.ToString()));
            
            CreateMap<CreateBookingDto, Booking>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.BookingType, opt => opt.MapFrom(src => Enum.Parse<BookingType>(src.BookingType, true)))
                .ForMember(dest => dest.BookingStatus, opt => opt.MapFrom(src => BookingStatus.PendingPayment))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));
        }
    }
}
