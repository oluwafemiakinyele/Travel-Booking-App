using System;

namespace TrvelBooking.Application.DTOs.Payment
{
    public class PaymentVerifyResultDto
    {
        public string Reference { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime TransactionDate { get; set; }
        public Guid BookingId { get; set; }
    }
}
