using System;
using System.Collections.Generic;
using TrvelBooking.Domain.Enums;

namespace TrvelBooking.Domain.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public UserRole Role { get; set; } = UserRole.Customer;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string? PasswordResetToken { get; set; }
        public DateTime? ResetTokenExpires { get; set; }

        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}
