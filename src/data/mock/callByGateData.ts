export interface GateDataCell {
  humanError: number;
  customerBehaviour: number;
  assetSystem: number;
}

export interface LocationGateData {
  location: string;
  region: string;
  gates: {
    [gateName: string]: {
      car: GateDataCell;
      bike: GateDataCell;
    };
  };
}

export interface ApiResponse {
  year: string;
  month: string;
  locations: LocationGateData[];
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

export const generateGateNames = (): string[] => {
  const gates = [];
  for (let i = 1; i <= 16; i++) {
    gates.push(`Pintu Masuk ${i}`);
  }
  gates.push("Total PM");

  for (let i = 1; i <= 17; i++) {
    gates.push(`Pintu Keluar ${i}`);
  }
  gates.push("Total PK");
  gates.push("TOTAL");

  return gates;
};

export const generateLocations = (): LocationGateData[] => {
  const locations = [];
  const locationTypes = [
    "HPM LKU",
    "LMP",
    "PV",
    "Mall A",
    "Mall B",
    "Mall C",
    "Plaza X",
    "Plaza Y",
    "Supermarket 1",
    "Supermarket 2",
  ];
  const regionsList = ["Region 1", "Region 2", "Region 3", "Region 4"];

  for (let i = 0; i < 100; i++) {
    const locationType = locationTypes[i % locationTypes.length];
    const locationNumber = Math.floor(i / locationTypes.length) + 1;
    const region = regionsList[i % regionsList.length];

    const gates: {
      [gateName: string]: { car: GateDataCell; bike: GateDataCell };
    } = {};

    generateGateNames().forEach((gateName) => {
      gates[gateName] = {
        car: {
          humanError: Math.floor(Math.random() * 50),
          customerBehaviour: Math.floor(Math.random() * 20),
          assetSystem: Math.floor(Math.random() * 15),
        },
        bike: {
          humanError: Math.floor(Math.random() * 30),
          customerBehaviour: Math.floor(Math.random() * 10),
          assetSystem: Math.floor(Math.random() * 10),
        },
      };
    });

    locations.push({
      location: `${locationType} ${locationNumber}`,
      region: region,
      gates: gates,
    });
  }

  return locations;
};

export const mockYearlyData: YearlyData = {
  "2024": {
    january: {
      year: "2024",
      month: "january",
      locations: generateLocations(),
    },
    february: {
      year: "2024",
      month: "february",
      locations: generateLocations(),
    },
    march: {
      year: "2024",
      month: "march",
      locations: generateLocations(),
    },
    april: {
      year: "2024",
      month: "april",
      locations: generateLocations(),
    },
    may: {
      year: "2024",
      month: "may",
      locations: generateLocations(),
    },
    june: {
      year: "2024",
      month: "june",
      locations: generateLocations(),
    },
    july: {
      year: "2024",
      month: "july",
      locations: generateLocations(),
    },
    august: {
      year: "2024",
      month: "august",
      locations: generateLocations(),
    },
    september: {
      year: "2024",
      month: "september",
      locations: generateLocations(),
    },
    october: {
      year: "2024",
      month: "october",
      locations: generateLocations(),
    },
    november: {
      year: "2024",
      month: "november",
      locations: generateLocations(),
    },
    december: {
      year: "2024",
      month: "december",
      locations: generateLocations(),
    },
  },
  "2023": {
    january: {
      year: "2023",
      month: "january",
      locations: generateLocations(),
    },
  },
  "2022": {
    january: {
      year: "2022",
      month: "january",
      locations: generateLocations(),
    },
  },
  "2025": {
    january: {
      year: "2025",
      month: "january",
      locations: generateLocations(),
    },
  },
};