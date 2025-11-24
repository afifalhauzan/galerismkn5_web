<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create default admin user
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
            'password' => Hash::make('admin12345'),
        ]);

        // Create test siswa user
        User::factory()->create([
            'name' => 'Siswa User',
            'email' => 'siswa@example.com',
            'role' => 'siswa',
            'password' => Hash::make('siswa12345'),
        ]);

        // Create test guru user
        User::factory()->create([
            'name' => 'Guru User',
            'email' => 'guru@example.com',
            'role' => 'guru',
            'password' => Hash::make('guru12345'),
        ]);

        // Create additional random users for testing (only in development)
        if (app()->environment('local', 'development')) {
            User::factory(10)->create();
        }
    }
}
