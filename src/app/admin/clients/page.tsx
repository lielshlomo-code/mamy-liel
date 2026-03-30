"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  Search,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit3,
  DollarSign,
  Video,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  User,
  Phone,
  Mail,
  FileText,
  Eye,
  Pause,
  Play,
} from "lucide-react";

/* ───── helpers ───── */

const collabLabels: Record<string, string> = {
  monthly: "חבילה חודשית",
  one_time: "פרויקט חד-פעמי",
  ongoing: "שוטף",
  other: "אחר",
};

const statusLabels: Record<string, string> = {
  active: "פעיל",
  paused: "מושהה",
  completed: "הסתיים",
};

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  paused: "bg-amber-100 text-amber-700",
  completed: "bg-gray-100 text-gray-500",
};

const contentTypeLabels: Record<string, string> = {
  video: "סרטון",
  story: "סטורי",
  reel: "ריל",
  post: "פוסט",
};

const platformLabels: Record<string, string> = {
  instagram: "אינסטגרם",
  tiktok: "טיקטוק",
  youtube: "יוטיוב",
  facebook: "פייסבוק",
  other: "אחר",
};

const contentStatusLabels: Record<string, string> = {
  pending: "ממתין",
  in_progress: "בעבודה",
  ready: "מוכן",
  published: "פורסם",
};

const contentStatusColors: Record<string, string> = {
  pending: "bg-gray-100 text-gray-600",
  in_progress: "bg-blue-100 text-blue-700",
  ready: "bg-amber-100 text-amber-700",
  published: "bg-emerald-100 text-emerald-700",
};

const paymentStatusLabels: Record<string, string> = {
  pending: "ממתין",
  paid: "שולם",
  overdue: "באיחור",
  cancelled: "בוטל",
};

const paymentStatusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  overdue: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-500",
};

function formatCurrency(amount: number, currency = "ILS") {
  return new Intl.NumberFormat("he-IL", { style: "currency", currency }).format(amount);
}

function formatDate(d: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("he-IL");
}

/* ───── types ───── */

interface ClientRow {
  id: string;
  clientName: string;
  companyName: string;
  contactEmail?: string;
  contactPhone?: string;
  collaborationType: string;
  monthlyVideos: number;
  monthlyStories: number;
  monthlyReels: number;
  monthlyPosts: number;
  paymentAmount: number;
  paymentDay?: number;
  currency: string;
  status: string;
  notes?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  paymentSummary: { total: number; paid: number; pending: number };
  upcomingContent: number;
}

interface ContentRow {
  id: string;
  clientId: string;
  contentType: string;
  title?: string;
  description?: string;
  scheduledDate: string;
  scheduledTime?: string;
  platform: string;
  status: string;
  notes?: string;
}

interface PaymentRow {
  id: string;
  clientId: string;
  amount: number;
  currency: string;
  dueDate: string;
  paidDate?: string;
  status: string;
  invoiceNumber?: string;
  notes?: string;
}

