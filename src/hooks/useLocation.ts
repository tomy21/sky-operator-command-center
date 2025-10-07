/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Location {
  id: number;
  Code: string;
  Name: string;
  Address?: string;
}

interface LocationResponse {
  code: number;
  message: string;
  data: Location[];
  meta?: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface LocationDetail {
  id: number;
  Code: string;
  Name: string;
  Region: string;
  Vendor: string;
  VendorParkingCode: string;
  TID: string;
  UrlServer: string;
  ShortName: string;
  Address: string;
  StartTime: string;
  EndTime: string;
  DateNext: number;
  TimeZone: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  recordStatus: string;
}

interface LocationDetailResponse {
  code: number;
  message: string;
  data: LocationDetail;
}

export interface GateByLocation {
  id: number;
  id_location: number;
  gate: string;
  ip_lpr: string;
  arduino: number;
  statusGate: number;
  id_tele: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  user_lpr: string;
  password_lpr: string;
  ip_intercome: string;
  user_intercome: string;
  password_intercome: string;
  location: {
    Code: string;
    Name: string;
  };
}

interface GateByLocationResponse {
  code: number;
  message: string;
  data: GateByLocation[];
  meta?: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

export const fetchLocation = async (page = 1, limit = 5, search = "") => {
  try {
    const response = await fetch(
      `/api/location/get-all?page=${page}&limit=${limit}&search=${search}`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data: LocationResponse = await response.json();

    if (data.data && Array.isArray(data.data)) {
      return data;
    } else {
      throw new Error("Format data lokasi tidak valid");
    }
  } catch (err) {
    console.error("Error fetching locations");
    throw err;
  }
};

export const fetchLocationById = async (id: number) => {
  try {
    const response = await fetch(`/api/location/get-byid/${id}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data: LocationDetailResponse = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching location by ID");
    throw err;
  }
};

export const fetchGateByLocation = async (locationData: any) => {
  try {
    const response = await fetch(
      `/api/location/get-gate-by-location/${locationData.id}?page=${locationData.page}&limit=${locationData.limit}`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data: GateByLocationResponse = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching location by ID");
    throw err;
  }
};

export const fetchLocationActive = async (page = 1, limit = 5, search = "") => {
  try {
    const response = await fetch(
      `/api/location/get-all-location-active?page=${page}&limit=${limit}&search=${search}`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data: LocationResponse = await response.json();

    if (data.data && Array.isArray(data.data)) {
      return data;
    } else {
      throw new Error("Format data lokasi tidak valid");
    }
  } catch (err) {
    console.error("Error fetching locations");
    throw err;
  }
};

export const updateLocation = async (location: any) => {
  try {
    const response = await fetch(
      `/api/location/update-location-active/${location.id.toString()}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({
        //     name: location?.name, idDescription: location?.idDescription
        // })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal merubah location");
    }

    return await response.json();
  } catch (error) {
    console.error("Error editing location");
    throw error;
  }
};

export const openGate = async (gateId: number | string) => {
  try {
    const response = await fetch(
      `/api/location/open-gate/${gateId.toString()}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "OPEN",
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal membuka gate");
    }

    return await response.json();
  } catch (error) {
    console.error("Error open gate");
    throw error;
  }
};

export const createGate = async (gate: any) => {
  try {
    const response = await fetch(
      `/api/location/create-data/${gate.id.toString()}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gateName: gate?.name,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal mambuat gate");
    }

    return await response.json();
  } catch (error) {
    console.error("Error create gate");
    throw error;
  }
};

export const updateGate = async (id: number, data: any) => {
  try {
    const response = await fetch(`/api/location/update-gate/${id}`, {
      method: "PUT", // kalau backend bener2 GET, ganti jadi "GET"
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // kalau token/refreshToken harus dikirim manual:
        // "Cookie": `refreshToken=xxx; token=xxx`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal update gate");
    }

    return await response.json();
  } catch (error) {
    console.error("Error update gate:", error);
    throw error;
  }
};
