<?php

namespace Database\Seeders;

use App\Models\Proyek;
use App\Models\User;
use App\Models\Jurusan;
use Illuminate\Database\Seeder;

class ProyekSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $siswaUsers = User::where('role', 'siswa')->get();
        
        $proyekData = [
            [
                'judul' => 'Sistem Informasi Perpustakaan',
                'deskripsi' => 'Aplikasi web untuk mengelola data buku, peminjaman, dan pengembalian buku di perpustakaan sekolah. Dibuat menggunakan Laravel dan MySQL.',
                'tautan_proyek' => 'https://github.com/andipratama/sistem-perpustakaan',
                'status' => 'terkirim',
                'nis_nip' => 'NIS001', // Andi Pratama
            ],
            [
                'judul' => 'E-Commerce Sederhana',
                'deskripsi' => 'Aplikasi jual-beli online untuk produk lokal. Fitur include katalog produk, keranjang belanja, dan sistem pembayaran sederhana.',
                'tautan_proyek' => 'https://github.com/dewisari/ecommerce-app',
                'status' => 'dinilai',
                'nis_nip' => 'NIS002', // Dewi Sari
            ],
            [
                'judul' => 'Monitoring Jaringan Komputer',
                'deskripsi' => 'Sistem monitoring untuk memantau status perangkat jaringan di lab komputer. Menggunakan SNMP untuk monitoring real-time.',
                'tautan_proyek' => 'https://github.com/rizkyramadhan/network-monitoring',
                'status' => 'terkirim',
                'nis_nip' => 'NIS003', // Rizky Ramadhan
            ],
            [
                'judul' => 'Konfigurasi Server Web',
                'deskripsi' => 'Dokumentasi dan implementasi konfigurasi server web dengan Apache, PHP, dan MySQL untuk hosting website sekolah.',
                'tautan_proyek' => 'https://github.com/mayasari/web-server-config',
                'status' => 'dinilai',
                'nis_nip' => 'NIS004', // Maya Sari
            ],
            [
                'judul' => 'Sistem Diagnostik Kendaraan',
                'deskripsi' => 'Aplikasi mobile untuk diagnostik dasar kendaraan bermotor. Membantu teknisi dalam identifikasi masalah mesin.',
                'tautan_proyek' => 'https://github.com/jokosusilo/vehicle-diagnostic',
                'status' => 'terkirim',
                'nis_nip' => 'NIS005', // Joko Susilo
            ],
            [
                'judul' => 'Panduan Perawatan Kendaraan',
                'deskripsi' => 'Website informasi tentang tips perawatan kendaraan, jadwal service, dan panduan troubleshooting untuk pemilik kendaraan.',
                'tautan_proyek' => 'https://github.com/rinawati/vehicle-maintenance',
                'status' => 'terkirim',
                'nis_nip' => 'NIS006', // Rina Wati
            ],
        ];

        foreach ($proyekData as $data) {
            $siswa = $siswaUsers->where('nis_nip', $data['nis_nip'])->first();
            
            if ($siswa) {
                Proyek::create([
                    'user_id' => $siswa->id,
                    'jurusan_id' => $siswa->jurusan_id,
                    'judul' => $data['judul'],
                    'deskripsi' => $data['deskripsi'],
                    'tautan_proyek' => $data['tautan_proyek'],
                    'status' => $data['status'],
                ]);
            }
        }
    }
}
