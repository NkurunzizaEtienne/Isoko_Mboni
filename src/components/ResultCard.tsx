
import { labels, SELL_NOW_RW } from "../labels";
import type { DecisionResult } from "../types";

interface Props {
  result: DecisionResult | null;
  month: string;
  quantityKg: number;
  priceNow: number;
  hasOutlook: boolean;
  validInputs: boolean;
  reliablePattern: boolean;
  onDetailsClick: () => void;
}

function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}


export default function ResultCard({
  result,
  month,
  priceNow,
  hasOutlook,
  validInputs,
  reliablePattern,
  onDetailsClick,
}: Props) {
  const isStore = result?.verdict === "store";
  const totalGain = result?.totalGain;
  const safeToDisplayGain =
    typeof totalGain === "number" && Number.isFinite(totalGain);

  let summary = "";

  if (result && isStore && safeToDisplayGain) {
    summary = labels.results.storeSummary
      .replace("{gain}", formatNumber(totalGain))
      .replace("{quantity}", formatNumber(result.kgStore))
      .replace("{month}", month);
  } else if (result && !isStore) {
    summary = labels.results.sellSummary;
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-[#111b2c] shadow-2xl shadow-black/10">
      <div
        className={`h-1.5 ${
          isStore ? "bg-teal-300" : result ? "bg-[#ff817a]" : "bg-slate-700"
        }`}
      />
      <div className="p-5 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          {labels.results.heading}
        </p>

        {!hasOutlook ? (
          <div className="mt-5">
            <h2 className="font-serif text-3xl text-white sm:text-4xl">
              {labels.results.missing}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              {labels.results.missingDetail}
            </p>
          </div>
        ) : !validInputs || !result ? (
          <div className="mt-5">
            <h2 className="font-serif text-3xl text-white sm:text-4xl">
              {labels.results.unknown}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              {labels.inputs.priceRequired}
            </p>
          </div>
        ) : (
          <>
            {isStore && (
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-teal-200">
                {labels.results.storeEyebrow}
              </p>
            )}
            <h2
              className={`mt-1 font-serif text-5xl leading-none tracking-tight sm:text-7xl ${
                isStore ? "text-teal-200" : "text-[#ff817a]"
              }`}
            >
              {isStore ? labels.results.storeTitle : labels.results.sellTitle}
            </h2>
            {!isStore && SELL_NOW_RW !== "" && (
              <p className="mt-2 text-sm text-slate-300">{SELL_NOW_RW}</p>
            )}

            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">
              {summary}
            </p>

            {isStore && result.kgSellNow > 0 && (
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {labels.results.cashSummary.replace(
                  "{quantity}",
                  formatNumber(result.kgSellNow),
                )}
              </p>
            )}

            {!isStore && result.closest && (
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {labels.results.closest.replace("{month}", month)}
              </p>
            )}

            {result.best &&
              (!Number.isFinite(result.best.breakEvenPrice) ||
                !Number.isFinite(result.best.expectedPrice)) && (
                <p role="status" className="mt-4 text-sm text-orange-200">
                  {labels.results.noCover}
                </p>
              )}

            {Number.isFinite(priceNow) && priceNow > 0 && (
              <p className="mt-3 text-xs text-slate-500">
                {labels.results.estimate}
              </p>
            )}
          </>
        )}

        <div className="mt-6 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onDetailsClick}
            className="text-sm font-semibold text-teal-200 underline decoration-teal-200/40 underline-offset-4 transition hover:text-teal-100"
          >
            {labels.results.detailsLink}
          </button>
          {reliablePattern && hasOutlook && (
            <p className="mt-3 text-sm leading-6 text-orange-200">
              {labels.results.noReliablePattern}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
