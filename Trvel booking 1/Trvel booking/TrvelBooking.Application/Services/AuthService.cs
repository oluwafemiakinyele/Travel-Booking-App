using AutoMapper;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using TrvelBooking.Application.DTOs.Auth;
using TrvelBooking.Application.Exceptions;
using TrvelBooking.Application.Interfaces.IRepositories;
using TrvelBooking.Application.Interfaces.IServices;
using TrvelBooking.Application.Services.Helpers;
using TrvelBooking.Domain.Entities;
using TrvelBooking.Domain.Enums;

namespace TrvelBooking.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ITokenService _tokenService;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ITokenService tokenService,
            ILogger<AuthService> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _tokenService = tokenService;
            _logger = logger;
        }

        public async Task<UserDto> RegisterAsync(RegisterDto registerDto)
        {
            var existingUser = await _unitOfWork.Users.GetByEmailAsync(registerDto.Email);
            if (existingUser != null)
            {
                throw new BadRequestException($"User with email '{registerDto.Email}' already exists.");
            }

            var user = _mapper.Map<User>(registerDto);
            user.PasswordHash = PasswordHasher.HashPassword(registerDto.Password);

            // First registered user becomes Admin, subsequent users are Customers
            var allUsers = await _unitOfWork.Users.GetAllAsync();
            if (!allUsers.Any())
            {
                user.Role = UserRole.Admin;
                _logger.LogInformation("No users found. Seeding first registered user '{Email}' as Admin.", user.Email);
            }
            else
            {
                user.Role = UserRole.Customer;
            }

            await _unitOfWork.Users.AddAsync(user);
            await _unitOfWork.CompleteAsync();

            _logger.LogInformation("Successfully registered user '{Email}'", user.Email);
            return _mapper.Map<UserDto>(user);
        }

        public async Task<TokenDto> LoginAsync(LoginDto loginDto)
        {
            var user = await _unitOfWork.Users.GetByEmailAsync(loginDto.Email);
            if (user == null || !PasswordHasher.VerifyPassword(loginDto.Password, user.PasswordHash))
            {
                throw new UnauthorizedException("Invalid email or password.");
            }

            var accessToken = _tokenService.GenerateAccessToken(user);
            var refreshTokenString = _tokenService.GenerateRefreshToken();

            var refreshToken = new RefreshToken
            {
                Token = refreshTokenString,
                Expires = DateTime.UtcNow.AddDays(7),
                UserId = user.Id
            };

            user.RefreshTokens.Add(refreshToken);
            await _unitOfWork.CompleteAsync();

            _logger.LogInformation("User '{Email}' logged in successfully.", user.Email);

            return new TokenDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshTokenString
            };
        }

        public async Task<TokenDto> RefreshTokenAsync(TokenDto tokenDto)
        {
            var principal = _tokenService.GetPrincipalFromExpiredToken(tokenDto.AccessToken);
            if (principal == null)
            {
                throw new BadRequestException("Invalid access token.");
            }

            var email = principal.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email))
            {
                throw new BadRequestException("Invalid token claims.");
            }

            var user = await _unitOfWork.Users.GetByEmailAsync(email);
            if (user == null)
            {
                throw new BadRequestException("User not found.");
            }

            var savedRefreshToken = user.RefreshTokens.FirstOrDefault(t => t.Token == tokenDto.RefreshToken);
            if (savedRefreshToken == null || !savedRefreshToken.IsActive)
            {
                throw new UnauthorizedException("Invalid or expired refresh token.");
            }

            // Revoke current refresh token
            savedRefreshToken.Revoked = DateTime.UtcNow;

            // Generate new pair
            var newAccessToken = _tokenService.GenerateAccessToken(user);
            var newRefreshTokenString = _tokenService.GenerateRefreshToken();

            var newRefreshToken = new RefreshToken
            {
                Token = newRefreshTokenString,
                Expires = DateTime.UtcNow.AddDays(7),
                UserId = user.Id
            };

            user.RefreshTokens.Add(newRefreshToken);
            await _unitOfWork.CompleteAsync();

            _logger.LogInformation("Refreshed access token for user '{Email}'", user.Email);

            return new TokenDto
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshTokenString
            };
        }

        public async Task ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto)
        {
            var user = await _unitOfWork.Users.GetByEmailAsync(forgotPasswordDto.Email);
            if (user == null)
            {
                throw new NotFoundException($"User with email '{forgotPasswordDto.Email}' not found.");
            }

            // Generate reset token
            var tokenBytes = RandomNumberGenerator.GetBytes(32);
            var resetToken = Convert.ToHexString(tokenBytes);

            user.PasswordResetToken = resetToken;
            user.ResetTokenExpires = DateTime.UtcNow.AddHours(2);

            await _unitOfWork.CompleteAsync();

            _logger.LogInformation("Password reset requested for '{Email}'. Token: {Token}. Expires: {Expires}", 
                user.Email, resetToken, user.ResetTokenExpires);

            // In production, we would send this token via Email
        }

        public async Task ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
        {
            var user = await _unitOfWork.Users.GetByEmailAsync(resetPasswordDto.Email);
            if (user == null)
            {
                throw new NotFoundException($"User with email '{resetPasswordDto.Email}' not found.");
            }

            if (user.PasswordResetToken != resetPasswordDto.Token || 
                user.ResetTokenExpires < DateTime.UtcNow)
            {
                throw new BadRequestException("Invalid or expired password reset token.");
            }

            user.PasswordHash = PasswordHasher.HashPassword(resetPasswordDto.NewPassword);
            user.PasswordResetToken = null;
            user.ResetTokenExpires = null;

            await _unitOfWork.CompleteAsync();
            _logger.LogInformation("Password successfully reset for user '{Email}'", user.Email);
        }

        public async Task ChangePasswordAsync(Guid userId, ChangePasswordDto changePasswordDto)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
            {
                throw new NotFoundException("User not found.");
            }

            if (!PasswordHasher.VerifyPassword(changePasswordDto.CurrentPassword, user.PasswordHash))
            {
                throw new BadRequestException("Current password is incorrect.");
            }

            user.PasswordHash = PasswordHasher.HashPassword(changePasswordDto.NewPassword);
            await _unitOfWork.CompleteAsync();

            _logger.LogInformation("Password changed for user '{Email}'", user.Email);
        }
    }
}
