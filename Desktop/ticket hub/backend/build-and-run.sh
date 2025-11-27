#!/bin/bash

# Build and Run Ticket Booking System with Docker Compose

echo "🚀 Building and starting Ticket Booking System containers..."

# Navigate to backend directory
cd "$(dirname "$0")"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running"

# Stop and remove existing containers
echo "🧹 Cleaning up existing containers..."
docker-compose down -v

# Build the backend image
echo "🔨 Building backend Docker image..."
docker-compose build --no-cache backend

# Start all services
echo "🚀 Starting all services (PostgreSQL, Redis, Backend, pgAdmin)..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check PostgreSQL health
echo "📊 Checking PostgreSQL health..."
until docker exec ticket-postgres pg_isready -U postgres > /dev/null 2>&1; do
    echo "   Waiting for PostgreSQL..."
    sleep 2
done
echo "✅ PostgreSQL is ready"

# Check backend logs
echo "📋 Backend logs (last 20 lines):"
docker-compose logs --tail=20 backend

echo ""
echo "✅ All services are running!"
echo ""
echo "📍 Service URLs:"
echo "   - Backend API: http://localhost:8081"
echo "   - Backend Health: http://localhost:8081/actuator/health"
echo "   - pgAdmin: http://localhost:5050"
echo "   - PostgreSQL: localhost:5432"
echo ""
echo "📝 To view logs:"
echo "   docker-compose logs -f backend"
echo ""
echo "🛑 To stop services:"
echo "   docker-compose down"
echo ""

