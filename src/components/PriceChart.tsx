
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { HistoryPoint } from "../mockData";
import { labels } from "../labels";

type Props = {
  points: HistoryPoint[];
  currentPrice: number | null;
  expectedPrice: number | null;
  lowPrice: number | null;
  highPrice: number | null;
  months: number;
  enoughData: boolean;
};

type ChartPoint = {
  month: string;
  price: number | null;
  outlookLow: number | null;
  outlookHigh: number | null;
};

function formatMonth(value: string): string {
  const [year, month] = value.split("-");
  return `${labels.monthsShort[Number(month) - 1]} '${year.slice(-2)}`;
}

function formatPrice(value: number): string {
  return `${Math.round(value).toLocaleString("en-RW")} RWF`;
}

export default function PriceChart({
  points,
  currentPrice,
  expectedPrice,
  lowPrice,
  highPrice,
  months,
  enoughData,
}: Props) {
  const history = points
    .filter((point) => Number.isFinite(point.price) && point.price > 0)
    .map((point) => ({
      month: point.month,
      price: point.price,
      outlookLow: null,
      outlookHigh: null,
    }));

  const chartData: ChartPoint[] = [...history];

  if (
    enoughData &&
    history.length > 0 &&
    expectedPrice !== null &&
    lowPrice !== null &&
    highPrice !== null
  ) {
    const lastMonth = history[history.length - 1].month;
    const [yearString, monthString] = lastMonth.split("-");
    const futureDate = new Date(
      Number(yearString),
      Number(monthString) - 1 + months,
      1,
    );
    const futureMonth = `${futureDate.getFullYear()}-${String(
      futureDate.getMonth() + 1,
    ).padStart(2, "0")}`;

    chartData.push({
      month: futureMonth,
      price: null,
      outlookLow: lowPrice,
      outlookHigh: highPrice,
    });
  }

  return (
    <section className="chart-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">PRICE MOVEMENT</p>
          <h2>{labels.historyTitle}</h2>
        </div>
      </div>

      <div className="chart-legend">
        <span><i className="legend-dot history-dot" />{labels.history}</span>
        <span><i className="legend-dot outlook-dot" />{labels.outlook}</span>
      </div>

      {!history.length ? (
        <div className="empty-chart">
          <p>{labels.noHistory}</p>
        </div>
      ) : (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 8, bottom: 4, left: 0 }}
            >
              <CartesianGrid stroke="#e8ece7" strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickFormatter={formatMonth}
                minTickGap={32}
                tick={{ fill: "#69756c", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                width={54}
                tickFormatter={(value: number) => `${Math.round(value)}`}
                tick={{ fill: "#69756c", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                labelFormatter={(value) => formatMonth(String(value))}
                formatter={(value, name) => [
                  value === null || value === undefined
                    ? "—"
                    : formatPrice(Number(value)),
                  name === "price"
                    ? labels.history
                    : name === "outlookLow"
                      ? "Outlook lower estimate"
                      : "Outlook upper estimate",
                ]}
              />
              {currentPrice !== null && (
                <ReferenceLine
                  y={currentPrice}
                  stroke="#a8b1a9"
                  strokeDasharray="4 4"
                />
              )}
              <Line
                type="monotone"
                dataKey="price"
                stroke="#286447"
                strokeWidth={2}
                dot={false}
                connectNulls={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="outlookLow"
                stroke="#d69a42"
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={false}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="outlookHigh"
                stroke="#d69a42"
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={false}
                connectNulls={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      <p className="chart-caption">
        Historical prices are observations. The outlook range is an estimate
        for the selected storage period, not a month-by-month prediction.
      </p>
    </section>
  );
}
