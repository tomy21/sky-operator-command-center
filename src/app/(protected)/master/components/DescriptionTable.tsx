import React from "react";

type Props = {
  label: string;
  value: number;
};

export default function Description({ label, value }: Props) {
  return (
    <div className="flex justify-between py-2">
      <span className="text-gray-600">{label}</span>
      <span className={value < 0 ? "text-red-500" : "text-green-600"}>
        {Math.abs(value)}
      </span>
    </div>
  );
}
