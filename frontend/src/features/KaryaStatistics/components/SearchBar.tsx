import { useState, useCallback, useEffect } from 'react';
import { HiSearch, HiX } from 'react-icons/hi';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Cari jurusan, kelas, nama siswa, atau NIS..." }: SearchBarProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);

  // Call onSearch when debounced value changes
  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setLocalSearchTerm('');
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 print:hidden">
      <div className="relative max-w-md">
        <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder={placeholder}
          value={localSearchTerm}
          onChange={handleInputChange}
          className="w-full text-gray-700 pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
        {localSearchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <HiX className="w-5 h-5" />
          </button>
        )}
      </div>
      {localSearchTerm && (
        <p className="text-sm text-gray-600 mt-2">
          Mencari: "{localSearchTerm}"
        </p>
      )}
    </div>
  );
}