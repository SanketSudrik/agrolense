# ---- Build Stage ----
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

# Copy csproj and restore
COPY Backend/SmartCropAPI/*.csproj ./Backend/SmartCropAPI/
RUN dotnet restore ./Backend/SmartCropAPI/SmartCropAPI.csproj

# Copy everything and build
COPY Backend/SmartCropAPI/ ./Backend/SmartCropAPI/
WORKDIR /src/Backend/SmartCropAPI
RUN dotnet publish -c Release -o /app/publish

# ---- Production Stage ----
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

# Copy published app
COPY --from=build /app/publish .

# Create uploads folder
RUN mkdir -p /app/wwwroot/uploads

EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "SmartCropAPI.dll"]
