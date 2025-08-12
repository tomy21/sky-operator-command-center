export interface CallData {
  call: number;
  noAnswer: number;
  doublePush: number;
}

export interface TimeSlotData {
  hour: string;
  hpm: CallData;
  lku: CallData;
  lmp: CallData;
  pv: CallData;
  spark: CallData;
  picon: CallData;
  ml: CallData;
  lmn: CallData;
  shlv: CallData;
  shkj: CallData;
  shkd: CallData;
  uph: CallData;
  helipad: CallData;
}

export interface MonthlyData {
  [key: string]: TimeSlotData[];
}

export interface YearlyData {
  [key: string]: MonthlyData;
}

export interface Location {
  key: string;
  label: string;
  region: string;
}

export const allLocations: Location[] = [
  { key: "hpm", label: "HPM", region: "Region 1" },
  { key: "lku", label: "LKU", region: "Region 1" },
  { key: "lmp", label: "LMP", region: "Region 2" },
  { key: "pv", label: "PV", region: "Region 2" },
  { key: "spark", label: "SPARK", region: "Region 3" },
  { key: "picon", label: "PICON", region: "Region 3" },
  { key: "ml", label: "ML", region: "Region 4" },
  { key: "lmn", label: "LMN", region: "Region 4" },
  { key: "shlv", label: "SHLV", region: "Region 5" },
  { key: "shkj", label: "SHKJ", region: "Region 5" },
  { key: "shkd", label: "SHKD", region: "Region 5" },
  { key: "uph", label: "UPH", region: "Region 1" },
  { key: "helipad", label: "HELIPAD", region: "Region 2" },
];

export const generateTimeSlots = (): string[] => {
  const slots = [];
  for (let i = 0; i < 24; i++) {
    const startHour = i.toString().padStart(2, "0");
    const endHour = ((i + 1) % 24).toString().padStart(2, "0");
    slots.push(`${startHour}:00-${endHour}:00`);
  }
  return slots;
};

export const mockYearlyData: YearlyData = {
  "2024": {
    january: generateMockDataForMonth(),
    february: generateMockDataForMonth(),
    march: generateMockDataForMonth(),
    april: [
      {
        hour: "00:00-01:00",
        hpm: { call: 5, noAnswer: 2, doublePush: 1 },
        lku: { call: 3, noAnswer: 1, doublePush: 0 },
        lmp: { call: 2, noAnswer: 2, doublePush: 0 },
        pv: { call: 7, noAnswer: 3, doublePush: 1 },
        spark: { call: 1, noAnswer: 0, doublePush: 0 },
        picon: { call: 4, noAnswer: 1, doublePush: 2 },
        ml: { call: 6, noAnswer: 2, doublePush: 0 },
        lmn: { call: 2, noAnswer: 1, doublePush: 1 },
        shlv: { call: 8, noAnswer: 4, doublePush: 2 },
        shkj: { call: 3, noAnswer: 0, doublePush: 0 },
        shkd: { call: 5, noAnswer: 2, doublePush: 1 },
        uph: { call: 1, noAnswer: 1, doublePush: 0 },
        helipad: { call: 2, noAnswer: 0, doublePush: 0 },
      },
      {
        hour: "01:00-02:00",
        hpm: { call: 3, noAnswer: 1, doublePush: 0 },
        lku: { call: 2, noAnswer: 0, doublePush: 0 },
        lmp: { call: 1, noAnswer: 1, doublePush: 0 },
        pv: { call: 4, noAnswer: 2, doublePush: 1 },
        spark: { call: 0, noAnswer: 0, doublePush: 0 },
        picon: { call: 2, noAnswer: 0, doublePush: 1 },
        ml: { call: 3, noAnswer: 1, doublePush: 0 },
        lmn: { call: 1, noAnswer: 0, doublePush: 0 },
        shlv: { call: 5, noAnswer: 2, doublePush: 1 },
        shkj: { call: 2, noAnswer: 0, doublePush: 0 },
        shkd: { call: 3, noAnswer: 1, doublePush: 0 },
        uph: { call: 0, noAnswer: 0, doublePush: 0 },
        helipad: { call: 1, noAnswer: 0, doublePush: 0 },
      },
    ],
    may: generateMockDataForMonth(),
    june: generateMockDataForMonth(),
    july: generateMockDataForMonth(),
    august: generateMockDataForMonth(),
    september: generateMockDataForMonth(),
    october: generateMockDataForMonth(),
    november: generateMockDataForMonth(),
    december: generateMockDataForMonth(),
  },
  "2023": generateMockYearData(),
  "2022": generateMockYearData(),
  "2025": generateMockYearData(),
};

function generateMockDataForMonth(): TimeSlotData[] {
  const timeSlots = generateTimeSlots();
  return timeSlots.map(hour => ({
    hour,
    hpm: generateRandomCallData(),
    lku: generateRandomCallData(),
    lmp: generateRandomCallData(),
    pv: generateRandomCallData(),
    spark: generateRandomCallData(),
    picon: generateRandomCallData(),
    ml: generateRandomCallData(),
    lmn: generateRandomCallData(),
    shlv: generateRandomCallData(),
    shkj: generateRandomCallData(),
    shkd: generateRandomCallData(),
    uph: generateRandomCallData(),
    helipad: generateRandomCallData(),
  }));
}

function generateMockYearData(): MonthlyData {
  return {
    january: generateMockDataForMonth(),
    february: generateMockDataForMonth(),
    march: generateMockDataForMonth(),
    april: generateMockDataForMonth(),
    may: generateMockDataForMonth(),
    june: generateMockDataForMonth(),
    july: generateMockDataForMonth(),
    august: generateMockDataForMonth(),
    september: generateMockDataForMonth(),
    october: generateMockDataForMonth(),
    november: generateMockDataForMonth(),
    december: generateMockDataForMonth(),
  };
}

function generateRandomCallData(): CallData {
  return {
    call: Math.floor(Math.random() * 10),
    noAnswer: Math.floor(Math.random() * 5),
    doublePush: Math.floor(Math.random() * 3),
  };
}