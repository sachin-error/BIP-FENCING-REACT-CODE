import { useState, useEffect } from 'react';

// ─── helpers ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'bip_ot_records';

const OT_RATES = [
  { value: '1.25', label: '1.25x – Normal OT' },
  { value: '1.5',  label: '1.5x  – Standard OT' },
  { value: '2.0',  label: '2.0x  – Holiday OT' },
  { value: '2.5',  label: '2.5x  – Special OT' },
];

const DEPARTMENTS = ['Operations', 'Installation', 'Fabrication', 'Welding', 'Logistics', 'Administration', 'Site Supervision', 'Other'];
const OT_TYPES    = ['Regular Overtime', 'Holiday Work', 'Emergency Call-out', 'Weekend Work', 'Night Shift Extension', 'Project Deadline'];
const STATUSES    = ['Pending', 'Approved', 'Rejected', 'Paid'];

const statusColor = { Pending: 'warning', Approved: 'success', Rejected: 'danger', Paid: 'info' };

const emptyForm = {
  employeeName: '', employeeId: '', date: '', department: '',
  otType: '', shift: 'Day', regularHours: 8, otHours: '',
  otRate: '1.5', basicHourlyRate: '', reason: '', approvedBy: '',
  status: 'Pending', notes: '',
};

const calcOTPay = (f) =>
  (Number(f.otHours) || 0) * (Number(f.basicHourlyRate) || 0) * (Number(f.otRate) || 1.5);

