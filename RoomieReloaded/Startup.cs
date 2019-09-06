using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RoomieReloaded.Configuration;
using RoomieReloaded.Models;
using RoomieReloaded.Services;
using System.Collections.Generic;
using RoomieReloaded.Services.Calendar;
using RoomieReloaded.Services.CalendarEvents;
using RoomieReloaded.Services.Rooms;
using RoomieReloaded.Services.Zimbra;

namespace RoomieReloaded
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddOptions<RoomConfiguration>()
                .Bind(Configuration.GetSection("Rooms"));
            services.AddOptions<ZimbraAdapterConfiguration>()
                .Bind(Configuration.GetSection("Zimbra"));

            services.AddSingleton<IRoomService, RoomService>();
            services.AddSingleton<ICalendarService, CalendarService>();
            services.AddSingleton<IZimbraAdapter, ZimbraAdapter>();
            services.AddSingleton<IEqualityComparer<CalendarEventModel>, CalendarEventModelEqualityComparer>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                //app.UseHsts();
            }

            //app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
