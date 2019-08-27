#build image
FROM mcr.microsoft.com/dotnet/core/sdk:2.2 as builder
WORKDIR /etc/apt/apt.conf.d
COPY ./RoomieReloaded/docker-build-image-apt-get-fix ./99fixbadproxy

RUN apt-get update
RUN apt-get install -y apt-transport-https lsb-release
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs


FROM builder as build
WORKDIR /app
COPY ["./RoomieReloaded.csproj", "."]
RUN dotnet restore
COPY . .
RUN /bin/bash -c "dotnet publish -c Release -o /out/"


#runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:2.2
WORKDIR /app
COPY --from=build /out .
ENTRYPOINT ["dotnet", "RoomieReloaded.dll"]
