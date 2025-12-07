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
                'jurusan_id' => null,
            ],
            [
                'name' => 'Siti Rahayu',
                'email' => 'siti.rahayu@smkn5.com',
                'nis_nip' => 'NIP002',
                'password' => Hash::make('password'),
                'role' => 'guru',
                'jurusan_id' => null,
            ],
            [
                'name' => 'Ahmad Fauzi',
                'email' => 'ahmad.fauzi@smkn5.com',
                'nis_nip' => 'NIP003',
                'password' => Hash::make('password'),
                'role' => 'guru',
                'jurusan_id' => null,
            ],
        ];

        foreach ($gurus as $guru) {
            User::create($guru);
        }

        // Create siswa users
        $jurusans = Jurusan::all();
        
        $siswaData = [
            // RPL Students
            [
                'name' => 'Andi Pratama',
                'email' => 'andi.pratama@student.smkn5.com',
                'nis_nip' => 'NIS001',
                'jurusan_id' => '1',
            ],
            [
                'name' => 'Dewi Sari',
                'email' => 'dewi.sari@student.smkn5.com',
                'nis_nip' => 'NIS002',
                'jurusan_id' => '1',
            ],
            // TKJ Students
            [
                'name' => 'Rizky Ramadhan',
                'email' => 'rizky.ramadhan@student.smkn5.com',
                'nis_nip' => 'NIS003',
                'jurusan_id' => '2',
            ],
            [
                'name' => 'Maya Sari',
                'email' => 'maya.sari@student.smkn5.com',
                'nis_nip' => 'NIS004',
                'jurusan_id' => '2',
            ],
            // TKR Students
            [
                'name' => 'Joko Susilo',
                'email' => 'joko.susilo@student.smkn5.com',
                'nis_nip' => 'NIS005',
                'jurusan_id' => '3',
            ],
            [
                'name' => 'Rina Wati',
                'email' => 'rina.wati@student.smkn5.com',
                'nis_nip' => 'NIS006',
                'jurusan_id' => '3',
            ],
        ];

        foreach ($siswaData as $siswa) {
            // $jurusan = $jurusans->where('nama', $siswa['jurusan_name'])->first();
            
            User::create([
                'name' => $siswa['name'],
                'email' => $siswa['email'],
                'nis_nip' => $siswa['nis_nip'],
                'password' => Hash::make('password'),
                'role' => 'siswa',
                'jurusan_id' => $siswa['jurusan_id'],
            ]);
        }
    }
}
