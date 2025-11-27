# Build Containers and Connect to Database

## Quick Start (Windows)

### Step 1: Ensure Docker Desktop is Running

1. Open Docker Desktop
2. Wait until it shows "Docker Desktop is running"

### Step 2: Build and Start Containers

**Option A: Using the batch script (Windows)**
```cmd
cd backend
build-and-run.bat
```

**Option B: Using Docker Compose directly**
```cmd
cd backend
docker-compose down -v
docker-compose build --no-cache backend
docker-compose up -d
```

### Step 3: Verify Connection

```cmd
docker-compose logs -f backend
```

Look for:
- ✅ "HikariPool-1 - Start completed"
- ✅ "Started TicketBookingApplication"
- ✅ No database connection errors

## Manual Steps

### 1. Build Backend Container

```cmd
cd backend
docker-compose build backend
```

### 2. Start All Services

```cmd
docker-compose up -d
```

This will start:
- PostgreSQL (port 5432)
- Redis (port 6379)
- Backend (port 8081)
- pgAdmin (port 5050)

### 3. Check Container Status

```cmd
docker ps
```

You should see:
- `ticket-postgres` - Running
- `ticket-redis` - Running
- `ticket-backend` - Running
- `ticket-pgadmin` - Running

### 4. Verify Database Connection

**Check backend logs:**
```cmd
docker-compose logs backend
```

**Test database connection:**
```cmd
docker exec ticket-postgres psql -U postgres -d ticketbooking -c "SELECT version();"
```

**Check backend health:**
```cmd
curl http://localhost:8081/actuator/health
```

Or open in browser: http://localhost:8081/actuator/health

## Troubleshooting

### Issue: "Docker is not running"

**Solution:**
1. Start Docker Desktop
2. Wait for it to fully start
3. Try again

### Issue: "Port already in use"

**Solution:**
```cmd
# Check what's using the port
netstat -ano | findstr :8081
netstat -ano | findstr :5432

# Stop the process or change ports in docker-compose.yml
```

### Issue: "Backend can't connect to database"

**Check:**
1. PostgreSQL container is running: `docker ps | findstr postgres`
2. Network is created: `docker network ls | findstr ticket-network`
3. Backend logs: `docker-compose logs backend`

**Fix:**
```cmd
# Restart containers
docker-compose restart

# Or rebuild
docker-compose down
docker-compose up -d --build
```

### Issue: "Build fails - Maven wrapper not found"

**Solution:**
The Dockerfile expects Maven wrapper. If it's missing:
```cmd
# Generate Maven wrapper (if needed)
cd backend
mvn wrapper:wrapper
```

### Issue: "Database tables not created"

**Solution:**
The application auto-creates tables on first startup. Check logs:
```cmd
docker-compose logs backend | findstr "Hibernate"
```

You should see table creation messages.

## Database Connection Details

### Inside Docker Containers:
- **Host:** `postgres` (service name)
- **Port:** `5432`
- **Database:** `ticketbooking`
- **Username:** `postgres`
- **Password:** `postgres`

### From Your Local Machine:
- **Host:** `localhost`
- **Port:** `5432`
- **Database:** `ticketbooking`
- **Username:** `postgres`
- **Password:** `postgres`

## Access pgAdmin (Database GUI)

1. Open browser: http://localhost:5050
2. Login:
   - Email: `admin@ticket.com`
   - Password: `admin`
3. Add server:
   - Name: `Ticket DB`
   - Host: `postgres` (use service name, not localhost)
   - Port: `5432`
   - Username: `postgres`
   - Password: `postgres`

## Verify Everything Works

### 1. Test Backend API

```cmd
curl http://localhost:8081/events
```

Should return: `[]` (empty array) or list of events

### 2. Test Database

```cmd
docker exec ticket-postgres psql -U postgres -d ticketbooking -c "\dt"
```

Should show all tables (users, roles, events, shows, etc.)

### 3. Register a User

```cmd
curl -X POST http://localhost:8081/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@test.com\",\"password\":\"test123\"}"
```

## Environment Variables

The backend uses these environment variables (set in docker-compose.yml):

- `DB_URL` = `jdbc:postgresql://postgres:5432/ticketbooking`
- `DB_USERNAME` = `postgres`
- `DB_PASSWORD` = `postgres`
- `JWT_SECRET` = (set in docker-compose.yml)
- `REDIS_HOST` = `redis`
- `REDIS_PORT` = `6379`

## Next Steps

Once containers are running and connected:

1. ✅ Backend is available at http://localhost:8081
2. ✅ Database is accessible
3. ✅ You can start using the API
4. ✅ Check logs: `docker-compose logs -f backend`

## Useful Commands

```cmd
# View all logs
docker-compose logs -f

# View backend logs only
docker-compose logs -f backend

# Restart backend
docker-compose restart backend

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v

# Rebuild and restart
docker-compose up -d --build
```

