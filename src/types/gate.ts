export interface Location {
  Name: string;
}

export interface GateStatusUpdate {
  plateNumber: string;
  gate: string;
  gateId: string;
  codeGate: string;
  gateStatus: string;
  // photoIn?: string;
  // photoOut?: string;
  // capture?: string
  // imageBase64?: string;
  location: {
    Name: string;
    Code: string;
    id: string | number;
  };
  imageFileIn: string;
  imageFile: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
  };
  detailGate: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    id: number;
    ticket: string;
    gate: string;
    lokasi: string;
    foto_in: string;
    number_plate: string;
    payment_status: string;
    payment_method: string;
    issuer_name: string;
    payment_time: string;
  };
  isMemberStyle: {
    PlateNumber: string;
    Name: string;
    Email: string;
  }
  newData?: {
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

export interface CallEndResponse {
  success: boolean;
  message: string;
}
