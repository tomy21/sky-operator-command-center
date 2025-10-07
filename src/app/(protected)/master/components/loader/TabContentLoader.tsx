import React from "react";

type RowData = {
  id: number;
  name: string;
  in: number;
  out: number;
};

type Props = {
  data: RowData[];
};

export default function TableContent({ data }: Props) {
  return (
    <tbody>
      {data.map((row) => {
        const total = row.in - row.out;
        return (
          <tr key={row.id} className="border-b">
            <td className="px-4 py-3">{row.name}</td>
            <td className="px-4 py-3 text-green-600">{row.in}</td>
            <td className="px-4 py-3 text-red-500">{row.out}</td>
            <td
              className={`px-4 py-3 ${
                total < 0 ? "text-red-500" : "text-green-600"
              }`}
            >
              {Math.abs(total)}
            </td>
          </tr>
        );
      })}
    </tbody>
  );
}
