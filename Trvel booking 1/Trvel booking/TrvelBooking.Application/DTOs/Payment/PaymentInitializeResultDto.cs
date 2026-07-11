namespace TrvelBooking.Application.DTOs.Payment
{
    public class PaymentInitializeResultDto
    {
        public string AuthorizationUrl { get; set; } = string.Empty;
        public string Reference { get; set; } = string.Empty;
        public string AccessCode { get; set; } = string.Empty;
    }
}
