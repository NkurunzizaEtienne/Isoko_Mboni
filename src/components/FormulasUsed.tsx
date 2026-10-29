import type { DecisionResult, HorizonResult } from "../types";
import { labels } from "../labels";

interface Props {
  result: DecisionResult | null;
  priceNow: number;
  storageCostPerMonth: number;
  loanInterestPctYear: number;
  month: string;
}

function whole(value: number): string {
  return Number.isFinite(value) ? Math.round(value).toLocaleString("en-US") : "—";
}

function decimal(value: number, places = 3): string {
  return Number.isFinite(value) ? Number(value.toFixed(places)).toString() : "—";
}

function FormulaGroup({ title, formula, explanation }: {
  title: string; formula: string; explanation: string;
}) {
  return (
    <details className="group rounded-xl border border-white/10 bg-[#111d31]">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-white marker:hidden">
        <span className="mr-2 inline-block text-teal-300 transition group-open:rotate-90">›</span>
        {title}
      </summary>
      <div className="space-y-2 px-4 pb-4">
        <div className="overflow-x-auto rounded-lg bg-[#182740] p-3 font-mono text-xs leading-6 text-teal-100 sm:text-sm">
          <pre className="whitespace-pre">{formula}</pre>
        </div>
        <p className="text-sm leading-6 text-slate-300">{explanation}</p>
      </div>
    </details>
  );
}

export default function FormulasUsed({
  result, priceNow, storageCostPerMonth, loanInterestPctYear, month,
}: Props) {
  const shown = result?.shown;
  const option: HorizonResult | null = shown?.option ?? null;

  const h = option?.months ?? 0;
  const r = loanInterestPctYear / 100 / 12;
  const C = storageCostPerMonth;
  const P0 = priceNow;
  const Ph = option?.expectedPrice ?? 0;
  const lossShare = option?.lossShare ?? 0;
  const sellNow = P0 * (1 + r * h);
  const store = Ph * (1 - lossShare) - C * h;
  const gain = option?.gainPerKg ?? 0;
  const breakEven = option?.breakEvenPrice ?? 0;
  const chance = option ? (option.probPays <= 1 ? option.probPays * 100 : option.probPays) : 0;
  const totalGain = shown?.totalGain ?? 0;
  const monthName = month || labels.results.unknown;



  return (
    <section id="formulas" className="scroll-mt-6 rounded-2xl border border-teal-300/20 bg-[#0e192b] p-4 sm:p-6">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-300">Method</p>
        <h3 className="mt-1 font-serif text-2xl text-white">{labels.formulas.heading}</h3>
        <p className="mt-1 text-sm text-slate-400">{labels.formulas.subtitle}</p>
      </div>

      <div className="mb-5 rounded-xl border border-white/10 bg-[#111d31] p-4">
        <h4 className="text-sm font-semibold text-white">{labels.formulas.symbolsHeading}</h4>
        <dl className="mt-3 grid gap-x-5 gap-y-2 text-sm sm:grid-cols-2">
          {labels.formulas.symbols.map(([symbol, meaning]) => (
            <div key={symbol} className="flex gap-2">
              <dt className="min-w-8 font-mono font-semibold text-teal-200">{symbol}</dt>
              <dd className="text-slate-300">{meaning}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="space-y-2">
        {labels.formulas.groups.map((group) => (
          <FormulaGroup key={group.title} title={group.title} formula={group.formula} explanation={group.explanation} />
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-teal-300/20 bg-[#111d31] p-4 sm:p-5">
        <h4 className="text-base font-semibold text-white">{labels.formulas.yourNumbers}</h4>
        {!option ? (
          <p className="mt-3 text-sm text-slate-300">{labels.formulas.noForecast}</p>
        ) : (
          <>
            <p className="mt-1 text-sm text-teal-200">
              {labels.formulas.exampleFor.replace("{months}", String(h)).replace("{month}", monthName)}
            </p>
            {result?.verdict === "sell" && (
              <p className="mt-2 text-xs leading-5 text-orange-200">
                {labels.formulas.closestNote}
              </p>
            )}
            <div className="mt-4 space-y-2 font-mono text-xs leading-6 text-slate-200 sm:text-sm">
              <p>{labels.formulas.sellNowLabel} = {whole(P0)} × (1 + {decimal(r)} × {h}) = {whole(sellNow)} RWF/kg</p>
              <p>{labels.formulas.storeLabel} = {whole(Ph)} × (1 − {decimal(lossShare)}) − {whole(C)} × {h} = {whole(store)} RWF/kg</p>
              <p>{labels.formulas.gainLabel} = {whole(store)} − {whole(sellNow)} = {whole(gain)} RWF/kg</p>
              <p>{labels.formulas.breakEvenLabel} = {whole(breakEven)} RWF/kg</p>
              <p>{labels.formulas.chanceLabel} = {chance.toFixed(1)}%</p>
              <p>{labels.formulas.totalGainLabel} = {whole(gain)} × {whole(shown?.kg ?? 0)} = {whole(totalGain)} RWF</p>
            </div>
          </>
        )}
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        {labels.formulas.limitsNote}
      </p>
    </section>
  );
}
