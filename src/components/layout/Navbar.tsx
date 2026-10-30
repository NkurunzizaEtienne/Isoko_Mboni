import { useEffect, useState } from "react";
import { NAV, SITE } from "../../siteContent";
import type { Route } from "../../lib/useHashRoute";

export default function Navbar({ route }: { route: Route }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [route]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return <header className="glass-strong sticky top-0 z-40 border-b border-white/10">
    <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-ink-800 focus:p-3">Skip to content</a>
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
      <a href="#home" className="flex items-center gap-2 text-white" aria-label={SITE.brand}>
        <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" aria-hidden="true"><path d="M20 32V17m0 7c-9 0-13-5-13-12 8 0 13 4 13 12Zm0-5c0-8 5-13 13-13 0 8-5 13-13 13Z" stroke="#86efac" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/><circle cx="20" cy="32" r="3" fill="#fbbf24"/></svg>
        <span className="font-display text-xl">{SITE.brand}</span>
      </a>
      <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
        {NAV.map(item => <a key={item.route} href={`#${item.route}`} aria-current={route===item.route?"page":undefined} className={`rounded-full px-4 py-2 text-sm transition ${route===item.route?"bg-white/10 text-leaf-300":"text-slate-300 hover:bg-white/5 hover:text-white"}`}>{item.label}</a>)}
      </nav>
      <div className="flex items-center gap-3">
        {route!=="desk" && <a href="#desk" className="hidden min-h-11 items-center rounded-full bg-leaf-400 px-4 text-sm font-semibold text-ink-950 transition hover:bg-leaf-300 sm:inline-flex">Open Isoko Desk</a>}
        <button type="button" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-white/10 text-white md:hidden" aria-label={open?"Close menu":"Open menu"} aria-expanded={open} onClick={()=>setOpen(v=>!v)}>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"><path d={open?"M6 6l12 12M18 6 6 18":"M4 7h16M4 12h16M4 17h16"}/></svg>
        </button>
      </div>
    </div>
    {open && <nav className="glass-strong absolute inset-x-3 top-[4.25rem] rounded-2xl border border-white/10 p-3 md:hidden" aria-label="Mobile navigation">
      {NAV.map(item=><a key={item.route} href={`#${item.route}`} aria-current={route===item.route?"page":undefined} className="block min-h-12 rounded-xl px-4 py-3 text-base text-white hover:bg-white/10">{item.label}</a>)}
    </nav>}
  </header>;
}
