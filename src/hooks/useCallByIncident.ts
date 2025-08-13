/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { LocationIncidentData, ApiResponse, mockYearlyData } from '@/data/mock/callByIncidentData';

interface CallByIncidentParams {
  year: string;
  month: string;
  region?: string;
  page?: number;
  itemsPerPage?: number;
}

export const useCallByIncidentData = (params: CallByIncidentParams) => {
  const [data, setData] = useState<LocationIncidentData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<ApiResponse['pagination'] | null>(null);
  const [isUsingDummyData, setIsUsingDummyData] = useState<boolean>(false);

  const useDummyData = () => {
    setIsUsingDummyData(true);
    
    const dummyData = mockYearlyData[params.year]?.[params.month];
    
    if (dummyData) {
      let filteredLocations = [...dummyData.locations];
      
      if (params.region && params.region !== 'all') {
        filteredLocations = filteredLocations.filter(
          (location) => location.region === params.region
        );
      }
      
      const page = params.page || 1;
      const itemsPerPage = params.itemsPerPage || 5;
      const totalItems = filteredLocations.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedLocations = filteredLocations.slice(startIndex, endIndex);
      
      setData(paginatedLocations);
      
      setPagination({
        page: page,
        itemsPerPage: itemsPerPage,
        totalItems: totalItems,
        totalPages: totalPages
      });
    } else {
      setData([]);
      setPagination(null);
      setError('No data available for the selected period');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setIsUsingDummyData(false);

    try {
      const response = await axios.get<ApiResponse>('/api/call/by-incident', {
        params: {
          year: params.year,
          month: params.month,
          region: params.region || 'all',
          page: params.page || 1,
          itemsPerPage: params.itemsPerPage || 5
        }
      });

      if (response.data && response.data.locations && response.data.locations.length > 0) {
        setData(response.data.locations);
        setPagination(response.data.pagination || null);
      } else {
        useDummyData();
      }
    } catch (err) {
      console.error('Error fetching call by incident data:', err);
      setError('Failed to fetch data. Using dummy data instead.');
      useDummyData();
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

  return { data, loading, error, refetch, pagination, isUsingDummyData };
};