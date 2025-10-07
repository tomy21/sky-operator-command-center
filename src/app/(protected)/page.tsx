/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { lazy, Suspense, useEffect, useState, useRef } from "react";
import { useGlobalSocket } from "@/contexts/SocketContext";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/LoadingSpinner";
import React from "react";
import { fetchIssuesMonthly } from "@/hooks/useIssues";
import { fetchCall } from "@/hooks/useCall";
import MonthlyComplaintChart from "./components/charts/MonthlyComplaintChart";
import CategoryComplaintChart from "./components/charts/CategoryComplaintChart";
import { MonthlyComplaintData } from "@/types/complains";
import { ComplaintModal } from "@/components/modal/ComplaintModal";
import { getAllUsers } from "@/hooks/useAuth";
import { TableSkeleton } from "./master/components/loader/TableSkeleton";
import CommonTable from "@/components/tables/CommonTable";
import { getUsersColumns } from "@/components/user/getColumnUsers";

const CallQuantityTable = lazy(
  () => import("@/components/tables/CallQuantityTable")
);
const CallByTimeTable = lazy(
  () => import("@/components/tables/CallByTimeTable")
);
const CallByGateTable = lazy(
  () => import("@/components/tables/CallByGateTable")
);
const CallByIncidentTable = lazy(
  () => import("@/components/tables/CallByIncidentTable")
);
const TrafficCallTable = lazy(
  () => import("@/components/tables/TrafficCallTable")
);

type TableType =
  | "call-quantity"
  | "call-by-time"
  | "call-by-gate"
  | "call-by-incident"
  | "traffic-call";
const tableOptions = [
  { value: "call-quantity", label: "Jumlah Panggilan per Periode" },
  { value: "call-by-time", label: "Panggilan per Waktu" },
  { value: "call-by-gate", label: "Panggilan per Gate" },
  { value: "call-by-incident", label: "Panggilan per Insiden" },
  { value: "traffic-call", label: "Panggilan dan Traffic" },
] as const;

interface PaginationInfo {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export default function Dashboard() {
  const chartRef = useRef<any>(null);
  const { connectionStatus, userNumber } = useGlobalSocket();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [activeTable, setActiveTable] = useState<TableType>("call-quantity");
  const [dataUser, setDataUser] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const searchParams = useSearchParams();

  const [userPaginationTable, setUserPaginationTable] =
    useState<PaginationInfo>({
      totalItems: totalItems,
      totalPages: totalPages,
      currentPage: currentPage,
      itemsPerPage: itemsPerPage,
    });

  const userPagination = { currentPage, itemsPerPage };

  const fetchUsers = async (page: number = 1, limit: number = 5) => {
    try {
      const result = await getAllUsers({ page, limit });
      setDataUser(result.data);
      setItemsPerPage(result.meta.limit);
      setCurrentPage(result.meta.page);
      setTotalPages(result.meta.totalPages);
      setTotalItems(result.meta.totalItems);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (searchParams.get("loginSuccess") === "1") {
      toast.success("Berhasil login!");
      const url = new URL(window.location.href);
      url.searchParams.delete("loginSuccess");
      window.history.replaceState({}, "", url.toString());
    }
    fetchUsers();
  }, [searchParams]);

  const [monthlyComplaintData, setMonthlyComplaintData] = useState<
    MonthlyComplaintData[]
  >([]);
  const [isLoadingMonthlyData, setIsLoadingMonthlyData] = useState(false);
  const [countInCall, setCountInCall] = useState(0);

  const fetchCountInCall = async () => {
    try {
      const response = await fetchCall(new Date().toISOString().split("T")[0]);
      setCountInCall(response.data._sum.CountInCall);
    } catch (error) {
      console.error("Failed to fetch count in call");
    }
  };

  const fetchMonthlyComplaintData = async () => {
    setIsLoadingMonthlyData(true);
    try {
      const response = await fetchIssuesMonthly();
      const apiData = response.data;
      setMonthlyComplaintData(apiData);
    } catch (error) {
      console.error("Failed to fetch monthly complaint data");
    } finally {
      setIsLoadingMonthlyData(false);
    }
  };

  useEffect(() => {
    fetchMonthlyComplaintData();
    fetchCountInCall();
  }, []);

  const handleEditUser = (id: number) => {
    // Handle edit user logic here
  };

  const handleDeleteUser = (id: number) => {
    // Handle delete user logic here
  };

  const handleCategoryPageChange = (page: number) => {
    setUserPaginationTable((prev) => ({ ...prev, currentPage: page }));
    fetchUsers(page, userPaginationTable.itemsPerPage);
  };

  const handleItemsCategoryPerPageChange = (newItemsPerPage: number) => {
    setUserPaginationTable((prev) => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1,
    }));
    fetchUsers(1, newItemsPerPage);
  };

  const handleItemsDescriptionPerPageChange = (newItemsPerPage: number) => {
    setUserPaginationTable((prev) => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1,
    }));
    fetchUsers(1, newItemsPerPage);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex flex-col w-full min-h-screen px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-8">
        {/* Navigation Header */}
        <div className="bg-white dark:bg-[#222B36] p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center sm:gap-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
              <div className="text-sm">
                <span className="text-gray-500">Status: </span>
                <span
                  className={`font-semibold ${
                    connectionStatus === "Connected"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {connectionStatus}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">User Number: </span>
                <span className="font-semibold">{userNumber}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Total Panggilan: </span>
                <span className="font-semibold">{countInCall ?? 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <MonthlyComplaintChart
            data={monthlyComplaintData}
            isLoading={isLoadingMonthlyData}
            onRefresh={fetchMonthlyComplaintData}
          />

          <CategoryComplaintChart
            onSelectCategory={(category) => {
              setSelectedCategory(category);
              setIsModalOpen(true);
            }}
          />
        </div>

        <Suspense fallback={<TableSkeleton />}>
          <CommonTable
            data={dataUser}
            columns={getUsersColumns(dataUser, userPagination)}
            showPagination={true}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handleCategoryPageChange}
            itemsPerPage={userPagination.itemsPerPage}
            totalItems={totalItems}
            onItemsPerPageChange={handleItemsCategoryPerPageChange}
            className="text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"
          />
        </Suspense>
      </div>
      <ComplaintModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCategory={selectedCategory}
      />
    </div>
  );
}
