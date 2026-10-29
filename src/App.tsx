
import { useEffect, useMemo, useState } from "react";
import { DataNotice } from "./components/DataNotice";
import { InputsPanel } from "./components/InputsPanel";
import { PriceChart } from "./components/PriceChart";
import { ResultCard } from "./components/ResultCard";
import { labels } from "./labels";
import { decide } from "./lib/decision";
import { loadAll } from "./lib/loadData";
import type { HistoryPoint, HistorySeries, BacktestItem } from "./types";

type AppData = Awaited<ReturnType<typeof loadAll>>;

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const NATIONAL_MARKET = "National average";

function tidyMarketName(name: string): string {
  return name
    .split(/\s+/)
    .map((word) =>
      word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : "",
    )
    .join(" ");
}

function findNationalSeries(
  series: HistorySeries[],
  cropId: string,
): HistorySeries | undefined {
  return series.find(
    (item) =>
      item.crop_id === cropId &&
      ["national average", "national", "all markets"].includes(
        item.market.trim().toLowerCase(),
      ),
  );
}

function findMarketSeries(
  series: HistorySeries[],
  cropId: string,
  originalMarket: string,
): HistorySeries | undefined {
  return series.find(
    (item) => item.crop_id === cropId && item.market === originalMarket,
  );
}

function latestPoint(points: HistoryPoint[]): HistoryPoint | undefined {
  return [...points].sort((a, b) => a.month.localeCompare(b.month)).at(-1);
}

