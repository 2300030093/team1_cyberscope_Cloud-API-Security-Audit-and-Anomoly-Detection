# Quick Start Guide

Get the Ticket Booking System backend up and running in minutes!

## Prerequisites Check

- ✅ Java 21 installed (`java -version`)
- ✅ Maven 3.6+ installed (`mvn -version`)
- ✅ PostgreSQL 15+ installed OR Docker installed

## Option 1: Quick Start with Docker Compose (Easiest)

```bash
# Navigate to backend directory
cd backend

# Start all services (PostgreSQL, Redis, Backend)
docker-compose up -d

# Check logs
docker-compose logs -f backend

# Application will be available at http://localhost:8081
```

That's it! The database and application are ready.

## Option 2: Local Development Setup

### Step 1: Start PostgreSQL

```bash
# Using Docker
docker run -d \
  --name ticket-postgres \
  -e POSTGRES_DB=ticketbooking \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine

# OR using local PostgreSQL
sudo systemctl start postgresql
createdb ticketbooking
```

### Step 2: Configure Application

Edit `src/main/resources/application.yml` if needed (defaults work for Docker setup).

### Step 3: Build and Run

```bash
# Build the project
./mvnw clean package

# Run the application
./mvnw spring-boot:run

# OR run the JAR
java -jar target/ticket-booking-backend-*.jar
```

### Step 4: Verify

```bash
# Check health endpoint
curl http://localhost:8081/actuator/health

# Or open in browser
open http://localhost:8081/actuator/health
```

## First Steps After Startup

### 1. Register an Admin User

```bash
curl -X POST http://localhost:8081/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@ticket.com",
    "password": "admin123",
    "phone": "+1234567890"
  }'
```

**Note**: After registration, manually update the user's role to ADMIN in the database:

```sql
-- Connect to database
psql -U postgres -d ticketbooking

-- Find user ID
SELECT id, email FROM users WHERE email = 'admin@ticket.com';

-- Add ADMIN role (replace USER_ID with actual ID)
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.email = 'admin@ticket.com' AND r.name = 'ADMIN';
```

### 2. Login

```bash
curl -X POST http://localhost:8081/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ticket.com",
    "password": "admin123"
  }'
```

Save the `token` from the response for authenticated requests.

### 3. Create Your First Event

```bash
curl -X POST http://localhost:8081/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Concert Night",
    "category": "CONCERTS",
    "description": "An amazing concert experience",
    "duration": "2 hours",
    "language": "English",
    "genre": "Rock",
    "rating": 4.5,
    "featured": true
  }'
```

## Testing the API

### Get All Events

```bash
curl http://localhost:8081/events
```

### WebSocket Connection Test

Using a WebSocket client or browser console:

```javascript
const socket = new SockJS('http://localhost:8081/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, function(frame) {
    console.log('Connected: ' + frame);
    
    // Subscribe to seat updates for show ID 1
    stompClient.subscribe('/topic/show.1.seats', function(message) {
        console.log('Seat update:', JSON.parse(message.body));
    });
});
```

## Common Issues

### Port Already in Use

If port 8081 is already in use:

```bash
# Change port in application.yml
server:
  port: 8082

# Or use environment variable
export SERVER_PORT=8082
```

### Database Connection Failed

1. Verify PostgreSQL is running
2. Check credentials in `application.yml`
3. Ensure database `ticketbooking` exists
4. Check firewall/network settings

### Maven Build Fails

```bash
# Clean and rebuild
./mvnw clean install

# Skip tests if needed
./mvnw clean package -DskipTests
```

## Next Steps

- 📖 Read the full [README.md](README.md) for detailed documentation
- 🔌 Check [DATABASE_CONNECTION.md](DATABASE_CONNECTION.md) for database setup
- 🚀 See deployment options in README
- 🧪 Explore API endpoints using the examples above

## Development Tips

1. **Hot Reload**: Use Spring Boot DevTools (included) - just restart the app
2. **Database Viewing**: Use pgAdmin (included in docker-compose) at http://localhost:5050
3. **Logs**: Check `application.log` or console output
4. **Debug Mode**: Add `-Xdebug` to JVM args for remote debugging

## Need Help?

- Check application logs for detailed error messages
- Verify all prerequisites are installed
- Ensure database is accessible
- Review the README for detailed configuration options

Happy coding! 🎉

