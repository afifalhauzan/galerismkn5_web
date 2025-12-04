<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Penilaian extends Model
{
    use HasFactory;

    protected $fillable = [
        'proyek_id',
        'guru_id',
        'nilai_bintang',
    ];

    protected $casts = [
        'nilai_bintang' => 'integer',
    ];

    /**
     * Get the proyek that this penilaian belongs to
     */
    public function proyek()
    {
        return $this->belongsTo(Proyek::class);
    }

    /**
     * Get the guru that gave this penilaian
     */
    public function guru()
    {
        return $this->belongsTo(User::class, 'guru_id');
    }

    /**
     * Scope to get penilaian by star rating
     */
    public function scopeByStars($query, $stars)
    {
        return $query->where('nilai_bintang', $stars);
    }

    /**
     * Scope to get high ratings (4-5 stars)
     */
    public function scopeHighRating($query)
    {
        return $query->whereIn('nilai_bintang', [4, 5]);
    }

    /**
     * Scope to get low ratings (1-2 stars)
     */
    public function scopeLowRating($query)
    {
        return $query->whereIn('nilai_bintang', [1, 2]);
    }
}
