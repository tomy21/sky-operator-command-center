import {
  ChevronLeft,
  ChevronRight,
  // ChevronsLeft, ChevronsRight
} from "lucide-react";
import React, { useState } from "react";
import { CustomSelect } from "../input/CustomSelect";
import { months, regions, viewSets, years } from "@/utils/filterData";

interface CallData {
  call: number;
  noAnswer: number;
  doublePush: number;
}

interface TimeSlotData {
  hour: string;
  hpm: CallData;
  lku: CallData;
  lmp: CallData;
  pv: CallData;
  spark: CallData;
  picon: CallData;
  ml: CallData;
  lmn: CallData;
  shlv: CallData;
  shkj: CallData;
  shkd: CallData;
  uph: CallData;
  helipad: CallData;
}

interface MonthlyData {
  [key: string]: TimeSlotData[];
}

interface YearlyData {
  [key: string]: MonthlyData;
}

interface Location {
  key: string;
  label: string;
  region: string;
}

const CallByTimeTable: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [selectedMonth, setSelectedMonth] = useState<string>("april");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [locationsPerPage, setLocationsPerPage] = useState<number>(5);
  const [currentLocationPage, setCurrentLocationPage] = useState<number>(1);

  const allLocations: Location[] = [
    { key: "hpm", label: "HPM", region: "Region 1" },
    { key: "lku", label: "LKU", region: "Region 1" },
    { key: "lmp", label: "LMP", region: "Region 2" },
    { key: "pv", label: "PV", region: "Region 2" },
    { key: "spark", label: "SPARK", region: "Region 3" },
    { key: "picon", label: "PICON", region: "Region 3" },
    { key: "ml", label: "ML", region: "Region 4" },
    { key: "lmn", label: "LMN", region: "Region 4" },
    { key: "shlv", label: "SHLV", region: "Region 5" },
    { key: "shkj", label: "SHKJ", region: "Region 5" },
    { key: "shkd", label: "SHKD", region: "Region 5" },
    { key: "uph", label: "UPH", region: "Region 1" },
    { key: "helipad", label: "HELIPAD", region: "Region 2" },
  ];

  // Sample yearly data
  const yearlyData: YearlyData = {
    "2024": {
      january: [],
      february: [],
      march: [],
      april: [
        {
          hour: "00:00-01:00",
          hpm: { call: 5, noAnswer: 2, doublePush: 1 },
          lku: { call: 3, noAnswer: 1, doublePush: 0 },
          lmp: { call: 2, noAnswer: 2, doublePush: 0 },
          pv: { call: 7, noAnswer: 3, doublePush: 1 },
          spark: { call: 1, noAnswer: 0, doublePush: 0 },
          picon: { call: 4, noAnswer: 1, doublePush: 2 },
          ml: { call: 6, noAnswer: 2, doublePush: 0 },
          lmn: { call: 2, noAnswer: 1, doublePush: 1 },
          shlv: { call: 8, noAnswer: 4, doublePush: 2 },
          shkj: { call: 3, noAnswer: 0, doublePush: 0 },
          shkd: { call: 5, noAnswer: 2, doublePush: 1 },
          uph: { call: 1, noAnswer: 1, doublePush: 0 },
          helipad: { call: 2, noAnswer: 0, doublePush: 0 },
        },
      ],
      may: [],
      june: [],
      july: [],
      august: [],
      september: [],
      october: [],
      november: [],
      december: [],
    },
    "2023": {
      january: [],
      february: [],
      march: [],
      april: [],
      may: [],
      june: [],
      july: [],
      august: [],
      september: [],
      october: [],
      november: [],
      december: [],
    },
    "2022": {
      january: [],
      february: [],
      march: [],
      april: [],
      may: [],
      june: [],
      july: [],
      august: [],
      september: [],
      october: [],
      november: [],
      december: [],
    },
    "2025": {
      january: [],
      february: [],
      march: [],
      april: [],
      may: [],
      june: [],
      july: [],
      august: [],
      september: [],
      october: [],
      november: [],
      december: [],
    },
  };

  const getCurrentMonthData = (): TimeSlotData[] => {
    return yearlyData[selectedYear]?.[selectedMonth] || [];
  };

  // Filter locations by region
  const getFilteredLocations = (): Location[] => {
    if (selectedRegion === "all") {
      return allLocations;
    }
    return allLocations.filter(
      (location) => location.region === selectedRegion
    );
  };

  // Generate all 24 hour slots
  const generateTimeSlots = (): string[] => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
      const startHour = i.toString().padStart(2, "0");
      const endHour = ((i + 1) % 24).toString().padStart(2, "0");
      slots.push(`${startHour}:00-${endHour}:00`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const currentMonthData = getCurrentMonthData();
  const filteredLocations = getFilteredLocations();

  // Location pagination
  const totalLocationPages = Math.ceil(
    filteredLocations.length / locationsPerPage
  );
  const startLocationIndex = (currentLocationPage - 1) * locationsPerPage;
  const endLocationIndex = startLocationIndex + locationsPerPage;
  const currentLocations = filteredLocations.slice(
    startLocationIndex,
    endLocationIndex
  );

  // Handle view set change
  const handleViewSetChange = (newViewSet: number) => {
    setLocationsPerPage(newViewSet);
    setCurrentLocationPage(1); // Reset to first page when changing view set
  };

  // Handle region change
  const handleRegionChange = (newRegion: string) => {
    setSelectedRegion(newRegion);
    setCurrentLocationPage(1); // Reset to first page when changing region
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentLocationPage(page);
  };

  // Get data for specific time slot and location
  const getDataForTimeSlot = (timeSlot: string, location: string): CallData => {
    const timeSlotData = currentMonthData.find(
      (data) => data.hour === timeSlot
    );
    if (timeSlotData && timeSlotData[location as keyof TimeSlotData]) {
      return timeSlotData[location as keyof TimeSlotData] as CallData;
    }
    // Fallback to random data if no specific data exists
    return {
      call: Math.floor(Math.random() * 10),
      noAnswer: Math.floor(Math.random() * 5),
      doublePush: Math.floor(Math.random() * 3),
    };
  };

  // Tambahkan fungsi baru untuk mengkonversi data ke JSON
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   const convertTableDataToJSON = (): any => {
  //     const tableData = {
  //       metadata: {
  //         year: selectedYear,
  //         month: selectedMonth,
  //         region: selectedRegion,
  //         regionLabel: regions.find((r) => r.value === selectedRegion)?.label,
  //         locationsCount: filteredLocations.length,
  //         generatedAt: new Date().toISOString(),
  //       },
  //       timeSlots: timeSlots.map((timeSlot) => {
  //         const locations = currentLocations.map((location) => {
  //           const data = getDataForTimeSlot(timeSlot, location.key);
  //           return {
  //             key: location.key,
  //             label: location.label,
  //             region: location.region,
  //             call: data.call,
  //             noAnswer: data.noAnswer,
  //             doublePush: data.doublePush,
  //           };
  //         });

  //         const totalCall = locations.reduce(
  //           (sum, location) => sum + location.call,
  //           0
  //         );
  //         const totalNoAnswer = locations.reduce(
  //           (sum, location) => sum + location.noAnswer,
  //           0
  //         );
  //         const totalDoublePush = locations.reduce(
  //           (sum, location) => sum + location.doublePush,
  //           0
  //         );

  //         return {
  //           timeSlot,
  //           locations,
  //           totals: {
  //             totalCall,
  //             totalNoAnswer,
  //             totalDoublePush,
  //           },
  //         };
  //       }),
  //     };

  //     return tableData;
  //   };

  // Tambahkan useEffect untuk console log data JSON
  //   React.useEffect(() => {
  //     const jsonData = convertTableDataToJSON();
  //     console.log("Table Data JSON:", jsonData);
  //   }, [
  //     selectedYear,
  //     selectedMonth,
  //     selectedRegion,
  //     currentLocationPage,
  //     locationsPerPage,
  //   ]);

  return (
    <div className="bg-white dark:bg-[#222B36] rounded-lg p-4 md:p-6">
      <div className="mb-6">
        <h3 className="text-lg md:text-xl font-semibold mb-4">Call by Time</h3>

        {/* Year, Month, Region, and View Set Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label
              htmlFor="month-select"
              className="block text-sm text-gray-500 dark:text-gray-400 mb-2"
            >
              Pilih Bulan:
            </label>
            <CustomSelect
              options={months.map((month) => ({
                id: month.value,
                name: month.label,
              }))}
              value={selectedMonth}
              onChange={(value) => {
                setSelectedMonth(value.toString());
                setCurrentLocationPage(1);
              }}
              placeholder="Pilih bulan"
            />
            {/* <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-800 text-black dark:text-white"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select> */}
          </div>
          <div>
            <label
              htmlFor="year-select"
              className="block text-sm text-gray-500 dark:text-gray-400 mb-2"
            >
              Select Year:
            </label>
            <CustomSelect
              options={years.map((year) => ({
                id: year,
                name: year,
              }))}
              value={selectedYear}
              onChange={(value) => {
                setSelectedYear(value.toString());
                setCurrentLocationPage(1);
              }}
              placeholder="Pilih tahun"
            />
            {/* <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-800 text-black dark:text-white"
            >
              {years.map((year) => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </select> */}
          </div>
          <div>
            <label
              htmlFor="region-select"
              className="block text-sm text-gray-500 dark:text-gray-400 mb-2"
            >
              Select Region:
            </label>
            <CustomSelect
              options={regions.map((region) => ({
                id: region.value,
                name: region.label,
              }))}
              value={selectedRegion}
              onChange={(value) => {
                handleRegionChange(value.toString());
                setCurrentLocationPage(1);
              }}
              placeholder="Pilih region"
            />
            {/* <select
              id="region-select"
              value={selectedRegion}
              onChange={(e) => handleRegionChange(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-800 text-black dark:text-white"
            >
              {regions.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </select> */}
          </div>
          <div>
            <label
              htmlFor="view-select"
              className="block text-sm text-gray-500 dark:text-gray-400 mb-2"
            >
              View Set:
            </label>
            <CustomSelect
              options={viewSets.map((size) => ({
                id: size,
                name: size.toString(),
              }))}
              value={locationsPerPage}
              onChange={(value) => handleViewSetChange(Number(value))}
              placeholder="Pilih jumlah item"
            />
          </div>
        </div>

        {/* <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Currently showing data for:{" "}
          <span className="font-semibold capitalize">
            {selectedMonth} {selectedYear}
          </span>
          {selectedRegion !== "all" && (
            <span className="ml-2">
              | Region:{" "}
              <span className="font-semibold">
                {regions.find((r) => r.value === selectedRegion)?.label}
              </span>
            </span>
          )}
        </p> */}
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

      {/* Table Container */}
      <div className="relative border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden thin-scrollbar">
        <div className="overflow-auto max-h-96" style={{ maxWidth: "100%" }}>
          <table className="w-full border-collapse text-xs">
            <thead className="sticky top-0 z-20">
              {/* Time Headers */}
              <tr>
                <th
                  rowSpan={3}
                  className="sticky left-0 z-30 border border-gray-400 dark:border-gray-700 bg-blue-900 text-white p-2 min-w-[120px]"
                >
                  LOCATION
                </th>
                {timeSlots.map((timeSlot) => (
                  <th
                    key={timeSlot}
                    colSpan={3}
                    className="border border-gray-400 dark:border-gray-700 bg-green-600 text-white p-1 text-center min-w-[120px] text-xs"
                  >
                    {timeSlot}
                  </th>
                ))}
              </tr>
              <tr>
                {timeSlots.map((timeSlot) => (
                  <React.Fragment key={timeSlot}>
                    <th className="border border-gray-400 dark:border-gray-700 bg-blue-200 dark:bg-blue-800 text-black dark:text-white p-1 text-center min-w-[40px]">
                      Call
                    </th>
                    <th className="border border-gray-400 dark:border-gray-700 bg-blue-200 dark:bg-blue-800 text-black dark:text-white p-1 text-center min-w-[40px]">
                      No Answer
                    </th>
                    <th className="border border-gray-400 dark:border-gray-700 bg-blue-200 dark:bg-blue-800 text-black dark:text-white p-1 text-center min-w-[40px]">
                      Double Push
                    </th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentLocations.map((location, index) => (
                <tr
                  key={location.key}
                  className={
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-800"
                  }
                >
                  <td className="sticky left-0 z-10 border border-gray-400 dark:border-gray-700 bg-blue-900 text-white p-2 font-medium text-center">
                    {location.label}
                  </td>
                  {timeSlots.map((timeSlot) => {
                    const data = getDataForTimeSlot(timeSlot, location.key);
                    return (
                      <React.Fragment key={timeSlot}>
                        <td className="border border-gray-400 dark:border-gray-700 p-1 text-center text-black dark:text-white">
                          {data.call}
                        </td>
                        <td className="border border-gray-400 dark:border-gray-700 p-1 text-center text-black dark:text-white">
                          {data.noAnswer}
                        </td>
                        <td className="border border-gray-400 dark:border-gray-700 p-1 text-center text-black dark:text-white">
                          {data.doublePush}
                        </td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              ))}

              {/* Total Row */}
              <tr className="bg-blue-900 text-white font-bold sticky bottom-0 z-10">
                <td className="sticky left-0 z-20 border border-gray-400 dark:border-gray-700 bg-blue-900 text-white p-2 text-center font-bold">
                  TOTAL
                </td>
                {timeSlots.map((timeSlot) => {
                  const totalCall = currentLocations.reduce(
                    (sum, location) =>
                      sum + getDataForTimeSlot(timeSlot, location.key).call,
                    0
                  );
                  const totalNoAnswer = currentLocations.reduce(
                    (sum, location) =>
                      sum + getDataForTimeSlot(timeSlot, location.key).noAnswer,
                    0
                  );
                  const totalDoublePush = currentLocations.reduce(
                    (sum, location) =>
                      sum +
                      getDataForTimeSlot(timeSlot, location.key).doublePush,
                    0
                  );
                  return (
                    <React.Fragment key={timeSlot}>
                      <td className="border border-gray-400 dark:border-gray-700 p-1 text-center">
                        {totalCall}
                      </td>
                      <td className="border border-gray-400 dark:border-gray-700 p-1 text-center">
                        {totalNoAnswer}
                      </td>
                      <td className="border border-gray-400 dark:border-gray-700 p-1 text-center">
                        {totalDoublePush}
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Location Pagination Controls */}
      {totalLocationPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Menampilkan {startLocationIndex + 1} -{" "}
            {Math.min(endLocationIndex, filteredLocations.length)} dari{" "}
            {filteredLocations.length}
            {selectedRegion !== "all" && (
              <span className="ml-2 text-blue-600 dark:text-blue-400">
                ({regions.find((r) => r.value === selectedRegion)?.label})
              </span>
            )}{" "}
            hasil
          </div>

          <div className="flex items-center bg-gray-100 dark:bg-[#2A3441] border border-gray-300 dark:border-gray-700 rounded-lg p-1 gap-1">
            <button
              onClick={() => handlePageChange(currentLocationPage - 1)}
              disabled={currentLocationPage === 1}
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
                  let i = Math.max(2, currentLocationPage - delta);
                  i <=
                  Math.min(totalLocationPages - 1, currentLocationPage + delta);
                  i++
                ) {
                  range.push(i);
                }

                if (currentLocationPage - delta > 2) {
                  rangeWithDots.push(1, "...");
                } else {
                  rangeWithDots.push(1);
                }

                rangeWithDots.push(...range);

                if (currentLocationPage + delta < totalLocationPages - 1) {
                  rangeWithDots.push("...", totalLocationPages);
                } else if (totalLocationPages > 1) {
                  rangeWithDots.push(totalLocationPages);
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
                      currentLocationPage === page
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
              onClick={() => handlePageChange(currentLocationPage + 1)}
              disabled={currentLocationPage === totalLocationPages}
              className="cursor-pointer w-8 h-8 flex items-center justify-center text-xs rounded border border-transparent text-gray-500 dark:text-gray-300 bg-white dark:bg-[#232B36] hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallByTimeTable;
