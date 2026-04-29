import { useState } from 'react';

const statusOptions = ['Present', 'Absent', 'Half Day', 'Leave', 'Holiday'];
const statusColors = { Present: '#1a7f37', Absent: '#cf222e', 'Half Day': '#bc4c00', Leave: '#0969da', Holiday: '#8250df' };
const statusBg = { Present: '#dafbe1', Absent: '#fff1f0', 'Half Day': '#fff1e5', Leave: '#ddf4ff', Holiday: '#fbefff' };

export default function Attendance() {
  const [form, setForm] = useState({
    employeeName: '', employeeId: '', date: '', status: 'Present',
    checkIn: '', checkOut: '', notes: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const calcHours = () => {
    if (!form.checkIn || !form.checkOut) return '—';
    const [h1, m1] = form.checkIn.split(':').map(Number);
    const [h2, m2] = form.checkOut.split(':').map(Number);
    const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (diff <= 0) return '—';
    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Attendance Data:', { ...form, hoursWorked: calcHours() });
    alert('Attendance recorded! Check console for data.');
  };

  return (
    <>
      <div className="page-header">
        <h1><i className="bi bi-calendar-check-fill me-2" style={{ color: '#cf222e' }}></i>Attendance</h1>
        <p>Record and track employee attendance</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-12">
            <div className="client-form-card shadow-sm">
              <h6 style={{ fontWeight: 700, fontSize: 14, marginBottom: 18 }}>
                <i className="bi bi-person-check me-2" style={{ color: '#cf222e' }}></i>Attendance Entry
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

                {/* Status Buttons */}
                <div className="col-12">
                  <label className="form-label">Status <span style={{ color: 'red' }}>*</span></label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {statusOptions.map(s => (
                      <button
                        key={s} type="button"
                        onClick={() => setForm({ ...form, status: s })}
                        style={{
                          padding: '7px 18px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                          border: `2px solid ${form.status === s ? statusColors[s] : '#d0d7de'}`,
                          background: form.status === s ? statusBg[s] : 'white',
                          color: form.status === s ? statusColors[s] : '#57606a',
                          fontFamily: 'Sora, sans-serif',
                          transition: 'all 0.15s',
                        }}
                      >{s}</button>
                    ))}
                  </div>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Check-In Time</label>
                  <input type="time" className="form-control" name="checkIn" value={form.checkIn} onChange={handleChange} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Check-Out Time</label>
                  <input type="time" className="form-control" name="checkOut" value={form.checkOut} onChange={handleChange} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Hours Worked</label>
                  <div className="form-control" style={{ background: '#f6f8fa', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#0969da' }}>
                    {calcHours()}
                  </div>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Status Badge</label>
                  <div className="form-control" style={{ background: statusBg[form.status], color: statusColors[form.status], fontWeight: 700, fontSize: 13, border: `1.5px solid ${statusColors[form.status]}40` }}>
                    {form.status}
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label">Notes</label>
                  <input className="form-control" name="notes" value={form.notes} onChange={handleChange} placeholder="Reason for absence / leave type / remarks..." />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" style={{ background: '#cf222e', border: 'none', color: 'white', padding: '10px 24px', borderRadius: 8, fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                <i className="bi bi-check-lg me-2"></i>Save Attendance
              </button>
              <button type="button" className="btn-reset" onClick={() => setForm({ employeeName: '', employeeId: '', date: '', status: 'Present', checkIn: '', checkOut: '', notes: '' })}>
                <i className="bi bi-arrow-counterclockwise me-2"></i>Reset
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
