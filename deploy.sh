#!/bin/bash

# Production Deployment Script for Galeri SMKN5
echo "🚀 Starting production deployment..."

# 1. Cek file .env
if [ ! -f .env ]; then
    echo "❌ .env file not found! Please copy .env.example to .env and configure it."
    exit 1
fi

# 2. Tarik kode terbaru dari git (Opsional, aktifkan jika mau auto-pull)
# echo "📥 Pulling latest code..."
# git config core.fileMode false
# git pull origin main

# 3. Build & Restart Container
echo "📦 Building and starting containers..."
docker compose -f docker-compose.prod.yaml up -d --build

echo "⏳ Waiting for database to be ready..."
sleep 10

# 4. Setup Laravel
echo "🔧 Running Laravel setup commands..."

# Bersihkan cache lama dulu (PENTING)
docker compose -f docker-compose.prod.yaml exec backend php artisan optimize:clear

# Cache config baru
docker compose -f docker-compose.prod.yaml exec backend php artisan config:cache
docker compose -f docker-compose.prod.yaml exec backend php artisan route:cache
docker compose -f docker-compose.prod.yaml exec backend php artisan view:cache

# Generate Storage Link (Agar gambar tidak 404)
docker compose -f docker-compose.prod.yaml exec backend php artisan storage:link

# Migrasi Database
docker compose -f docker-compose.prod.yaml exec backend php artisan migrate

# 5. FIX PERMISSION (JANGAN DI-COMMENT!)
# Ini solusi untuk Error 500 saat upload
echo "🔒 Setting proper permissions..."
docker compose -f docker-compose.prod.yaml exec backend chown -R www-data:www-data /var/www/html/storage
docker compose -f docker-compose.prod.yaml exec backend chmod -R 775 /var/www/html/storage

echo "✅ Deployment completed!"
echo "   Frontend: 3001"
echo "   Backend:  8001"