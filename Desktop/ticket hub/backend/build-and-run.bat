@echo off
REM Build and Run Ticket Booking System with Docker Compose (Windows)

echo 🚀 Building and starting Ticket Booking System containers...

REM Navigate to backend directory
cd /d "%~dp0"

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Docker is not running. Please start Docker Desktop and try again.
    exit /b 1
)

echo ✅ Docker is running

REM Stop and remove existing containers
echo 🧹 Cleaning up existing containers...
docker-compose down -v

REM Build the backend image
echo 🔨 Building backend Docker image...
docker-compose build --no-cache backend

REM Start all services
echo 🚀 Starting all services (PostgreSQL, Redis, Backend, pgAdmin)...
docker-compose up -d

REM Wait for services to be healthy
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Check PostgreSQL health
echo 📊 Checking PostgreSQL health...
:check_postgres
docker exec ticket-postgres pg_isready -U postgres >nul 2>&1
if errorlevel 1 (
    echo    Waiting for PostgreSQL...
    timeout /t 2 /nobreak >nul
    goto check_postgres
)
echo ✅ PostgreSQL is ready

REM Check backend logs
echo 📋 Backend logs (last 20 lines):
docker-compose logs --tail=20 backend

echo.
echo ✅ All services are running!
echo.
echo 📍 Service URLs:
echo    - Backend API: http://localhost:8081
echo    - Backend Health: http://localhost:8081/actuator/health
echo    - pgAdmin: http://localhost:5050
echo    - PostgreSQL: localhost:5432
echo.
echo 📝 To view logs:
echo    docker-compose logs -f backend
echo.
echo 🛑 To stop services:
echo    docker-compose down
echo.

pause

