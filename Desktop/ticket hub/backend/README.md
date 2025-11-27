# Ticket Booking System - Backend

A comprehensive Spring Boot backend for an online ticket booking system with real-time seat locking, WebSocket support, JWT authentication, and payment integration.

## 🚀 Features

- **Authentication & Authorization**
  - User registration and login
  - JWT token-based authentication
  - Refresh token mechanism with HTTP-only cookies
  - Role-based access control (USER, ADMIN)

- **Event Management**
  - CRUD operations for events
  - Event poster upload
  - Category-based filtering

- **Show Management**
  - Multiple shows per event
  - Date, time, and venue management
  - Seat layout configuration

- **Real-Time Seat Locking**
  - WebSocket-based real-time updates
  - 3-minute seat lock TTL
  - Automatic lock expiration cleanup
  - Concurrent booking prevention

- **Booking System**
  - Secure booking creation
  - Payment integration (Stripe/Razorpay ready)
  - Ticket generation with QR codes

- **User Dashboard**
  - Profile management
  - Booking history
  - Ticket viewing

## 📋 Prerequisites

- Java 21 or higher
- Maven 3.6+
- PostgreSQL 15+
- Redis (optional, for distributed seat locking)
- Docker & Docker Compose (for containerized deployment)

## 🛠️ Local Development Setup

### 1. Database Setup

```bash
# Start PostgreSQL using Docker
docker run -d \
  --name ticket-postgres \
  -e POSTGRES_DB=ticketbooking \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine
```

### 2. Configure Application

Update `src/main/resources/application.yml` with your database credentials:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/ticketbooking
    username: postgres
    password: postgres
```

### 3. Build and Run

```bash
# Build the project
./mvnw clean package

# Run the application
./mvnw spring-boot:run

# Or run the JAR
java -jar target/ticket-booking-backend-*.jar
```

The application will start on `http://localhost:8081`

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down
```

### Manual Docker Build

```bash
# Build the image
docker build -t ticket-booking-backend:latest .

# Run the container
docker run -d \
  --name ticket-backend \
  -p 8081:8081 \
  -e DB_URL=jdbc:postgresql://postgres:5432/ticketbooking \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=postgres \
  -e JWT_SECRET=your-secret-key \
  ticket-booking-backend:latest
```

## ☸️ Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (v1.24+)
- kubectl configured
- NGINX Ingress Controller installed

### Deploy

```bash
# Apply all manifests
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/postgres-statefulset.yaml
kubectl apply -f k8s/postgres-service.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml

# Check deployment status
kubectl get pods
kubectl get services
```

### Update Secrets

Before deploying, update `k8s/secret.yaml` with your actual secrets:

```yaml
stringData:
  DB_PASSWORD: "your-secure-password"
  JWT_SECRET: "your-256-bit-secret-key"
  STRIPE_API_KEY: "your-stripe-key"
  # ... other secrets
```

## 🤖 Ansible Deployment

### Setup

1. Install Ansible on your control machine:
```bash
sudo apt-get install ansible
```

2. Configure inventory in `ansible/inventory.ini`:
```ini
[servers]
your-server-ip ansible_host=your-server-ip ansible_user=ubuntu
```

3. Update variables in inventory or use `--extra-vars`:
```bash
ansible-playbook -i ansible/inventory.ini ansible/setup.yml \
  --extra-vars "db_password=secure-pass jwt_secret=your-secret"
```

### Deploy

```bash
# Complete setup (Docker + Kubernetes)
ansible-playbook -i ansible/inventory.ini ansible/setup.yml

# Deploy application
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml

# Install Docker only
ansible-playbook -i ansible/inventory.ini ansible/install_docker.yml

