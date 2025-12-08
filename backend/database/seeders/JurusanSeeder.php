<?php

namespace Database\Seeders;

use App\Models\Jurusan;
use Illuminate\Database\Seeder;

class JurusanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jurusans = [
            ['nama' => 'Rekayasa Perangkat Lunak', 'singkatan' => 'RPL'],       // ID 1
            ['nama' => 'Teknik Komputer Jaringan', 'singkatan' => 'TKJ'],       // ID 2
            ['nama' => 'Desain Komunikasi Visual', 'singkatan' => 'DKV'],       // ID 3
            ['nama' => 'Animasi', 'singkatan' => 'Animasi'],                    // ID 4
            ['nama' => 'Kriya Kayu', 'singkatan' => 'KK'],                      // ID 5
            ['nama' => 'Kriya Tekstil', 'singkatan' => 'KT'],                   // ID 6
            ['nama' => 'Kriya Keramik', 'singkatan' => 'KKR'],                  // ID 7
            ['nama' => 'Tata Busana', 'singkatan' => 'TB'],                     // ID 8
        ];

        foreach ($jurusans as $jurusan) {
            Jurusan::create($jurusan);
        }
    }
}