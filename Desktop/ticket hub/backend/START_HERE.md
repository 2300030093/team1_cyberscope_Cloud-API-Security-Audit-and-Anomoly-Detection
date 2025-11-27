# 🚀 Start Here - Build Containers and Connect Database

## ⚠️ IMPORTANT: Start Docker Desktop First!

Before building containers, you **must** start Docker Desktop:

1. **Open Docker Desktop** from your Start Menu or Desktop
2. **Wait** until you see "Docker Desktop is running" (green icon in system tray)
3. **Then** proceed with the steps below

## Step-by-Step Instructions

### Step 1: Start Docker Desktop

- Look for Docker Desktop icon in your system tray (bottom right)
- If it's not running, open Docker Desktop from Start Menu
- Wait 30-60 seconds for it to fully start
- You'll see a green Docker icon when ready

### Step 2: Open Terminal in Backend Folder

```cmd
cd "C:\Users\Neeharika\Desktop\ticket hub\backend"
```

### Step 3: Build and Start Containers

Run these commands one by one:

```cmd
# Clean up any existing containers
docker-compose down -v

# Build the backend image
docker-compose build --no-cache backend

# Start all services
docker-compose up -d
```

### Step 4: Wait for Services to Start

Wait about 30-60 seconds for all containers to start, then check:

```cmd
# Check if containers are running
docker ps
```

You should see 4 containers:
- `ticket-postgres`
- `ticket-redis`
- `ticket-backend`
- `ticket-pgadmin`

### Step 5: Verify Database Connection

```cmd
# Check backend logs for database connection
docker-compose logs backend
```

Look for:
- ✅ "HikariPool-1 - Start completed"
- ✅ "Started TicketBookingApplication"
- ❌ No errors about "Connection refused" or "Connection failed"

### Step 6: Test the Connection

```cmd
# Test backend health
curl http://localhost:8081/actuator/health
```

Or open in browser: **http://localhost:8081/actuator/health**

## Quick Commands Reference

```cmd
# View all logs
docker-compose logs -f

# View backend logs only
docker-compose logs -f backend

# Check container status
docker ps

# Restart backend
docker-compose restart backend

# Stop all services
docker-compose down

# Rebuild everything
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## Troubleshooting

### "Docker is not running" Error

**Solution:**
1. Open Docker Desktop
2. Wait for it to fully start (green icon)
3. Try the commands again

### "Port already in use" Error

**Solution:**
```cmd
# Find what's using port 8081
netstat -ano | findstr :8081

# Or change port in docker-compose.yml (line 51)
# Change: "8081:8081" to "8082:8081"
```

### Backend Can't Connect to Database

**Check:**
```cmd
# Is PostgreSQL running?
docker ps | findstr postgres

# Check backend logs
docker-compose logs backend | findstr -i "database\|connection\|error"
```

**Fix:**
```cmd
# Restart everything
docker-compose restart
```

### Build Fails

**Solution:**
```cmd
# Clean build
docker-compose down -v
docker-compose build --no-cache backend
docker-compose up -d
```

## What Gets Started

When you run `docker-compose up -d`, it starts:

1. **PostgreSQL** (Database)
   - Port: 5432
   - Database: ticketbooking
   - Username: postgres
   - Password: postgres

2. **Redis** (Optional, for caching)
   - Port: 6379

3. **Backend** (Spring Boot Application)
   - Port: 8081
   - API: http://localhost:8081
   - Health: http://localhost:8081/actuator/health

4. **pgAdmin** (Database GUI)
   - Port: 5050
   - URL: http://localhost:5050
   - Login: admin@ticket.com / admin

## Database Connection Details

The backend automatically connects to PostgreSQL using:
- **Host:** `postgres` (Docker service name)
- **Port:** `5432`
- **Database:** `ticketbooking`
- **Username:** `postgres`
- **Password:** `postgres`

These are configured in `docker-compose.yml` and passed as environment variables.

## Success Indicators

✅ **Containers are running:**
```cmd
docker ps
# Shows 4 running containers
```

✅ **Backend is healthy:**
```cmd
curl http://localhost:8081/actuator/health
# Returns: {"status":"UP"}
```

✅ **Database is accessible:**
```cmd
docker exec ticket-postgres psql -U postgres -d ticketbooking -c "SELECT version();"
# Shows PostgreSQL version
```

✅ **Tables are created:**
```cmd
docker exec ticket-postgres psql -U postgres -d ticketbooking -c "\dt"
# Shows list of tables (users, events, shows, etc.)
```

## Next Steps

Once everything is running:

1. ✅ Test API: `curl http://localhost:8081/events`
2. ✅ Register a user: See API documentation
3. ✅ Access pgAdmin: http://localhost:5050
4. ✅ Start developing!

## Need Help?

- Check logs: `docker-compose logs -f backend`
- Verify Docker: `docker info`
- See BUILD_AND_CONNECT.md for detailed troubleshooting

