import type { DecisionInput, DecisionResult, Verdict } from "../types";

export function decide(i: DecisionInput): DecisionResult {
  const net = (changePct: number): number =>
    i.priceNow * (1 + changePct / 100) * (1 - i.lossPct / 100) -
    i.storageCostPerMonth * i.months -
    i.priceNow;

  const netExpected = net(i.expectedChangePct);
  const netLow = net(i.lowChangePct);
  const netHigh = net(i.highChangePct);

  let verdict: Verdict = "uncertain";
  if (netLow > 0) verdict = "store";
  else if (netHigh <= 0) verdict = "sell";

  return { netExpected, netLow, netHigh, verdict };
}