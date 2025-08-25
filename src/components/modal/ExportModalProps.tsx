"use client";

import { exportIssues } from "@/hooks/useIssues";
import React, { useState } from "react";
import DatePicker from "react-datepicker";

interface DateRangeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: { startDate: Date; endDate: Date }) => void;
  title?: string;
  confirmText?: string;
  cancelText?: string;
}

const ExportModalProps: React.FC<DateRangeFormModalProps> = ({
  isOpen,
  onClose,
  title = "Pilih Rentang Tanggal",
  confirmText = "Submit",
  cancelText = "Cancel",
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState("");

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]; // yyyy-MM-dd
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      setError("Tanggal mulai dan akhir wajib diisi");
      return;
    }
    if (startDate > endDate) {
      setError("Tanggal mulai tidak boleh lebih besar dari tanggal akhir");
      return;
    }

    setError("");
    try {
      await exportIssues(formatDate(startDate), formatDate(endDate));
      onClose(); // close modal setelah export
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("Export gagal, coba lagi");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-6 text-center">{title}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Tanggal Mulai
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="yyyy-MM-dd"
                  className="w-full p-3 border rounded-md text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholderText="Pilih tanggal mulai"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Tanggal Akhir
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate || undefined}
                  dateFormat="yyyy-MM-dd"
                  className="w-full p-3 border rounded-md text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholderText="Pilih tanggal akhir"
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {error}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
              >
                {cancelText}
              </button>
              <button
                type="submit"
                className="cursor-pointer px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
              >
                {confirmText}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExportModalProps;
