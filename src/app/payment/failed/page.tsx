export default function FailedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="rounded-xl border p-10 text-center shadow-lg">
        <h1 className="text-4xl font-bold text-red-700">
          Payment Failed
        </h1>

        <p className="mt-4">
          Unfortunately your payment could not be completed.
        </p>

        <a
          href="/tours"
          className="mt-6 inline-block rounded-lg bg-red-700 px-6 py-3 text-white"
        >
          Try Again
        </a>
      </div>
    </main>
  );
}