/* ───── main page ───── */

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientRow | null>(null);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "content" | "payments">("details");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Content & payments for expanded client
  const [clientContent, setClientContent] = useState<ContentRow[]>([]);
  const [clientPayments, setClientPayments] = useState<PaymentRow[]>([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [showContentForm, setShowContentForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const fetchClients = useCallback(async () => {
    const res = await fetch("/api/admin/clients");
    if (res.ok) {
      const data = await res.json();
      setClients(data.clients);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const fetchClientDetails = async (clientId: string) => {
    setContentLoading(true);
    const [contentRes, paymentsRes] = await Promise.all([
      fetch(`/api/admin/clients/content?clientId=${clientId}`),
      fetch(`/api/admin/clients/payments?clientId=${clientId}`),
    ]);
    if (contentRes.ok) {
      const data = await contentRes.json();
      setClientContent(data.content);
    }
    if (paymentsRes.ok) {
      const data = await paymentsRes.json();
      setClientPayments(data.payments);
    }
    setContentLoading(false);
  };

  const toggleExpand = (id: string) => {
    if (expandedClient === id) {
      setExpandedClient(null);
    } else {
      setExpandedClient(id);
      setActiveTab("details");
      fetchClientDetails(id);
    }
  };

  const deleteClient = async (id: string) => {
    if (!confirm("למחוק את הלקוח? כל הנתונים ימחקו לצמיתות.")) return;
    setActionLoading(`delete-${id}`);
    const res = await fetch("/api/admin/clients", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      await fetchClients();
      if (expandedClient === id) setExpandedClient(null);
    }
    setActionLoading(null);
  };

  const filtered = clients.filter((c) => {
    const matchSearch =
      c.clientName.toLowerCase().includes(search.toLowerCase()) ||
      c.companyName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const activeClients = clients.filter((c) => c.status === "active");
  const totalMonthlyRevenue = activeClients.reduce((sum, c) => sum + Number(c.paymentAmount), 0);
  const totalPendingPayments = clients.reduce((sum, c) => sum + c.paymentSummary.pending, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">ניהול לקוחות</h1>
          <p className="text-sm text-text-secondary mt-1">
            {clients.length} לקוחות | {activeClients.length} פעילים
          </p>
        </div>
        <button
          onClick={() => { setEditingClient(null); setShowForm(!showForm); }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "ביטול" : "לקוח חדש"}
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-border p-4">
          <p className="text-xs text-text-secondary">לקוחות פעילים</p>
          <p className="text-2xl font-bold mt-1">{activeClients.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <p className="text-xs text-text-secondary">הכנסה חודשית</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(totalMonthlyRevenue)}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <p className="text-xs text-text-secondary">ממתין לתשלום</p>
          <p className="text-2xl font-bold mt-1 text-amber-600">{formatCurrency(totalPendingPayments)}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <p className="text-xs text-text-secondary">סה״כ לקוחות</p>
          <p className="text-2xl font-bold mt-1">{clients.length}</p>
        </div>
      </div>

      {/* Add/Edit client form */}
      {showForm && (
        <ClientForm
          initial={editingClient}
          onSave={async () => {
            setShowForm(false);
            setEditingClient(null);
            await fetchClients();
          }}
          onCancel={() => { setShowForm(false); setEditingClient(null); }}
        />
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
          <input
            type="text"
            placeholder="חיפוש לפי שם לקוח או חברה..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
        >
          <option value="all">כל הסטטוסים</option>
          <option value="active">פעיל</option>
          <option value="paused">מושהה</option>
          <option value="completed">הסתיים</option>
        </select>
      </div>

      {/* Client list */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <p className="text-center text-text-secondary py-8">
            {clients.length === 0 ? "אין לקוחות עדיין — הוסיפו את הלקוח הראשון!" : "לא נמצאו לקוחות"}
          </p>
        )}

        {filtered.map((client) => {
          const isExpanded = expandedClient === client.id;

          return (
            <div key={client.id} className="bg-white rounded-xl border border-border overflow-hidden">
              {/* Client row */}
              <button
                onClick={() => toggleExpand(client.id)}
                className="w-full flex items-center gap-4 px-4 py-4 text-right hover:bg-muted/50 transition-colors"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-foreground text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {client.companyName.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm truncate">{client.companyName}</p>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[client.status] || "bg-gray-100"}`}>
                      {statusLabels[client.status] || client.status}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary truncate mt-0.5">
                    {client.clientName} · {collabLabels[client.collaborationType] || client.collaborationType}
                  </p>
                </div>

                {/* Stats summary */}
                <div className="hidden sm:flex items-center gap-4 shrink-0 text-xs text-text-secondary">
                  <span className="flex items-center gap-1" title="סרטונים/חודש">
                    <Video className="w-3.5 h-3.5" />
                    {client.monthlyVideos}
                  </span>
                  <span className="flex items-center gap-1" title="תשלום חודשי">
                    <DollarSign className="w-3.5 h-3.5" />
                    {formatCurrency(client.paymentAmount, client.currency)}
                  </span>
                  {client.upcomingContent > 0 && (
                    <span className="flex items-center gap-1 text-blue-600" title="תכנים קרובים">
                      <Calendar className="w-3.5 h-3.5" />
                      {client.upcomingContent}
                    </span>
                  )}
                </div>

                {isExpanded ? <ChevronUp className="w-4 h-4 text-text-light shrink-0" /> : <ChevronDown className="w-4 h-4 text-text-light shrink-0" />}
              </button>

              {/* Expanded panel */}
              {isExpanded && (
                <div className="border-t border-border">
                  {/* Tab bar */}
                  <div className="flex border-b border-border">
                    {[
                      { key: "details" as const, label: "פרטים", icon: Eye },
                      { key: "content" as const, label: "לוח תכנים", icon: Calendar },
                      { key: "payments" as const, label: "תשלומים", icon: DollarSign },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors ${
                          activeTab === tab.key ? "border-b-2 border-foreground text-foreground" : "text-text-secondary hover:text-foreground"
                        }`}
                      >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                      </button>
                    ))}

                    {/* Action buttons */}
                    <div className="mr-auto flex items-center gap-1 px-3">
                      <button
                        onClick={() => { setEditingClient(client); setShowForm(true); }}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-text-secondary"
                        title="עריכה"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteClient(client.id)}
                        disabled={actionLoading === `delete-${client.id}`}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-text-secondary hover:text-red-600"
                        title="מחיקה"
                      >
                        {actionLoading === `delete-${client.id}` ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {contentLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  ) : (
                    <div className="p-4">
                      {activeTab === "details" && <ClientDetails client={client} />}
                      {activeTab === "content" && (
                        <ContentTab
                          clientId={client.id}
                          content={clientContent}
                          showForm={showContentForm}
                          setShowForm={setShowContentForm}
                          onRefresh={() => { fetchClientDetails(client.id); fetchClients(); }}
                        />
                      )}
                      {activeTab === "payments" && (
                        <PaymentsTab
                          clientId={client.id}
                          payments={clientPayments}
                          currency={client.currency}
                          showForm={showPaymentForm}
                          setShowForm={setShowPaymentForm}
                          onRefresh={() => { fetchClientDetails(client.id); fetchClients(); }}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ───── Client form ───── */

function ClientForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: ClientRow | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    clientName: initial?.clientName || "",
    companyName: initial?.companyName || "",
    contactEmail: initial?.contactEmail || "",
    contactPhone: initial?.contactPhone || "",
    collaborationType: initial?.collaborationType || "monthly",
    monthlyVideos: initial?.monthlyVideos || 0,
    monthlyStories: initial?.monthlyStories || 0,
    monthlyReels: initial?.monthlyReels || 0,
    monthlyPosts: initial?.monthlyPosts || 0,
    paymentAmount: initial?.paymentAmount || 0,
    paymentDay: initial?.paymentDay || 1,
    currency: initial?.currency || "ILS",
    status: initial?.status || "active",
    notes: initial?.notes || "",
    startDate: initial?.startDate || "",
    endDate: initial?.endDate || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientName || !form.companyName) {
      setError("שם לקוח ושם חברה הם שדות חובה");
      return;
    }
    setSaving(true);
    setError("");

    const res = await fetch("/api/admin/clients", {
      method: initial ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(initial ? { id: initial.id, ...form } : form),
    });

    if (res.ok) {
      onSave();
    } else {
      setError("שגיאה בשמירה");
    }
    setSaving(false);
  };

  const set = (key: string, value: string | number) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <form onSubmit={handleSave} className="mb-6 p-5 bg-white rounded-xl border border-border flex flex-col gap-4">
      <h2 className="font-bold">{initial ? "עריכת לקוח" : "לקוח חדש"}</h2>

      {/* Row 1: Names */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="שם לקוח *" icon={User}>
          <input type="text" value={form.clientName} onChange={(e) => set("clientName", e.target.value)} className="field-input" required />
        </Field>
        <Field label="שם חברה / מותג *" icon={Building2}>
          <input type="text" value={form.companyName} onChange={(e) => set("companyName", e.target.value)} className="field-input" required />
        </Field>
      </div>

      {/* Row 2: Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Field label="אימייל" icon={Mail}>
          <input type="email" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} className="field-input" dir="ltr" />
        </Field>
        <Field label="טלפון" icon={Phone}>
          <input type="tel" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} className="field-input" dir="ltr" />
        </Field>
        <Field label="סוג שיתוף פעולה">
          <select value={form.collaborationType} onChange={(e) => set("collaborationType", e.target.value)} className="field-input">
            <option value="monthly">חבילה חודשית</option>
            <option value="one_time">פרויקט חד-פעמי</option>
            <option value="ongoing">שוטף</option>
            <option value="other">אחר</option>
          </select>
        </Field>
      </div>

      {/* Row 3: Content amounts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Field label="סרטונים / חודש">
          <input type="number" min={0} value={form.monthlyVideos} onChange={(e) => set("monthlyVideos", +e.target.value)} className="field-input" />
        </Field>
        <Field label="סטוריז / חודש">
          <input type="number" min={0} value={form.monthlyStories} onChange={(e) => set("monthlyStories", +e.target.value)} className="field-input" />
        </Field>
        <Field label="רילסים / חודש">
          <input type="number" min={0} value={form.monthlyReels} onChange={(e) => set("monthlyReels", +e.target.value)} className="field-input" />
        </Field>
        <Field label="פוסטים / חודש">
          <input type="number" min={0} value={form.monthlyPosts} onChange={(e) => set("monthlyPosts", +e.target.value)} className="field-input" />
        </Field>
      </div>

      {/* Row 4: Payment */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Field label="סכום תשלום" icon={DollarSign}>
          <input type="number" min={0} step={0.01} value={form.paymentAmount} onChange={(e) => set("paymentAmount", +e.target.value)} className="field-input" />
        </Field>
        <Field label="יום תשלום בחודש">
          <input type="number" min={1} max={31} value={form.paymentDay} onChange={(e) => set("paymentDay", +e.target.value)} className="field-input" />
        </Field>
        <Field label="סטטוס">
          <select value={form.status} onChange={(e) => set("status", e.target.value)} className="field-input">
            <option value="active">פעיל</option>
            <option value="paused">מושהה</option>
            <option value="completed">הסתיים</option>
          </select>
        </Field>
        <Field label="מטבע">
          <select value={form.currency} onChange={(e) => set("currency", e.target.value)} className="field-input">
            <option value="ILS">₪ ILS</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
          </select>
        </Field>
      </div>

      {/* Row 5: Dates + Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Field label="תאריך התחלה">
          <input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} className="field-input" dir="ltr" />
        </Field>
        <Field label="תאריך סיום">
          <input type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} className="field-input" dir="ltr" />
        </Field>
        <Field label="הערות" icon={FileText}>
          <input type="text" value={form.notes} onChange={(e) => set("notes", e.target.value)} className="field-input" placeholder="הערות חופשיות..." />
        </Field>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-foreground text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {saving && <Loader2 className="w-3 h-3 animate-spin" />}
          {initial ? "שמירת שינויים" : "הוספת לקוח"}
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-2 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors">
          ביטול
        </button>
      </div>

      <style jsx>{`
        .field-input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid var(--color-border, #e5e7eb);
          font-size: 0.875rem;
          outline: none;
          transition: box-shadow 0.15s;
        }
        .field-input:focus {
          box-shadow: 0 0 0 2px rgba(0,0,0,0.08);
        }
      `}</style>
    </form>
  );
}

/* ───── Field wrapper ───── */

function Field({ label, icon: Icon, children }: { label: string; icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-text-secondary flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </label>
      {children}
    </div>
  );
}

/* ───── Client details tab ───── */

function ClientDetails({ client }: { client: ClientRow }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="flex flex-col gap-3">
        <DetailRow label="שם לקוח" value={client.clientName} />
        <DetailRow label="חברה / מותג" value={client.companyName} />
        {client.contactEmail && <DetailRow label="אימייל" value={client.contactEmail} dir="ltr" />}
        {client.contactPhone && <DetailRow label="טלפון" value={client.contactPhone} dir="ltr" />}
        <DetailRow label="סוג שיתוף" value={collabLabels[client.collaborationType] || client.collaborationType} />
        {client.startDate && <DetailRow label="תאריך התחלה" value={formatDate(client.startDate)} />}
        {client.endDate && <DetailRow label="תאריך סיום" value={formatDate(client.endDate)} />}
        {client.notes && <DetailRow label="הערות" value={client.notes} />}
      </div>

      <div className="flex flex-col gap-3">
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs font-bold text-text-secondary mb-2">תוכן חודשי</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span>סרטונים: <b>{client.monthlyVideos}</b></span>
            <span>סטוריז: <b>{client.monthlyStories}</b></span>
            <span>רילסים: <b>{client.monthlyReels}</b></span>
            <span>פוסטים: <b>{client.monthlyPosts}</b></span>
          </div>
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs font-bold text-text-secondary mb-2">תשלום</p>
          <p className="text-lg font-bold">{formatCurrency(client.paymentAmount, client.currency)}</p>
          {client.paymentDay && (
            <p className="text-xs text-text-secondary">כל {client.paymentDay} בחודש</p>
          )}
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs font-bold text-text-secondary mb-2">סיכום תשלומים</p>
          <div className="flex gap-4 text-sm">
            <span className="text-emerald-600">שולם: {formatCurrency(client.paymentSummary.paid, client.currency)}</span>
            <span className="text-amber-600">ממתין: {formatCurrency(client.paymentSummary.pending, client.currency)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, dir }: { label: string; value: string; dir?: string }) {
  return (
    <div>
      <p className="text-xs text-text-secondary">{label}</p>
      <p className="text-sm font-medium" dir={dir}>{value}</p>
    </div>
  );
}

/* ───── Content schedule tab ───── */

function ContentTab({
  clientId,
  content,
  showForm,
  setShowForm,
  onRefresh,
}: {
  clientId: string;
  content: ContentRow[];
  showForm: boolean;
  setShowForm: (v: boolean) => void;
  onRefresh: () => void;
}) {
  const [form, setForm] = useState({
    contentType: "video",
    title: "",
    scheduledDate: "",
    scheduledTime: "",
    platform: "instagram",
    status: "pending",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/clients/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, ...form }),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ contentType: "video", title: "", scheduledDate: "", scheduledTime: "", platform: "instagram", status: "pending", notes: "" });
      onRefresh();
    }
    setSaving(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/clients/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, contentType: content.find(c => c.id === id)?.contentType, scheduledDate: content.find(c => c.id === id)?.scheduledDate, platform: content.find(c => c.id === id)?.platform }),
    });
    onRefresh();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("למחוק פריט תוכן?")) return;
    await fetch("/api/admin/clients/content", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    onRefresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold">לוח תכנים ({content.length})</p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-foreground text-white text-xs font-medium hover:bg-accent-hover transition-colors"
        >
          {showForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          {showForm ? "ביטול" : "הוספת תוכן"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-4 p-3 bg-muted rounded-lg flex flex-col gap-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <select value={form.contentType} onChange={(e) => setForm({ ...form, contentType: e.target.value })} className="px-2 py-1.5 rounded border border-border text-xs">
              <option value="video">סרטון</option>
              <option value="story">סטורי</option>
              <option value="reel">ריל</option>
              <option value="post">פוסט</option>
            </select>
            <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="px-2 py-1.5 rounded border border-border text-xs">
              <option value="instagram">אינסטגרם</option>
              <option value="tiktok">טיקטוק</option>
              <option value="youtube">יוטיוב</option>
              <option value="facebook">פייסבוק</option>
              <option value="other">אחר</option>
            </select>
            <input type="date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} className="px-2 py-1.5 rounded border border-border text-xs" dir="ltr" required />
            <input type="time" value={form.scheduledTime} onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })} className="px-2 py-1.5 rounded border border-border text-xs" dir="ltr" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="כותרת / תיאור" className="px-2 py-1.5 rounded border border-border text-xs" />
            <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="הערות" className="px-2 py-1.5 rounded border border-border text-xs" />
          </div>
          <button type="submit" disabled={saving} className="self-start flex items-center gap-1 px-4 py-1.5 rounded-full bg-foreground text-white text-xs font-medium hover:bg-accent-hover disabled:opacity-50">
            {saving && <Loader2 className="w-3 h-3 animate-spin" />}
            הוספה
          </button>
        </form>
      )}

      {content.length === 0 ? (
        <p className="text-sm text-text-secondary text-center py-4">אין תכנים מתוכננים</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {content.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${contentStatusColors[item.status]}`}>
                {contentStatusLabels[item.status]}
              </span>
              <span className="text-xs font-medium">{contentTypeLabels[item.contentType] || item.contentType}</span>
              <span className="text-xs text-text-secondary">{platformLabels[item.platform]}</span>
              <span className="text-xs text-text-light" dir="ltr">{formatDate(item.scheduledDate)}</span>
              {item.scheduledTime && <span className="text-xs text-text-light" dir="ltr">{item.scheduledTime}</span>}
              {item.title && <span className="text-xs truncate flex-1">{item.title}</span>}

              <div className="mr-auto flex items-center gap-1">
                {item.status === "pending" && (
                  <button onClick={() => updateStatus(item.id, "in_progress")} className="p-1 hover:bg-blue-100 rounded transition-colors" title="התחל עבודה">
                    <Play className="w-3 h-3 text-blue-600" />
                  </button>
                )}
                {item.status === "in_progress" && (
                  <button onClick={() => updateStatus(item.id, "ready")} className="p-1 hover:bg-amber-100 rounded transition-colors" title="סמן כמוכן">
                    <CheckCircle2 className="w-3 h-3 text-amber-600" />
                  </button>
                )}
                {item.status === "ready" && (
                  <button onClick={() => updateStatus(item.id, "published")} className="p-1 hover:bg-emerald-100 rounded transition-colors" title="סמן כפורסם">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  </button>
                )}
                <button onClick={() => deleteItem(item.id)} className="p-1 hover:bg-red-100 rounded transition-colors" title="מחק">
                  <Trash2 className="w-3 h-3 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───── Payments tab ───── */

function PaymentsTab({
  clientId,
  payments,
  currency,
  showForm,
  setShowForm,
  onRefresh,
}: {
  clientId: string;
  payments: PaymentRow[];
  currency: string;
  showForm: boolean;
  setShowForm: (v: boolean) => void;
  onRefresh: () => void;
}) {
  const [form, setForm] = useState({
    amount: 0,
    dueDate: "",
    status: "pending",
    invoiceNumber: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/clients/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, currency, ...form }),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ amount: 0, dueDate: "", status: "pending", invoiceNumber: "", notes: "" });
      onRefresh();
    }
    setSaving(false);
  };

  const markPaid = async (id: string) => {
    const payment = payments.find(p => p.id === id);
    if (!payment) return;
    await fetch("/api/admin/clients/payments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, amount: payment.amount, currency: payment.currency, dueDate: payment.dueDate, status: "paid", paidDate: new Date().toISOString().split("T")[0] }),
    });
    onRefresh();
  };

  const deletePayment = async (id: string) => {
    if (!confirm("למחוק תשלום?")) return;
    await fetch("/api/admin/clients/payments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    onRefresh();
  };

  const totalPaid = payments.filter(p => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
  const totalPending = payments.filter(p => p.status === "pending" || p.status === "overdue").reduce((s, p) => s + Number(p.amount), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <p className="text-sm font-bold">תשלומים ({payments.length})</p>
          <span className="text-xs text-emerald-600">שולם: {formatCurrency(totalPaid, currency)}</span>
          <span className="text-xs text-amber-600">ממתין: {formatCurrency(totalPending, currency)}</span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-foreground text-white text-xs font-medium hover:bg-accent-hover transition-colors"
        >
          {showForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          {showForm ? "ביטול" : "הוספת תשלום"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-4 p-3 bg-muted rounded-lg flex flex-col gap-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <input type="number" min={0} step={0.01} value={form.amount} onChange={(e) => setForm({ ...form, amount: +e.target.value })} placeholder="סכום" className="px-2 py-1.5 rounded border border-border text-xs" required />
            <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="px-2 py-1.5 rounded border border-border text-xs" dir="ltr" required />
            <input type="text" value={form.invoiceNumber} onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })} placeholder="מס׳ חשבונית" className="px-2 py-1.5 rounded border border-border text-xs" dir="ltr" />
            <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="הערות" className="px-2 py-1.5 rounded border border-border text-xs" />
          </div>
          <button type="submit" disabled={saving} className="self-start flex items-center gap-1 px-4 py-1.5 rounded-full bg-foreground text-white text-xs font-medium hover:bg-accent-hover disabled:opacity-50">
            {saving && <Loader2 className="w-3 h-3 animate-spin" />}
            הוספה
          </button>
        </form>
      )}

      {payments.length === 0 ? (
        <p className="text-sm text-text-secondary text-center py-4">אין תשלומים</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {payments.map((p) => (
            <div key={p.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${paymentStatusColors[p.status]}`}>
                {paymentStatusLabels[p.status]}
              </span>
              <span className="text-sm font-semibold">{formatCurrency(Number(p.amount), p.currency)}</span>
              <span className="text-xs text-text-secondary">עד {formatDate(p.dueDate)}</span>
              {p.paidDate && <span className="text-xs text-emerald-600">שולם {formatDate(p.paidDate)}</span>}
              {p.invoiceNumber && <span className="text-xs text-text-light">#{p.invoiceNumber}</span>}
              {p.notes && <span className="text-xs text-text-light truncate">{p.notes}</span>}

              <div className="mr-auto flex items-center gap-1">
                {(p.status === "pending" || p.status === "overdue") && (
                  <button onClick={() => markPaid(p.id)} className="p-1 hover:bg-emerald-100 rounded transition-colors" title="סמן כשולם">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </button>
                )}
                <button onClick={() => deletePayment(p.id)} className="p-1 hover:bg-red-100 rounded transition-colors" title="מחק">
                  <Trash2 className="w-3 h-3 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
