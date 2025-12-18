<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SiswaController extends Controller
{
    /**
     * Get kelas by jurusan ID
     */
    public function getKelasByJurusan(Request $request): JsonResponse
    {
        try {
            $jurusanId = $request->get('jurusan_id');

            if (!$jurusanId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Jurusan ID is required'
                ], 400);
            }

            $kelas = Kelas::where('jurusan_id', $jurusanId)
                ->orderBy('tingkat')
                ->orderBy('nomor_kelas')
                ->get(['id', 'nama_kelas', 'tingkat', 'nomor_kelas']);

            return response()->json([
                'success' => true,
                'data' => $kelas
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch kelas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all available kelas grouped by tingkat and jurusan
     */
    public function getAllKelas(): JsonResponse
    {
        try {
            $kelas = Kelas::with('jurusan:id,nama')
                ->orderBy('tingkat')
                ->orderBy('jurusan_id')
                ->orderBy('nomor_kelas')
                ->get(['id', 'nama_kelas', 'tingkat', 'nomor_kelas', 'jurusan_id']);

            return response()->json([
                'success' => true,
                'data' => $kelas
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch all kelas',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}