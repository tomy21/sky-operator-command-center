import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { TimeSlotData } from '@/data/mock/callByTimeData';

interface CallByTimeParams {
  year: string;
  month: string;
  region?: string;
  page?: number;
  itemsPerPage?: number;
}

interface CallByTimeResponse {
  data: TimeSlotData[];
  success: boolean;
  message: string;
  pagination?: {
    page: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export const useCallByTimeData = (params: CallByTimeParams) => {
  const [data, setData] = useState<TimeSlotData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<CallByTimeResponse['pagination'] | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<CallByTimeResponse>('/api/call/by-time', {
        params: {
          year: params.year,
          month: params.month,
          region: params.region || 'all',
          page: params.page || 1,
          itemsPerPage: params.itemsPerPage || 5
        }
      });

      if (response.data.success) {
        setData(response.data.data);
        setPagination(response.data.pagination || null);
      } else {
        setError(response.data.message || 'Failed to fetch data');
        setData(null);
        setPagination(null);
      }
    } catch (err) {
      console.error('Error fetching call by time data:', err);
      setError('Failed to fetch data. Please try again later.');
      setData(null);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [params.year, params.month, params.region, params.page, params.itemsPerPage]);

  return { data, loading, error, refetch, pagination };
};