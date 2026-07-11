using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using TrvelBooking.Application.Exceptions;

namespace Trvel_booking.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred during request processing.");
                await HandleExceptionAsync(httpContext, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            var statusCode = (int)HttpStatusCode.InternalServerError;
            var message = "An internal server error occurred.";

            switch (exception)
            {
                case NotFoundException notFoundEx:
                    statusCode = (int)HttpStatusCode.NotFound;
                    message = notFoundEx.Message;
                    break;
                case BadRequestException badRequestEx:
                    statusCode = (int)HttpStatusCode.BadRequest;
                    message = badRequestEx.Message;
                    break;
                case UnauthorizedException unauthorizedEx:
                    statusCode = (int)HttpStatusCode.Unauthorized;
                    message = unauthorizedEx.Message;
                    break;
            }

            context.Response.StatusCode = statusCode;

            var result = JsonSerializer.Serialize(new
            {
                statusCode = statusCode,
                message = message,
                detailed = context.Response.StatusCode == 500 ? exception.StackTrace : null
            });

            return context.Response.WriteAsync(result);
        }
    }
}
