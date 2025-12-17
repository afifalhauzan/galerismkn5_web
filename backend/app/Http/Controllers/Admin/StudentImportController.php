<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Imports\SiswaImport;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Validators\ValidationException;
use Maatwebsite\Excel\Concerns\FromArray;

class StudentImportController extends Controller
{
    /**
     * Import students from Excel file
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function import(Request $request): JsonResponse
    {
        try {
            // Validate the request has a file
            $request->validate([
                'file' => 'required|file|mimes:xlsx,xls,csv|max:10240' // 10MB max
            ]);

            $file = $request->file('file');

            // Create import instance
            $import = new SiswaImport();

            // Execute the import
            Excel::import($import, $file);

            // Get import statistics
            $importedCount = $import->getImportedCount();
            $errorCount = $import->getErrorCount();
            $totalRows = $importedCount + $errorCount;

            // Prepare response message
            $message = "Import completed successfully";
            if ($errorCount > 0) {
                $message .= " with {$errorCount} errors";
            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => [
                    'total_rows' => $totalRows,
                    'imported_rows' => $importedCount,
                    'error_rows' => $errorCount,
                    'success_rate' => $totalRows > 0 ? round(($importedCount / $totalRows) * 100, 2) : 0
                ]
            ], 200);

        } catch (ValidationException $e) {
            // Handle validation errors from Excel import
            $errors = [];
            foreach ($e->errors() as $error) {
                $errors[] = $error;
            }

            Log::error('Excel validation errors', ['errors' => $errors]);

            return response()->json([
                'success' => false,
                'message' => 'Validation errors found in Excel file',
                'errors' => $errors
            ], 422);

        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle request validation errors
            return response()->json([
                'success' => false,
                'message' => 'Invalid file upload',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            Log::error('Student import error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred during import: ' . $e->getMessage(),
                'error_details' => app()->isLocal() ? $e->getTraceAsString() : null
            ], 500);
        }
    }

    /**
     * Download template Excel file
     *
     * @return \Illuminate\Http\Response
     */
    public function downloadTemplate()
    {
        try {
            // Create template with correct column headers as specified
            $headers = [
                ['No', 'NIS', 'Nama Lengkap', 'Jenis Kelamin', 'Nama Kelas'],
                [1, '2407001', 'Ahmad Fauzan', 'L', '10 TKJT I'],
                [2, '2407002', 'Bayu Prakoso', 'L', '10 TKJT I'],
                [3, '2407003', 'Cindy Aulia', 'P', '10 TKJT II'],
                [4, '2407004', 'Dedi Kurniawan', 'L', '11 RPL I'],
                [5, '2407005', 'Erlinda Sari', 'P', '10 DKV I'],
                [6, '2407011', 'Kiki Amalia', 'P', '11 TKJT I'],
                [7, '2407012', 'Lukman Hakim', 'L', '10 RPL II'],
                [8, '2407013', 'Mawar Melati', 'P', '12 KK I'],
            ];

            $filename = 'template_import_siswa.xlsx';

            // Create and download the Excel file
            return Excel::download(new class($headers) implements FromArray {
                protected $data;

                public function __construct($data) {
                    $this->data = $data;
                }

                public function array(): array {
                    return $this->data;
                }
            }, $filename);

        } catch (\Exception $e) {
            Log::error('Template download error', [
                'message' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error generating template: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get import status/statistics
     *
     * @return JsonResponse
     */
    public function getImportStatus(): JsonResponse
    {
        try {
            // Get basic statistics
            $totalSiswa = \App\Models\User::where('role', 'siswa')->count();
            $activeSiswa = \App\Models\User::where('role', 'siswa')->where('is_active', true)->count();
            $inactiveSiswa = \App\Models\User::where('role', 'siswa')->where('is_active', false)->count();

            // Get recent imports (students with null email - indicating imported)
            $recentImports = \App\Models\User::where('role', 'siswa')
                ->whereNull('email')
                ->where('created_at', '>=', now()->subDays(7))
                ->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'total_siswa' => $totalSiswa,
                    'active_siswa' => $activeSiswa,
                    'inactive_siswa' => $inactiveSiswa,
                    'recent_imports_7_days' => $recentImports,
                    'import_guidelines' => [
                        'required_columns' => ['No', 'NIS', 'Nama Lengkap', 'Jenis Kelamin', 'Nama Kelas'],
                        'gender_options' => ['L', 'P', 'Laki-laki', 'Perempuan'],
                        'class_examples' => ['10 RPL I', '11 TKJT II', '12 DKV I', '10 Animasi I'],
                        'security_note' => 'Imported students are inactive by default and have no email/password',
                        'max_file_size' => '10MB',
                        'supported_formats' => ['xlsx', 'xls', 'csv']
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Import status error', [
                'message' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error retrieving import status: ' . $e->getMessage()
            ], 500);
        }
    }
}