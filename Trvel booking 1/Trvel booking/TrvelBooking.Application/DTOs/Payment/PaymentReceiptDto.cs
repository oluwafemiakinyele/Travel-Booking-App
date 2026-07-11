using System;

namespace TrvelBooking.Application.DTOs.Payment
{
    public class PaymentReceiptDto
    {
        public Guid ReceiptId { get; set; }
        public Guid BookingId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string BookingType { get; set; } = string.Empty;
        public decimal AmountPaid { get; set; }
        public string PaystackReference { get; set; } = string.Empty;
        public DateTime TransactionDate { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
