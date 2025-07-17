/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useSocket } from "@/hooks/useSocket";
import { GateStatusUpdate } from "@/types/gate";
import { toast } from "react-toastify";
import { changeStatusGate, endCall } from "@/hooks/useIOT";
import Image from "next/image";
import { fetchCategories } from "@/hooks/useCategories";
import {
  addDescription,
  fetchDescriptionByCategoryId,
} from "@/hooks/useDescriptions";
import { addIssue } from "@/hooks/useIssues";
import { formatTanggalLocal } from "@/utils/formatDate";
import SearchableSelect from "@/components/input/SearchableSelect";
import { validateLicensePlate } from "@/utils/validationNumberPlat";
import {
  createTransaction,
  fetchNewTransaction,
  sendWhatsApp,
} from "@/hooks/useTransaction";
import { validateWhatsAppNumber } from "@/utils/formatPhoneNumber";
import { getStatusColor } from "@/utils/statusColorBedge";
import { Eye, X, User, Mail, Car } from "lucide-react";
import { CountdownCircle } from "@/components/Countdown";
interface SocketContextType {
  socket: any;
  connectionStatus: string;
  activeCall: GateStatusUpdate | null;
  setActiveCall: (call: GateStatusUpdate | null) => void;
  userNumber: number | null;
  setUserNumber: (num: number) => void;
  endCallFunction: () => void;
}

const SocketContext = createContext<
  SocketContextType & {
    muteRingtone?: () => void;
    unmuteRingtone?: () => void;
  }
>({
  socket: null,
  connectionStatus: "Disconnected",
  activeCall: null,
  setActiveCall: () => {},
  userNumber: null,
  setUserNumber: () => {},
  endCallFunction: () => {},
  muteRingtone: undefined,
  unmuteRingtone: undefined,
});

export const useGlobalSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const socket = useSocket();
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [activeCall, setActiveCall] = useState<GateStatusUpdate | null>(null);
  const [userNumber, setUserNumberState] = useState<number | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [, setCallInTime] = useState<Date | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUserNumber = localStorage.getItem("admin_user_number");
      if (savedUserNumber) {
        setUserNumberState(parseInt(savedUserNumber));
      }
      if (isDesktop) {
        setAudio(new Audio("/sound/sound-effect-old-phone-191761.mp3"));
      }
    }
  }, [isDesktop]);

  const setUserNumber = (num: number) => {
    setUserNumberState(num);
    localStorage.setItem("admin_user_number", num.toString());

    if (socket && isDesktop) {
      socket.emit("register", num);
    }
  };

  const muteRingtone = () => {
    if (audio) {
      audio.volume = 0;
      audio.muted = true;
    }
  };
  const unmuteRingtone = () => {
    if (audio) {
      audio.volume = 1;
      audio.muted = false;
    }
  };

  const endCallFunction = async () => {
    if (!socket || !activeCall || !isDesktop) return;
    const userId = Number(localStorage.getItem("admin_user_number"));
    if (!userId) return;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    try {
      const response = await endCall(userId);
      toast.success(response.message);
      setActiveCall(null);
      setCallInTime(null);
    } catch (err) {
      console.error("Error ending call:", err);
      toast.error("Failed to end call");
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      setConnectionStatus("Connected");
      if (userNumber && isDesktop) {
        socket.emit("register", userNumber);
      }
    });

    socket.on("disconnect", () => {
      setConnectionStatus("Disconnected");
      setActiveCall(null);
      setCallInTime(null);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    if (isDesktop) {
      socket.on("gate-status-update", (data: GateStatusUpdate) => {
        console.log("📡 Gate Update:", data);
        setActiveCall(data);
        setCallInTime(new Date());

        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(console.error);
        }
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }
      });
    }

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      if (isDesktop) {
        socket.off("gate-status-update");
      }
    };
  }, [socket, userNumber, audio, isDesktop]);
  return (
    <SocketContext.Provider
      value={{
        socket,
        connectionStatus: isDesktop ? connectionStatus : "Disabled (Mobile)",
        activeCall: isDesktop ? activeCall : null,
        setActiveCall,
        userNumber,
        setUserNumber,
        endCallFunction,
        muteRingtone,
        unmuteRingtone,
      }}
    >
      {!isDesktop && <></>}
      {children}
    </SocketContext.Provider>
  );
}

interface DataIssue {
  idCategory?: number;
  idGate?: number;
  description?: string;
  action?: string;
  foto?: string;
  number_plate?: string;
  TrxNo?: string;
}

