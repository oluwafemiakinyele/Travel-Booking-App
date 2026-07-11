using System;

namespace TrvelBooking.Application.DTOs.Payment
{
    public class PaymentInitializeDto
    {
        public Guid BookingId { get; set; }
        public string CallbackUrl { get; set; } = string.Empty;
    }
}
