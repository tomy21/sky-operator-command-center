export interface MonthlyData {
  qty: number;
  percentage: number;
}

export interface VehicleData {
  traffic: MonthlyData;
  call: MonthlyData;
}

export interface LocationData {
  location: string;
  region: string;
  car: {
    jan: VehicleData;
    feb: VehicleData;
    mar: VehicleData;
    apr: VehicleData;
    mei: VehicleData;
    juni: VehicleData;
    juli: VehicleData;
    agu: VehicleData;
    sept: VehicleData;
    okt: VehicleData;
    nov: VehicleData;
    des: VehicleData;
    total: VehicleData;
  };
  bike: {
    jan: VehicleData;
    feb: VehicleData;
    mar: VehicleData;
    apr: VehicleData;
    mei: VehicleData;
    juni: VehicleData;
    juli: VehicleData;
    agu: VehicleData;
    sept: VehicleData;
    okt: VehicleData;
    nov: VehicleData;
    des: VehicleData;
    total: VehicleData;
  };
}

export interface ApiResponse {
  year: string;
  month: string;
  locations: LocationData[];
  pagination?: {
    page: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface YearlyData {
  [year: string]: {
    [month: string]: ApiResponse;
  };
}

export type MonthKey =
  | "jan"
  | "feb"
  | "mar"
  | "apr"
  | "mei"
  | "juni"
  | "juli"
  | "agu"
  | "sept"
  | "okt"
  | "nov"
  | "des"
  | "total";

export const monthToDataKey: { [key: string]: MonthKey } = {
  january: "jan",
  february: "feb",
  march: "mar",
  april: "apr",
  may: "mei",
  june: "juni",
  july: "juli",
  august: "agu",
  september: "sept",
  october: "okt",
  november: "nov",
  december: "des",
};

// Generate sample data with regions
const generateSampleData = (): LocationData[] => {
  const baseData = [
    {
      location: "HPM LKU",
      region: "Region 1",
      car: {
        jan: {
          traffic: { qty: 1779, percentage: 2.4 },
          call: { qty: 91, percentage: 0 },
        },
        feb: {
          traffic: { qty: 363, percentage: 0 },
          call: { qty: 67, percentage: 0 },
        },
        mar: {
          traffic: { qty: 6453, percentage: 1.8 },
          call: { qty: 115, percentage: 0 },
        },
        apr: {
          traffic: { qty: 342, percentage: 1.9 },
          call: { qty: 74, percentage: 0 },
        },
        mei: {
          traffic: { qty: 565, percentage: 1.1 },
          call: { qty: 83, percentage: 0 },
        },
        juni: {
          traffic: { qty: 1, percentage: 1.3 },
          call: { qty: 55, percentage: 0 },
        },
        juli: {
          traffic: { qty: 1200, percentage: 1.5 },
          call: { qty: 45, percentage: 0 },
        },
        agu: {
          traffic: { qty: 890, percentage: 1.2 },
          call: { qty: 38, percentage: 0 },
        },
        sept: {
          traffic: { qty: 1450, percentage: 1.8 },
          call: { qty: 62, percentage: 0 },
        },
        okt: {
          traffic: { qty: 980, percentage: 1.4 },
          call: { qty: 41, percentage: 0 },
        },
        nov: {
          traffic: { qty: 1100, percentage: 1.6 },
          call: { qty: 52, percentage: 0 },
        },
        des: {
          traffic: { qty: 760, percentage: 1.1 },
          call: { qty: 35, percentage: 0 },
        },
        total: {
          traffic: { qty: 9503, percentage: 1.5 },
          call: { qty: 485, percentage: 0 },
        },
      },
      bike: {
        jan: {
          traffic: { qty: 523, percentage: 2.1 },
          call: { qty: 8, percentage: 0 },
        },
        feb: {
          traffic: { qty: 4316, percentage: 1.5 },
          call: { qty: 67, percentage: 0 },
        },
        mar: {
          traffic: { qty: 6172, percentage: 1.8 },
          call: { qty: 115, percentage: 0 },
        },
        apr: {
          traffic: { qty: 3883, percentage: 1.9 },
          call: { qty: 74, percentage: 0 },
        },
        mei: {
          traffic: { qty: 7770, percentage: 1.1 },
          call: { qty: 83, percentage: 0 },
        },
        juni: {
          traffic: { qty: 3476, percentage: 1.3 },
          call: { qty: 55, percentage: 0 },
        },
        juli: {
          traffic: { qty: 1200, percentage: 1.5 },
          call: { qty: 45, percentage: 0 },
        },
        agu: {
          traffic: { qty: 890, percentage: 1.2 },
          call: { qty: 38, percentage: 0 },
        },
        sept: {
          traffic: { qty: 1450, percentage: 1.8 },
          call: { qty: 62, percentage: 0 },
        },
        okt: {
          traffic: { qty: 980, percentage: 1.4 },
          call: { qty: 41, percentage: 0 },
        },
        nov: {
          traffic: { qty: 1100, percentage: 1.6 },
          call: { qty: 52, percentage: 0 },
        },
        des: {
          traffic: { qty: 760, percentage: 1.1 },
          call: { qty: 35, percentage: 0 },
        },
        total: {
          traffic: { qty: 26140, percentage: 1.5 },
          call: { qty: 502, percentage: 0 },
        },
      },
    },
    // Tambahkan data lain dari TrafficCallTable.tsx
    // ... existing code ...
  ];

  // Generate additional sample locations for demonstration
  const additionalLocations: LocationData[] = [];
  const locationTypes = [
    "Mall A",
    "Mall B",
    "Plaza X",
    "Plaza Y",
    "Supermarket",
  ];
  const regionsList = ["Region 1", "Region 2", "Region 3", "Region 4"];

  for (let i = 0; i < 20; i++) {
    const locationType = locationTypes[i % locationTypes.length];
    const locationNumber = Math.floor(i / locationTypes.length) + 1;
    const region = regionsList[i % regionsList.length];

    const generateRandomData = (): VehicleData => ({
      traffic: {
        qty: Math.floor(Math.random() * 50000),
        percentage: Math.random() * 3,
      },
      call: { qty: Math.floor(Math.random() * 500), percentage: 0 },
    });

    const carData = {
      jan: generateRandomData(),
      feb: generateRandomData(),
      mar: generateRandomData(),
      apr: generateRandomData(),
      mei: generateRandomData(),
      juni: generateRandomData(),
      juli: generateRandomData(),
      agu: generateRandomData(),
      sept: generateRandomData(),
      okt: generateRandomData(),
      nov: generateRandomData(),
      des: generateRandomData(),
      total: generateRandomData(),
    };

    const bikeData = {
      jan: generateRandomData(),
      feb: generateRandomData(),
      mar: generateRandomData(),
      apr: generateRandomData(),
      mei: generateRandomData(),
      juni: generateRandomData(),
      juli: generateRandomData(),
      agu: generateRandomData(),
      sept: generateRandomData(),
      okt: generateRandomData(),
      nov: generateRandomData(),
      des: generateRandomData(),
      total: generateRandomData(),
    };

    additionalLocations.push({
      location: `${locationType} ${locationNumber}`,
      region: region,
      car: carData,
      bike: bikeData,
    });
  }

  return [...baseData, ...additionalLocations];
};

export const mockYearlyData: YearlyData = {
  "2024": {
    january: {
      year: "2024",
      month: "january",
      locations: generateSampleData(),
    },
    february: {
      year: "2024",
      month: "february",
      locations: generateSampleData(),
    },
    march: {
      year: "2024",
      month: "march",
      locations: generateSampleData(),
    },
    april: {
      year: "2024",
      month: "april",
      locations: generateSampleData(),
    },
    may: {
      year: "2024",
      month: "may",
      locations: generateSampleData(),
    },
    june: {
      year: "2024",
      month: "june",
      locations: generateSampleData(),
    },
    july: {
      year: "2024",
      month: "july",
      locations: generateSampleData(),
    },
    august: {
      year: "2024",
      month: "august",
      locations: generateSampleData(),
    },
    september: {
      year: "2024",
      month: "september",
      locations: generateSampleData(),
    },
    october: {
      year: "2024",
      month: "october",
      locations: generateSampleData(),
    },
    november: {
      year: "2024",
      month: "november",
      locations: generateSampleData(),
    },
    december: {
      year: "2024",
      month: "december",
      locations: generateSampleData(),
    },
  },
  "2023": {
    january: {
      year: "2023",
      month: "january",
      locations: generateSampleData(),
    },
  },
  "2022": {
    january: {
      year: "2022",
      month: "january",
      locations: generateSampleData(),
    },
  },
  "2025": {
    january: {
      year: "2025",
      month: "january",
      locations: generateSampleData(),
    },
  },
};