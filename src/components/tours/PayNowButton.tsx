"use client";

import { useState } from "react";

interface PayNowButtonProps {
  tourName: string;
  amount: number;
}

export function PayNowButton({ tourName, amount }: PayNowButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tourName,
          amount,
          email: "",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Unable to start payment.");
      }

      window.location.href = data.paymentUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-jungle-700 px-6 py-4 text-lg font-semibold text-white transition hover:bg-jungle-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Processing…" : "Pay Now"}
      </button>
      {error ? <p className="mt-3 text-sm font-semibold text-coral-600">{error}</p> : null}
    </>
  );
}
