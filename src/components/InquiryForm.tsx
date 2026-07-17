"use client";

import { useState } from "react";
import { Minus, Plus, Loader2, Check, CalendarDays, Users, MessageSquare, PartyPopper } from "lucide-react";
import { tours } from "@/data/tours";
import { cn } from "@/lib/utils";

type Mode = "booking" | "contact";

type InquiryFormProps = {
  mode?: Mode;
  lockedTourName?: string;
  defaultTourName?: string;
  className?: string;
  submitLabel?: string;
  /** Single-column layout for narrow containers (e.g. the sticky booking sidebar). */
  compact?: boolean;
};

const inputCls =
  "w-full rounded-xl border border-ink/15 bg-sand-50 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-jungle-500 focus:ring-2 focus:ring-jungle-500/30 placeholder:text-ink-faint";
const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-soft";

export function InquiryForm({
  mode = "booking",
  lockedTourName,
  defaultTourName,
  className,
  submitLabel,
  compact = false,
}: InquiryFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tour, setTour] = useState(lockedTourName ?? defaultTourName ?? "");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(3);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot — real users leave this empty
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const rowCls = cn("grid gap-4", !compact && "sm:grid-cols-2");

  
async function onSubmit(e: React.FormEvent) {
  e.preventDefault();

  setState("loading");
  setError("");

  try {
    const selectedTour =
      tours.find((t) => t.name === tour) ??
      tours.find((t) => t.name === lockedTourName);

    if (!selectedTour) {
      throw new Error("Tour not found.");
    }

    const res = await fetch("/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tourName: selectedTour.name,
        amount: selectedTour.price,
        name,
        email,
        phone,
        date,
        guests,
        message,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Payment initialization failed.");
    }

    sessionStorage.setItem(
  "pendingBooking",
  JSON.stringify({
    name,
    email,
    phone,
    tour: selectedTour.name,
    date,
    guests,
    message,
    amount: selectedTour.price,
    orderId: data.orderId,
  })
);

window.location.href = data.paymentUrl; 
  } catch (err) {
    setState("error");
    setError(
      err instanceof Error ? err.message : "Something went wrong."
    );
  }
}
  if (state === "done") {
    return (
      <div className={cn("rounded-3xl bg-jungle-800 p-8 text-center text-white", className)}>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-coral-500">
          <PartyPopper className="h-7 w-7" />
        </div>
        <h3 className="text-2xl text-white">Request received!</h3>
        <p className="mt-2 text-sm text-white/80">
          Thanks, {name.split(" ")[0] || "friend"}. A real person in Placencia will get back to you within 24 hours to
          confirm the details. Keep an eye on your inbox.
        </p>
        <button
          type="button"
          onClick={() => {
            setState("idle");
            setMessage("");
          }}
          className="btn btn-white mt-6"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-4", className)}>
      {/* Honeypot — visually hidden, ignored by humans */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="if-company">Company</label>
        <input id="if-company" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
      </div>

      <div className={rowCls}>
        <div>
          <label className={labelCls} htmlFor="if-name">Full name</label>
          <input id="if-name" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} required placeholder="Jane Traveler" />
        </div>
        <div>
          <label className={labelCls} htmlFor="if-email">Email</label>
          <input id="if-email" type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@email.com" />
        </div>
      </div>

      <div className={rowCls}>
        <div>
          <label className={labelCls} htmlFor="if-phone">Phone / WhatsApp <span className="font-medium normal-case text-ink-faint">(optional)</span></label>
          <input id="if-phone" className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 123 4567" />
        </div>
        {mode === "contact" ? (
          <div>
            <label className={labelCls} htmlFor="if-subject">Subject <span className="font-medium normal-case text-ink-faint">(optional)</span></label>
            <input id="if-subject" className={inputCls} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Trip planning, custom tour…" />
          </div>
        ) : (
          <div>
            <label className={labelCls} htmlFor="if-date"><CalendarDays className="mr-1 inline h-3.5 w-3.5" /> Preferred date</label>
            <input id="if-date" type="date" min={today} required={mode === "booking"} className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        )}
      </div>

      {mode === "booking" && (
        <div className={rowCls}>
          <div>
            <label className={labelCls} htmlFor="if-tour">Tour</label>
            {lockedTourName ? (
              <input
                id="if-tour"
                readOnly
                value={lockedTourName}
                className="w-full rounded-xl border border-jungle-500/30 bg-jungle-50 px-4 py-2.5 text-sm font-semibold text-jungle-800"
              />
            ) : (
              <select id="if-tour" className={inputCls} value={tour} onChange={(e) => setTour(e.target.value)} required>
                <option value="">Choose an adventure…</option>
                <optgroup label="Full Day">
                  {tours.filter((t) => t.category === "Full Day").map((t) => (
                    <option key={t.slug} value={t.name}>{t.name} — ${t.price}</option>
                  ))}
                </optgroup>
                <optgroup label="Half Day">
                  {tours.filter((t) => t.category === "Half Day").map((t) => (
                    <option key={t.slug} value={t.name}>{t.name} — ${t.price}</option>
                  ))}
                </optgroup>
              </select>
            )}
          </div>
          <div>
            <span id="if-guests-label" className={labelCls}><Users className="mr-1 inline h-3.5 w-3.5" /> Guests</span>
            <div role="group" aria-labelledby="if-guests-label" className="flex items-center justify-between rounded-xl border border-ink/15 bg-sand-50 px-2 py-1.5">
              <button type="button" aria-label="Fewer guests" onClick={() => setGuests((g) => Math.max(3, g - 1))} disabled={guests <= 3} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-ink shadow-sm transition hover:bg-jungle-50 disabled:cursor-not-allowed disabled:opacity-50">
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-base font-bold text-ink" aria-live="polite">{guests}</span>
              <button type="button" aria-label="More guests" onClick={() => setGuests((g) => Math.min(20, g + 1))} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-ink shadow-sm transition hover:bg-jungle-50">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <label className={labelCls} htmlFor="if-message">
          <MessageSquare className="mr-1 inline h-3.5 w-3.5" />
          {mode === "contact" ? "Your message" : "Anything we should know?"}
          {mode === "booking" && <span className="font-medium normal-case text-ink-faint"> (optional)</span>}
        </label>
        <textarea
          id="if-message"
          className={cn(inputCls, "min-h-[96px] resize-y")}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required={mode === "contact"}
          placeholder={mode === "contact" ? "Tell us what you're dreaming up…" : "Hotel name, kids' ages, dietary needs, special requests…"}
        />
      </div>

      {state === "error" && <p className="text-sm font-semibold text-coral-600">{error}</p>}

      <button type="submit" disabled={state === "loading"} className="btn btn-primary w-full">
        {state === "loading" ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            {
  submitLabel ??
  (mode === "contact"
    ? "Send Message"
    : "Pay & Book Now")
}
            <Check className="h-4 w-4" />
          </>
        )}
      </button>
      <p className="text-center text-xs text-ink-faint">
        Secure payment powered by Belize Bank. Your booking will be confirmed after successful payment.
      </p>
    </form>
  );
}
