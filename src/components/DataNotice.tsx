
import { labels } from "../labels";
import type { BacktestItem, Confidence, OutlookItem } from "../types";

type DataRange = {
  start: string;
  end: string;
};

type DataNoticeProps = {
  dataRange: DataRange;
  outlook?: OutlookItem;
  backtest?: BacktestItem;
  isUsingNationalFallback: boolean;
  selectedMarket: string;
  hasHistory: boolean;
  historyPoints: number;
};

function formatPct(value: number): string {
  return `${value.toFixed(1)}%`;
}

function confidenceText(confidence: Confidence): string {
  switch (confidence) {
    case "low":
      return labels.data.lowConfidence;
    case "medium":
      return labels.data.mediumConfidence;
    case "high":
      return labels.data.highConfidence;
  }
}

export function DataNotice({
  dataRange,
  outlook,
  backtest,
  isUsingNationalFallback,
  selectedMarket,
  hasHistory,
  historyPoints,
}: DataNoticeProps) {
  const hasComparableBacktest =
    backtest !== undefined &&
    backtest.mae_pct !== null &&
    backtest.baseline_mae_pct !== null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">
        Transparency
      </p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
        {labels.data.title}
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Data range
          </p>
          <p className="mt-2 text-lg font-bold text-slate-950">
            {dataRange.start} — {dataRange.end}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            About 22 months of data
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Selected outlook
          </p>
          {outlook ? (
            <>
              <p className="mt-2 text-lg font-bold capitalize text-slate-950">
                {outlook.confidence} confidence
              </p>
              <p className="mt-1 text-sm leading-5 text-slate-600">
                {outlook.years_of_data} years of data reported by the pipeline
              </p>
            </>
          ) : (
            <>
              <p className="mt-2 text-lg font-bold text-slate-950">
                Not available
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {labels.data.missingCombination}
              </p>
            </>
          )}
          <span
            className="mt-3 inline-flex cursor-help items-center text-xs font-semibold text-emerald-800 underline decoration-dotted underline-offset-4"
            title={labels.data.confidenceTooltip}
            tabIndex={0}
          >
            What does confidence mean?
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Historical coverage
          </p>
          <p className="mt-2 text-lg font-bold text-slate-950">
            {hasHistory ? `${historyPoints} observations` : "No usable history"}
          </p>
          <p className="mt-1 text-sm leading-5 text-slate-600">
            {selectedMarket === labels.nationalAverage
              ? "National series selected"
              : `Market selected: ${selectedMarket}`}
          </p>
        </div>
      </div>

      {outlook && (
        <div className="mt-4 rounded-2xl border border-slate-200 p-4">
          <p className="font-semibold text-slate-900">
            Outlook confidence:{" "}
            <span className="capitalize">{outlook.confidence}</span>
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {confidenceText(outlook.confidence)}
          </p>
        </div>
      )}

      <div className="mt-4 space-y-3">
        <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
          {labels.data.gap}
        </p>

        {isUsingNationalFallback && (
          <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
            {labels.data.fallback}
          </p>
        )}

        {!hasHistory && (
          <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
            {labels.data.noHistory}
          </p>
        )}

        <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700">
          {labels.data.nationalOutlook}
        </p>
      </div>

      {hasComparableBacktest && backtest && (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5">
          <p className="font-semibold text-emerald-950">
            {labels.data.preliminaryTest}
          </p>
          <p className="mt-2 text-sm leading-6 text-emerald-950">
            Average error: {formatPct(backtest.mae_pct!)} compared with{" "}
            {formatPct(backtest.baseline_mae_pct!)} if we assumed no change.
          </p>
          <p className="mt-2 text-xs leading-5 text-emerald-900">
            This is preliminary evidence from past months, not proof that the
            outlook will predict future prices accurately.
          </p>
        </div>
      )}
    </section>
  );
}
