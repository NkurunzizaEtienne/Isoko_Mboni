
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { labels } from "../labels";
import type { HistoryPoint, OutlookItem } from "../types";

type ChartPoint = {
  month: string;
  historical?: number;
  expected?: number;
  low?: number;
  high?: number;
};

type PriceChartProps = {
  cropName: string;
  points: HistoryPoint[];
  outlook?: OutlookItem;
  priceNow?: number;
  months: number;
  hasHistory: boolean;
  marketLabel: string;
};

function formatRwf(value: number): string {
  return new Intl.NumberFormat("en-RW", {
    maximumFractionDigits: 1,
  }).format(value);
}

function displayMonth(month: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(month);
  if (!match) return month;

  const date = new Date(Number(match[1]), Number(match[2]) - 1, 1);
  return date.toLocaleDateString("en", {
    month: "short",
    year: "2-digit",
  });
}

export function PriceChart({
  cropName,
  points,
  outlook,
  priceNow,
  months,
  hasHistory,
  marketLabel,
}: PriceChartProps) {
  const orderedPoints = [...points].sort((a, b) =>
    a.month.localeCompare(b.month),
  );

  const chartData: ChartPoint[] = orderedPoints.map((point) => ({
    month: point.month,
    historical: point.price,
  }));

  let outlookMonth: string | undefined;
  let expectedPrice: number | undefined;

  if (outlook && priceNow !== undefined && Number.isFinite(priceNow)) {
    const lastMonth = orderedPoints[orderedPoints.length - 1]?.month;
    const match = lastMonth ? /^(\d{4})-(\d{2})$/.exec(lastMonth) : null;

    if (match) {
      const futureDate = new Date(
        Number(match[1]),
        Number(match[2]) - 1 + months,
        1,
      );

      outlookMonth = `${futureDate.getFullYear()}-${String(
        futureDate.getMonth() + 1,
      ).padStart(2, "0")}`;

      expectedPrice = priceNow * (1 + outlook.expected_change_pct / 100);

      chartData.push({
        month: outlookMonth,
        expected: expectedPrice,
        low: priceNow * (1 + outlook.low_change_pct / 100),
        high: priceNow * (1 + outlook.high_change_pct / 100),
      });
    }
  }

  return (
    <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">
            Market history
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            {labels.chart.title}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {cropName} · {marketLabel}
          </p>
        </div>
        <p className="text-xs leading-5 text-slate-500">Prices in RWF/kg</p>
      </div>

      {!hasHistory ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center sm:p-8">
          <p className="font-semibold text-slate-800">
            {labels.chart.noHistory}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            You can enter a current price manually, but the historical chart
            remains unavailable until price history exists.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-5 h-72 w-full sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 12, right: 10, left: 0, bottom: 8 }}
              >
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                <XAxis
                  dataKey="month"
                  tickFormatter={displayMonth}
                  minTickGap={28}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickLine={false}
                />
                <YAxis
                  width={68}
                  tickFormatter={(value: number) => formatRwf(value)}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  labelFormatter={(value) => displayMonth(String(value))}
                  formatter={(value, name) => [
                    value == null ? "—" : `${formatRwf(Number(value))} RWF/kg`,
                    name === "historical"
                      ? labels.chart.history
                      : name === "expected"
                        ? labels.chart.expected
                        : name === "low"
                          ? "Lower outlook bound"
                          : name === "high"
                            ? "Upper outlook bound"
                            : String(name),
                  ]}
                  contentStyle={{
                    borderRadius: 12,
                    borderColor: "#e2e8f0",
                    fontSize: 12,
                  }}
                />
                <Legend
                  formatter={(value) =>
                    value === "historical"
                      ? labels.chart.history
                      : value === "expected"
                        ? labels.chart.expected
                        : value === "low"
                          ? "Lower outlook bound"
                          : value === "high"
                            ? "Upper outlook bound"
                            : value
                  }
                />

                <Line
                  type="monotone"
                  dataKey="historical"
                  name="historical"
                  stroke="#047857"
                  strokeWidth={2.5}
                  dot={false}
                  connectNulls={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="low"
                  name="low"
                  stroke="#d97706"
                  strokeDasharray="5 5"
                  strokeWidth={1.5}
                  dot={false}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="high"
                  name="high"
                  stroke="#d97706"
                  strokeDasharray="5 5"
                  strokeWidth={1.5}
                  dot={false}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="expected"
                  name="expected"
                  stroke="#2563eb"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 5, fill: "#2563eb" }}
                  connectNulls={false}
                />

                {outlookMonth && expectedPrice !== undefined && (
                  <ReferenceDot
                    x={outlookMonth}
                    y={expectedPrice}
                    r={5}
                    fill="#2563eb"
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="mt-3 text-xs leading-5 text-slate-500">
            {labels.chart.note} The dotted outlook is plotted {months}{" "}
            {months === 1 ? "month" : "months"} after the latest historical point
            to illustrate the selected storage horizon. It is an estimate, not a
            market-specific forecast.
          </p>
        </>
      )}
    </section>
  );
}
