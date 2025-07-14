/* eslint-disable @typescript-eslint/no-explicit-any */
export interface LocationInfo {
  Code: string;
  Name: string;
}

export interface TransactionData {
  id: number;
  TransactionNo: string;
  InTime: string;
  OutTime: string;
  VehicleType: string;
  TariffAmount: string;
  PaymentStatus: string;
  GateInCode: string;
  GateOutCode: string;
  Duration: number;
  QRTicket: string;
  LicensePlateIn: string;
  LicensePlateOut: string;
  LocationCode: string;
  IssuerID: string;
  issuerInfo: {
    issuerId: string;
    issuerName: string;
    IssuerLongName: string;
  } | null;
  gracePeriod?: number;
  paymentMethod?: string;
  locationInfo: {
    Code: string;
    Name: string;
  };
}

export interface TransactionResponse {
  code: number;
  message: string;
  data: TransactionData;
}

export const fetchTransaction = async (
  keyword: string,
  locationCode: string,
  date: string
) => {
  try {
    const formattedDate = date;

    const response = await fetch(
      `/api/transaction/find-transaction?keyword=${keyword}&locationCode=${locationCode}&date=${formattedDate}`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data: TransactionResponse = await response.json();

    if (data.data && typeof data.data === "object") {
      return data;
    } else {
      throw new Error("Format data tidak valid");
    }
  } catch (err) {
    console.error("Error fetching transaction: ", err);
    throw err;
  }
};


export interface NewTransactionData {
  responseStatus: string;
  responseCode: string;
  responseDescription: string;
  messageDetail: string;
  data: {
    transactionNo: string;
    transactionStatus: string;
    inTime: string;
    duration: number;
    tariff: number;
    vehicleType: string;
    outTime: string;
    gracePeriod: number;
    location: string;
    paymentStatus: string;
    tariffParking: number;
    plateNumber: string;
    paymentTime: string;
    paymentMethod: string;
    issuerName: string;
    issuerCode: string;
  }
}

export interface NewTransactionResponse {
  success: string;
  message: string;
  data: NewTransactionData;
}

export const fetchNewTransaction = async (
  plateNumber: string,
  locationCode: string | number,
) => {
  try {
    const response = await fetch(
      `/api/message/getTransactionPOST?plateNumber=${plateNumber}&locationId=${locationCode}`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data: NewTransactionResponse = await response.json();

    if (data.data && typeof data.data === "object") {
      return data;
    } else {
      throw new Error("Format data tidak valid");
    }
  } catch (err) {
    console.error("Error fetching transaction: ", err);
    throw err;
  }
};

// export interface SendWhatsAppResponse {
//   success: boolean;
//   message: string;
//   result: {
//     detail: string;
//     id: string[];
//     process: string;
//     quota: {
//       [key: string]: {
//         details: string;
//         quota: number;
//         remaining: number;
//         used: number;
//       };
//     };
//     requestid: number;
//     status: boolean;
//     target: string[];
//   };
// }
export interface SendWhatsAppRequest {
  numberWhatsapp: string;
  plate_number: string;
  no_transaction: string;
}

export const sendWhatsApp = async (data: any) => {
  try {
    const response = await fetch("/api/message/send-whatsapp", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal mengirim pesan whatsapp");
    }

    return await response.json();
  } catch (error) {
    console.error("Error send whatsapp message: ", error);
    throw error;
  }
};

export const generateTicket = async (
  noTransaction: string,
  idLocation: string | number,
) => {
  try {
    const response = await fetch(
      `/api/message/generate-ticket?noTransaction=${noTransaction}&idLocation=${idLocation}`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    if (data.data && typeof data.data === "object") {
      return data;
    } else {
      throw new Error("Format data tidak valid");
    }
  } catch (err) {
    console.error("Error generate transaction: ", err);
    throw err;
  }
};