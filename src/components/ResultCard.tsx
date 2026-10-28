
import type { DecisionView } from "../App";
import { labels } from "../labels";

type Props = {
  decision: DecisionView;
  cropName: string;
  storageCost: number;
  lossPct: number;
};

function formatRwf(value: number): string {
  return `${value < 0 ? "−" : ""}${Math.abs(value).toLocaleString(
    "en-RW",
    { maximumFractionDigits: 1 },
  )}`;
}

export default function ResultCard({
  decision,
  cropName,
  storageCost,
  lossPct,
}: Props) {
  if (!decision.enoughData || decision.netPerKg === null) {
    return (
      <section className="result-card result-insufficient">
        <p className="eyebrow">STEP 02 · RESULT</p>
        <h2>{labels.notEnough}</h2>
        <p>{labels.noOutlook}</p>
        <p className="muted">
          Try another crop, market or storage period if data is available.
        </p>
      </section>
    );
  }

  const isStore = decision.verdict === "store";
  const isPositive = decision.netPerKg > 0;

  return (
    <section className={`result-card ${isStore ? "result-store" : "result-sell"}`}>
      <div className="result-topline">
        <p className="eyebrow">{labels.resultTitle}</p>
        <span className={`verdict-pill ${isStore ? "positive" : "caution"}`}>
          {isStore ? labels.store : labels.sellNow}
        </span>
      </div>

      <h2>
        {isStore
          ? `Consider storing ${decision.months} months`
          : "Selling now may be better"}
      </h2>

      <p className="result-description">
        {isStore
          ? `The estimate favors storage for ${cropName.toLowerCase()}, under your assumptions.`
          : `The estimated return from storage does not exceed the current reference price after the costs you entered.`}
      </p>

      <div className="net-value">
        <span>{labels.estimatedNet}</span>
        <strong className={isPositive ? "positive-text" : "negative-text"}>
          {isPositive ? "+" : ""}
          {formatRwf(decision.netPerKg)}
          <small> RWF/kg</small>
        </strong>
      </div>

      <div className="result-metrics">
        <div>
          <span>{labels.currentPrice}</span>
          <strong>
            {decision.currentPrice === null
              ? "—"
              : `${formatRwf(decision.currentPrice)} RWF/kg`}
          </strong>
        </div>
        <div>
          <span>Estimated price after storage</span>
          <strong>
            {decision.expectedPrice === null
              ? "—"
              : `${formatRwf(decision.expectedPrice)} RWF/kg`}
          </strong>
        </div>
        <div>
          <span>Storage cost entered</span>
          <strong>{formatRwf(storageCost)} RWF/kg/mo</strong>
        </div>
        <div>
          <span>Expected quantity loss</span>
          <strong>{lossPct}%</strong>
        </div>
      </div>

      {decision.lowPrice !== null && decision.highPrice !== null && (
        <div className="price-range">
          <span>Estimated future price range</span>
          <strong>
            {formatRwf(decision.lowPrice)}–{formatRwf(decision.highPrice)} RWF/kg
          </strong>
          <p>
            This range represents uncertainty in the price estimate. It is
            not a guarantee of the price you will receive.
          </p>
        </div>
      )}

      <p className="result-disclaimer">
        This is a decision aid, not a promise of profit. Verify local prices
        and actual storage costs before acting.
      </p>
    </section>
  );
}
