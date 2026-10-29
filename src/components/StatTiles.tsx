
import { labels } from "../labels";
import type { DecisionResult, HorizonResult } from "../types";

interface Props {
  result: DecisionResult;
  horizon: HorizonResult;
  month: string;
  priceNow: number;
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return labels.results.unknown;
  return Math.round(value).toLocaleString("en-US");
}

function money(value: number): string {
  return `${formatNumber(value)} ${labels.thousands}`;
}

function StatTile({
  title,
  value,
  detail,
  accent = false,
}: {
  title: string;
  value: string;
  detail?: string;
  accent?: boolean;
}) {
  return (
    <article className="min-w-0 rounded-2xl border border-white/10 bg-[#111b2c] p-4 sm:p-5">
      <p className="text-xs font-medium leading-5 text-slate-400">{title}</p>
      <p
        className={`mt-3 wrap-break-word font-serif text-2xl leading-tight sm:text-3xl ${
          accent ? "text-teal-200" : "text-white"
        }`}
      >
        {value}
      </p>
      {detail && (
        <p className="mt-2 text-xs leading-5 text-slate-400">{detail}</p>
      )}
    </article>
  );
}

export default function StatTiles({ result, month, priceNow }: Props) {
  const shown = result.shown;
  const option = shown.option;
  if (!option) return null;

  const breakEvenIsValid =
    Number.isFinite(option.breakEvenPrice) &&
    Number.isFinite(option.expectedPrice);

  const breakEvenText = breakEvenIsValid
    ? money(option.breakEvenPrice)
    : labels.results.noCover;

  const spoilagePct = Number.isFinite(option.lossShare)
    ? `${(
        (option.lossShare >= 0 && option.lossShare <= 1
          ? option.lossShare * 100
          : option.lossShare)
      ).toFixed(1)}%`
    : labels.results.unknown;

  const downside = shown.totalGainLow;

  const downsideText = Number.isFinite(downside)
    ? downside < 0
      ? labels.stats.couldLose.replace(
          "{amount}",
          formatNumber(Math.abs(downside)),
        )
      : labels.stats.stillGain.replace(
          "{amount}",
          formatNumber(downside),
        )
    : labels.results.unknown;

  return (
    <div>
      {result.verdict === "sell" && (
        <p className="mb-3 text-sm text-slate-400">
          {labels.stats.closestOption.replace("{month}", month)}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <StatTile
          title={labels.stats.priceNow}
          value={money(priceNow)}
        />

        <StatTile
          title={labels.stats.expectedPrice.replace("{month}", month)}
          value={money(option.expectedPrice)}
          accent
        />

        <StatTile
          title={labels.stats.breakEven}
          value={breakEvenText}
          detail={labels.stats.breakEvenHelper.replace("{month}", month)}
        />

        <StatTile
          title={labels.stats.spoilage}
          value={spoilagePct}
          detail={labels.stats.about.replace(
            "{quantity}",
            formatNumber(shown.kgLost),
          )}
        />

        <StatTile
          title={labels.stats.ifPricesDisappoint.replace("{month}", month)}
          value={downsideText}
        />

        <StatTile
          title={labels.stats.storingCosts}
          value={money(
            shown.storageCostTotal + shown.interestCostTotal,
          )}
          detail={`${labels.stats.storage}: ${money(
            shown.storageCostTotal,
          )} + ${labels.stats.interest.toLowerCase()}: ${money(
            shown.interestCostTotal,
          )}`}
        />
      </div>
    </div>
  );
}
