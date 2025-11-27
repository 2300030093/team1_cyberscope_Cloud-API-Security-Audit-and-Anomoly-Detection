# Database Connection Guide

## PostgreSQL Connection Setup

### Option 1: Using Docker Compose (Recommended for Development)

The `docker-compose.yml` file includes a PostgreSQL container. Simply run:

```bash
docker-compose up -d postgres
```

This will start PostgreSQL with:
- **Database**: `ticketbooking`
- **Username**: `postgres`
- **Password**: `postgres`
- **Port**: `5432`

### Option 2: Local PostgreSQL Installation

1. **Install PostgreSQL** (if not already installed):
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   
   # macOS (using Homebrew)
   brew install postgresql
   brew services start postgresql
   
   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. **Create Database**:
   ```bash
   # Login as postgres user
   sudo -u postgres psql
   
   # Create database
   CREATE DATABASE ticketbooking;
   
   # Create user (optional)
   CREATE USER ticketuser WITH PASSWORD 'yourpassword';
   GRANT ALL PRIVILEGES ON DATABASE ticketbooking TO ticketuser;
   
   # Exit
   \q
   ```

3. **Update application.yml**:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/ticketbooking
       username: postgres  # or ticketuser
       password: postgres   # or yourpassword
   ```

### Option 3: Remote PostgreSQL Database

If you have a remote PostgreSQL database (e.g., AWS RDS, Azure Database, etc.):

1. **Update application.yml**:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://your-host:5432/ticketbooking
       username: your-username
       password: your-password
   ```

2. **Or use environment variables**:
   ```bash
   export DB_URL=jdbc:postgresql://your-host:5432/ticketbooking
   export DB_USERNAME=your-username
   export DB_PASSWORD=your-password
   ```

## Connection Testing

### Test Connection from Command Line

```bash
# Using psql
psql -h localhost -U postgres -d ticketbooking

# Test connection
\conninfo
```

### Test Connection from Application

The application will automatically test the connection on startup. Check the logs for:

```
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
```

If you see connection errors, verify:
1. PostgreSQL is running
2. Database exists
3. Credentials are correct
4. Network/firewall allows connections

## Database Schema

The application uses JPA/Hibernate with `ddl-auto: update`, which means:

- **Development**: Tables are automatically created/updated on startup
- **Production**: Change to `ddl-auto: validate` and use migrations

### Manual Schema Creation

If you prefer to create tables manually, see `src/main/resources/db-init.sql` for reference.

## Connection Pool Configuration

The application uses HikariCP connection pool. Default settings in `application.yml`:

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000
```

Adjust these based on your application load.

## Troubleshooting

### Connection Refused

**Error**: `Connection to localhost:5432 refused`

**Solutions**:
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check PostgreSQL is listening: `sudo netstat -tulpn | grep 5432`
- Verify port in `application.yml` matches PostgreSQL port

### Authentication Failed

**Error**: `FATAL: password authentication failed`

**Solutions**:
- Verify username and password in `application.yml`
- Check PostgreSQL `pg_hba.conf` configuration
- Reset password: `ALTER USER postgres WITH PASSWORD 'newpassword';`

### Database Does Not Exist

**Error**: `FATAL: database "ticketbooking" does not exist`

**Solutions**:
- Create database: `CREATE DATABASE ticketbooking;`
- Or update `application.yml` to use existing database

### SSL Connection Issues

If your database requires SSL:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://your-host:5432/ticketbooking?ssl=true&sslmode=require
```

## Production Recommendations

1. **Use Connection Pooling**: Already configured with HikariCP
2. **Enable SSL**: For remote databases
3. **Use Environment Variables**: Never hardcode credentials
4. **Regular Backups**: Set up automated backups
5. **Monitor Connections**: Watch connection pool metrics
6. **Use Read Replicas**: For high-traffic applications

## Environment Variables

Set these environment variables for production:

```bash
export DB_URL=jdbc:postgresql://your-host:5432/ticketbooking
export DB_USERNAME=your-username
export DB_PASSWORD=your-secure-password
```

Or use a `.env` file (not committed to git):

```env
DB_URL=jdbc:postgresql://localhost:5432/ticketbooking
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
```

## Next Steps

After connecting to the database:

1. Start the application
2. Check logs for successful connection
3. Verify tables are created (check PostgreSQL: `\dt`)
4. Test API endpoints
5. Create an admin user (via registration endpoint)

