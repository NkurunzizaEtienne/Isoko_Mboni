
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { labels } from "../labels";
import type { SeasonalFile } from "../types";

interface Props {
  seasonal: SeasonalFile;
  cropId: string;
  harvestMonth: number;
  bestMonth?: number;
}

function formatPrice(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

export default function PriceChart({
  seasonal,
  cropId,
  harvestMonth,
  bestMonth,
}: Props) {
  const rows = seasonal.items
    .filter((item) => item.crop_id === cropId)
    .filter((item) => Number.isFinite(item.avg_price))
    .sort((a, b) => a.cal_month - b.cal_month)
    .map((item) => ({
      monthNumber: item.cal_month,
      month: labels.shortMonths[item.cal_month - 1] ?? "",
      price: item.avg_price,
    }));

  const average = rows.length > 0
    ? rows.reduce((sum, row) => sum + row.price, 0) / rows.length
    : undefined;

  const harvestRow = rows.find((row) => row.monthNumber === harvestMonth);
  const bestRow = bestMonth
    ? rows.find((row) => row.monthNumber === bestMonth)
    : undefined;

  return (
    <section className="rounded-3xl border border-white/10 bg-[#111b2c] p-4 sm:p-7">
      <div className="mb-5">
        <h2 className="font-serif text-2xl text-white sm:text-3xl">
          {labels.chart.heading}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          {labels.chart.subtitle}
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-[#0b1425] p-5 text-sm leading-6 text-slate-300">
          {labels.chart.noSeasonalData}
        </p>
      ) : (
        <>
          <div className="h-72 w-full sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={rows}
                margin={{ top: 18, right: 14, left: 4, bottom: 6 }}
              >
                <CartesianGrid
                  stroke="#273449"
                  strokeDasharray="3 5"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  axisLine={{ stroke: "#334155" }}
                  tickLine={false}
                />
                <YAxis
                  width={66}
                  tickFormatter={formatPrice}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0b1425",
                    border: "1px solid #334155",
                    borderRadius: 12,
                    color: "#f8fafc",
                  }}
                  labelStyle={{ color: "#cbd5e1", marginBottom: 6 }}
                  formatter={(value) => [
                    `${formatPrice(Number(value))} ${labels.thousands}/kg`,
                    labels.chart.heading,
                  ]}
                />
                {average !== undefined && (
                  <ReferenceLine
                    y={average}
                    stroke="#94a3b8"
                    strokeDasharray="6 5"
                    strokeWidth={1.5}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="price"
                  name={labels.chart.heading}
                  stroke="#42d6c4"
                  strokeWidth={3}
                  dot={{ r: 3, fill: "#42d6c4", strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: "#42d6c4", stroke: "#0b1425", strokeWidth: 2 }}
                  connectNulls={false}
                />
                {harvestRow && (
                  <ReferenceDot
                    x={harvestRow.month}
                    y={harvestRow.price}
                    r={6}
                    fill="#ff817a"
                    stroke="#0b1425"
                    strokeWidth={2}
                  />
                )}
                {bestRow && bestMonth !== harvestMonth && (
                  <ReferenceDot
                    x={bestRow.month}
                    y={bestRow.price}
                    r={6}
                    fill="#42d6c4"
                    stroke="#0b1425"
                    strokeWidth={2}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t border-white/10 pt-4 text-xs text-slate-300">
            <span className="flex items-center gap-2">
              <span className="h-0.5 w-5 rounded bg-teal-300" />
              {labels.chart.heading}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-5 border-t-2 border-dashed border-slate-400" />
              {labels.chart.average}
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff817a]" />
              {labels.chart.sellAtHarvest}
            </span>
            {bestRow && bestMonth !== harvestMonth && (
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-300" />
                {labels.chart.sellAfterStoring}
              </span>
            )}
          </div>
        </>
      )}
    </section>
  );
}
