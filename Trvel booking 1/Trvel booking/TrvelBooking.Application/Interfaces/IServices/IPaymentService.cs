using System;
using System.Threading.Tasks;
using TrvelBooking.Application.DTOs.Payment;

namespace TrvelBooking.Application.Interfaces.IServices
{
    public interface IPaymentService
    {
        Task<PaymentInitializeResultDto> InitializePaymentAsync(Guid userId, PaymentInitializeDto initializeDto);
        Task<PaymentVerifyResultDto> VerifyPaymentAsync(string reference);
        Task ProcessWebhookAsync(string payload, string signatureHeader);
    }
}
