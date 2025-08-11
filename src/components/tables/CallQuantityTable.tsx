import {
  ChevronLeft,
  ChevronRight,
  // ChevronsLeft, ChevronsRight
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { CustomSelect } from "../input/CustomSelect";
import { periods, regions, viewSets, years } from "@/utils/filterData";
import { useCallQuantityData } from "@/hooks/useCallQuantity";
import { CallData, carData, bikeData, generateTotalData } from "@/data/mock/callQuantityData";

const CallQuantityTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"car" | "bike" | "total">("total");
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [selectedSemester, setSelectedSemester] = useState<"1" | "2" | "all">(
    "all"
  );
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  // const [loading, setLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string | null>(null);

  const {
    data: apiData,
    loading: apiLoading,
    // error: apiError,
    // refetch,
  } = useCallQuantityData({
    year: selectedYear,
    month: selectedSemester,
    region: selectedRegion,
    page: currentPage,
    itemsPerPage: itemsPerPage,
  });

  useEffect(() => {
  }, [
    selectedYear,
    selectedSemester,
    selectedRegion,
    currentPage,
    itemsPerPage,
  ]);

  const totalData = generateTotalData();

  const getCurrentData = () => {
    if (apiData && apiData.data && apiData.data.length > 0) {
      const transformedData = apiData.data.map((item) => ({
        location: item.location,
        jan: item.jan,
        feb: item.feb,
        mar: item.mar,
        apr: item.apr,
        mei: item.mei,
        juni: item.juni,
        jul: item.jul,
        aug: item.aug,
        sep: item.sep,
        okt: item.okt,
        nov: item.nov,
        des: item.des,
        total: item.total,
      }));

      return transformedData;
    }

    switch (activeTab) {
      case "car":
        return carData;
      case "bike":
        return bikeData;
      default:
        return totalData;
    }
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

  // const isUsingDummyData =
  //   !apiData || !apiData.data || apiData.data.length === 0;

  const getPaginatedData = (data: CallData[]) => {
    if (apiData && apiData.data && apiData.data.length > 0) {
      return data;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (data: CallData[]) => {
    return Math.ceil(data.length / itemsPerPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const getFilteredColumns = () => {
    if (selectedSemester === "1") {
      return ["jan", "feb", "mar", "apr", "mei", "juni"];
    } else if (selectedSemester === "2") {
      return ["jul", "aug", "sep", "okt", "nov", "des"];
    } else {
      return [
        "jan",
        "feb",
        "mar",
        "apr",
        "mei",
        "juni",
        "jul",
        "aug",
        "sep",
        "okt",
        "nov",
        "des",
      ];
    }
  };

  const getColumnHeaders = () => {
    const columns = getFilteredColumns();
    const headers = {
      jan: "Jan",
      feb: "Feb",
      mar: "Mar",
      apr: "Apr",
      mei: "Mei",
      juni: "Juni",
      jul: "Jul",
      aug: "Aug",
      sep: "Sep",
      okt: "Okt",
      nov: "Nov",
      des: "Des",
    };
    return columns.map((col) => ({
      key: col,
      label: headers[col as keyof typeof headers],
    }));
  };

  const formatNumber = (num: number) => {
    return num === 0 ? "-" : num.toLocaleString("id-ID");
  };

  const getRowTotal = (data: CallData[]) => {
    const columns = getFilteredColumns();
    const totals = columns.reduce((acc, col) => {
      acc[col] = data.reduce(
        (sum, row) => sum + Number(row[col as keyof CallData]),
        0
      );
      return acc;
    }, {} as Record<string, number>);

    totals.total = Object.values(totals).reduce((sum, val) => sum + val, 0);
    return totals;
  };

  const currentData = getCurrentData();
  const paginatedData = getPaginatedData(currentData);
  const totalPages =
    apiData?.pagination?.totalPages || getTotalPages(currentData);
  // const totalItems = apiData?.pagination?.totalItems || currentData.length;
  const rowTotal = getRowTotal(currentData);
  const columnHeaders = getColumnHeaders();

  // console.log(paginatedData, "<<<paginatedData");

  return (
    <div className="bg-white dark:bg-[#222B36] rounded-lg p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">
              Call by Quantity
            </h3>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-gray-100 dark:bg-[#2A3441] rounded-lg p-1 w-full md:w-auto">
            <button
              onClick={() => setActiveTab("total")}
              className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === "total"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Total
            </button>
            <button
              onClick={() => setActiveTab("car")}
              className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === "car"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Car
            </button>
            <button
              onClick={() => setActiveTab("bike")}
              className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === "bike"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Bike
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Semester Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Periode:
            </label>
            <CustomSelect
              options={periods.map((period) => ({
                id: period.value,
                name: period.label,
              }))}
              value={
                selectedSemester === "all"
                  ? "all"
                  : selectedSemester === "1"
                  ? "semester1"
                  : "semester2"
              }
              onChange={(value) => {
                if (value === "all") {
                  setSelectedSemester("all");
                } else if (value === "semester1") {
                  setSelectedSemester("1");
                } else if (value === "semester2") {
                  setSelectedSemester("2");
                }
                setCurrentPage(1);
              }}
              placeholder="Pilih periode"
            />
          </div>

          {/* Year Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
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
              Tampilkan:
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
            {periods.find((p) => p.value === selectedSemester)?.label}{" "}
            {selectedYear}
          </span>{" "}
          | Region:{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {regions.find((r) => r.value === selectedRegion)?.label}
          </span>
        </p>
        {/*
        {isUsingDummyData && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-yellow-800 dark:text-yellow-200">
                Menampilkan data dummy karena data dari server tidak tersedia
                {apiError && ` (Error: ${apiError})`}
              </span>
              <button
                onClick={() => refetch()}
                className="ml-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Coba lagi
              </button>
            </div>
          </div>
        )}
        */}
      </div>

      {/* Table Container with vertical and horizontal scroll */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="max-h-96 overflow-y-auto thin-scrollbar">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-[#2A3441] sticky top-0 z-10">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-[#2A3441] z-30">
                    Location
                  </th>
                  {columnHeaders.map((header) => (
                    <th
                      key={header.key}
                      className="px-3 md:px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      {header.label}
                    </th>
                  ))}
                  <th className="px-3 md:px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-[#222B36] divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedData.map((row, index) => (
                  <tr
                    key={row.location}
                    className={`hover:bg-gray-50 dark:hover:bg-[#2A3441] transition-colors ${
                      index % 2 === 0
                        ? "bg-white dark:bg-[#222B36]"
                        : "bg-gray-50 dark:bg-[#2A3441]"
                    }`}
                  >
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 sticky left-0 bg-inherit">
                      {row.location}
                    </td>
                    {columnHeaders.map((header) => (
                      <td
                        key={header.key}
                        className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600 dark:text-gray-300"
                      >
                        {formatNumber(
                          row[header.key as keyof CallData] as number
                        )}
                      </td>
                    ))}
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20">
                      {formatNumber(
                        getFilteredColumns().reduce(
                          (sum, col) =>
                            sum + (row[col as keyof CallData] as number),
                          0
                        )
                      )}
                    </td>
                  </tr>
                ))}

                {/* Total Row - sticky at bottom when scrolling */}
                <tr className="bg-gray-100 dark:bg-[#2A3441] border-t-2 border-gray-300 dark:border-gray-600 sticky bottom-0 z-10">
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-gray-100 sticky left-0 bg-gray-100 dark:bg-[#2A3441] z-20">
                    TOTAL
                  </td>
                  {columnHeaders.map((header) => (
                    <td
                      key={header.key}
                      className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-900 dark:text-gray-100"
                    >
                      {formatNumber(rowTotal[header.key] || 0)}
                    </td>
                  ))}
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40">
                    {formatNumber(rowTotal.total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Menampilkan{" "}
            {apiData?.pagination
              ? `${
                  (apiData.pagination.page - 1) *
                    apiData.pagination.itemsPerPage +
                  1
                } - ${Math.min(
                  apiData.pagination.page * apiData.pagination.itemsPerPage,
                  apiData.pagination.totalItems
                )} dari ${apiData.pagination.totalItems}`
              : `${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(
                  currentPage * itemsPerPage,
                  currentData.length
                )} dari ${currentData.length}`}{" "}
            hasil
          </div>

          <div className="flex items-center rounded-lg p-1 gap-1 bg-gray-100 dark:bg-[#2A3441] border border-gray-300 dark:border-gray-700">
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
          </div>
        </div>
      )}
    </div>
  );
};

export default CallQuantityTable;
