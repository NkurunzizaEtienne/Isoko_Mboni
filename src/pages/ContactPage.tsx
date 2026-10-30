import { useState, type FormEvent } from "react";
import { CONTACT, CONTACT_PAGE } from "../siteContent";
function ContactIcon({ type }: { type: "mail" | "phone" | "pin" }) {
 const d = type==="mail"?"M3 5h18v14H3z M3 6l9 7 9-7":type==="phone"?"M6 3h4l2 5-3 2a15 15 0 0 0 5 5l2-3 5 2v4c0 1-1 2-2 2C10 20 4 14 4 5c0-1 1-2 2-2Z":"M12 21s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12Z M12 9h.01";
 return <svg viewBox="0 0 24 24" className="h-5 w-5 text-leaf-300" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;
}
export default function ContactPage() {
 const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [message,setMessage]=useState(""); const [error,setError]=useState("");
 function submit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  if(!name.trim()||!email.trim()||!message.trim()){setError("Complete all fields before continuing.");return;}
  const subject=encodeURIComponent(`Isoko Mboni message from ${name.trim()}`);
  const body=encodeURIComponent(`${message.trim()}\n\nFrom: ${email.trim()}`);
  window.location.href=`mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
 }
 return <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[.9fr_1.1fr]">
  <div><h1 className="font-display text-4xl text-white sm:text-5xl">{CONTACT_PAGE.title}</h1><p className="mt-4 max-w-lg text-base leading-relaxed text-slate-300">{CONTACT_PAGE.subtitle}</p><h2 className="mt-10 text-xs font-semibold uppercase tracking-widest text-leaf-300">{CONTACT_PAGE.detailsTitle}</h2><div className="mt-4 space-y-3">
   <a href={`mailto:${CONTACT.email}`} className="glass flex min-h-16 items-center gap-4 rounded-xl p-4"><ContactIcon type="mail"/><span className="text-sm text-slate-200">{CONTACT.email}</span></a>
   <a href={`tel:${CONTACT.phone}`} className="glass flex min-h-16 items-center gap-4 rounded-xl p-4"><ContactIcon type="phone"/><span className="text-sm text-slate-200">{CONTACT.phone}</span></a>
   <div className="glass flex min-h-16 items-center gap-4 rounded-xl p-4"><ContactIcon type="pin"/><span className="text-sm text-slate-200">{CONTACT.location}</span></div>
  </div></div>
  <form onSubmit={submit} className="glass rounded-2xl p-6 sm:p-8"><h2 className="font-display text-2xl text-white">{CONTACT_PAGE.formTitle}</h2>
   <label className="mt-6 block text-sm text-slate-200" htmlFor="contact-name">{CONTACT_PAGE.nameLabel}</label><input id="contact-name" required value={name} onChange={e=>setName(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-ink-950/60 px-4 text-white outline-none focus-visible:ring-2 focus-visible:ring-leaf-400"/>
   <label className="mt-4 block text-sm text-slate-200" htmlFor="contact-email">{CONTACT_PAGE.emailLabel}</label><input id="contact-email" type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-ink-950/60 px-4 text-white outline-none focus-visible:ring-2 focus-visible:ring-leaf-400"/>
   <label className="mt-4 block text-sm text-slate-200" htmlFor="contact-message">{CONTACT_PAGE.messageLabel}</label><textarea id="contact-message" required rows={5} value={message} onChange={e=>setMessage(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-ink-950/60 px-4 py-3 text-white outline-none focus-visible:ring-2 focus-visible:ring-leaf-400"/>
   {error&&<p role="alert" className="mt-3 text-sm text-clay-400">{error}</p>}<button type="submit" className="mt-5 min-h-12 rounded-full bg-leaf-400 px-6 font-semibold text-ink-950 hover:bg-leaf-300">{CONTACT_PAGE.submit}</button><p className="mt-4 text-xs leading-5 text-slate-400">{CONTACT_PAGE.note}</p>
  </form>
 </div>;
}
