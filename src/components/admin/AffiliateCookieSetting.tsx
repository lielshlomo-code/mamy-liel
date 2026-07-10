"use client";

import { useEffect, useState } from "react";
import { Cookie, Save, Loader2, Check } from "lucide-react";

export default function AffiliateCookieSetting() {
  const [value, setValue] = useState("");
  const [initial, setInitial] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/affiliate-cookie")
      .then((r) => r.json())
      .then((d) => {
        setValue(d.url || "");
        setInitial(d.url || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const dirty = value.trim() !== initial.trim();

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/affiliate-cookie", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value.trim() }),
      });
      if (!res.ok) throw new Error();
      setInitial(value.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert("השמירה נכשלה, נסה שוב");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-border p-4 sm:p-6 mb-6">
      <div className="flex items-center gap-2 mb-1">
        <Cookie className="w-4 h-4 text-amber-600" />
        <h3 className="font-semibold">קישור אפיליאייט לצביעת קוקי</h3>
      </div>
      <p className="text-xs text-text-secondary mb-3">
        נטען ב-iframe נסתר לפני ההפניה, בכל קישור שמסומן &quot;צביעת קוקי&quot;.
        גלובלי לכל הקישורים.
      </p>
      <div className="flex items-center gap-2">
        <input
          type="url"
          dir="ltr"
          value={value}
          placeholder="https://s.click.aliexpress.com/..."
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
          className="flex-1 min-w-0 px-3 py-1.5 rounded-lg border border-border text-xs font-mono text-left focus:outline-none focus:ring-2 focus:ring-amber-500/40"
        />
        <button
          onClick={save}
          disabled={loading || saving || !dirty}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-medium hover:bg-amber-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          {saving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : saved ? (
            <>
              <Check className="w-3.5 h-3.5" />
              נשמר
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              שמור
            </>
          )}
        </button>
      </div>
    </div>
  );
}
