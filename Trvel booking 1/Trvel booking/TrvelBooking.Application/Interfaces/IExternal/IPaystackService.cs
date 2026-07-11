using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace TrvelBooking.Application.Interfaces.IExternal
{
    public interface IPaystackService
    {
        Task<PaystackInitializeResponse?> InitializeTransactionAsync(string email, decimal amount, string reference, string callbackUrl);
        Task<PaystackVerifyResponse?> VerifyTransactionAsync(string reference);
    }

    public class PaystackInitializeResponse
    {
        [JsonPropertyName("status")]
        public bool Status { get; set; }

        [JsonPropertyName("message")]
        public string Message { get; set; } = string.Empty;

        [JsonPropertyName("data")]
        public PaystackInitializeData Data { get; set; } = null!;
    }

    public class PaystackInitializeData
    {
        [JsonPropertyName("authorization_url")]
        public string AuthorizationUrl { get; set; } = string.Empty;

        [JsonPropertyName("access_code")]
        public string AccessCode { get; set; } = string.Empty;

        [JsonPropertyName("reference")]
        public string Reference { get; set; } = string.Empty;
    }

    public class PaystackVerifyResponse
    {
        [JsonPropertyName("status")]
        public bool Status { get; set; }

        [JsonPropertyName("message")]
        public string Message { get; set; } = string.Empty;

        [JsonPropertyName("data")]
        public PaystackVerifyData Data { get; set; } = null!;
    }

    public class PaystackVerifyData
    {
        [JsonPropertyName("reference")]
        public string Reference { get; set; } = string.Empty;

        [JsonPropertyName("amount")]
        public decimal Amount { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; } = string.Empty; // e.g. "success"

        [JsonPropertyName("gateway_response")]
        public string GatewayResponse { get; set; } = string.Empty;

        [JsonPropertyName("transaction_date")]
        public string TransactionDate { get; set; } = string.Empty;

        [JsonPropertyName("customer")]
        public PaystackCustomer Customer { get; set; } = null!;
    }

    public class PaystackCustomer
    {
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;
    }
}
