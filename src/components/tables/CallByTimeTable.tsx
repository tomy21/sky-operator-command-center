import {
  ChevronLeft,
  ChevronRight,
  // ChevronsLeft, ChevronsRight
} from "lucide-react";
import React, { useState } from "react";
import { CustomSelect } from "../input/CustomSelect";
import { months, regions, viewSets, years } from "@/utils/filterData";
import {
  CallData,
  TimeSlotData,
  allLocations,
  generateTimeSlots,
  mockYearlyData,
} from "@/data/mock/callByTimeData";
import { useCallByTimeData } from "@/hooks/useCallByTime";

const CallByTimeTable: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [selectedMonth, setSelectedMonth] = useState<string>("april");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [locationsPerPage, setLocationsPerPage] = useState<number>(5);
  const [currentLocationPage, setCurrentLocationPage] = useState<number>(1);

  const {
    data: apiData,
    loading: apiLoading,
    // error: apiError,
    // refetch,
  } = useCallByTimeData({
    year: selectedYear,
    month: selectedMonth,
    region: selectedRegion,
    page: currentLocationPage,
    itemsPerPage: locationsPerPage,
  });

  const isUsingDummyData = !apiData || apiData.length === 0;

  const getCurrentMonthData = (): TimeSlotData[] => {
    if (apiData && apiData.length > 0) {
      return apiData;
    }

    return mockYearlyData[selectedYear]?.[selectedMonth] || [];
  };

  const getFilteredLocations = () => {
    if (selectedRegion === "all") {
      return allLocations;
    }
    return allLocations.filter(
      (location) => location.region === selectedRegion
    );
  };

  const timeSlots = generateTimeSlots();
  const currentMonthData = getCurrentMonthData();
  const filteredLocations = getFilteredLocations();

  const totalLocationPages = Math.ceil(
    filteredLocations.length / locationsPerPage
  );
  const startLocationIndex = (currentLocationPage - 1) * locationsPerPage;
  const endLocationIndex = startLocationIndex + locationsPerPage;
  const currentLocations = filteredLocations.slice(
    startLocationIndex,
    endLocationIndex
  );

  const handleViewSetChange = (newViewSet: number) => {
    setLocationsPerPage(newViewSet);
    setCurrentLocationPage(1);
  };

  const handleRegionChange = (newRegion: string) => {
    setSelectedRegion(newRegion);
    setCurrentLocationPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentLocationPage(page);
  };

  const getDataForTimeSlot = (timeSlot: string, location: string): CallData => {
    const timeSlotData = currentMonthData.find(
      (data) => data.hour === timeSlot
    );

    if (timeSlotData && timeSlotData[location as keyof TimeSlotData]) {
      return timeSlotData[location as keyof TimeSlotData] as CallData;
    }

    return {
      call: Math.floor(Math.random() * 10),
      noAnswer: Math.floor(Math.random() * 5),
      doublePush: Math.floor(Math.random() * 3),
    };
  };

  if (apiLoading) {
    return (
      <div className="bg-white dark:bg-[#222B36] rounded-lg p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-gray-600 dark:text-gray-300">
              Memuat data...
            </span>
          </div>
        </div>
      </div>
    );
  }

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
        {isUsingDummyData && (
          <div className="mb-4 p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-md text-sm">
          <p>Menggunakan data dummy karena data dari API tidak tersedia.</p>
        </div>
        )}
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
