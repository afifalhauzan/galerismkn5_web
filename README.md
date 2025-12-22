# Galeri Proyek Akhir SMKN 5 Malang

Platform terpusat untuk pengumpulan, pameran (showcase), dan penilaian proyek akhir siswa SMKN 5 Malang. Sistem ini dirancang dengan arsitektur decoupled untuk memastikan performa tinggi, keamanan data, dan skalabilitas.

---

## 🚀 Fitur Utama

* Public Gallery: Showcase karya siswa yang dapat diakses oleh publik tanpa login.
* Student Dashboard: Pengunggahan tautan proyek (GDrive/Youtube/Github) dan pemantauan status nilai.
* Teacher Dashboard: Peninjauan proyek berdasarkan jurusan dan pemberian nilai sistem bintang (1-5).
* Super Admin (Kepsek/Waka): Manajemen pengguna dan kontrol penuh terhadap hak akses (Role Management).
* PWA Ready: Dapat diinstal di perangkat Android/iOS untuk akses cepat seperti aplikasi native.

---

## 🛠️ Tech Stack

### Frontend
* Framework: Next.js 14+ (App Router)
* Styling: Tailwind CSS
* State Management: React Hooks & Context API
* Capabilities: Progressive Web App (PWA)

### Backend (API)
* Framework: Laravel 11 (API-only mode)
* Authentication: Laravel Sanctum (Stateful & Token-based)
* Database: MySQL 8.0

### DevOps & Infrastructure
* Containerization: Docker & Docker Compose
* Web Server/Proxy: Caddy / Nginx (Optimized for Reverse Proxy)
* Deployment: Git-based workflow

---

## 📂 Struktur Monorepo

.
├── backend/            # Laravel API Source Code
├── frontend/           # Next.js Frontend Source Code
├── docker-compose.yml  # Docker Orchestration
└── README.md

---

## ⚙️ Kebutuhan Server (Minimum)

* OS: Linux (Ubuntu 20.04+ direkomendasikan)
* RAM: 2 GB
* Storage: 20 GB (Hanya metadata, file utama di-host di layanan eksternal)
* Dependencies: Docker Engine & Docker Compose

---

## 🚀 Panduan Instalasi (Produksi)

Sistem ini dikemas menggunakan Docker untuk memastikan isolasi lingkungan dan kemudahan deployment.

1. Kloning Repositori
git clone https://github.com/afifalhauzan/galerismkn5_web.git
cd galerismkn5_web

2. Konfigurasi Environment
Salin file .env.example menjadi .env di masing-masing folder (backend & frontend) dan sesuaikan variabelnya (DB Credentials, APP_KEY, API URL).

3. Build dan Jalankan Container
docker compose up -d --build

4. Setup Database (Sekali Saja)
docker compose exec backend php artisan migrate --seed

---

## 🌐 Konfigurasi Domain & SSL

Sistem ini direkomendasikan berjalan di belakang Reverse Proxy (seperti Caddy atau Nginx).

Contoh Konfigurasi Caddyfile:
karya.smkn5malang.sch.id {
    # Frontend (Next.js)
    reverse_proxy localhost:3000
    
    # Backend API (Laravel)
    reverse_proxy /api/* localhost:8000
}

---

## 📄 Lisensi

Dikembangkan oleh Tim Capstone/PKL SMKN 5 Malang (2025).
