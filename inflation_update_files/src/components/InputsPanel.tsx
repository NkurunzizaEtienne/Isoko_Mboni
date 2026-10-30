
import { labels } from "../labels";
import type { Crop } from "../types";

interface Props {
  crops: Crop[];
  cropId: string;
  marketChoice: string;
  marketOptions: string[];
  harvestMonth: number;
  maxMonths: number;
  priceText: string;
  quantityText: string;
  storageCostText: string;
  lossText: string;
  interestText: string;
  inflationText: string;
  cashText: string;
  moreOptions: boolean;
  isUsingNationalFallback: boolean;
  hasHistory: boolean;
  onCropChange: (value: string) => void;
  onMarketChange: (value: string) => void;
  onHarvestMonthChange: (value: number) => void;
  onMaxMonthsChange: (value: number) => void;
  onPriceChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
  onStorageCostChange: (value: string) => void;
  onLossChange: (value: string) => void;
  onInterestChange: (value: string) => void;
  onInflationChange: (value: string) => void;
  onCashChange: (value: string) => void;
  onMoreOptionsChange: (value: boolean) => void;
}

const fieldClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-[#0b1425] px-3.5 py-3 text-base text-white outline-none transition placeholder:text-slate-600 focus:border-teal-300 focus:ring-2 focus:ring-teal-300/15";

const labelClass = "text-sm font-medium text-slate-200";
const helperClass = "mt-1.5 text-xs leading-5 text-slate-400";

function NumberField({
  id,
  label,
  value,
  onChange,
  helper,
  suffix,
  min = 0,
  step = "any",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
  suffix?: string;
  min?: number;
  step?: string;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>{label}</label>
      <div className="relative">
        <input
          id={id}
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${fieldClass} ${suffix ? "pr-20" : ""}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400">
            {suffix}
          </span>
        )}
      </div>
      {helper && <p className={helperClass}>{helper}</p>}
    </div>
  );
}

