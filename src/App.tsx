
import { useMemo, useState } from "react";
import InputsPanel from "./components/InputsPanel";
import ResultCard from "./components/ResultCard";
import PriceChart from "./components/PriceChart";
import DataNotice from "./components/DataNotice";
import {
  mockCrops,
  mockHistory,
  mockOutlook,
} from "./mockData";
import type { Crop, HistoryPoint, OutlookItem } from "./mockData";
import { labels } from "./labels";
import "./styles.css";

export type UserInputs = {
  cropId: string;
  market: string;
  harvestMonth: number;
  storageMonths: number;
  storageCost: number;
  lossPct: number;
};

export type DecisionView = {
  enoughData: boolean;
  verdict: "store" | "sell" | "insufficient";
  currentPrice: number | null;
  expectedPrice: number | null;
  lowPrice: number | null;
  highPrice: number | null;
  netPerKg: number | null;
  confidence: "low" | "medium" | "high" | null;
  yearsOfData: number;
  months: number;
};

const initialInputs: UserInputs = {
  cropId: "beans",
  market: "national",
  harvestMonth: 10,
  storageMonths: 3,
  storageCost: 6,
  lossPct: 0.5,
};

function App() {
  const [inputs, setInputs] = useState<UserInputs>(initialInputs);
  const [calculatedInputs, setCalculatedInputs] =
    useState<UserInputs>(initialInputs);

  const crops = mockCrops.crops;
  const selectedCrop = crops.find(
    (crop) => crop.id === calculatedInputs.cropId,
  );

  const availableMarkets = selectedCrop?.markets ?? ["national"];

  const series = mockHistory.series.find(
    (item) =>
      item.crop_id === calculatedInputs.cropId &&
      item.market === calculatedInputs.market,
  );

  const currentPoint = series?.points.at(-1);
  const currentPrice =
    currentPoint?.price ?? (
      calculatedInputs.market === "national"
        ? selectedCrop?.latest_price
        : undefined
    );

  const outlook = mockOutlook.items.find(
    (item) =>
      item.crop_id === calculatedInputs.cropId &&
      item.harvest_month === calculatedInputs.harvestMonth &&
      item.horizon_months === calculatedInputs.storageMonths,
  );

  const decision: DecisionView = useMemo(() => {
    const insufficient = (
      current: number | undefined,
      forecast: OutlookItem | undefined,
    ): DecisionView => ({
      enoughData: false,
      verdict: "insufficient",
      currentPrice: current ?? null,
      expectedPrice: null,
      lowPrice: null,
      highPrice: null,
      netPerKg: null,
      confidence: forecast?.confidence ?? null,
      yearsOfData: forecast?.years_of_data ?? 0,
      months: calculatedInputs.storageMonths,
    });

    if (
      currentPrice === undefined ||
      !Number.isFinite(currentPrice) ||
      currentPrice <= 0 ||
      !outlook ||
      !Number.isFinite(outlook.expected_change_pct) ||
      !Number.isFinite(outlook.low_change_pct) ||
      !Number.isFinite(outlook.high_change_pct) ||
      !Number.isFinite(calculatedInputs.storageCost) ||
      calculatedInputs.storageCost < 0 ||
      !Number.isFinite(calculatedInputs.lossPct) ||
      calculatedInputs.lossPct < 0 ||
      calculatedInputs.lossPct > 100 ||
      outlook.years_of_data <= 0
    ) {
      return insufficient(currentPrice, outlook);
    }

    const futurePrice =
      currentPrice * (1 + outlook.expected_change_pct / 100);

    const lowPrice =
      currentPrice * (1 + outlook.low_change_pct / 100);

    const highPrice =
      currentPrice * (1 + outlook.high_change_pct / 100);

    const net =
      futurePrice * (1 - calculatedInputs.lossPct / 100) -
      calculatedInputs.storageCost * calculatedInputs.storageMonths -
      currentPrice;

    return {
      enoughData: true,
      verdict: net > 0 ? "store" : "sell",
      currentPrice,
      expectedPrice: futurePrice,
      lowPrice: Math.min(lowPrice, highPrice),
      highPrice: Math.max(lowPrice, highPrice),
      netPerKg: net,
      confidence: outlook.confidence,
      yearsOfData: outlook.years_of_data,
      months: calculatedInputs.storageMonths,
    };
  }, [calculatedInputs, currentPrice, outlook]);

  const selectedHistory: HistoryPoint[] = series?.points ?? [];

  function updateInputs(next: UserInputs) {
    const cropChanged = next.cropId !== inputs.cropId;

    if (cropChanged) {
      const crop = crops.find((item) => item.id === next.cropId);
      next = {
        ...next,
        market: crop?.markets.includes(next.market)
          ? next.market
          : "national",
      };
    }

    setInputs(next);
  }

  function handleCompare() {
    setCalculatedInputs({ ...inputs });
  }

  const currentCrop: Crop | undefined = crops.find(
    (crop) => crop.id === calculatedInputs.cropId,
  );

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label={labels.brand}>
          <span className="brand-mark" aria-hidden="true">UM</span>
          <span>
            <strong>{labels.brand}</strong>
            <small>{labels.product}</small>
          </span>
        </a>
        <span className="demo-badge">{labels.demo}</span>
      </header>

      <section className="hero" id="home">
        <p className="eyebrow">BETTER HARVEST DECISIONS</p>
        <h1>Sell now or store for later?</h1>
        <p className="hero-copy">
          Compare a possible future selling price with the cost of storing
          your harvest. Use the result as a guide, not a guarantee.
        </p>
      </section>

      <div className="demo-warning" role="note">
        <strong>Demo mode</strong>
        <p>{labels.demoNotice}</p>
      </div>

      <div className="workspace">
        <InputsPanel
          crops={crops}
          inputs={inputs}
          onChange={updateInputs}
          onCompare={handleCompare}
        />

        <section className="results-column" aria-live="polite">
          <ResultCard
            decision={decision}
            cropName={currentCrop?.name ?? "Selected crop"}
            storageCost={calculatedInputs.storageCost}
            lossPct={calculatedInputs.lossPct}
          />

          <PriceChart
            points={selectedHistory}
            currentPrice={decision.currentPrice}
            expectedPrice={decision.expectedPrice}
            lowPrice={decision.lowPrice}
            highPrice={decision.highPrice}
            months={calculatedInputs.storageMonths}
            enoughData={decision.enoughData}
          />

          <DataNotice
            yearsOfData={decision.yearsOfData}
            confidence={decision.confidence}
            start={mockCrops.data_range.start}
            end={mockCrops.data_range.end}
          />
        </section>
      </div>

      <section className="method-note">
        <span className="method-icon" aria-hidden="true">i</span>
        <div>
          <h2>{labels.howTitle}</h2>
          <p>{labels.howText}</p>
          <p className="muted">
            The estimate excludes costs not included in your inputs, such as
            transport, labor and financing. Include relevant costs in your
            assumptions where appropriate.
          </p>
        </div>
      </section>

      <footer className="footer">
        <strong>{labels.brand}</strong>
        <span>Price information supports decisions. It cannot guarantee profit.</span>
      </footer>
    </main>
  );
}

export default App;
