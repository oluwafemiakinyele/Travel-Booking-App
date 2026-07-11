using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using TrvelBooking.Application.Interfaces.IExternal;

namespace TrvelBooking.Infrastructure.Services.External
{
    public class AmadeusFlightService : IAmadeusFlightService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        private readonly ILogger<AmadeusFlightService> _logger;
        private string? _accessToken;
        private DateTime _tokenExpiry = DateTime.MinValue;

        public AmadeusFlightService(HttpClient httpClient, IConfiguration config, ILogger<AmadeusFlightService> logger)
        {
            _httpClient = httpClient;
            _config = config;
            _logger = logger;
        }

        public async Task<IEnumerable<ExternalFlightOffer>> SearchFlightOffersAsync(
            string originCode, 
            string destinationCode, 
            DateTime departureDate, 
            int passengers)
        {
            var clientId = _config["Amadeus:ClientId"];
            var clientSecret = _config["Amadeus:ClientSecret"];

            // Fallback to mock if API keys are missing
            if (string.IsNullOrWhiteSpace(clientId) || string.IsNullOrWhiteSpace(clientSecret) || 
                clientId.Equals("dummy", StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogWarning("Amadeus credentials missing or dummy. Returning mock flights.");
                return GenerateMockFlights(originCode, destinationCode, departureDate);
            }

            try
            {
                var token = await GetAccessTokenAsync(clientId, clientSecret);
                if (string.IsNullOrEmpty(token))
                {
                    _logger.LogError("Failed to obtain Amadeus access token. Falling back to mock flights.");
                    return GenerateMockFlights(originCode, destinationCode, departureDate);
                }

                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                
                var url = $"https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode={originCode}&destinationLocationCode={destinationCode}&departureDate={departureDate:yyyy-MM-dd}&adults={passengers}&max=5";
                
                var response = await _httpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                {
                    var error = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Amadeus Flight Offers search failed: {Error}. Falling back to mock flights.", error);
                    return GenerateMockFlights(originCode, destinationCode, departureDate);
                }

                var amadeusData = await response.Content.ReadFromJsonAsync<AmadeusFlightOffersResponse>();
                if (amadeusData?.Data == null)
                {
                    return new List<ExternalFlightOffer>();
                }

                var offers = new List<ExternalFlightOffer>();
                foreach (var data in amadeusData.Data)
                {
                    if (data.Itineraries?.Count > 0 && data.Price != null)
                    {
                        var itinerary = data.Itineraries[0];
                        if (itinerary.Segments?.Count > 0)
                        {
                            var departureSegment = itinerary.Segments[0];
                            var arrivalSegment = itinerary.Segments[^1];

                            offers.Add(new ExternalFlightOffer
                            {
                                FlightNumber = $"{departureSegment.CarrierCode} {departureSegment.Number}",
                                Airline = GetAirlineName(departureSegment.CarrierCode),
                                DepartureCityCode = departureSegment.Departure.IataCode,
                                ArrivalCityCode = arrivalSegment.Arrival.IataCode,
                                DepartureTime = departureSegment.Departure.At,
                                ArrivalTime = arrivalSegment.Arrival.At,
                                Price = decimal.Parse(data.Price.Total),
                                AvailableSeats = data.NumberOfBookableSeats ?? 9
                            });
                        }
                    }
                }

                return offers;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception during Amadeus flight search. Falling back to mock flights.");
                return GenerateMockFlights(originCode, destinationCode, departureDate);
            }
        }

        private async Task<string?> GetAccessTokenAsync(string clientId, string clientSecret)
        {
            if (!string.IsNullOrEmpty(_accessToken) && DateTime.UtcNow < _tokenExpiry)
            {
                return _accessToken;
            }

            try
            {
                var dict = new Dictionary<string, string>
                {
                    { "grant_type", "client_credentials" },
                    { "client_id", clientId },
                    { "client_secret", clientSecret }
                };

                var req = new HttpRequestMessage(HttpMethod.Post, "https://test.api.amadeus.com/v1/security/oauth2/token")
                {
                    Content = new FormUrlEncodedContent(dict)
                };

                var res = await _httpClient.SendAsync(req);
                if (!res.IsSuccessStatusCode)
                {
                    return null;
                }

                var tokenResponse = await res.Content.ReadFromJsonAsync<AmadeusTokenResponse>();
                if (tokenResponse != null)
                {
                    _accessToken = tokenResponse.AccessToken;
                    _tokenExpiry = DateTime.UtcNow.AddSeconds(tokenResponse.ExpiresIn - 30);
                    return _accessToken;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception occurred while fetching Amadeus token");
            }

            return null;
        }

        private static IEnumerable<ExternalFlightOffer> GenerateMockFlights(string origin, string destination, DateTime departureDate)
        {
            return new List<ExternalFlightOffer>
            {
                new ExternalFlightOffer
                {
                    FlightNumber = "AW 234",
                    Airline = "Africa World Airlines",
                    DepartureCityCode = origin.ToUpper(),
                    ArrivalCityCode = destination.ToUpper(),
                    DepartureTime = departureDate.AddHours(8),
                    ArrivalTime = departureDate.AddHours(9).AddMinutes(30),
                    Price = 120.00m,
                    AvailableSeats = 15
                },
                new ExternalFlightOffer
                {
                    FlightNumber = "KP 506",
                    Airline = "Asky Airlines",
                    DepartureCityCode = origin.ToUpper(),
                    ArrivalCityCode = destination.ToUpper(),
                    DepartureTime = departureDate.AddHours(14),
                    ArrivalTime = departureDate.AddHours(16),
                    Price = 180.00m,
                    AvailableSeats = 8
                },
                new ExternalFlightOffer
                {
                    FlightNumber = "KQ 112",
                    Airline = "Kenya Airways",
                    DepartureCityCode = origin.ToUpper(),
                    ArrivalCityCode = destination.ToUpper(),
                    DepartureTime = departureDate.AddHours(20),
                    ArrivalTime = departureDate.AddHours(22).AddMinutes(15),
                    Price = 250.00m,
                    AvailableSeats = 5
                }
            };
        }

        private static string GetAirlineName(string code)
        {
            return code.ToUpper() switch
            {
                "AW" => "Africa World Airlines",
                "KP" => "Asky Airlines",
                "KQ" => "Kenya Airways",
                "ET" => "Ethiopian Airlines",
                "BA" => "British Airways",
                "LH" => "Lufthansa",
                _ => "Airline " + code
            };
        }

        private class AmadeusTokenResponse
        {
            [JsonPropertyName("access_token")]
            public string AccessToken { get; set; } = string.Empty;

            [JsonPropertyName("expires_in")]
            public int ExpiresIn { get; set; }
        }

        private class AmadeusFlightOffersResponse
        {
            [JsonPropertyName("data")]
            public List<AmadeusFlightOfferData>? Data { get; set; }
        }

        private class AmadeusFlightOfferData
        {
            [JsonPropertyName("numberOfBookableSeats")]
            public int? NumberOfBookableSeats { get; set; }

            [JsonPropertyName("itineraries")]
            public List<AmadeusItinerary>? Itineraries { get; set; }

            [JsonPropertyName("price")]
            public AmadeusPrice? Price { get; set; }
        }

        private class AmadeusItinerary
        {
            [JsonPropertyName("segments")]
            public List<AmadeusSegment>? Segments { get; set; }
        }

        private class AmadeusSegment
        {
            [JsonPropertyName("carrierCode")]
            public string CarrierCode { get; set; } = string.Empty;

            [JsonPropertyName("number")]
            public string Number { get; set; } = string.Empty;

            [JsonPropertyName("departure")]
            public AmadeusEndpoint Departure { get; set; } = null!;

            [JsonPropertyName("arrival")]
            public AmadeusEndpoint Arrival { get; set; } = null!;
        }

        private class AmadeusEndpoint
        {
            [JsonPropertyName("iataCode")]
            public string IataCode { get; set; } = string.Empty;

            [JsonPropertyName("at")]
            public DateTime At { get; set; }
        }

        private class AmadeusPrice
        {
            [JsonPropertyName("total")]
            public string Total { get; set; } = string.Empty;
        }
    }
}
