<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'User',
            'email' => 'user@example.com',
            'password'=> 'user12345',
        ]);

        User::factory()->create([
            'name' => 'Siswa User',
            'email' => 'siswa@example.com',
            'role' => 'siswa',
            'password'=> 'siswa12345',
        ]);

        User::factory()->create([
            'name' => 'Guru User',
            'email' => 'guru@example.com',
            'role' => 'guru',
            'password'=> 'guru12345',
        ]);
    }
}
