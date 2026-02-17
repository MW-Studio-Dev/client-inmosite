import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/api';
import { useDebounce } from './useDebounce';

export interface LocationResult {
  display_name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
  city: string;
  neighborhood: string;
  postal_code: string;
  street: string;
  street_number: string;
}

interface LocationSearchResponse {
  success: boolean;
  message: string;
  data: LocationResult[];
}

export function useLocationSearch(query: string) {
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length < 3) {
      setResults([]);
      return;
    }

    let cancelled = false;

    const search = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get<LocationSearchResponse>(
          `/locations/search/?q=${encodeURIComponent(debouncedQuery)}`
        );
        if (!cancelled && response.data.success) {
          setResults(response.data.data);
        }
      } catch {
        if (!cancelled) {
          setResults([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    search();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  return { results, loading };
}
