using AutoMapper;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TrvelBooking.Application.DTOs.Auth;
using TrvelBooking.Application.Exceptions;
using TrvelBooking.Application.Interfaces.IRepositories;
using TrvelBooking.Application.Interfaces.IServices;
using TrvelBooking.Application.Services;
using TrvelBooking.Application.Services.Helpers;
using TrvelBooking.Domain.Entities;
using TrvelBooking.Domain.Enums;
using Xunit;

namespace TrvelBooking.Tests
{
    public class AuthServiceTests
    {
        private readonly Mock<IUnitOfWork> _mockUow;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<ITokenService> _mockTokenService;
        private readonly Mock<ILogger<AuthService>> _mockLogger;
        private readonly AuthService _authService;

        public AuthServiceTests()
        {
            _mockUow = new Mock<IUnitOfWork>();
            _mockMapper = new Mock<IMapper>();
            _mockTokenService = new Mock<ITokenService>();
            _mockLogger = new Mock<ILogger<AuthService>>();
            _authService = new AuthService(_mockUow.Object, _mockMapper.Object, _mockTokenService.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task RegisterAsync_ShouldThrowBadRequestException_WhenEmailAlreadyExists()
        {
            // Arrange
            var registerDto = new RegisterDto { Email = "test@user.com", Password = "Password@123" };
            var existingUser = new User { Email = "test@user.com" };

            _mockUow.Setup(u => u.Users.GetByEmailAsync(registerDto.Email))
                .ReturnsAsync(existingUser);

            // Act & Assert
            await Assert.ThrowsAsync<BadRequestException>(() => _authService.RegisterAsync(registerDto));
        }

        [Fact]
        public async Task RegisterAsync_ShouldCreateUser_WhenEmailIsNew()
        {
            // Arrange
            var registerDto = new RegisterDto 
            { 
                FirstName = "John", 
                LastName = "Doe", 
                Email = "john@new.com", 
                Password = "Password@123",
                PhoneNumber = "+1234567890"
            };
            var user = new User { Email = "john@new.com" };
            var userDto = new UserDto { Email = "john@new.com" };

            _mockUow.Setup(u => u.Users.GetByEmailAsync(registerDto.Email))
                .ReturnsAsync((User?)null);
            
            _mockUow.Setup(u => u.Users.GetAllAsync())
                .ReturnsAsync(new List<User> { new User() }); // non-empty, so Customer role

            _mockMapper.Setup(m => m.Map<User>(registerDto))
                .Returns(user);

            _mockMapper.Setup(m => m.Map<UserDto>(user))
                .Returns(userDto);

            // Act
            var result = await _authService.RegisterAsync(registerDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("john@new.com", result.Email);
            _mockUow.Verify(u => u.Users.AddAsync(user), Times.Once);
            _mockUow.Verify(u => u.CompleteAsync(), Times.Once);
        }
    }
}
