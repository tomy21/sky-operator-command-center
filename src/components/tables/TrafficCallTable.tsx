import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CustomSelect } from "../input/CustomSelect";
import { periods, regions, viewSets, years } from "@/utils/filterData";
import { useCallByTrafficData } from "@/hooks/useCallByTraffic";
import { LocationData } from "@/data/mock/callByTrafficData";



type MonthKey =
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

const TrafficCallTable: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("semester1");
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  const getPeriodMonth = (period: string): string => {
    switch (period) {
      case "semester1":
        return "january";
      case "semester2":
        return "july";
      case "yearly":
        return "yearly";
      default:
        return "january";
    }
  };

  const {
    data: apiData,
    // loading,
    error,
    pagination: apiPagination,
    isUsingDummyData,
    // refetch,
  } = useCallByTrafficData({
    year: selectedYear,
    month: getPeriodMonth(selectedPeriod),
    period: selectedPeriod,
    region: selectedRegion,
    page: currentPage,
    itemsPerPage: itemsPerPage,
  });

  const getMonthsForPeriod = (period: string) => {
    if (period === "semester1") {
      return ["jan", "feb", "mar", "apr", "mei", "juni"];
    } else if (period === "semester2") {
      return ["juli", "agu", "sept", "okt", "nov", "des"];
    } else {
      return [
        "jan",
        "feb",
        "mar",
        "apr",
        "mei",
        "juni",
        "juli",
        "agu",
        "sept",
        "okt",
        "nov",
        "des",
      ];
    }
  };

  const getMonthLabels = (period: string) => {
    if (period === "semester1") {
      return ["Jan", "Feb", "Mar", "Apr", "Mei", "Juni"];
    } else if (period === "semester2") {
      return ["Juli", "Agu", "Sept", "Okt", "Nov", "Des"];
    } else {
      return [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Juni",
        "Juli",
        "Agu",
        "Sept",
        "Okt",
        "Nov",
        "Des",
      ];
    }
  };

  // const allData = generateSampleData();

  const getCurrentData = (): LocationData[] => {
    return apiData || [];
  };

  const filteredData = getCurrentData();

  const totalPages =
    apiPagination?.totalPages ||
    Math.ceil((apiData?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = isUsingDummyData
    ? filteredData.slice(startIndex, endIndex)
    : filteredData;

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const formatPercentage = (percent: number): string => {
    return `${percent.toFixed(1)}%`;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
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
          Traffic Call
        </h3>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
              Periode:
            </label>
            <CustomSelect
              options={periods.map((period) => ({
                id: period.value,
                name: period.label,
              }))}
              value={selectedPeriod}
              onChange={(value) => {
                setSelectedPeriod(value.toString());
                setCurrentPage(1);
              }}
              placeholder="Pilih periode"
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
            {/* <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select> */}
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
            {/* <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {viewSets.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select> */}
          </div>
        </div>
        {isUsingDummyData && (
          <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-md">
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              API data not available. Showing sample data.
              {error && <span className="ml-2">({error})</span>}
            </div>
          </div>
        )}

        <p className="text-sm text-gray-600 dark:text-gray-300">
          Menampilkan data untuk:{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {periods.find((p) => p.value === selectedPeriod)?.label}{" "}
            {selectedYear}
          </span>{" "}
          | Region:{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {regions.find((r) => r.value === selectedRegion)?.label}
          </span>
        </p>
      </div>

      <div className="w-full overflow-x-auto thin-scrollbar">
        <div className="max-h-[600px] overflow-y-auto thin-scrollbar border border-gray-300 dark:border-gray-600 rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-40">
              <tr>
                <th
                  rowSpan={2}
                  className="border border-gray-400 dark:border-gray-600 px-3 py-2 text-left font-medium text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 sticky left-0 z-50 min-w-[140px]"
                >
                  Location
                </th>
                <th
                  rowSpan={2}
                  className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-center font-medium text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 sticky left-[140px] z-50 min-w-[80px]"
                >
                  Vehicle
                </th>
                <th
                  rowSpan={2}
                  className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-center font-medium text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 sticky left-[220px] z-50 min-w-[100px]"
                >
                  Traffic & Call
                </th>
                {getMonthsForPeriod(selectedPeriod)
                  .concat(["total"])
                  .map((month, idx) => (
                    <th
                      key={month}
                      colSpan={2}
                      className="border border-gray-400 dark:border-gray-600 px-4 py-2 text-center font-medium text-sm text-gray-900 dark:text-white bg-blue-100 dark:bg-blue-700 min-w-[120px]"
                    >
                      {getMonthLabels(selectedPeriod).concat(["Total"])[idx]}
                    </th>
                  ))}
              </tr>
              <tr>
                {getMonthsForPeriod(selectedPeriod)
                  .concat(["total"])
                  .map((_, idx) => (
                    <React.Fragment key={idx}>
                      <th className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-center font-medium text-xs text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-600 min-w-[60px]">
                        Qty
                      </th>
                      <th className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-center font-medium text-xs text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-600 min-w-[60px]">
                        %
                      </th>
                    </React.Fragment>
                  ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((location) => (
                <React.Fragment key={location.location}>
                  {/* Car rows */}
                  <tr
                    className={`${getLocationRowClassName(
                      location.location
                    )} transition-colors duration-150`}
                  >
                    <td
                      rowSpan={4}
                      className="border border-gray-400 dark:border-gray-600 px-3 py-2 text-sm font-medium text-gray-900 dark:text-white align-top sticky left-0 z-20 bg-white dark:bg-gray-800 min-w-[140px]"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">
                          {location.location}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {location.region}
                        </span>
                      </div>
                    </td>

                    <td
                      rowSpan={2}
                      className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-center text-sm text-gray-900 dark:text-white align-middle bg-blue-100 dark:bg-blue-700 sticky left-[140px] z-20 min-w-[80px]"
                    >
                      Car
                    </td>

                    <td className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-sm text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-600 sticky left-[220px] z-20 min-w-[100px]">
                      Traffic
                    </td>
                    {getMonthsForPeriod(selectedPeriod)
                      .concat(["total"])
                      .map((month) => {
                        const data = location.car[month as MonthKey];
                        return (
                          <React.Fragment key={`car-traffic-${month}`}>
                            <td className="border border-gray-400 dark:border-gray-600 px-3 py-2 text-right text-sm text-gray-900 dark:text-gray-100 min-w-[60px] bg-blue-50 dark:bg-blue-900/20">
                              {data?.traffic.qty === 0
                                ? "-"
                                : formatNumber(data?.traffic.qty ?? 0)}
                            </td>
                            <td className="border border-gray-400 dark:border-gray-600 px-3 py-2 text-right text-sm text-gray-900 dark:text-gray-100 min-w-[60px] bg-blue-50 dark:bg-blue-900/20">
                              {data?.traffic.percentage === 0
                                ? "0.0%"
                                : formatPercentage(
                                    data?.traffic.percentage ?? 0
                                  )}
                            </td>
                          </React.Fragment>
                        );
                      })}
                  </tr>
                  <tr
                    className={`${getLocationRowClassName(
                      location.location
                    )} transition-colors duration-150`}
                  >
                    <td className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-sm text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-600 sticky left-[220px] z-20 min-w-[100px]">
                      Call
                    </td>
                    {getMonthsForPeriod(selectedPeriod)
                      .concat(["total"])
                      .map((month) => {
                        const data = location.car[month as MonthKey];
                        return (
                          <React.Fragment key={`car-call-${month}`}>
                            <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-right text-sm text-gray-900 dark:text-gray-100 bg-blue-50 dark:bg-blue-900/20">
                              {data?.call.qty === 0
                                ? "-"
                                : formatNumber(data?.call.qty ?? 0)}
                            </td>
                            <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-right text-sm text-gray-900 dark:text-gray-100 bg-blue-50 dark:bg-blue-900/20">
                              {data?.call.percentage === 0
                                ? "0.0%"
                                : formatPercentage(data?.call.percentage ?? 0)}
                            </td>
                          </React.Fragment>
                        );
                      })}
                  </tr>

                  {/* Bike rows */}
                  <tr
                    className={`${getLocationRowClassName(
                      location.location
                    )} transition-colors duration-150`}
                  >
                    <td
                      rowSpan={2}
                      className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-center text-sm text-gray-900 dark:text-white align-middle bg-blue-100 dark:bg-blue-700 sticky left-[140px] z-20 min-w-[80px]"
                    >
                      Bike
                    </td>
                    <td className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-sm text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-600 sticky left-[220px] z-20 min-w-[100px]">
                      Traffic
                    </td>
                    {getMonthsForPeriod(selectedPeriod)
                      .concat(["total"])
                      .map((month) => {
                        const data = location.bike[month as MonthKey];
                        return (
                          <React.Fragment key={`bike-traffic-${month}`}>
                            <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-right text-sm text-gray-900 dark:text-gray-100 bg-blue-50 dark:bg-blue-900/20">
                              {data?.traffic.qty === 0
                                ? "-"
                                : formatNumber(data?.traffic.qty ?? 0)}
                            </td>
                            <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-right text-sm text-gray-900 dark:text-gray-100 bg-blue-50 dark:bg-blue-900/20">
                              {data?.traffic.percentage === 0
                                ? "0.0%"
                                : formatPercentage(
                                    data?.traffic.percentage ?? 0
                                  )}
                            </td>
                          </React.Fragment>
                        );
                      })}
                  </tr>
                  <tr
                    className={`${getLocationRowClassName(
                      location.location
                    )} transition-colors duration-150`}
                  >
                    <td className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-sm text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-600 sticky left-[220px] z-20 min-w-[100px]">
                      Call
                    </td>
                    {getMonthsForPeriod(selectedPeriod)
                      .concat(["total"])
                      .map((month) => {
                        const data = location.bike[month as MonthKey];
                        return (
                          <React.Fragment key={`bike-call-${month}`}>
                            <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-right text-sm text-gray-900 dark:text-gray-100 bg-blue-50 dark:bg-blue-900/20">
                              {data?.call.qty === 0
                                ? "-"
                                : formatNumber(data?.call.qty ?? 0)}
                            </td>
                            <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-right text-sm text-gray-900 dark:text-gray-100 bg-blue-50 dark:bg-blue-900/20">
                              {data?.call.percentage === 0
                                ? "0.0%"
                                : formatPercentage(data?.call.percentage ?? 0)}
                            </td>
                          </React.Fragment>
                        );
                      })}
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Menampilkan{" "}
          {isUsingDummyData
            ? startIndex + 1
            : ((apiPagination?.page || 1) - 1) *
                (apiPagination?.itemsPerPage || itemsPerPage) +
              1}{" "}
          -{" "}
          {isUsingDummyData
            ? Math.min(endIndex, filteredData.length)
            : Math.min(
                (apiPagination?.page || 1) *
                  (apiPagination?.itemsPerPage || itemsPerPage),
                apiPagination?.totalItems || 0
              )}{" "}
          dari{" "}
          {isUsingDummyData
            ? filteredData.length
            : apiPagination?.totalItems || 0}{" "}
          hasil
        </div>

        {/* Pagination Controls */}
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

export default TrafficCallTable;
