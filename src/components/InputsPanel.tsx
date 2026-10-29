
import type { Crop } from "../types";
import { labels } from "../labels";

type MarketOption = {
  value: string;
  label: string;
};

type InputsPanelProps = {
  crops: Crop[];
  cropId: string;
  marketChoice: string;
  marketOptions: MarketOption[];
  harvestMonth: number;
  months: string[];
  storageMonths: number;
  priceNow: string;
  storageCost: string;
  lossPct: string;
  hasUsableHistory: boolean;
  isUsingNationalFallback: boolean;
  onCropChange: (value: string) => void;
  onMarketChange: (value: string) => void;
  onHarvestMonthChange: (value: number) => void;
  onStorageMonthsChange: (value: number) => void;
  onPriceNowChange: (value: string) => void;
  onStorageCostChange: (value: string) => void;
  onLossPctChange: (value: string) => void;
};

const fieldClass =
  "mt-2 block min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base text-slate-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20";

const labelClass = "block text-sm font-semibold text-slate-800";

export function InputsPanel({
  crops,
  cropId,
  marketChoice,
  marketOptions,
  harvestMonth,
  months,
  storageMonths,
  priceNow,
  storageCost,
  lossPct,
  hasUsableHistory,
  isUsingNationalFallback,
  onCropChange,
  onMarketChange,
  onHarvestMonthChange,
  onStorageMonthsChange,
  onPriceNowChange,
  onStorageCostChange,
  onLossPctChange,
}: InputsPanelProps) {
  return (
    <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">
        Decision inputs
      </p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
        {labels.inputs.title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {labels.inputs.description}
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <label className={labelClass} htmlFor="crop">
            {labels.inputs.crop}
          </label>
          <select
            className={fieldClass}
            id="crop"
            value={cropId}
            onChange={(event) => onCropChange(event.target.value)}
          >
            {crops.map((crop) => (
              <option key={crop.id} value={crop.id}>
                {crop.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="market">
            {labels.inputs.market}
          </label>
          <select
            className={fieldClass}
            id="market"
            value={marketChoice}
            onChange={(event) => onMarketChange(event.target.value)}
          >
            {marketOptions.map((market) => (
              <option key={market.value} value={market.value}>
                {market.label}
              </option>
            ))}
          </select>

          {isUsingNationalFallback && (
            <p
              role="status"
              className="mt-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm leading-6 text-amber-950"
            >
              {labels.inputs.nationalFallback}
            </p>
          )}

          {!hasUsableHistory && (
            <p
              role="status"
              className="mt-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm leading-6 text-amber-950"
            >
              {labels.inputs.noHistory}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="harvest-month">
            {labels.inputs.harvestMonth}
          </label>
          <select
            className={fieldClass}
            id="harvest-month"
            value={harvestMonth}
            onChange={(event) =>
              onHarvestMonthChange(Number(event.target.value))
            }
          >
            {months.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="storage-months">
            {labels.inputs.storageMonths}
          </label>
          <select
            className={fieldClass}
            id="storage-months"
            value={storageMonths}
            onChange={(event) =>
              onStorageMonthsChange(Number(event.target.value))
            }
          >
            {[1, 2, 3, 4, 5, 6].map((monthCount) => (
              <option key={monthCount} value={monthCount}>
                {monthCount} {monthCount === 1 ? "month" : "months"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="current-price">
            {labels.inputs.currentPrice}
          </label>
          <input
            className={fieldClass}
            id="current-price"
            type="number"
            min="0.01"
            step="any"
            inputMode="decimal"
            value={priceNow}
            onChange={(event) => onPriceNowChange(event.target.value)}
            placeholder="Enter current price"
          />
          <p className="mt-1.5 text-xs leading-5 text-slate-500">
            Prefilled from the latest available price point. Edit it to match
            the price offered to you.
          </p>
        </div>

        <fieldset className="rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
          <legend className="px-1 text-xs font-bold uppercase tracking-wider text-amber-950">
            Example assumptions
          </legend>
          <p className="mt-1 text-sm leading-6 text-amber-950">
            {labels.inputs.exampleValue}
          </p>

          <div className="mt-4">
            <label className={labelClass} htmlFor="storage-cost">
              {labels.inputs.storageCost}
            </label>
            <input
              className={fieldClass}
              id="storage-cost"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              value={storageCost}
              onChange={(event) => onStorageCostChange(event.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className={labelClass} htmlFor="expected-loss">
              {labels.inputs.expectedLoss}
            </label>
            <input
              className={fieldClass}
              id="expected-loss"
              type="number"
              min="0"
              max="100"
              step="any"
              inputMode="decimal"
              value={lossPct}
              onChange={(event) => onLossPctChange(event.target.value)}
            />
          </div>
        </fieldset>
      </div>
    </section>
  );
}