# Install Kubernetes only
ansible-playbook -i ansible/inventory.ini ansible/install_kubernetes.yml
```

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout

### Events
- `GET /events` - Get all events
- `GET /events/{id}` - Get event by ID
- `POST /events` - Create event (ADMIN)
- `PUT /events/{id}` - Update event (ADMIN)
- `DELETE /events/{id}` - Delete event (ADMIN)
- `POST /events/{id}/poster` - Upload event poster (ADMIN)

### Shows
- `GET /events/{eventId}/shows` - Get shows for event
- `GET /events/{eventId}/shows/{showId}` - Get show by ID
- `POST /events/{eventId}/shows` - Create show (ADMIN)
- `PUT /events/{eventId}/shows/{showId}` - Update show (ADMIN)
- `DELETE /events/{eventId}/shows/{showId}` - Delete show (ADMIN)

### Seats
- `GET /shows/{showId}/seats` - Get all seats for show
- `POST /shows/{showId}/seats/lock` - Lock seats
- `POST /shows/{showId}/seats/unlock` - Unlock seats

### Bookings
- `POST /shows/{showId}/book` - Create booking
- `GET /shows/{showId}/book/{id}` - Get booking by ID
- `GET /shows/{showId}/book/booking/{bookingId}` - Get booking by booking ID

### Payments
- `POST /payment/create` - Create payment
- `POST /payment/verify` - Verify payment
- `GET /payment/booking/{bookingId}` - Get payment by booking ID

### Tickets
- `GET /orders/{orderId}` - Get ticket by booking ID
- `GET /orders/{orderId}/ticket` - Generate ticket
- `GET /orders/ticket/{ticketCode}` - Get ticket by code

### Profile
- `GET /profile` - Get user profile
- `GET /profile/bookings` - Get user bookings
- `PUT /profile/update` - Update profile

## 🔌 WebSocket

### Connection

Connect to WebSocket endpoint:
```
ws://localhost:8081/ws
```

### Topics

Subscribe to seat updates for a show:
```
/topic/show.{showId}.seats
```

### Events

- `seat.locked` - Seat has been locked
- `seat.unlocked` - Seat has been unlocked
- `seat.booked` - Seat has been booked

## 🔐 Security Configuration

### JWT Configuration

Update `application.yml`:
```yaml
jwt:
  secret: your-256-bit-secret-key-minimum-32-characters
  expiration: 86400000  # 24 hours
  refresh-expiration: 604800000  # 7 days
```

### CORS Configuration

Update allowed origins in `application.yml`:
```yaml
app:
  cors:
    allowed-origins: http://localhost:8080,http://localhost:3000
```

## 🧪 Testing

```bash
# Run all tests
./mvnw test

# Run with coverage
./mvnw test jacoco:report
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_USERNAME` | PostgreSQL username | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | `postgres` |
| `DB_URL` | Database URL | `jdbc:postgresql://localhost:5432/ticketbooking` |
| `JWT_SECRET` | JWT signing secret | (required) |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `SERVER_PORT` | Application port | `8081` |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:8080,http://localhost:3000` |
| `STRIPE_API_KEY` | Stripe API key | (optional) |
| `RAZORPAY_KEY_ID` | Razorpay key ID | (optional) |

## 🗄️ Database Schema

The application uses JPA with Hibernate. Tables are auto-created on startup with `ddl-auto: update`.

Key tables:
- `users` - User accounts
- `roles` - User roles
- `events` - Events
- `shows` - Show schedules
- `seats` - Seat configurations
- `seat_locks` - Active seat locks
- `bookings` - User bookings
- `payments` - Payment records
- `tickets` - Generated tickets

## 🔄 Scheduled Tasks

- **Seat Lock Cleanup**: Runs every minute to release expired seat locks

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check database credentials in `application.yml`
- Ensure database `ticketbooking` exists

### JWT Token Issues
- Verify `JWT_SECRET` is set and at least 32 characters
- Check token expiration settings

### WebSocket Connection Issues
- Verify CORS settings allow your frontend origin
- Check WebSocket endpoint is accessible

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues and questions, please open an issue on GitHub.

