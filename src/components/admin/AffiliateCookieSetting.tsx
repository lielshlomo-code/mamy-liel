"use client";

import { useEffect, useState } from "react";
import { Cookie, Save, Loader2, Check, User, Hash } from "lucide-react";

export default function AffiliateCookieSetting() {
  const [url, setUrl] = useState("");
  const [account, setAccount] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [initial, setInitial] = useState({ url: "", account: "", trackingId: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/affiliate-cookie")
      .then((r) => r.json())
      .then((d) => {
        const next = {
          url: d.url || "",
          account: d.account || "",
          trackingId: d.trackingId || "",
        };
        setUrl(next.url);
        setAccount(next.account);
        setTrackingId(next.trackingId);
        setInitial(next);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const dirty =
    url.trim() !== initial.url.trim() ||
    account.trim() !== initial.account.trim() ||
    trackingId.trim() !== initial.trackingId.trim();

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/affiliate-cookie", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          account: account.trim(),
          trackingId: trackingId.trim(),
        }),
      });
      if (!res.ok) throw new Error();
      setInitial({ url: url.trim(), account: account.trim(), trackingId: trackingId.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert("השמירה נכשלה, נסה שוב");
    } finally {
      setSaving(false);
    }
  };

  const fieldCls =
    "flex-1 min-w-0 px-3 py-1.5 rounded-lg border border-border text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/40";

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

      <div className="flex flex-col gap-2">
        {/* URL */}
        <div className="flex items-center gap-2">
          <Cookie className="w-4 h-4 text-amber-600 shrink-0" />
          <input
            type="url"
            dir="ltr"
            value={url}
            placeholder="https://s.click.aliexpress.com/..."
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            className={`${fieldCls} font-mono text-left`}
          />
        </div>

        {/* Account + tracking id (reference only) */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2 flex-1">
            <User className="w-4 h-4 text-text-secondary shrink-0" />
            <input
              type="text"
              value={account}
              placeholder="מאיזה חשבון (לתיעוד)"
              onChange={(e) => setAccount(e.target.value)}
              disabled={loading}
              className={fieldCls}
            />
          </div>
          <div className="flex items-center gap-2 flex-1">
            <Hash className="w-4 h-4 text-text-secondary shrink-0" />
            <input
              type="text"
              dir="ltr"
              value={trackingId}
              placeholder="Tracking ID"
              onChange={(e) => setTrackingId(e.target.value)}
              disabled={loading}
              className={`${fieldCls} font-mono text-left`}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={save}
            disabled={loading || saving || !dirty}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-medium hover:bg-amber-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
    </div>
  );
}
