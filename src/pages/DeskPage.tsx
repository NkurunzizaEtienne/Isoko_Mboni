
import { useCallback, useEffect, useMemo, useState } from "react";
import InputsPanel from "../components/InputsPanel";
import ResultCard from "../components/ResultCard";
import StatTiles from "../components/StatTiles";
import PriceChart from "../components/PriceChart";
import ReliabilityDetails from "../components/ReliabilityDetails";
import { labels } from "../labels";
import { DESK } from "../siteContent";
import { decide } from "../lib/decision";
import { loadAll } from "../lib/loadData";
import type {
  BacktestItem,
  CropsFile,
  HistoryFile,
  OutlookFile,
  SeasonalFile,
  DecisionInput,
  DecisionResult,
  Crop,
  HistorySeries,
  OutlookItem,
} from "../types";

interface LoadedData {
  crops: CropsFile;
  history: HistoryFile;
  outlook: OutlookFile;
  seasonal: SeasonalFile;
  backtest: { items: BacktestItem[] };
}

const MONTHS = labels.months;
const NATIONAL_NAMES = ["national", "national average", "all markets"];

function normalise(value: string): string {
  return value.trim().toLowerCase();
}

function isNational(market: string): boolean {
  return NATIONAL_NAMES.includes(normalise(market));
}


function latestPoint(series: HistorySeries | undefined) {
  if (!series || series.points.length === 0) return undefined;
  return [...series.points].sort((a, b) => a.month.localeCompare(b.month)).at(-1);
}

function monthAfter(harvestMonth: number, months: number): number {
  return ((harvestMonth - 1 + months) % 12) + 1;
}

function monthName(month: number): string {
  return MONTHS[month - 1] ?? labels.results.unknown;
}


function getNationalSeries(
  history: HistoryFile,
  cropId: string,
): HistorySeries | undefined {
  return history.series.find(
    (series) =>
      series.crop_id === cropId && isNational(series.market),
  );
}

function getMarketSeries(
  history: HistoryFile,
  cropId: string,
  market: string,
): HistorySeries | undefined {
  if (isNational(market)) return getNationalSeries(history, cropId);

  return history.series.find(
    (series) =>
      series.crop_id === cropId && series.market === market,
  );
}

