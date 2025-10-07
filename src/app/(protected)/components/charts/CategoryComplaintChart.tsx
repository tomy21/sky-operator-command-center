"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface CategoryCount {
  category: string;
  total: number;
}

interface Props {
  onSelectCategory: (category: string) => void;
}

export default function CategoryComplaintChart({ onSelectCategory }: Props) {
  const [data, setData] = useState<CategoryCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategorySummary = async () => {
      try {
        const res = await fetch("/api/issue/summary-by-category");
        const result = await res.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Error fetching category summary", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorySummary();
  }, []);

  // series dan labels dinamis dari data API
  const categoryComplaintSeries = data.map((item) => item.total);
  const categoryComplaintLabels = data.map((item) => item.category);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePieChartClick = (_: any, __: any, config: any) => {
    const category = categoryComplaintLabels[config.dataPointIndex];
    onSelectCategory(category);
  };

  const categoryComplaintOptions: ApexOptions = {
    chart: {
      type: "pie",
      background: "transparent",
      foreColor: "inherit",
      events: {
        dataPointSelection: handlePieChartClick,
      },
    },
    labels: categoryComplaintLabels,
    colors: ["#3B82F6", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6"], // tambahkan jika lebih dari 4
    title: {
      text: "Komplain per Kategori",
      align: "center",
      style: { fontSize: "16px", fontWeight: "600", color: "currentColor" },
    },
    legend: {
      position: "bottom",
      labels: { colors: "currentColor" },
      formatter: (seriesName, opts) =>
        `${seriesName}: ${opts.w.globals.series[opts.seriesIndex]}`,
    },
    dataLabels: {
      enabled: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (val: any, { seriesIndex, w }: any) =>
        val > 5 ? `${w.config.series[seriesIndex]}\n(${Math.round(val)}%)` : "",
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[250px]">
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#222B36] p-3 sm:p-4 rounded-lg">
      <div className="w-full min-h-[250px] sm:h-[300px]">
        <ReactApexChart
          options={categoryComplaintOptions}
          series={categoryComplaintSeries}
          type="pie"
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
}
