<?php

namespace Database\Seeders;

use App\Models\Penilaian;
use App\Models\Proyek;
use App\Models\User;
use Illuminate\Database\Seeder;

class PenilaianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $proyeksDinilai = Proyek::where('status', 'dinilai')->get();
        $gurus = User::where('role', 'guru')->get();

        // Create penilaian for projects that have been assessed
        foreach ($proyeksDinilai as $proyek) {
            $randomGuru = $gurus->random();
            
            // Create random rating between 3-5 stars for sample data
            $rating = rand(3, 5);
            
            Penilaian::create([
                'proyek_id' => $proyek->id,
                'guru_id' => $randomGuru->id,
                'nilai_bintang' => $rating,
            ]);
        }

        // Add one more penilaian for demonstration with specific ratings
        $proyekTerkirim = Proyek::where('status', 'terkirim')->first();
        if ($proyekTerkirim && $gurus->count() > 0) {
            // Change status to dinilai first
            $proyekTerkirim->update(['status' => 'dinilai']);
            
            Penilaian::create([
                'proyek_id' => $proyekTerkirim->id,
                'guru_id' => $gurus->first()->id,
                'nilai_bintang' => 4,
            ]);
        }
    }
}
