import { useState, useEffect } from 'react';

// ─── FALLBACK REMINDER PHONE (used when client has no phone) ─────────────────
const REMINDER_FALLBACK_PHONE = "9342542897";

// ─── COMPANY INFO ────────────────────────────────────────────────────────────
const COMPANY_NAME = "BIP Fencing Contract Work";
const COMPANY_PHONE = "9655072445";

// ─── DEFAULT CLIENT DATA (shown only if localStorage is empty) ───────────────
const defaultClientsData = [
  {
    id: 1, initials: "AK", name: "Ahmed Al Kaabi", email: "ahmed@alkaabi.ae",
    phone: "+971 50 123 4567", gst: "AE123456789", company: "Al Kaabi Trading LLC",
    type: "Commercial", address: "Al Quoz, Dubai", since: "Jan 2025",
    contractValue: 22700, paid: 18500, pending: 4200, status: "partial", color: "primary",
    invoices: [
      { id: "INV-001", date: "15 Jan 2025", type: "Advance", amount: 11350, status: "paid" },
      { id: "INV-002", date: "10 Mar 2025", type: "Progress", amount: 7150, status: "paid" },
      { id: "INV-003", date: "Due: 30 Apr 2025", type: "Final", amount: 4200, status: "overdue" },
    ],
    projects: [
      { name: "Villa Perimeter Fencing", detail: "Al Quoz · 120m chain link", status: "completed" },
      { name: "Compound Gate Install", detail: "Al Quoz · Automated gate", status: "inprogress" },
    ],
  },
  {
    id: 2, initials: "SR", name: "Sara Rahman", email: "sara@rahman.com",
    phone: "+971 55 987 6543", gst: "AE987654321", company: "Rahman Enterprises",
    type: "Residential", address: "Jumeirah, Dubai", since: "Mar 2024",
    contractValue: 32000, paid: 32000, pending: 0, status: "paid", color: "success",
    invoices: [
      { id: "INV-001", date: "01 Mar 2024", type: "Full Payment", amount: 32000, status: "paid" },
    ],
    projects: [
      { name: "Garden Fencing", detail: "Jumeirah · Ornamental steel", status: "completed" },
    ],
  },
  {
    id: 3, initials: "MH", name: "Mohammed Hassan", email: "m.hassan@gmail.com",
    phone: "+91 52 456 78901", gst: "", company: "",
    type: "Residential", address: "Sharjah", since: "Nov 2024",
    contractValue: 20500, paid: 8000, pending: 12501, status: "overdue", color: "warning",
    invoices: [
      { id: "INV-001", date: "01 Nov 2024", type: "Advance", amount: 8000, status: "paid" },
      { id: "INV-002", date: "Due: 15 Jan 2025", type: "Balance", amount: 12500, status: "overdue" },
    ],
    projects: [
      { name: "Warehouse Fencing", detail: "Sharjah Industrial · 200m", status: "inprogress" },
    ],
  },
  {
    id: 4, initials: "LF", name: "Layla Fatima", email: "layla.f@business.ae",
    phone: "+971 58 333 2211", gst: "AE445566778", company: "Fatima Holdings",
    type: "Commercial", address: "Business Bay, Dubai", since: "Jun 2024",
    contractValue: 15200, paid: 15200, pending: 0, status: "paid", color: "info",
    invoices: [
      { id: "INV-001", date: "10 Jun 2024", type: "Full Payment", amount: 15200, status: "paid" },
    ],
    projects: [
      { name: "Office Compound Gate", detail: "Business Bay · Electric gate", status: "completed" },
    ],
  },
  {
    id: 5, initials: "KA", name: "Khalid Al Ameri", email: "khalid@alameri.com",
    phone: "+971 50 777 8899", gst: "", company: "Al Ameri Construction",
    type: "Industrial", address: "Jebel Ali, Dubai", since: "Feb 2025",
    contractValue: 28800, paid: 21000, pending: 7800, status: "partial", color: "danger",
    invoices: [
      { id: "INV-001", date: "05 Feb 2025", type: "Advance", amount: 14400, status: "paid" },
      { id: "INV-002", date: "20 Mar 2025", type: "Progress", amount: 6600, status: "paid" },
      { id: "INV-003", date: "Due: 15 May 2025", type: "Final", amount: 7800, status: "pending" },
    ],
    projects: [
      { name: "Factory Perimeter", detail: "Jebel Ali · Barbed wire + chain link", status: "inprogress" },
    ],
  },
  {
    id: 6, initials: "NP", name: "Nadia Patel", email: "nadia@patel.in",
    phone: "+971 56 234 5678", gst: "AE112233445", company: "Patel Group",
    type: "Commercial", address: "Abu Dhabi", since: "Apr 2025",
    contractValue: 7700, paid: 5600, pending: 2100, status: "partial", color: "primary",
    invoices: [
      { id: "INV-001", date: "01 Apr 2025", type: "Advance", amount: 5600, status: "paid" },
      { id: "INV-002", date: "Due: 30 Apr 2025", type: "Balance", amount: 2100, status: "pending" },
    ],
    projects: [
      { name: "Boundary Wall Fence", detail: "Abu Dhabi · 80m panel fence", status: "inprogress" },
    ],
  },
];

