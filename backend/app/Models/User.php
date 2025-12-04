<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'nis_nip',
        'role',
        'jurusan_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Check if user is a guru (teacher)
     */
    public function isGuru(): bool
    {
        return $this->role === 'guru';
    }

    /**
     * Check if user is a siswa (student)
     */
    public function isSiswa(): bool
    {
        return $this->role === 'siswa';
    }

    /**
     * Check if user is an admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Get the jurusan that the student belongs to
     */
    public function jurusan()
    {
        return $this->belongsTo(Jurusan::class);
    }

    /**
     * Get the proyeks created by this user (siswa)
     */
    public function proyeks()
    {
        return $this->hasMany(Proyek::class);
    }

    /**
     * Get the penilaians given by this user (guru)
     */
    public function penilaians()
    {
        return $this->hasMany(Penilaian::class, 'guru_id');
    }

    /**
     * Scope to get only guru users
     */
    public function scopeGuru($query)
    {
        return $query->where('role', 'guru');
    }

    /**
     * Scope to get only siswa users
     */
    public function scopeSiswa($query)
    {
        return $query->where('role', 'siswa');
    }
}
