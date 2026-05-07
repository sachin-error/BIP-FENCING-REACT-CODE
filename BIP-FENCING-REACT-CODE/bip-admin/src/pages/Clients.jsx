import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const COLORS = ["primary", "success", "warning", "info", "danger", "secondary"];

const getInitials = (name) =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

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

// ── Normalize API snake_case → camelCase ──────────────────────────────────
const normalize = (c) => ({
  id: c.id,
  name: c.name ?? '',
  email: c.email ?? '',
  phone: c.phone ?? '',
  address: c.address ?? '',
  gst: c.gst ?? '',
  company: c.company ?? '',
  type: c.client_type ?? c.type ?? '',
  contractValue: Number(c.contract_value ?? c.contractValue ?? 0),
  paid: Number(c.paid ?? 0),
  pending: Number(c.pending ?? 0),
  status: c.payment_status ?? c.status ?? 'partial',
  color: c.color ?? 'primary',
  initials: c.initials ?? (c.name ? c.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() : '?'),
  since: c.since ?? '',
  invoices: c.invoices ?? [],
  projects: c.projects ?? [],
  notes: c.notes ?? '',
  paymentTerms: c.payment_terms ?? c.paymentTerms ?? '',
  startDate: c.start_date ?? c.startDate ?? '',
  endDate: c.end_date ?? c.endDate ?? '',
});

const initialForm = {
  name: '', phone: '', email: '', address: '', gst: '',
  company: '', type: '', contractValue: '', paymentTerms: '',
  startDate: '', endDate: '', notes: '',
};

