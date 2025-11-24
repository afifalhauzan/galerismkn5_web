#!/bin/bash

# Production Deployment Script for Galeri SMKN5
echo "🚀 Starting production deployment..."

if [ ! -f .env ]; then
    echo "❌ .env file not found! Please copy .env.example to .env and configure it."
    exit 1
fi

source .env

echo "📦 Building and starting containers..."
# Using the new file name
docker compose -f docker-compose.prod.yaml down
docker compose -f docker-compose.prod.yaml up -d --build

echo "⏳ Waiting for database to be ready..."
sleep 20

echo "🔧 Running Laravel setup commands..."
# Optimized commands
docker compose -f docker-compose.prod.yaml exec backend php artisan config:cache
docker compose -f docker-compose.prod.yaml exec backend php artisan route:cache
docker compose -f docker-compose.prod.yaml exec backend php artisan view:cache
docker compose -f docker-compose.prod.yaml exec backend php artisan migrate --force

echo "🔒 Setting proper permissions..."
docker compose -f docker-compose.prod.yaml exec backend chown -R www-data:www-data /var/www/html/storage

echo "✅ Deployment completed!"
echo "📝 Services running on VPS (Host Ports):"
echo "   Frontend: http://localhost:3001"
echo "   Backend:  http://localhost:8001"
echo "   MySQL:    localhost:3307"
echo "   Redis:    localhost:6380"