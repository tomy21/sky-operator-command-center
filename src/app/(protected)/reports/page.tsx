/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useEffect,
  useState,
  useMemo,
  Suspense,
  lazy,
  useCallback,
} from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Column } from "@/components/tables/CommonTable";
const CommonTable = lazy(() => import("@/components/tables/CommonTable"));
import IsseFormInputModal from "@/components/modal/IssueFormInputModal";
import { Field } from "@/components/modal/IssueFormInputModal";
import { addIssue, fetchIssues } from "@/hooks/useIssues";
import { Category, fetchCategories } from "@/hooks/useCategories";
import {
  addDescription,
  Description,
  fetchDescriptionByCategoryId,
} from "@/hooks/useDescriptions";
import { toast } from "react-toastify";
import { formatDayDateTime } from "@/utils/formatDate";
import {
  fetchGateByLocation,
  fetchLocationActive,
  GateByLocation,
  Location,
} from "@/hooks/useLocation";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { validateIndonesianLicensePlate } from "@/utils/validationNumberPlat";
import { CalenderIcon, LocationIcon2, TicketIcon } from "@/public/icons/Icons";
import ThreeDotsLoader from "@/components/ThreeDotsLoader";
import { DownloadIcon, PlusIcon } from "lucide-react";
import ExportModalProps from "@/components/modal/ExportModalProps";

interface Report {
  no?: number;
  duration?: string;
  pk_id: string;
  location: string;
  category: string;
  description: string;
  solution: string;
  dayName: string;
  date: string;
  time: string;
  rawDate: Date;
}

interface PaginationInfo {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

interface NewReportData {
  idLocation: number;
  idCategory: number;
  idGate: number;
  description: string;
  action: string;
  foto: string;
  number_plate: string;
  TrxNo: string;
  duration: string;
  solusi: string;
}

interface DataPagination {
  page: number;
  limit: number;
  totalItems: number;
  hasMore: boolean;
  isLoading: boolean;
}

export interface FieldOption {
  value: string;
  label: string;
}

export default function ReportsPage() {
  const [mounted, setMounted] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
  const [locationData, setLocationData] = useState<Location[]>([]);
  const [gateIdData, setGateIdData] = useState<GateByLocation[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [descriptions, setDescriptions] = useState<Description[]>([]);
  const [issuesPagination, setIssuesPagination] = useState<PaginationInfo>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 5,
  });

  const [searchDate, setSearchDate] = useState<Date | null>(null);
  const [searchLocation, setSearchLocation] = useState("");
  // const [searchCategory, setSearchCategory] = useState("");
  const [searchTicket, setSearchTicket] = useState("");
  const [hasPerformedSearch, setHasPerformedSearch] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [locations, setLocations] = useState<FieldOption[]>([]);
  const [search, setSearch] = useState("");

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState("");

  const [formFieldValues, setFormFieldValues] = useState<
    Record<string, string>
  >({});
  const [locationPagination, setLocationPagination] = useState<DataPagination>({
    page: 1,
    limit: 10,
    totalItems: 0,
    hasMore: true,
    isLoading: false,
  });
  const [categoriesPagination, setCategoriesPagination] =
    useState<DataPagination>({
      page: 1,
      limit: 10,
      totalItems: 0,
      hasMore: true,
      isLoading: false,
    });

  const [gatesPagination, setGatesPagination] = useState<DataPagination>({
    page: 1,
    limit: 5,
    totalItems: 0,
    hasMore: true,
    isLoading: false,
  });

  const [descriptionsPagination, setDescriptionsPagination] =
    useState<DataPagination>({
      page: 1,
      limit: 5,
      totalItems: 0,
      hasMore: true,
      isLoading: false,
    });

  useEffect(() => {
    setMounted(true); // ✅ hanya setelah client render
  }, []);