export default function DeskPage() {
  const [data, setData] = useState<LoadedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [cropId, setCropId] = useState("");
  const [marketChoice, setMarketChoice] = useState<string>(labels.nationalAverage);
  const [harvestMonth, setHarvestMonth] = useState(new Date().getMonth() + 1);
  const [maxMonths, setMaxMonths] = useState(3);
  const [priceText, setPriceText] = useState("");
  const [quantityText, setQuantityText] = useState("500");
  const [storageCostText, setStorageCostText] = useState("10");
  const [lossText, setLossText] = useState("5");
  const [interestText, setInterestText] = useState("18");
  const [inflationText, setInflationText] = useState("0");
  const [cashText, setCashText] = useState("0");
  const [moreOptions, setMoreOptions] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const loaded = await loadAll();
      setData(loaded);
      const firstCrop = loaded.crops.crops[0];
      if (firstCrop) {
        setCropId((current) => current || firstCrop.id);
      }
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const selectedCrop: Crop | undefined = useMemo(
    () => data?.crops.crops.find((crop) => crop.id === cropId),
    [data, cropId],
  );

  const marketOptions = useMemo(
    () => [
      labels.nationalAverage,
      ...(selectedCrop?.markets ?? []).filter(
        (market) => !isNational(market),
      ),
    ],
    [selectedCrop],
  );

  useEffect(() => {
    if (!marketOptions.includes(marketChoice)) {
      setMarketChoice(labels.nationalAverage);
    }
  }, [marketChoice, marketOptions]);

  const nationalSeries = useMemo(
    () => (data && selectedCrop
      ? getNationalSeries(data.history, selectedCrop.id)
      : undefined),
    [data, selectedCrop],
  );

  const selectedSeries = useMemo(
    () => (data && selectedCrop
      ? getMarketSeries(data.history, selectedCrop.id, marketChoice)
      : undefined),
    [data, selectedCrop, marketChoice],
  );

  const isUsingNationalFallback =
    !isNational(marketChoice) && !selectedSeries && Boolean(nationalSeries);

  const effectiveSeries = selectedSeries ?? (
    isUsingNationalFallback ? nationalSeries : undefined
  );

  const currentHistoryPoint = latestPoint(effectiveSeries);
  const [priceTouched, setPriceTouched] = useState(false);

  useEffect(() => {
    setPriceTouched(false);
  }, [cropId, marketChoice]);

  useEffect(() => {
    if (!priceTouched) {
      setPriceText(
        currentHistoryPoint ? String(currentHistoryPoint.price) : "",
      );
    }
  }, [currentHistoryPoint, priceTouched]);

  const priceNow = Number(priceText);
  const quantityKg = Number(quantityText);
  const storageCostPerMonth = Number(storageCostText);
  const totalLossPct = Number(lossText);
  const loanInterestPctYear = Number(interestText);
  const inflationPctYear = Number(inflationText);
  const cashNeeded = Number(cashText);

  const validInputs =
    priceText.trim() !== "" &&
    quantityText.trim() !== "" &&
    Number.isFinite(priceNow) &&
    priceNow > 0 &&
    Number.isFinite(quantityKg) &&
    quantityKg > 0 &&
    Number.isFinite(storageCostPerMonth) &&
    storageCostPerMonth >= 0 &&
    Number.isFinite(totalLossPct) &&
    totalLossPct >= 0 &&
    totalLossPct < 100 &&
    Number.isFinite(loanInterestPctYear) &&
    loanInterestPctYear >= 0 &&
    Number.isFinite(inflationPctYear) &&
    inflationPctYear >= 0 &&
    inflationPctYear <= 30 &&
    Number.isFinite(cashNeeded) &&
    cashNeeded >= 0;

  const matchingOutlooks = useMemo(
    () =>
      (data?.outlook.items ?? [])
        .filter(
          (item) =>
            item.crop_id === cropId &&
            item.harvest_month === harvestMonth &&
            item.horizon_months <= maxMonths,
        )
        .sort((a, b) => a.horizon_months - b.horizon_months),
    [data, cropId, harvestMonth, maxMonths],
  );

  const decisionInput: DecisionInput | null = useMemo(() => {
    if (!validInputs || matchingOutlooks.length === 0) return null;

    return {
      priceNow,
      quantityKg,
      maxMonths,
      storageCostPerMonth,
      totalLossPct,
      loanInterestPctYear,
      inflationPctYear,
      cashNeeded,
      minProbability: 0.6,
      maxDownsideShare: 0.1,
      horizons: matchingOutlooks.map((item) => ({
        months: item.horizon_months,
        p10Pct: item.low_change_pct,
        p50Pct: item.expected_change_pct,
        p90Pct: item.high_change_pct,
      })),
    };
  }, [
    validInputs,
    matchingOutlooks,
    priceNow,
    quantityKg,
    maxMonths,
    storageCostPerMonth,
    totalLossPct,
    loanInterestPctYear,
    inflationPctYear,
    cashNeeded,
  ]);

  const decision: DecisionResult | null = useMemo(() => {
    if (!decisionInput) return null;
    try {
      return decide(decisionInput);
    } catch {
      return null;
    }
  }, [decisionInput]);

  const chosenHorizon = decision?.best ?? decision?.closest;
  const chosenOutlook: OutlookItem | undefined = useMemo(() => {
    if (chosenHorizon) {
      return matchingOutlooks.find(
        (item) => item.horizon_months === chosenHorizon.months,
      );
    }
    return matchingOutlooks.at(-1);
  }, [chosenHorizon, matchingOutlooks]);

  const backtest = useMemo(
    () => data?.backtest.items.find((item) => item.crop_id === cropId),
    [data, cropId],
  );

  const hasReliablePattern =
    chosenOutlook?.confidence === "low" &&
    chosenOutlook.expected_change_pct === 0;

  const resultMonth = chosenHorizon
    ? monthName(monthAfter(harvestMonth, chosenHorizon.months))
    : labels.results.unknown;


  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a1020] px-4 py-12 text-slate-100">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-[#111b2c] p-8 text-slate-300">
          {labels.loading}
        </div>
      </main>
    );
  }

  if (loadError || !data) {
    return (
      <main className="min-h-screen bg-[#0a1020] px-4 py-12 text-slate-100">
        <div className="mx-auto max-w-2xl rounded-3xl border border-rose-300/20 bg-[#111b2c] p-8">
          <h1 className="font-serif text-3xl text-white">
            {labels.loadErrorTitle}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {labels.loadErrorDetail}
          </p>
          <button
            type="button"
            onClick={() => void fetchData()}
            className="mt-6 rounded-xl bg-teal-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-teal-300"
          >
            {labels.retry}
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="text-slate-100">
      <div className="rounded-2xl border border-white/10 bg-ink-900/40 p-4 sm:p-6">
        <header className="mb-5">
          <h1 className="font-display text-3xl text-white">{DESK.title}</h1>
          <p className="mt-1 text-sm text-slate-300">{DESK.subtitle}</p>
        </header>

        <section aria-label={labels.inputs.heading}>
          <InputsPanel
            crops={data.crops.crops}
            cropId={cropId}
            marketChoice={marketChoice}
            marketOptions={marketOptions}
            harvestMonth={harvestMonth}
            maxMonths={maxMonths}
            priceText={priceText}
            quantityText={quantityText}
            storageCostText={storageCostText}
            lossText={lossText}
            interestText={interestText}
            inflationText={inflationText}
            cashText={cashText}
            moreOptions={moreOptions}
            isUsingNationalFallback={isUsingNationalFallback}
            hasHistory={Boolean(currentHistoryPoint)}
            onCropChange={(value) => {
              setCropId(value);
              setPriceTouched(false);
            }}
            onMarketChange={(value) => {
              setMarketChoice(value);
              setPriceTouched(false);
            }}
            onHarvestMonthChange={setHarvestMonth}
            onMaxMonthsChange={setMaxMonths}
            onPriceChange={(value) => {
              setPriceTouched(true);
              setPriceText(value);
            }}
            onQuantityChange={setQuantityText}
            onStorageCostChange={setStorageCostText}
            onLossChange={setLossText}
            onInterestChange={setInterestText}
            onInflationChange={setInflationText}
            onCashChange={setCashText}
            onMoreOptionsChange={setMoreOptions}
          />
        </section>

        <section className="mt-8 space-y-5" aria-label={labels.results.heading}>
          <ResultCard
            result={decision}
            month={resultMonth}
            quantityKg={quantityKg}
            priceNow={priceNow}
            hasOutlook={matchingOutlooks.length > 0}
            validInputs={validInputs}
            reliablePattern={hasReliablePattern}
            onDetailsClick={() =>
              document.getElementById("reliability-details")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
          />

          {decision && chosenHorizon && selectedCrop && (
            <StatTiles
              result={decision}
              horizon={chosenHorizon}
              month={resultMonth}
              priceNow={priceNow}
            />
          )}

          <PriceChart
            seasonal={data.seasonal}
            cropId={cropId}
            harvestMonth={harvestMonth}
            bestMonth={
              decision?.verdict === "store" && decision.best
                ? monthAfter(harvestMonth, decision.best.months)
                : undefined
            }
          />
        </section>

        <section
          id="reliability-details"
          className="mt-8 scroll-mt-6"
          aria-labelledby="reliability-heading"
        >
          <ReliabilityDetails
            outlook={chosenOutlook}
            backtest={backtest}
            dataRange={data.crops.data_range}
            hasDataGap
            option={chosenHorizon ?? null}
            month={resultMonth}
            result={decision}
            priceNow={priceNow}
            storageCostPerMonth={storageCostPerMonth}
            loanInterestPctYear={loanInterestPctYear}
            inflationPctYear={inflationPctYear}
          />
        </section>

        <footer className="mt-10 border-t border-white/10 py-5 text-xs leading-5 text-slate-500">
          {labels.reliability.limitRange} {labels.reliability.limitCosts}
        </footer>
      </div>
    </div>
  );
}
