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
                'nama' => 'Teknik Kendaraan Ringan',
                'singkatan' => 'TKR',
            ],
            [
                'nama' => 'Teknik Elektronika Industri',
                'singkatan' => 'TEI',
            ],
            [
                'nama' => 'Akuntansi',
                'singkatan' => 'AKL',
            ],
        ];

        foreach ($jurusans as $jurusan) {
            Jurusan::create($jurusan);
        }
    }
}
