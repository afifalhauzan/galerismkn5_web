<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Jurusan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        // Create admin user
        User::create([
            'name' => 'Admin SMKN 5',
            'email' => 'admin@smkn5.com',
            'nis_nip' => 'ADM001',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'jurusan_id' => null,
        ]);

        // Create guru users
        $gurus = [
            [
                'name' => 'Budi Santoso',
                'email' => 'budi.santoso@smkn5.com',
                'nis_nip' => 'NIP001',
                'password' => Hash::make('password'),
                'role' => 'guru',
                'jurusan_id' => 1, // Contoh: Ketua Jurusan RPL
            ],
            [
                'name' => 'Siti Rahayu',
                'email' => 'siti.rahayu@smkn5.com',
                'nis_nip' => 'NIP002',
                'password' => Hash::make('password'),
                'role' => 'guru',
                'jurusan_id' => 3, // Contoh: Guru DKV
            ],
            [
                'name' => 'Ahmad Fauzi',
                'email' => 'ahmad.fauzi@smkn5.com',
                'nis_nip' => 'NIP003',
                'password' => Hash::make('password'),
                'role' => 'guru',
                'jurusan_id' => 8, // Contoh: Guru Tata Busana
            ],
        ];

        foreach ($gurus as $guru) {
            User::create($guru);
        }

        // Create siswa users
        $siswaData = [
            // --- Siswa RPL (ID 1) ---
            [ 'name' => 'Andi Pratama', 'email' => 'andi.pratama@student.smkn5.com', 'nis_nip' => 'NIS001', 'jurusan_id' => 1, 'kelas' => '10' ],
            [ 'name' => 'Dewi Sari', 'email' => 'dewi.sari@student.smkn5.com', 'nis_nip' => 'NIS002', 'jurusan_id' => 1, 'kelas' => '11' ],
            [ 'name' => 'Bambang Sudiro', 'email' => 'bambang.sudiro@student.smkn5.com', 'nis_nip' => 'NIS007', 'jurusan_id' => 1, 'kelas' => '12' ],

            // --- Siswa TKJ (ID 2) ---
            [ 'name' => 'Rizky Ramadhan', 'email' => 'rizky.ramadhan@student.smkn5.com', 'nis_nip' => 'NIS003', 'jurusan_id' => 2, 'kelas' => '12' ],
            [ 'name' => 'Maya Sari', 'email' => 'maya.sari@student.smkn5.com', 'nis_nip' => 'NIS004', 'jurusan_id' => 2, 'kelas' => '10' ],
            [ 'name' => 'Cahyo Utomo', 'email' => 'cahyo.utomo@student.smkn5.com', 'nis_nip' => 'NIS008', 'jurusan_id' => 2, 'kelas' => '11' ],
            
            // --- Siswa DKV (ID 3) ---
            [ 'name' => 'Joko Susilo', 'email' => 'joko.susilo@student.smkn5.com', 'nis_nip' => 'NIS005', 'jurusan_id' => 3, 'kelas' => '11' ], // Asumsi TKR diubah ke DKV di contoh Anda, saya kembalikan ke Joko di DKV
            [ 'name' => 'Rina Wati', 'email' => 'rina.wati@student.smkn5.com', 'nis_nip' => 'NIS006', 'jurusan_id' => 3, 'kelas' => '12' ], // Asumsi TKR diubah ke DKV di contoh Anda, saya kembalikan ke Rina di DKV
            [ 'name' => 'Dian Kusuma', 'email' => 'dian.kusuma@student.smkn5.com', 'nis_nip' => 'NIS009', 'jurusan_id' => 3, 'kelas' => '10' ],
            
            // --- Siswa Animasi (ID 4) ---
            [ 'name' => 'Tomi Hartono', 'email' => 'tomi.hartono@student.smkn5.com', 'nis_nip' => 'NIS010', 'jurusan_id' => 4, 'kelas' => '12' ],
            [ 'name' => 'Lina Wijaya', 'email' => 'lina.wijaya@student.smkn5.com', 'nis_nip' => 'NIS011', 'jurusan_id' => 4, 'kelas' => '11' ],

            // --- Siswa Kriya Kayu (ID 5) ---
            [ 'name' => 'Slamet Riyadi', 'email' => 'slamet.riyadi@student.smkn5.com', 'nis_nip' => 'NIS012', 'jurusan_id' => 5, 'kelas' => '10' ],

            // --- Siswa Kriya Tekstil (ID 6) ---
            [ 'name' => 'Nisa Farida', 'email' => 'nisa.farida@student.smkn5.com', 'nis_nip' => 'NIS013', 'jurusan_id' => 6, 'kelas' => '11' ],
            
            // --- Siswa Kriya Keramik (ID 7) ---
            [ 'name' => 'Fajar Abadi', 'email' => 'fajar.abadi@student.smkn5.com', 'nis_nip' => 'NIS014', 'jurusan_id' => 7, 'kelas' => '12' ],
            
            // --- Siswa Tata Busana (ID 8) ---
            [ 'name' => 'Gita Kirana', 'email' => 'gita.kirana@student.smkn5.com', 'nis_nip' => 'NIS015', 'jurusan_id' => 8, 'kelas' => '10' ],
        ];

        foreach ($siswaData as $siswa) {
            User::create([
                'name' => $siswa['name'],
                'email' => $siswa['email'],
                'nis_nip' => $siswa['nis_nip'],
                'password' => Hash::make('password'),
                'role' => 'siswa',
                'jurusan_id' => $siswa['jurusan_id'],
                'kelas' => $siswa['kelas'],
            ]);
        }
    }
}