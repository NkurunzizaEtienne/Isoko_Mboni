export type Confidence = "low" | "medium" | "high";

export interface Crop {
  id: string;
  name: string;
  unit: string;
  markets: string[];
  latest_price?: number;
  latest_month?: string;
}

export interface CropsFile {
  generated_at?: string;
  data_range: { start: string; end: string };
  crops: Crop[];
}

export interface HistoryPoint {
  month: string;
  price: number;
  n?: number;
}

export interface HistorySeries {
  crop_id: string;
  market: string;
  points: HistoryPoint[];
}

export interface HistoryFile {
  series: HistorySeries[];
}

export interface OutlookItem {
  crop_id: string;
  harvest_month: number;
  horizon_months: number;
  expected_change_pct: number;
  low_change_pct: number;
  high_change_pct: number;
  confidence: Confidence;
  years_of_data: number;
}

export interface OutlookFile {
  items: OutlookItem[];
}

export interface SeasonalItem {
  crop_id: string;
  cal_month: number;
  avg_price: number;
  index?: number;
  years?: number;
}

export interface SeasonalFile {
  items: SeasonalItem[];
}

export interface BacktestItem {
  crop_id: string;
  method?: string;
  mae_pct: number | null;
  baseline_mae_pct: number | null;
  n_tests?: number;
}

export interface BacktestFile {
  items: BacktestItem[];
}

export interface HorizonForecast {
  months: number;
  p10Pct: number;
  p50Pct: number;
  p90Pct: number;
}

export interface DecisionInput {
  priceNow: number;
  quantityKg: number;
  maxMonths: number;
  storageCostPerMonth: number;
  totalLossPct: number;
  loanInterestPctYear: number;
  horizons: HorizonForecast[];
  cashNeeded?: number;
  minProbability?: number;
  maxDownsideShare?: number;
}

export interface HorizonResult {
  months: number;
  expectedPrice: number;
  lowPrice: number;
  highPrice: number;
  breakEvenPrice: number;
  gainPerKg: number;
  gainLowPerKg: number;
  probPays: number;
  lossShare: number;
  passes: boolean;
}

export interface ShownOption {
  option: HorizonResult | null;
  kg: number;
  totalGain: number;
  totalGainLow: number;
  kgLost: number;
  storageCostTotal: number;
  interestCostTotal: number;
}

export interface DecisionResult {
  verdict: "store" | "sell";
  best: HorizonResult | null;
  closest: HorizonResult | null;
  all: HorizonResult[];
  kgSellNow: number;
  kgStore: number;
  totalGain: number;
  totalGainLow: number;
  kgLost: number;
  storageCostTotal: number;
  interestCostTotal: number;
  shown: ShownOption;
}
