# RoomieReloaded
Zimbra room booking overview

# Build/Start with docker
docker-compose up -d
(will take some time at the first run)

# Build/Start/Develop with Visual Studio oder Jetbrains Rider
Install dotnet core SDK (https://dotnet.microsoft.com/download) matching your OS
Install npm (should work with versions 5.6.0+)
Open solution in Visual Studio or Jetbrains Rider and start the app

# To decouple frontend development from Visual Studio / Jetbrains Rider
To use another editor for frontend development and still have the backend running in debug mode, you can for example do the following: 
- Change "ASPNETCORE_ENVIRONMENT" in "Properties/launchSettings.json" to "Staging" (or use any other emthod to set the variable, see https://docs.microsoft.com/en-us/aspnet/core/fundamentals/environments?view=aspnetcore-2.2)
- Build and start the application with Visual Studio. Thanks to "Staging", npm start will not be executed.
- Open a shell in /ClientApp and execute "npm install", then "npm start"
- Open /ClientApp in your favourite editor

It should also be possible to start the app with docker and feed it the development folder instead of the built app, but I have not yet tested it.

# Configuration
To overwrite local configuration, follow these steps:

1. Create a new file "appsettings.local.json" (will be loaded last if its present)
2. Copy this into the file:
{
  "Zimbra": {
    "Host": "",
    "UserName": "",
    "Password": ""
  },
  "Rooms": [
    {
      "Name": "",
      "Mail": "",
      "NiceName": ""
    }
  ]
}
3. Update Zimbra connection info and add rooms. "Name" is the room's internal name, "Mail" the rooms email address and "NiceName" the string that will be shown in the UI.
4. DO NOT check in appsettings.local.json and/or remove it from .gitignore
