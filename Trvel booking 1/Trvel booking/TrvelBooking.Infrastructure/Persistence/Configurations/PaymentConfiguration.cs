using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TrvelBooking.Domain.Entities;

namespace TrvelBooking.Infrastructure.Persistence.Configurations
{
    public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.PaystackReference)
                .IsRequired()
                .HasMaxLength(100);

            builder.HasIndex(x => x.PaystackReference)
                .IsUnique();

            builder.Property(x => x.Amount)
                .HasPrecision(18, 2)
                .IsRequired();

            builder.Property(x => x.PaymentStatus)
                .HasConversion<string>()
                .IsRequired();

            // Relationships
            builder.HasOne(x => x.Booking)
                .WithMany(b => b.Payments)
                .HasForeignKey(x => x.BookingId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.User)
                .WithMany(u => u.Payments)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
