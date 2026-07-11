using FluentValidation;
using System;
using TrvelBooking.Application.DTOs.Booking;

namespace TrvelBooking.Application.Validators
{
    public class CreateBookingValidator : AbstractValidator<CreateBookingDto>
    {
        public CreateBookingValidator()
        {
            RuleFor(x => x.BookingType)
                .NotEmpty().WithMessage("Booking type is required.")
                .Must(x => x == "Flight" || x == "Hotel")
                .WithMessage("Booking type must be either 'Flight' or 'Hotel'.");

            RuleFor(x => x.NumberOfGuests)
                .GreaterThan(0).WithMessage("Number of guests must be at least 1.");

            // Flight Validation rules
            When(x => x.BookingType == "Flight", () =>
            {
                RuleFor(x => x.FlightId)
                    .NotEmpty().WithMessage("Flight ID is required for a flight booking.");

                RuleFor(x => x.HotelId)
                    .Empty().WithMessage("Hotel ID should be empty for a flight booking.");
                
                RuleFor(x => x.CheckInDate)
                    .Empty().WithMessage("Check-in date should be empty for a flight booking.");

                RuleFor(x => x.CheckOutDate)
                    .Empty().WithMessage("Check-out date should be empty for a flight booking.");
            });

            // Hotel Validation rules
            When(x => x.BookingType == "Hotel", () =>
            {
                RuleFor(x => x.HotelId)
                    .NotEmpty().WithMessage("Hotel ID is required for a hotel booking.");

                RuleFor(x => x.FlightId)
                    .Empty().WithMessage("Flight ID should be empty for a hotel booking.");

                RuleFor(x => x.CheckInDate)
                    .NotEmpty().WithMessage("Check-in date is required for a hotel booking.")
                    .Must(x => x >= DateTime.UtcNow.Date).WithMessage("Check-in date cannot be in the past.");

                RuleFor(x => x.CheckOutDate)
                    .NotEmpty().WithMessage("Check-out date is required for a hotel booking.")
                    .Must((dto, checkOutDate) => checkOutDate > dto.CheckInDate)
                    .WithMessage("Check-out date must be after check-in date.");
            });
        }
    }
}
