"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { format, parse } from "date-fns";
import { id } from "date-fns/locale";
import { MonthlyComplaintData } from "@/types/complains";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface Props {
  data: MonthlyComplaintData[];
  isLoading: boolean;
  onRefresh: () => void;
}

export default function MonthlyComplaintChart({
  data,
  isLoading,
  onRefresh,
}: Props) {
  const monthlyComplaintOptions: ApexOptions = {
    chart: {
      type: "line",
      height: 350,
      background: "transparent",
      foreColor: "currentColor",
      toolbar: { show: true },
    },
    title: {
      text: "Total Komplain per Bulan",
      style: { color: "currentColor" },
    },
    xaxis: {
      type: "category", // pakai category biar label bisa custom "Jan 25"
      labels: { style: { colors: "currentColor" } },
      axisBorder: { color: "currentColor" },
      axisTicks: { color: "currentColor" },
    },
    yaxis: {
      title: { text: "Jumlah Komplain", style: { color: "currentColor" } },
      labels: { style: { colors: "currentColor" } },
    },
    grid: { borderColor: "currentColor" },
    legend: { labels: { colors: "currentColor" } },
    stroke: { curve: "smooth", width: 3 },
    markers: {
      size: 6,
      colors: ["#1f77b4"],
      strokeColors: "#fff",
      strokeWidth: 2,
    },
    tooltip: {
      theme: "dark",
      x: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (val: any) => val, // biar bebas string/number
      },
      y: { formatter: (value: number) => `${value} komplain` },
    },
  };

  // series akan otomatis sesuai jumlah data
  const chartSeries = [
    {
      name: "Komplain",
      data: data.map((item) => ({
        x: format(parse(item.month, "yyyy-MM", new Date()), "MMM yy", {
          locale: id,
        }), // contoh: "Agu 25", "Sep 25", "Okt 25"
        y: item.total,
      })),
    },
  ];

  return (
    <div className="bg-white dark:bg-[#222B36] p-3 sm:p-4 rounded-lg">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:justify-between sm:items-center">
        <h3 className="text-base font-semibold">Statistik Bulanan</h3>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="cursor-pointer px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 rounded text-white transition-colors"
        >
          {isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="w-full h-[250px] sm:h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Memuat data...</p>
            </div>
          </div>
        ) : (
          <ReactApexChart
            options={monthlyComplaintOptions}
            series={chartSeries}
            type="line"
            height="100%"
            width="100%"
          />
        )}
      </div>
    </div>
  );
}
