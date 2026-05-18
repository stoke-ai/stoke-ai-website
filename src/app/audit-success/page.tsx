const bookingUrl = process.env.NEXT_PUBLIC_AUDIT_BOOKING_URL || '';

export default function AuditSuccessPage() {
  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full rounded-3xl border border-orange-500/30 bg-gradient-to-br from-gray-900 via-black to-orange-950/40 p-8 md:p-12 shadow-2xl shadow-orange-950/25 text-center">
        <div className="text-5xl mb-4">✅</div>
        <p className="text-orange-300 font-bold mb-3">AI Impact Audit</p>
        <h1 className="text-3xl md:text-5xl font-black mb-5">Payment received. Let&apos;s book your audit.</h1>
        <p className="text-gray-300 text-lg leading-relaxed mb-8">
          The next step is choosing a time with Jeff so Stoke AI can walk through your workflow, bottlenecks, and first automation opportunity.
        </p>

        {bookingUrl ? (
          <a
            href={bookingUrl}
            className="inline-flex items-center justify-center w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-black font-black py-4 px-8 rounded-full text-lg transition-all hover:scale-[1.02]"
          >
            Book My Audit Time →
          </a>
        ) : (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-left">
            <p className="font-bold text-amber-200 mb-2">Calendar booking is almost ready.</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Stoke AI has received the payment flow, but the calendar booking URL is not configured yet. Jeff will follow up directly, or set <code className="text-amber-200">NEXT_PUBLIC_AUDIT_BOOKING_URL</code> to enable the booking button here.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