export default function Clients() {
  const { authToken } = useAuth();
  const [clientsData, setClientsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ── Load clients ──────────────────────────────────────────────────────────
  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/clients`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to load clients');

        const data = await response.json();
        setClientsData((data.data || []).map(normalize));   // ✅ FIX 1
        setError('');
      } catch (err) {
        setError('Failed to load clients: ' + err.message);
        console.error('Error loading clients:', err);
      } finally {
        setLoading(false);
      }
    };

    if (authToken) loadClients();
  }, [authToken]);

  // Set initial selected client once data loads
  useEffect(() => {
    if (clientsData.length > 0 && !selected) {
      setSelected(clientsData[0]);
    }
  }, [clientsData]);

  const totalRevenue = clientsData.reduce((s, c) => s + c.contractValue, 0);
  const totalPaid    = clientsData.reduce((s, c) => s + c.paid, 0);
  const totalPending = clientsData.reduce((s, c) => s + c.pending, 0);
  const overdueCount = clientsData.filter((c) => c.status === "overdue").length;
  const paidPct      = totalRevenue ? Math.round((totalPaid / totalRevenue) * 100) : 0;

  const filtered = clientsData.filter((c) => {
    const q = search.toLowerCase();
    return (
      (c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toString().includes(q) ||
        (c.gst && c.gst.toLowerCase().includes(q))) &&
      (statusFilter ? c.status === statusFilter : true)
    );
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ── Save (Add or Update) ──────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const cv = parseFloat(form.contractValue) || 0;
      const clientData = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        gst: form.gst,
        company: form.company,
        client_type: form.type,
        contract_value: cv,
        payment_terms: form.paymentTerms,
        start_date: form.startDate,
        end_date: form.endDate,
        notes: form.notes,
      };

      if (editingId !== null) {
        const response = await fetch(`${API_BASE_URL}/api/clients/${editingId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(clientData)
        });
        if (!response.ok) throw new Error('Failed to update client');
        setEditingId(null);
      } else {
        const response = await fetch(`${API_BASE_URL}/api/clients`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(clientData)
        });
        if (!response.ok) throw new Error('Failed to create client');
      }

      // Reload clients
      const loadResponse = await fetch(`${API_BASE_URL}/api/clients`, {
        headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' }
      });
      const data = await loadResponse.json();
      setClientsData((data.data || []).map(normalize));   // ✅ FIX 2

      setForm(initialForm);
      setShowForm(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError('Failed to save client: ' + err.message);
      console.error('Error saving client:', err);
    }
  };

  // ── Open Edit form pre-filled ─────────────────────────────────────────────
  const handleEdit = (client) => {
    setForm({
      name: client.name,
      phone: client.phone,
      email: client.email,
      address: client.address,
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

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (clientId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/clients/${clientId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to delete client');

      const loadResponse = await fetch(`${API_BASE_URL}/api/clients`, {
        headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' }
      });
      const data = await loadResponse.json();
      setClientsData((data.data || []).map(normalize));   // ✅ FIX 3

      setDeleteConfirm(null);
      if (selected?.id === clientId) setSelected(null);
    } catch (err) {
      setError('Failed to delete client: ' + err.message);
      console.error('Error deleting client:', err);
    }
  };

  const handleReset = () => { setForm(initialForm); setEditingId(null); };
  const closeForm  = () => { setShowForm(false); setEditingId(null); setForm(initialForm); };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>

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
                  Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
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

      {/* ── Error ── */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show py-2" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
          <button type="button" className="btn-close btn-sm" onClick={() => setError('')}></button>
        </div>
      )}

      {/* ── Stats Cards ── */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <p className="text-muted small mb-1">Total Clients</p>
              <h2 className="mb-2">{clientsData.length}</h2>
              <span className="badge bg-primary bg-opacity-10 text-primary">+3 this month</span>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <p className="text-muted small mb-1">Total Revenue</p>
              <h2 className="mb-2">INR {totalRevenue.toLocaleString()}</h2>
              <span className="badge bg-success bg-opacity-10 text-success">+12% growth</span>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <p className="text-muted small mb-1">Total Paid</p>
              <h2 className="mb-2 text-success">INR {totalPaid.toLocaleString()}</h2>
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
              <h2 className="mb-2 text-danger">INR {totalPending.toLocaleString()}</h2>
              <span className="badge bg-warning bg-opacity-10 text-warning">
                {overdueCount} overdue clients
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
                  <input type="text" className="form-control" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">GST Number</label>
                  <input type="text" className="form-control" name="gst" value={form.gst} onChange={handleChange} placeholder="GST/VAT Number" />
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
                  <label className="form-label">Contract Value (INR)</label>
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
                  <i className="bi bi-check-lg me-2"></i>
                  {editingId ? 'Update Client' : 'Save Client'}
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

      {/* ── Loading ── */}
      {loading && (
        <div className="text-center py-4">
          <span className="spinner-border text-primary" role="status"></span>
          <p className="text-muted mt-2">Loading clients...</p>
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
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: '200px' }}
                />
                <select
                  className="form-select form-select-sm" value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ width: '130px' }}
                >
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
                      onMouseEnter={(e) => { if (selected?.id !== client.id) e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
                      onMouseLeave={(e) => { if (selected?.id !== client.id) e.currentTarget.style.backgroundColor = ''; }}
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
                          {client.email} · {client.phone}
                          {client.gst && ` · ${client.gst}`}
                        </p>
                      </div>

                      <div className="text-end me-3">
                        <p className="mb-0 small fw-semibold text-success">
                          INR {client.paid.toLocaleString()} paid
                        </p>
                        <p className={`mb-0 small ${client.pending > 0 ? 'text-danger' : 'text-success'}`}>
                          {client.pending > 0 ? `INR ${client.pending.toLocaleString()} pending` : 'Fully paid'}
                        </p>
                      </div>

                      <span className={`badge ${statusBadge.class} bg-opacity-10 text-${statusBadge.class.replace('bg-', '')} me-2`}>
                        {statusBadge.label}
                      </span>

                      <div className="d-flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="btn btn-sm btn-outline-secondary py-0 px-2"
                          title="Edit client"
                          onClick={() => handleEdit(client)}
                        >
                          <i className="bi bi-pencil" style={{ fontSize: '12px' }}></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger py-0 px-2"
                          title="Delete client"
                          onClick={() => setDeleteConfirm(client)}
                        >
                          <i className="bi bi-trash" style={{ fontSize: '12px' }}></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card-footer bg-white d-flex justify-content-between align-items-center">
              <span className="small text-muted">
                Showing {filtered.length} of {clientsData.length} clients
              </span>
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
                            <h5 className="text-success mb-0">INR {selected.paid.toLocaleString()}</h5>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="bg-danger bg-opacity-10 rounded p-3 text-center">
                            <p className="small text-danger mb-0">Pending</p>
                            <h5 className="text-danger mb-0">INR {selected.pending.toLocaleString()}</h5>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex justify-content-between small text-muted mb-1">
                          <span>Payment progress</span>
                          <span>{selected.contractValue ? Math.round((selected.paid / selected.contractValue) * 100) : 0}%</span>
                        </div>
                        <div className="progress" style={{ height: '6px' }}>
                          <div
                            className="progress-bar bg-success"
                            style={{ width: `${selected.contractValue ? Math.round((selected.paid / selected.contractValue) * 100) : 0}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="border-top pt-3">
                        {[
                          ["Contract",  `INR ${selected.contractValue.toLocaleString()}`],
                          ["Email",     selected.email],
                          ["Phone",     selected.phone],
                          ["GST",       selected.gst || "—"],
                          ["Company",   selected.company || "—"],
                          ["Since",     selected.since],
                          ["Address",   selected.address],
                        ].map(([key, value]) => (
                          <div key={key} className="d-flex justify-content-between py-2 border-bottom">
                            <span className="small text-muted">{key}</span>
                            <span className="small fw-medium text-end">{value}</span>
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
                      {selected.invoices.length === 0 && (
                        <p className="text-muted small text-center py-3">No invoices yet.</p>
                      )}
                      {selected.invoices.map((invoice) => (
                        <div key={invoice.id} className="bg-light rounded p-2 mb-2 d-flex justify-content-between align-items-center">
                          <div>
                            <p className="mb-0 small fw-semibold">{invoice.id}</p>
                            <p className="small text-muted mb-0">{invoice.date} · {invoice.type}</p>
                          </div>
                          <div className="text-end">
                            <p className={`mb-0 small fw-semibold ${invoice.status === 'paid' ? 'text-success' : 'text-danger'}`}>
                              {invoice.status === 'paid' ? '+' : ''}INR {invoice.amount.toLocaleString()}
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
                      {selected.projects.length === 0 && (
                        <p className="text-muted small text-center py-3">No projects linked.</p>
                      )}
                      {selected.projects.map((project, idx) => (
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
              <div className="d-grid gap-2">
                <button className="btn btn-outline-secondary btn-sm">Send Invoice</button>
                <button className="btn btn-outline-secondary btn-sm">Payment Reminder</button>
                <button className="btn btn-outline-secondary btn-sm">Export Report</button>
                <button className="btn btn-outline-secondary btn-sm">View Statement</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}