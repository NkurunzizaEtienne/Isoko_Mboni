
import type { Crop } from "../mockData";
import type { UserInputs } from "../App";
import { labels } from "../labels";

type Props = {
  crops: Crop[];
  inputs: UserInputs;
  onChange: (inputs: UserInputs) => void;
  onCompare: () => void;
};

export default function InputsPanel({
  crops,
  inputs,
  onChange,
  onCompare,
}: Props) {
  const selectedCrop = crops.find((crop) => crop.id === inputs.cropId);
  const markets = selectedCrop?.markets ?? ["national"];

  function update<K extends keyof UserInputs>(
    key: K,
    value: UserInputs[K],
  ) {
    onChange({ ...inputs, [key]: value });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !Number.isFinite(inputs.storageCost) ||
      inputs.storageCost < 0 ||
      !Number.isFinite(inputs.lossPct) ||
      inputs.lossPct < 0 ||
      inputs.lossPct > 100
    ) {
      return;
    }

    onCompare();
  }

  return (
    <section className="input-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">STEP 01</p>
          <h2>{labels.inputsTitle}</h2>
        </div>
        <span className="step-count">01 / 02</span>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="field">
          <span>{labels.crop}</span>
          <select
            value={inputs.cropId}
            onChange={(event) => update("cropId", event.target.value)}
          >
            {crops.map((crop) => (
              <option key={crop.id} value={crop.id}>
                {crop.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>{labels.market}</span>
          <select
            value={inputs.market}
            onChange={(event) => update("market", event.target.value)}
          >
            {markets.map((market) => (
              <option key={market} value={market}>
                {market === "national" ? labels.national : market}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>{labels.harvestMonth}</span>
          <select
            value={inputs.harvestMonth}
            onChange={(event) =>
              update("harvestMonth", Number(event.target.value))
            }
          >
            {labels.monthsShort.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </label>

        <div className="field">
          <div className="field-label-row">
            <label htmlFor="storage-months">{labels.storageMonths}</label>
            <output className="range-value">
              {inputs.storageMonths} {labels.months}
            </output>
          </div>
          <input
            id="storage-months"
            type="range"
            min="1"
            max="6"
            step="1"
            value={inputs.storageMonths}
            onChange={(event) =>
              update("storageMonths", Number(event.target.value))
            }
          />
          <div className="range-labels">
            <span>1 month</span>
            <span>6 months</span>
          </div>
        </div>

        <label className="field">
          <span>{labels.storageCost}</span>
          <div className="input-with-unit">
            <input
              type="number"
              min="0"
              step="0.5"
              required
              value={inputs.storageCost}
              onChange={(event) =>
                update("storageCost", Number(event.target.value))
              }
            />
            <span>{labels.currency}/kg/mo</span>
          </div>
          <small>{labels.storageCostHelp}</small>
        </label>

        <label className="field">
          <span>{labels.expectedLoss}</span>
          <div className="input-with-unit">
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              required
              value={inputs.lossPct}
              onChange={(event) =>
                update("lossPct", Number(event.target.value))
              }
            />
            <span>%</span>
          </div>
          <small>{labels.expectedLossHelp}</small>
        </label>

        <button className="primary-button" type="submit">
          {labels.calculate}
          <span aria-hidden="true">→</span>
        </button>

        <p className="form-footnote">
          Change the assumptions to reflect your own storage situation.
        </p>
      </form>
    </section>
  );
}