  const fetchAllIssuesData = async () => {
    try {
      setIsDataLoading(true);
      const formattedDate = searchDate
        ? searchDate.toISOString().split("T")[0]
        : "";
      const issuesData = await fetchIssues(
        issuesPagination.currentPage,
        issuesPagination.itemsPerPage,
        searchTicket,
        formattedDate,
        searchLocation
      );

      if (issuesData && issuesData.data && issuesData.meta) {
        const mappedReports: Report[] = issuesData.data.map((issue, index) => {
          const createdDate = new Date(issue.createdAt);
          const { dayName, date, time } = formatDayDateTime(issue.createdAt);

          return {
            no:
              (issuesPagination.currentPage - 1) *
                issuesPagination.itemsPerPage +
              index +
              1,
            dayName,
            date,
            time,
            rawDate: createdDate,
            duration: issue.duration ?? "-",
            pk_id: issue.gate,
            location: issue.lokasi && issue.lokasi !== "" ? issue.lokasi : "-",
            category:
              issue.category && issue.category !== "" ? issue.category : "-",
            description:
              issue.description && issue.description !== ""
                ? issue.description
                : "-",
            solution: issue.solusi || "-",
            // rawDate: createdDate,
          };
        });

        setReports(mappedReports);
        setIssuesPagination({
          totalItems: issuesData.meta.totalItems,
          totalPages: Math.ceil(
            issuesData.meta.totalItems / issuesPagination.itemsPerPage
          ),
          currentPage: issuesPagination.currentPage,
          itemsPerPage: issuesPagination.itemsPerPage,
        });
      }
    } catch (error) {
      console.error("Error fetching issues");
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleSearch = () => {
    setHasPerformedSearch(true);
    setIssuesPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchAllIssuesData();
  };

  const handleIssuesPageChange = (page: number) => {
    setIssuesPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleItemsReportPerPageChange = (newItemsPerPage: number) => {
    setIssuesPagination((prev) => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1,
    }));
  };

  const fetchAllLocations = async (
    limit: number = 5,
    reset: boolean = true,
    searchTerm: string = ""
  ) => {
    try {
      setLocationPagination((prev) => ({ ...prev, isLoading: true }));

      // 🔹 tambahkan searchTerm
      const response = await fetchLocationActive(1, limit, searchTerm);

      if (reset) {
        setLocationData(response.data);
      } else {
        setLocationData((prev) => [...prev, ...response.data]);
      }

      setLocationPagination((prev) => ({
        ...prev,
        totalItems: response.meta?.totalItems || response.data.length,
        hasMore: response.data.length === limit,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching locations");
      setLocationPagination((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleSearchLocation = (term: string) => {
    setSearch(term);
    fetchAllLocations(5, true, term); // reset data + kirim search
  };

  const handleLoadMoreLocations = useCallback(() => {
    if (!locationPagination.isLoading && locationPagination.hasMore) {
      const newLimit = locationData.length + 5;
      fetchAllLocations(newLimit, false);
    }
  }, [
    locationPagination.isLoading,
    locationPagination.hasMore,
    locationData.length,
  ]);

  const fetchAllCategories = async (
    limit: number = 5,
    reset: boolean = true
  ) => {
    try {
      setCategoriesPagination((prev) => ({ ...prev, isLoading: true }));

      const response = await fetchCategories(1, limit);

      if (reset) {
        setCategories(response.data);
      } else {
        setCategories((prev) => [...prev, ...response.data]);
      }

      setCategoriesPagination((prev) => ({
        ...prev,
        totalItems: response.meta?.totalItems || response.data.length,
        hasMore: response.data.length === limit,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching categories");
      setCategoriesPagination((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleLoadMoreCategories = useCallback(() => {
    if (!categoriesPagination.isLoading && categoriesPagination.hasMore) {
      const newLimit = categories.length + 5;
      fetchAllCategories(newLimit, false);
    }
  }, [
    categoriesPagination.isLoading,
    categoriesPagination.hasMore,
    categories.length,
  ]);

  const handleFieldValueChange = useCallback(
    async (fieldId: string, value: string) => {
      setFormFieldValues((prev) => {
        const newValues = { ...prev, [fieldId]: value };

        if (fieldId === "idLocation") {
          newValues.idGate = "";
        }
        if (fieldId === "idCategory") {
          newValues.description = "";
          newValues.customDescription = "";
        }

        if (fieldId === "description" && value !== "other") {
          newValues.customDescription = "";
        }

        return newValues;
      });

      if (fieldId === "idLocation" && value) {
        setGateIdData([]);
        setGatesPagination((prev) => ({
          ...prev,
          hasMore: true,
          totalItems: 0,
        }));
        try {
          await fetchAllGates(parseInt(value), 10, true);
        } catch (error) {
          console.error("Error fetching gates");
        }
      }

      if (fieldId === "idCategory" && value) {
        setDescriptions([]);
        setDescriptionsPagination((prev) => ({
          ...prev,
          hasMore: true,
          totalItems: 0,
        }));
        try {
          await fetchAllDescriptions(parseInt(value), 10, true);
        } catch (error) {
          console.error("Error fetching descriptions");
        }
      }
    },
    []
  );

  const fetchAllGates = async (
    locationId: number,
    limit: number = 5,
    reset: boolean = true
  ) => {
    try {
      setGatesPagination((prev) => ({ ...prev, isLoading: true }));

      const response = await fetchGateByLocation({
        id: locationId,
        page: 1,
        limit: limit,
      });

      if (response && response.data) {
        if (reset) {
          setGateIdData(response.data);
        } else {
          setGateIdData((prev) => [...prev, ...response.data]);
        }

        setGatesPagination((prev) => ({
          ...prev,
          totalItems: response.meta?.totalItems || response.data.length,
          hasMore: response.data.length === limit,
          isLoading: false,
        }));
      } else {
        setGateIdData([]);
        setGatesPagination((prev) => ({
          ...prev,
          hasMore: false,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error("Error fetching gates");
      setGateIdData([]);
      setGatesPagination((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleLoadMoreGates = useCallback(() => {
    const locationId = parseInt(formFieldValues.idLocation);
    if (!gatesPagination.isLoading && gatesPagination.hasMore && locationId) {
      const newLimit = gateIdData.length + 5;
      fetchAllGates(locationId, newLimit, false);
    }
  }, [
    gatesPagination.isLoading,
    gatesPagination.hasMore,
    gateIdData.length,
    formFieldValues.idLocation,
  ]);

  const fetchAllDescriptions = async (
    categoryId: number,
    limit: number = 10,
    reset: boolean = true
  ) => {
    try {
      setDescriptionsPagination((prev) => ({ ...prev, isLoading: true }));

      const response = await fetchDescriptionByCategoryId(categoryId);

      let descriptions: Description[] = [];
      if (Array.isArray(response)) {
        descriptions = response;
      } else if (response) {
        descriptions = [response];
      }

      if (reset) {
        setDescriptions(descriptions);
      } else {
        setDescriptions((prev) => [...prev, ...descriptions]);
      }

      setDescriptionsPagination((prev) => ({
        ...prev,
        totalItems: descriptions.length,
        hasMore: descriptions.length === limit,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching descriptions");
      setDescriptions([]);
      setDescriptionsPagination((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleLoadMoreDescriptions = useCallback(() => {
    const categoryId = parseInt(formFieldValues.idCategory);
    if (
      !descriptionsPagination.isLoading &&
      descriptionsPagination.hasMore &&
      categoryId
    ) {
      const newLimit = descriptions.length + 5;
      fetchAllDescriptions(categoryId, newLimit, false);
    }
  }, [
    descriptionsPagination.isLoading,
    descriptionsPagination.hasMore,
    descriptions.length,
    formFieldValues.idCategory,
  ]);

  const handleAddDescription = async (
    categoryId: number,
    descriptionName: string
  ) => {
    try {
      await addDescription({
        name: descriptionName,
        idDescription: categoryId,
      });
      await fetchAllDescriptions(categoryId);
    } catch (error) {
      console.error("Gagal menambahkan deskripsi");
      throw error;
    }
  };

  const handleNewReportSubmit = async (values: Record<string, string>) => {
    try {
      setIsDataLoading(true);

      let finalDescription = values.description;

      if (values.description === "other" && values.customDescription) {
        try {
          await handleAddDescription(
            parseInt(values.idCategory),
            values.customDescription
          );
          finalDescription = values.customDescription;
        } catch (error) {
          console.error(
            "Failed to add new description, continuing with custom description"
          );
          finalDescription = values.customDescription;
        }
      } else if (values.description !== "other") {
        finalDescription = values.description;
      }

      const newReportData: NewReportData = {
        idLocation: parseInt(values.idLocation),
        idCategory: parseInt(values.idCategory),
        idGate: parseInt(values.idGate) || 0,
        description: finalDescription,
        action: values.action,
        foto: values.foto || "-",
        number_plate: values.number_plate || "-",
        TrxNo: values.TrxNo || "-",
        duration: values.duration || "00:00:00",
        solusi: values.solusi || "-",
      };

      await addIssue(newReportData);

      await fetchAllIssuesData();
      toast.success("Report Berhasil dibuat!");
      setFormFieldValues({});
      setGateIdData([]);
      setDescriptions([]);
    } catch (error) {
      console.error("Error creating new report");
      toast.error("Gagal membuat report. Harap coba lagi.");
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchDate(null);
    setSearchLocation("");
    setSearchTicket("");
    setHasPerformedSearch(false);
    setIssuesPagination((prev) => ({ ...prev, currentPage: 1 }));
    setTimeout(() => {
      fetchAllIssuesData();
    }, 100);
  };

  const hasActiveFilters = searchDate || searchLocation || searchTicket;

  const handleModalClose = () => {
    setIsNewReportModalOpen(false);
    setFormFieldValues({});
    setGateIdData([]);
    setDescriptions([]);
    fetchAllLocations();
  };

  const handleModalOpen = () => {
    setFormFieldValues({});
    setGateIdData([]);
    setDescriptions([]);
    setIsNewReportModalOpen(true);
  };

  const handleModalExport = () => {
    setIsExportModalOpen(true);
  };
  const handleCloseModalExport = () => {
    setIsExportModalOpen(false);
  };

  useEffect(() => {
    fetchAllIssuesData();
  }, [issuesPagination.currentPage, issuesPagination.itemsPerPage]);

  useEffect(() => {
    fetchAllCategories();
    fetchAllLocations();
  }, []);

  const columns: Column<Report>[] = [
    { header: "No.", accessor: "no" },
    {
      header: "Hari",
      accessor: "dayName",
    },
    {
      header: "Tanggal",
      accessor: "date",
    },
    {
      header: "Waktu",
      accessor: "time",
    },
    { header: "Durasi", accessor: "duration" },
    { header: "PK/ID", accessor: "pk_id" },
    { header: "Lokasi", accessor: "location" },
    { header: "Kategori", accessor: "category" },
    { header: "Deskripsi", accessor: "description" },
    { header: "Solusi", accessor: "solution" },
  ];

  const newReportFields = useMemo<Field[]>(() => {
    const baseFields: Field[] = [
      {
        id: "idLocation",
        label: "Location",
        type: "select" as const,
        value: formFieldValues.idLocation || "",
        placeholder: "-- Pilih Location --",
        options: locationData.map((loc) => ({
          label: loc.Name,
          value: String(loc.id),
        })),
        searchable: true,
        onSearch: handleSearchLocation,
        onLoadMore: () =>
          fetchAllLocations(locationData.length + 5, false, search),
        hasMore: locationPagination.hasMore,
        loading: locationPagination.isLoading,
        onChange: (value) => handleFieldValueChange("idLocation", value), // ✅ tambahkan ini
      },
      {
        id: "idCategory",
        label: "Kategori",
        type: "select" as const,
        value: formFieldValues.idCategory || "",
        placeholder: "-- Pilih Kategori --",
        options:
          categories?.map((cat) => ({
            value: cat.id.toString(),
            label: cat.category,
          })) || [],
        required: true,
        onChange: (value) => handleFieldValueChange("idCategory", value),
        hasMore: categoriesPagination.hasMore,
        loading: categoriesPagination.isLoading,
        onLoadMore: handleLoadMoreCategories,
      },
      {
        id: "idGate",
        label: "ID Gate",
        type: "select" as const,
        value: formFieldValues.idGate || "",
        placeholder: gatesPagination.isLoading
          ? "Loading gates..."
          : !formFieldValues.idLocation
          ? "-- Pilih Location dulu --"
          : gateIdData.length === 0
          ? "No gates available"
          : "-- Pilih Gate --",
        options: Array.isArray(gateIdData)
          ? gateIdData.map((gate) => ({
              value: gate.id.toString(),
              label: gate.gate,
            }))
          : [],
        required: true,
        disabled: !formFieldValues.idLocation || gatesPagination.isLoading,
        onChange: (value) => handleFieldValueChange("idGate", value),
        hasMore: gatesPagination.hasMore,
        loading: gatesPagination.isLoading,
        onLoadMore: handleLoadMoreGates,
      },
      {
        id: "description",
        label: "Object/Description",
        type: "select" as const,
        value: formFieldValues.description || "",
        placeholder: descriptionsPagination.isLoading
          ? "Loading descriptions..."
          : !formFieldValues.idCategory
          ? "-- Pilih Kategori dulu --"
          : descriptions.length === 0
          ? "No descriptions available"
          : "-- Pilih Deskripsi --",
        options: Array.isArray(descriptions)
          ? [
              ...descriptions.map((desc) => ({
                value: desc.object,
                label: desc.object,
              })),
              {
                value: "other",
                label: "Other (Input Manual)",
              },
            ]
          : [],
        required: true,
        disabled:
          !formFieldValues.idCategory || descriptionsPagination.isLoading,
        onChange: (value) => handleFieldValueChange("description", value),
        hasMore: descriptionsPagination.hasMore,
        loading: descriptionsPagination.isLoading,
        onLoadMore: handleLoadMoreDescriptions,
      },
      {
        id: "TrxNo",
        label: "Transaction Number",
        type: "text" as const,
        value: formFieldValues.TrxNo || "",
        placeholder: "Enter transaction number",
        required: true,
        onChange: (value) => handleFieldValueChange("TrxNo", value),
      },
      {
        id: "duration",
        label: "Durasi",
        type: "time" as const,
        value: formFieldValues.duration || "00:00:00",
        placeholder: "Format: 00:00:00",
        required: true,
        onChange: (value) => handleFieldValueChange("duration", value),
      },
      {
        id: "solusi",
        label: "Solusi",
        type: "textarea" as const,
        value: formFieldValues.solusi || "",
        placeholder: "Masukkan solusi...",
        required: true,
        onChange: (value) => handleFieldValueChange("solusi", value),
      },
    ];

    if (formFieldValues.description === "other") {
      baseFields.push({
        id: "customDescription",
        label: "Input Deskripsi Manual",
        type: "text" as const,
        value: formFieldValues.customDescription || "",
        placeholder: "Masukkan deskripsi manual...",
        required: true,
        onChange: (value) => handleFieldValueChange("customDescription", value),
      });
    }

    baseFields.push(
      {
        id: "number_plate",
        label: "Number Plate",
        type: "text",
        value: formFieldValues.number_plate || "",
        placeholder: "Contoh: B1234XYZ",
        required: false,
        // validation: validateIndonesianLicensePlate,
        onChange: (value: string) => {
          const cleanValue = value.toUpperCase().substring(0, 11);
          handleFieldValueChange("number_plate", cleanValue);
        },
      },
      {
        id: "action",
        label: "Action",
        type: "radio" as const,
        value: formFieldValues.action,
        placeholder: "",
        options: [
          { value: "OPEN_GATE", label: "Open Gate" },
          { value: "CREATE_ISSUE", label: "Create Issue" },
        ],
        required: true,
        onChange: (value) => handleFieldValueChange("action", value),
      }
    );

    return baseFields;
  }, [
    formFieldValues,
    gateIdData,
    categories,
    descriptions,
    locationData,
    locationPagination,
    categoriesPagination,
    gatesPagination,
    descriptionsPagination,
  ]);

  const handleSubmitExport = (values: { startDate: Date; endDate: Date }) => {
    console.log("Export range:", values.startDate, values.endDate);
    // Lanjutkan ke API export, dll.
  };

  if (!mounted) return;

  return (
    <div className="w-full px-4 sm:px-6 py-4 sm:py-8">
      <main className="flex-1 overflow-hidden bg-white rounded-lg shadow-lg dark:bg-[#222B36]">
        <div className="w-full px-4 sm:px-6 py-4 sm:py-8">
          {/* Header */}
          <div className="px-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Laporan</h1>
              <div className="flex flex-row justify-end space-x-2">
                <button
                  onClick={handleModalOpen}
                  className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 whitespace-nowrap"
                >
                  <span>
                    <PlusIcon className="w-4 h-4" />
                  </span>
                  <span>Tambah Laporan</span>
                </button>
                <button
                  onClick={handleModalExport}
                  className="cursor-pointer bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 whitespace-nowrap"
                >
                  <span>
                    <DownloadIcon className="w-4 h-4" />
                  </span>
                  <span>Export Data</span>
                </button>
              </div>
            </div>
            {/* Wrap DatePicker with Suspense */}
            <div className="flex flex-col space-y-4 mb-4">
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 items-end">
                <div className="relative z-30 flex-1 min-w-[200px] max-w-xs">
                  <DatePicker
                    selected={searchDate}
                    onChange={(date) => setSearchDate(date)}
                    className="px-4 py-2 border rounded-lg pl-10 w-full"
                    placeholderText="Tanggal"
                    dateFormat="dd MMM yyyy"
                    isClearable
                    maxDate={new Date()}
                    popperClassName="z-50"
                    renderCustomHeader={({
                      date,
                      changeYear,
                      changeMonth,
                      decreaseMonth,
                      increaseMonth,
                      prevMonthButtonDisabled,
                      nextMonthButtonDisabled,
                    }) => (
                      <div className="flex items-center justify-between px-2 py-2">
                        <button
                          onClick={decreaseMonth}
                          disabled={prevMonthButtonDisabled}
                        >
                          <IoIosArrowBack />
                        </button>
                        <select
                          value={date.getMonth()}
                          onChange={({ target: { value } }) =>
                            changeMonth(Number(value))
                          }
                          className="mx-1 px-2 py-1 border rounded"
                        >
                          {[
                            "Jan",
                            "Feb",
                            "Mar",
                            "Apr",
                            "May",
                            "Jun",
                            "Jul",
                            "Aug",
                            "Sep",
                            "Oct",
                            "Nov",
                            "Dec",
                          ].map((month, index) => (
                            <option key={month} value={index}>
                              {month}
                            </option>
                          ))}
                        </select>
                        <select
                          value={date.getFullYear()}
                          onChange={({ target: { value } }) =>
                            changeYear(Number(value))
                          }
                          className="mx-1 px-2 py-1 border rounded"
                        >
                          {Array.from(
                            { length: 10 },
                            (_, i) => new Date().getFullYear() - i
                          ).map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={increaseMonth}
                          disabled={nextMonthButtonDisabled}
                        >
                          <IoIosArrowForward />
                        </button>
                      </div>
                    )}
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <CalenderIcon />
                  </span>
                </div>

                <div className="relative flex-1 min-w-[150px] max-w-xs">
                  <input
                    type="text"
                    placeholder="Lokasi"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="px-4 py-2 border rounded-lg pl-10 w-full"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <LocationIcon2 />
                  </span>
                </div>

                <div className="relative flex-1 min-w-[150px] max-w-xs">
                  <input
                    type="text"
                    placeholder="Ticket"
                    value={searchTicket}
                    onChange={(e) => setSearchTicket(e.target.value)}
                    className="px-4 py-2 border rounded-lg pl-10 w-full"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <TicketIcon />
                  </span>
                </div>

                {/* Search Button */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-full sm:w-auto ${
                      !hasActiveFilters && !hasPerformedSearch
                        ? "sm:ml-auto flex justify-end"
                        : ""
                    }`}
                  >
                    <button
                      onClick={handleSearch}
                      className="cursor-pointer bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 whitespace-nowrap w-full sm:w-auto"
                    >
                      <span>🔍</span>
                      <span>Cari</span>
                    </button>
                  </div>

                  {hasActiveFilters && hasPerformedSearch && (
                    <button
                      onClick={handleClearFilters}
                      className="cursor-pointer bg-gray-500 hover:bg-gray-600 text-white px-3 py-2.5 rounded-lg text-sm whitespace-nowrap"
                      title="Clear all filters"
                    >
                      ✕ Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Filter Results Info - update untuk ticket */}
            {hasPerformedSearch && hasActiveFilters && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <span className="font-medium">Filter aktif:</span>
                    {searchDate && (
                      <span className="ml-2 inline-block bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-xs">
                        Tanggal: {searchDate.toLocaleDateString("id-ID")}
                      </span>
                    )}
                    {searchLocation && (
                      <span className="ml-2 inline-block bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-xs">
                        Lokasi: {searchLocation}
                      </span>
                    )}
                    {searchTicket && (
                      <span className="ml-2 inline-block bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-xs">
                        Ticket: {searchTicket}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-300">
                    Menampilkan {reports.length} data
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Wrap Table with Suspense */}
          <Suspense fallback={<LoadingSpinner />}>
            <div className="bg-white dark:bg-[#222B36] rounded-lg p-6">
              {isDataLoading ? (
                <ThreeDotsLoader />
              ) : reports.length === 0 && hasPerformedSearch ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 dark:text-gray-400">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium mb-2">
                      Tidak ada data ditemukan
                    </h3>
                    <p className="text-sm">Coba ubah filter pencarian Anda</p>
                  </div>
                </div>
              ) : (
                <div className="">
                  <CommonTable
                    data={reports}
                    columns={columns as any}
                    showPagination={true}
                    currentPage={issuesPagination.currentPage}
                    totalPages={issuesPagination.totalPages}
                    onPageChange={handleIssuesPageChange}
                    itemsPerPage={issuesPagination.itemsPerPage}
                    totalItems={issuesPagination.totalItems}
                    onItemsPerPageChange={handleItemsReportPerPageChange}
                  />
                </div>
              )}
            </div>
          </Suspense>
          {/* Wrap Modal with Suspense */}
          <Suspense fallback={null}>
            <IsseFormInputModal
              isOpen={isNewReportModalOpen}
              onClose={handleModalClose}
              onSubmit={handleNewReportSubmit}
              title="Tambah Laporan Baru"
              fields={newReportFields}
              confirmText="Submit"
              cancelText="Cancel"
            />
          </Suspense>

          <Suspense fallback={null}>
            <ExportModalProps
              isOpen={isExportModalOpen}
              onClose={handleCloseModalExport}
              onSubmit={handleSubmitExport}
              title="Export Data"
              confirmText="Export"
              cancelText="Batal"
            />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
