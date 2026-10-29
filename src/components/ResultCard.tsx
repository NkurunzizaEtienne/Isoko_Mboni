
import { labels } from "../labels";
import type { DecisionResult, OutlookItem } from "../types";

type ResultCardProps = {
  decision?: DecisionResult;
  outlook?: OutlookItem;
  cropName: string;
  months: number;
  missingOutlook: boolean;
  invalidInputs: boolean;
};

function formatRwf(value: number): string {
  return new Intl.NumberFormat("en-RW", {
    maximumFractionDigits: 1,
  }).format(value);
}

export function ResultCard({
  decision,
  outlook,
  cropName,
  months,
  missingOutlook,
  invalidInputs,
}: ResultCardProps) {
  const cardClass =
    "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7";

  if (missingOutlook || !outlook) {
    return (
      <section className={cardClass}>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">
          Decision result
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
          {labels.results.title}
        </h2>
        <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 sm:p-5">
          <p className="text-lg font-bold text-amber-950">
            {labels.results.missingOutlook}
          </p>
          <p className="mt-2 text-sm leading-6 text-amber-950">
            {labels.results.missingOutlookDetail}
          </p>
        </div>
        <p className="mt-4 text-sm text-slate-600">
          {cropName} · {months} {months === 1 ? "month" : "months"} of storage
        </p>
      </section>
    );
  }

  if (invalidInputs || !decision) {
    return (
      <section className={cardClass}>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">
          Decision result
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
          {labels.results.title}
        </h2>
        <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 sm:p-5">
          <p className="text-lg font-bold text-amber-950">
            {labels.results.invalidInputs}
          </p>
          <p className="mt-2 text-sm leading-6 text-amber-950">
            {labels.results.invalidInputsDetail}
          </p>
        </div>
      </section>
    );
  }

  const verdictContent = {
    store: {
      title: "Store it",
      detail: `Expected gain about ${formatRwf(decision.netExpected)} RWF/kg`,
      style: "border-emerald-300 bg-emerald-50 text-emerald-950",
      marker: "STORE",
    },
    sell: {
      title: "Sell now",
      detail: "Storing is unlikely to pay",
      style: "border-red-300 bg-red-50 text-red-950",
      marker: "SELL",
    },
    uncertain: {
      title: "Too close to call",
      detail: "The estimate does not clearly favour storing or selling.",
      style: "border-amber-300 bg-amber-50 text-amber-950",
      marker: "UNCERTAIN",
    },
  }[decision.verdict];

  return (
    <section className={cardClass}>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">
        Decision result
      </p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
        {labels.results.title}
      </h2>

      <div className={`mt-5 rounded-2xl border p-5 sm:p-6 ${verdictContent.style}`}>
        <p className="text-xs font-extrabold tracking-[0.16em]">
          {verdictContent.marker}
        </p>
        <h3 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
          {verdictContent.title}
        </h3>
        <p className="mt-2 text-base font-semibold leading-6">
          {verdictContent.detail}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-600">
            {labels.results.expected}
          </p>
          <p className="mt-2 break-words text-2xl font-black tabular-nums text-slate-950">
            {decision.netExpected > 0 ? "+" : ""}
            {formatRwf(decision.netExpected)}
          </p>
          <p className="mt-1 text-xs text-slate-500">RWF/kg</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-600">
            {labels.results.range}
          </p>
          <p className="mt-2 break-words text-xl font-bold tabular-nums text-slate-950">
            {formatRwf(decision.netLow)} to {formatRwf(decision.netHigh)}
          </p>
          <p className="mt-1 text-xs text-slate-500">RWF/kg</p>
        </div>
      </div>

      <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-600">
        <p>
          <span className="font-semibold text-slate-800">Crop:</span> {cropName}
        </p>
        <p>
          <span className="font-semibold text-slate-800">Storage period:</span>{" "}
          {months} {months === 1 ? "month" : "months"}
        </p>
        <p>
          <span className="font-semibold text-slate-800">Outlook confidence:</span>{" "}
          <span className="capitalize">{outlook.confidence}</span>
        </p>
        <p>{labels.results.nationalNotice}</p>
      </div>
    </section>
  );
}
