-- Complete database reset script
-- WARNING: This will drop and recreate all tables, losing all data

DROP DATABASE IF EXISTS lms_db;
CREATE DATABASE lms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE lms_db;

-- Run schema creation
SOURCE schema/01_create_tables.sql;

-- Run sample data
SOURCE data/01_sample_skills.sql;
SOURCE data/02_sample_projects.sql;
SOURCE data/03_sample_labours.sql;
SOURCE data/04_sample_assignments.sql;
SOURCE data/05_sample_ratings.sql;
