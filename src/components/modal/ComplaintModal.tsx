/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { viewSets } from "@/utils/filterData";
import React, { useState, useEffect } from "react";
import { CustomSelect } from "../input/CustomSelect";

interface ComplaintDetail {
  id: number;
  ticket: string;
  category: string;
  lokasi: string;
  description: string;
  gate: string;
  createdAt: string;
}

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  fetchComplainCategory?: (category: string) => Promise<any>; // Add your actual return type here
}

export const ComplaintModal: React.FC<ComplaintModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  fetchComplainCategory,
}) => {
  const [complaintDetails, setComplaintDetails] = useState<ComplaintDetail[]>(
    []
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  // const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch complaint data
  const fetchComplaintData = async (
    selectedCategory: string,
    pageNumber: number = 1,
    limit: number = itemsPerPage
  ) => {
    if (!selectedCategory) return;

    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/issue/get-byCategory?category=${selectedCategory}&page=${pageNumber}&limit=${limit}`
      );
      const response = await res.json();

      if (response.code === 230002 && response.data) {
        setComplaintDetails(response.data || []);
        setCurrentPage(response.meta.page);
        setItemsPerPage(response.meta.limit);
        setTotalPages(response.meta.totalPages);
        setTotalItems(response.meta.totalItems);
      } else {
        setComplaintDetails([]);
        setCurrentPage(1);
        setItemsPerPage(limit);
        setTotalPages(0);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching complaint data", error);
      setComplaintDetails([]);
      setCurrentPage(1);
      setTotalPages(0);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when modal opens or category changes
  useEffect(() => {
    if (isOpen && selectedCategory) {
      setCurrentPage(1); // Reset to first page when category changes
      fetchComplaintData(selectedCategory);
    }
  }, [isOpen, selectedCategory, fetchComplainCategory]);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    fetchComplaintData(selectedCategory, pageNumber, itemsPerPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    fetchComplaintData(selectedCategory, 1, newItemsPerPage); // reset ke page 1
  };

  const currentItems = complaintDetails;

  const getPaginationRange = () => {
    const range = [];
    const showPages = 3;

    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    const end = Math.min(totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gradient-to-br dark:from-[#1a2332] dark:to-[#222b36] rounded-2xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Enhanced Modal Header - FIXED HEIGHT */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Detail Komplain</h2>
                <p className="text-blue-100">Kategori: {selectedCategory}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="cursor-pointer w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-sm text-blue-100">Total Komplain</div>
              <div className="text-2xl font-bold">
                {complaintDetails.length}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-sm text-blue-100">Halaman</div>
              <div className="text-2xl font-bold">
                {currentPage} dari {totalPages}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-sm text-blue-100">Halaman</div>
              <div className="text-2xl font-bold">
                {complaintDetails.length} dari {totalItems} hasil
              </div>
            </div>
          </div>
        </div>

        {/* Controls Bar - FIXED HEIGHT */}
        <div className="bg-gray-50 dark:bg-[#1e2632] p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Items per page selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tampilkan:
              </span>
              <CustomSelect
                options={viewSets.map((size) => ({
                  id: size,
                  name: size.toString(),
                }))}
                value={itemsPerPage}
                onChange={(value) => handleItemsPerPageChange(Number(value))}
                placeholder="Pilih jumlah item"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                per halaman
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body - SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-6">
            {isLoading ? (
              // Loading State
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Memuat data komplain...
                  </p>
                </div>
              </div>
            ) : (
              // Table View with Fixed Header
              <div className="h-full flex flex-col">
                <div className="overflow-x-auto flex-1">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-[#2a3441] sticky top-0 z-10">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          <div className="flex items-center space-x-1">
                            <span>Nomor</span>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                              />
                            </svg>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Tanggal
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Lokasi
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Gate
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Deskripsi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-[#222b36] divide-y divide-gray-200 dark:divide-gray-700">
                      {currentItems.map((complaint, index) => {
                        const nomorUrut =
                          (currentPage - 1) * itemsPerPage + index + 1;
                        console.log("complaint", complaint);
                        return (
                          <tr
                            key={complaint.id}
                            className="hover:bg-gray-50 dark:hover:bg-[#2a3441] transition-colors duration-200"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              {nomorUrut}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {new Date(complaint.createdAt).toLocaleDateString(
                                "id-ID",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {complaint.lokasi}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                                {complaint.gate}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                              <div
                                className="max-w-xs"
                                title={complaint.description}
                              >
                                {complaint.description}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* No data state */}
            {!isLoading && currentItems.length === 0 && (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">
                  Tidak ada data komplain untuk ditampilkan
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Pagination Footer - ALWAYS VISIBLE & FIXED HEIGHT */}
        {!isLoading && totalPages > 0 && (
          <div className="bg-gray-50 dark:bg-[#1e2632] px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Pagination Info */}
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Menampilkan{" "}
                <span className="font-medium">{currentPage + 1}</span> -{" "}
                <span className="font-medium">
                  {Math.min(currentPage, complaintDetails.length)}
                </span>{" "}
                dari{" "}
                <span className="font-medium">{complaintDetails.length}</span>{" "}
                hasil
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center space-x-1">
                {/* First Page Button */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="cursor-pointer px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2a3441] hover:bg-gray-50 dark:hover:bg-[#323b4a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  title="Halaman Pertama"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="cursor-pointer px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2a3441] hover:bg-gray-50 dark:hover:bg-[#323b4a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Page Numbers */}
                <div className="flex space-x-1">
                  {getPaginationRange()[0] > 1 && (
                    <>
                      <button
                        onClick={() => handlePageChange(1)}
                        className="cursor-pointer px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2a3441] border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#323b4a]"
                      >
                        1
                      </button>
                      {getPaginationRange()[0] > 2 && (
                        <span className="px-3 py-2 text-gray-500">...</span>
                      )}
                    </>
                  )}

                  {getPaginationRange().map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`cursor-pointer px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 min-w-[40px] ${
                        currentPage === pageNumber
                          ? "bg-blue-500 text-white shadow-lg ring-2 ring-blue-300 dark:ring-blue-700"
                          : "text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2a3441] border border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  {getPaginationRange()[getPaginationRange().length - 1] <
                    totalPages && (
                    <>
                      {getPaginationRange()[getPaginationRange().length - 1] <
                        totalPages - 1 && (
                        <span className="px-3 py-2 text-gray-500">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className="cursor-pointer px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2a3441] border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#323b4a]"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="cursor-pointer px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2a3441] hover:bg-gray-50 dark:hover:bg-[#323b4a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="cursor-pointer px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2a3441] hover:bg-gray-50 dark:hover:bg-[#323b4a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  title="Halaman Terakhir"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {/* Direct Page Input */}
                <div className="flex items-center space-x-2 ml-4 border-l border-gray-300 dark:border-gray-600 pl-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Ke:
                  </span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        handlePageChange(page);
                      }
                    }}
                    className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-center bg-white dark:bg-[#2a3441] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    dari {totalPages}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white dark:bg-[#222b36] px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
          <div className="flex space-x-3">
            <button className="cursor-pointer px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium">
              <svg
                className="w-4 h-4 inline mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export Data
            </button>
            <button className="cursor-pointer px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium">
              <svg
                className="w-4 h-4 inline mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print
            </button>
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
