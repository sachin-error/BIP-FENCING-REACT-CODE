import { useState } from 'react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const PAYMENT_MODES = ['Bank Transfer','Cash','Cheque','Online'];

const emptyForm = {
  employeeName: '', employeeId: '', designation: '', department: '',
  month: '', year: new Date().getFullYear(),
  basicSalary: '', hra: '', transport: '', otAmount: '', bonus: '',
  deductions: '', taxDeduction: '',
  paymentMode: 'Bank Transfer', notes: '',
};

// ── seed records so the table has something to show ──────────────────────────
const SEED = [
  { id: 1, employeeName: 'Ramesh Kumar',  employeeId: 'EMP-001', designation: 'Fencing Technician', department: 'Operations', month: 'March',    year: 2026, basicSalary: '18000', hra: '3000', transport: '1200', otAmount: '800',  bonus: '0',    deductions: '500',  taxDeduction: '900',  paymentMode: 'Bank Transfer', notes: '' },
  { id: 2, employeeName: 'Selvi Durai',   employeeId: 'EMP-002', designation: 'Site Supervisor',    department: 'Operations', month: 'March',    year: 2026, basicSalary: '22000', hra: '4000', transport: '1500', otAmount: '0',    bonus: '2000', deductions: '800',  taxDeduction: '1200', paymentMode: 'Bank Transfer', notes: 'Performance bonus' },
  { id: 3, employeeName: 'Anbu Chelvan',  employeeId: 'EMP-003', designation: 'Welder',             department: 'Workshop',   month: 'April',    year: 2026, basicSalary: '16000', hra: '2500', transport: '1000', otAmount: '1600', bonus: '0',    deductions: '400',  taxDeduction: '700',  paymentMode: 'Cash',          notes: '' },
  { id: 4, employeeName: 'Meena Raj',     employeeId: 'EMP-004', designation: 'Office Admin',       department: 'Admin',      month: 'April',    year: 2026, basicSalary: '14000', hra: '2000', transport: '800',  otAmount: '0',    bonus: '0',    deductions: '300',  taxDeduction: '600',  paymentMode: 'Bank Transfer', notes: '' },
];

function calcSalary(r) {
  const gross = ['basicSalary','hra','transport','otAmount','bonus'].reduce((s,k)=>s+(Number(r[k])||0),0);
  const ded   = (Number(r.deductions)||0) + (Number(r.taxDeduction)||0);
  return { gross, ded, net: gross - ded };
}

