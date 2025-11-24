#!/bin/bash

# Production Deployment Script for Galeri SMKN5
echo "🚀 Starting production deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found! Please copy .env.example to .env and configure it."
    exit 1
fi

# Load environment variables
source .env

# Validate required environment variables
if [ -z "$DB_PASSWORD" ]; then
    echo "❌ DB_PASSWORD is not set in .env file"
    exit 1
fi

if [ -z "$APP_URL" ]; then
    echo "❌ APP_URL is not set in .env file"
    exit 1
fi

echo "📦 Building and starting containers..."
docker-compose -f docker-compose.prod.yaml down
docker-compose -f docker-compose.prod.yaml build --no-cache
docker-compose -f docker-compose.prod.yaml up -d

echo "⏳ Waiting for database to be ready..."
sleep 30

echo "🔧 Running Laravel setup commands..."
docker-compose -f docker-compose.prod.yaml exec backend php artisan key:generate --force
docker-compose -f docker-compose.prod.yaml exec backend php artisan config:cache
docker-compose -f docker-compose.prod.yaml exec backend php artisan route:cache
docker-compose -f docker-compose.prod.yaml exec backend php artisan view:cache
docker-compose -f docker-compose.prod.yaml exec backend php artisan migrate --force

echo "🔒 Setting proper permissions..."
docker-compose -f docker-compose.prod.yaml exec backend chown -R www-data:www-data /var/www/html/storage
docker-compose -f docker-compose.prod.yaml exec backend chmod -R 775 /var/www/html/storage

echo "✅ Production deployment completed!"
echo "📝 Services running:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   MySQL: localhost:3306"
echo "   Redis: localhost:6379"
echo ""
echo "🔗 Configure your Caddy to proxy:"
echo "   yourdomain.com → localhost:3000 (Frontend)"
echo "   api.yourdomain.com → localhost:8000 (API)"