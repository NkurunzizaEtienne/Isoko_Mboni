
export type Crop = {
  id: string;
  name: string;
  unit: "kg";
  markets: string[];
  latest_price: number;
  latest_month: string;
};

export type CropData = {
  generated_at: string;
  data_range: { start: string; end: string };
  crops: Crop[];
};

export type HistoryPoint = {
  month: string;
  price: number;
  n: number;
};

export type HistorySeries = {
  crop_id: string;
  market: string;
  points: HistoryPoint[];
};

export type HistoryData = { series: HistorySeries[] };

export type OutlookItem = {
  crop_id: string;
  harvest_month: number;
  horizon_months: number;
  expected_change_pct: number;
  low_change_pct: number;
  high_change_pct: number;
  confidence: "low" | "medium" | "high";
  years_of_data: number;
};

export type OutlookData = { items: OutlookItem[] };

export type SeasonalData = {
  items: {
    crop_id: string;
    cal_month: number;
    avg_price: number;
    index: number;
    years: number;
  }[];
};

export type BacktestData = {
  items: {
    crop_id: string;
    method: string;
    mae_pct: number;
    baseline_mae_pct: number;
    n_tests: number;
  }[];
};

const months = [
  "2023-06", "2023-07", "2023-08", "2023-09",
  "2023-10", "2023-11", "2023-12", "2024-01",
  "2024-02", "2024-03", "2024-04", "2024-05",
  "2024-06", "2024-07", "2024-08", "2024-09",
  "2024-10", "2024-11", "2024-12", "2025-01",
  "2025-02", "2025-03", "2025-04", "2025-05",
  "2025-06", "2025-07", "2025-08", "2025-09",
  "2025-10", "2025-11", "2025-12", "2026-01",
  "2026-02", "2026-03", "2026-04", "2026-05",
  "2026-06", "2026-07", "2026-08", "2026-09",
  "2026-10",
];

const beanPrices = [
  510, 520, 535, 550, 540, 530, 515, 500, 490, 480,
  470, 465, 475, 490, 505, 520, 530, 515, 500, 485,
  470, 455, 440, 450, 465, 480, 495, 510, 520, 505,
  490, 475, 460, 445, 435, 450, 465, 480, 495, 510, 520,
];

const potatoPrices = [
  280, 290, 300, 315, 305, 295, 285, 275, 270, 265,
  260, 270, 280, 295, 310, 320, 315, 305, 295, 285,
  275, 265, 255, 260, 275, 290, 305, 315, 325, 310,
  300, 290, 280, 270, 265, 275, 285, 295, 305, 315, 320,
];

const maizePrices = [
  350, 360, 370, 365, 355, 345, 335, 325, 315, 305,
  300, 310, 320, 330, 340, 350, 345, 335, 325, 315,
  305, 295, 290, 300, 310, 320, 330, 340, 350, 345,
  335, 325, 315, 305, 300, 310, 320, 330, 340, 350, 355,
];

export const mockCrops: CropData = {
  generated_at: "2026-10-28T00:00:00Z",
  data_range: { start: "2023-06", end: "2026-10" },
  crops: [
    {
      id: "beans",
      name: "Beans",
      unit: "kg",
      markets: ["national", "Musanze", "Kigali"],
      latest_price: 520,
      latest_month: "2026-10",
    },
    {
      id: "potatoes",
      name: "Irish potatoes",
      unit: "kg",
      markets: ["national", "Musanze", "Rubavu"],
      latest_price: 320,
      latest_month: "2026-10",
    },
    {
      id: "maize",
      name: "Maize",
      unit: "kg",
      markets: ["national", "Kigali", "Huye"],
      latest_price: 355,
      latest_month: "2026-10",
    },
  ],
};

export const mockHistory: HistoryData = {
  series: [
    ...[
      ["beans", "national", beanPrices],
      ["potatoes", "national", potatoPrices],
      ["maize", "national", maizePrices],
    ].map(([crop, market, prices]) => ({
      crop_id: crop as string,
      market: market as string,
      points: months.map((month, i) => ({
        month,
        price: (prices as number[])[i],
        n: 18,
      })),
    })),
    ...[
      ["beans", "Musanze", beanPrices.map((p) => p * 1.02)],
      ["beans", "Kigali", beanPrices.map((p) => p * 1.06)],
      ["potatoes", "Musanze", potatoPrices.map((p) => p * 1.04)],
      ["potatoes", "Rubavu", potatoPrices.map((p) => p * 0.98)],
      ["maize", "Kigali", maizePrices.map((p) => p * 1.03)],
      ["maize", "Huye", maizePrices.map((p) => p * 0.97)],
    ].map(([crop, market, prices]) => ({
      crop_id: crop as string,
      market: market as string,
      points: months.map((month, i) => ({
        month,
        price: Math.round((prices as number[])[i]),
        n: 6,
      })),
    })),
  ],
};

export const mockOutlook: OutlookData = {
  items: [
    ...["beans", "potatoes", "maize"].flatMap((crop) =>
      Array.from({ length: 12 }, (_, index) => {
        const harvestMonth = index + 1;
        const seasonalChange = [0, 2, 5, 8, 4, -2, -5, -3, 1, 4, 2, -1][index];

        return Array.from({ length: 6 }, (_, horizonIndex) => {
          const horizon = horizonIndex + 1;
          const expected = seasonalChange * Math.min(horizon / 3, 1);

          return {
            crop_id: crop,
            harvest_month: harvestMonth,
            horizon_months: horizon,
            expected_change_pct: expected,
            low_change_pct: expected - 8,
            high_change_pct: expected + 8,
            confidence: "low" as const,
            years_of_data: 3,
          };
        });
      }).flat(),
    ),
  ],
};

export const mockSeasonal: SeasonalData = {
  items: ["beans", "potatoes", "maize"].flatMap((crop) =>
    Array.from({ length: 12 }, (_, i) => ({
      crop_id: crop,
      cal_month: i + 1,
      avg_price: 300 + i * 5,
      index: 0.85 + i * 0.025,
      years: 3,
    })),
  ),
};

export const mockBacktest: BacktestData = {
  items: [
    {
      crop_id: "beans",
      method: "Historical seasonality",
      mae_pct: 18,
      baseline_mae_pct: 16,
      n_tests: 12,
    },
    {
      crop_id: "potatoes",
      method: "Historical seasonality",
      mae_pct: 20,
      baseline_mae_pct: 17,
      n_tests: 12,
    },
    {
      crop_id: "maize",
      method: "Historical seasonality",
      mae_pct: 17,
      baseline_mae_pct: 15,
      n_tests: 12,
    },
  ],
};
