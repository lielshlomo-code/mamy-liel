"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

interface FormData {
  brandName: string;
  contactName: string;
  email: string;
  phone: string;
  type: string;
  message: string;
}

const initialForm: FormData = {
  brandName: "",
  contactName: "",
  email: "",
  phone: "",
  type: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm(initialForm);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-12 px-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Send className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold mb-2">ההודעה נשלחה בהצלחה!</h3>
        <p className="text-text-secondary">אחזור אליכם בהקדם האפשרי</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium underline"
        >
          שלחו הודעה נוספת
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="brandName" className="text-sm font-medium">
            שם המותג / חברה *
          </label>
          <input
            id="brandName"
            name="brandName"
            type="text"
            required
            value={form.brandName}
            onChange={handleChange}
            className="px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-colors text-base"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contactName" className="text-sm font-medium">
            שם איש קשר *
          </label>
          <input
            id="contactName"
            name="contactName"
            type="text"
            required
            value={form.contactName}
            onChange={handleChange}
            className="px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-colors text-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            אימייל *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-colors text-base"
            dir="ltr"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium">
            טלפון
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className="px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-colors text-base"
            dir="ltr"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="type" className="text-sm font-medium">
          סוג שיתוף פעולה *
        </label>
        <select
          id="type"
          name="type"
          required
          value={form.type}
          onChange={handleChange}
          className="px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-colors text-base"
        >
          <option value="">בחרו סוג</option>
          <option value="sponsored">הדרכה ממומנת</option>
          <option value="review">סקירת מוצר</option>
          <option value="ambassador">שגרירות מותג</option>
          <option value="other">אחר</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium">
          הודעה *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          value={form.message}
          onChange={handleChange}
          className="px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-colors text-base resize-none"
          placeholder="ספרו לי על השיתוף שאתם מציעים..."
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">משהו השתבש, נסו שוב מאוחר יותר</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-foreground text-white font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 self-start"
      >
        {status === "loading" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        שליחה
      </button>
    </form>
  );
}
