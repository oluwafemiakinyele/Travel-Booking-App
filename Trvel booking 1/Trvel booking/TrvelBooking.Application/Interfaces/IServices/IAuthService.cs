using System;
using System.Threading.Tasks;
using TrvelBooking.Application.DTOs.Auth;

namespace TrvelBooking.Application.Interfaces.IServices
{
    public interface IAuthService
    {
        Task<UserDto> RegisterAsync(RegisterDto registerDto);
        Task<TokenDto> LoginAsync(LoginDto loginDto);
        Task<TokenDto> RefreshTokenAsync(TokenDto tokenDto);
        Task ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto);
        Task ResetPasswordAsync(ResetPasswordDto resetPasswordDto);
        Task ChangePasswordAsync(Guid userId, ChangePasswordDto changePasswordDto);
    }
}
