/* eslint-disable react-hooks/exhaustive-deps */
import { CallQuantityParams, CallQuantityResponse } from "@/types/callQuantity";
import { unauthorizedAPI } from "@/utils/unauthorizedURL";
import { useEffect, useState } from "react";

export const fetchCallQuantity = async (params?: CallQuantityParams): Promise<CallQuantityResponse> => {
    try {
        const queryParams = new URLSearchParams();

        if (params?.year) queryParams.append('year', params.year);
        if (params?.month) queryParams.append('month', params.month);
        if (params?.region) queryParams.append('region', params.region);
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.itemsPerPage) queryParams.append('itemsPerPage', params.itemsPerPage.toString());

        const url = `/api/summary/call-byquantity${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data: CallQuantityResponse = await response.json();
        return data;
    } catch (err) {
        console.error("Error fetching call quantity data");
        unauthorizedAPI(err);
        throw err;
    }
};

export const useCallQuantityData = (params?: CallQuantityParams) => {
    const [data, setData] = useState<CallQuantityResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await fetchCallQuantity(params);
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [params?.year, params?.month, params?.region, params?.page, params?.itemsPerPage]);

    const refetch = () => {
        fetchData();
    };

    return {
        data,
        loading,
        error,
        refetch
    };
};
