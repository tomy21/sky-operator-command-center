import React, { useState, useRef, useEffect } from "react";

interface CustomSelectProps {
  options: { id: number | string; name: string | number }[];
  value: number | string | null | undefined;
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
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const selectRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  // Calculate dropdown position when opening
  useEffect(() => {
    if (open && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      
      // If not enough space below but more space above, show dropdown above
      if (spaceBelow < 200 && spaceAbove > spaceBelow) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [open]);

  const selected = options.find((opt) => opt.id === value);

  return (
    <div ref={selectRef} className="relative w-auto min-w-[80px]">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !isDisabled && setOpen((prev) => !prev)}
        className={`flex items-center justify-between w-full bg-gray-50 dark:bg-[#2A3441] text-gray-900 dark:text-white px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm ${
          isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        disabled={isDisabled}
      >
        <span className={`${selected ? "" : "text-gray-400"} whitespace-nowrap`}>
          {selected?.name || placeholder}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 ml-1 transition-transform duration-200 flex-shrink-0 ${
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
        <>
          {/* Portal-like dropdown using fixed positioning */}
          <div
            className={`fixed z-[9999] w-full bg-white dark:bg-[#2A3441] border border-gray-300 dark:border-gray-700 rounded-lg max-h-48 overflow-y-auto shadow-lg transition-all duration-150 origin-top scale-100`}
            style={{
              left: buttonRef.current?.getBoundingClientRect().left || 0,
              width: buttonRef.current?.getBoundingClientRect().width || 'auto',
              ...(dropdownPosition === 'bottom' ? {
                top: (buttonRef.current?.getBoundingClientRect().bottom || 0) + 4
              } : {
                bottom: window.innerHeight - (buttonRef.current?.getBoundingClientRect().top || 0) + 4
              })
            }}
          >
            {options.map((option) => (
              <div
                key={option.id}
                onClick={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm whitespace-nowrap ${
                  value === option.id ? "bg-gray-200 dark:bg-gray-600" : ""
                }`}
              >
                {option.name}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
