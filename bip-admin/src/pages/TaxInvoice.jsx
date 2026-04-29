import { useState } from 'react';

export default function TaxInvoice() {
  const [form, setForm] = useState({
    invoiceNo: '',
    invoiceDate: '',
    clientName: '',
    clientPhone: '',
    clientAddress: '',
    items: [{ description: '', qty: 1, rate: 0 }],
    taxPercent: 5,
    notes: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleItemChange = (i, field, value) => {
    const items = [...form.items];
    items[i][field] = value;
    setForm({ ...form, items });
  };

  const addItem = () => setForm({ ...form, items: [...form.items, { description: '', qty: 1, rate: 0 }] });
  const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });

  const subtotal = form.items.reduce((sum, item) => sum + (Number(item.qty) * Number(item.rate)), 0);
  const tax = (subtotal * Number(form.taxPercent)) / 100;
  const total = subtotal + tax;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Tax Invoice Data:', { ...form, subtotal, tax, total });
    alert('Invoice submitted! Check console for data.');
  };

  return (
    <>
      <div className="page-header">
        <h1><i className="bi bi-file-earmark-text-fill me-2" style={{ color: '#0969da' }}></i>Tax Invoice</h1>
        <p>Create and manage tax invoices for your clients</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">

          {/* Invoice Info */}
          <div className="col-12">
            <div className="client-form-card shadow-sm">
              <h6 style={{ fontWeight: 700, fontSize: 14, marginBottom: 18, color: '#0d1117' }}>
                <i className="bi bi-info-circle-fill me-2" style={{ color: '#0969da' }}></i>Invoice Details
              </h6>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Invoice Number <span style={{ color: 'red' }}>*</span></label>
                  <input className="form-control" name="invoiceNo" value={form.invoiceNo} onChange={handleChange} placeholder="INV-0001" required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Invoice Date <span style={{ color: 'red' }}>*</span></label>
                  <input type="date" className="form-control" name="invoiceDate" value={form.invoiceDate} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Tax % (VAT/GST)</label>
                  <input type="number" className="form-control" name="taxPercent" value={form.taxPercent} onChange={handleChange} min="0" max="100" />
                </div>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="col-12">
            <div className="client-form-card shadow-sm">
              <h6 style={{ fontWeight: 700, fontSize: 14, marginBottom: 18, color: '#0d1117' }}>
                <i className="bi bi-person-fill me-2" style={{ color: '#0969da' }}></i>Client Information
              </h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Client Name <span style={{ color: 'red' }}>*</span></label>
                  <input className="form-control" name="clientName" value={form.clientName} onChange={handleChange} placeholder="Client full name" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input className="form-control" name="clientPhone" value={form.clientPhone} onChange={handleChange} placeholder="+971 50 000 0000" />
                </div>
                <div className="col-12">
                  <label className="form-label">Address</label>
                  <textarea className="form-control" name="clientAddress" value={form.clientAddress} onChange={handleChange} rows={2} placeholder="Client address..." />
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="col-12">
            <div className="client-form-card shadow-sm">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h6 style={{ fontWeight: 700, fontSize: 14, margin: 0, color: '#0d1117' }}>
                  <i className="bi bi-list-ul me-2" style={{ color: '#0969da' }}></i>Line Items
                </h6>
                <button type="button" className="btn-submit" style={{ padding: '6px 14px', fontSize: 12 }} onClick={addItem}>
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
                        <td style={{ color: '#57606a', verticalAlign: 'middle', padding: '8px 12px' }}>{i + 1}</td>
                        <td>
                          <input className="form-control form-control-sm" value={item.description} onChange={e => handleItemChange(i, 'description', e.target.value)} placeholder="Item description" />
                        </td>
                        <td>
                          <input type="number" className="form-control form-control-sm" value={item.qty} onChange={e => handleItemChange(i, 'qty', e.target.value)} min="1" />
                        </td>
                        <td>
                          <input type="number" className="form-control form-control-sm" value={item.rate} onChange={e => handleItemChange(i, 'rate', e.target.value)} min="0" />
                        </td>
                        <td style={{ verticalAlign: 'middle', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>
                          AED {(Number(item.qty) * Number(item.rate)).toFixed(2)}
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                          {form.items.length > 1 && (
                            <button type="button" onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', color: '#cf222e', cursor: 'pointer', fontSize: 16 }}>
                              <i className="bi bi-trash3"></i>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                <div style={{ minWidth: 280, background: '#f6f8fa', borderRadius: 10, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 6 }}>
                    <span style={{ color: '#57606a' }}>Subtotal</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>AED {subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 8 }}>
                    <span style={{ color: '#57606a' }}>Tax ({form.taxPercent}%)</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>AED {tax.toFixed(2)}</span>
                  </div>
                  <div style={{ height: 1, background: '#d0d7de', marginBottom: 8 }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
                    <span style={{ fontWeight: 700 }}>Total</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#0969da' }}>AED {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="col-12">
            <div className="client-form-card shadow-sm">
              <label className="form-label" style={{ fontWeight: 600, fontSize: 13 }}>Notes / Terms</label>
              <textarea className="form-control" name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Payment terms, notes..." />
            </div>
          </div>

          <div className="col-12">
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn-submit"><i className="bi bi-check-lg me-2"></i>Submit Invoice</button>
              <button type="button" className="btn-reset" onClick={() => setForm({ invoiceNo: '', invoiceDate: '', clientName: '', clientPhone: '', clientAddress: '', items: [{ description: '', qty: 1, rate: 0 }], taxPercent: 5, notes: '' })}>
                <i className="bi bi-arrow-counterclockwise me-2"></i>Reset
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
