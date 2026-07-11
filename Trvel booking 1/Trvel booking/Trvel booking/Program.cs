using AutoMapper;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Trvel_booking.Middleware;
using TrvelBooking.Application.Interfaces.IRepositories;
using TrvelBooking.Application.Interfaces.IServices;
using TrvelBooking.Application.Interfaces.IExternal;
using TrvelBooking.Application.Mappings;
using TrvelBooking.Application.Services;
using TrvelBooking.Application.Services.Helpers;
using TrvelBooking.Application.Validators;
using TrvelBooking.Domain.Entities;
using TrvelBooking.Domain.Enums;
using TrvelBooking.Infrastructure.Persistence;
using TrvelBooking.Infrastructure.Services.Auth;
using TrvelBooking.Infrastructure.Services.External;

namespace Trvel_booking
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

            // Configure Serilog
            var configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .Build();

            Log.Logger = new LoggerConfiguration()
                .ReadFrom.Configuration(configuration)
                .CreateLogger();

            try
            {
                Log.Information("Starting Travel Booking REST API host...");
                var builder = WebApplication.CreateBuilder(args);

                // Use Serilog
                builder.Host.UseSerilog();

                // Add Database Service (PostgreSQL)
                var connectionString = GetConnectionString(builder.Configuration);
                
                builder.Services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseNpgsql(connectionString, b => b.MigrationsAssembly("Trvel booking"))
                           .ConfigureWarnings(warnings => warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning)));

                // Register Unit of Work
                builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

                // Register Application Services
                builder.Services.AddScoped<ITokenService, TokenService>();
                builder.Services.AddScoped<IAuthService, AuthService>();
                builder.Services.AddScoped<IFlightService, FlightService>();
                builder.Services.AddScoped<IHotelService, HotelService>();
                builder.Services.AddScoped<IBookingService, BookingService>();
                builder.Services.AddScoped<IPaymentService, PaymentService>();
                builder.Services.AddScoped<IAdminService, AdminService>();

                // Register HTTP clients for External API services
                builder.Services.AddHttpClient<IPaystackService, PaystackService>();
                builder.Services.AddHttpClient<IAmadeusFlightService, AmadeusFlightService>();
                builder.Services.AddHttpClient<IHotelProviderService, HotelProviderService>();

                // AutoMapper Configurations
                builder.Services.AddAutoMapper(cfg => {}, typeof(MappingProfile));

                // FluentValidation Configuration
                builder.Services.AddFluentValidationAutoValidation();
                builder.Services.AddValidatorsFromAssembly(typeof(RegisterValidator).Assembly);

                // Controllers
                builder.Services.AddControllers();

                // Configure CORS
                builder.Services.AddCors(options =>
                {
                    options.AddPolicy("AllowReactApp", policy =>
                    {
                        var allowedOrigins = new List<string> { "http://localhost:5173", "http://localhost:5174" };
                        var envOrigins = builder.Configuration["CORS_ALLOWED_ORIGINS"];
                        if (!string.IsNullOrEmpty(envOrigins))
                        {
                            allowedOrigins.AddRange(envOrigins.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(o => o.Trim()));
                        }

                        policy.WithOrigins(allowedOrigins.Distinct().ToArray())
                              .AllowAnyHeader()
                              .AllowAnyMethod()
                              .AllowCredentials();
                    });
                });

                // Configure JWT Authentication
                var jwtSettings = builder.Configuration.GetSection("JWT");
                var secret = jwtSettings["Secret"] ?? throw new InvalidOperationException("JWT Secret is not configured.");
                var key = Encoding.UTF8.GetBytes(secret);

                builder.Services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = jwtSettings["Issuer"],
                        ValidAudience = jwtSettings["Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ClockSkew = TimeSpan.Zero
                    };
                });

                // Configure Swagger UI with JWT Authorize
                builder.Services.AddEndpointsApiExplorer();
                builder.Services.AddSwaggerGen(c =>
                {
                    c.SwaggerDoc("v1", new OpenApiInfo 
                    { 
                        Title = "Travel Booking API", 
                        Version = "v1",
                        Description = "Production-ready travel booking API with flights, hotels, bookings, and Paystack integration."
                    });

                    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                    {
                        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\"",
                        Name = "Authorization",
                        In = ParameterLocation.Header,
                        Type = SecuritySchemeType.ApiKey,
                        Scheme = "Bearer"
                    });

                    c.AddSecurityRequirement(new OpenApiSecurityRequirement
                    {
                        {
                            new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "Bearer"
                                },
                                Scheme = "oauth2",
                                Name = "Bearer",
                                In = ParameterLocation.Header
                            },
                            new List<string>()
                        }
                    });
                });

                var app = builder.Build();

                // Apply Database Migrations and Seed Database
                await PrepareDatabaseAsync(app);

                // Configure HTTP request pipeline
                app.UseMiddleware<ExceptionMiddleware>();

                // Swagger is enabled in both Dev and Prod for ease of testing/reviewing
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Travel Booking API v1");
                    c.RoutePrefix = "swagger"; // Swagger UI at root /swagger
                });

                app.UseCors("AllowReactApp");

                app.UseHttpsRedirection();

                app.UseAuthentication();
                app.UseAuthorization();

                app.MapControllers();

                await app.RunAsync();
            }
            catch (HostAbortedException)
            {
                throw;
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "The Travel Booking REST API host terminated unexpectedly.");
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        private static string GetConnectionString(IConfiguration configuration)
        {
            var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
            if (string.IsNullOrEmpty(databaseUrl))
            {
                return configuration.GetConnectionString("DefaultConnection") 
                    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
            }

            try
            {
                var uri = new Uri(databaseUrl);
                var userInfo = uri.UserInfo.Split(':');
                var username = userInfo[0];
                var password = userInfo[1];
                var host = uri.Host;
                var port = uri.Port;
                var database = uri.AbsolutePath.TrimStart('/');

                return $"Host={host};Port={port};Database={database};Username={username};Password={password};SSL Mode=Require;Trust Server Certificate=true";
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Failed to parse DATABASE_URL environment variable.", ex);
            }
        }

        private static async Task PrepareDatabaseAsync(WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var services = scope.ServiceProvider;
            var logger = services.GetRequiredService<ILogger<Program>>();
            
            try
            {
                var context = services.GetRequiredService<ApplicationDbContext>();
                
                logger.LogInformation("Applying pending database migrations...");
                await context.Database.MigrateAsync();

                logger.LogInformation("Seeding database...");
                await SeedDatabaseAsync(context, logger);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while migrating or seeding the database.");
            }
        }

        private static async Task SeedDatabaseAsync(ApplicationDbContext context, Microsoft.Extensions.Logging.ILogger logger)
        {
            // 1. Seed Admin Account
            var adminEmail = "admin@travelbooking.com";
            var existingAdmin = await context.Users.AnyAsync(u => u.Email == adminEmail);
            if (!existingAdmin)
            {
                var admin = new User
                {
                    Id = Guid.NewGuid(),
                    FirstName = "System",
                    LastName = "Admin",
                    Email = adminEmail,
                    PasswordHash = PasswordHasher.HashPassword("Admin@123"),
                    PhoneNumber = "+1234567890",
                    Role = UserRole.Admin,
                    CreatedAt = DateTime.UtcNow
                };

                await context.Users.AddAsync(admin);
                logger.LogInformation("Admin user seeded: {Email}", adminEmail);
            }

            // 2. Seed / Update Flights in thousands of Naira
            var existingFlights = await context.Flights.ToListAsync();
            var targetFlights = new List<Flight>
            {
                new Flight
                {
                    FlightNumber = "KP 506",
                    Airline = "Asky Airlines",
                    DepartureCity = "Lagos",
                    ArrivalCity = "Abuja",
                    DepartureTime = DateTime.UtcNow.AddDays(3).Date.AddHours(8),
                    ArrivalTime = DateTime.UtcNow.AddDays(3).Date.AddHours(10),
                    Price = 180000.00m,
                    AvailableSeats = 10,
                    Status = "Scheduled"
                },
                new Flight
                {
                    FlightNumber = "AW 234",
                    Airline = "Africa World Airlines",
                    DepartureCity = "Lagos",
                    ArrivalCity = "Accra",
                    DepartureTime = DateTime.UtcNow.AddDays(5).Date.AddHours(14),
                    ArrivalTime = DateTime.UtcNow.AddDays(5).Date.AddHours(15).AddMinutes(30),
                    Price = 150000.00m,
                    AvailableSeats = 15,
                    Status = "Scheduled"
                },
                new Flight
                {
                    FlightNumber = "LH 568",
                    Airline = "Lufthansa",
                    DepartureCity = "Abuja",
                    ArrivalCity = "Frankfurt",
                    DepartureTime = DateTime.UtcNow.AddDays(7).Date.AddHours(22),
                    ArrivalTime = DateTime.UtcNow.AddDays(8).Date.AddHours(6).AddMinutes(15),
                    Price = 1850000.00m,
                    AvailableSeats = 5,
                    Status = "Scheduled"
                },
                new Flight
                {
                    FlightNumber = "P4 7110",
                    Airline = "Air Peace",
                    DepartureCity = "Lagos",
                    ArrivalCity = "Port Harcourt",
                    DepartureTime = DateTime.UtcNow.AddDays(4).Date.AddHours(9),
                    ArrivalTime = DateTime.UtcNow.AddDays(4).Date.AddHours(10).AddMinutes(15),
                    Price = 120000.00m,
                    AvailableSeats = 25,
                    Status = "Scheduled"
                },
                new Flight
                {
                    FlightNumber = "DA 320",
                    Airline = "Dana Air",
                    DepartureCity = "Abuja",
                    ArrivalCity = "Lagos",
                    DepartureTime = DateTime.UtcNow.AddDays(2).Date.AddHours(11),
                    ArrivalTime = DateTime.UtcNow.AddDays(2).Date.AddHours(12).AddMinutes(10),
                    Price = 130000.00m,
                    AvailableSeats = 18,
                    Status = "Scheduled"
                },
                new Flight
                {
                    FlightNumber = "AR 102",
                    Airline = "Arik Air",
                    DepartureCity = "Lagos",
                    ArrivalCity = "Enugu",
                    DepartureTime = DateTime.UtcNow.AddDays(6).Date.AddHours(13),
                    ArrivalTime = DateTime.UtcNow.AddDays(6).Date.AddHours(14),
                    Price = 140000.00m,
                    AvailableSeats = 12,
                    Status = "Scheduled"
                },
                new Flight
                {
                    FlightNumber = "VM 405",
                    Airline = "Max Air",
                    DepartureCity = "Kano",
                    ArrivalCity = "Lagos",
                    DepartureTime = DateTime.UtcNow.AddDays(3).Date.AddHours(16),
                    ArrivalTime = DateTime.UtcNow.AddDays(3).Date.AddHours(17).AddMinutes(30),
                    Price = 160000.00m,
                    AvailableSeats = 8,
                    Status = "Scheduled"
                },
                new Flight
                {
                    FlightNumber = "IB 201",
                    Airline = "Ibom Air",
                    DepartureCity = "Uyo",
                    ArrivalCity = "Abuja",
                    DepartureTime = DateTime.UtcNow.AddDays(5).Date.AddHours(7),
                    ArrivalTime = DateTime.UtcNow.AddDays(5).Date.AddHours(8).AddMinutes(15),
                    Price = 125000.00m,
                    AvailableSeats = 14,
                    Status = "Scheduled"
                },
                new Flight
                {
                    FlightNumber = "Q9 301",
                    Airline = "Green Africa Airways",
                    DepartureCity = "Lagos",
                    ArrivalCity = "Abuja",
                    DepartureTime = DateTime.UtcNow.AddDays(2).Date.AddHours(15),
                    ArrivalTime = DateTime.UtcNow.AddDays(2).Date.AddHours(16).AddMinutes(15),
                    Price = 95000.00m,
                    AvailableSeats = 22,
                    Status = "Scheduled"
                },
                new Flight
                {
                    FlightNumber = "OF 118",
                    Airline = "Overland Airways",
                    DepartureCity = "Abuja",
                    ArrivalCity = "Ilorin",
                    DepartureTime = DateTime.UtcNow.AddDays(4).Date.AddHours(10),
                    ArrivalTime = DateTime.UtcNow.AddDays(4).Date.AddHours(11).AddMinutes(5),
                    Price = 105000.00m,
                    AvailableSeats = 12,
                    Status = "Scheduled"
                },
                new Flight
                {
                    FlightNumber = "U5 502",
                    Airline = "United Nigeria Airlines",
                    DepartureCity = "Lagos",
                    ArrivalCity = "Enugu",
                    DepartureTime = DateTime.UtcNow.AddDays(3).Date.AddHours(12),
                    ArrivalTime = DateTime.UtcNow.AddDays(3).Date.AddHours(13).AddMinutes(15),
                    Price = 120000.00m,
                    AvailableSeats = 15,
                    Status = "Scheduled"
                },
                new Flight
                {
                    FlightNumber = "VJ 301",
                    Airline = "ValueJet",
                    DepartureCity = "Lagos",
                    ArrivalCity = "Abuja",
                    DepartureTime = DateTime.UtcNow.AddDays(5).Date.AddHours(17),
                    ArrivalTime = DateTime.UtcNow.AddDays(5).Date.AddHours(18).AddMinutes(15),
                    Price = 115000.00m,
                    AvailableSeats = 18,
                    Status = "Scheduled"
                },
                new Flight
                {
                    FlightNumber = "P4 7111",
                    Airline = "Air Peace",
                    DepartureCity = "Abuja",
                    ArrivalCity = "Lagos",
                    DepartureTime = DateTime.UtcNow.AddDays(4).Date.AddHours(18),
                    ArrivalTime = DateTime.UtcNow.AddDays(4).Date.AddHours(19).AddMinutes(15),
                    Price = 125000.00m,
                    AvailableSeats = 30,
                    Status = "Scheduled"
                },
                new Flight
                {
                    FlightNumber = "AR 103",
                    Airline = "Arik Air",
                    DepartureCity = "Abuja",
                    ArrivalCity = "Port Harcourt",
                    DepartureTime = DateTime.UtcNow.AddDays(6).Date.AddHours(10),
                    ArrivalTime = DateTime.UtcNow.AddDays(6).Date.AddHours(11).AddMinutes(15),
                    Price = 135000.00m,
                    AvailableSeats = 16,
                    Status = "Scheduled"
                }
            };

            foreach (var target in targetFlights)
            {
                var match = existingFlights.FirstOrDefault(f => f.FlightNumber == target.FlightNumber);
                if (match != null)
                {
                    match.Price = target.Price;
                    match.DepartureTime = target.DepartureTime;
                    match.ArrivalTime = target.ArrivalTime;
                    context.Flights.Update(match);
                }
                else
                {
                    target.Id = Guid.NewGuid();
                    await context.Flights.AddAsync(target);
                }
            }
            logger.LogInformation("Flights database seeded/updated.");

            // 3. Seed / Update Hotels in thousands of Naira
            var existingHotels = await context.Hotels.ToListAsync();
            var targetHotels = new List<Hotel>
            {
                new Hotel
                {
                    Name = "The Eko Hotels & Suites",
                    City = "Lagos",
                    Address = "Plot 1415 Adetokunbo Ademola Street, Victoria Island",
                    Description = "A luxurious 5-star hotel in Victoria Island with beautiful gardens, swimming pools, and standard rooms.",
                    PricePerNight = 150000.00m,
                    AvailableRooms = 10,
                    Rating = 4.7,
                    Images = new List<string> { "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80" }
                },
                new Hotel
                {
                    Name = "Transcorp Hilton Abuja",
                    City = "Abuja",
                    Address = "1 Aguiyi Ironsi Street, Maitama",
                    Description = "Set in landscaped gardens in Abuja, this modern hotel offers multi-cuisine restaurants, pools, and standard services.",
                    PricePerNight = 200000.00m,
                    AvailableRooms = 8,
                    Rating = 4.8,
                    Images = new List<string> { "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&auto=format&fit=crop&q=80" }
                },
                new Hotel
                {
                    Name = "Radisson Blu Anchorage Hotel",
                    City = "Lagos",
                    Address = "1a Ozumba Mbadiwe Avenue, Victoria Island",
                    Description = "Premium waterfront hotel offering modern rooms, outdoor pool, and scenic lagoon views.",
                    PricePerNight = 180000.00m,
                    AvailableRooms = 12,
                    Rating = 4.5,
                    Images = new List<string> { "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=80" }
                },
                new Hotel
                {
                    Name = "Swiss International The D'Angelis",
                    City = "Port Harcourt",
                    Address = "20/22 Swiss International Avenue, Port Harcourt",
                    Description = "A modern hotel in the heart of Port Harcourt with upscale suites and dining options.",
                    PricePerNight = 95000.00m,
                    AvailableRooms = 15,
                    Rating = 4.2,
                    Images = new List<string> { "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=80" }
                },
                new Hotel
                {
                    Name = "Bristol Palace Hotel",
                    City = "Kano",
                    Address = "54/56 Guda Abdullahi Road, Farm Centre, Kano",
                    Description = "Luxury hotel offering top-tier accommodations, outdoor swimming pool, and fine dining.",
                    PricePerNight = 110000.00m,
                    AvailableRooms = 10,
                    Rating = 4.4,
                    Images = new List<string> { "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80" }
                },
                new Hotel
                {
                    Name = "Ibom Icon Hotel & Golf Resort",
                    City = "Uyo",
                    Address = "Nwaniba Road, Uyo",
                    Description = "Set in the lush forest of Akwa Ibom, featuring a world-class 18-hole golf course and luxury suites.",
                    PricePerNight = 140000.00m,
                    AvailableRooms = 14,
                    Rating = 4.6,
                    Images = new List<string> { "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&auto=format&fit=crop&q=80" }
                },
                new Hotel
                {
                    Name = "The Wheatbaker Hotel",
                    City = "Lagos",
                    Address = "4 Onitolo Road, Ikoyi",
                    Description = "Lagos' premier luxury boutique hotel situated in the residential heart of Ikoyi.",
                    PricePerNight = 250000.00m,
                    AvailableRooms = 6,
                    Rating = 4.9,
                    Images = new List<string> { "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=80" }
                },
                new Hotel
                {
                    Name = "Federal Palace Hotel & Casino",
                    City = "Lagos",
                    Address = "6-8 Ahmadu Bello Way, Victoria Island",
                    Description = "Waterfront hotel with an outdoor water park, tennis courts, and high-quality room options.",
                    PricePerNight = 130000.00m,
                    AvailableRooms = 12,
                    Rating = 4.4,
                    Images = new List<string> { "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop&q=80" }
                },
                new Hotel
                {
                    Name = "Sheraton Abuja Hotel",
                    City = "Abuja",
                    Address = "Ladi Kwali Way, Maitama",
                    Description = "Comfortable luxury hotel with outstanding recreation, high speed internet, and a selection of international restaurants.",
                    PricePerNight = 160000.00m,
                    AvailableRooms = 15,
                    Rating = 4.3,
                    Images = new List<string> { "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&auto=format&fit=crop&q=80" }
                },
                new Hotel
                {
                    Name = "Legend Hotel Lagos Airport",
                    City = "Lagos",
                    Address = "Quorum Aviation Hangar, Ikeja",
                    Description = "Exclusive hotel adjacent to the Lagos international airport runway, featuring private jet access and luxury suites.",
                    PricePerNight = 320000.00m,
                    AvailableRooms = 8,
                    Rating = 4.8,
                    Images = new List<string> { "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&auto=format&fit=crop&q=80" }
                },
                new Hotel
                {
                    Name = "Southern Sun Ikoyi Hotel",
                    City = "Lagos",
                    Address = "47 Alfred Rewane Road, Ikoyi",
                    Description = "Stylish business hotel offering modern comfort and premier service in the heart of Ikoyi.",
                    PricePerNight = 195000.00m,
                    AvailableRooms = 10,
                    Rating = 4.6,
                    Images = new List<string> { "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&auto=format&fit=crop&q=80" }
                },
                new Hotel
                {
                    Name = "Presidential Hotel",
                    City = "Port Harcourt",
                    Address = "5141 Aba Road, Port Harcourt",
                    Description = "Renowned 5-star hotel in Port Harcourt, featuring an olympic-sized swimming pool, tennis courts, and diverse dining.",
                    PricePerNight = 125000.00m,
                    AvailableRooms = 14,
                    Rating = 4.3,
                    Images = new List<string> { "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=80" }
                }
            };

            foreach (var target in targetHotels)
            {
                var match = existingHotels.FirstOrDefault(h => h.Name.ToLower() == target.Name.ToLower());
                if (match != null)
                {
                    match.PricePerNight = target.PricePerNight;
                    match.Description = target.Description;
                    match.Address = target.Address;
                    context.Hotels.Update(match);
                }
                else
                {
                    target.Id = Guid.NewGuid();
                    await context.Hotels.AddAsync(target);
                }
            }
            logger.LogInformation("Hotels database seeded/updated.");

            await context.SaveChangesAsync();
        }
    }
}
