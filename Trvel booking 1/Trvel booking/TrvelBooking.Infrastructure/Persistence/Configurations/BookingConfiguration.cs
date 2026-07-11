using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TrvelBooking.Domain.Entities;

namespace TrvelBooking.Infrastructure.Persistence.Configurations
{
    public class BookingConfiguration : IEntityTypeConfiguration<Booking>
    {
        public void Configure(EntityTypeBuilder<Booking> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.BookingType)
                .HasConversion<string>()
                .IsRequired();

            builder.Property(x => x.BookingStatus)
                .HasConversion<string>()
                .IsRequired();

            builder.Property(x => x.TotalAmount)
                .HasPrecision(18, 2)
                .IsRequired();

            // Relationships
            builder.HasOne(x => x.User)
                .WithMany(u => u.Bookings)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Flight)
                .WithMany(f => f.Bookings)
                .HasForeignKey(x => x.FlightId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Hotel)
                .WithMany(h => h.Bookings)
                .HasForeignKey(x => x.HotelId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
