using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using WeatherServices;

namespace WeatherAPI.Services;

public class WeatherServiceImpl : WeatherService.WeatherServiceBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };
    
    public override async Task<GetWeatherForecastResponse> GetWeatherForecast(GetWeatherForecastRequest request, ServerCallContext context)
    {
        int daysToForecast = request.HasDays ? request.Days : 5;

        var weatherForecasts = Enumerable.Range(1, daysToForecast).Select(index => new WeatherServices.WeatherForecast
        {
            Date = Timestamp.FromDateTime(DateTime.UtcNow.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        });

        GetWeatherForecastResponse response = new();
        response.WeatherForecast.AddRange(weatherForecasts);

        return response;
    }
}