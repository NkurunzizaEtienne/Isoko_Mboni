
import { labels } from "../labels";

type Props = {
  yearsOfData: number;
  confidence: "low" | "medium" | "high" | null;
  start: string;
  end: string;
};

export default function DataNotice({
  yearsOfData,
  confidence,
  start,
  end,
}: Props) {
  const confidenceLabel =
    confidence === "high"
      ? "High"
      : confidence === "medium"
        ? "Medium"
        : confidence === "low"
          ? "Low"
          : labels.notEnough;

  return (
    <section className="data-notice">
      <div className="notice-heading">
        <span className="notice-icon" aria-hidden="true">i</span>
        <div>
          <h2>{labels.dataNotice}</h2>
          <p>Understand the evidence behind this estimate.</p>
        </div>
      </div>

      <div className="notice-stats">
        <div>
          <span>{labels.years}</span>
          <strong>
            {yearsOfData > 0 ? `${yearsOfData} years` : labels.notEnough}
          </strong>
        </div>
        <div>
          <span>{labels.confidence}</span>
          <strong className={`confidence-${confidence ?? "unknown"}`}>
            {confidenceLabel}
          </strong>
        </div>
      </div>

      <p className="notice-range">
        Dataset coverage: {start} to {end}. Coverage does not mean every
        crop and market has observations for every month.
      </p>

      <p className="notice-source">
        <strong>{labels.source}:</strong> {labels.sourceName}
      </p>

      <p className="notice-warning">
        Only a few years of data are available. Seasonal patterns can change,
        and future prices may differ from historical patterns.
      </p>
    </section>
  );
}
