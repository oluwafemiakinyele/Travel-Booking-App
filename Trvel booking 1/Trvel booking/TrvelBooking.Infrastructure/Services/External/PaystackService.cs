using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using TrvelBooking.Application.Interfaces.IExternal;

namespace TrvelBooking.Infrastructure.Services.External
{
    public class PaystackService : IPaystackService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        private readonly ILogger<PaystackService> _logger;
        private readonly string _secretKey;

        public PaystackService(HttpClient httpClient, IConfiguration config, ILogger<PaystackService> logger)
        {
            _httpClient = httpClient;
            _config = config;
            _logger = logger;
            _secretKey = _config["Paystack:SecretKey"] ?? string.Empty;
        }

        public async Task<PaystackInitializeResponse?> InitializeTransactionAsync(
            string email, 
            decimal amount, 
            string reference, 
            string callbackUrl)
        {
            // Fallback to mock for testing if no key is configured or key is "dummy"
            if (string.IsNullOrWhiteSpace(_secretKey) || _secretKey.Equals("dummy", StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogWarning("Paystack secret key is missing or dummy. Using mock payment initialization.");
                return new PaystackInitializeResponse
                {
                    Status = true,
                    Message = "Mock Authorization URL initialized",
                    Data = new PaystackInitializeData
                    {
                        AuthorizationUrl = $"https://checkout.paystack.com/mock-checkout?reference={reference}",
                        AccessCode = "mock_access_code",
                        Reference = reference
                    }
                };
            }

            try
            {
                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _secretKey);
                
                // Paystack amounts are in kobo (lowest currency unit). So multiply amount by 100.
                var amountInKobo = (int)(amount * 100);

                var payload = new
                {
                    email = email,
                    amount = amountInKobo,
                    reference = reference,
                    callback_url = callbackUrl
                };

                var response = await _httpClient.PostAsJsonAsync("https://api.paystack.co/transaction/initialize", payload);

                if (!response.IsSuccessStatusCode)
                {
                    var errorMsg = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Paystack initialization failed: {Error}", errorMsg);
                    return null;
                }

                return await response.Content.ReadFromJsonAsync<PaystackInitializeResponse>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception during Paystack transaction initialization");
                return null;
            }
        }

        public async Task<PaystackVerifyResponse?> VerifyTransactionAsync(string reference)
        {
            // Fallback to mock for testing if no key is configured or key is "dummy"
            if (string.IsNullOrWhiteSpace(_secretKey) || _secretKey.Equals("dummy", StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogWarning("Paystack secret key is missing or dummy. Using mock payment verification.");
                
                // If reference starts with "fail_", simulate a failed payment
                var status = reference.StartsWith("fail_", StringComparison.OrdinalIgnoreCase) ? "failed" : "success";
                
                return new PaystackVerifyResponse
                {
                    Status = true,
                    Message = "Verification successful (Mock)",
                    Data = new PaystackVerifyData
                    {
                        Reference = reference,
                        Amount = 50000, // mock amount in kobo (500.00)
                        Status = status,
                        GatewayResponse = "Approved by Mock Gateway",
                        TransactionDate = DateTime.UtcNow.ToString("o"),
                        Customer = new PaystackCustomer { Email = "customer@mock.com" }
                    }
                };
            }

            try
            {
                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _secretKey);

                var response = await _httpClient.GetAsync($"https://api.paystack.co/transaction/verify/{reference}");

                if (!response.IsSuccessStatusCode)
                {
                    var errorMsg = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Paystack verification failed: {Error}", errorMsg);
                    return null;
                }

                return await response.Content.ReadFromJsonAsync<PaystackVerifyResponse>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception during Paystack transaction verification");
                return null;
            }
        }
    }
}
