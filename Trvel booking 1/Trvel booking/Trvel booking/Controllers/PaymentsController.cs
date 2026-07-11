using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using TrvelBooking.Application.DTOs.Payment;
using TrvelBooking.Application.Interfaces.IServices;

namespace Trvel_booking.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [Authorize]
        [HttpPost("initialize")]
        public async Task<IActionResult> Initialize([FromBody] PaymentInitializeDto initializeDto)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            var result = await _paymentService.InitializePaymentAsync(userId, initializeDto);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("verify/{reference}")]
        public async Task<IActionResult> Verify(string reference)
        {
            var result = await _paymentService.VerifyPaymentAsync(reference);
            return Ok(result);
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> PaystackWebhook()
        {
            var signature = Request.Headers["x-paystack-signature"].ToString();
            
            using var reader = new StreamReader(Request.Body);
            var payload = await reader.ReadToEndAsync();

            await _paymentService.ProcessWebhookAsync(payload, signature);
            return Ok();
        }
    }
}
