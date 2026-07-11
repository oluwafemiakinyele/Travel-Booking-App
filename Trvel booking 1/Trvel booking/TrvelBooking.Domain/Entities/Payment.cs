using System;
using TrvelBooking.Domain.Enums;

namespace TrvelBooking.Domain.Entities
{
    public class Payment
    {
        public Guid Id { get; set; }
        
        public Guid BookingId { get; set; }
        public Booking Booking { get; set; } = null!;

        public Guid UserId { get; set; }
        public User User { get; set; } = null!;

        public string PaystackReference { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
        public DateTime TransactionDate { get; set; } = DateTime.UtcNow;
    }
}
