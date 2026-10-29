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
export interface DecisionResult {
  verdict: "store" | "sell";
  best: HorizonResult | null;     // chosen storage time, null when selling now
  closest: HorizonResult | null;  // best-looking option even if it fails the rule
  all: HorizonResult[];
  kgSellNow: number;
  kgStore: number;
  totalGain: number;              // RWF, on the kg stored
  totalGainLow: number;           // RWF, if prices disappoint (P10)
  kgLost: number;
  storageCostTotal: number;       // RWF
  interestCostTotal: number;      // RWF
}