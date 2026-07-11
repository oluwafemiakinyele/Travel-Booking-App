using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using TrvelBooking.Application.DTOs.Payment;
using TrvelBooking.Application.Exceptions;
using TrvelBooking.Application.Interfaces.IRepositories;
using TrvelBooking.Application.Interfaces.IServices;
using TrvelBooking.Application.Interfaces.IExternal;
using TrvelBooking.Domain.Entities;
using TrvelBooking.Domain.Enums;

namespace TrvelBooking.Application.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPaystackService _paystackService;
        private readonly IConfiguration _config;
        private readonly ILogger<PaymentService> _logger;

        public PaymentService(
            IUnitOfWork unitOfWork,
            IPaystackService paystackService,
            IConfiguration config,
            ILogger<PaymentService> logger)
        {
            _unitOfWork = unitOfWork;
            _paystackService = paystackService;
            _config = config;
            _logger = logger;
        }

        public async Task<PaymentInitializeResultDto> InitializePaymentAsync(Guid userId, PaymentInitializeDto initializeDto)
        {
            var booking = await _unitOfWork.Bookings.GetBookingDetailsAsync(initializeDto.BookingId);
            if (booking == null)
            {
                throw new NotFoundException(nameof(Booking), initializeDto.BookingId);
            }

            if (booking.UserId != userId)
            {
                throw new UnauthorizedException("You are not authorized to pay for this booking.");
            }

            if (booking.BookingStatus != BookingStatus.PendingPayment)
            {
                throw new BadRequestException($"Payment cannot be initialized for a booking with status '{booking.BookingStatus}'.");
            }

            // Generate unique reference
            var reference = $"TRV-{booking.Id.ToString()[..8].ToUpper()}-{DateTime.UtcNow.Ticks.ToString()[^6..]}";
            
            _logger.LogInformation("Initializing Paystack payment for Booking {BookingId}, Reference {Ref}", booking.Id, reference);

            var paystackResponse = await _paystackService.InitializeTransactionAsync(
                booking.User.Email,
                booking.TotalAmount,
                reference,
                initializeDto.CallbackUrl
            );

            if (paystackResponse == null || !paystackResponse.Status)
            {
                throw new BadRequestException($"Paystack payment initialization failed: {paystackResponse?.Message ?? "Unknown error"}");
            }

            // Record pending payment in DB
            var payment = new Payment
            {
                Id = Guid.NewGuid(),
                BookingId = booking.Id,
                UserId = userId,
                PaystackReference = reference,
                Amount = booking.TotalAmount,
                PaymentStatus = PaymentStatus.Pending,
                TransactionDate = DateTime.UtcNow
            };

            await _unitOfWork.Payments.AddAsync(payment);
            await _unitOfWork.CompleteAsync();

            return new PaymentInitializeResultDto
            {
                AuthorizationUrl = paystackResponse.Data.AuthorizationUrl,
                Reference = reference,
                AccessCode = paystackResponse.Data.AccessCode
            };
        }

        public async Task<PaymentVerifyResultDto> VerifyPaymentAsync(string reference)
        {
            _logger.LogInformation("Verifying payment for Reference: {Ref}", reference);

            var payment = await _unitOfWork.Payments.GetByReferenceAsync(reference);
            if (payment == null)
            {
                throw new NotFoundException("Payment record not found for reference: " + reference);
            }

            // If already successful, return immediately
            if (payment.PaymentStatus == PaymentStatus.Successful)
            {
                return new PaymentVerifyResultDto
                {
                    Reference = payment.PaystackReference,
                    Amount = payment.Amount,
                    Status = payment.PaymentStatus.ToString(),
                    Message = "Payment has already been successfully verified.",
                    TransactionDate = payment.TransactionDate,
                    BookingId = payment.BookingId
                };
            }

            var paystackResponse = await _paystackService.VerifyTransactionAsync(reference);
            if (paystackResponse == null || !paystackResponse.Status)
            {
                throw new BadRequestException($"Paystack payment verification failed: {paystackResponse?.Message ?? "Unknown error"}");
            }

            var paystackStatus = paystackResponse.Data.Status.ToLower();
            if (paystackStatus == "success")
            {
                payment.PaymentStatus = PaymentStatus.Successful;
                payment.TransactionDate = DateTime.UtcNow;

                // Confirm booking
                var booking = await _unitOfWork.Bookings.GetByIdAsync(payment.BookingId);
                if (booking != null)
                {
                    booking.BookingStatus = BookingStatus.Confirmed;
                    _unitOfWork.Bookings.Update(booking);
                }

                _logger.LogInformation("Payment successful. Confirmed booking {BookingId}.", payment.BookingId);
            }
            else if (paystackStatus == "failed")
            {
                payment.PaymentStatus = PaymentStatus.Failed;
                payment.TransactionDate = DateTime.UtcNow;
                _logger.LogWarning("Payment failed for reference {Ref}.", reference);
            }

            _unitOfWork.Payments.Update(payment);
            await _unitOfWork.CompleteAsync();

            return new PaymentVerifyResultDto
            {
                Reference = payment.PaystackReference,
                Amount = payment.Amount,
                Status = payment.PaymentStatus.ToString(),
                Message = paystackResponse.Data.GatewayResponse,
                TransactionDate = payment.TransactionDate,
                BookingId = payment.BookingId
            };
        }

        public async Task ProcessWebhookAsync(string payload, string signatureHeader)
        {
            var webhookSecret = _config["Paystack:WebhookSecret"] ?? string.Empty;

            if (!string.IsNullOrWhiteSpace(signatureHeader) && !string.IsNullOrWhiteSpace(webhookSecret))
            {
                // Verify signature using HMACSHA512
                var keyBytes = Encoding.UTF8.GetBytes(webhookSecret);
                var payloadBytes = Encoding.UTF8.GetBytes(payload);
                using var hmac = new HMACSHA512(keyBytes);
                var hashBytes = hmac.ComputeHash(payloadBytes);
                var computedSignature = Convert.ToHexString(hashBytes).ToLower();

                if (computedSignature != signatureHeader.ToLower())
                {
                    _logger.LogWarning("Invalid Paystack Webhook Signature. Expected: {Expected}, Got: {Got}", computedSignature, signatureHeader);
                    throw new UnauthorizedException("Invalid webhook signature.");
                }
            }

            try
            {
                using var jsonDoc = JsonDocument.Parse(payload);
                var root = jsonDoc.RootElement;
                var eventName = root.GetProperty("event").GetString();

                if (eventName == "charge.success")
                {
                    var data = root.GetProperty("data");
                    var reference = data.GetProperty("reference").GetString();
                    
                    if (!string.IsNullOrEmpty(reference))
                    {
                        _logger.LogInformation("Paystack Webhook charge.success received for reference {Ref}", reference);
                        await VerifyPaymentAsync(reference);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing Paystack webhook");
            }
        }
    }
}
