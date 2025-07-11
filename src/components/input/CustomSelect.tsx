import React, { useState, useRef, useEffect } from "react";

interface CustomSelectProps {
  options: { id: number | string; name: string }[];
  value: number | string | null;
  onChange: (value: number | string) => void;
  placeholder?: string;
  isDisabled?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Pilih kategori",
  isDisabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selected = options.find((opt) => opt.id === value);

  return (
    <div ref={selectRef} className="relative w-full">
      <button
        type="button"
        onClick={() => !isDisabled && setOpen((prev) => !prev)}
        className={`flex items-center justify-between w-full bg-gray-50 dark:bg-[#2A3441] text-gray-900 dark:text-white px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
        disabled={isDisabled}
      >
        <span className={`${selected ? "" : "text-gray-400"}`}>
          {selected?.name || placeholder}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white dark:bg-[#2A3441] border border-gray-300 dark:border-gray-700 rounded-lg max-h-48 overflow-y-auto shadow-lg transition-all duration-150 origin-top scale-100">
          {options.map((option) => (
            <li
              key={option.id}
              onClick={() => {
                onChange(option.id);
                setOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                value === option.id ? "bg-gray-200 dark:bg-gray-600" : ""
              }`}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
