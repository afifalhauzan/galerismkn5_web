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
            [
                'nama' => 'Rekayasa Perangkat Lunak',
                'singkatan' => 'RPL',
            ],
            [
                'nama' => 'Teknik Komputer Jaringan',
                'singkatan' => 'TKJ',
            ],
            [
                'nama' => 'Desain Komunikasi Visual',
                'singkatan' => 'DKV',
            ],
            [
                'nama' => 'Animasi',
                'singkatan' => 'Animasi',
            ],
            [
                'nama' => 'Kriya Kayu',
                'singkatan' => 'KK',
            ],
            [
                'nama' => 'Kriya Tekstil',
                'singkatan' => 'KT',
            ],
            [
                'nama' => 'Kriya Keramik',
                'singkatan' => 'KKR',
            ],
            [
                'nama' => 'Tata Busana',
                'singkatan' => 'TB',
            ],
        ];

        foreach ($jurusans as $jurusan) {
            Jurusan::create($jurusan);
        }
    }
}
