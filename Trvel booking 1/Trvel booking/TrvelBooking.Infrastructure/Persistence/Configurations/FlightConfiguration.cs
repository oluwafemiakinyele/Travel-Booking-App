using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TrvelBooking.Domain.Entities;

namespace TrvelBooking.Infrastructure.Persistence.Configurations
{
    public class FlightConfiguration : IEntityTypeConfiguration<Flight>
    {
        public void Configure(EntityTypeBuilder<Flight> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.FlightNumber)
                .IsRequired()
                .HasMaxLength(20);

            builder.HasIndex(x => x.FlightNumber)
                .IsUnique();

            builder.Property(x => x.Airline)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(x => x.DepartureCity)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(x => x.ArrivalCity)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(x => x.Price)
                .HasPrecision(18, 2)
                .IsRequired();

            builder.Property(x => x.AvailableSeats)
                .IsRequired();

            builder.Property(x => x.Status)
                .IsRequired()
                .HasMaxLength(20);
        }
    }
}
