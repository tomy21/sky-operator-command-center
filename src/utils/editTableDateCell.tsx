/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { parse, isValid } from "date-fns";
import { id as localeID } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

interface EditableDateCellProps {
  value?: string | number | Date | null;
  row: any;
  onUpdate: (id: number, newDate: string) => Promise<void>;
}

const tryParseDate = (value: any): Date | null => {
  if (!value) return null;

  try {
    if (typeof value === "number") return new Date(value);
    if (value instanceof Date) return isValid(value) ? value : null;

    if (typeof value === "string") {
      const clean = value.trim();
      const isoLike = clean.replace(" ", "T");
      const d = new Date(isoLike);
      if (isValid(d)) return d;

      // ✅ tambahkan parsing dengan locale Indonesia
      const parsedID = parse(clean, "d MMM yyyy", new Date(), {
        locale: localeID,
      });
      if (isValid(parsedID)) return parsedID;

      // fallback lain (misal format lain)
      const parsed1 = parse(clean, "dd/MM/yyyy", new Date());
      if (isValid(parsed1)) return parsed1;
    }

    return null;
  } catch {
    return null;
  }
};

const EditableDateCell: React.FC<EditableDateCellProps> = ({
  value,
  row,
  onUpdate,
}) => {
  const [date, setDate] = useState<Date | null>(() => tryParseDate(value));

  useEffect(() => {
    const parsed = tryParseDate(value);
    setDate(parsed);
  }, [value]);

  const handleChange = async (selectedDate: Date | null) => {
    setDate(selectedDate);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      await onUpdate(Number(row.id), formatted);
    }
  };

  return (
    <div className="flex items-center">
      <DatePicker
        selected={date}
        onChange={handleChange}
        dateFormat="dd MMM yyyy"
        placeholderText="Pilih tanggal"
        className="p-2 w-40 border rounded"
      />
    </div>
  );
};

export default EditableDateCell;
