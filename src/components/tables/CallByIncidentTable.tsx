import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CustomSelect } from "../input/CustomSelect";
import { months, regions, viewSets, years } from "@/utils/filterData";
import { useCallByIncidentData } from "@/hooks/useCallByIncident";
import { monthToDataKey } from "@/data/mock/callByIncidentData";

type VehicleType = "car" | "bike" | "total";

const CallByIncidentTable: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("january");
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  const {
    data: apiData,
    loading: apiLoading,
    error: apiError,
    pagination,
    isUsingDummyData,
  } = useCallByIncidentData({
    year: selectedYear,
    month: selectedMonth,
    region: selectedRegion,
    page: currentPage,
    itemsPerPage: itemsPerPage,
  });

  const filteredLocations = useMemo(() => {
    return apiData || [];
  }, [apiData]);

  const totalPages = pagination?.totalPages || 1;
  const paginatedLocations = filteredLocations;

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

      {/* Data Source Indicator */}
      {isUsingDummyData && (
        <div className="mb-4 p-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-md text-sm">
          <p>Menggunakan data dummy karena API tidak tersedia atau tidak mengembalikan data.</p>
        </div>
      )}

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

      {/* Loading State */}
      {apiLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      )}

      {/* Error State */}
      {apiError && !apiLoading && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md">
          <p>{apiError}</p>
        </div>
      )}

      {/* Table */}
      {!apiLoading && paginatedLocations.length > 0 && (
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
incident.key as 'trafficHumanError' | 'trafficSystem' | 'customerBehaviour' | 'assetSystem'
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
      )}

      {/* No Data State */}
      {!apiLoading && paginatedLocations.length === 0 && (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          <p>Tidak ada data untuk ditampilkan.</p>
        </div>
      )}

      {/* Pagination */}
      {paginatedLocations.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Menampilkan {paginatedLocations.length} dari {pagination?.totalItems || filteredLocations.length} lokasi
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-md ${page === currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallByIncidentTable;
