import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { CustomSelect } from "../input/CustomSelect";
import { months, regions, viewSets, years } from "@/utils/filterData";

interface GateDataCell {
  humanError: number;
  customerBehaviour: number;
  assetSystem: number;
}

interface LocationGateData {
  location: string;
  region: string;
  gates: {
    [gateName: string]: {
      car: GateDataCell;
      bike: GateDataCell;
    };
  };
}

interface ApiResponse {
  year: string;
  month: string;
  locations: LocationGateData[];
}

const CallByGateTable: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("january");
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  const generateGateNames = (): string[] => {
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

  const gateNames = generateGateNames();

  const generateLocations = (): LocationGateData[] => {
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

      gateNames.forEach((gateName) => {
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

  const yearlyData: { [year: string]: { [month: string]: ApiResponse } } = {
    "2024": {
      january: {
        year: "2024",
        month: "january",
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

  const getCurrentData = (): LocationGateData[] => {
    const currentYearData = yearlyData[selectedYear];
    if (!currentYearData) return [];
    const monthData = currentYearData[selectedMonth];
    if (!monthData) return [];

    if (selectedRegion === "all") {
      return monthData.locations;
    }
    return monthData.locations.filter(
      (location) => location.region === selectedRegion
    );
  };

  const allLocations = getCurrentData();

  const totalPages = Math.ceil(allLocations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLocations = allLocations.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const getCellValue = (
    location: LocationGateData,
    gateName: string,
    vehicleType: "car" | "bike",
    errorType: keyof GateDataCell
  ): number => {
    const gateData = location.gates[gateName];
    if (!gateData) return 0;

    return gateData[vehicleType][errorType] || 0;
  };

  const getHeaderClassName = (gateName: string): string => {
    if (gateName === "TOTAL") {
      return "bg-red-600 dark:bg-red-700 text-white font-bold";
    }
    if (gateName.includes("Total")) {
      return "bg-orange-500 dark:bg-orange-600 text-white font-bold";
    }
    if (gateName.includes("Pintu Masuk")) {
      return "bg-green-500 dark:bg-green-600 text-white";
    }
    if (gateName.includes("Pintu Keluar")) {
      return "bg-blue-500 dark:bg-blue-600 text-white";
    }
    return "bg-gray-500 dark:bg-gray-600 text-white";
  };

  const getLocationRowClassName = (location: string): string => {
    if (location === "TOTAL") {
      return "bg-orange-100 dark:bg-orange-900/30 font-bold";
    }
    return "hover:bg-gray-50 dark:hover:bg-gray-700";
  };

  return (
    <div className="bg-white dark:bg-[#222B36] rounded-lg p-4 md:p-6">
      <div className="mb-6">
        <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Call by Gate
        </h3>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
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

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
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

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
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

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
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

        <p className="text-sm text-gray-600 dark:text-gray-300">
          Menampilkan data untuk:{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {selectedMonth} {selectedYear}
          </span>{" "}
          | Region:{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {regions.find((r) => r.value === selectedRegion)?.label}
          </span>
        </p>
      </div>

      <div className="w-full overflow-x-auto thin-scrollbar">
        <div className="max-h-[600px] overflow-y-auto">
          {" "}
          {/* Tambahkan wrapper ini */}
          <table className="w-full border-collapse border border-gray-400 dark:border-gray-600 text-xs">
            <thead className="sticky top-0 z-30 bg-white dark:bg-gray-800">
              {/* Gates header row */}
              <tr>
                <th
                  rowSpan={3}
                  className="sticky left-0 z-20 border border-gray-400 dark:border-gray-600 bg-gray-800 dark:bg-gray-900 text-white p-2 min-w-[120px] font-bold"
                >
                  LOKASI
                </th>
                {gateNames.map((gateName) => (
                  <th
                    key={gateName}
                    colSpan={6}
                    className={`border border-gray-400 dark:border-gray-600 ${getHeaderClassName(
                      gateName
                    )} p-1 text-center font-semibold min-w-[180px]`}
                  >
                    {gateName}
                  </th>
                ))}
              </tr>

              {/* Vehicle type header row */}
              <tr>
                {gateNames.map((gateName) => (
                  <React.Fragment key={gateName}>
                    <th
                      colSpan={3}
                      className="border border-gray-400 dark:border-gray-600 bg-blue-200 dark:bg-blue-700 text-gray-900 dark:text-white p-1 text-center font-medium"
                    >
                      MOBIL
                    </th>
                    <th
                      colSpan={3}
                      className="border border-gray-400 dark:border-gray-600 bg-green-200 dark:bg-green-700 text-gray-900 dark:text-white p-1 text-center font-medium"
                    >
                      MOTOR
                    </th>
                  </React.Fragment>
                ))}
              </tr>

              {/* Error types header row */}
              <tr>
                {gateNames.map((gateName) => (
                  <React.Fragment key={gateName}>
                    {/* Car error types */}
                    <th className="border border-gray-400 dark:border-gray-600 bg-blue-100 dark:bg-blue-600 text-gray-900 dark:text-white p-1 text-center min-w-[60px] font-medium text-[10px]">
                      Human Error
                    </th>
                    <th className="border border-gray-400 dark:border-gray-600 bg-blue-100 dark:bg-blue-600 text-gray-900 dark:text-white p-1 text-center min-w-[60px] font-medium text-[10px]">
                      Customer Behaviour
                    </th>
                    <th className="border border-gray-400 dark:border-gray-600 bg-blue-100 dark:bg-blue-600 text-gray-900 dark:text-white p-1 text-center min-w-[60px] font-medium text-[10px]">
                      Asset / System
                    </th>
                    {/* Bike error types */}
                    <th className="border border-gray-400 dark:border-gray-600 bg-green-100 dark:bg-green-600 text-gray-900 dark:text-white p-1 text-center min-w-[60px] font-medium text-[10px]">
                      Human Error
                    </th>
                    <th className="border border-gray-400 dark:border-gray-600 bg-green-100 dark:bg-green-600 text-gray-900 dark:text-white p-1 text-center min-w-[60px] font-medium text-[10px]">
                      Customer Behaviour
                    </th>
                    <th className="border border-gray-400 dark:border-gray-600 bg-green-100 dark:bg-green-600 text-gray-900 dark:text-white p-1 text-center min-w-[60px] font-medium text-[10px]">
                      Asset / System
                    </th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedLocations.map((location) => (
                <tr
                  key={location.location}
                  className={`${getLocationRowClassName(
                    location.location
                  )} transition-colors duration-150`}
                >
                  <td
                    className={`sticky left-0 z-10 border border-gray-400 dark:border-gray-600 bg-gray-700 dark:bg-gray-800 text-white p-2 font-medium`}
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">
                        {location.location}
                      </span>
                      {/* {location.region !== 'all' && (
                                                <span className="text-xs text-gray-300 capitalize">{location.region}</span>
                                            )} */}
                    </div>
                  </td>

                  {gateNames.map((gateName) => (
                    <React.Fragment key={`${location.location}-${gateName}`}>
                      {/* Car data */}
                      <td className="border border-gray-400 dark:border-gray-600 p-1 text-center bg-blue-50 dark:bg-blue-900/20 text-gray-900 dark:text-gray-100">
                        {getCellValue(
                          location,
                          gateName,
                          "car",
                          "humanError"
                        ) || "-"}
                      </td>
                      <td className="border border-gray-400 dark:border-gray-600 p-1 text-center bg-blue-50 dark:bg-blue-900/20 text-gray-900 dark:text-gray-100">
                        {getCellValue(
                          location,
                          gateName,
                          "car",
                          "customerBehaviour"
                        ) || "-"}
                      </td>
                      <td className="border border-gray-400 dark:border-gray-600 p-1 text-center bg-blue-50 dark:bg-blue-900/20 text-gray-900 dark:text-gray-100">
                        {getCellValue(
                          location,
                          gateName,
                          "car",
                          "assetSystem"
                        ) || "-"}
                      </td>
                      {/* Bike data */}
                      <td className="border border-gray-400 dark:border-gray-600 p-1 text-center bg-green-50 dark:bg-green-900/20 text-gray-900 dark:text-gray-100">
                        {getCellValue(
                          location,
                          gateName,
                          "bike",
                          "humanError"
                        ) || "-"}
                      </td>
                      <td className="border border-gray-400 dark:border-gray-600 p-1 text-center bg-green-50 dark:bg-green-900/20 text-gray-900 dark:text-gray-100">
                        {getCellValue(
                          location,
                          gateName,
                          "bike",
                          "customerBehaviour"
                        ) || "-"}
                      </td>
                      <td className="border border-gray-400 dark:border-gray-600 p-1 text-center bg-green-50 dark:bg-green-900/20 text-gray-900 dark:text-gray-100">
                        {getCellValue(
                          location,
                          gateName,
                          "bike",
                          "assetSystem"
                        ) || "-"}
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Menampilkan {startIndex + 1} -{" "}
          {Math.min(endIndex, allLocations.length)} dari {allLocations.length}{" "}
          hasil
        </div>

        {/* Location Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center bg-gray-100 dark:bg-[#2A3441] border border-gray-300 dark:border-gray-700 rounded-lg p-1 gap-1">
            {/* First Page Button */}
            {/* <button
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            className="cursor-pointer w-8 h-8 flex items-center justify-center text-xs rounded border border-transparent text-gray-500 dark:text-gray-300 bg-white dark:bg-[#232B36] hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronsLeft className="w-4 h-4" />
                        </button> */}

            {/* Previous Page Button */}
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

            {/* Last Page Button */}
            {/* <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            className="cursor-pointer w-8 h-8 flex items-center justify-center text-xs rounded border border-transparent text-gray-500 dark:text-gray-300 bg-white dark:bg-[#232B36] hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronsRight className="w-4 h-4" />
                        </button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default CallByGateTable;
