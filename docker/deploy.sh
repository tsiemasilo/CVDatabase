#!/bin/bash

# Docker deployment script for CV Database Application

echo "🐳 Starting CV Database Docker Deployment..."

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Navigate to docker directory
cd "$(dirname "$0")"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit the .env file with your production database URL before continuing."
    echo "   Database URL should be: NETLIFY_DATABASE_URL=your_database_url_here"
    echo ""
    read -p "Press Enter after you've updated the .env file..."
fi

echo "🏗️  Building Docker containers..."
docker-compose build

echo "🚀 Starting application..."
docker-compose up -d

echo "✅ Deployment complete!"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:5000"
echo "   Health Check: http://localhost:5000/api/health"
echo ""
echo "📊 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"