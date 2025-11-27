-- Database initialization script for Ticket Booking System
-- This script is optional as JPA will auto-create tables with ddl-auto: update
-- Use this for manual database setup or reference

-- Create database (run as postgres superuser)
-- CREATE DATABASE ticketbooking;

-- Connect to database
-- \c ticketbooking;

-- Roles table will be auto-created, but here's the structure:
-- CREATE TABLE IF NOT EXISTS roles (
--     id BIGSERIAL PRIMARY KEY,
--     name VARCHAR(50) NOT NULL UNIQUE
-- );

-- Users table structure (auto-created by JPA)
-- CREATE TABLE IF NOT EXISTS users (
--     id BIGSERIAL PRIMARY KEY,
--     email VARCHAR(255) NOT NULL UNIQUE,
--     password VARCHAR(255) NOT NULL,
--     name VARCHAR(255) NOT NULL,
--     phone VARCHAR(50),
--     created_at TIMESTAMP,
--     updated_at TIMESTAMP
-- );

-- User roles junction table
-- CREATE TABLE IF NOT EXISTS user_roles (
--     user_id BIGINT REFERENCES users(id),
--     role_id BIGINT REFERENCES roles(id),
--     PRIMARY KEY (user_id, role_id)
-- );

-- Insert default roles (handled by DataInitializer, but can be done manually)
-- INSERT INTO roles (name) VALUES ('USER'), ('ADMIN') ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_event_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_show_event_id ON shows(event_id);
CREATE INDEX IF NOT EXISTS idx_seat_show_id ON seats(show_id);
CREATE INDEX IF NOT EXISTS idx_seat_lock_show_id ON seat_locks(show_id);
CREATE INDEX IF NOT EXISTS idx_seat_lock_user_id ON seat_locks(user_id);
CREATE INDEX IF NOT EXISTS idx_seat_lock_expires_at ON seat_locks(expires_at);
CREATE INDEX IF NOT EXISTS idx_booking_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_booking_show_id ON bookings(show_id);
CREATE INDEX IF NOT EXISTS idx_booking_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_payment_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_ticket_booking_id ON tickets(booking_id);

