/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CustomSelect } from "../input/CustomSelect";
import { months, regions, viewSets, years } from "@/utils/filterData";

interface MonthlyIncidentData {
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  mei: number;
  juni: number;
  juli?: number;
  aug?: number;
  sep?: number;
  oct?: number;
  nov?: number;
  dec?: number;
  total: number;
}

interface CategoryData {
  trafficHumanError: MonthlyIncidentData;
  trafficSystem: MonthlyIncidentData;
  customerBehaviour: MonthlyIncidentData;
  assetSystem: MonthlyIncidentData;
}

interface LocationIncidentData {
  location: string;
  region: string;
  car: CategoryData;
  bike: CategoryData;
  total: CategoryData;
}

type VehicleType = "car" | "bike" | "total";

const CallByIncidentTable: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("january");
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  const monthToDataKey: { [key: string]: keyof MonthlyIncidentData } = {
    january: "jan",
    february: "feb",
    march: "mar",
    april: "apr",
    may: "mei",
    june: "juni",
    july: "juli",
    august: "aug",
    september: "sep",
    october: "oct",
    november: "nov",
    december: "dec",
  };

  const allLocations: LocationIncidentData[] = [
    {
      location: "HPM LKU",
      region: "Region 1",
      car: {
        trafficHumanError: {
          jan: 16113,
          feb: 5140,
          mar: 22492,
          apr: 15076,
          mei: 28203,
          juni: 12222,
          total: 99246,
        },
        trafficSystem: {
          jan: 133,
          feb: 23,
          mar: 300,
          apr: 312,
          mei: 533,
          juni: 25,
          total: 1326,
        },
        customerBehaviour: {
          jan: 35,
          feb: 55,
          mar: 125,
          apr: 115,
          mei: 91,
          juni: 50,
          total: 471,
        },
        assetSystem: {
          jan: 0,
          feb: 0,
          mar: 56,
          apr: 36,
          mei: 8,
          juni: 0,
          total: 100,
        },
      },
      bike: {
        trafficHumanError: {
          jan: 1327,
          feb: 1896,
          mar: 1835,
          apr: 1606,
          mei: 3221,
          juni: 1306,
          total: 11191,
        },
        trafficSystem: {
          jan: 4,
          feb: 0,
          mar: 53,
          apr: 43,
          mei: 50,
          juni: 0,
          total: 150,
        },
        customerBehaviour: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
        assetSystem: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
      },
      total: {
        trafficHumanError: {
          jan: 17440,
          feb: 7036,
          mar: 24327,
          apr: 16682,
          mei: 31424,
          juni: 13528,
          total: 110437,
        },
        trafficSystem: {
          jan: 137,
          feb: 23,
          mar: 353,
          apr: 355,
          mei: 583,
          juni: 25,
          total: 1476,
        },
        customerBehaviour: {
          jan: 35,
          feb: 55,
          mar: 125,
          apr: 115,
          mei: 91,
          juni: 50,
          total: 471,
        },
        assetSystem: {
          jan: 0,
          feb: 0,
          mar: 56,
          apr: 36,
          mei: 8,
          juni: 0,
          total: 100,
        },
      },
    },
    {
      location: "LMP",
      region: "Region 2",
      car: {
        trafficHumanError: {
          jan: 271073,
          feb: 231193,
          mar: 278248,
          apr: 252020,
          mei: 263330,
          juni: 99954,
          total: 1395818,
        },
        trafficSystem: {
          jan: 404,
          feb: 605,
          mar: 370,
          apr: 435,
          mei: 330,
          juni: 115,
          total: 2259,
        },
        customerBehaviour: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
        assetSystem: {
          jan: 163,
          feb: 138,
          mar: 363,
          apr: 420,
          mei: 235,
          juni: 30,
          total: 1349,
        },
      },
      bike: {
        trafficHumanError: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
        trafficSystem: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
        customerBehaviour: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
        assetSystem: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
      },
      total: {
        trafficHumanError: {
          jan: 271073,
          feb: 231193,
          mar: 278248,
          apr: 252020,
          mei: 263330,
          juni: 99954,
          total: 1395818,
        },
        trafficSystem: {
          jan: 404,
          feb: 605,
          mar: 370,
          apr: 435,
          mei: 330,
          juni: 115,
          total: 2259,
        },
        customerBehaviour: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
        assetSystem: {
          jan: 163,
          feb: 138,
          mar: 363,
          apr: 420,
          mei: 235,
          juni: 30,
          total: 1349,
        },
      },
    },
    {
      location: "PV",
      region: "Region 3",
      car: {
        trafficHumanError: {
          jan: 127347,
          feb: 135155,
          mar: 116451,
          apr: 140845,
          mei: 170391,
          juni: 62131,
          total: 752320,
        },
        trafficSystem: {
          jan: 272,
          feb: 582,
          mar: 625,
          apr: 582,
          mei: 374,
          juni: 146,
          total: 2581,
        },
        customerBehaviour: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
        assetSystem: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
      },
      bike: {
        trafficHumanError: {
          jan: 6456,
          feb: 17556,
          mar: 22671,
          apr: 21298,
          mei: 27051,
          juni: 9783,
          total: 104815,
        },
        trafficSystem: {
          jan: 72,
          feb: 140,
          mar: 164,
          apr: 223,
          mei: 211,
          juni: 105,
          total: 915,
        },
        customerBehaviour: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
        assetSystem: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
      },
      total: {
        trafficHumanError: {
          jan: 133803,
          feb: 152711,
          mar: 139122,
          apr: 162143,
          mei: 197442,
          juni: 71914,
          total: 857135,
        },
        trafficSystem: {
          jan: 344,
          feb: 722,
          mar: 789,
          apr: 805,
          mei: 585,
          juni: 251,
          total: 3496,
        },
        customerBehaviour: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
        assetSystem: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
      },
    },
    {
      location: "SPARK",
      region: "Region 1",
      car: {
        trafficHumanError: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 50533,
          mei: 57434,
          juni: 20616,
          total: 128583,
        },
        trafficSystem: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 62,
          mei: 72,
          juni: 8,
          total: 142,
        },
        customerBehaviour: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
        assetSystem: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
      },
      bike: {
        trafficHumanError: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
        trafficSystem: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
        customerBehaviour: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
        assetSystem: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
      },
      total: {
        trafficHumanError: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 50533,
          mei: 57434,
          juni: 20616,
          total: 128583,
        },
        trafficSystem: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 62,
          mei: 72,
          juni: 8,
          total: 142,
        },
        customerBehaviour: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
        assetSystem: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
      },
    },
    {
      location: "PICON",
      region: "Region 2",
      car: {
        trafficHumanError: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 11162,
          mei: 82742,
          juni: 8,
          total: 93912,
        },
        trafficSystem: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 42,
          mei: 52,
          juni: 0,
          total: 94,
        },
        customerBehaviour: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
        assetSystem: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
      },
      bike: {
        trafficHumanError: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
        trafficSystem: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
        customerBehaviour: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
        assetSystem: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
      },
      total: {
        trafficHumanError: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 11162,
          mei: 82742,
          juni: 8,
          total: 93912,
        },
        trafficSystem: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 42,
          mei: 52,
          juni: 0,
          total: 94,
        },
        customerBehaviour: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
        assetSystem: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
      },
    },
    {
      location: "METRO",
      region: "Region 1",
      car: {
        trafficHumanError: {
          jan: 45000,
          feb: 38000,
          mar: 52000,
          apr: 41000,
          mei: 49000,
          juni: 35000,
          total: 260000,
        },
        trafficSystem: {
          jan: 150,
          feb: 120,
          mar: 180,
          apr: 160,
          mei: 140,
          juni: 110,
          total: 860,
        },
        customerBehaviour: {
          jan: 20,
          feb: 15,
          mar: 25,
          apr: 18,
          mei: 22,
          juni: 12,
          total: 112,
        },
        assetSystem: {
          jan: 5,
          feb: 3,
          mar: 8,
          apr: 6,
          mei: 4,
          juni: 2,
          total: 28,
        },
      },
      bike: {
        trafficHumanError: {
          jan: 2500,
          feb: 2800,
          mar: 3200,
          apr: 2900,
          mei: 3400,
          juni: 2600,
          total: 17400,
        },
        trafficSystem: {
          jan: 8,
          feb: 6,
          mar: 12,
          apr: 10,
          mei: 14,
          juni: 7,
          total: 57,
        },
        customerBehaviour: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
        assetSystem: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
      },
      total: {
        trafficHumanError: {
          jan: 47500,
          feb: 40800,
          mar: 55200,
          apr: 43900,
          mei: 52400,
          juni: 37600,
          total: 277400,
        },
        trafficSystem: {
          jan: 158,
          feb: 126,
          mar: 192,
          apr: 170,
          mei: 154,
          juni: 117,
          total: 917,
        },
        customerBehaviour: {
          jan: 20,
          feb: 15,
          mar: 25,
          apr: 18,
          mei: 22,
          juni: 12,
          total: 112,
        },
        assetSystem: {
          jan: 5,
          feb: 3,
          mar: 8,
          apr: 6,
          mei: 4,
          juni: 2,
          total: 28,
        },
      },
    },
    {
      location: "GALAXY D",
      region: "Region 3",
      car: {
        trafficHumanError: {
          jan: 32000,
          feb: 29000,
          mar: 35000,
          apr: 31000,
          mei: 38000,
          juni: 27000,
          total: 192000,
        },
        trafficSystem: {
          jan: 80,
          feb: 75,
          mar: 90,
          apr: 85,
          mei: 95,
          juni: 70,
          total: 495,
        },
        customerBehaviour: {
          jan: 10,
          feb: 8,
          mar: 12,
          apr: 9,
          mei: 14,
          juni: 6,
          total: 59,
        },
        assetSystem: {
          jan: 2,
          feb: 1,
          mar: 3,
          apr: 2,
          mei: 2,
          juni: 1,
          total: 11,
        },
      },
      bike: {
        trafficHumanError: {
          jan: 1800,
          feb: 2100,
          mar: 2400,
          apr: 2000,
          mei: 2600,
          juni: 1900,
          total: 12800,
        },
        trafficSystem: {
          jan: 5,
          feb: 7,
          mar: 8,
          apr: 6,
          mei: 9,
          juni: 4,
          total: 39,
        },
        customerBehaviour: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
        assetSystem: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
      },
      total: {
        trafficHumanError: {
          jan: 33800,
          feb: 31100,
          mar: 37400,
          apr: 33000,
          mei: 40600,
          juni: 28900,
          total: 204800,
        },
        trafficSystem: {
          jan: 85,
          feb: 82,
          mar: 98,
          apr: 91,
          mei: 104,
          juni: 74,
          total: 534,
        },
        customerBehaviour: {
          jan: 10,
          feb: 8,
          mar: 12,
          apr: 9,
          mei: 14,
          juni: 6,
          total: 59,
        },
        assetSystem: {
          jan: 2,
          feb: 1,
          mar: 3,
          apr: 2,
          mei: 2,
          juni: 1,
          total: 11,
        },
      },
    },
    {
      location: "GALAXY C",
      region: "Region 3",
      car: {
        trafficHumanError: {
          jan: 32000,
          feb: 29000,
          mar: 35000,
          apr: 31000,
          mei: 38000,
          juni: 27000,
          total: 192000,
        },
        trafficSystem: {
          jan: 80,
          feb: 75,
          mar: 90,
          apr: 85,
          mei: 95,
          juni: 70,
          total: 495,
        },
        customerBehaviour: {
          jan: 10,
          feb: 8,
          mar: 12,
          apr: 9,
          mei: 14,
          juni: 6,
          total: 59,
        },
        assetSystem: {
          jan: 2,
          feb: 1,
          mar: 3,
          apr: 2,
          mei: 2,
          juni: 1,
          total: 11,
        },
      },
      bike: {
        trafficHumanError: {
          jan: 1800,
          feb: 2100,
          mar: 2400,
          apr: 2000,
          mei: 2600,
          juni: 1900,
          total: 12800,
        },
        trafficSystem: {
          jan: 5,
          feb: 7,
          mar: 8,
          apr: 6,
          mei: 9,
          juni: 4,
          total: 39,
        },
        customerBehaviour: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
        assetSystem: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
      },
      total: {
        trafficHumanError: {
          jan: 33800,
          feb: 31100,
          mar: 37400,
          apr: 33000,
          mei: 40600,
          juni: 28900,
          total: 204800,
        },
        trafficSystem: {
          jan: 85,
          feb: 82,
          mar: 98,
          apr: 91,
          mei: 104,
          juni: 74,
          total: 534,
        },
        customerBehaviour: {
          jan: 10,
          feb: 8,
          mar: 12,
          apr: 9,
          mei: 14,
          juni: 6,
          total: 59,
        },
        assetSystem: {
          jan: 2,
          feb: 1,
          mar: 3,
          apr: 2,
          mei: 2,
          juni: 1,
          total: 11,
        },
      },
    },
    {
      location: "GALAXY B",
      region: "Region 3",
      car: {
        trafficHumanError: {
          jan: 32000,
          feb: 29000,
          mar: 35000,
          apr: 31000,
          mei: 38000,
          juni: 27000,
          total: 192000,
        },
        trafficSystem: {
          jan: 80,
          feb: 75,
          mar: 90,
          apr: 85,
          mei: 95,
          juni: 70,
          total: 495,
        },
        customerBehaviour: {
          jan: 10,
          feb: 8,
          mar: 12,
          apr: 9,
          mei: 14,
          juni: 6,
          total: 59,
        },
        assetSystem: {
          jan: 2,
          feb: 1,
          mar: 3,
          apr: 2,
          mei: 2,
          juni: 1,
          total: 11,
        },
      },
      bike: {
        trafficHumanError: {
          jan: 1800,
          feb: 2100,
          mar: 2400,
          apr: 2000,
          mei: 2600,
          juni: 1900,
          total: 12800,
        },
        trafficSystem: {
          jan: 5,
          feb: 7,
          mar: 8,
          apr: 6,
          mei: 9,
          juni: 4,
          total: 39,
        },
        customerBehaviour: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
        assetSystem: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
      },
      total: {
        trafficHumanError: {
          jan: 33800,
          feb: 31100,
          mar: 37400,
          apr: 33000,
          mei: 40600,
          juni: 28900,
          total: 204800,
        },
        trafficSystem: {
          jan: 85,
          feb: 82,
          mar: 98,
          apr: 91,
          mei: 104,
          juni: 74,
          total: 534,
        },
        customerBehaviour: {
          jan: 10,
          feb: 8,
          mar: 12,
          apr: 9,
          mei: 14,
          juni: 6,
          total: 59,
        },
        assetSystem: {
          jan: 2,
          feb: 1,
          mar: 3,
          apr: 2,
          mei: 2,
          juni: 1,
          total: 11,
        },
      },
    },
    {
      location: "GALAXY A",
      region: "Region 3",
      car: {
        trafficHumanError: {
          jan: 32000,
          feb: 29000,
          mar: 35000,
          apr: 31000,
          mei: 38000,
          juni: 27000,
          total: 192000,
        },
        trafficSystem: {
          jan: 80,
          feb: 75,
          mar: 90,
          apr: 85,
          mei: 95,
          juni: 70,
          total: 495,
        },
        customerBehaviour: {
          jan: 10,
          feb: 8,
          mar: 12,
          apr: 9,
          mei: 14,
          juni: 6,
          total: 59,
        },
        assetSystem: {
          jan: 2,
          feb: 1,
          mar: 3,
          apr: 2,
          mei: 2,
          juni: 1,
          total: 11,
        },
      },
      bike: {
        trafficHumanError: {
          jan: 1800,
          feb: 2100,
          mar: 2400,
          apr: 2000,
          mei: 2600,
          juni: 1900,
          total: 12800,
        },
        trafficSystem: {
          jan: 5,
          feb: 7,
          mar: 8,
          apr: 6,
          mei: 9,
          juni: 4,
          total: 39,
        },
        customerBehaviour: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
        assetSystem: {
          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          mei: 0,
          juni: 0,
          total: 0,
        },
      },
      total: {
        trafficHumanError: {
          jan: 33800,
          feb: 31100,
          mar: 37400,
          apr: 33000,
          mei: 40600,
          juni: 28900,
          total: 204800,
        },
        trafficSystem: {
          jan: 85,
          feb: 82,
          mar: 98,
          apr: 91,
          mei: 104,
          juni: 74,
          total: 534,
        },
        customerBehaviour: {
          jan: 10,
          feb: 8,
          mar: 12,
          apr: 9,
          mei: 14,
          juni: 6,
          total: 59,
        },
        assetSystem: {
          jan: 2,
          feb: 1,
          mar: 3,
          apr: 2,
          mei: 2,
          juni: 1,
          total: 11,
        },
      },
    },
  ];

  const filteredLocations = useMemo(() => {
    if (selectedRegion === "all") return allLocations;
    return allLocations.filter((loc) => loc.region === selectedRegion);
  }, [selectedRegion]);

  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLocations = filteredLocations.slice(startIndex, endIndex);

  const formatNumber = (num: number): string => {
    return num === 0 ? "-" : num.toLocaleString();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const incidentTypes = [
    { key: "trafficHumanError", label: "Traffic Human Error" },
    { key: "trafficSystem", label: "Traffic System" },
    { key: "customerBehaviour", label: "Customer Behaviour" },
    { key: "assetSystem", label: "Asset System" },
  ];

  const vehicleTypes: { key: VehicleType; label: string; bgColor: string }[] = [
    { key: "car", label: "CAR", bgColor: "bg-green-50 dark:bg-green-900" },
    { key: "bike", label: "BIKE", bgColor: "bg-yellow-50 dark:bg-yellow-900" },
    { key: "total", label: "TOTAL", bgColor: "bg-blue-50 dark:bg-blue-900" },
  ];

  return (
    <div className="bg-white dark:bg-[#222B36] rounded-lg p-4 md:p-6">
      <div>
        <h3 className="text-lg md:text-xl font-semibold mb-4 text-black dark:text-white">
          Call by Incident
        </h3>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Month Filter */}
        <div>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
            Bulan:
          </label>
          <CustomSelect
            options={months.map((month) => ({
              id: month.value,
              name: month.label,
            }))}
            value={selectedMonth}
            onChange={(value) => {
              setSelectedMonth(value.toString());
              setCurrentPage(1);
            }}
            placeholder="Pilih bulan"
          />
        </div>

        {/* Year Filter */}
        <div>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
            Tahun:
          </label>
          <CustomSelect
            options={years.map((year) => ({
              id: year,
              name: year,
            }))}
            value={selectedYear}
            onChange={(value) => {
              setSelectedYear(value.toString());
              setCurrentPage(1);
            }}
            placeholder="Pilih tahun"
          />
        </div>

        {/* Region Filter */}
        <div>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
            Region:
          </label>
          <CustomSelect
            options={regions.map((region) => ({
              id: region.value,
              name: region.label,
            }))}
            value={selectedRegion}
            onChange={(value) => {
              setSelectedRegion(value.toString());
              setCurrentPage(1);
            }}
            placeholder="Pilih region"
          />
        </div>

        {/* View Set */}
        <div>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
            View Set:
          </label>
          <CustomSelect
            options={viewSets.map((size) => ({
              id: size,
              name: size.toString(),
            }))}
            value={itemsPerPage}
            onChange={(value) => handleItemsPerPageChange(Number(value))}
            placeholder="Pilih jumlah item"
          />
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Menampilkan data untuk:{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {selectedMonth} {selectedYear}
        </span>{" "}
        | Region:{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {regions.find((r) => r.value === selectedRegion)?.label}
        </span>
      </p>

      {/* Table */}
      <div className="overflow-x-auto thin-scrollbar">
        <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th
                rowSpan={2}
                className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-medium text-black dark:text-white sticky left-0 z-20 bg-gray-100 dark:bg-gray-800 min-w-[180px]"
              >
                LOCATION
              </th>
              {/* Hapus kolom REGION */}
              {vehicleTypes.map((vehicleType) => (
                <th
                  key={vehicleType.key}
                  colSpan={incidentTypes.length}
                  className={`border border-gray-300 dark:border-gray-600 px-2 py-2 text-center font-medium text-black dark:text-white ${vehicleType.bgColor}`}
                >
                  {vehicleType.label}
                </th>
              ))}
            </tr>
            <tr className="bg-gray-50 dark:bg-gray-700">
              {vehicleTypes.map((vehicleType) =>
                incidentTypes.map((incident) => (
                  <th
                    key={`${vehicleType.key}-${incident.key}`}
                    className={`border border-gray-300 dark:border-gray-600 px-2 py-2 text-center text-xs font-medium text-black dark:text-white ${vehicleType.bgColor} min-w-[100px]`}
                  >
                    {incident.label}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody className="text-black dark:text-white">
            {paginatedLocations.map((location, index) => (
              <tr
                key={location.location}
                className={
                  index % 2 === 0
                    ? "bg-white dark:bg-[#222B36]"
                    : "bg-gray-50 dark:bg-gray-800"
                }
              >
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium sticky left-0 z-10 bg-white dark:bg-[#222B36]">
                  {location.location}
                </td>
                {/* Hapus kolom region */}
                {vehicleTypes.map((vehicleType) =>
                  incidentTypes.map((incident) => (
                    <td
                      key={`${location.location}-${vehicleType.key}-${incident.key}`}
                      className="border border-gray-300 dark:border-gray-600 px-2 py-3 text-right text-sm"
                    >
                      {formatNumber(
                        location[vehicleType.key][
                          incident.key as keyof CategoryData
                        ][monthToDataKey[selectedMonth]] || 0
                      )}
                    </td>
                  ))
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Menampilkan {startIndex + 1} -{" "}
          {Math.min(endIndex, filteredLocations.length)} dari{" "}
          {filteredLocations.length} hasil
        </div>

        {/* Location Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center bg-gray-100 dark:bg-[#2A3441] border border-gray-300 dark:border-gray-700 rounded-lg p-1 gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="cursor-pointer w-8 h-8 flex items-center justify-center text-xs rounded border border-transparent text-gray-500 dark:text-gray-300 bg-white dark:bg-[#232B36] hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            {(() => {
              const getVisiblePages = () => {
                const delta = 2;
                const range = [];
                const rangeWithDots = [];

                for (
                  let i = Math.max(2, currentPage - delta);
                  i <= Math.min(totalPages - 1, currentPage + delta);
                  i++
                ) {
                  range.push(i);
                }

                if (currentPage - delta > 2) {
                  rangeWithDots.push(1, "...");
                } else {
                  rangeWithDots.push(1);
                }

                rangeWithDots.push(...range);

                if (currentPage + delta < totalPages - 1) {
                  rangeWithDots.push("...", totalPages);
                } else if (totalPages > 1) {
                  rangeWithDots.push(totalPages);
                }

                return rangeWithDots;
              };

              return getVisiblePages().map((page, index) => {
                if (page === "...") {
                  return (
                    <span
                      key={`dots-${index}`}
                      className="w-8 h-8 flex items-center justify-center text-xs text-gray-400"
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page as number)}
                    className={`cursor-pointer w-8 h-8 flex items-center justify-center text-xs rounded border ${
                      currentPage === page
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white dark:bg-[#232B36] text-gray-500 dark:text-gray-300 border-transparent hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300"
                    } transition-colors`}
                  >
                    {page}
                  </button>
                );
              });
            })()}

            {/* Next Page Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="cursor-pointer w-8 h-8 flex items-center justify-center text-xs rounded border border-transparent text-gray-500 dark:text-gray-300 bg-white dark:bg-[#232B36] hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallByIncidentTable;