export default function InputsPanel(props: Props) {
  const {
    crops,
    cropId,
    marketChoice,
    marketOptions,
    harvestMonth,
    maxMonths,
    priceText,
    quantityText,
    storageCostText,
    lossText,
    interestText,
    inflationText,
    cashText,
    moreOptions,
    isUsingNationalFallback,
    hasHistory,
    onCropChange,
    onMarketChange,
    onHarvestMonthChange,
    onMaxMonthsChange,
    onPriceChange,
    onQuantityChange,
    onStorageCostChange,
    onLossChange,
    onInterestChange,
    onInflationChange,
    onCashChange,
    onMoreOptionsChange,
  } = props;

  return (
    <div className="rounded-3xl border border-white/10 bg-[#111b2c] p-4 shadow-2xl shadow-black/10 sm:p-7">
      <div className="mb-6">
        <h2 className="font-serif text-2xl text-white sm:text-3xl">
          {labels.inputs.heading}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {labels.inputs.intro}
        </p>
      </div>

      <div className="grid gap-x-6 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <label htmlFor="crop" className={labelClass}>
            {labels.inputs.crop}
          </label>
          <select
            id="crop"
            value={cropId}
            onChange={(event) => onCropChange(event.target.value)}
            className={fieldClass}
          >
            {crops.map((crop) => (
              <option key={crop.id} value={crop.id}>{crop.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="market" className={labelClass}>
            {labels.inputs.market}
          </label>
          <select
            id="market"
            value={marketChoice}
            onChange={(event) => onMarketChange(event.target.value)}
            className={fieldClass}
          >
            {marketOptions.map((market) => (
              <option key={market} value={market}>{market}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="harvest-month" className={labelClass}>
            {labels.inputs.harvestMonth}
          </label>
          <select
            id="harvest-month"
            value={harvestMonth}
            onChange={(event) => onHarvestMonthChange(Number(event.target.value))}
            className={fieldClass}
          >
            {labels.months.map((month, index) => (
              <option key={month} value={index + 1}>{month}</option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0c1526] p-4">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="max-months" className={labelClass}>
              {labels.inputs.storeFor}
            </label>
            <span className="rounded-lg bg-orange-300/10 px-2.5 py-1 text-sm font-semibold text-orange-200">
              {maxMonths} {labels.inputs.monthsUnit}
            </span>
          </div>
          <input
            id="max-months"
            type="range"
            min={1}
            max={6}
            step={1}
            value={maxMonths}
            onChange={(event) => onMaxMonthsChange(Number(event.target.value))}
            className="mt-4 w-full cursor-pointer accent-orange-400"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-500">
            <span>1</span><span>6</span>
          </div>
          <p className={helperClass}>{labels.inputs.storeForHelper}</p>
        </div>

        <div>
          <label htmlFor="price-now" className={labelClass}>
            {labels.inputs.priceNow}
          </label>
          <div className="relative">
            <input
              id="price-now"
              type="number"
              min={0}
              step="any"
              value={priceText}
              onChange={(event) => onPriceChange(event.target.value)}
              placeholder="0"
              className={`${fieldClass} pr-20`}
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400">
              {labels.inputs.perKg}
            </span>
          </div>
          <p className={helperClass}>{labels.inputs.priceHelper}</p>
          {isUsingNationalFallback && (
            <p role="status" className="mt-2 rounded-lg border border-orange-300/20 bg-orange-300/5 p-2 text-xs leading-5 text-orange-100">
              {labels.inputs.nationalFallback}
            </p>
          )}
          {!hasHistory && (
            <p role="status" className="mt-2 rounded-lg border border-orange-300/20 bg-orange-300/5 p-2 text-xs leading-5 text-orange-100">
              {labels.inputs.priceMissing}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-teal-300/25 bg-teal-300/[0.06] p-4">
          <label htmlFor="quantity" className="text-sm font-semibold text-teal-100">
            {labels.inputs.quantity}
          </label>
          <div className="mt-2 flex items-baseline gap-2">
            <input
              id="quantity"
              type="number"
              min={0}
              step="any"
              value={quantityText}
              onChange={(event) => onQuantityChange(event.target.value)}
              className="w-full min-w-0 bg-transparent font-serif text-4xl text-white outline-none placeholder:text-slate-600 focus:text-teal-100 sm:text-5xl"
              aria-describedby="quantity-helper"
            />
            <span className="shrink-0 text-sm text-slate-400">
              {labels.inputs.kg}
            </span>
          </div>
          <p id="quantity-helper" className={helperClass}>
            {labels.inputs.quantityHelper}
          </p>
        </div>

        <NumberField
          id="storage-cost"
          label={`${labels.inputs.storageCost} (${labels.inputs.perKg}/${labels.inputs.monthsUnit.replace(/s$/, "")})`}
          value={storageCostText}
          onChange={onStorageCostChange}
          suffix={labels.inputs.perKg}
          helper={labels.inputs.costHelper}
        />

        <NumberField
          id="loss"
          label={labels.inputs.loss}
          value={lossText}
          onChange={onLossChange}
          suffix="%"
          helper={labels.inputs.lossHelper}
          step="0.1"
        />

        <div className="rounded-2xl border border-white/5 bg-[#0c1526] p-4">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="interest" className={labelClass}>
              {labels.inputs.loanInterest}
            </label>
            <span className="text-sm font-semibold text-orange-200">
              {interestText}%
            </span>
          </div>
          <input
            id="interest"
            type="range"
            min={0}
            max={36}
            step={1}
            value={interestText === "" ? 0 : Number(interestText)}
            onChange={(event) => onInterestChange(event.target.value)}
            className="mt-4 w-full cursor-pointer accent-orange-400"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-500">
            <span>0%</span><span>36%</span>
          </div>
          <p className={helperClass}>{labels.inputs.interestHelper}</p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0c1526] p-4">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="inflation" className={labelClass}>
              {labels.inputs.inflation}
            </label>
            <span className="text-sm font-semibold text-teal-200">
              {inflationText}%
            </span>
          </div>
          <input
            id="inflation"
            type="range"
            min={0}
            max={30}
            step={1}
            value={inflationText === "" ? 0 : Number(inflationText)}
            onChange={(event) => onInflationChange(event.target.value)}
            className="mt-4 w-full cursor-pointer accent-teal-400"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-500">
            <span>0%</span><span>30%</span>
          </div>
          <p className={helperClass}>{labels.inputs.inflationHelper}</p>
        </div>
      </div>

      <div className="mt-6 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={() => onMoreOptionsChange(!moreOptions)}
          aria-expanded={moreOptions}
          className="flex w-full items-center justify-between rounded-xl py-2 text-left text-sm font-semibold text-teal-200 transition hover:text-teal-100"
        >
          <span>{moreOptions ? labels.inputs.lessOptions : labels.inputs.moreOptions}</span>
          <span aria-hidden="true">{moreOptions ? "−" : "+"}</span>
        </button>
        {moreOptions && (
          <div className="mt-3 max-w-md">
            <NumberField
              id="cash-needed"
              label={labels.inputs.cashNeeded}
              value={cashText}
              onChange={onCashChange}
              suffix={labels.thousands}
              helper={labels.inputs.cashHelper}
            />
          </div>
        )}
      </div>
    </div>
  );
}
