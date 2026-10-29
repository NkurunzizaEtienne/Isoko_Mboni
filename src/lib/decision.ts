import type { DecisionInput, DecisionResult, HorizonResult, ShownOption } from "../types";

const THETA_DEFAULT = 0.6;
const TAU_DEFAULT = 0.1;
const Z_P10_P90 = 2.563; // P10 to P90 spans 2.563 standard deviations

// Standard normal CDF (Abramowitz-Stegun approximation)
function normalCdf(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  const p =
    d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
}

export function decide(input: DecisionInput): DecisionResult {
  const theta = input.minProbability ?? THETA_DEFAULT;
  const tau = input.maxDownsideShare ?? TAU_DEFAULT;
  const P0 = input.priceNow;
  const Q = Math.max(0, input.quantityKg);
  const C = input.storageCostPerMonth;
  const r = input.loanInterestPctYear / 100 / 12; // monthly interest
  const H = Math.max(1, input.maxMonths);
  const L = input.totalLossPct / 100 / H; // loss per month
  const inflYear = input.inflationPctYear ?? 0;

  const all: HorizonResult[] = input.horizons
    .filter((f) => f.months >= 1 && f.months <= H)
    .sort((a, b) => a.months - b.months)
    .map((f) => {
      const h = f.months;
      // Seasonal change (inflation-adjusted in the data) plus the general price rise the user expects
      const infl = Math.pow(1 + inflYear / 100, h / 12);
      const p10 = Math.max(P0 * (1 + f.p10Pct / 100) * infl, 0.01);
      const p50 = Math.max(P0 * (1 + f.p50Pct / 100) * infl, 0.01);
      const p90 = Math.max(P0 * (1 + f.p90Pct / 100) * infl, p10 + 0.01);

      const lossFactor = Math.max(0, 1 - L * h);
      const vSell = P0 * (1 + r * h);                       // (1)
      const vStore = (p: number) => p * lossFactor - C * h; // (2)
      const gain = vStore(p50) - vSell;                     // (3)
      const gainLow = vStore(p10) - vSell;                  // (7)
      const breakEven = lossFactor > 0 ? (vSell + C * h) / lossFactor : Infinity; // (4)

      const sigma = Math.max(Math.log(p90 / p10) / Z_P10_P90, 0.001); // (5)
      const prob =
        lossFactor > 0 && Number.isFinite(breakEven)
          ? 1 - normalCdf((Math.log(breakEven) - Math.log(p50)) / sigma) // (6)
          : 0;

      const passes = gain > 0 && prob >= theta && gainLow >= -tau * vSell; // (8)
      return {
        months: h,
        expectedPrice: p50,
        lowPrice: p10,
        highPrice: p90,
        breakEvenPrice: breakEven,
        gainPerKg: gain,
        gainLowPerKg: gainLow,
        probPays: prob,
        lossShare: 1 - lossFactor,
        passes,
      };
    });

  const byGain = (a: HorizonResult, b: HorizonResult) => b.gainPerKg - a.gainPerKg;
  const best = all.filter((x) => x.passes).sort(byGain)[0] ?? null;
  const closest = [...all].sort(byGain)[0] ?? null;

  // (9) cash split
  const kgSellNow = P0 > 0 && input.cashNeeded ? Math.min(Q, input.cashNeeded / P0) : 0;
  const kgStore = Math.max(0, Q - kgSellNow);

  const storing = best !== null && kgStore > 0;
  const h = best ? best.months : 0;

  // Figures for the option we show: the best one, or the closest one when selling.
  // These are always calculated, so the tiles never show a stuck 0.
  const option = best ?? closest;
  const kgShown = kgStore > 0 ? kgStore : Q;
  const shown: ShownOption = option
    ? {
        option,
        kg: kgShown,
        totalGain: option.gainPerKg * kgShown,
        totalGainLow: option.gainLowPerKg * kgShown,
        kgLost: kgShown * option.lossShare,
        storageCostTotal: C * option.months * kgShown,
        interestCostTotal: P0 * r * option.months * kgShown,
      }
    : {
        option: null,
        kg: kgShown,
        totalGain: 0,
        totalGainLow: 0,
        kgLost: 0,
        storageCostTotal: 0,
        interestCostTotal: 0,
      };

  return {
    verdict: storing ? "store" : "sell",
    best: storing ? best : null,
    closest,
    all,
    kgSellNow,
    kgStore,
    totalGain: storing && best ? best.gainPerKg * kgStore : 0,        // (10)
    totalGainLow: storing && best ? best.gainLowPerKg * kgStore : 0,
    kgLost: storing && best ? kgStore * best.lossShare : 0,
    storageCostTotal: storing ? C * h * kgStore : 0,
    interestCostTotal: storing ? P0 * r * h * kgStore : 0,
    shown,
  };
}