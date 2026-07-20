"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Mail,
  Minus,
  Plus,
  Send,
  X,
} from "lucide-react";
import { company } from "@/data/site";
import { tours, type Tour, type TourCategory } from "@/data/tours";
import { SmartImage } from "@/components/SmartImage";
import { cn } from "@/lib/utils";

const GROUPS: { category: TourCategory; kicker: string; title: string; description: string }[] = [
  {
    category: "Full Day",
    kicker: "Chapter 01",
    title: "Big days in wild Belize",
    description: "Maya cities, jungle rivers, waterfalls, and the long, memorable days that connect them.",
  },
  {
    category: "Half Day",
    kicker: "Chapter 02",
    title: "Quick escapes, lasting stories",
    description: "Make room for a little wild between beach mornings and sunset dinners in Placencia.",
  },
  {
    category: "Multi-day",
    kicker: "Ready-made",
    title: "Multi-day adventure packages",
    description: "Curated multi-stop journeys when you would rather let our local team handle the logistics.",
  },
];

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function routeMessage(route: Tour[], travelers: number, details: Record<string, string>) {
  const stops = route.map((tour, index) => `${index + 1}. ${tour.name} — ${money.format(tour.price)} per person`).join("\n");
  const total = route.reduce((sum, tour) => sum + tour.price, 0) * travelers;
  return [
    "Custom route request — Wilder Belize Adventures",
    "",
    `Name: ${details.name || "Not provided"}`,
    `Email: ${details.email || "Not provided"}`,
    `Phone / WhatsApp: ${details.phone || "Not provided"}`,
    `Travelers: ${travelers}`,
    `Preferred date(s): ${details.date || "Not provided"}`,
    `Pickup location: ${details.pickup || "Not provided"}`,
    "",
    "Route:",
    stops,
    "",
    `Estimated total: ${money.format(total)}`,
    `Notes: ${details.notes || "None"}`,
  ].join("\n");
}

