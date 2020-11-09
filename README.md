# RoomieReloaded

Zimbra room booking overview

## Build/Start with docker-compose

Simply execute `docker-compose` to start the web application:

```sh
cd /path/to/repo/root

docker-compose up -d
```

Building the container will take some time during the first run

## Working with Visual Studio (Code) or JetBrains Rider

- Install the [dotnet core SDK](https://dotnet.microsoft.com/download) that matches your OS
- Install npm (should work with versions 5.6.0+)
- Open the solution in Visual Studio or JetBrains Rider and start the app

Visual Studio Code can be used as well.
It should automatically detect the solution when the folder is opened and ask to install the C# development tools.

## Working with the Remote-Containers extension in Visual Studio Code

If you do not want to install npm and .NET Core locally, you can use the provided `.devcontainer` directory.
After setting up the [Remote-Containers extension](https://code.visualstudio.com/docs/remote/containers) and opening the root directory of the Roomie project, Visual Studio Code should offer to reopen the folder within a container.

## To decouple front end development from Visual Studio / JetBrains Rider

To use another editor for front end development and still have the back end running in debug mode, just start the app from Visual Studio or Rider.
After that, open the client app folder in your favorite editor.

It should also be possible to start the app with Docker and feed it the development folder instead of the built app, but we have not yet tested it.
The current Dockerfile will not work in this case, as it executes `dotnet publish`, which builds the front end app.

## Configuration

To overwrite the local configuration, follow these steps:

1. Create a new file `appsettings.local.json` (will be loaded last if it is present)
1. Copy this into the file:

    ```json
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
    ```

1. Update Zimbra connection info and add rooms. `Name` is the room's internal name, `Mail` the rooms email address and `NiceName` the string that will be shown in the UI.
1. DO NOT check in the `appsettings.local.json` and/or remove it from `.gitignore`!
