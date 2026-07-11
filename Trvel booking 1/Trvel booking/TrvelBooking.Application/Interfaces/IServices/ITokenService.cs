using System.Security.Claims;
using TrvelBooking.Domain.Entities;

namespace TrvelBooking.Application.Interfaces.IServices
{
    public interface ITokenService
    {
        string GenerateAccessToken(User user);
        string GenerateRefreshToken();
        ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
    }
}
