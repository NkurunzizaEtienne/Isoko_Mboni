export interface Crop {
  id: string;
  name: string;
  unit: string;
  markets: string[];
  latest_price: number;
  latest_month: string;
}
export interface CpiInfo {
  source: string;
  reference_month: string;
  change_12m_pct: number;
}
export interface CropsFile {
  generated_at: string;
  data_range: { start: string; end: string };
  cpi?: CpiInfo;
  crops: Crop[];
}
export interface HistoryPoint { month: string; price: number; n: number }
export interface HistorySeries { crop_id: string; market: string; points: HistoryPoint[] }
export interface HistoryFile { series: HistorySeries[] }

export type Confidence = "low" | "medium" | "high";
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
export interface OutlookFile { items: OutlookItem[] }

export interface SeasonalItem {
  crop_id: string; cal_month: number; avg_price: number; index: number; years: number;
}
export interface SeasonalFile { items: SeasonalItem[] }

export interface BacktestItem {
  crop_id: string; method: string; mae_pct: number | null;
  baseline_mae_pct: number | null; n_tests: number;
}
export interface BacktestFile { items: BacktestItem[] }

export interface HorizonForecast {
  months: number;
  p10Pct: number; // low price change vs price now, %
  p50Pct: number; // expected price change, %
  p90Pct: number; // high price change, %
}
export interface DecisionInput {
  priceNow: number;            // P0, RWF/kg at harvest
  quantityKg: number;          // Q
  maxMonths: number;           // longest storage time the farmer accepts (1-6)
  storageCostPerMonth: number; // C, RWF/kg/month
  totalLossPct: number;        // expected total loss over the storage time, %
  loanInterestPctYear: number; // % per year
  inflationPctYear?: number;   // expected general price rise, % per year (default 0)
  horizons: HorizonForecast[]; // one entry per storage month from outlook.json
  cashNeeded?: number;         // RWF needed now (optional)
  minProbability?: number;     // theta, default 0.6
  maxDownsideShare?: number;   // tau, default 0.10
}
export interface HorizonResult {
  months: number;
  expectedPrice: number;   // P50, RWF/kg
  lowPrice: number;        // P10
  highPrice: number;       // P90
  breakEvenPrice: number;  // can be Infinity
  gainPerKg: number;
  gainLowPerKg: number;    // gain if the price is at P10
  probPays: number;        // 0 to 1
  lossShare: number;       // share of the grain lost, 0 to 1
  passes: boolean;
}
export interface ShownOption {
  option: HorizonResult | null; // best option, or the closest one when selling
  kg: number;                   // kg these figures are calculated on
  totalGain: number;            // RWF
  totalGainLow: number;         // RWF, if the price is at the low end
  kgLost: number;
  storageCostTotal: number;     // RWF
  interestCostTotal: number;    // RWF
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