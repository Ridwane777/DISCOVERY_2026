-- Database initialization for Discovery 2026
CREATE DATABASE IF NOT EXISTS discovery;
USE discovery;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role ENUM('super_admin', 'admin', 'user') NOT NULL DEFAULT 'user',
  password VARCHAR(255) NOT NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  avatarColor VARCHAR(50) DEFAULT 'bg-indigo-600',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sector VARCHAR(255),
  status ENUM('active', 'completed', 'paused') NOT NULL DEFAULT 'active',
  deliveryDate DATE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project Admins (Many-to-Many)
CREATE TABLE IF NOT EXISTS project_admins (
  projectId VARCHAR(36),
  userId VARCHAR(36),
  PRIMARY KEY (projectId, userId),
  FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Deliverables Table
CREATE TABLE IF NOT EXISTS deliverables (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  projectId VARCHAR(36) NOT NULL,
  format VARCHAR(50),
  deadline DATE,
  status ENUM('pending', 'received_ontime', 'late', 'upcoming') NOT NULL DEFAULT 'pending',
  assignedTo VARCHAR(36),
  uploadedBy VARCHAR(36),
  uploadedAt TIMESTAMP NULL,
  fileSize VARCHAR(50),
  FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (assignedTo) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (uploadedBy) REFERENCES users(id) ON DELETE SET NULL
);
-- Seed Users (Demo)
-- Password for all: password123 (hashed: $2a$10$7/zIDq.mR0A9e.K/9W9Bne0X0G5Jq70f5v6o.c.Bq0A.w1e7J.v1e)
INSERT INTO users (id, firstName, lastName, email, role, password, avatarColor) VALUES 
('admin-user-001', 'Marie', 'Dubois', 'superadmin@luxdev.lu', 'super_admin', '$2a$10$7/zIDq.mR0A9e.K/9W9Bne0X0G5Jq70f5v6o.c.Bq0A.w1e7J.v1e', 'bg-purple-600'),
('admin-user-002', 'Jean', 'Dupont', 'admin@luxdev.lu', 'admin', '$2a$10$7/zIDq.mR0A9e.K/9W9Bne0X0G5Jq70f5v6o.c.Bq0A.w1e7J.v1e', 'bg-blue-600'),
('admin-user-003', 'Paul', 'Roux', 'client@luxdev.lu', 'user', '$2a$10$7/zIDq.mR0A9e.K/9W9Bne0X0G5Jq70f5v6o.c.Bq0A.w1e7J.v1e', 'bg-emerald-600')
ON DUPLICATE KEY UPDATE email = email;
