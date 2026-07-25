"use client";

import { FormEvent, useState } from "react";
import { phoneDisplay, phoneHref } from "./MdcChrome";

type State = "idle" | "sending" | "success" | "error";

export default function QuoteForm({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setError("");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/mdc-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We could not send your request.");
      form.reset();
      setState("success");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not send your request.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="success" role="status">
        <div className="success-mark">✓</div>
        <p className="quote-kicker">Request received</p>
        <h2>Thanks. We’ll follow up shortly.</h2>
        <p>Your request has been delivered to the review team. If the door is stuck open, off track, or unsafe, call Morgan Door now.</p>
        <a className="button button-form" href={phoneHref}>Call {phoneDisplay}</a>
        <button className="text-button" type="button" onClick={() => setState("idle")}>Send another request</button>
      </div>
    );
  }

  return (
    <form className={compact ? "quote-form compact-form" : "quote-form"} onSubmit={submit}>
      <label className="hp-field" aria-hidden="true">
        Company website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label>
        What do you need?
        <select name="service" defaultValue="" required>
          <option value="" disabled>Select a service</option>
          <option>Garage door repair</option>
          <option>New residential door</option>
          <option>Commercial / overhead door</option>
          <option>Maintenance / safety check</option>
          <option>Not sure</option>
        </select>
      </label>
      <div className="field-row">
        <label>
          Name
          <input name="name" autoComplete="name" placeholder="Your name" required />
        </label>
        <label>
          City or ZIP
          <input name="location" autoComplete="postal-code" placeholder="Burley" required />
        </label>
      </div>
      <div className="field-row">
        <label>
          Mobile phone
          <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="(208) 555-0000" required />
        </label>
        <label>
          Email <span className="optional">(optional)</span>
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" />
        </label>
      </div>
      <label>
        What’s happening?
        <textarea name="details" rows={compact ? 3 : 4} placeholder="Door is stuck halfway, spring looks broken..." />
      </label>
      <label className="check-label">
        <input name="urgent" type="checkbox" value="yes" />
        <span><strong>This is urgent</strong> — the door is stuck open, off track, or blocking a vehicle.</span>
      </label>
      <button className="button button-form" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Request My Free Quote"}
      </button>
      {state === "error" && <p className="form-error" role="alert">{error} Please call <a href={phoneHref}>{phoneDisplay}</a>.</p>}
      <p className="form-note">No obligation. Your information is used only to respond to this request.</p>
    </form>
  );
}
