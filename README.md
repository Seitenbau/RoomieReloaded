# RoomieReloaded
Zimbra room booking overview.

## Build/Start with docker
cd /path/to/repo/root
docker-compose up -d
(will take some time at the first run)

## Build/Start/Develop with Visual Studio oder Jetbrains Rider
Install dotnet core SDK (https://dotnet.microsoft.com/download) matching your OS
Install npm (should work with versions 5.6.0+)
Open solution in Visual Studio or Jetbrains Rider and start the app

Visual Studio Code also works, should automatically detect the solution when the folder is opened and ask to install C# development tools.

## To decouple frontend development from Visual Studio / Jetbrains Rider
To use another editor for frontend development and still have the backend running in debug mode, just start the app from visual studio or Rider. After that, open the client app folder in your favourite editor.

It should also be possible to start the app with docker and feed it the development folder instead of the built app, but I have not yet tested it. The Dockerfile as is won't work here, as it does a "dotnet publish", which builds the frontend app.

## Configuration
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
