using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;

namespace RoomieReloaded;

public static class DiagnosticServiceCollectionExtensions
{
    public static IServiceCollection AddObservability(this IServiceCollection services, string serviceName)
    {
        var resource = ResourceBuilder.CreateDefault().AddService(serviceName: serviceName, serviceVersion: "1.0");

        services
            .AddOpenTelemetry()
            .WithMetrics(metrics =>
            {
                metrics
                    .SetResourceBuilder(resource)
                    .AddRuntimeInstrumentation()
                    .AddAspNetCoreInstrumentation()
                    .AddHttpClientInstrumentation()
                    .AddView("request-duration", new ExplicitBucketHistogramConfiguration
                    {
                        Boundaries = new[]
                            {0, 0.005, 0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1, 2.5, 5, 7.5, 10}
                    })
                    .AddMeter("Microsoft.AspNetCore.Hosting",
                        "Microsoft.AspNetCore.Server.Kestrel")
                    .AddPrometheusExporter();
            });

        return services;
    }

    public static void MapObservability(this IEndpointRouteBuilder routes)
    {
        routes.MapPrometheusScrapingEndpoint();
    }
}