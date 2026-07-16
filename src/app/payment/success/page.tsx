"use client";

import { useEffect, useState } from "react";

export default function SuccessPage() {
    const [message, setMessage] = useState("Verifying Payment...");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const orderId = params.get("orderId");

        if (!orderId) {
            setMessage("Payment Successful");
            return;
        }

        async function verify() {
            const response = await fetch("/api/payment/confirm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ orderId }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage("Booking Confirmed 🎉");
            } else {
                setMessage("Payment Verification Failed");
            }
        }

        verify();
    }, []);

    return (

        <main className="flex min-h-screen items-center justify-center">

            <div className="rounded-xl border bg-white p-10 shadow-xl">

                <h1 className="text-4xl font-bold text-green-700">

                    {message}

                </h1>

            </div>

        </main>

    );

}