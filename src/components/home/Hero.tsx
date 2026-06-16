"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, MessageCircle, Star, MapPin, ChevronDown } from "lucide-react";
import { site } from "@/data/site";
import { HERO_IMAGES } from "@/lib/images";

const QUICK: { label: string; interest: string }[] = [
  { label: "ATV & Waterfalls", interest: "Water" },
  { label: "Cave Tubing", interest: "Water" },
  { label: "Maya Ruins", interest: "History" },
  { label: "Zip Lining", interest: "Adrenaline" },
  { label: "Wildlife", interest: "Wildlife" },
];

export function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 160]);
  const fade = useTransform(scrollY, [0, 420], [1, 0]);

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Background */}
      <motion.div style={reduce ? undefined : { y }} className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0"
          animate={reduce ? undefined : { scale: [1, 1.12] }}
          transition={{ duration: 22, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        >
          <Image src={HERO_IMAGES.coast} alt="Aerial view of the turquoise Caribbean coast at Placencia, Belize" fill priority sizes="100vw" className="object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/35 to-ink/85" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-sand-50 to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div style={reduce ? undefined : { opacity: fade }} className="container-page relative z-10 w-full pb-24 pt-32 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur ring-1 ring-white/20">
            <MapPin className="h-3.5 w-3.5 text-coral-300" /> {site.hero.kicker}
          </span>

          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[0.98] text-white drop-shadow-sm sm:text-6xl md:text-7xl lg:text-[5.2rem]">
            Roam Belize,
            <br />
            the <span className="bg-gradient-to-r from-coral-300 via-coral-400 to-gold-400 bg-clip-text text-transparent">Wilder Way</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">{site.hero.subheadline}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/tours" className="btn btn-primary h-13 px-7 text-base">
              {site.hero.ctaPrimary} <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/contact" className="btn glass h-13 px-7 text-base text-white hover:bg-white hover:text-ink">
              <MessageCircle className="h-5 w-5" /> {site.hero.ctaSecondary}
            </Link>
          </div>

          {/* Quick chips */}
          <div className="mt-8 flex flex-wrap gap-2">
            {QUICK.map((q) => (
              <Link key={q.label} href={`/tours?interest=${encodeURIComponent(q.interest)}`} className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/90 ring-1 ring-white/15 backdrop-blur transition hover:bg-coral-500 hover:ring-coral-500">
                {q.label}
              </Link>
            ))}
          </div>

          {/* Trust row */}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <span className="text-sm font-semibold text-white">4.9 on Tripadvisor</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-sm text-white/85"><span className="font-bold text-white">12,000+</span> travelers guided</div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-sm text-white/85"><span className="font-bold text-white">15+</span> years in the wild</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={reduce ? undefined : { opacity: fade }}
        className="absolute inset-x-0 bottom-6 flex justify-center"
        aria-hidden
      >
        <span className="flex flex-col items-center gap-1 text-xs font-medium uppercase tracking-widest text-white/70">
          Scroll
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </span>
      </motion.div>
    </section>
  );
}
