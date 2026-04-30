import { useState } from 'react';

export default function Salary() {
  const [form, setForm] = useState({
    employeeName: '', employeeId: '', designation: '', department: '',
    month: '', year: new Date().getFullYear(),
    basicSalary: '', hra: '', transport: '', otAmount: '', bonus: '',
    deductions: '', taxDeduction: '',
    paymentMode: 'Bank Transfer', notes: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const grossSalary = [form.basicSalary, form.hra, form.transport, form.otAmount, form.bonus]
    .reduce((s, v) => s + (Number(v) || 0), 0);
  const totalDeductions = (Number(form.deductions) || 0) + (Number(form.taxDeduction) || 0);
  const netSalary = grossSalary - totalDeductions;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Salary Data:', { ...form, grossSalary, totalDeductions, netSalary });
    alert('Salary record saved! Check console for data.');
  };

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  return (
    <>
      <div className="page-header">
        <h1><i className="bi bi-cash-stack me-2" style={{ color: '#1a7f37' }}></i>Salary</h1>
        <p>Manage employee salary records and payroll</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">

          <div className="col-12">
            <div className="client-form-card shadow-sm">
              <h6 style={{ fontWeight: 700, fontSize: 14, marginBottom: 18 }}>
                <i className="bi bi-person-badge me-2" style={{ color: '#1a7f37' }}></i>Employee Details
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
                    {months.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Year</label>
                  <input type="number" className="form-control" name="year" value={form.year} onChange={handleChange} min="2020" max="2099" />
                </div>
              </div>
            </div>
          </div>

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

              {/* Summary */}
              <div style={{ marginTop: 24, background: '#f6f8fa', borderRadius: 10, padding: 16 }}>
                {[['Gross Salary', grossSalary, '#24292f'], ['Total Deductions', totalDeductions, '#cf222e']].map(([l, v, c]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 6 }}>
                    <span style={{ color: '#57606a' }}>{l}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: c }}>INR {v.toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ height: 1, background: '#d0d7de', margin: '8px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
                  <span style={{ fontWeight: 700 }}>Net Salary</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#1a7f37' }}>INR {netSalary.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="client-form-card shadow-sm">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Payment Mode</label>
                  <select className="form-select" name="paymentMode" value={form.paymentMode} onChange={handleChange}>
                    {['Bank Transfer', 'Cash', 'Cheque', 'Online'].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="col-md-8">
                  <label className="form-label">Notes</label>
                  <input className="form-control" name="notes" value={form.notes} onChange={handleChange} placeholder="Additional notes..." />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" style={{ background: '#1a7f37', border: 'none', color: 'white', padding: '10px 24px', borderRadius: 8, fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                <i className="bi bi-check-lg me-2"></i>Save Salary Record
              </button>
              <button type="button" className="btn-reset" onClick={() => setForm({ employeeName: '', employeeId: '', designation: '', department: '', month: '', year: new Date().getFullYear(), basicSalary: '', hra: '', transport: '', otAmount: '', bonus: '', deductions: '', taxDeduction: '', paymentMode: 'Bank Transfer', notes: '' })}>
                <i className="bi bi-arrow-counterclockwise me-2"></i>Reset
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
