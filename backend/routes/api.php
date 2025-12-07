<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjekController;
use App\Http\Controllers\JurusanController;

/**
 * Authentication Routes
 * These routes handle user registration, login, and authentication
 */

// Public authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/**
 * Public Proyek Routes
 * These routes can be accessed without authentication for public viewing
 */
Route::get('/proyeks', [ProjekController::class, 'index'])->name('proyeks.index');
Route::get('/proyeks/{proyek}', [ProjekController::class, 'show'])->name('proyeks.show');

/**
 * Public Jurusan Routes
 * These routes provide access to department/major information for forms
 */
Route::get('/jurusans', [JurusanController::class, 'index'])->name('jurusans.index');
Route::get('/jurusans/{jurusan}', [JurusanController::class, 'show'])->name('jurusans.show');

/**
 * Protected Routes
 * These routes require authentication via Sanctum token
 */
Route::middleware(['auth:sanctum'])->group(function () {
    // User management
    Route::get('/user', [AuthController::class, 'me'])->name('user.me');
    Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
    Route::post('/logout-all', [AuthController::class, 'logoutAll'])->name('auth.logout.all');

    Route::get('/user-stats', [AuthController::class, 'userStats'])->name('user.stats');
    
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

    /**
     * Protected Proyek (Projects) Routes
     * CRUD operations that require authentication
     */
    Route::post('/proyeks', [ProjekController::class, 'store'])->name('proyeks.store');
    Route::put('/proyeks/{proyek}', [ProjekController::class, 'update'])->name('proyeks.update');
    Route::patch('/proyeks/{proyek}', [ProjekController::class, 'update'])->name('proyeks.update.patch');
    Route::delete('/proyeks/{proyek}', [ProjekController::class, 'destroy'])->name('proyeks.destroy');
    Route::get('/my-proyeks', [ProjekController::class, 'myProjects'])->name('proyeks.my');
});
