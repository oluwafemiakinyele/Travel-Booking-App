FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["Trvel booking.sln", "./"]
COPY ["Trvel booking/Trvel booking.csproj", "Trvel booking/"]
COPY ["TrvelBooking.Domain/TrvelBooking.Domain.csproj", "TrvelBooking.Domain/"]
COPY ["TrvelBooking.Application/TrvelBooking.Application.csproj", "TrvelBooking.Application/"]
COPY ["TrvelBooking.Infrastructure/TrvelBooking.Infrastructure.csproj", "TrvelBooking.Infrastructure/"]
COPY ["TrvelBooking.Tests/TrvelBooking.Tests.csproj", "TrvelBooking.Tests/"]

RUN dotnet restore "Trvel booking/Trvel booking.csproj"

COPY . .

WORKDIR "/src/Trvel booking"
RUN dotnet publish "Trvel booking.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Trvel booking.dll"]
