FROM mcr.microsoft.com/dotnet/core/sdk:2.2 as builder

# Installing Node.js 14 LTS
RUN apt-get update && apt-get install -y \
    apt-transport-https \
    lsb-release \
    && curl -sL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