export function GlobalCallPopup() {
  const {
    activeCall,
    setActiveCall,
    endCallFunction,
    muteRingtone,
    unmuteRingtone,
  } = useGlobalSocket();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [descriptionOptions, setDescriptionOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // const [description, setDescription] = useState<Description[]>([]);
  const [isOpeningGate, setIsOpeningGate] = useState(false);
  const [isCreateIssue, setIsCreateIssue] = useState(false);
  // const [categories, setCategories] = useState<Category[]>([]);
  const [dataIssue, setDataIssue] = useState<DataIssue>({});
  const [editablePlateNumber, setEditablePlateNumber] = useState("");
  const [isPlateNumberValid, setIsPlateNumberValid] = useState(true);
  const [isEditingPlateNumber, setIsEditingPlateNumber] = useState(false);
  const [originalPlateNumber, setOriginalPlateNumber] = useState("");
  const [imageErrors, setImageErrors] = useState({
    photoIn: false,
    photoOut: false,
    photoCapture: false,
  });
  const [localActiveCall, setLocalActiveCall] =
    useState<GateStatusUpdate | null>(null);

  const [isMuted, setIsMuted] = useState(false);

  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingDescriptions, setIsLoadingDescriptions] = useState(false);

  const [categoryPagination, setCategoryPagination] = useState({
    page: 1,
    hasMore: true,
    isLoadingMore: false,
  });

  const [manualDescription, setManualDescription] = useState("");
  const [isAddingDescription, setIsAddingDescription] = useState(false);
  const [isSearchingTransaction, setIsSearchingTransaction] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);

  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [showWhatsAppInput, setShowWhatsAppInput] = useState(false);
  const [whatsappError, setWhatsappError] = useState<string | null>(null);

  const [isModalDetailMemberOpen, setIsModalDetailMemberOpen] = useState(false);
  const [
    isModalDetailCreateTransactionOpen,
    setIsModalDetailCreateTransactionOpen,
  ] = useState(false);
  const [transactionSuccessData, setTransactionSuccessData] = useState<{
    transactionNo: string;
    inTime: string;
    plateNumber: string;
  } | null>(null);

  // const [newTransactionData, setNewTransactionData] = useState<{
  //   transactionNo: string;
  //   inTime: string;
  //   plateNumber: string;
  // } | null>(null);

  const openModal = () => setIsModalDetailMemberOpen(true);
  const closeModal = () => setIsModalDetailMemberOpen(false);
  const closeModalTransactionSuccess = () => {
    setIsModalDetailCreateTransactionOpen(false);
  };

  const handleAddDescription = async (
    categoryId: number,
    descriptionName: string
  ) => {
    try {
      await addDescription({
        name: descriptionName,
        idDescription: categoryId,
      });
    } catch (error) {
      console.error("Gagal menambahkan deskripsi:", error);
      throw error;
    }
  };

  // const [descriptionPagination, setDescriptionPagination] = useState({
  //   page: 1,
  //   hasMore: true,
  //   isLoadingMore: false,
  // });

  const isPMGate = activeCall?.gate?.toUpperCase().includes("PM") || false;

  const handleMuteRingtone = () => {
    if (isMuted) {
      unmuteRingtone?.();
    } else {
      muteRingtone?.();
    }
    setIsMuted(!isMuted);
  };

  const handleCloseModal = () => {
    const audioElements = document.querySelectorAll("audio");
    audioElements.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });

    endCallFunction();
  };

  const getTransaction = async (
    plateNumber: string,
    locationId: string | number | undefined
  ) => {
    try {
      const response = await fetchNewTransaction(plateNumber, locationId);
      return response;
    } catch (error) {
      console.error("Error fetching transaction:", error);
      throw error;
    }
  };

  const handleSearchTransaction = async () => {
    if (!editablePlateNumber.trim()) {
      toast.error("Plat nomor tidak boleh kosong");
      return;
    }

    if (!isPlateNumberValid) {
      toast.error("Format plat nomor tidak valid");
      return;
    }

    const locationId = activeCall?.location?.id;
    try {
      setIsSearchingTransaction(true);
      const response = await getTransaction(editablePlateNumber, locationId);

      if (response?.data?.data) {
        updateActiveCallWithTransactionData(response);
      } else {
        toast.error("Data transaksi tidak ditemukan atau format tidak valid");
      }
    } catch (error) {
      console.error("Error searching transaction:", error);
      toast.error("Gagal mengambil data transaksi");
    } finally {
      setIsSearchingTransaction(false);
    }
  };

  const updateActiveCallWithTransactionData = (transactionData: any) => {
    if (!activeCall || !transactionData?.data?.data) return;

    const updatedActiveCall = { ...activeCall };
    const transaction = transactionData.data.data;

    if (!updatedActiveCall.detailGate) {
      updatedActiveCall.detailGate = {
        data: {},
        id: 0,
        ticket: "",
        gate: "",
        lokasi: "",
        foto_in: "",
        number_plate: "",
        payment_status: "",
        payment_method: "",
        issuer_name: "",
        payment_time: "",
      };
    }

    // Update detailGate with transaction data
    updatedActiveCall.detailGate = {
      ...updatedActiveCall.detailGate,
      data: {
        ...updatedActiveCall.detailGate.data,
        transactionNo: transaction.transactionNo || "-",
        paymentStatus: transaction.paymentStatus || "UNPAID",
        paymentTime: transaction.paymentTime || "",
        paymentMethod: transaction.paymentMethod || "-",
        issuerName: transaction.issuerName || "-",
        inTime: transaction.inTime || "-",
        outTime: transaction.outTime || "-",
        duration: transaction.duration || 0,
        tariff: transaction.tariff || 0,
        vehicleType: transaction.vehicleType || "-",
      },
      payment_status: transaction.paymentStatus || "UNPAID",
      payment_method: transaction.paymentMethod || "-",
      issuer_name: transaction.issuerName || "-",
      payment_time: transaction.paymentTime || "",
    };

    // Update plateNumber
    if (transaction.plateNumber) {
      updatedActiveCall.plateNumber = transaction.plateNumber.toUpperCase();
      setEditablePlateNumber(transaction.plateNumber.toUpperCase());
      setOriginalPlateNumber(transaction.plateNumber.toUpperCase());
    }

    // Update location info
    if (transaction.location) {
      updatedActiveCall.location = {
        ...updatedActiveCall.location,
        Name: transaction.location,
      };
    }

    // Update the local state
    setLocalActiveCall(updatedActiveCall);

    // Update the activeCall in context if needed
    if (setActiveCall) {
      setActiveCall(updatedActiveCall);
    }

    // Show success message
    toast.success("Data transaksi berhasil diperbarui");
  };

  const handleWhatsAppNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setWhatsappNumber(value);

    // Validasi real-time
    const validation = validateWhatsAppNumber(value);
    setWhatsappError(validation.isValid ? null : validation.message || null);
  };

  const handleSendWhatsApp = async () => {
    // Validasi sebelum mengirim
    const validation = validateWhatsAppNumber(whatsappNumber);
    if (!validation.isValid) {
      setWhatsappError(validation.message || "Nomor WhatsApp tidak valid");
      return;
    }

    if (!ticketNo) {
      toast.error("Nomor transaksi harus diisi");
      return;
    }

    setIsSendingWhatsApp(true);
    try {
      // Send WhatsApp
      const whatsappData = {
        numberWhatsapp: whatsappNumber,
        plate_number: editablePlateNumber,
        no_transaction: ticketNo,
        idLocation: activeCall?.location?.id,
      };

      const response = await sendWhatsApp(whatsappData);

      if (response.success) {
        toast.success("Tiket berhasil dikirim via WhatsApp");
        setShowWhatsAppInput(false);
      } else {
        throw new Error(response.message || "Gagal mengirim WhatsApp");
      }
    } catch (error) {
      console.error("Error sending WhatsApp:", error);
      toast.error("Gagal mengirim tiket via WhatsApp");
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  const handleCreateTransaction = async () => {
    try {
      const transactionReqData = {
        plateNumber: editablePlateNumber,
        locationId: activeCall?.location?.id,
        vehicleType: "MOBIL" as const,
        codeGate: activeCall?.codeGate?.toUpperCase() || "PMB1",
      };

      const response = await createTransaction(transactionReqData);
      if (response.success && response.data?.data) {
        const transactionData = response.data.data;
        console.log(transactionData, "<<<<transactionData");

        setTransactionSuccessData({
          transactionNo: transactionData.data.transactionNo,
          inTime: transactionData.data.inTime,
          plateNumber: transactionData.data.plateNumber,
        });

        setIsModalDetailCreateTransactionOpen(true);
        // Update activeCall dengan type safety
        if (setActiveCall && activeCall) {
          const updatedActiveCall: GateStatusUpdate = {
            ...activeCall,
            detailGate: {
              ...activeCall.detailGate,
              data: {
                ...activeCall.detailGate?.data,
                transactionNo: transactionData.data.transactionNo,
                inTime: transactionData.data.inTime,
              },
              number_plate: transactionData.data.plateNumber,
            },
            plateNumber: transactionData.data.plateNumber,
          };

          setActiveCall(updatedActiveCall);
        }

        // Update localActiveCall dengan type safety
        setLocalActiveCall((prev: GateStatusUpdate | null) => {
          if (!prev) return prev;

          return {
            ...prev,
            detailGate: {
              ...prev.detailGate,
              data: {
                ...prev.detailGate?.data,
                transactionNo: transactionData.data.transactionNo,
                inTime: transactionData.data.inTime,
              },
              number_plate: transactionData.data.plateNumber,
            },
            plateNumber: transactionData.data.plateNumber,
          };
        });

        // Update editable plate number
        setEditablePlateNumber(transactionData.data.plateNumber);
        setOriginalPlateNumber(transactionData.data.plateNumber);

        toast.success("Tiket berhasil dibuat");
      } else {
        throw new Error(response.message || "Gagal membuat transaksi");
      }
    } catch (error) {
      console.error("Error sending WhatsApp:", error);
      setIsModalDetailCreateTransactionOpen(false);
      toast.error("Gagal membuat transaksi baru");
    }
  };

  const getPlateNumberValidationClass = (plateNumber: string) => {
    const isValid = validateLicensePlate(plateNumber);

    if (!plateNumber.trim()) {
      return "border-gray-300 dark:border-gray-600";
    }

    return isValid
      ? "border-green-500 dark:border-green-500 bg-green-50 dark:bg-green-900/20"
      : "border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20";
  };

  const loadCategories = async (page: number = 1, reset: boolean = false) => {
    if (page === 1) {
      setIsLoadingCategories(true);
    } else {
      setCategoryPagination((prev) => ({ ...prev, isLoadingMore: true }));
    }

    try {
      const response = await fetchCategories(page, 5);
      const newCategories = response.data;

      if (reset || page === 1) {
        // setCategories(newCategories);
        const options = newCategories.map((category) => ({
          value: category.id.toString(),
          label: category.category,
        }));
        setCategoryOptions(options);
      } else {
        // setCategories((prev) => [...prev, ...newCategories]);
        setCategoryOptions((prev) => [
          ...prev,
          ...newCategories.map((category) => ({
            value: category.id.toString(),
            label: category.category,
          })),
        ]);
      }

      setCategoryPagination((prev) => ({
        ...prev,
        page: page,
        hasMore: newCategories.length === 5,
        isLoadingMore: false,
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Gagal memuat kategori");
      setCategoryPagination((prev) => ({ ...prev, isLoadingMore: false }));
    } finally {
      if (page === 1) {
        setIsLoadingCategories(false);
      }
    }
  };
  useEffect(() => {
    if (activeCall) {
      setLocalActiveCall(activeCall);
      setSelectedCategory("");
      setSelectedDescription("");
      setManualDescription("");
      setCategoryOptions([]);
      setDescriptionOptions([]);
      setCategoryPagination({ page: 1, hasMore: true, isLoadingMore: false });
      setDataIssue({});
      setTransactionData(null);
      setIsSearchingTransaction(false);
      setWhatsappNumber("");

      const numberPlate = activeCall?.plateNumber?.toUpperCase() || "-";
      setEditablePlateNumber(numberPlate);
      setOriginalPlateNumber(numberPlate);
      setIsEditingPlateNumber(false);
      setImageErrors({
        photoIn: false,
        photoOut: false,
        photoCapture: false,
      });
      setIsMuted(false);
    }
  }, [activeCall]);

  useEffect(() => {
    if (activeCall) {
      setCategoryPagination({ page: 1, hasMore: true, isLoadingMore: false });
      loadCategories(1, true);
    }
  }, [activeCall]);

  const handleLoadMoreCategories = () => {
    if (categoryPagination.hasMore && !categoryPagination.isLoadingMore) {
      const nextPage = categoryPagination.page + 1;
      loadCategories(nextPage);
    }
  };

  useEffect(() => {
    const fetchDescriptionsDataByCategoryId = async (categoryId: number) => {
      setIsLoadingDescriptions(true);
      try {
        const response = await fetchDescriptionByCategoryId(categoryId);
        const descriptions = Array.isArray(response) ? response : [response];

        const options = descriptions.map((desc) => ({
          value: desc.object,
          label: desc.object,
        }));

        options.push({
          value: "OTHER_MANUAL",
          label: "Other (Input Manual)",
        });

        setDescriptionOptions(options);
      } catch (error) {
        console.error("Error fetching description by category ID:", error);
        toast.error("Gagal memuat deskripsi untuk kategori ini");
        setDescriptionOptions([]);
      } finally {
        setIsLoadingDescriptions(false);
      }
    };

    if (selectedCategory) {
      const categoryId = parseInt(selectedCategory);
      if (!isNaN(categoryId)) {
        fetchDescriptionsDataByCategoryId(categoryId);
        setSelectedDescription("");
      }
    } else {
      // setDescription([]);
      setDescriptionOptions([]);
      setSelectedDescription("");
    }
  }, [selectedCategory]);

  useEffect(() => {
    setIsPlateNumberValid(validateLicensePlate(editablePlateNumber));
  }, [editablePlateNumber]);

  const handleOpenGate = async () => {
    if (!activeCall || !selectedCategory) return;

    setIsOpeningGate(true);
    try {
      const response = await changeStatusGate(activeCall.gateId, "OPEN");

      if (response.code === 250003) {
        toast.success("Gate berhasil dibuka");
      } else {
        toast.error("Gagal membuka gate");
      }
    } catch (error) {
      console.error("Error opening gate:", error);
      toast.error("Terjadi kesalahan");
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!selectedCategory) {
      errors.push("Kategori harus dipilih");
    }

    if (!selectedDescription) {
      errors.push("Deskripsi harus dipilih");
    }

    if (selectedDescription === "OTHER_MANUAL" && !manualDescription.trim()) {
      errors.push("Deskripsi manual harus diisi");
    }

    if (!isPlateNumberValid) {
      errors.push("Format plat nomor tidak valid");
    }

    if (!dataIssue.action) {
      errors.push("Aksi harus dipilih");
    }

    return errors;
  };

  const detailGate =
    localActiveCall?.detailGate?.data || localActiveCall?.detailGate || {};
  const locationName = localActiveCall?.location?.Name || "Unknown Location";
  const gateName = localActiveCall?.gate || detailGate.gate || "-";
  const ticketNo =
    detailGate?.transactionNo || localActiveCall?.newData?.transactionNo;
  const inTime = detailGate?.inTime || "-";
  const outTime = detailGate?.outTime || "-";
  const issuerName = detailGate?.issuerName || "-";
  const gracePeriode = detailGate?.gracePeriod || "-";
  const paymentMethod = detailGate?.paymentMethod || "-";
  console.log(detailGate, "<<<<<detailGate");
  

  const fotoInUrl = localActiveCall?.imageFileIn?.trim()
    ? `https://devtest09.skyparking.online/uploads/${localActiveCall?.imageFileIn}`
    : "/images/no-image-found-360x250.png";

  const photoCaptureUrl = localActiveCall?.imageFile?.filename
    ? `https://devtest09.skyparking.online/uploads/${localActiveCall?.imageFile?.filename}`
    : "/images/no-image-found-360x250.png";

  const handleCreateIssue = async () => {
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        toast.error(error);
      });
      return;
    }

    if (isCreateIssue || isOpeningGate || isAddingDescription) {
      toast.error("Proses sedang berlangsung, mohon tunggu...");
      return;
    }

    if (!activeCall) {
      toast.error("Tidak ada panggilan aktif");
      return;
    }

    setIsCreateIssue(true);

    try {
      let finalDescription = selectedDescription;

      if (selectedDescription === "OTHER_MANUAL" && manualDescription.trim()) {
        try {
          setIsAddingDescription(true);
          await handleAddDescription(
            parseInt(selectedCategory),
            manualDescription.trim()
          );
          finalDescription = manualDescription.trim();
          toast.success("Deskripsi baru berhasil ditambahkan");
        } catch (error) {
          console.error("Error adding description:", error);
          toast.error("Gagal menambahkan deskripsi baru");
          return;
        } finally {
          setIsAddingDescription(false);
        }
      }

      const issueData = {
        idCategory: parseInt(selectedCategory),
        idGate: parseInt(activeCall.gateId),
        description: finalDescription,
        action: dataIssue.action || "",
        number_plate: editablePlateNumber,
        TrxNo: ticketNo,
      };

      const response = await addIssue(issueData);

      if (response && response.message.includes("created")) {
        toast.success("Issue berhasil dibuat");

        if (dataIssue.action === "OPEN_GATE") {
          setIsOpeningGate(true);
          await handleOpenGate();
          setIsOpeningGate(false);
        }

        setDataIssue({
          idCategory: 0,
          idGate: 0,
          description: "",
          action: "",
          foto: "",
          number_plate: "",
          TrxNo: "",
        });
      } else {
        toast.error("Gagal membuat issue report");
      }
    } catch (error) {
      console.error("Error create issue:", error);
      toast.error("Terjadi kesalahan saat membuat issue report");
    } finally {
      setIsCreateIssue(false);
      setIsOpeningGate(false);
    }
  };

  const handleSavePlateNumber = () => {
    if (isPlateNumberValid) {
      setIsEditingPlateNumber(false);
      setOriginalPlateNumber(editablePlateNumber);
    } else {
      toast.error("Format plat nomor tidak valid untuk disimpan.");
    }
  };

  const handleCancelEditPlateNumber = () => {
    setEditablePlateNumber(originalPlateNumber);
    setIsPlateNumberValid(true);
    setIsEditingPlateNumber(false);
  };

  if (!activeCall) return null;

  return (
    <>
      <div className="modal fixed inset-0 backdrop-blur-md flex items-center justify-center z-100 p-2">
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl w-full max-w-5xl relative">
          {/* Header Controls - Close Button and Mute Button */}
          <div className="absolute top-4 right-4 z-10 flex space-x-2">
            {/* Mute Ringtone Button */}
            <button
              onClick={handleMuteRingtone}
              className={`cursor-pointer w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                isMuted
                  ? "bg-red-200 hover:bg-red-300 dark:bg-red-600 dark:hover:bg-red-500 text-red-600 dark:text-red-200"
                  : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300"
              } hover:text-gray-800 dark:hover:text-white`}
              title={
                isMuted ? "Nyalakan suara ringtone" : "Matikan suara ringtone"
              }
            >
              {isMuted ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    clipRule="evenodd"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                </svg>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors cursor-pointer"
              title="Tutup modal dan hentikan audio"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-2 pr-16">
            <h2 className="text-base font-semibold text-red-600 mb-1">
              📞 Panggilan Masuk!
            </h2>
            {isMuted && (
              <p className="text-s text-red-500 flex items-center justify-center">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {/* SVG paths unchanged */}
                </svg>
                Ringtone dimatikan
              </p>
            )}
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Left Column - Information */}
            <div className="space-y-1">
              {/* Informasi Transaksi Section */}
              <div className="space-y-1">
                <h3 className="text-base font-semibold border-b pb-1">
                  Informasi Transaksi
                </h3>
                <div className="space-y-1.5 bg-gray-50 dark:bg-gray-700/50 p-1.5 rounded-lg">
                  <div className="flex justify-between items-start">
                    <span className="text-s">Lokasi :</span>
                    <span className="text-gray-600 dark:text-gray-400 flex-1 text-right text-s">
                      {locationName || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between items-start">
                    <span className="text-s">Gate :</span>
                    <span className="text-gray-600 dark:text-gray-400 flex-1 text-right text-s">
                      {gateName}
                    </span>
                  </div>

                  <div className="flex justify-between items-start">
                    <span className="text-s">Nomor Transaksi :</span>
                    <span className="text-gray-600 dark:text-gray-400 flex-1 text-right text-s">
                      {ticketNo || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between items-start">
                    <span className="text-s">Plat Nomor Kendaraan :</span>
                    <div className="flex-1 text-right">
                      {isEditingPlateNumber ? (
                        <>
                          <div className="flex justify-end items-center gap-2">
                            <div className="relative inline-block w-full max-w-[200px]">
                              <input
                                type="text"
                                value={editablePlateNumber}
                                onChange={(e) =>
                                  setEditablePlateNumber(
                                    e.target.value
                                      .toUpperCase()
                                      .replace(/\s/g, "")
                                  )
                                }
                                className={`w-full pr-6 py-2 rounded-lg border-2 text-right shadow-sm focus:outline-none focus:ring-1 transition ${getPlateNumberValidationClass(
                                  editablePlateNumber
                                )} ${
                                  isPlateNumberValid
                                    ? "focus:border-blue-500 focus:ring-blue-500"
                                    : "focus:border-red-500 focus:ring-red-500"
                                }`}
                                placeholder="e.g. B1234XYZ"
                                autoFocus
                              />
                              {/* Indicator validation */}
                              <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
                                {editablePlateNumber.trim() &&
                                  (isPlateNumberValid ? (
                                    <svg
                                      className="w-4 h-4 text-green-500"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      className="w-4 h-4 text-red-500"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  ))}
                              </div>
                            </div>

                            {/* Tombol Search Transaction - hanya untuk pintu keluar */}
                            <button
                              onClick={handleSearchTransaction}
                              disabled={
                                isSearchingTransaction || !isPlateNumberValid
                              }
                              className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Cari data transaksi"
                            >
                              {isSearchingTransaction ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                              ) : (
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                  />
                                </svg>
                              )}
                            </button>

                            <button
                              onClick={handleSavePlateNumber}
                              disabled={!isPlateNumberValid}
                              className="p-1.5 text-green-600 hover:bg-green-100 dark:hover:bg-gray-600 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Simpan"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>

                            <button
                              onClick={handleCancelEditPlateNumber}
                              className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-gray-600 rounded-full"
                              title="Batal"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>

                          {/* Pesan validasi dengan styling yang lebih baik */}
                          {editablePlateNumber.trim() &&
                            !isPlateNumberValid && (
                              <div className="mt-1 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                                <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Format plat nomor tidak valid
                                </p>
                              </div>
                            )}

                          {/* Informasi hasil pencarian transaksi */}
                          {transactionData && (
                            <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                              <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Data transaksi ditemukan
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <span
                            className={`font-mono px-3 py-1 rounded-md text-sm ${
                              isPlateNumberValid
                                ? "text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900/50"
                                : "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50"
                            }`}
                          >
                            {editablePlateNumber || "-"}
                          </span>

                          {/* Status indicator */}
                          {editablePlateNumber && (
                            <div className="flex items-center">
                              {isPlateNumberValid ? (
                                <svg
                                  className="w-4 h-4 text-green-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="w-4 h-4 text-red-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                          )}

                          <button
                            onClick={() => setIsEditingPlateNumber(true)}
                            className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                            title="Edit Plat Nomor"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                              <path
                                fillRule="evenodd"
                                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-start">
                    <span className="text-s">Waktu Masuk :</span>
                    <span className="text-gray-600 dark:text-gray-400 flex-1 text-right text-s">
                      {inTime && inTime !== ""
                        ? formatTanggalLocal(inTime?.toString())
                        : "-"}
                    </span>
                  </div>

                  {!isPMGate && (
                    <div className="flex justify-between items-start">
                      <span className="text-s">Waktu Keluar :</span>
                      <span className="text-gray-600 dark:text-gray-400 flex-1 text-right text-s">
                        {outTime && outTime!== ""
                         ? formatTanggalLocal(outTime?.toString())
                          : "-"}
                      </span>
                    </div>
                  )}

                  {localActiveCall?.isMemberStyle?.Name && (
                    <>
                      <div className="flex justify-between items-start">
                        <span className="text-s">Member Style:</span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              localActiveCall?.isMemberStyle?.Name
                                ? "YES"
                                : "NO"
                            )}`}
                          >
                            {localActiveCall?.isMemberStyle?.Name
                              ? "Yes"
                              : "No"}
                          </span>
                          <button
                            onClick={openModal}
                            className="inline-flex items-center px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors duration-200"
                            title="Lihat detail member"
                          >
                            <Eye size={12} className="mr-1" />
                            Detail
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Informasi Pembayaran Section - Hanya untuk non-PM Gate */}
              {!isPMGate && (
                <div className="space-y-1.5">
                  <h3 className="text-base text-s font-semibold border-b pb-1 text-green-600">
                    <span className="flex items-center gap-1 text-s">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Informasi Pembayaran
                    </span>
                  </h3>

                  <div className="space-y-1 bg-gray-50 dark:bg-gray-700/50 p-1.5 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-s">Status Pembayaran :</span>
                      <span
                        className={`flex-1 text-right font-semibold ${
                          detailGate.paymentStatus === "PAID"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {detailGate.paymentStatus === "PAID" ? (
                          <span className="flex items-center justify-end gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Paid
                          </span>
                        ) : (
                          <span className="flex items-center justify-end gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Unpaid
                          </span>
                        )}
                      </span>
                    </div>

                    {detailGate.paymentStatus === "PAID" && (
                      <>
                        {/* <div className="flex justify-between items-center">
                          <span className="text-s">Waktu Pembayaran :</span>
                          <span className="text-gray-600 dark:text-gray-400 flex-1 text-right text-s">
                            {detailGate.payment_time
                              ? formatTanggalLocal(detailGate.data.paymentTime)
                              : "-"}
                          </span>
                        </div> */}
                        <div className="flex justify-between items-center">
                          <span className="text-s">Metode Pembayaran :</span>
                          <span className="text-gray-600 dark:text-gray-400 flex-1 text-right text-s">
                              {paymentMethod || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-s">Issuer Name :</span>
                          <span className="text-gray-600 dark:text-gray-400 flex-1 text-right text-s">
                            {issuerName || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-s">Grace Periode :</span>
                          <span className="text-gray-600 dark:text-gray-400 flex-1 text-right text-s">
                            {gracePeriode ? gracePeriode+" menit" : "-"}
                          </span>
                        </div>
                      </>
                    )}

                    {/* <div className="flex justify-between items-center">
                    <span className="text-s">Konfirmasi Pembayaran :</span>
                    <span className="text-gray-600 dark:text-gray-400 flex-1 text-right text-s">
                      {detailGate?.payment_confirmation || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-s">Durasi Pembayaran :</span>
                    <span className="text-gray-600 dark:text-gray-400 flex-1 text-right text-s">
                      {detailGate?.payment_duration || "-"}
                    </span>
                  </div> */}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Input Issue */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold border-b pb-1">
                Input Issue
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-s text-s mb-1">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <SearchableSelect
                    options={categoryOptions}
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    placeholder="-- Pilih Kategori --"
                    disabled={isLoadingCategories}
                    className="text-sm"
                    onLoadMore={handleLoadMoreCategories}
                    hasMoreData={categoryPagination.hasMore}
                    isLoadingMore={categoryPagination.isLoadingMore}
                    // onSearch={handleSearchCategories}
                    isSearching={isLoadingCategories}
                    showLoadMoreInfo={true}
                    loadMoreText="Memuat kategori..."
                  />
                  {isLoadingCategories && (
                    <div className="flex items-center mt-1 text-s text-blue-600">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                      Memuat data kategori...
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-s text-s mb-1">
                    Deskripsi <span className="text-red-500">*</span>
                  </label>

                  <SearchableSelect
                    options={descriptionOptions}
                    value={selectedDescription}
                    onChange={(value) => {
                      setSelectedDescription(value);
                      if (value !== "OTHER_MANUAL") {
                        setManualDescription("");
                      }
                    }}
                    placeholder={
                      isLoadingDescriptions
                        ? "Memuat data deskripsi..."
                        : !selectedCategory
                        ? "-- Pilih kategori terlebih dahulu --"
                        : descriptionOptions.length === 0
                        ? "-- Tidak ada deskripsi tersedia --"
                        : "-- Pilih Deskripsi --"
                    }
                    disabled={isLoadingDescriptions || !selectedCategory}
                    className="text-sm"
                  />

                  {/* Manual input field - hanya muncul jika "Other (Input Manual)" dipilih */}
                  {selectedDescription === "OTHER_MANUAL" && (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={manualDescription}
                        onChange={(e) => setManualDescription(e.target.value)}
                        placeholder="Masukkan deskripsi baru..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        autoFocus
                      />
                      {manualDescription.trim() && (
                        <p className="text-s text-blue-600 mt-1">
                          Deskripsi baru akan dibuat: {manualDescription.trim()}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-s text-s mb-2">Aksi</label>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="radio"
                        name="action"
                        value="CREATE_ISSUE"
                        checked={dataIssue.action === "CREATE_ISSUE"}
                        onChange={(e) =>
                          setDataIssue((prev) => ({
                            ...prev,
                            action: e.target.value,
                          }))
                        }
                        className="accent-blue-600 cursor-pointer"
                      />
                      <span>Create Issue</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="radio"
                        name="action"
                        value="OPEN_GATE"
                        checked={dataIssue.action === "OPEN_GATE"}
                        onChange={(e) =>
                          setDataIssue((prev) => ({
                            ...prev,
                            action: e.target.value,
                          }))
                        }
                        className="accent-blue-600 cursor-pointer"
                      />
                      <span>Open Gate</span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons - Updated with proper disable logic */}
                <div className="flex flex-col space-y-1 pt-1">
                  <div className="flex space-x-2 pt-1">
                    <button
                      onClick={endCallFunction}
                      className="cursor-pointer flex-1 px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        await handleCreateIssue();
                        const validationErrors = validateForm();
                        if (validationErrors.length === 0) {
                          endCallFunction();
                        }
                      }}
                      className="cursor-pointer flex-1 px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                      title={
                        dataIssue.action === "OPEN_GATE"
                          ? "Create issue dan buka gate"
                          : "Create issue"
                      }
                    >
                      {isCreateIssue || isOpeningGate
                        ? "Processing..."
                        : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                {showWhatsAppInput ? (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nomor WhatsApp Customer
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
                      <input
                        type="tel"
                        value={whatsappNumber}
                        onChange={handleWhatsAppNumberChange}
                        placeholder="081234567890"
                        className={`block w-full pl-8 pr-12 py-2 text-sm border rounded-md focus:outline-none ${
                          whatsappError
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                        disabled={isSendingWhatsApp}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500">
                          {whatsappNumber.replace(/\D/g, "").length}/15
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSendWhatsApp}
                        disabled={
                          isSendingWhatsApp ||
                          !!whatsappError ||
                          !whatsappNumber.trim()
                        }
                        className={`px-3 py-2 rounded-md text-sm ${
                          isSendingWhatsApp ||
                          !!whatsappError ||
                          !whatsappNumber.trim()
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {isSendingWhatsApp ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Mengirim...
                          </>
                        ) : (
                          "Kirim via WhatsApp"
                        )}
                      </button>
                      <button
                        onClick={() => setShowWhatsAppInput(false)}
                        className="px-3 mr-2 py-2 bg-gray-200 text-gray-700 rounded-md text-sm"
                      >
                        Batal
                      </button>
                    </div>

                    {whatsappError ? (
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {whatsappError}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Format: 08xxxxxxxxx (contoh: 081234567890 /
                        021234567890)
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col space-y-1 pt-1">
                    <div className="flex space-x-2 pt-1">
                      <button
                        onClick={handleCreateTransaction}
                        className="cursor-pointer flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                      >
                        Buat Transaksi
                      </button>
                      <button
                        onClick={() => setShowWhatsAppInput(true)}
                        disabled={!ticketNo}
                        className="cursor-pointer flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                      >
                        Kirim Tiket via WhatsApp
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section - Photos - Enhanced with base64 support */}
          <div className="border-t pt-2">
            {isPMGate ? (
              <div className="flex justify-center">
                <div className="text-center w-full max-w-md">
                  <p className="text-sm text-s mb-2">Foto Capture</p>
                  <div className="w-full aspect-video bg-gray-600 rounded-lg flex items-center justify-center text-white overflow-hidden">
                    {!imageErrors.photoCapture ? (
                      <Image
                        src={photoCaptureUrl}
                        alt="Foto Capture"
                        width={400}
                        height={225}
                        className="w-full h-full object-cover rounded-lg"
                        onError={() => {
                          setImageErrors((prev) => ({
                            ...prev,
                            photoCapture: true,
                          }));
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <svg
                          className="w-12 h-12 text-gray-400 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm">Foto Capture</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // For non-PM gates - show photos in a better grid layout
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Foto In */}
                  <div className="text-center">
                    <p className="text-sm text-s mb-2">Foto In</p>
                    <div className="bg-gray-600 rounded-lg inline-block">
                      {!imageErrors.photoIn ? (
                        <Image
                          src={fotoInUrl}
                          alt="Foto In"
                          width={420}
                          height={220}
                          className="w-[420px] h-[220px] object-cover rounded-lg"
                          onError={() => {
                            setImageErrors((prev) => ({
                              ...prev,
                              photoIn: true,
                            }));
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                          <svg
                            className="w-12 h-12 text-gray-400 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-sm">Foto In</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Foto Capture - Now using base64 image */}
                  <div className="text-center">
                    <p className="text-sm text-s mb-2">
                      Foto Capture
                      {/* {activeCall?.imageFile?.filename && (
                        <span className="text-s text-green-600 ml-1">
                          (Live)
                        </span>
                      )} */}
                    </p>
                    <div className="bg-gray-600 rounded-lg inline-block">
                      {!imageErrors.photoCapture ? (
                        <Image
                          src={photoCaptureUrl}
                          alt="Foto Capture"
                          width={420}
                          height={220}
                          className="w-[420px] h-[220px] object-cover rounded-lg"
                          onError={() => {
                            setImageErrors((prev) => ({
                              ...prev,
                              photoCapture: true,
                            }));
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                          <svg
                            className="w-12 h-12 text-gray-400 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-sm">Foto Capture</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isModalDetailMemberOpen && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-500 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Detail Member
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-4">
              {/* Member Status */}
              {/* <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status Member:
                </span>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    localActiveCall?.isMemberStyle?.Name ? "YES" : "NO"
                  )}`}
                >
                  {localActiveCall?.isMemberStyle?.Name ? "Active" : "Inactive"}
                </span>
              </div> */}

              {/* Member Details */}
              <div className="space-y-3">
                {/* Nama Member */}
                <div className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    <User
                      size={16}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nama Member
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {localActiveCall?.isMemberStyle?.Name || "Tidak tersedia"}
                    </p>
                  </div>
                </div>

                {/* Email Member */}
                <div className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    <Mail
                      size={16}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Member
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white break-all">
                      {localActiveCall?.isMemberStyle?.Email ||
                        "Tidak tersedia"}
                    </p>
                  </div>
                </div>

                {/* Plat Nomor */}
                <div className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    <Car
                      size={16}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Plat Nomor
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {localActiveCall?.isMemberStyle?.PlateNumber ||
                        localActiveCall?.plateNumber ||
                        "Tidak tersedia"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={closeModal}
                className="cursor-pointer px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalDetailCreateTransactionOpen && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-[500] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            {/* Modal Header with countdown */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Berhasil Membuat Transaksi
              </h2>
              <div className="flex items-center gap-2">
                <CountdownCircle
                  duration={3}
                  onComplete={closeModalTransactionSuccess}
                  isActive={isModalDetailCreateTransactionOpen}
                />
                <button
                  onClick={closeModalTransactionSuccess}
                  className="text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-4">
              {transactionSuccessData && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nomor Tiket:
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white font-mono">
                      {transactionSuccessData.transactionNo}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Waktu Masuk:
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatTanggalLocal(transactionSuccessData.inTime)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Plat Nomor:
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white font-mono">
                      {transactionSuccessData.plateNumber}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={closeModalTransactionSuccess}
                className="cursor-pointer px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
