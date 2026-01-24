import React, { useState } from 'react';

interface TeacherExcelImportSectionProps {
    selectedFile: File | null;
    importStatus: {
        type: 'success' | 'error' | null;
        message: string;
    };
    isImporting: boolean;
    isDownloading: boolean;
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onImportExcel: () => Promise<void>;
    onDownloadTemplate: () => Promise<void>;
}

export default function TeacherExcelImportSection({
    selectedFile,
    importStatus,
    isImporting,
    isDownloading,
    onFileUpload,
    onImportExcel,
    onDownloadTemplate,
}: TeacherExcelImportSectionProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div 
                className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200 cursor-pointer hover:from-green-100 hover:to-emerald-100 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                            </svg>
                            Import Data Guru
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Upload file Excel untuk mengimpor data guru secara massal
                        </p>
                    </div>
                    <div className="flex items-center mt-3 sm:mt-0 sm:ml-4">
                        {isExpanded && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDownloadTemplate();
                                }}
                                disabled={isDownloading}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mr-3"
                            >
                                {isDownloading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Mengunduh...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Download Template
                                    </>
                                )}
                            </button>
                        )}
                        <svg 
                            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>
            
            {isExpanded && (
                <div className="px-6 py-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* File Upload Section */}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="teacher-excel-upload" className="block text-sm font-medium text-gray-700 mb-2">
                                    Pilih File Excel
                                </label>
                                <div className="relative">
                                    <input
                                        id="teacher-excel-upload"
                                        type="file"
                                        accept=".xlsx,.xls,.csv"
                                        onChange={onFileUpload}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                                {selectedFile && (
                                    <div className="mt-2 flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="font-medium">File terpilih:</span>
                                        <span className="ml-1 truncate">{selectedFile.name}</span>
                                        <span className="ml-2 text-gray-400">
                                            ({(selectedFile.size / 1024).toFixed(1)} KB)
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            <button
                                onClick={onImportExcel}
                                disabled={!selectedFile || isImporting}
                                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isImporting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Mengimpor...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                        Import Excel
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Instructions Section */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                                <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Petunjuk Penggunaan
                            </h3>
                            <div className="space-y-2 text-xs text-gray-600">
                                <div className="flex items-start">
                                    <span className="flex-shrink-0 w-4 h-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span>
                                    <span>Download template Excel terlebih dahulu</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="flex-shrink-0 w-4 h-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span>
                                    <span>Isi data guru sesuai format yang tersedia</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="flex-shrink-0 w-4 h-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</span>
                                    <span>Upload file dan tunggu proses import selesai</span>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-500 font-medium">Format yang didukung:</p>
                                <p className="text-xs text-gray-500">.xlsx, .xls, .csv (maksimal 10MB)</p>
                                <p className="text-xs text-gray-500 mt-1 font-medium">Kolom yang diperlukan:</p>
                                <p className="text-xs text-gray-500">NIP, Nama Lengkap</p>
                                <p className="text-xs text-gray-500 mt-1 font-medium">Catatan:</p>
                                <p className="text-xs text-gray-500">Email auto-generate, password default "password"</p>
                            </div>
                        </div>
                    </div>

                    {/* Status Messages */}
                    {importStatus.message && (
                        <div className={`mt-4 rounded-md p-4 ${
                            importStatus.type === 'success' 
                                ? 'bg-green-50 border border-green-200' 
                                : 'bg-red-50 border border-red-200'
                        }`}>
                            <div className="flex">
                                {importStatus.type === 'success' ? (
                                    <svg className="w-5 h-5 text-green-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                                <p className={`text-sm ${
                                    importStatus.type === 'success' ? 'text-green-700' : 'text-red-700'
                                }`}>
                                    {importStatus.message}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}