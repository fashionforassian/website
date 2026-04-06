"use client";

import { useState } from "react";
import { buildBackendUrl } from "@/lib/backend-api";

type NewsletterFormProps = {
  source: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
};

export default function NewsletterForm({
  source,
  className,
  inputClassName,
  buttonClassName,
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(buildBackendUrl("/api/subscribers"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Subscription failed.");
      }

      setEmail("");
      setMessage("Subscribed successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Subscription failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className={className}>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          className={inputClassName}
        />
        <button type="submit" disabled={submitting} className={buttonClassName}>
          {submitting ? "Submitting..." : "Subscribe"}
        </button>
      </form>
      {message ? <p className="mt-3 text-xs uppercase tracking-[0.14em] text-neutral-400">{message}</p> : null}
    </div>
  );
}
