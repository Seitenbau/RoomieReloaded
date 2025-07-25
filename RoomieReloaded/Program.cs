using Microsoft.AspNetCore;

namespace RoomieReloaded;

public class Program
{
    public static void Main(string[] args)
    {
        CreateWebHostBuilder(args).Build().Run();
    }

    public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
        WebHost.CreateDefaultBuilder(args)
            .ConfigureAppConfiguration(Configure)
            .UseStartup<Startup>();

    private static void Configure(WebHostBuilderContext context, IConfigurationBuilder configurationBuilder)
    {
        configurationBuilder.AddJsonFile("appsettings.json", false, true)
            .AddJsonFile($"appsettings.{context.HostingEnvironment.EnvironmentName}.json", true, true)
            .AddJsonFile($"appsettings.local.json", true, true)
            .AddEnvironmentVariables();
    }
}