function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);

  const [cropId, setCropId] = useState("");
  const [marketChoice, setMarketChoice] = useState(NATIONAL_MARKET);
  const [harvestMonth, setHarvestMonth] = useState(new Date().getMonth() + 1);
  const [storageMonths, setStorageMonths] = useState(3);
  const [priceNow, setPriceNow] = useState("");
  const [storageCost, setStorageCost] = useState("6");
  const [lossPct, setLossPct] = useState("0.5");

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setLoadError("");
        const result = await loadAll();

        if (cancelled) return;
        setData(result);

        const firstCrop = result.crops.crops[0];
        if (firstCrop) {
          setCropId(firstCrop.id);
          setMarketChoice(NATIONAL_MARKET);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "The project data could not be loaded.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  const crop = useMemo(
    () => data?.crops.crops.find((item) => item.id === cropId),
    [data, cropId],
  );

  const nationalSeries = useMemo(
    () =>
      data && crop
        ? findNationalSeries(data.history.series, crop.id)
        : undefined,
    [data, crop],
  );

  const chosenMarketSeries = useMemo(() => {
    if (!data || !crop || marketChoice === NATIONAL_MARKET) {
      return nationalSeries;
    }
    return findMarketSeries(data.history.series, crop.id, marketChoice);
  }, [data, crop, marketChoice, nationalSeries]);

  const isUsingNationalFallback =
    marketChoice !== NATIONAL_MARKET &&
    (!chosenMarketSeries || chosenMarketSeries.points.length === 0) &&
    Boolean(nationalSeries?.points.length);

  const effectiveSeries = isUsingNationalFallback
    ? nationalSeries
    : chosenMarketSeries;

  const historyPoints = effectiveSeries?.points ?? [];
  const hasUsableHistory = historyPoints.length > 0;

  useEffect(() => {
    if (!crop || !data) return;

    const requestedSeries =
      marketChoice === NATIONAL_MARKET
        ? nationalSeries
        : findMarketSeries(data.history.series, crop.id, marketChoice);

    const seriesToUse = requestedSeries?.points.length
      ? requestedSeries
      : nationalSeries;

    const latest = seriesToUse
      ? latestPoint(seriesToUse.points)
      : undefined;

    setPriceNow(latest ? String(latest.price) : "");
  }, [crop, data, marketChoice, nationalSeries]);

  const priceNumber = Number(priceNow);
  const storageCostNumber = Number(storageCost);
  const lossNumber = Number(lossPct);

  const outlook = data?.outlook.items.find(
    (item) =>
      item.crop_id === cropId &&
      item.harvest_month === harvestMonth &&
      item.horizon_months === storageMonths,
  );

  const backtest: BacktestItem | undefined = data?.backtest.items.find(
    (item) => item.crop_id === cropId,
  );

  const inputIsValid =
    priceNow.trim() !== "" &&
    Number.isFinite(priceNumber) &&
    priceNumber > 0 &&
    storageCost.trim() !== "" &&
    Number.isFinite(storageCostNumber) &&
    storageCostNumber >= 0 &&
    lossPct.trim() !== "" &&
    Number.isFinite(lossNumber) &&
    lossNumber >= 0 &&
    lossNumber <= 100;

  const decision = useMemo(() => {
    if (!outlook || !inputIsValid) return undefined;

    return decide({
      priceNow: priceNumber,
      expectedChangePct: outlook.expected_change_pct,
      lowChangePct: outlook.low_change_pct,
      highChangePct: outlook.high_change_pct,
      lossPct: lossNumber,
      storageCostPerMonth: storageCostNumber,
      months: storageMonths,
    });
  }, [
    outlook,
    inputIsValid,
    priceNumber,
    lossNumber,
    storageCostNumber,
    storageMonths,
  ]);

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
          <h1 className="text-2xl font-black text-slate-950">
            {labels.appName}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Loading real market data…
          </p>
        </div>
      </main>
    );
  }

  if (loadError || !data) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-8">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">
            Data loading error
          </p>
          <h1 className="mt-3 text-2xl font-black text-slate-950">
            {labels.appName} could not start
          </h1>
          <p className="mt-3 break-words text-sm leading-6 text-slate-600">
            {loadError || "The required data files were not returned."}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Check that the JSON files exist under <code>public/data/</code> and
            that the development server is running from the <code>web</code>{" "}
            folder.
          </p>
          <button
            className="mt-5 min-h-11 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            onClick={() => window.location.reload()}
            type="button"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (!crop) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold text-slate-950">
            No crop data available
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Check crops.json and reload the application.
          </p>
        </div>
      </main>
    );
  }

  const marketOptions = [
    { value: NATIONAL_MARKET, label: NATIONAL_MARKET },
    ...crop.markets.map((market) => ({
      value: market,
      label: tidyMarketName(market),
    })),
  ];

  const noReliablePattern =
    outlook?.confidence === "low" && outlook.expected_change_pct === 0;

  return (
    <main className="min-h-screen bg-slate-50 pb-12 text-slate-900">
      <header className="border-b border-emerald-950/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-7 sm:px-6 sm:py-8 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
              Agricultural decision support
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Isoko<span className="text-emerald-700">Mboni</span>
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Compare the potential value of storing a crop with the value of
              selling it now. Use your own costs and treat the outlook as an
              estimate.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 sm:p-5 lg:max-w-xs">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              Price data period
            </p>
            <p className="mt-2 text-lg font-bold text-slate-950">
              {data.crops.data_range.start} — {data.crops.data_range.end}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              About 22 months of data; Aug–Oct 2025 is missing.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(300px,0.85fr)_minmax(0,1.15fr)]">
          <InputsPanel
            crops={data.crops.crops}
            cropId={cropId}
            marketChoice={marketChoice}
            marketOptions={marketOptions}
            harvestMonth={harvestMonth}
            months={MONTHS}
            storageMonths={storageMonths}
            priceNow={priceNow}
            storageCost={storageCost}
            lossPct={lossPct}
            hasUsableHistory={hasUsableHistory}
            isUsingNationalFallback={isUsingNationalFallback}
            onCropChange={(nextCropId) => {
              setCropId(nextCropId);
              setMarketChoice(NATIONAL_MARKET);
            }}
            onMarketChange={setMarketChoice}
            onHarvestMonthChange={setHarvestMonth}
            onStorageMonthsChange={setStorageMonths}
            onPriceNowChange={setPriceNow}
            onStorageCostChange={setStorageCost}
            onLossPctChange={setLossPct}
          />

          <div className="min-w-0 space-y-5">
            <ResultCard
              decision={decision}
              outlook={outlook}
              cropName={crop.name}
              months={storageMonths}
              missingOutlook={!outlook}
              invalidInputs={!inputIsValid}
            />

            {noReliablePattern && (
              <div
                role="note"
                className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950 sm:p-5"
              >
                <p className="font-bold">No reliable seasonal pattern found</p>
                <p className="mt-2 text-sm leading-6">
                  No reliable seasonal pattern found for this crop. Storing only
                  pays if storage costs are very low.
                </p>
              </div>
            )}

            <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700">
              Seasonal outlook is national, not market-specific.
            </p>
          </div>
        </section>

        <PriceChart
          cropName={crop.name}
          points={historyPoints}
          outlook={outlook}
          priceNow={inputIsValid ? priceNumber : undefined}
          months={storageMonths}
          hasHistory={hasUsableHistory}
          marketLabel={
            isUsingNationalFallback
              ? NATIONAL_MARKET
              : marketChoice === NATIONAL_MARKET
                ? NATIONAL_MARKET
                : tidyMarketName(marketChoice)
          }
        />

        <DataNotice
          dataRange={data.crops.data_range}
          outlook={outlook}
          backtest={backtest}
          isUsingNationalFallback={isUsingNationalFallback}
          selectedMarket={marketChoice}
          hasHistory={hasUsableHistory}
          historyPoints={historyPoints.length}
        />

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">
            Method
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            How this is calculated
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            The estimate compares projected value after storage, adjusted for
            expected losses and storage costs, with the current selling price.
            All amounts are in RWF per kg.
          </p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-7 text-emerald-950">
            <code className="whitespace-normal break-words">
              net_per_kg = price_now × (1 + expected_change_pct / 100) × (1 -
              loss_pct / 100) - storage_cost_per_month × months - price_now
            </code>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Storage cost and expected loss begin with example values, not
            verified national estimates. Replace them with values appropriate
            to your crop, storage method, and location.
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            A positive estimate does not guarantee a profit. Actual prices,
            quality losses, transport, and other costs may differ from these
            assumptions.
          </p>
        </section>

        <footer className="px-1 pt-2 text-center text-xs leading-5 text-slate-500">
          {labels.appName} · Decision support, not a guaranteed price forecast.
          Currency: RWF · Unit: kg.
        </footer>
      </div>
    </main>
  );
}

export default App;
