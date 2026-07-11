using FluentValidation;
using TrvelBooking.Application.DTOs.Hotel;

namespace TrvelBooking.Application.Validators
{
    public class CreateHotelValidator : AbstractValidator<CreateHotelDto>
    {
        public CreateHotelValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Hotel name is required.");

            RuleFor(x => x.City)
                .NotEmpty().WithMessage("City is required.");

            RuleFor(x => x.Address)
                .NotEmpty().WithMessage("Address is required.");

            RuleFor(x => x.PricePerNight)
                .GreaterThan(0).WithMessage("Price per night must be greater than zero.");

            RuleFor(x => x.AvailableRooms)
                .GreaterThanOrEqualTo(0).WithMessage("Available rooms cannot be negative.");

            RuleFor(x => x.Rating)
                .InclusiveBetween(1, 5).WithMessage("Rating must be between 1 and 5.");
        }
    }
}
