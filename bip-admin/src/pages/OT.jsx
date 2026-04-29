import { useState } from 'react';

export default function OT() {
  const [form, setForm] = useState({
    employeeName: '', employeeId: '', date: '', department: '',
    regularHours: 8, otHours: '', otRate: 1.5, basicHourlyRate: '',
    reason: '', approvedBy: '', notes: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const otPay = (Number(form.otHours) || 0) * (Number(form.basicHourlyRate) || 0) * (Number(form.otRate) || 1.5);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('OT Data:', { ...form, otPay });
    alert('OT record saved! Check console for data.');
  };

  return (
    <>
      <div className="page-header">
        <h1><i className="bi bi-clock-history me-2" style={{ color: '#bc4c00' }}></i>Overtime (OT)</h1>
        <p>Record and calculate employee overtime hours</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-12">
            <div className="client-form-card shadow-sm">
              <h6 style={{ fontWeight: 700, fontSize: 14, marginBottom: 18 }}>
                <i className="bi bi-person-clock me-2" style={{ color: '#bc4c00' }}></i>OT Entry
              </h6>
              <div className="row g-3">
                <div className="col-md-5">
                  <label className="form-label">Employee Name <span style={{ color: 'red' }}>*</span></label>
                  <input className="form-control" name="employeeName" value={form.employeeName} onChange={handleChange} placeholder="Full name" required />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Employee ID</label>
                  <input className="form-control" name="employeeId" value={form.employeeId} onChange={handleChange} placeholder="EMP-001" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Date <span style={{ color: 'red' }}>*</span></label>
                  <input type="date" className="form-control" name="date" value={form.date} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Department</label>
                  <input className="form-control" name="department" value={form.department} onChange={handleChange} placeholder="Operations" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Regular Hours/Day</label>
                  <input type="number" className="form-control" name="regularHours" value={form.regularHours} onChange={handleChange} min="1" max="24" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">OT Hours <span style={{ color: 'red' }}>*</span></label>
                  <input type="number" className="form-control" name="otHours" value={form.otHours} onChange={handleChange} placeholder="2.5" min="0" step="0.5" required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Basic Hourly Rate (AED)</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ fontSize: 12, background: '#f6f8fa' }}>AED</span>
                    <input type="number" className="form-control" name="basicHourlyRate" value={form.basicHourlyRate} onChange={handleChange} placeholder="0.00" min="0" />
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="form-label">OT Multiplier</label>
                  <select className="form-select" name="otRate" value={form.otRate} onChange={handleChange}>
                    <option value="1.25">1.25x (Normal OT)</option>
                    <option value="1.5">1.5x (Standard OT)</option>
                    <option value="2.0">2.0x (Holiday OT)</option>
                    <option value="2.5">2.5x (Special OT)</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">OT Pay</label>
                  <div className="form-control" style={{ background: otPay > 0 ? '#fff1e5' : '#f6f8fa', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#bc4c00', fontSize: 15 }}>
                    AED {otPay.toFixed(2)}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Reason for OT <span style={{ color: 'red' }}>*</span></label>
                  <input className="form-control" name="reason" value={form.reason} onChange={handleChange} placeholder="Project deadline, urgent work..." required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Approved By</label>
                  <input className="form-control" name="approvedBy" value={form.approvedBy} onChange={handleChange} placeholder="Manager name" />
                </div>
                <div className="col-12">
                  <label className="form-label">Notes</label>
                  <textarea className="form-control" name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Additional details..." />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" style={{ background: '#bc4c00', border: 'none', color: 'white', padding: '10px 24px', borderRadius: 8, fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                <i className="bi bi-check-lg me-2"></i>Save OT Record
              </button>
              <button type="button" className="btn-reset" onClick={() => setForm({ employeeName: '', employeeId: '', date: '', department: '', regularHours: 8, otHours: '', otRate: 1.5, basicHourlyRate: '', reason: '', approvedBy: '', notes: '' })}>
                <i className="bi bi-arrow-counterclockwise me-2"></i>Reset
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
