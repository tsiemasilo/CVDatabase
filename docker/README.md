# Docker Deployment Guide

This directory contains Docker configuration for deploying the CV Database application with separate frontend and backend containers.

## Prerequisites
- Docker Desktop installed
- Production database URL

## Setup Instructions

1. **Create environment file**:
   ```bash
   cd docker
   cp .env.example .env
   ```

2. **Edit the .env file** with your production database URL:
   ```
   NETLIFY_DATABASE_URL=your_production_database_url_here
   ```

3. **Build and run the containers**:
   ```bash
   docker-compose up --build
   ```

4. **Access the application**:
   - Frontend: http://localhost
   - Backend API: http://localhost:5000

## Container Architecture

- **Frontend Container**: Nginx serving built React application on port 80
- **Backend Container**: Node.js Express server on port 5000
- **Database**: Connects to external production PostgreSQL database

## Commands

- **Start services**: `docker-compose up -d`
- **Stop services**: `docker-compose down`
- **View logs**: `docker-compose logs -f`
- **Rebuild**: `docker-compose up --build`

## Health Checks

Both containers include health checks that monitor:
- Backend: API endpoint availability
- Frontend: Nginx server status