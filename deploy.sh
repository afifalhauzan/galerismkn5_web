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
# docker compose -f docker-compose.prod.yaml down
docker compose -f docker-compose.prod.yaml up -d --build

echo "⏳ Waiting for database to be ready..."
sleep 15

echo "🔧 Running Laravel setup commands..."
# Run database setup
# docker compose -f docker-compose.prod.yaml exec backend php artisan migrate --force
# docker compose -f docker-compose.prod.yaml exec backend php artisan db:seed --force

# Optimize for production
docker compose -f docker-compose.prod.yaml exec backend php artisan config:cache
docker compose -f docker-compose.prod.yaml exec backend php artisan route:cache
docker compose -f docker-compose.prod.yaml exec backend php artisan view:cache

# echo "🔒 Setting proper permissions..."
# docker compose -f docker-compose.prod.yaml exec backend chown -R www-data:www-data /var/www/html/storage

echo "✅ Deployment completed!"
echo "   Frontend: 3001"
echo "   Backend:  8001"
echo "   MySQL:    3307"
echo "   Redis:    6380"