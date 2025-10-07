FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Root olarak kültürleri ve ICU kütüphanesini yükle
USER root
RUN apt-get update && \
    apt-get install -y locales icu-devtools libicu72 && \
    locale-gen en_US.UTF-8 && \
    dpkg-reconfigure locales

ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

USER app

# Build image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Masal.csproj", "."]
RUN dotnet restore "./Masal.csproj"
COPY . .
RUN dotnet build "./Masal.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Masal.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Masal.dll"]