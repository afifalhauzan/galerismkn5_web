<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Penilaian;
use App\Models\Proyek;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class PenilaianController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        
        // Only allow guru to see their penilaians
        if ($user->role !== 'guru') {
            return response()->json([
                'success' => false,
                'message' => 'Only teachers can access grading data'
            ], 403);
        }

        $penilaians = Penilaian::with(['proyek.user', 'guru'])
            ->where('guru_id', $user->id)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $penilaians
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Check if user is a teacher
        if ($user->role !== 'guru') {
            return response()->json([
                'success' => false,
                'message' => 'Only teachers can grade projects'
            ], 403);
        }

        $validated = $request->validate([
            'proyek_id' => 'required|exists:proyeks,id',
            'nilai' => 'required|integer|min:0|max:100',
            'catatan' => 'nullable|string|max:1000'
        ]);

        // Get the project and check jurusan
        $proyek = Proyek::with('jurusan')->findOrFail($validated['proyek_id']);
        
        // Check if teacher's jurusan matches project's jurusan
        if ($user->jurusan_id !== $proyek->jurusan_id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only grade projects from your department'
            ], 403);
        }

        // Check if already graded
        $existingPenilaian = Penilaian::where('proyek_id', $validated['proyek_id'])->first();
        if ($existingPenilaian) {
            return response()->json([
                'success' => false,
                'message' => 'This project has already been graded'
            ], 409);
        }

        // Create penilaian
        $penilaian = Penilaian::create([
            'proyek_id' => $validated['proyek_id'],
            'guru_id' => $user->id,
            'nilai' => $validated['nilai'],
            'catatan' => $validated['catatan']
        ]);

        // Update project status to 'dinilai'
        $proyek->update(['status' => 'dinilai']);

        // Load relationships
        $penilaian->load(['proyek.user', 'guru']);

        return response()->json([
            'success' => true,
            'message' => 'Project graded successfully',
            'data' => $penilaian
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $penilaian = Penilaian::with(['proyek.user', 'guru'])->findOrFail($id);
        $user = Auth::user();

        // Check permissions: only the grader, project owner, or admin can view
        if ($user->role !== 'admin' && 
            $user->id !== $penilaian->guru_id && 
            $user->id !== $penilaian->proyek->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to view this grading'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $penilaian
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = Auth::user();
        $penilaian = Penilaian::with('proyek')->findOrFail($id);

        // Check if user is the original grader or admin
        if ($user->role !== 'admin' && $user->id !== $penilaian->guru_id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only update your own gradings'
            ], 403);
        }

        // Check if teacher's jurusan still matches project's jurusan (in case of transfers)
        if ($user->role === 'guru' && $user->jurusan_id !== $penilaian->proyek->jurusan_id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only grade projects from your department'
            ], 403);
        }

        $validated = $request->validate([
            'nilai' => 'required|integer|min:0|max:100',
            'catatan' => 'nullable|string|max:1000'
        ]);

        $penilaian->update($validated);
        $penilaian->load(['proyek.user', 'guru']);

        return response()->json([
            'success' => true,
            'message' => 'Grading updated successfully',
            'data' => $penilaian
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = Auth::user();
        $penilaian = Penilaian::with('proyek')->findOrFail($id);

        // Only admin or the original grader can delete
        if ($user->role !== 'admin' && $user->id !== $penilaian->guru_id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only delete your own gradings'
            ], 403);
        }

        // Update project status back to 'terkirim'
        $penilaian->proyek->update(['status' => 'terkirim']);
        
        $penilaian->delete();

        return response()->json([
            'success' => true,
            'message' => 'Grading deleted successfully'
        ]);
    }

    /**
     * Check if user can grade a specific project
     */
    public function checkGradingPermission(Request $request)
    {
        $user = Auth::user();
        $proyekId = $request->input('proyek_id');

        if ($user->role !== 'guru') {
            return response()->json([
                'success' => false,
                'can_grade' => false,
                'message' => 'Only teachers can grade projects'
            ]);
        }

        $proyek = Proyek::with('jurusan')->findOrFail($proyekId);
        $canGrade = $user->jurusan_id === $proyek->jurusan_id;
        $alreadyGraded = Penilaian::where('proyek_id', $proyekId)->exists();

        return response()->json([
            'success' => true,
            'can_grade' => $canGrade && !$alreadyGraded,
            'same_jurusan' => $canGrade,
            'already_graded' => $alreadyGraded,
            'message' => $canGrade 
                ? ($alreadyGraded ? 'Project already graded' : 'You can grade this project')
                : 'You can only grade projects from your department'
        ]);
    }
}
