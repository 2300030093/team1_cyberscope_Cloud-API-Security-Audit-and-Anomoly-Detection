#!/bin/bash

# Verify Database Connection

echo "🔍 Verifying database connection..."

# Check if containers are running
if ! docker ps | grep -q ticket-postgres; then
    echo "❌ PostgreSQL container is not running"
    echo "   Run: docker-compose up -d"
    exit 1
fi

if ! docker ps | grep -q ticket-backend; then
    echo "❌ Backend container is not running"
    echo "   Run: docker-compose up -d"
    exit 1
fi

echo "✅ Containers are running"

# Test PostgreSQL connection
echo "📊 Testing PostgreSQL connection..."
docker exec ticket-postgres psql -U postgres -d ticketbooking -c "SELECT version();" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ PostgreSQL connection successful"
else
    echo "❌ PostgreSQL connection failed"
    exit 1
fi

# Check backend health
echo "🏥 Checking backend health..."
HEALTH=$(curl -s http://localhost:8081/actuator/health 2>/dev/null)

if [ $? -eq 0 ]; then
    echo "✅ Backend is responding"
    echo "   Response: $HEALTH"
else
    echo "⚠️  Backend health check failed (may still be starting)"
    echo "   Check logs: docker-compose logs backend"
fi

# Check database tables
echo "📋 Checking database tables..."
TABLES=$(docker exec ticket-postgres psql -U postgres -d ticketbooking -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ')

if [ ! -z "$TABLES" ] && [ "$TABLES" != "0" ]; then
    echo "✅ Database tables found: $TABLES tables"
    echo ""
    echo "📊 Database tables:"
    docker exec ticket-postgres psql -U postgres -d ticketbooking -c "\dt" 2>/dev/null
else
    echo "⚠️  No tables found yet (application may still be initializing)"
fi

echo ""
echo "✅ Connection verification complete!"

