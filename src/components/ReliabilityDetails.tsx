
import { labels } from "../labels";
import type { BacktestItem, HorizonResult, OutlookItem } from "../types";

interface Props {
  outlook: OutlookItem | undefined;
  backtest: BacktestItem | undefined;
  dataRange: { start: string; end: string };
  hasDataGap: boolean;
  option: HorizonResult | null;
  month: string;
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return labels.results.unknown;
  return Math.round(value).toLocaleString("en-US");
}

function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return labels.results.unknown;
  return `${value.toFixed(1)}%`;
}

function probabilityPercent(value: number): number {
  return value >= 0 && value <= 1 ? value * 100 : value;
}

function DetailBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#111b2c] p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <div className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
        {children}
      </div>
    </article>
  );
}

export default function ReliabilityDetails({
  outlook,
  backtest,
  dataRange,
  hasDataGap,
  option,
  month,
}: Props) {
  const confidenceLabel = outlook
    ? labels.reliability[outlook.confidence]
    : labels.reliability.noConfidence;

  const comparableBacktest =
    backtest &&
    backtest.mae_pct !== null &&
    backtest.baseline_mae_pct !== null &&
    Number.isFinite(backtest.mae_pct) &&
    Number.isFinite(backtest.baseline_mae_pct);

  return (
    <div>
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">
          {labels.appName}
        </p>
        <h2
          id="reliability-heading"
          className="mt-2 font-serif text-3xl leading-tight text-white sm:text-4xl"
        >
          {labels.reliability.heading}
        </h2>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <DetailBlock title={labels.reliability.confidence}>
          <div className="flex flex-wrap items-center gap-3">
            <span
              title={labels.reliability.confidenceTooltip}
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                outlook?.confidence === "high"
                  ? "border-teal-300/30 bg-teal-300/10 text-teal-200"
                  : outlook?.confidence === "medium"
                    ? "border-orange-300/30 bg-orange-300/10 text-orange-200"
                    : "border-rose-300/30 bg-rose-300/10 text-rose-200"
              }`}
            >
              {confidenceLabel}
            </span>
            <span className="text-xs text-slate-400">
              {labels.reliability.confidenceTooltip}
            </span>
          </div>
        </DetailBlock>

        <DetailBlock title={labels.reliability.dataBehind}>
          <p>
            <span className="text-slate-400">{labels.reliability.dataRange}: </span>
            <span className="text-white">{dataRange.start} — {dataRange.end}</span>
          </p>
          {outlook && (
            <p>
              {labels.reliability.observations.replace(
                "{count}",
                formatNumber(outlook.years_of_data),
              )}
            </p>
          )}
          {hasDataGap && (
            <p className="text-orange-200">{labels.reliability.dataGap}</p>
          )}
        </DetailBlock>

        <DetailBlock title={labels.reliability.chance}>
          {option ? (
            <>
              <p className="font-serif text-3xl text-teal-200">
                {formatPercent(probabilityPercent(option.probPays))}
              </p>
              <p>
                {labels.reliability.chanceDetail
                  .replace("{month}", month)
                  .replace("{low}", formatNumber(option.lowPrice))
                  .replace("{high}", formatNumber(option.highPrice))}
              </p>
            </>
          ) : (
            <p>{labels.results.missing}</p>
          )}
        </DetailBlock>

        {comparableBacktest && backtest && (
          <DetailBlock title={labels.reliability.tested}>
            <p>
              {labels.reliability.backtest
                .replace("{error}", formatPercent(backtest.mae_pct as number))
                .replace("{baseline}", formatPercent(backtest.baseline_mae_pct as number))}
            </p>
          </DetailBlock>
        )}

        <DetailBlock title={labels.reliability.limits}>
          <ul className="list-disc space-y-2 pl-5 marker:text-teal-300">
            <li>{labels.reliability.limitNational}</li>
            <li>{labels.reliability.limitCosts}</li>
            <li>{labels.reliability.limitRange}</li>
            <li>{labels.reliability.limitData}</li>
          </ul>
        </DetailBlock>

        <DetailBlock title={labels.reliability.calculation}>
          <ol className="list-decimal space-y-2 pl-5 marker:text-teal-300">
            <li>{labels.reliability.calcSell}</li>
            <li>{labels.reliability.calcStore}</li>
            <li>{labels.reliability.calcGain}</li>
            <li>{labels.reliability.calcBreakEven}</li>
            <li>{labels.reliability.calcChance}</li>
            <li>{labels.reliability.calcRule}</li>
          </ol>
        </DetailBlock>
      </div>
    </div>
  );
}
