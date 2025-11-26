<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/**
 * Authentication Routes
 * These routes handle user registration, login, and authentication
 */

// Public authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/**
 * Protected Routes
 * These routes require authentication via Sanctum token
 */
Route::middleware(['auth:sanctum'])->group(function () {
    // User management
    Route::get('/user', [AuthController::class, 'me'])->name('user.me');
    Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
    Route::post('/logout-all', [AuthController::class, 'logoutAll'])->name('auth.logout.all');
    
    /**
     * Get user profile information
     * Returns detailed user profile data including role information
     */
    Route::get('/profile', function (Request $request) {
        $user = $request->user();
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'is_guru' => $user->isGuru(),
            'is_siswa' => $user->isSiswa(),
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ]);
    })->name('user.profile');
});