const COLORS = ["primary", "success", "warning", "info", "danger", "secondary"];

const getInitials = (name) =>
  (name || "?").split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const getStatusBadge = (status) => {
  const badges = {
    paid: { class: 'bg-success', label: 'Fully paid' },
    partial: { class: 'bg-warning', label: 'Partial payment' },
    overdue: { class: 'bg-danger', label: 'Overdue' },
  };
  return badges[status] || badges.partial;
};

const getInvoiceStatusBadge = (status) => {
  const badges = { paid: 'bg-success', pending: 'bg-warning', overdue: 'bg-danger' };
  return badges[status] || 'bg-secondary';
};

const getProjectStatusBadge = (status) =>
  status === 'completed' ? 'bg-success' : 'bg-warning';

const fmt = (n) => Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const initialForm = {
  name: '', phone: '', email: '', address: '', gst: '',
  company: '', type: '', contractValue: '', paymentTerms: '',
  startDate: '', endDate: '', notes: '',
};

// ─── WHATSAPP HELPERS ────────────────────────────────────────────────────────
function cleanPhone(phone) {
  // Strip non-digits; if starts with 91 and is 12 digits, keep; else prepend 91
  const digits = (phone || "").replace(/\D/g, "");
  if (!digits) return REMINDER_FALLBACK_PHONE;
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

function buildInvoiceMessage(client) {
  const latestInv = client.invoices?.slice(-1)[0];
  const invRef = latestInv ? `Invoice *${latestInv.id}*` : "your recent invoice";
  return encodeURIComponent(
    `Dear ${client.name},\n\nThank you for choosing ${COMPANY_NAME}.\n\nThis is to inform you that ${invRef} for ₹${fmt(client.contractValue)} has been raised on your account.\n\nFor any queries, please contact us at ${COMPANY_PHONE}.\n\nWarm regards,\n${COMPANY_NAME}`
  );
}

function buildReminderMessage(client) {
  const pending = client.pending || 0;
  const overdueInv = client.invoices?.filter((i) => i.status === "overdue" || i.status === "pending") || [];
  const invList = overdueInv.map((i) => `• ${i.id} — ₹${Number(i.amount).toLocaleString("en-IN")} (${i.status})`).join("\n");
  return encodeURIComponent(
    `Dear ${client.name},\n\nThis is a gentle payment reminder from *${COMPANY_NAME}*.\n\n` +
    (invList ? `Outstanding invoices:\n${invList}\n\n` : "") +
    `Total pending amount: *₹${fmt(pending)}*\n\nKindly arrange the payment at your earliest convenience.\n\nFor queries, call us at ${COMPANY_PHONE}.\n\nThank you,\n${COMPANY_NAME}`
  );
}

// ════════════════════════════════════════════════════════════════════════════
export default function Clients() {
  // ── Load from localStorage, fall back to defaults ──
  const [clientsData, setClientsData] = useState(() => {
    try {
      const saved = localStorage.getItem('bip_clients');
      return saved ? JSON.parse(saved) : defaultClientsData;
    } catch {
      return defaultClientsData;
    }
  });

  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  // "send_invoice" | "payment_reminder" | null
  const [waAction, setWaAction] = useState(null);

  useEffect(() => {
    if (clientsData.length > 0 && !selected) {
      setSelected(clientsData[0]);
    }
  }, []);

  // Persist to localStorage whenever clientsData changes
  useEffect(() => {
    localStorage.setItem('bip_clients', JSON.stringify(clientsData));
  }, [clientsData]);

  // Re-sync selected client when clientsData changes (so right panel stays fresh)
  useEffect(() => {
    if (selected) {
      const fresh = clientsData.find((c) => c.id === selected.id);
      if (fresh) setSelected(fresh);
    }
  }, [clientsData]);

  const totalRevenue = clientsData.reduce((s, c) => s + (c.contractValue || 0), 0);
  const totalPaid = clientsData.reduce((s, c) => s + (c.paid || 0), 0);
  const totalPending = clientsData.reduce((s, c) => s + (c.pending || 0), 0);
  const overdueCount = clientsData.filter((c) => c.status === "overdue").length;
  const paidPct = totalRevenue ? Math.round((totalPaid / totalRevenue) * 100) : 0;

  const filtered = clientsData.filter((c) => {
    const q = search.toLowerCase();
    return (
      (c.name.toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q) ||
        (c.phone || "").includes(q) ||
        (c.gst && c.gst.toLowerCase().includes(q))) &&
      (statusFilter ? c.status === statusFilter : true)
    );
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const cv = parseFloat(form.contractValue) || 0;

    if (editingId !== null) {
      setClientsData((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                name: form.name,
                phone: form.phone,
                email: form.email,
                address: form.address,
                gst: form.gst,
                company: form.company,
                type: form.type,
                contractValue: cv,
                paymentTerms: form.paymentTerms,
                startDate: form.startDate,
                endDate: form.endDate,
                notes: form.notes,
                initials: getInitials(form.name),
              }
            : c
        )
      );
      setEditingId(null);
    } else {
      const newClient = {
        id: Date.now(),
        initials: getInitials(form.name),
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        gst: form.gst,
        company: form.company,
        type: form.type,
        contractValue: cv,
        paid: 0,
        pending: cv,
        status: "partial",
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        since: new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }),
        paymentTerms: form.paymentTerms,
        startDate: form.startDate,
        endDate: form.endDate,
        notes: form.notes,
        invoices: [],
        projects: [],
      };
      setClientsData((prev) => [...prev, newClient]);
      setSelected(newClient);
    }

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm(initialForm);
    setShowForm(false);
  };

  const handleEdit = (client) => {
    setForm({
      name: client.name,
      phone: client.phone || '',
      email: client.email || '',
      address: client.address || '',
      gst: client.gst || '',
      company: client.company || '',
      type: client.type || '',
      contractValue: client.contractValue || '',
      paymentTerms: client.paymentTerms || '',
      startDate: client.startDate || '',
      endDate: client.endDate || '',
      notes: client.notes || '',
    });
    setEditingId(client.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (clientId) => {
    setClientsData((prev) => {
      const next = prev.filter((c) => c.id !== clientId);
      if (selected?.id === clientId) setSelected(next[0] || null);
      return next;
    });
    setDeleteConfirm(null);
  };

  const handleReset = () => { setForm(initialForm); setEditingId(null); };
  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(initialForm); };

  // ── WhatsApp action handler ──────────────────────────────────────────────
  const handleWhatsApp = (client, action) => {
    const phone = cleanPhone(client.phone) || REMINDER_FALLBACK_PHONE;
    const msg = action === "send_invoice"
      ? buildInvoiceMessage(client)
      : buildReminderMessage(client);
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank", "noreferrer");
  };

  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>

      {/* ── WhatsApp Confirm Modal ── */}
      {waAction && selected && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.45)', zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h6 className="modal-title text-success">
                  <i className="bi bi-whatsapp me-2"></i>
                  {waAction === "send_invoice" ? "Send Invoice via WhatsApp" : "Send Payment Reminder via WhatsApp"}
                </h6>
              </div>
              <div className="modal-body">
                <p className="mb-1">
                  Sending to: <strong>{selected.name}</strong>
                </p>
                <p className="mb-0 text-muted small">
                  Phone: <strong>{selected.phone || `(fallback) ${REMINDER_FALLBACK_PHONE}`}</strong>
                </p>
                {!selected.phone && (
                  <div className="alert alert-warning mt-2 py-2 small">
                    No phone number saved for this client. Message will be sent to the default reminder number <strong>{REMINDER_FALLBACK_PHONE}</strong>.
                  </div>
                )}
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setWaAction(null)}>Cancel</button>
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => { handleWhatsApp(selected, waAction); setWaAction(null); }}
                >
                  <i className="bi bi-whatsapp me-1"></i>Open WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirm && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.45)', zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h6 className="modal-title text-danger">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>Delete Client
                </h6>
              </div>
              <div className="modal-body">
                <p className="mb-0">
                  Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This cannot be undone.
                </p>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(deleteConfirm.id)}>
                  <i className="bi bi-trash me-1"></i>Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Clients</h1>
          <p className="text-muted mb-0">Manage client accounts, payments and billing</p>
        </div>
        <button onClick={() => (showForm ? closeForm() : setShowForm(true))} className="btn btn-primary">
          <i className="bi bi-plus-lg me-2"></i>
          {showForm ? 'Close Form' : 'Add Client'}
        </button>
      </div>

      {/* ── Stats Cards ── */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <p className="text-muted small mb-1">Total Clients</p>
              <h2 className="mb-2">{clientsData.length}</h2>
              <span className="badge bg-primary bg-opacity-10 text-primary">Active accounts</span>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <p className="text-muted small mb-1">Total Revenue</p>
              <h2 className="mb-2">₹{totalRevenue.toLocaleString("en-IN")}</h2>
              <span className="badge bg-success bg-opacity-10 text-success">Contract value</span>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <p className="text-muted small mb-1">Total Paid</p>
              <h2 className="mb-2 text-success">₹{totalPaid.toLocaleString("en-IN")}</h2>
              <div className="progress" style={{ height: '4px' }}>
                <div className="progress-bar bg-success" style={{ width: `${paidPct}%` }}></div>
              </div>
              <p className="small text-muted mt-1 mb-0">{paidPct}% collected</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <p className="text-muted small mb-1">Pending Amount</p>
              <h2 className="mb-2 text-danger">₹{totalPending.toLocaleString("en-IN")}</h2>
              <span className="badge bg-warning bg-opacity-10 text-warning">
                {overdueCount} overdue client{overdueCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Add / Edit Client Form ── */}
      {showForm && (
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white">
            <h6 className="mb-0">
              <i className={`bi ${editingId ? 'bi-pencil-fill text-warning' : 'bi-person-plus-fill text-primary'} me-2`}></i>
              {editingId ? 'Edit Client' : 'Add New Client'}
            </h6>
          </div>
          <div className="card-body">
            {submitted && (
              <div className="alert alert-success alert-dismissible fade show py-2" role="alert">
                <i className="bi bi-check-circle-fill me-2"></i>
                Client {editingId ? 'updated' : 'saved'} successfully!
                <button type="button" className="btn-close btn-sm" onClick={() => setSubmitted(false)}></button>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} placeholder="John" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone Number <span className="text-danger">*</span></label>
                  <input type="tel" className="form-control" name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 9342542897" required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">GST Number</label>
                  <input type="text" className="form-control" name="gst" value={form.gst} onChange={handleChange} placeholder="GST Number" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Company</label>
                  <input type="text" className="form-control" name="company" value={form.company} onChange={handleChange} placeholder="Company name" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Client Type</label>
                  <select className="form-select" name="type" value={form.type} onChange={handleChange}>
                    <option value="">Select...</option>
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Government</option>
                    <option>Industrial</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Contract Value (₹)</label>
                  <input type="number" className="form-control" name="contractValue" value={form.contractValue} onChange={handleChange} placeholder="0.00" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Payment Terms</label>
                  <select className="form-select" name="paymentTerms" value={form.paymentTerms} onChange={handleChange}>
                    <option value="">Select...</option>
                    <option>Full upfront</option>
                    <option>50% advance</option>
                    <option>30-60 days</option>
                    <option>Monthly</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Start Date</label>
                  <input type="date" className="form-control" name="startDate" value={form.startDate} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">End Date</label>
                  <input type="date" className="form-control" name="endDate" value={form.endDate} onChange={handleChange} />
                </div>
                <div className="col-12">
                  <label className="form-label">Address</label>
                  <textarea className="form-control" name="address" value={form.address} onChange={handleChange} rows={2} placeholder="Full address..." />
                </div>
                <div className="col-12">
                  <label className="form-label">Notes</label>
                  <textarea className="form-control" name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Special requirements or remarks..." />
                </div>
              </div>
              <div className="mt-4 d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-check-lg me-2"></i>{editingId ? 'Update Client' : 'Save Client'}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={handleReset}>
                  <i className="bi bi-arrow-counterclockwise me-2"></i>Reset
                </button>
                {editingId && (
                  <button type="button" className="btn btn-outline-danger" onClick={closeForm}>Cancel Edit</button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="row g-3">

        {/* Left Column – Client Directory */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
              <h6 className="mb-0">Client Directory</h6>
              <div className="d-flex gap-2">
                <input
                  type="text" className="form-control form-control-sm"
                  placeholder="Search clients..." value={search}
                  onChange={(e) => setSearch(e.target.value)} style={{ width: '200px' }}
                />
                <select className="form-select form-select-sm" value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)} style={{ width: '130px' }}>
                  <option value="">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>

            <div className="card-body p-0">
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {filtered.length === 0 && (
                  <p className="text-center text-muted py-5 mb-0">No clients found.</p>
                )}
                {filtered.map((client) => {
                  const statusBadge = getStatusBadge(client.status);
                  return (
                    <div
                      key={client.id}
                      onClick={() => { setSelected(client); setActiveTab("overview"); }}
                      className={`d-flex align-items-center p-3 border-bottom ${selected?.id === client.id ? 'bg-light' : ''}`}
                      style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                    >
                      <div
                        className={`rounded-circle bg-${client.color} bg-opacity-10 d-flex align-items-center justify-content-center me-3`}
                        style={{ width: '40px', height: '40px', flexShrink: 0 }}
                      >
                        <span className={`text-${client.color} fw-bold`}>{client.initials}</span>
                      </div>

                      <div className="flex-grow-1">
                        <p className="mb-0 fw-semibold">{client.name}</p>
                        <p className="small text-muted mb-0">
                          {client.email && `${client.email} · `}{client.phone}
                          {client.gst && ` · ${client.gst}`}
                        </p>
                      </div>

                      <div className="text-end me-3">
                        <p className="mb-0 small fw-semibold text-success">
                          ₹{(client.paid || 0).toLocaleString("en-IN")} paid
                        </p>
                        <p className={`mb-0 small ${(client.pending || 0) > 0 ? 'text-danger' : 'text-success'}`}>
                          {(client.pending || 0) > 0
                            ? `₹${(client.pending || 0).toLocaleString("en-IN")} pending`
                            : 'Fully paid'}
                        </p>
                      </div>

                      <span className={`badge ${statusBadge.class} bg-opacity-10 text-${statusBadge.class.replace('bg-', '')} me-2`}>
                        {statusBadge.label}
                      </span>

                      <div className="d-flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <button className="btn btn-sm btn-outline-secondary py-0 px-2" title="Edit" onClick={() => handleEdit(client)}>
                          <i className="bi bi-pencil" style={{ fontSize: '12px' }}></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger py-0 px-2" title="Delete" onClick={() => setDeleteConfirm(client)}>
                          <i className="bi bi-trash" style={{ fontSize: '12px' }}></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card-footer bg-white d-flex justify-content-between align-items-center">
              <span className="small text-muted">Showing {filtered.length} of {clientsData.length} clients</span>
            </div>
          </div>
        </div>

        {/* Right Column – Client Details */}
        <div className="col-lg-4">
          {selected && (
            <div className="card shadow-sm mb-3">
              <div className="card-header bg-white d-flex align-items-center gap-3">
                <div
                  className={`rounded-circle bg-${selected.color} bg-opacity-10 d-flex align-items-center justify-content-center`}
                  style={{ width: '48px', height: '48px' }}
                >
                  <span className={`text-${selected.color} fw-bold fs-5`}>{selected.initials}</span>
                </div>
                <div>
                  <h6 className="mb-0">{selected.name}</h6>
                  <p className="small text-muted mb-1">{selected.type} · {selected.address}</p>
                  <span className={`badge ${getStatusBadge(selected.status).class} bg-opacity-10 text-${getStatusBadge(selected.status).class.replace('bg-', '')}`}>
                    {getStatusBadge(selected.status).label}
                  </span>
                </div>
              </div>

              <div className="card-body p-0">
                <ul className="nav nav-tabs nav-fill" style={{ padding: '0 12px', borderBottom: '1px solid #dee2e6' }}>
                  {["overview", "payments", "projects"].map((tab) => (
                    <li className="nav-item" key={tab}>
                      <button
                        className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                        style={{ fontSize: '13px', padding: '10px 0' }}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    </li>
                  ))}
                </ul>

                <div style={{ padding: '16px', maxHeight: '500px', overflowY: 'auto' }}>

                  {/* Overview Tab */}
                  {activeTab === "overview" && (
                    <div>
                      <div className="row g-2 mb-3">
                        <div className="col-6">
                          <div className="bg-success bg-opacity-10 rounded p-3 text-center">
                            <p className="small text-success mb-0">Paid</p>
                            <h5 className="text-success mb-0">₹{(selected.paid || 0).toLocaleString("en-IN")}</h5>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="bg-danger bg-opacity-10 rounded p-3 text-center">
                            <p className="small text-danger mb-0">Pending</p>
                            <h5 className="text-danger mb-0">₹{(selected.pending || 0).toLocaleString("en-IN")}</h5>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex justify-content-between small text-muted mb-1">
                          <span>Payment progress</span>
                          <span>{selected.contractValue ? Math.round(((selected.paid || 0) / selected.contractValue) * 100) : 0}%</span>
                        </div>
                        <div className="progress" style={{ height: '6px' }}>
                          <div className="progress-bar bg-success"
                            style={{ width: `${selected.contractValue ? Math.round(((selected.paid || 0) / selected.contractValue) * 100) : 0}%` }}>
                          </div>
                        </div>
                      </div>

                      <div className="border-top pt-3">
                        {[
                          ["Contract", `₹${(selected.contractValue || 0).toLocaleString("en-IN")}`],
                          ["Email", selected.email || "—"],
                          ["Phone", selected.phone || "—"],
                          ["GST", selected.gst || "—"],
                          ["Company", selected.company || "—"],
                          ["Since", selected.since],
                          ["Address", selected.address],
                        ].map(([key, value]) => (
                          <div key={key} className="d-flex justify-content-between py-2 border-bottom">
                            <span className="small text-muted">{key}</span>
                            <span className="small fw-medium text-end" style={{ maxWidth: '60%', wordBreak: 'break-word' }}>{value}</span>
                          </div>
                        ))}
                      </div>

                      <div className="d-flex gap-2 mt-3">
                        <button className="btn btn-outline-secondary btn-sm flex-grow-1" onClick={() => handleEdit(selected)}>
                          <i className="bi bi-pencil me-1"></i>Edit
                        </button>
                        <button className="btn btn-primary btn-sm flex-grow-1">Record Payment</button>
                      </div>
                      <div className="mt-2">
                        <button className="btn btn-outline-danger btn-sm w-100" onClick={() => setDeleteConfirm(selected)}>
                          <i className="bi bi-trash me-1"></i>Delete Client
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Payments Tab */}
                  {activeTab === "payments" && (
                    <div>
                      <p className="small text-muted mb-2">Transaction history</p>
                      {(selected.invoices || []).length === 0 && (
                        <p className="text-muted small text-center py-3">No invoices yet.</p>
                      )}
                      {(selected.invoices || []).map((invoice, idx) => (
                        <div key={idx} className="bg-light rounded p-2 mb-2 d-flex justify-content-between align-items-center">
                          <div>
                            <p className="mb-0 small fw-semibold">{invoice.id}</p>
                            <p className="small text-muted mb-0">{invoice.date} · {invoice.type}</p>
                          </div>
                          <div className="text-end">
                            <p className={`mb-0 small fw-semibold ${invoice.status === 'paid' ? 'text-success' : 'text-danger'}`}>
                              ₹{Number(invoice.amount).toLocaleString("en-IN")}
                            </p>
                            <span className={`badge ${getInvoiceStatusBadge(invoice.status)} bg-opacity-10 text-${getInvoiceStatusBadge(invoice.status).replace('bg-', '')}`}>
                              {invoice.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      <button className="btn btn-primary btn-sm w-100 mt-2">+ Add Payment</button>
                    </div>
                  )}

                  {/* Projects Tab */}
                  {activeTab === "projects" && (
                    <div>
                      <p className="small text-muted mb-2">Linked projects</p>
                      {(selected.projects || []).length === 0 && (
                        <p className="text-muted small text-center py-3">No projects linked.</p>
                      )}
                      {(selected.projects || []).map((project, idx) => (
                        <div key={idx} className="bg-light rounded p-2 mb-2 d-flex justify-content-between align-items-center">
                          <div>
                            <p className="mb-0 small fw-semibold">{project.name}</p>
                            <p className="small text-muted mb-0">{project.detail}</p>
                          </div>
                          <span className={`badge ${getProjectStatusBadge(project.status)} bg-opacity-10 text-${getProjectStatusBadge(project.status).replace('bg-', '')}`}>
                            {project.status === "completed" ? "Completed" : "In progress"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h6 className="mb-0">Quick Actions</h6>
            </div>
            <div className="card-body">
              {!selected && (
                <p className="text-muted small text-center mb-0">Select a client to use quick actions.</p>
              )}
              {selected && (
                <div className="d-grid gap-2">
                  {/* ── Send Invoice ── */}
                  <button
                    className="btn btn-outline-success btn-sm d-flex align-items-center justify-content-center gap-2"
                    onClick={() => setWaAction("send_invoice")}
                  >
                    <i className="bi bi-whatsapp"></i>
                    Send Invoice to {selected.name.split(" ")[0]}
                  </button>

                  {/* ── Payment Reminder ── */}
                  <button
                    className="btn btn-outline-warning btn-sm d-flex align-items-center justify-content-center gap-2"
                    onClick={() => setWaAction("payment_reminder")}
                    disabled={(selected.pending || 0) === 0}
                    title={(selected.pending || 0) === 0 ? "No pending amount" : "Send reminder"}
                  >
                    <i className="bi bi-bell"></i>
                    Payment Reminder
                    {(selected.pending || 0) > 0 && (
                      <span className="badge bg-danger ms-1">₹{(selected.pending || 0).toLocaleString("en-IN")}</span>
                    )}
                  </button>

                  <button className="btn btn-outline-secondary btn-sm">Export Report</button>
                  <button className="btn btn-outline-secondary btn-sm">View Statement</button>
                </div>
              )}
              {/* WhatsApp note */}
              <p className="text-muted mt-3 mb-0" style={{ fontSize: 11 }}>
                <i className="bi bi-info-circle me-1"></i>
                WhatsApp messages open in a new tab. If the client has no phone, messages go to <strong>{REMINDER_FALLBACK_PHONE}</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}