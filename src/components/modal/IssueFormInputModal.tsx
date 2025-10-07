/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import SearchableSelect from "@/components/input/SearchableSelect";
import Image from "next/image";
import { fetchLocationById } from "@/hooks/useLocation";

interface FieldOption {
  value: string;
  label: string;
}

export interface Field {
  id: string;
  label: string;
  type:
    | "text"
    | "number"
    | "select"
    | "textarea"
    | "radio"
    | "time"
    | "datetime-local";
  value: string;
  placeholder?: string;
  options?: FieldOption[];
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  searchable?: boolean;
  lazyLoad?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
  validation?: (value: string) => { isValid: boolean; message: string };

  onSearch?: (term: string) => void;
  isSearching?: boolean;
  searchDebounceMs?: number;
}

interface IssueInputFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => void;
  title: string;
  fields: Field[];
  confirmText?: string;
  cancelText?: string;
}

const IsseFormInputModal: React.FC<IssueInputFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  fields,
  confirmText = "Submit",
  cancelText = "Cancel",
}) => {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState<{ label: string; src: string }[]>([]);
  const [photoIntercome, setPhotoIntercome] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isLoadingLpr, setIsLoadingLpr] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [, setFieldValidationStates] = useState<
    Record<
      string,
      {
        isValid: boolean;
        message: string;
      }
    >
  >({});

  const [licenseValidationTimeout, setLicenseValidationTimeout] =
    useState<NodeJS.Timeout | null>(null);

  const validateLicensePlate = useCallback(
    (value: string, fieldId: string) => {
      const field = fields.find((f) => f.id === fieldId);
      if (field?.validation) {
        const result = field.validation(value);
        setValidationErrors((prev) => ({
          ...prev,
          [fieldId]: result.isValid ? "" : result.message,
        }));
      }
    },
    [fields]
  );

  const debouncedLicenseValidation = useCallback(
    (value: string, fieldId: string) => {
      if (licenseValidationTimeout) {
        clearTimeout(licenseValidationTimeout);
      }

      const timeout = setTimeout(() => {
        validateLicensePlate(value, fieldId);
      }, 300);

      setLicenseValidationTimeout(timeout);
    },
    [licenseValidationTimeout, validateLicensePlate]
  );

  // 🔹 Ambil snapshot dari API
  const handleSnapshot = async () => {
    try {
      setIsLoadingLpr(true);
      if (formValues.idLocation === "")
        return toast.error("Pilih lokasi terlebih dahulu");
      if (formValues.idGate === "")
        return toast.error("Pilih gate terlebih dahulu");

      const locationDetail = await fetchLocationById(
        Number(formValues.idLocation)
      );
      if (!locationDetail) return toast.error("Lokasi tidak ditemukan");

      const urlServer = locationDetail.data?.UrlServer;
      const encodedUrlServer = encodeURIComponent(urlServer);

      const data = await fetch(
        `/api/snapshot-proxy/${formValues.idGate}?urlServer=${encodedUrlServer}`
      ).then((res) => res.json());

      if (data?.snapshots) {
        const lprBase64 = data.snapshots.lpr || null;
        const faceBase64 = data.snapshots.face || null;

        // === Jalankan plate recognition hanya jika ada LPR ===
        if (lprBase64) {
          const plateRecognizeRes = await fetch(`/api/plate-recognize`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              image_base64: lprBase64,
              cameraId: locationDetail.code,
            }),
          });

          const plateRecognize = await plateRecognizeRes.json();
          if (plateRecognize?.result?.results?.length > 0) {
            const detectedPlate =
              plateRecognize.result.results[0].plate?.toUpperCase() || "";

            const NoTransaction = await fetch(
              `${
                process.env.NEXT_PUBLIC_API_BASE_URL
              }/api/message/getTransactionPOST?plateNumber=${detectedPlate}&locationId=${Number(
                formValues.idLocation
              )}`
            );

            const NoTransactionJson = await NoTransaction.json();
            const trxNo = NoTransactionJson.data.data.transactionNo;
            handleInputChange("TrxNo", trxNo);
            handleInputChange("number_plate", detectedPlate);
          }
        }

        // === Tambahkan label pada foto ===
        const newPhotos = [
          lprBase64 ? { label: "LPR", src: lprBase64 } : null,
          faceBase64 ? { label: "Face", src: faceBase64 } : null,
        ].filter(Boolean) as { label: string; src: string }[];

        setPhotos(newPhotos);
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil snapshot");
    } finally {
      setIsLoadingLpr(false);
    }
  };

  const handleIntercome = async () => {
    try {
      setIsLoading(true);
      if (formValues.idLocation === "")
        return toast.error("Pilih lokasi terlebih dahulu");
      if (formValues.idGate === "")
        return toast.error("Pilih gate terlebih dahulu");

      const locationDetail = await fetchLocationById(
        Number(formValues.idLocation)
      );
      if (!locationDetail) return toast.error("Lokasi tidak ditemukan");

      const urlServer = locationDetail.data?.UrlServer;
      const encodedUrlServer = encodeURIComponent(urlServer);

      const res = await fetch(
        `/api/capture-intercome/${formValues.idGate}?urlServer=${encodedUrlServer}`
      );

      const data = await res.json();

      if (data?.snapshots) {
        const faceBase64 = data.snapshots.face || null;

        setPhotoIntercome(faceBase64);

        setIsLoading(false);
      } else {
        toast.error("Snapshot tidak ditemukan");
        setIsLoading(false);
      }
    } catch (err) {
      toast.error("Gagal mengambil snapshot");
      console.error(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (licenseValidationTimeout) {
        clearTimeout(licenseValidationTimeout);
      }
    };
  }, [licenseValidationTimeout]);

  useEffect(() => {
    if (isOpen) {
      const initialValues: Record<string, string> = {};
      fields.forEach((field) => {
        initialValues[field.id] = field.value;
      });
      setFormValues(initialValues);
      setValidationErrors({});
    }
  }, [isOpen, fields]);

  useEffect(() => {
    if (isOpen) {
      const updatedValues: Record<string, string> = { ...formValues };
      let hasChanges = false;

      fields.forEach((field) => {
        if (updatedValues[field.id] !== field.value) {
          updatedValues[field.id] = field.value;
          hasChanges = true;
        }
      });

      if (hasChanges) {
        setFormValues(updatedValues);
      }
    }
  }, [fields, isOpen, formValues]);

  const handleLoadMore = useCallback(
    (fieldId: string) => {
      const field = fields.find((f) => f.id === fieldId);
      if (field?.onLoadMore) {
        field.onLoadMore();
      }
    },
    [fields]
  );

  const renderField = (field: Field) => {
    const value = formValues[field.id] || "";
    const isReadonly = field.readonly || false;
    const isDisabled = field.disabled || false;
    const hasError = !!validationErrors[field.id];
    const inputClassName = getInputClassName(hasError, isDisabled, isReadonly);

    switch (field.type) {
      case "select":
        return (
          <div>
            <SearchableSelect
              options={field.options || []}
              value={value}
              onChange={(newValue) => handleInputChange(field.id, newValue)}
              placeholder={field.placeholder}
              disabled={isDisabled || isReadonly}
              error={validationErrors[field.id]}
              onLoadMore={
                field.onLoadMore ? () => handleLoadMore(field.id) : undefined
              }
              hasMoreData={field.hasMore || false}
              isLoadingMore={field.loading || false}
              showLoadMoreInfo={true}
              loadMoreText={`Memuat lebih banyak... (${
                field.options?.length || 0
              }${field.hasMore ? "+" : ""})`}
              // 🔹 ini kuncinya
              onSearch={(term) => {
                if (field.onSearch) {
                  field.onSearch(term); // lempar ke parent
                }
              }}
              searchDebounceMs={300} // biar ga spam API
            />
          </div>
        );

      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`${inputClassName} resize-none`}
            rows={3}
            readOnly={isReadonly}
            disabled={isDisabled}
            required={field.required}
          />
        );

      case "text":
        return (
          <div>
            <input
              type="text"
              value={value}
              onChange={(e) => {
                let newValue = e.target.value;

                if (field.id === "number_plate") {
                  newValue = newValue.toUpperCase();
                  if (newValue.length > 11) {
                    newValue = newValue.substring(0, 11);
                  }
                }

                handleInputChange(field.id, newValue);
              }}
              onBlur={() => {
                if (field.id !== "number_plate") {
                  validateLicensePlate(value, field.id);
                }
              }}
              placeholder={field.placeholder}
              className={inputClassName}
              readOnly={isReadonly}
              disabled={isDisabled}
              required={field.required}
              autoComplete="off"
              spellCheck="false"
            />
            {/* {hasError && (
            <div className="mt-1 text-sm text-red-600 dark:text-red-400 transition-opacity duration-200">
              {validationErrors[field.id]}
            </div>
          )} */}
          </div>
        );

      case "radio":
        return (
          <div className="flex gap-4">
            {field.options?.map((option) => (
              <label
                key={option.value}
                className="flex space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  disabled={isDisabled || isReadonly}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        );

      case "time":
        return (
          <div>
            <input
              type="time"
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={inputClassName}
              readOnly={isReadonly}
              disabled={isDisabled}
              required={field.required}
              step="1"
            />
            {hasError && (
              <div className="mt-1 text-sm text-red-600 dark:text-red-400 transition-opacity duration-200">
                {validationErrors[field.id]}
              </div>
            )}
          </div>
        );

      case "datetime-local":
        return (
          <div>
            <input
              type="datetime-local"
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={`${inputClassName}`}
              readOnly={isReadonly}
              disabled={isDisabled}
              required={field.required}
              step="1"
            />
            {hasError && (
              <div className="mt-1 text-sm text-red-600 dark:text-red-400 transition-opacity duration-200">
                {validationErrors[field.id]}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div>
            <input
              type={field.type}
              value={value}
              onChange={(e) => {
                let newValue = e.target.value;

                if (field.id === "number_plate") {
                  newValue = newValue.toUpperCase();
                  if (newValue.length > 11) {
                    newValue = newValue.substring(0, 11);
                  }
                }

                handleInputChange(field.id, newValue);
              }}
              onBlur={() => {
                if (field.id !== "number_plate" && field.validation) {
                  const result = field.validation(value);
                  setValidationErrors((prev) => ({
                    ...prev,
                    [field.id]: result.isValid ? "" : result.message,
                  }));
                }
              }}
              placeholder={field.placeholder}
              className={inputClassName}
              readOnly={isReadonly}
              disabled={isDisabled}
              required={field.required}
              autoComplete="off"
              spellCheck="false"
            />
            {hasError && (
              <div className="mt-1 text-sm text-red-600 dark:text-red-400 transition-opacity duration-200">
                {validationErrors[field.id]}
              </div>
            )}
          </div>
        );
    }
  };

  const handleInputChange = useCallback(
    (fieldId: string, value: string) => {
      setFormValues((prev) => ({
        ...prev,
        [fieldId]: value,
      }));

      const field = fields.find((f) => f.id === fieldId);
      field?.onChange?.(value);

      if (fieldId === "number_plate") {
        debouncedLicenseValidation(value, fieldId);
      } else {
        if (field?.validation) {
          const result = field.validation(value);
          setValidationErrors((prev) => ({
            ...prev,
            [fieldId]: result.isValid ? "" : result.message,
          }));
        }
      }
    },
    [fields, debouncedLicenseValidation]
  );

  const getInputClassName = useMemo(
    () => (hasError: boolean, isDisabled: boolean, isReadonly: boolean) => {
      let classes =
        "w-full p-3 border rounded-md text-sm transition-all duration-200 shadow-sm focus:outline-none";

      if (isDisabled || isReadonly) {
        classes +=
          " bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed border-gray-300 dark:border-gray-600";
      } else if (hasError) {
        classes +=
          " bg-white dark:bg-gray-700 border-red-500 dark:border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20";
      } else {
        classes +=
          " bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
      }
      return classes;
    },
    []
  );

  const validateForm = (): boolean => {
    const newValidationStates: Record<
      string,
      { isValid: boolean; message: string }
    > = {};
    let isValid = true;

    fields.forEach((field) => {
      const value = formValues[field.id] || "";

      if (field.required && (!value || value.trim() === "")) {
        newValidationStates[field.id] = {
          isValid: false,
          message: `${field.label} wajib diisi`,
        };
        isValid = false;
      } else if (field.validation) {
        const validationResult = field.validation(value);
        newValidationStates[field.id] = validationResult;
        if (!validationResult.isValid) {
          isValid = false;
        }
      }
    });

    setFieldValidationStates(newValidationStates);
    setValidationErrors(
      Object.entries(newValidationStates).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: value.isValid ? "" : value.message,
        }),
        {}
      )
    );

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast?.error("Harap perbaiki error yang ada sebelum submit");
      return;
    }

    console.log("Form submitted:", formValues);
    const lprPhoto = photos.find((p) => p.label === "LPR")?.src || "";
    const facePhoto = photos.find((p) => p.label === "Face")?.src || "";
    const intercomePhoto = photoIntercome || "";

    const formWithPhotos = {
      ...formValues,
      foto_lpr: lprPhoto,
      foto_face: facePhoto,
      foto_bukti_pembayaran: intercomePhoto,
    };

    onSubmit(formWithPhotos);
    onClose();
    setPhotoIntercome("");
    setPhotos([]);
  };

  if (!isOpen) return null;

  const leftColumnFields: Field[] = [];
  const rightColumnFields: Field[] = [];

  fields.forEach((field, index) => {
    if (index % 2 === 0) {
      leftColumnFields.push(field);
    } else {
      rightColumnFields.push(field);
    }
  });

  const handleCloseModal = () => {
    onClose();
    setPhotoIntercome("");
    setPhotos([]);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-center">{title}</h2>

            {/* Input Fields in Left-Right Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4">
                {leftColumnFields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    {renderField(field)}
                    {validationErrors[field.id] && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                        {validationErrors[field.id]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {rightColumnFields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    {renderField(field)}
                    {validationErrors[field.id] && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                        {validationErrors[field.id]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center w-full gap-x-10">
              <div className="mt-8 border-t pt-6 w-full">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Foto Plat Nomor dan Wajah
                  </h3>
                  <button
                    type="button"
                    onClick={handleSnapshot}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    disabled={isLoadingLpr}
                  >
                    {isLoadingLpr ? "Mengambil..." : "Ambil Gambar"}
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                  {photos.length > 0 ? (
                    photos.map((photo, idx) => (
                      <div
                        key={idx}
                        className="relative border rounded-lg overflow-hidden shadow cursor-pointer hover:scale-105 transition"
                        onClick={() => photo && setSelectedPhoto(photo.src)}
                      >
                        <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                          {photo.label}
                        </div>

                        <Image
                          src={
                            photo.src || "/images/no-image-found-360x250.png"
                          }
                          alt={`snapshot-${idx}`}
                          className="w-full h-32 object-cover"
                          width={200}
                          height={200}
                        />
                      </div>
                    ))
                  ) : (
                    // ✅ fallback jika tidak ada foto
                    <>
                      {[...Array(2)].map((_, idx) => (
                        <div
                          key={idx}
                          className="relative border rounded-lg overflow-hidden shadow cursor-pointer hover:scale-105 transition"
                        >
                          <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                            {idx === 0 ? "LPR" : "Face"}
                          </div>
                          <Image
                            src="/images/no-image-found-360x250.png"
                            alt={`snapshot-empty-${idx}`}
                            className="w-full h-32 object-cover"
                            width={200}
                            height={200}
                          />
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>

              <div className="mt-8 border-t pt-6 w-full">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    Bukti Bayar
                  </h3>
                  <button
                    type="button"
                    onClick={handleIntercome}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    disabled={isLoading}
                  >
                    {isLoading ? "Mengambil..." : "Ambil Gambar"}
                  </button>
                </div>
                <div className="flex justify-between items-center w-full">
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                    <div
                      className="relative border rounded-lg overflow-hidden shadow cursor-pointer hover:scale-105 transition"
                      onClick={() => {
                        if (photoIntercome) setSelectedPhoto(photoIntercome);
                      }}
                    >
                      <Image
                        src={
                          photoIntercome
                            ? photoIntercome
                            : "/images/no-image-found-360x250.png"
                        }
                        alt="snapshot"
                        className="w-full h-32 object-cover"
                        width={200}
                        height={200}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
              <button
                type="button"
                onClick={handleCloseModal}
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

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-2 hover:bg-black"
            >
              ✕
            </button>
            <img
              src={
                selectedPhoto.startsWith("data:image")
                  ? selectedPhoto
                  : `data:image/jpeg;base64,${selectedPhoto}`
              }
              width={800}
              height={800}
              alt="Preview"
              className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default IsseFormInputModal;