// ─── component ──────────────────────────────────────────────────────────────
export default function OT() {
  const [records, setRecords] = useState(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });

  const [form, setForm]           = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch]       = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDept, setFilterDept]     = useState('');
  const [submitted, setSubmitted] = useState(false);

  // persist — Dashboard reads this same key
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); }, [records]);

  const otPay = calcOTPay(form);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ── submit ──
  const handleSubmit = (e) => {
    e.preventDefault();
    const pay    = calcOTPay(form);
    const record = { ...form, otPay: pay, id: editingId ?? Date.now() };

    if (editingId) {
      setRecords(prev => prev.map(r => r.id === editingId ? record : r));
      setEditingId(null);
    } else {
      setRecords(prev => [record, ...prev]);
    }

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm(emptyForm);
    setShowForm(false);
  };

  // ── edit ──
  const handleEdit = (rec) => {
    setForm({ ...rec });
    setEditingId(rec.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── delete ──
  const handleDelete = (id) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    setDeleteConfirm(null);
  };

  // ── filtered records ──
  const filtered = records.filter(r => {
    const q = search.toLowerCase();
    const matchQ = !q || r.employeeName.toLowerCase().includes(q) || (r.employeeId || '').toLowerCase().includes(q) || (r.department || '').toLowerCase().includes(q);
    const matchS = !filterStatus || r.status === filterStatus;
    const matchD = !filterDept  || r.department === filterDept;
    return matchQ && matchS && matchD;
  });

  // ── summary stats ──
  const totalOTHours  = records.reduce((s, r) => s + (Number(r.otHours) || 0), 0);
  const totalOTPay    = records.reduce((s, r) => s + (Number(r.otPay)  || 0), 0);
  const pendingCount  = records.filter(r => r.status === 'Pending').length;
  const approvedCount = records.filter(r => r.status === 'Approved').length;

  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(emptyForm); };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>

      {/* ── Delete Modal ── */}
      {deleteConfirm && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.45)', zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h6 className="modal-title text-danger">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>Delete OT Record
                </h6>
              </div>
              <div className="modal-body">
                <p className="mb-0">Delete OT record for <strong>{deleteConfirm.employeeName}</strong> on <strong>{deleteConfirm.date}</strong>? This cannot be undone.</p>
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
          <h1 className="h3 mb-1">
            <i className="bi bi-clock-history me-2" style={{ color: '#bc4c00' }}></i>Overtime (OT)
          </h1>
          <p className="text-muted mb-0">Record, track and manage employee overtime hours</p>
        </div>
        <button className="btn btn-primary" style={{ background: '#bc4c00', borderColor: '#bc4c00' }}
          onClick={() => showForm ? closeForm() : setShowForm(true)}>
          <i className="bi bi-plus-lg me-2"></i>
          {showForm ? 'Close Form' : 'Add OT Record'}
        </button>
      </div>

      {/* ── Stats Cards ── */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <p className="text-muted small mb-1">Total Records</p>
              <h2 className="mb-2">{records.length}</h2>
              <span className="badge bg-primary bg-opacity-10 text-primary">All time</span>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <p className="text-muted small mb-1">Total OT Hours</p>
              <h2 className="mb-2">{totalOTHours.toFixed(1)} hrs</h2>
              <span className="badge bg-warning bg-opacity-10 text-warning">{pendingCount} pending</span>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <p className="text-muted small mb-1">Total OT Pay</p>
              <h2 className="mb-2">INR {totalOTPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              <span className="badge bg-success bg-opacity-10 text-success">{approvedCount} approved</span>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <p className="text-muted small mb-1">Avg OT Hours / Record</p>
              <h2 className="mb-2">{records.length ? (totalOTHours / records.length).toFixed(1) : '0.0'} hrs</h2>
              <span className="badge bg-info bg-opacity-10 text-info">per entry</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Add / Edit Form ── */}
      {showForm && (
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white">
            <h6 className="mb-0">
              <i className={`bi ${editingId ? 'bi-pencil-fill text-warning' : 'bi-person-clock text-primary'} me-2`}></i>
              {editingId ? 'Edit OT Record' : 'Add New OT Record'}
            </h6>
          </div>
          <div className="card-body">
            {submitted && (
              <div className="alert alert-success alert-dismissible fade show py-2" role="alert">
                <i className="bi bi-check-circle-fill me-2"></i>
                OT record {editingId ? 'updated' : 'saved'} successfully!
                <button type="button" className="btn-close btn-sm" onClick={() => setSubmitted(false)}></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Employee Info */}
              <p className="text-muted small fw-semibold mb-2 mt-1" style={{ letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: 11 }}>
                Employee Information
              </p>
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label">Employee Name <span className="text-danger">*</span></label>
                  <input className="form-control" name="employeeName" value={form.employeeName} onChange={handleChange} placeholder="Full name" required />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Employee ID</label>
                  <input className="form-control" name="employeeId" value={form.employeeId} onChange={handleChange} placeholder="EMP-001" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Department</label>
                  <select className="form-select" name="department" value={form.department} onChange={handleChange}>
                    <option value="">Select...</option>
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label">Shift</label>
                  <select className="form-select" name="shift" value={form.shift} onChange={handleChange}>
                    <option>Day</option>
                    <option>Night</option>
                    <option>Split</option>
                  </select>
                </div>
              </div>

              {/* OT Details */}
              <p className="text-muted small fw-semibold mb-2" style={{ letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: 11 }}>
                OT Details
              </p>
              <div className="row g-3 mb-3">
                <div className="col-md-3">
                  <label className="form-label">Date <span className="text-danger">*</span></label>
                  <input type="date" className="form-control" name="date" value={form.date} onChange={handleChange} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label">OT Type</label>
                  <select className="form-select" name="otType" value={form.otType} onChange={handleChange}>
                    <option value="">Select...</option>
                    {OT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label">Regular Hrs/Day</label>
                  <input type="number" className="form-control" name="regularHours" value={form.regularHours} onChange={handleChange} min="1" max="24" />
                </div>
                <div className="col-md-2">
                  <label className="form-label">OT Hours <span className="text-danger">*</span></label>
                  <input type="number" className="form-control" name="otHours" value={form.otHours} onChange={handleChange} placeholder="2.5" min="0" step="0.5" required />
                </div>
                <div className="col-md-2">
                  <label className="form-label">OT Multiplier</label>
                  <select className="form-select" name="otRate" value={form.otRate} onChange={handleChange}>
                    {OT_RATES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Pay & Approval */}
              <p className="text-muted small fw-semibold mb-2" style={{ letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: 11 }}>
                Pay & Approval
              </p>
              <div className="row g-3 mb-3">
                <div className="col-md-3">
                  <label className="form-label">Basic Hourly Rate</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ fontSize: 12, background: '#f6f8fa' }}>INR</span>
                    <input type="number" className="form-control" name="basicHourlyRate" value={form.basicHourlyRate} onChange={handleChange} placeholder="0.00" min="0" step="0.01" />
                  </div>
                </div>
                <div className="col-md-3">
                  <label className="form-label">OT Pay (Auto-calculated)</label>
                  <div className="form-control d-flex align-items-center"
                    style={{ background: otPay > 0 ? '#fff1e5' : '#f6f8fa', fontWeight: 700, color: '#bc4c00', fontSize: 15, fontFamily: 'monospace' }}>
                    INR {otPay.toFixed(2)}
                  </div>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Approved By</label>
                  <input className="form-control" name="approvedBy" value={form.approvedBy} onChange={handleChange} placeholder="Manager name" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Status</label>
                  <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Reason for OT <span className="text-danger">*</span></label>
                  <input className="form-control" name="reason" value={form.reason} onChange={handleChange} placeholder="Project deadline, urgent work..." required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Notes</label>
                  <textarea className="form-control" name="notes" value={form.notes} onChange={handleChange} rows={1} placeholder="Additional remarks..." />
                </div>
              </div>

              <div className="d-flex gap-2 mt-2">
                <button type="submit" className="btn btn-primary" style={{ background: '#bc4c00', borderColor: '#bc4c00' }}>
                  <i className="bi bi-check-lg me-2"></i>{editingId ? 'Update Record' : 'Save OT Record'}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => setForm(emptyForm)}>
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

      {/* ── Records Table ── */}
      <div className="card shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h6 className="mb-0">OT Records</h6>
          <div className="d-flex gap-2 flex-wrap">
            <input
              type="text" className="form-control form-control-sm" placeholder="Search name / ID / dept..."
              value={search} onChange={e => setSearch(e.target.value)} style={{ width: 210 }}
            />
            <select className="form-select form-select-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 130 }}>
              <option value="">All Status</option>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
            <select className="form-select form-select-sm" value={filterDept} onChange={e => setFilterDept(e.target.value)} style={{ width: 150 }}>
              <option value="">All Depts</option>
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="card-body p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-clock-history text-muted" style={{ fontSize: 40 }}></i>
              <p className="text-muted mt-2 mb-0">
                {records.length === 0 ? 'No OT records yet. Add one above.' : 'No records match your filter.'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table table-hover align-middle mb-0" style={{ fontSize: 13 }}>
                <thead className="table-light">
                  <tr>
                    <th>Employee</th>
                    <th>Dept</th>
                    <th>Date</th>
                    <th>OT Type</th>
                    <th>Shift</th>
                    <th>Reg Hrs</th>
                    <th>OT Hrs</th>
                    <th>Multiplier</th>
                    <th>Rate</th>
                    <th style={{ color: '#bc4c00' }}>OT Pay</th>
                    <th>Reason</th>
                    <th>Approved By</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(rec => (
                    <tr key={rec.id}>
                      <td>
                        <div className="fw-semibold">{rec.employeeName}</div>
                        <div className="text-muted" style={{ fontSize: 11 }}>{rec.employeeId || '—'}</div>
                      </td>
                      <td>{rec.department || '—'}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{rec.date}</td>
                      <td>{rec.otType || '—'}</td>
                      <td>
                        <span className={`badge bg-${rec.shift === 'Night' ? 'dark' : rec.shift === 'Split' ? 'secondary' : 'primary'} bg-opacity-10 text-${rec.shift === 'Night' ? 'dark' : rec.shift === 'Split' ? 'secondary' : 'primary'}`}>
                          {rec.shift}
                        </span>
                      </td>
                      <td>{rec.regularHours} hrs</td>
                      <td className="fw-semibold">{rec.otHours} hrs</td>
                      <td>{rec.otRate}x</td>
                      <td>INR {Number(rec.basicHourlyRate || 0).toFixed(2)}</td>
                      <td className="fw-bold" style={{ color: '#bc4c00', fontFamily: 'monospace' }}>
                        INR {Number(rec.otPay || 0).toFixed(2)}
                      </td>
                      <td style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={rec.reason}>
                        {rec.reason}
                      </td>
                      <td>{rec.approvedBy || '—'}</td>
                      <td>
                        <span className={`badge bg-${statusColor[rec.status] || 'secondary'} bg-opacity-10 text-${statusColor[rec.status] || 'secondary'}`}>
                          {rec.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-secondary py-0 px-2" title="Edit" onClick={() => handleEdit(rec)}>
                            <i className="bi bi-pencil" style={{ fontSize: 12 }}></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger py-0 px-2" title="Delete" onClick={() => setDeleteConfirm(rec)}>
                            <i className="bi bi-trash" style={{ fontSize: 12 }}></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="table-light">
                  <tr>
                    <td colSpan={6} className="fw-semibold text-muted small">Totals ({filtered.length} records)</td>
                    <td className="fw-bold">{filtered.reduce((s, r) => s + (Number(r.otHours) || 0), 0).toFixed(1)} hrs</td>
                    <td colSpan={2}></td>
                    <td className="fw-bold" style={{ color: '#bc4c00', fontFamily: 'monospace' }}>
                      INR {filtered.reduce((s, r) => s + (Number(r.otPay) || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td colSpan={4}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        <div className="card-footer bg-white">
          <span className="small text-muted">Showing {filtered.length} of {records.length} records</span>
        </div>
      </div>
    </div>
  );
}