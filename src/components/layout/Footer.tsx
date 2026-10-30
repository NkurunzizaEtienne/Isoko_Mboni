import { FOOTER, NAV, SITE } from "../../siteContent";
export default function Footer() {
 return <footer className="border-t border-white/10 bg-ink-950/30">
  <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
   <div><p className="font-display text-2xl text-white">{SITE.brand}</p><p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">{FOOTER.blurb}</p></div>
   <div><h2 className="text-xs font-semibold uppercase tracking-widest text-leaf-300">{FOOTER.exploreTitle}</h2><ul className="mt-3 space-y-2">{NAV.map(n=><li key={n.route}><a className="text-sm text-slate-300 hover:text-white" href={`#${n.route}`}>{n.label}</a></li>)}</ul></div>
   <div><h2 className="text-xs font-semibold uppercase tracking-widest text-leaf-300">{FOOTER.dataTitle}</h2><ul className="mt-3 space-y-2">{FOOTER.dataItems.map(x=><li key={x} className="text-sm leading-5 text-slate-400">{x}</li>)}</ul></div>
  </div>
  <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6"><p className="border-t border-white/10 pt-4 text-xs leading-5 text-slate-500">{FOOTER.disclaimer}</p><p className="mt-3 text-xs text-slate-600">{FOOTER.copyright}</p></div>
 </footer>;
}
