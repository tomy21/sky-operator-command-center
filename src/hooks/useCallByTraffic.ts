/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import {
  LocationData,
  ApiResponse,
  mockYearlyData,
} from "@/data/mock/callByTrafficData";

interface CallByTrafficParams {
  year: string;
  month: string;
  period?: string;
  region?: string;
  page?: number;
  itemsPerPage?: number;
}

export const useCallByTrafficData = (params: CallByTrafficParams) => {
  const [data, setData] = useState<LocationData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<
    ApiResponse["pagination"] | null
  >(null);
  const [isUsingDummyData, setIsUsingDummyData] = useState<boolean>(false);

  const useDummyData = () => {
    setIsUsingDummyData(true);

    const dummyData = mockYearlyData[params.year]?.[params.month];

    if (dummyData) {
      let filteredLocations = [...dummyData.locations];

      if (params.region && params.region !== "all") {
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
        page,
        itemsPerPage,
        totalItems,
        totalPages,
      });
    } else {
      setData([]);
      setPagination({
        page: 1,
        itemsPerPage: params.itemsPerPage || 5,
        totalItems: 0,
        totalPages: 0,
      });
    }
  };

  const mapApiDataToTableFormat = (apiData: any[]): LocationData[] => {
    return apiData.map(
      (item): LocationData => ({
        location: item.location_name || item.location,
        region: item.region_name || item.region,
        car: {
          jan: {
            traffic: {
              qty: item.car?.january?.traffic || 0,
              percentage: item.car?.january?.traffic_percentage || 0,
            },
            call: {
              qty: item.car?.january?.call || 0,
              percentage: item.car?.january?.call_percentage || 0,
            },
          },
          feb: {
            traffic: {
              qty: item.car?.february?.traffic || 0,
              percentage: item.car?.february?.traffic_percentage || 0,
            },
            call: {
              qty: item.car?.february?.call || 0,
              percentage: item.car?.february?.call_percentage || 0,
            },
          },
          mar: {
            traffic: {
              qty: item.car?.march?.traffic || 0,
              percentage: item.car?.march?.traffic_percentage || 0,
            },
            call: {
              qty: item.car?.march?.call || 0,
              percentage: item.car?.march?.call_percentage || 0,
            },
          },
          apr: {
            traffic: {
              qty: item.car?.april?.traffic || 0,
              percentage: item.car?.april?.traffic_percentage || 0,
            },
            call: {
              qty: item.car?.april?.call || 0,
              percentage: item.car?.april?.call_percentage || 0,
            },
          },
          mei: {
            traffic: {
              qty: item.car?.may?.traffic || 0,
              percentage: item.car?.may?.traffic_percentage || 0,
            },
            call: {
              qty: item.car?.may?.call || 0,
              percentage: item.car?.may?.call_percentage || 0,
            },
          },
          juni: {
            traffic: {
              qty: item.car?.june?.traffic || 0,
              percentage: item.car?.june?.traffic_percentage || 0,
            },
            call: {
              qty: item.car?.june?.call || 0,
              percentage: item.car?.june?.call_percentage || 0,
            },
          },
          juli: {
            traffic: {
              qty: item.car?.july?.traffic || 0,
              percentage: item.car?.july?.traffic_percentage || 0,
            },
            call: {
              qty: item.car?.july?.call || 0,
              percentage: item.car?.july?.call_percentage || 0,
            },
          },
          agu: {
            traffic: {
              qty: item.car?.august?.traffic || 0,
              percentage: item.car?.august?.traffic_percentage || 0,
            },
            call: {
              qty: item.car?.august?.call || 0,
              percentage: item.car?.august?.call_percentage || 0,
            },
          },
          sept: {
            traffic: {
              qty: item.car?.september?.traffic || 0,
              percentage: item.car?.september?.traffic_percentage || 0,
            },
            call: {
              qty: item.car?.september?.call || 0,
              percentage: item.car?.september?.call_percentage || 0,
            },
          },
          okt: {
            traffic: {
              qty: item.car?.october?.traffic || 0,
              percentage: item.car?.october?.traffic_percentage || 0,
            },
            call: {
              qty: item.car?.october?.call || 0,
              percentage: item.car?.october?.call_percentage || 0,
            },
          },
          nov: {
            traffic: {
              qty: item.car?.november?.traffic || 0,
              percentage: item.car?.november?.traffic_percentage || 0,
            },
            call: {
              qty: item.car?.november?.call || 0,
              percentage: item.car?.november?.call_percentage || 0,
            },
          },
          des: {
            traffic: {
              qty: item.car?.december?.traffic || 0,
              percentage: item.car?.december?.traffic_percentage || 0,
            },
            call: {
              qty: item.car?.december?.call || 0,
              percentage: item.car?.december?.call_percentage || 0,
            },
          },
          total: {
            traffic: {
              qty: item.car?.total?.traffic || 0,
              percentage: item.car?.total?.traffic_percentage || 0,
            },
            call: {
              qty: item.car?.total?.call || 0,
              percentage: item.car?.total?.call_percentage || 0,
            },
          },
        },
        bike: {
          jan: {
            traffic: {
              qty: item.bike?.january?.traffic || 0,
              percentage: item.bike?.january?.traffic_percentage || 0,
            },
            call: {
              qty: item.bike?.january?.call || 0,
              percentage: item.bike?.january?.call_percentage || 0,
            },
          },
          feb: {
            traffic: {
              qty: item.bike?.february?.traffic || 0,
              percentage: item.bike?.february?.traffic_percentage || 0,
            },
            call: {
              qty: item.bike?.february?.call || 0,
              percentage: item.bike?.february?.call_percentage || 0,
            },
          },
          mar: {
            traffic: {
              qty: item.bike?.march?.traffic || 0,
              percentage: item.bike?.march?.traffic_percentage || 0,
            },
            call: {
              qty: item.bike?.march?.call || 0,
              percentage: item.bike?.march?.call_percentage || 0,
            },
          },
          apr: {
            traffic: {
              qty: item.bike?.april?.traffic || 0,
              percentage: item.bike?.april?.traffic_percentage || 0,
            },
            call: {
              qty: item.bike?.april?.call || 0,
              percentage: item.bike?.april?.call_percentage || 0,
            },
          },
          mei: {
            traffic: {
              qty: item.bike?.may?.traffic || 0,
              percentage: item.bike?.may?.traffic_percentage || 0,
            },
            call: {
              qty: item.bike?.may?.call || 0,
              percentage: item.bike?.may?.call_percentage || 0,
            },
          },
          juni: {
            traffic: {
              qty: item.bike?.june?.traffic || 0,
              percentage: item.bike?.june?.traffic_percentage || 0,
            },
            call: {
              qty: item.bike?.june?.call || 0,
              percentage: item.bike?.june?.call_percentage || 0,
            },
          },
          juli: {
            traffic: {
              qty: item.bike?.july?.traffic || 0,
              percentage: item.bike?.july?.traffic_percentage || 0,
            },
            call: {
              qty: item.bike?.july?.call || 0,
              percentage: item.bike?.july?.call_percentage || 0,
            },
          },
          agu: {
            traffic: {
              qty: item.bike?.august?.traffic || 0,
              percentage: item.bike?.august?.traffic_percentage || 0,
            },
            call: {
              qty: item.bike?.august?.call || 0,
              percentage: item.bike?.august?.call_percentage || 0,
            },
          },
          sept: {
            traffic: {
              qty: item.bike?.september?.traffic || 0,
              percentage: item.bike?.september?.traffic_percentage || 0,
            },
            call: {
              qty: item.bike?.september?.call || 0,
              percentage: item.bike?.september?.call_percentage || 0,
            },
          },
          okt: {
            traffic: {
              qty: item.bike?.october?.traffic || 0,
              percentage: item.bike?.october?.traffic_percentage || 0,
            },
            call: {
              qty: item.bike?.october?.call || 0,
              percentage: item.bike?.october?.call_percentage || 0,
            },
          },
          nov: {
            traffic: {
              qty: item.bike?.november?.traffic || 0,
              percentage: item.bike?.november?.traffic_percentage || 0,
            },
            call: {
              qty: item.bike?.november?.call || 0,
              percentage: item.bike?.november?.call_percentage || 0,
            },
          },
          des: {
            traffic: {
              qty: item.bike?.december?.traffic || 0,
              percentage: item.bike?.december?.traffic_percentage || 0,
            },
            call: {
              qty: item.bike?.december?.call || 0,
              percentage: item.bike?.december?.call_percentage || 0,
            },
          },
          total: {
            traffic: {
              qty: item.bike?.total?.traffic || 0,
              percentage: item.bike?.total?.traffic_percentage || 0,
            },
            call: {
              qty: item.bike?.total?.call || 0,
              percentage: item.bike?.total?.call_percentage || 0,
            },
          },
        },
      })
    );
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setIsUsingDummyData(false);

    try {
      const response = await axios.get<ApiResponse>("/api/call/by-traffic", {
        params: {
          year: params.year,
          month: params.month,
          period: params.period || "semester1",
          region: params.region || "all",
          page: params.page || 1,
          itemsPerPage: params.itemsPerPage || 5,
        },
      });

      if (
        response.data?.locations &&
        Array.isArray(response.data.locations) &&
        response.data.locations.length > 0
      ) {
        const mappedData = mapApiDataToTableFormat(response.data.locations);
        setData(mappedData);
        setPagination(response.data.pagination || null);
        console.log("Using API data");
      } else {
        console.log("API returned empty data, using dummy data");
        useDummyData();
      }
    } catch (err) {
      console.error("Error fetching call by traffic data:", err);
      setError("Failed to fetch data from API. Using dummy data instead.");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.year,
    params.month,
    params.period,
    params.region,
    params.page,
    params.itemsPerPage,
  ]);

  return { data, loading, error, refetch, pagination, isUsingDummyData };
};
