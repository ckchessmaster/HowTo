using Grpc.Net.Client;
using WeatherServices;

Console.WriteLine("Hello, World!");

GrpcChannel channel = GrpcChannel.ForAddress("http://localhost:5287"); // Change this to whatever your service is running on
WeatherService.WeatherServiceClient weatherServiceClient = new(channel);

GetWeatherForecastResponse response = await weatherServiceClient.GetWeatherForecastAsync(new GetWeatherForecastRequest
{
    Days = 7
});

foreach (WeatherForecast forecast in response.WeatherForecast)
{
    Console.WriteLine($"Date: {forecast.Date.ToDateTime().ToLocalTime()}");
    Console.WriteLine($"Temperature C: {forecast.TemperatureC}");
    Console.WriteLine($"Summary: {forecast.Summary}");
    Console.WriteLine("--------------------------------------------------");
}