using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TrvelBooking.Application.Interfaces.IExternal
{
    public interface IAmadeusFlightService
    {
        Task<IEnumerable<ExternalFlightOffer>> SearchFlightOffersAsync(string originCode, string destinationCode, DateTime departureDate, int passengers);
    }

    public class ExternalFlightOffer
    {
        public string FlightNumber { get; set; } = string.Empty;
        public string Airline { get; set; } = string.Empty;
        public string DepartureCityCode { get; set; } = string.Empty;
        public string ArrivalCityCode { get; set; } = string.Empty;
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public decimal Price { get; set; }
        public int AvailableSeats { get; set; }
    }
}
