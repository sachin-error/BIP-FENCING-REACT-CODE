import { useState } from 'react';

const initialForm = { name: '', phone: '', email: '', address: '', gst: '' };

export default function Clients() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Client Form Data:', form);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleReset = () => setForm(initialForm);

  return (
    <>
      <div className="page-header">
        <h1>Clients</h1>
        <p>Add and manage your client information</p>
      </div>

      <div className="client-form-card shadow-sm">
        <h6 style={{ fontWeight: 700, fontSize: 14, color: '#0d1117', marginBottom: 20 }}>
          <i className="bi bi-person-plus-fill me-2" style={{ color: '#0969da' }}></i>
          Add New Client
        </h6>

        {submitted && (
          <div className="alert alert-success py-2 mb-3" style={{ fontSize: 13, borderRadius: 8 }}>
            <i className="bi bi-check-circle-fill me-2"></i>
            Client data logged to console successfully!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Full Name <span style={{ color: '#cf222e' }}>*</span></label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone Number <span style={{ color: '#cf222e' }}>*</span></label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+971 50 000 0000"
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">GST Number</label>
              <input
                type="text"
                className="form-control"
                name="gst"
                value={form.gst}
                onChange={handleChange}
                placeholder="GST/VAT Number"
              />
            </div>
            <div className="col-12">
              <label className="form-label">Address</label>
              <textarea
                className="form-control"
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                placeholder="Full address..."
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
            <button type="submit" className="btn-submit">
              <i className="bi bi-check-lg me-2"></i>Submit
            </button>
            <button type="button" className="btn-reset" onClick={handleReset}>
              <i className="bi bi-arrow-counterclockwise me-2"></i>Reset
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
