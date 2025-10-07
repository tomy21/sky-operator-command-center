/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { endCall } from "@/hooks/useIOT";
import { GlobalCallPopup } from "@/components/GlobalCallPopup";

interface SocketContextType {
  socket: any;
  connectionStatus: string;
  activeCall: GateStatusUpdate | null;
  setActiveCall: (call: GateStatusUpdate | null) => void;
  userNumber: number | null;
  setUserNumber: (num: number) => void;
  endCallFunction: () => void;
  muteRingtone?: () => void;
  unmuteRingtone?: () => void;
}

const SocketContext = createContext<SocketContextType>({
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
  const socket = useSocket();
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [activeCall, setActiveCall] = useState<GateStatusUpdate | null>(null);
  const [userNumber, setUserNumberState] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const [roleActive, setRoleActive] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [, setCallInTime] = useState<Date | null>(null);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUserNumber = localStorage.getItem("admin_user_number");
      const roleActive = localStorage.getItem("role");
      if (savedUserNumber) {
        setUserNumberState(parseInt(savedUserNumber));
      }
      if (roleActive) {
        setRoleActive(Number(roleActive));
      }
      if (isDesktop) {
        setAudio(new Audio("/sound/sound-effect-old-phone-191761.mp3"));
      }
    }
  }, [isDesktop, roleActive]);

  const setUserNumber = (num: number) => {
    setUserNumberState(num);
    localStorage.setItem("admin_user_number", num.toString());

    if (socket && isDesktop && roleActive === 1) {
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
      console.error("Error ending call");
      toast.error("Gagal mengakhiri panggilan");
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      setConnectionStatus("Connected");
      if (userNumber && isDesktop && roleActive === 1) {
        socket.emit("register", userNumber);
      }
    };

    const handleDisconnect = () => {
      setConnectionStatus("Disconnected");
      setActiveCall(null);
      setCallInTime(null);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };

    const handleGateStatusUpdate = (data: GateStatusUpdate) => {
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
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (isDesktop) {
      socket.on("gate-status-update", handleGateStatusUpdate);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      if (isDesktop) {
        socket.off("gate-status-update", handleGateStatusUpdate);
      }
    };
  }, [socket, userNumber, audio, isDesktop, roleActive]);

  const contextValue: SocketContextType = {
    socket,
    connectionStatus: isDesktop ? connectionStatus : "Disabled (Mobile)",
    activeCall: isDesktop ? activeCall : null,
    setActiveCall,
    userNumber,
    setUserNumber,
    endCallFunction,
    muteRingtone,
    unmuteRingtone,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
      {isDesktop && roleActive !== 1 && <GlobalCallPopup />}
    </SocketContext.Provider>
  );
}
