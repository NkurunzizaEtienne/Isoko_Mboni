import type { BacktestFile, CropsFile, HistoryFile, OutlookFile, SeasonalFile } from "../types";

async function getJson<T>(name: string): Promise<T> {
  const res = await fetch(`${import.meta.env.BASE_URL}data/${name}`);
  if (!res.ok) throw new Error(`Could not load ${name}`);
  return (await res.json()) as T;
}

export async function loadAll() {
  const [crops, history, outlook, seasonal, backtest] = await Promise.all([
    getJson<CropsFile>("crops.json"),
    getJson<HistoryFile>("history.json"),
    getJson<OutlookFile>("outlook.json"),
    getJson<SeasonalFile>("seasonal.json"),
    getJson<BacktestFile>("backtest.json"),
  ]);
  return { crops, history, outlook, seasonal, backtest };
}