export default function Salary() {
  const [records, setRecords]     = useState(SEED);
  const [form, setForm]           = useState(emptyForm);
  const [view, setView]           = useState('form');   // 'form' | 'table'
  const [editId, setEditId]       = useState(null);
  const [deleteId, setDeleteId]   = useState(null);
  const [viewRec, setViewRec]     = useState(null);
  const [search, setSearch]       = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  const { gross, ded, net } = calcSalary(form);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => { setForm(emptyForm); setEditId(null); };

  // ── Save (add or update) ──────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId !== null) {
      setRecords(records.map(r => r.id === editId ? { ...form, id: editId } : r));
      setEditId(null);
    } else {
      setRecords([...records, { ...form, id: Date.now() }]);
    }
    setForm(emptyForm);
    setView('table');
  };

  // ── Edit ──────────────────────────────────────────────────────────────────
  const handleEdit = (rec) => {
    setForm({ ...rec });
    setEditId(rec.id);
    setView('form');
    window.scrollTo(0, 0);
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = (id) => {
    setRecords(records.filter(r => r.id !== id));
    setDeleteId(null);
  };

  // ── Filtered records ──────────────────────────────────────────────────────
  const filtered = records.filter(r => {
    const matchSearch = r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
                        r.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchMonth  = filterMonth ? r.month === filterMonth : true;
    return matchSearch && matchMonth;
  });

  const totalNet = filtered.reduce((s, r) => s + calcSalary(r).net, 0);

  // ── INR formatter ─────────────────────────────────────────────────────────
  const inr = (v) => `₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  return (
    <>
      <style>{`
        .sal-tab-bar {
          display: flex; gap: 0; border-bottom: 2px solid #e1e8ed; margin-bottom: 24px;
        }
        .sal-tab {
          padding: 10px 22px; font-size: 13.5px; font-weight: 600;
          border: none; background: none; cursor: pointer;
          color: #57606a; border-bottom: 2px solid transparent;
          margin-bottom: -2px; transition: all .15s; display:flex; align-items:center; gap:6px;
          font-family: Sora, sans-serif;
        }
        .sal-tab.active { color: #1a7f37; border-bottom-color: #1a7f37; }
        .sal-tab:hover:not(.active) { color: #24292f; background: #f6f8fa; }

        /* ── Form card ── */
        .client-form-card { background:#fff; border-radius:12px; padding:20px; border:1px solid #e1e8ed; }

        /* ── Records table card ── */
        .sal-records-card {
          background: #fff; border-radius: 12px; border: 1px solid #e1e8ed;
          overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,.06);
        }
        .sal-toolbar {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
          padding: 14px 18px; border-bottom: 1px solid #e1e8ed; background: #f6f8fa;
        }
        .sal-search {
          flex: 1; min-width: 180px; padding: 8px 12px 8px 34px;
          border: 1px solid #d0d7de; border-radius: 7px; font-size: 13px;
          font-family: Sora, sans-serif; outline: none; background: #fff;
        }
        .sal-search:focus { border-color: #1a7f37; box-shadow: 0 0 0 3px rgba(26,127,55,.1); }
        .sal-search-wrap { position: relative; flex:1; min-width:180px; }
        .sal-search-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#8c959f; pointer-events:none; }
        .sal-filter-select {
          padding: 8px 12px; border: 1px solid #d0d7de; border-radius: 7px;
          font-size: 13px; font-family: Sora, sans-serif; outline: none; background: #fff; cursor:pointer;
        }
        .sal-filter-select:focus { border-color: #1a7f37; }

        /* Summary strip */
        .sal-summary {
          display: flex; gap: 0; border-bottom: 1px solid #e1e8ed;
        }
        .sal-sum-item {
          flex: 1; padding: 12px 18px; border-right: 1px solid #e1e8ed;
          display: flex; flex-direction: column; gap: 2px;
        }
        .sal-sum-item:last-child { border-right: none; }
        .sal-sum-lbl { font-size: 11px; color: #8c959f; text-transform: uppercase; letter-spacing: .06em; font-weight: 600; }
        .sal-sum-val { font-size: 15px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }

        /* Table */
        .sal-table-wrap { overflow-x: auto; }
        .sal-table {
          width: 100%; border-collapse: collapse; font-size: 13.5px;
        }
        .sal-table thead tr { background: #f6f8fa; }
        .sal-table th {
          padding: 11px 14px; text-align: left; font-size: 11.5px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .07em; color: #57606a;
          border-bottom: 1px solid #e1e8ed; white-space: nowrap;
        }
        .sal-table td {
          padding: 12px 14px; border-bottom: 1px solid #f3f4f6;
          vertical-align: middle; color: #24292f;
        }
        .sal-table tbody tr:last-child td { border-bottom: none; }
        .sal-table tbody tr:hover td { background: #f6fbf8; }

        .sal-emp-name { font-weight: 600; }
        .sal-emp-id   { font-size: 11.5px; color: #8c959f; margin-top: 1px; font-family: 'JetBrains Mono', monospace; }
        .sal-desg     { font-size: 12.5px; color: #57606a; }
        .sal-mono     { font-family: 'JetBrains Mono', monospace; font-weight: 600; }
        .sal-net-pos  { color: #1a7f37; }
        .sal-ded-neg  { color: #cf222e; }

        .sal-month-chip {
          display:inline-block; padding: 3px 10px; border-radius: 20px;
          background: #ddf4e8; color: #1a7f37; font-size: 11.5px; font-weight: 700;
          letter-spacing: .03em;
        }
        .sal-mode-chip {
          display:inline-flex; align-items:center; gap:4px;
          padding: 3px 10px; border-radius: 20px;
          background: #f0f6ff; color: #0969da; font-size: 11.5px; font-weight: 600;
        }

        /* Action buttons */
        .sal-actions { display: flex; gap: 6px; }
        .sal-btn-view {
          display:inline-flex; align-items:center; gap:4px;
          padding: 5px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;
          border: 1px solid #d0d7de; background: #f6f8fa; color: #24292f; cursor: pointer;
          font-family: Sora, sans-serif; transition: all .15s;
        }
        .sal-btn-view:hover { background: #fff; border-color: #8c959f; }
        .sal-btn-edit {
          display:inline-flex; align-items:center; gap:4px;
          padding: 5px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;
          border: 1px solid #d4e9f7; background: #f0f8ff; color: #0969da; cursor: pointer;
          font-family: Sora, sans-serif; transition: all .15s;
        }
        .sal-btn-edit:hover { background: #dbeeff; }
        .sal-btn-del {
          display:inline-flex; align-items:center; gap:4px;
          padding: 5px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;
          border: 1px solid #ffd8d3; background: #fff1f0; color: #cf222e; cursor: pointer;
          font-family: Sora, sans-serif; transition: all .15s;
        }
        .sal-btn-del:hover { background: #ffe0db; }

        /* Empty state */
        .sal-empty { text-align: center; padding: 56px 20px; color: #8c959f; }
        .sal-empty-icon { font-size: 3rem; margin-bottom: 12px; }
        .sal-empty p { font-size: 14px; }

        /* ── Modal backdrop ── */
        .sal-modal-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,.45);
          z-index: 1000; display: flex; align-items: center; justify-content: center;
          padding: 20px; animation: sal-fade-in .15s ease;
        }
        @keyframes sal-fade-in { from { opacity:0 } to { opacity:1 } }

        /* Delete confirm modal */
        .sal-del-modal {
          background: #fff; border-radius: 12px; padding: 28px 28px 22px;
          max-width: 380px; width: 100%; box-shadow: 0 8px 32px rgba(0,0,0,.18);
          animation: sal-slide-up .18s ease;
        }
        @keyframes sal-slide-up { from { transform:translateY(16px); opacity:0 } to { transform:translateY(0); opacity:1 } }
        .sal-del-icon { font-size: 2.4rem; margin-bottom: 10px; }
        .sal-del-title { font-size: 16px; font-weight: 700; color: #24292f; margin-bottom: 6px; }
        .sal-del-msg   { font-size: 13.5px; color: #57606a; margin-bottom: 22px; line-height: 1.5; }
        .sal-del-actions { display: flex; gap: 10px; justify-content: flex-end; }
        .sal-cancel-btn {
          padding: 8px 18px; border: 1px solid #d0d7de; border-radius: 7px;
          background: #f6f8fa; color: #24292f; font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: Sora, sans-serif;
        }
        .sal-cancel-btn:hover { background: #e1e8ed; }
        .sal-confirm-del-btn {
          padding: 8px 18px; border: none; border-radius: 7px;
          background: #cf222e; color: #fff; font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: Sora, sans-serif; transition: background .15s;
        }
        .sal-confirm-del-btn:hover { background: #a11423; }

        /* View detail modal */
        .sal-view-modal {
          background: #fff; border-radius: 14px; max-width: 520px; width: 100%;
          box-shadow: 0 8px 40px rgba(0,0,0,.2);
          animation: sal-slide-up .18s ease; overflow: hidden;
        }
        .sal-view-header {
          padding: 20px 24px 16px;
          background: linear-gradient(135deg, #1a7f37 0%, #2da44e 100%);
          color: #fff;
        }
        .sal-view-header h3 { font-size: 17px; font-weight: 700; margin-bottom: 2px; }
        .sal-view-header p  { font-size: 12.5px; opacity: .82; }
        .sal-view-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }
        .sal-view-section-title {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: .08em; color: #8c959f; margin-bottom: 8px;
        }
        .sal-view-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; }
        .sal-view-item-lbl { font-size: 11.5px; color: #8c959f; font-weight: 600; }
        .sal-view-item-val { font-size: 13.5px; color: #24292f; font-weight: 500; margin-top: 1px; }
        .sal-view-amounts {
          background: #f6f8fa; border-radius: 10px; padding: 14px 16px;
          display: flex; flex-direction: column; gap: 7px;
        }
        .sal-view-row { display: flex; justify-content: space-between; font-size: 13.5px; }
        .sal-view-divider { height: 1px; background: #d0d7de; margin: 4px 0; }
        .sal-view-net { font-weight: 700; font-size: 15px; }
        .sal-view-footer { padding: 14px 24px; border-top: 1px solid #e1e8ed; display:flex; justify-content:flex-end; }
        .sal-close-btn {
          padding: 8px 20px; border: 1px solid #d0d7de; border-radius: 7px;
          background: #f6f8fa; color: #24292f; font-weight: 600; font-size: 13px;
          cursor: pointer; font-family: Sora, sans-serif;
        }

        /* Form submit */
        .sal-submit-btn {
          background: #1a7f37; border: none; color: white;
          padding: 10px 24px; border-radius: 8px;
          font-family: Sora, sans-serif; font-size: 14px; font-weight: 600; cursor: pointer;
          display: inline-flex; align-items: center; gap: 7px;
          transition: background .15s;
        }
        .sal-submit-btn:hover { background: #116329; }
        .btn-reset {
          padding: 10px 20px; border-radius: 8px; border: 1px solid #d0d7de;
          background: #f6f8fa; color: #24292f; font-family: Sora, sans-serif;
          font-size: 14px; font-weight: 600; cursor: pointer;
          display: inline-flex; align-items: center; gap: 7px;
        }
        .btn-reset:hover { background: #e1e8ed; }
      `}</style>

      {/* ── Page header ── */}
      <div className="page-header">
        <h1>
          <i className="bi bi-cash-stack me-2" style={{ color: '#1a7f37' }}></i>
          Salary
        </h1>
        <p>Manage employee salary records and payroll</p>
      </div>

      {/* ── Tab bar ── */}
      <div className="sal-tab-bar">
        <button
          className={`sal-tab ${view === 'form' ? 'active' : ''}`}
          onClick={() => { setView('form'); resetForm(); }}
        >
          <i className="bi bi-plus-circle"></i>
          {editId !== null ? 'Edit Record' : 'Add Salary'}
        </button>
        <button
          className={`sal-tab ${view === 'table' ? 'active' : ''}`}
          onClick={() => { setView('table'); setEditId(null); }}
        >
          <i className="bi bi-table"></i>
          Salary Records
          <span style={{
            background: '#ddf4e8', color: '#1a7f37', borderRadius: 20,
            padding: '1px 8px', fontSize: 11.5, fontWeight: 700, marginLeft: 2
          }}>{records.length}</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          FORM VIEW
      ══════════════════════════════════════════════════════════════════════ */}
      {view === 'form' && (
        <form onSubmit={handleSubmit}>
          <div className="row g-3">

            {/* Employee details */}
            <div className="col-12">
              <div className="client-form-card shadow-sm">
                <h6 style={{ fontWeight: 700, fontSize: 14, marginBottom: 18 }}>
                  <i className="bi bi-person-badge me-2" style={{ color: '#1a7f37' }}></i>
                  Employee Details
                </h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Employee Name <span style={{ color: 'red' }}>*</span></label>
                    <input className="form-control" name="employeeName" value={form.employeeName} onChange={handleChange} placeholder="Full name" required />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Employee ID</label>
                    <input className="form-control" name="employeeId" value={form.employeeId} onChange={handleChange} placeholder="EMP-001" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Department</label>
                    <input className="form-control" name="department" value={form.department} onChange={handleChange} placeholder="Operations" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Designation</label>
                    <input className="form-control" name="designation" value={form.designation} onChange={handleChange} placeholder="Fencing Technician" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Month <span style={{ color: 'red' }}>*</span></label>
                    <select className="form-select" name="month" value={form.month} onChange={handleChange} required>
                      <option value="">Select Month</option>
                      {MONTHS.map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Year</label>
                    <input type="number" className="form-control" name="year" value={form.year} onChange={handleChange} min="2020" max="2099" />
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings */}
            <div className="col-md-6">
              <div className="client-form-card shadow-sm" style={{ height: '100%' }}>
                <h6 style={{ fontWeight: 700, fontSize: 14, marginBottom: 18 }}>
                  <i className="bi bi-plus-circle me-2" style={{ color: '#1a7f37' }}></i>Earnings
                </h6>
                <div className="row g-3">
                  {[['basicSalary','Basic Salary'],['hra','HRA / Accommodation'],['transport','Transport Allowance'],['otAmount','Overtime (OT) Amount'],['bonus','Bonus']].map(([name, label]) => (
                    <div className="col-12" key={name}>
                      <label className="form-label">{label}</label>
                      <div className="input-group">
                        <span className="input-group-text" style={{ fontSize: 12, background: '#f6f8fa' }}>INR</span>
                        <input type="number" className="form-control" name={name} value={form[name]} onChange={handleChange} placeholder="0.00" min="0" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Deductions + Summary */}
            <div className="col-md-6">
              <div className="client-form-card shadow-sm" style={{ height: '100%' }}>
                <h6 style={{ fontWeight: 700, fontSize: 14, marginBottom: 18 }}>
                  <i className="bi bi-dash-circle me-2" style={{ color: '#cf222e' }}></i>Deductions
                </h6>
                <div className="row g-3">
                  {[['deductions','Other Deductions'],['taxDeduction','Tax Deduction']].map(([name, label]) => (
                    <div className="col-12" key={name}>
                      <label className="form-label">{label}</label>
                      <div className="input-group">
                        <span className="input-group-text" style={{ fontSize: 12, background: '#fff1f0', color: '#cf222e' }}>INR</span>
                        <input type="number" className="form-control" name={name} value={form[name]} onChange={handleChange} placeholder="0.00" min="0" />
                      </div>
                    </div>
                  ))}
                </div>
                {/* Live summary */}
                <div style={{ marginTop: 24, background: '#f6f8fa', borderRadius: 10, padding: 16 }}>
                  {[['Gross Salary', gross, '#24292f'],['Total Deductions', ded, '#cf222e']].map(([l, v, c]) => (
                    <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize: 13.5, marginBottom: 6 }}>
                      <span style={{ color: '#57606a' }}>{l}</span>
                      <span style={{ fontFamily:'JetBrains Mono, monospace', fontWeight:600, color:c }}>INR {v.toFixed(2)}</span>
                    </div>
                  ))}
                  <div style={{ height:1, background:'#d0d7de', margin:'8px 0' }} />
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:15 }}>
                    <span style={{ fontWeight:700 }}>Net Salary</span>
                    <span style={{ fontFamily:'JetBrains Mono, monospace', fontWeight:700, color:'#1a7f37' }}>INR {net.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment mode + Notes */}
            <div className="col-12">
              <div className="client-form-card shadow-sm">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Payment Mode</label>
                    <select className="form-select" name="paymentMode" value={form.paymentMode} onChange={handleChange}>
                      {PAYMENT_MODES.map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="col-md-8">
                    <label className="form-label">Notes</label>
                    <input className="form-control" name="notes" value={form.notes} onChange={handleChange} placeholder="Additional notes..." />
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="col-12">
              <div style={{ display:'flex', gap:10 }}>
                <button type="submit" className="sal-submit-btn">
                  <i className={`bi ${editId !== null ? 'bi-pencil-square' : 'bi-check-lg'}`}></i>
                  {editId !== null ? 'Update Record' : 'Save Salary Record'}
                </button>
                <button type="button" className="btn-reset" onClick={resetForm}>
                  <i className="bi bi-arrow-counterclockwise"></i>Reset
                </button>
                {records.length > 0 && (
                  <button type="button" className="btn-reset" style={{ marginLeft:'auto' }} onClick={() => setView('table')}>
                    <i className="bi bi-table me-1"></i>View All Records
                  </button>
                )}
              </div>
            </div>

          </div>
        </form>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TABLE VIEW
      ══════════════════════════════════════════════════════════════════════ */}
      {view === 'table' && (
        <div className="sal-records-card">

          {/* Toolbar */}
          <div className="sal-toolbar">
            <div className="sal-search-wrap">
              <span className="sal-search-icon">
                <i className="bi bi-search" style={{ fontSize: 13 }}></i>
              </span>
              <input
                className="sal-search"
                placeholder="Search by name or ID…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="sal-filter-select" value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
              <option value="">All Months</option>
              {MONTHS.map(m => <option key={m}>{m}</option>)}
            </select>
            <button
              onClick={() => { setView('form'); resetForm(); }}
              style={{
                padding:'8px 16px', background:'#1a7f37', border:'none', borderRadius:7,
                color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer',
                fontFamily:'Sora, sans-serif', display:'flex', alignItems:'center', gap:6
              }}
            >
              <i className="bi bi-plus-lg"></i>Add New
            </button>
          </div>

          {/* Summary strip */}
          <div className="sal-summary">
            {[
              { lbl: 'Total Records',     val: filtered.length,                                        mono: false, color:'#24292f' },
              { lbl: 'Total Gross',       val: inr(filtered.reduce((s,r)=>s+calcSalary(r).gross,0)),   mono: true,  color:'#24292f' },
              { lbl: 'Total Deductions',  val: inr(filtered.reduce((s,r)=>s+calcSalary(r).ded,0)),     mono: true,  color:'#cf222e' },
              { lbl: 'Total Net Payable', val: inr(totalNet),                                          mono: true,  color:'#1a7f37' },
            ].map(s => (
              <div key={s.lbl} className="sal-sum-item">
                <div className="sal-sum-lbl">{s.lbl}</div>
                <div className="sal-sum-val" style={{ color: s.color, fontFamily: s.mono ? "'JetBrains Mono', monospace" : 'Sora, sans-serif' }}>
                  {s.val}
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="sal-table-wrap">
            {filtered.length === 0 ? (
              <div className="sal-empty">
                <div className="sal-empty-icon">📋</div>
                <p>No salary records found.<br />
                  <span style={{ color:'#1a7f37', cursor:'pointer', fontWeight:600 }} onClick={() => { setView('form'); resetForm(); }}>
                    Add the first record →
                  </span>
                </p>
              </div>
            ) : (
              <table className="sal-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Employee</th>
                    <th>Designation</th>
                    <th>Period</th>
                    <th>Gross</th>
                    <th>Deductions</th>
                    <th>Net Salary</th>
                    <th>Mode</th>
                    <th style={{ textAlign:'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((rec, idx) => {
                    const { gross, ded, net } = calcSalary(rec);
                    return (
                      <tr key={rec.id}>
                        <td style={{ color:'#8c959f', fontWeight:600, fontSize:12 }}>{idx + 1}</td>
                        <td>
                          <div className="sal-emp-name">{rec.employeeName}</div>
                          <div className="sal-emp-id">{rec.employeeId || '—'}</div>
                        </td>
                        <td>
                          <div className="sal-desg">{rec.designation || '—'}</div>
                          <div style={{ fontSize:11.5, color:'#b0b8c1', marginTop:1 }}>{rec.department || ''}</div>
                        </td>
                        <td>
                          <span className="sal-month-chip">{rec.month} {rec.year}</span>
                        </td>
                        <td>
                          <span className="sal-mono">{inr(gross)}</span>
                        </td>
                        <td>
                          <span className="sal-mono sal-ded-neg">−{inr(ded)}</span>
                        </td>
                        <td>
                          <span className="sal-mono sal-net-pos">{inr(net)}</span>
                        </td>
                        <td>
                          <span className="sal-mode-chip">
                            <i className={`bi ${
                              rec.paymentMode === 'Cash' ? 'bi-cash' :
                              rec.paymentMode === 'Cheque' ? 'bi-journal-check' :
                              rec.paymentMode === 'Online' ? 'bi-globe' :
                              'bi-bank'
                            }`} style={{ fontSize: 11 }}></i>
                            {rec.paymentMode}
                          </span>
                        </td>
                        <td>
                          <div className="sal-actions" style={{ justifyContent:'flex-end' }}>
                            <button className="sal-btn-view" onClick={() => setViewRec(rec)}>
                              <i className="bi bi-eye" style={{ fontSize:12 }}></i> View
                            </button>
                            <button className="sal-btn-edit" onClick={() => handleEdit(rec)}>
                              <i className="bi bi-pencil" style={{ fontSize:12 }}></i> Edit
                            </button>
                            <button className="sal-btn-del" onClick={() => setDeleteId(rec.id)}>
                              <i className="bi bi-trash" style={{ fontSize:12 }}></i> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          DELETE CONFIRM MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      {deleteId !== null && (
        <div className="sal-modal-backdrop" onClick={() => setDeleteId(null)}>
          <div className="sal-del-modal" onClick={e => e.stopPropagation()}>
            <div className="sal-del-icon">🗑️</div>
            <div className="sal-del-title">Delete Salary Record?</div>
            <div className="sal-del-msg">
              This will permanently remove the salary record for{' '}
              <strong>{records.find(r => r.id === deleteId)?.employeeName}</strong>.
              This action cannot be undone.
            </div>
            <div className="sal-del-actions">
              <button className="sal-cancel-btn" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="sal-confirm-del-btn" onClick={() => handleDelete(deleteId)}>
                <i className="bi bi-trash me-1"></i>Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW DETAIL MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      {viewRec && (() => {
        const { gross, ded, net } = calcSalary(viewRec);
        return (
          <div className="sal-modal-backdrop" onClick={() => setViewRec(null)}>
            <div className="sal-view-modal" onClick={e => e.stopPropagation()}>
              <div className="sal-view-header">
                <h3>{viewRec.employeeName}</h3>
                <p>{viewRec.designation || 'Employee'} · {viewRec.department || 'N/A'} · {viewRec.employeeId || ''}</p>
              </div>
              <div className="sal-view-body">
                {/* Period & payment */}
                <div>
                  <div className="sal-view-section-title">Payroll Period</div>
                  <div className="sal-view-grid">
                    <div>
                      <div className="sal-view-item-lbl">Month</div>
                      <div className="sal-view-item-val">{viewRec.month}</div>
                    </div>
                    <div>
                      <div className="sal-view-item-lbl">Year</div>
                      <div className="sal-view-item-val">{viewRec.year}</div>
                    </div>
                    <div>
                      <div className="sal-view-item-lbl">Payment Mode</div>
                      <div className="sal-view-item-val">{viewRec.paymentMode}</div>
                    </div>
                    {viewRec.notes && (
                      <div style={{ gridColumn:'1/-1' }}>
                        <div className="sal-view-item-lbl">Notes</div>
                        <div className="sal-view-item-val">{viewRec.notes}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Amount breakdown */}
                <div>
                  <div className="sal-view-section-title">Salary Breakdown</div>
                  <div className="sal-view-amounts">
                    {[
                      ['Basic Salary',          viewRec.basicSalary, false],
                      ['HRA / Accommodation',   viewRec.hra,         false],
                      ['Transport Allowance',   viewRec.transport,   false],
                      ['Overtime (OT)',          viewRec.otAmount,    false],
                      ['Bonus',                 viewRec.bonus,       false],
                    ].filter(([,v])=>Number(v)>0).map(([l, v]) => (
                      <div key={l} className="sal-view-row">
                        <span style={{ color:'#57606a' }}>{l}</span>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:600 }}>{inr(v)}</span>
                      </div>
                    ))}
                    <div className="sal-view-row" style={{ fontWeight:600 }}>
                      <span>Gross Salary</span>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace" }}>{inr(gross)}</span>
                    </div>
                    <div className="sal-view-divider" />
                    {Number(viewRec.deductions)>0 && (
                      <div className="sal-view-row">
                        <span style={{ color:'#57606a' }}>Other Deductions</span>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", color:'#cf222e' }}>−{inr(viewRec.deductions)}</span>
                      </div>
                    )}
                    {Number(viewRec.taxDeduction)>0 && (
                      <div className="sal-view-row">
                        <span style={{ color:'#57606a' }}>Tax Deduction</span>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", color:'#cf222e' }}>−{inr(viewRec.taxDeduction)}</span>
                      </div>
                    )}
                    <div className="sal-view-row" style={{ color:'#cf222e', fontWeight:600 }}>
                      <span>Total Deductions</span>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace" }}>−{inr(ded)}</span>
                    </div>
                    <div className="sal-view-divider" />
                    <div className="sal-view-row sal-view-net">
                      <span>Net Salary</span>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", color:'#1a7f37' }}>{inr(net)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sal-view-footer">
                <button className="sal-close-btn" onClick={() => setViewRec(null)}>Close</button>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
<<<<<<< HEAD
}

// this is updated by rahul for tesing 
=======
}
>>>>>>> origin/testbranch
