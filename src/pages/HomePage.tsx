import { useEffect, useMemo, useState } from "react";
import { loadAll } from "../lib/loadData";
import type { SeasonalFile } from "../types";
import { HERO, HOW_IT_WORKS, WHY, AUDIENCE, CTA_BAND } from "../siteContent";

function LineIcon({ kind }: { kind: number }) {
 const paths = ["M4 18 10 12l4 4 6-9M4 5v14h16", "M12 3v18m-8-9h16M5 5l14 14", "M4 19h16M6 16l3-5 3 2 5-8"];
 return <svg viewBox="0 0 24 24" className="h-6 w-6 text-leaf-300" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d={paths[kind%paths.length]}/></svg>;
}
export default function HomePage() {
 const [seasonal,setSeasonal]=useState<SeasonalFile|null>(null);
 useEffect(()=>{let live=true; void loadAll().then(d=>{if(live)setSeasonal(d.seasonal);}).catch(()=>{if(live)setSeasonal(null);}); return ()=>{live=false;};},[]);
 const values=useMemo(()=>Array.from({length:12},(_,i)=>seasonal?.items.find(x=>x.crop_id==="irish-potato"&&x.cal_month===i+1)?.avg_price).filter((x):x is number=>typeof x==="number"&&Number.isFinite(x)),[seasonal]);
 const points=useMemo(()=>{
  if(values.length!==12)return "M20 95 C70 25 110 110 160 70 S260 35 300 65 S380 110 420 45";
  const all=Array.from({length:12},(_,i)=>seasonal?.items.find(x=>x.crop_id==="irish-potato"&&x.cal_month===i+1)?.avg_price ?? Math.min(...values));
  const min=Math.min(...all),max=Math.max(...all),range=max-min||1;
  return all.map((v,i)=>`${i===0?"M":"L"} ${20+i*36} ${105-((v-min)/range)*75}`).join(" ");
 },[seasonal,values]);
 return <div className="overflow-hidden">
  <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.08fr_.92fr]">
   <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-leaf-500/10 blur-3xl"/><div className="pointer-events-none absolute right-10 top-20 h-64 w-64 rounded-full bg-sun-400/10 blur-3xl"/>
   <div className="relative animate-fade-up">
    <p className="inline-flex rounded-full border border-leaf-400/20 bg-leaf-400/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-leaf-300">{HERO.eyebrow}</p>
    <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">{HERO.titleLine1}<br/><span className="text-gradient">{HERO.titleLine2}</span></h1>
    <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300">{HERO.subtitle}</p>
    <div className="mt-8 flex flex-wrap gap-3"><a href="#desk" className="inline-flex min-h-12 items-center rounded-full bg-leaf-400 px-6 font-semibold text-ink-950 hover:bg-leaf-300">{HERO.ctaPrimary}</a><a href="#how-it-works" className="inline-flex min-h-12 items-center rounded-full border border-white/15 px-6 font-semibold text-white hover:bg-white/5">{HERO.ctaSecondary}</a></div>
    <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">{HERO.stats.map(s=><div key={s.label} className="glass rounded-xl p-3"><p className="font-display text-2xl tabular-nums text-white">{s.value}</p><p className="mt-1 text-xs leading-4 text-slate-400">{s.label}</p></div>)}</div>
   </div>
   <div className="relative animate-float"><div className="glass rounded-3xl p-5 shadow-2xl shadow-black/20 sm:p-7"><div className="flex items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-[.14em] text-leaf-300">Market signal</p><h2 className="mt-2 font-display text-2xl text-white">Irish potato</h2></div><span className="rounded-full bg-sun-400/10 px-3 py-1 text-xs text-sun-300">Seasonal view</span></div><p className="mt-2 text-sm leading-6 text-slate-400">{HERO.previewCaption}</p><svg viewBox="0 0 440 140" className="mt-6 w-full" role="img" aria-label="Illustrative seasonal price curve"><defs><linearGradient id="priceArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#86efac" stopOpacity=".25"/><stop offset="1" stopColor="#86efac" stopOpacity="0"/></linearGradient></defs><path d={`${points} L 416 120 L 20 120 Z`} fill="url(#priceArea)"/><path d={points} fill="none" stroke="#a7f3d0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>{Array.from({length:12},(_,i)=><text key={i} x={20+i*36} y="137" textAnchor="middle" fill="#94a3b8" fontSize="9">{["J","F","M","A","M","J","J","A","S","O","N","D"][i]}</text>)}</svg><p className="mt-3 text-xs text-slate-500">{seasonal?"Based on seasonal.json":"Preview curve — seasonal data unavailable."}</p></div></div>
  </section>
  <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6"><div className="max-w-2xl"><h2 className="font-display text-3xl text-white sm:text-4xl">{HOW_IT_WORKS.title}</h2><p className="mt-3 text-base leading-relaxed text-slate-300">{HOW_IT_WORKS.intro}</p></div><div className="mt-8 grid gap-4 md:grid-cols-3">{HOW_IT_WORKS.steps.map((s,i)=><article key={s.title} className="glass rounded-2xl p-6 transition hover:-translate-y-1"><p className="font-display text-5xl text-leaf-300">0{i+1}</p><h3 className="mt-5 text-lg font-semibold text-white">{s.title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{s.text}</p></article>)}</div></section>
  <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6"><h2 className="font-display text-3xl text-white sm:text-4xl">{WHY.title}</h2><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{WHY.items.map((item,i)=><article key={item.title} className="glass rounded-2xl p-5"><LineIcon kind={i}/><h3 className="mt-4 font-semibold text-white">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p></article>)}</div></section>
  <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6"><h2 className="font-display text-3xl text-white">{AUDIENCE.title}</h2><div className="mt-5 flex flex-wrap gap-3">{AUDIENCE.items.map(x=><span key={x} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">{x}</span>)}</div></section>
  <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6"><div className="glass relative overflow-hidden rounded-3xl p-8 sm:p-12"><div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-leaf-400/10 blur-3xl"/><div className="relative max-w-2xl"><h2 className="font-display text-3xl text-white sm:text-4xl">{CTA_BAND.title}</h2><p className="mt-4 text-base leading-relaxed text-slate-300">{CTA_BAND.text}</p><a href="#desk" className="mt-7 inline-flex min-h-12 items-center rounded-full bg-leaf-400 px-6 font-semibold text-ink-950">{CTA_BAND.button}</a></div></div></section>
 </div>;
}
