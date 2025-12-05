<?php

namespace App\Http\Controllers;

use App\Models\Proyek;
use App\Models\Jurusan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProjekController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Proyek::with(['user', 'jurusan', 'penilaian']);

            // Filter by status if provided
            if ($request->has('status')) {
                $query->byStatus($request->status);
            }

            // Filter by jurusan if provided
            if ($request->has('jurusan_id')) {
                $query->where('jurusan_id', $request->jurusan_id);
            }

            // Search by title or description
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('judul', 'like', "%{$search}%")
                      ->orWhere('deskripsi', 'like', "%{$search}%");
                });
            }

            // Pagination
            $page = $request->get('page', 1);
            $limit = $request->get('limit', 10);
            
            $proyeks = $query->latest()
                           ->paginate($limit, ['*'], 'page', $page);

            return response()->json([
                'success' => true,
                'data' => $proyeks->items(),
                'pagination' => [
                    'current_page' => $proyeks->currentPage(),
                    'last_page' => $proyeks->lastPage(),
                    'per_page' => $proyeks->perPage(),
                    'total' => $proyeks->total(),
                    'from' => $proyeks->firstItem(),
                    'to' => $proyeks->lastItem(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch projects',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'judul' => 'required|string|max:255',
                'deskripsi' => 'required|string',
                'tautan_proyek' => 'nullable|url|max:500',
                'image_url' => 'nullable|url|max:500',
                'jurusan_id' => 'required|exists:jurusans,id',
                'status' => 'in:terkirim,dinilai',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $proyek = Proyek::create([
                'user_id' => Auth::id(),
                'jurusan_id' => $request->jurusan_id,
                'judul' => $request->judul,
                'deskripsi' => $request->deskripsi,
                'tautan_proyek' => $request->tautan_proyek,
                'image_url' => $request->image_url,
                'status' => $request->status ?? 'terkirim',
            ]);

            $proyek->load(['user', 'jurusan', 'penilaian']);

            return response()->json([
                'success' => true,
                'message' => 'Project created successfully',
                'data' => $proyek
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $proyek = Proyek::with(['user', 'jurusan', 'penilaian'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $proyek
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $proyek = Proyek::findOrFail($id);

            // Check if user owns this project or is admin
            if ($proyek->user_id !== Auth::id() && Auth::user()->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to update this project'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'judul' => 'sometimes|required|string|max:255',
                'deskripsi' => 'sometimes|required|string',
                'tautan_proyek' => 'nullable|url|max:500',
                'image_url' => 'nullable|url|max:500',
                'jurusan_id' => 'sometimes|required|exists:jurusans,id',
                'status' => 'sometimes|in:terkirim,dinilai',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $proyek->update($request->only([
                'judul', 'deskripsi', 'tautan_proyek', 'image_url', 'jurusan_id', 'status'
            ]));

            $proyek->load(['user', 'jurusan', 'penilaian']);

            return response()->json([
                'success' => true,
                'message' => 'Project updated successfully',
                'data' => $proyek
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $proyek = Proyek::findOrFail($id);

            // Check if user owns this project or is admin
            if ($proyek->user_id !== Auth::id() && Auth::user()->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to delete this project'
                ], 403);
            }

            $proyek->delete();

            return response()->json([
                'success' => true,
                'message' => 'Project deleted successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get projects by current authenticated user
     */
    public function myProjects(Request $request): JsonResponse
    {
        try {
            $query = Proyek::with(['jurusan', 'penilaian'])
                          ->where('user_id', Auth::id());

            // Filter by status if provided
            if ($request->has('status')) {
                $query->byStatus($request->status);
            }

            // Pagination
            $page = $request->get('page', 1);
            $limit = $request->get('limit', 10);
            
            $proyeks = $query->latest()
                           ->paginate($limit, ['*'], 'page', $page);

            return response()->json([
                'success' => true,
                'data' => $proyeks->items(),
                'pagination' => [
                    'current_page' => $proyeks->currentPage(),
                    'last_page' => $proyeks->lastPage(),
                    'per_page' => $proyeks->perPage(),
                    'total' => $proyeks->total(),
                    'from' => $proyeks->firstItem(),
                    'to' => $proyeks->lastItem(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user projects',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
