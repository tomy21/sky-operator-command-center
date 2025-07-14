export interface CallQuantityItem {
    location: string;
    jan: number;
    feb: number;
    mar: number;
    apr: number;
    mei: number;
    juni: number;
    jul: number;
    aug: number;
    sep: number;
    okt: number;
    nov: number;
    des: number;
    total: number;
}

export interface CallQuantityMetadata {
    year: string;
    month: string;
    region: string;
}

export interface CallQuantityPagination {
    page: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

export interface CallQuantityResponse {
    metadata: CallQuantityMetadata;
    pagination: CallQuantityPagination;
    data: CallQuantityItem[];
}

export interface CallQuantityParams {
    year?: string;
    month?: string;
    region?: string;
    page?: number;
    itemsPerPage?: number;
}
