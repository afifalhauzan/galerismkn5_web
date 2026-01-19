import { useMemo } from 'react';
import { StatsResponse } from '../../../types/karya';

export function useKaryaStatisticsFilter(stats: StatsResponse | null, searchTerm: string) {
  return useMemo(() => {
    if (!stats || !searchTerm.trim()) {
      return stats;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    
    const filteredData = stats.data.map(jurusan => {
      // Check if jurusan name matches
      const jurusanMatches = 
        jurusan.jurusan_nama.toLowerCase().includes(searchLower) ||
        jurusan.jurusan_singkatan.toLowerCase().includes(searchLower);

      // Filter kelas within jurusan
      const filteredKelas = jurusan.kelas.map(kelas => {
        // Check if kelas name matches
        const kelasMatches = kelas.nama_kelas.toLowerCase().includes(searchLower);

        // Filter students within kelas
        const filteredSubmitted = kelas.students_submitted.filter(student => 
          student.name.toLowerCase().includes(searchLower) ||
          student.nis.toLowerCase().includes(searchLower)
        );

        const filteredPending = kelas.students_pending.filter(student => 
          student.name.toLowerCase().includes(searchLower) ||
          student.nis.toLowerCase().includes(searchLower)
        );

        // Include kelas if it matches search or has matching students
        const hasMatchingStudents = filteredSubmitted.length > 0 || filteredPending.length > 0;
        
        if (kelasMatches || hasMatchingStudents) {
          return {
            ...kelas,
            students_submitted: filteredSubmitted,
            students_pending: filteredPending,
            submitted_count: filteredSubmitted.length,
            pending_count: filteredPending.length,
            total_siswa: filteredSubmitted.length + filteredPending.length,
            percentage_submitted: filteredSubmitted.length + filteredPending.length > 0 
              ? (filteredSubmitted.length / (filteredSubmitted.length + filteredPending.length)) * 100 
              : 0
          };
        }
        
        return null;
      }).filter(Boolean);

      // Include jurusan if it matches search or has matching kelas
      if (jurusanMatches || filteredKelas.length > 0) {
        const totalStudents = filteredKelas.reduce((sum, kelas) => sum + (kelas?.total_siswa || 0), 0);
        const totalSubmitted = filteredKelas.reduce((sum, kelas) => sum + (kelas?.submitted_count || 0), 0);
        const totalPending = filteredKelas.reduce((sum, kelas) => sum + (kelas?.pending_count || 0), 0);
        
        return {
          ...jurusan,
          kelas: filteredKelas,
          total_siswa: totalStudents,
          total_submitted: totalSubmitted,
          total_pending: totalPending,
          percentage_submitted: totalStudents > 0 ? (totalSubmitted / totalStudents) * 100 : 0
        };
      }
      
      return null;
    }).filter(Boolean);

    // Recalculate summary for filtered data
    const filteredSummary = {
      ...stats.summary,
      grand_total_siswa: filteredData.reduce((sum, jurusan) => sum + (jurusan?.total_siswa || 0), 0),
      grand_total_submitted: filteredData.reduce((sum, jurusan) => sum + (jurusan?.total_submitted || 0), 0),
      grand_total_pending: filteredData.reduce((sum, jurusan) => sum + (jurusan?.total_pending || 0), 0),
    };
    
    filteredSummary.grand_percentage_submitted = filteredSummary.grand_total_siswa > 0 
      ? (filteredSummary.grand_total_submitted / filteredSummary.grand_total_siswa) * 100 
      : 0;

    return {
      ...stats,
      data: filteredData,
      summary: filteredSummary
    } as StatsResponse;
  }, [stats, searchTerm]);
}