'use client';

export default function BookingError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center px-6">
      <div className="max-w-md rounded-3xl border border-gray-800 bg-black/70 p-8 text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-orange-500 text-black flex items-center justify-center font-black">!</div>
        <h1 className="text-2xl font-bold">Booking page hit a snag</h1>
        <p className="text-gray-300">Please refresh and try again. If it keeps happening, use the backup Google booking link.</p>
        <div className="space-y-3">
          <button onClick={reset} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold py-3 px-5 rounded-xl">Try again</button>
          <a className="block w-full border border-gray-700 text-white font-semibold py-3 px-5 rounded-xl" href="https://calendar.app.google/YeqJLsyJHv1SQeXQ6">Use backup booking link</a>
        </div>
      </div>
    </div>
  );
}
