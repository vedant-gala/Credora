-- Credora Database Schema
-- This file contains all the necessary tables for the application

-- Enable UUID extension
-- This is a PostgreSQL extension that allows functions to generate UUIDs (Universally Unique Idenifiers)
-- A UUID is designed to be globally unique across time and space, which means : 
--   a) No two UUIDs will never be the same (practically guaranteed)
--   b) They can be generated without co-ordination between systems
--   c) They're 36 chars long (including hypens)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

