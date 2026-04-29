import { useState } from 'react';

export default function Quotation() {
  const [form, setForm] = useState({
    quoteNo: '', quoteDate: '', validUntil: '', clientName: '', clientPhone: '', clientEmail: '',
    items: [{ description: '', qty: 1, rate: 0 }],
    taxPercent: 5, discount: 0, notes: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleItemChange = (i, field, value) => {
    const items = [...form.items]; items[i][field] = value; setForm({ ...form, items });
  };
  const addItem = () => setForm({ ...form, items: [...form.items, { description: '', qty: 1, rate: 0 }] });
  const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });

  const subtotal = form.items.reduce((s, it) => s + Number(it.qty) * Number(it.rate), 0);
  const discountAmt = (subtotal * Number(form.discount)) / 100;
  const taxAmt = ((subtotal - discountAmt) * Number(form.taxPercent)) / 100;
  const total = subtotal - discountAmt + taxAmt;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Quotation Data:', { ...form, subtotal, discountAmt, taxAmt, total });
    alert('Quotation submitted! Check console for data.');
  };

  return (
    <>
      <div className="page-header">
        <h1><i className="bi bi-file-earmark-spreadsheet-fill me-2" style={{ color: '#bc4c00' }}></i>Quotation</h1>
        <p>Create and send quotations to potential clients</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">

          <div className="col-12">
            <div className="client-form-card shadow-sm">
              <h6 style={{ fontWeight: 700, fontSize: 14, marginBottom: 18 }}>
                <i className="bi bi-file-earmark me-2" style={{ color: '#bc4c00' }}></i>Quotation Details
              </h6>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Quote Number <span style={{ color: 'red' }}>*</span></label>
                  <input className="form-control" name="quoteNo" value={form.quoteNo} onChange={handleChange} placeholder="QT-0001" required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Quote Date <span style={{ color: 'red' }}>*</span></label>
                  <input type="date" className="form-control" name="quoteDate" value={form.quoteDate} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Valid Until</label>
                  <input type="date" className="form-control" name="validUntil" value={form.validUntil} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Discount %</label>
                  <input type="number" className="form-control" name="discount" value={form.discount} onChange={handleChange} min="0" max="100" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Tax %</label>
                  <input type="number" className="form-control" name="taxPercent" value={form.taxPercent} onChange={handleChange} min="0" max="100" />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="client-form-card shadow-sm">
              <h6 style={{ fontWeight: 700, fontSize: 14, marginBottom: 18 }}>
                <i className="bi bi-person me-2" style={{ color: '#bc4c00' }}></i>Client Information
              </h6>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Client Name <span style={{ color: 'red' }}>*</span></label>
                  <input className="form-control" name="clientName" value={form.clientName} onChange={handleChange} placeholder="Client name" required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Phone</label>
                  <input className="form-control" name="clientPhone" value={form.clientPhone} onChange={handleChange} placeholder="+971 50 000 0000" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" name="clientEmail" value={form.clientEmail} onChange={handleChange} placeholder="client@email.com" />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="client-form-card shadow-sm">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h6 style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>
                  <i className="bi bi-list-ul me-2" style={{ color: '#bc4c00' }}></i>Quotation Items
                </h6>
                <button type="button" onClick={addItem} style={{ background: '#bc4c00', border: 'none', color: 'white', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  <i className="bi bi-plus-lg me-1"></i>Add Item
                </button>
              </div>
              <div className="table-responsive">
                <table className="table" style={{ fontSize: 13.5 }}>
                  <thead style={{ background: '#f6f8fa' }}>
                    <tr>
                      <th style={{ fontWeight: 600, color: '#57606a', border: 'none', padding: '10px 12px' }}>#</th>
                      <th style={{ fontWeight: 600, color: '#57606a', border: 'none' }}>Description</th>
                      <th style={{ fontWeight: 600, color: '#57606a', border: 'none', width: 100 }}>Qty</th>
                      <th style={{ fontWeight: 600, color: '#57606a', border: 'none', width: 130 }}>Rate (AED)</th>
                      <th style={{ fontWeight: 600, color: '#57606a', border: 'none', width: 130 }}>Amount</th>
                      <th style={{ border: 'none', width: 50 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.items.map((item, i) => (
                      <tr key={i}>
                        <td style={{ verticalAlign: 'middle', padding: '8px 12px', color: '#57606a' }}>{i + 1}</td>
                        <td><input className="form-control form-control-sm" value={item.description} onChange={e => handleItemChange(i, 'description', e.target.value)} placeholder="Service / Product" /></td>
                        <td><input type="number" className="form-control form-control-sm" value={item.qty} onChange={e => handleItemChange(i, 'qty', e.target.value)} min="1" /></td>
                        <td><input type="number" className="form-control form-control-sm" value={item.rate} onChange={e => handleItemChange(i, 'rate', e.target.value)} min="0" /></td>
                        <td style={{ verticalAlign: 'middle', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>AED {(Number(item.qty) * Number(item.rate)).toFixed(2)}</td>
                        <td style={{ verticalAlign: 'middle' }}>
                          {form.items.length > 1 && <button type="button" onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', color: '#cf222e', cursor: 'pointer', fontSize: 16 }}><i className="bi bi-trash3"></i></button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                <div style={{ minWidth: 300, background: '#f6f8fa', borderRadius: 10, padding: 16 }}>
                  {[['Subtotal', `AED ${subtotal.toFixed(2)}`, ''], [`Discount (${form.discount}%)`, `- AED ${discountAmt.toFixed(2)}`, '#cf222e'], [`Tax (${form.taxPercent}%)`, `AED ${taxAmt.toFixed(2)}`, '']].map(([l, v, c], i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 6 }}>
                      <span style={{ color: '#57606a' }}>{l}</span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: c || '#24292f' }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ height: 1, background: '#d0d7de', margin: '8px 0' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
                    <span style={{ fontWeight: 700 }}>Grand Total</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#bc4c00' }}>AED {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="client-form-card shadow-sm">
              <label className="form-label" style={{ fontWeight: 600, fontSize: 13 }}>Terms & Notes</label>
              <textarea className="form-control" name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Terms and conditions, notes..." />
            </div>
          </div>

          <div className="col-12">
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" style={{ background: '#bc4c00', border: 'none', color: 'white', padding: '10px 24px', borderRadius: 8, fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                <i className="bi bi-send-fill me-2"></i>Submit Quotation
              </button>
              <button type="button" className="btn-reset" onClick={() => setForm({ quoteNo: '', quoteDate: '', validUntil: '', clientName: '', clientPhone: '', clientEmail: '', items: [{ description: '', qty: 1, rate: 0 }], taxPercent: 5, discount: 0, notes: '' })}>
                <i className="bi bi-arrow-counterclockwise me-2"></i>Reset
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
