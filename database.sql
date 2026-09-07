-- Portfolio Tracker Database Schema for MySQL Workbench
-- Database: portfolio_tracker

CREATE DATABASE IF NOT EXISTS `portfolio_tracker` 
  DEFAULT CHARACTER SET utf8mb4 
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `portfolio_tracker`;

-- Table 1: Admin Users (Secure salted bcrypt password hashing)
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table 2: Video Projects Tracker
CREATE TABLE IF NOT EXISTS `projects` (
  `id` VARCHAR(50) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `client_name` VARCHAR(100) NOT NULL,
  `service` VARCHAR(100) DEFAULT 'Video Editor',
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `budget` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `paid_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `payment_status` VARCHAR(50) NOT NULL DEFAULT 'Unpaid',
  `status` VARCHAR(50) NOT NULL DEFAULT 'In Progress',
  `youtube_link` VARCHAR(500) NULL,
  `raw_files_url` VARCHAR(500) NULL,
  `created_at` DATE NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table 3: Promotional Brand Deals Tracker
CREATE TABLE IF NOT EXISTS `promos` (
  `id` VARCHAR(50) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `client_name` VARCHAR(100) NOT NULL,
  `platform` VARCHAR(50) DEFAULT 'Instagram',
  `deliverables` VARCHAR(255) NULL,
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `paid_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `payment_status` VARCHAR(50) NOT NULL DEFAULT 'Unpaid',
  `status` VARCHAR(50) NOT NULL DEFAULT 'Pending',
  `link` VARCHAR(500) NULL,
  `notes` TEXT NULL,
  `created_at` DATE NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
