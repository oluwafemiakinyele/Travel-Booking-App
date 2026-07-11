using FluentValidation;
using System;
using TrvelBooking.Application.DTOs.Flight;

namespace TrvelBooking.Application.Validators
{
    public class CreateFlightValidator : AbstractValidator<CreateFlightDto>
    {
        public CreateFlightValidator()
        {
            RuleFor(x => x.FlightNumber)
                .NotEmpty().WithMessage("Flight number is required.")
                .MaximumLength(20).WithMessage("Flight number must not exceed 20 characters.");

            RuleFor(x => x.Airline)
                .NotEmpty().WithMessage("Airline is required.");

            RuleFor(x => x.DepartureCity)
                .NotEmpty().WithMessage("Departure city is required.");

            RuleFor(x => x.ArrivalCity)
                .NotEmpty().WithMessage("Arrival city is required.");

            RuleFor(x => x.DepartureTime)
                .NotEmpty().WithMessage("Departure time is required.")
                .Must(x => x > DateTime.UtcNow).WithMessage("Departure time must be in the future.");

            RuleFor(x => x.ArrivalTime)
                .NotEmpty().WithMessage("Arrival time is required.")
                .Must((dto, arrivalTime) => arrivalTime > dto.DepartureTime)
                .WithMessage("Arrival time must be after departure time.");

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Price must be greater than zero.");

            RuleFor(x => x.AvailableSeats)
                .GreaterThan(0).WithMessage("Available seats must be greater than zero.");
        }
    }
}
