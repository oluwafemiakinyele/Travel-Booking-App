using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Collections.Generic;
using System.Text.Json;
using TrvelBooking.Domain.Entities;

namespace TrvelBooking.Infrastructure.Persistence.Configurations
{
    public class HotelConfiguration : IEntityTypeConfiguration<Hotel>
    {
        public void Configure(EntityTypeBuilder<Hotel> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(150);

            builder.Property(x => x.City)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(x => x.Address)
                .IsRequired()
                .HasMaxLength(250);

            builder.Property(x => x.PricePerNight)
                .HasPrecision(18, 2)
                .IsRequired();

            // Store images as JSON string in PostgreSQL
            builder.Property(e => e.Images)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null!),
                    v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null!) ?? new List<string>()
                );
        }
    }
}