export function RouteBuilder() {
  const [route, setRoute] = useState<Tour[]>([]);
  const [travelers, setTravelers] = useState(2);
  const [formOpen, setFormOpen] = useState(false);
  const [details, setDetails] = useState({ name: "", email: "", phone: "", date: "", pickup: "", notes: "" });

  const perPerson = useMemo(() => route.reduce((sum, tour) => sum + tour.price, 0), [route]);
  const total = perPerson * travelers;

  function toggle(tour: Tour) {
    setRoute((current) => current.some((item) => item.slug === tour.slug) ? current.filter((item) => item.slug !== tour.slug) : [...current, tour]);
  }

  function openRequest() {
    if (!route.length) {
      document.getElementById("route-adventures")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setFormOpen(true);
  }

  const message = routeMessage(route, travelers, details);
  const whatsappHref = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;
  const emailHref = `mailto:${company.emails[0]}?subject=${encodeURIComponent("Custom route request")}&body=${encodeURIComponent(message)}`;

  return (
    <>
      <section className="relative overflow-hidden bg-jungle-950 pb-20 pt-36 text-white md:pb-24 md:pt-44">
        <div className="noise absolute inset-0" />
        <div className="absolute -right-24 top-8 h-80 w-80 rounded-full border border-lagoon-300/20" />
        <div className="absolute -right-8 top-24 h-56 w-56 rounded-full border border-gold-300/20" />
        <div className="container-page relative">
          <p className="kicker text-gold-300">Custom trip builder</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-5xl font-extrabold text-white md:text-7xl">Plot your own <span className="font-medium italic text-lagoon-200">route</span> through Belize.</h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">Choose the adventures that call to you. We&apos;ll review your route, confirm availability, and help shape the days into an easy, unforgettable Belize trip.</p>
              <a href="#route-adventures" className="btn btn-primary mt-8">Start building <ArrowRight className="h-4 w-4" /></a>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center sm:max-w-md lg:ml-auto">
              {[[`${tours.length}+`, "adventures"], ["100%", "locally guided"], ["1", "route, yours"]].map(([value, label]) => (
                <div key={label} className="border-l border-white/15 px-2 first:border-l-0">
                  <strong className="block font-display text-2xl text-gold-300">{value}</strong>
                  <span className="mt-1 block text-xs uppercase tracking-wide text-white/60">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main id="route-adventures" className="bg-sand-50">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-[minmax(0,1fr)_22rem] lg:py-24">
          <div className="min-w-0 space-y-16">
            {GROUPS.map((group) => {
              const groupTours = tours.filter((tour) => tour.category === group.category);
              return (
                <section key={group.category}>
                  <p className="kicker">{group.kicker}</p>
                  <h2 className="mt-2 text-3xl text-ink md:text-4xl">{group.title}</h2>
                  <p className="mt-3 max-w-2xl text-ink-soft">{group.description}</p>
                  <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {groupTours.map((tour) => {
                      const selected = route.some((item) => item.slug === tour.slug);
                      return (
                        <article key={tour.slug} className={cn("group overflow-hidden rounded-2xl border bg-white shadow-soft transition", selected ? "border-coral-500 ring-2 ring-coral-100" : "border-ink/8 hover:-translate-y-1 hover:border-jungle-300")}>
                          <div className="relative aspect-[16/9] overflow-hidden bg-jungle-100">
                            <SmartImage src={tour.image} alt={tour.name} theme={tour.theme} className="absolute inset-0" imgClassName="transition duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" />
                            <span className="absolute left-3 top-3 rounded-full bg-jungle-950/85 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">{tour.duration}</span>
                          </div>
                          <div className="p-5">
                            <h3 className="min-h-12 text-xl text-ink">{tour.name}</h3>
                            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">{tour.shortDescription}</p>
                            <div className="mt-5 flex items-center justify-between gap-3">
                              <div><strong className="text-lg text-jungle-800">{money.format(tour.price)}</strong><span className="ml-1 text-xs text-ink-faint">per person</span></div>
                              <button type="button" onClick={() => toggle(tour)} aria-pressed={selected} className={cn("flex h-10 w-10 items-center justify-center rounded-full border transition", selected ? "border-coral-500 bg-coral-500 text-white" : "border-jungle-700 text-jungle-700 hover:bg-jungle-700 hover:text-white")}>
                                {selected ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                                <span className="sr-only">{selected ? `Remove ${tour.name}` : `Add ${tour.name}`}</span>
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-3xl bg-jungle-950 p-6 text-white shadow-lift">
              <div className="flex items-start justify-between gap-4">
                <div><p className="kicker text-gold-300">Your route</p><h2 className="mt-1 text-2xl text-white">Adventure trail</h2></div>
                <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-gold-300 px-2 text-sm font-bold text-jungle-950">{route.length}</span>
              </div>
              <div className="mt-6 max-h-[38vh] space-y-4 overflow-y-auto pr-1">
                {!route.length ? <p className="border-t border-dashed border-white/20 pt-5 text-sm leading-relaxed text-white/60">Add adventures to create your own route. Your estimated total will update as you go.</p> : route.map((tour, index) => (
                  <div key={tour.slug} className="flex gap-3 border-b border-white/10 pb-4 last:border-b-0">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-300 text-[10px] font-bold text-jungle-950">{index + 1}</span>
                    <div className="min-w-0 flex-1"><p className="text-sm font-bold leading-snug text-white">{tour.name}</p><p className="mt-1 text-xs text-gold-300">{money.format(tour.price)} / person</p><button type="button" onClick={() => toggle(tour)} className="mt-2 text-xs font-semibold text-white/50 hover:text-coral-300">Remove</button></div>
                  </div>
                ))}
              </div>
              <div className="mt-5 border-t border-white/15 pt-5">
                <div className="flex items-center justify-between text-sm text-white/70"><span>Travelers</span><div className="flex items-center gap-2"><button type="button" onClick={() => setTravelers((count) => Math.max(1, count - 1))} aria-label="Fewer travelers" className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/30 hover:bg-white/10"><Minus className="h-3.5 w-3.5" /></button><span className="w-5 text-center font-bold text-white">{travelers}</span><button type="button" onClick={() => setTravelers((count) => Math.min(20, count + 1))} aria-label="More travelers" className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/30 hover:bg-white/10"><Plus className="h-3.5 w-3.5" /></button></div></div>
                <div className="mt-5 flex items-end justify-between"><span className="text-sm font-bold">Estimated total</span><strong className="font-display text-3xl text-gold-300">{money.format(total)}</strong></div>
                <p className="mt-1 text-right text-xs text-white/45">{money.format(perPerson)} per person</p>
                <button type="button" onClick={openRequest} className="btn btn-primary mt-5 w-full">Request this route <ArrowRight className="h-4 w-4" /></button>
                <p className="mt-3 text-center text-xs leading-relaxed text-white/45">This is an estimate. We&apos;ll confirm dates, availability, and your final quote before payment.</p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {formOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="route-request-title">
          <button type="button" aria-label="Close route request" onClick={() => setFormOpen(false)} className="absolute inset-0 bg-ink/70 backdrop-blur-sm" />
          <div className="relative max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-sand-50 p-6 shadow-2xl md:p-8">
            <button type="button" onClick={() => setFormOpen(false)} aria-label="Close" className="absolute right-5 top-5 rounded-xl p-2 text-ink-soft hover:bg-sand-100"><X className="h-5 w-5" /></button>
            <p className="kicker">One last step</p><h2 id="route-request-title" className="mt-2 text-3xl text-ink">Request your custom route</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">Share a few details, then send the complete route straight to our local team. We&apos;ll confirm availability and your final quote.</p>
            <div className="mt-6 rounded-2xl bg-jungle-50 p-4 text-sm"><div className="flex justify-between font-bold text-jungle-900"><span>{route.length} selected {route.length === 1 ? "adventure" : "adventures"}</span><span>{money.format(total)}</span></div><p className="mt-1 text-jungle-800/70">for {travelers} {travelers === 1 ? "traveler" : "travelers"}</p></div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {([ ["name", "Full name", "Jane Traveler", "text"], ["email", "Email", "you@email.com", "email"], ["phone", "Phone / WhatsApp", "+1 555 123 4567", "tel"], ["date", "Preferred date(s)", "", "date"], ["pickup", "Hotel / pickup location", "Resort, Airbnb, etc.", "text"] ] as const).map(([key, label, placeholder, type]) => <label key={key} className={cn("text-sm font-bold text-ink", key === "pickup" && "sm:col-span-2")}>{label}<input type={type} value={details[key]} onChange={(event) => setDetails((current) => ({ ...current, [key]: event.target.value }))} placeholder={placeholder} className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 font-normal outline-none focus:border-jungle-500 focus:ring-2 focus:ring-jungle-500/20" /></label>)}
              <label className="text-sm font-bold text-ink sm:col-span-2">Anything else we should know?<textarea value={details.notes} onChange={(event) => setDetails((current) => ({ ...current, notes: event.target.value }))} placeholder="Kids' ages, dietary needs, extra dates, or special requests" className="mt-1.5 min-h-24 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 font-normal outline-none focus:border-jungle-500 focus:ring-2 focus:ring-jungle-500/20" /></label>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2"><a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn bg-[#25D366] text-white hover:bg-[#1ebc59]"><Send className="h-4 w-4" /> Send via WhatsApp</a><a href={emailHref} className="btn btn-ghost"><Mail className="h-4 w-4" /> Send by email</a></div>
          </div>
        </div>
      )}
    </>
  );
}
