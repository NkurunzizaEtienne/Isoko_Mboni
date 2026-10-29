export interface Crop {
  id: string;
  name: string;
  unit: string;
  markets: string[];
  latest_price: number;
  latest_month: string;
}
export interface CropsFile {
  generated_at: string;
  data_range: { start: string; end: string };
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

export interface DecisionInput {
  priceNow: number;
  expectedChangePct: number;
  lowChangePct: number;
  highChangePct: number;
  lossPct: number;
  storageCostPerMonth: number;
  months: number;
}
export type Verdict = "store" | "sell" | "uncertain";
export interface DecisionResult {
  netExpected: number;
  netLow: number;
  netHigh: number;
  verdict: Verdict;
}