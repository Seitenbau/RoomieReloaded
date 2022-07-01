using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RoomieReloaded.Configuration;
using System.Collections.Generic;
using JetBrains.Annotations;
using RoomieReloaded.Models.Presentation;
using RoomieReloaded.Services.Accessors;
using RoomieReloaded.Services.Calendar;
using RoomieReloaded.Services.CalendarEvents;
using RoomieReloaded.Services.Chat;
using RoomieReloaded.Services.Rooms;
using RoomieReloaded.Services.Users;
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
        public void ConfigureServices( [NotNull] IServiceCollection services)
        {
            services.AddMvc(options => options!.EnableEndpointRouting = false);
            services.AddMemoryCache();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/build"; });

            services.AddOptions<RoomConfiguration>()
                .Bind(Configuration.GetSection("Rooms"));
            services.AddOptions<ZimbraAdapterConfiguration>()
                .Bind(Configuration.GetSection("Zimbra"));
            services.AddOptions<LdapConfiguration>()
                .Bind(Configuration.GetSection("Ldap"));
            services.AddOptions<RocketChatConfiguration>()
                .Bind(Configuration.GetSection("RocketChat"));

            ConfigureCors(services);

            services.AddSingleton<IRoomService, RoomService>();
            services.AddSingleton<IRoomAccessor, RoomAccessor>();
            services.AddSingleton<ICalendarService, CalendarService>();
            services.AddSingleton<ICalendarEventFactory, CalendarEventFactory>();
            services.AddSingleton<IZimbraAdapter, ZimbraAdapter>();

            services.AddSingleton<IChatService, RocketChatService>();
            services.AddSingleton<IChatMessageService, ChatMessageService>();

            BindUserLookupService(services);

            services.AddSingleton<IEqualityComparer<CalendarEventModel>, CalendarEventModelEqualityComparer>();

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        }

        private void ConfigureCors(IServiceCollection services)
        {
            var corsConfig = Configuration.GetSection("Cors").Get<CorsConfiguration>();
            var allowedOrigins = corsConfig?.AllowedOrigins ?? new string[0];
            services.AddCors(
                options => options.AddDefaultPolicy(
                    policy => policy.WithOrigins(allowedOrigins)));
        }

        private static void BindUserLookupService(IServiceCollection services)
        {
            services.AddSingleton<IUserLookupService, LdapUserLookupService>();
            services.AddSingleton<ICachingUserLookupService, CachingUserLookupService>();
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

            app.UseCors();

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