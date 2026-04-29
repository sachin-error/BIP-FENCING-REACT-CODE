import { useState } from 'react';

export default function PurchaseBill() {
  const [form, setForm] = useState({
    billNo: '', billDate: '', supplierName: '', supplierPhone: '', supplierAddress: '',
    items: [{ description: '', qty: 1, rate: 0 }],
    discount: 0, notes: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleItemChange = (i, field, value) => {
    const items = [...form.items];
    items[i][field] = value;
    setForm({ ...form, items });
  };
  const addItem = () => setForm({ ...form, items: [...form.items, { description: '', qty: 1, rate: 0 }] });
  const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });

  const subtotal = form.items.reduce((s, it) => s + Number(it.qty) * Number(it.rate), 0);
  const discountAmt = (subtotal * Number(form.discount)) / 100;
  const total = subtotal - discountAmt;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Purchase Bill Data:', { ...form, subtotal, discountAmt, total });
    alert('Purchase Bill submitted! Check console for data.');
  };

  return (
    <>
      <div className="page-header">
        <h1><i className="bi bi-bag-check-fill me-2" style={{ color: '#1a7f37' }}></i>Purchase Bill</h1>
        <p>Record and manage purchase bills from suppliers</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">

          <div className="col-12">
            <div className="client-form-card shadow-sm">
              <h6 style={{ fontWeight: 700, fontSize: 14, marginBottom: 18 }}>
                <i className="bi bi-receipt me-2" style={{ color: '#1a7f37' }}></i>Bill Details
              </h6>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Bill Number <span style={{ color: 'red' }}>*</span></label>
                  <input className="form-control" name="billNo" value={form.billNo} onChange={handleChange} placeholder="BILL-0001" required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Bill Date <span style={{ color: 'red' }}>*</span></label>
                  <input type="date" className="form-control" name="billDate" value={form.billDate} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Discount %</label>
                  <input type="number" className="form-control" name="discount" value={form.discount} onChange={handleChange} min="0" max="100" />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="client-form-card shadow-sm">
              <h6 style={{ fontWeight: 700, fontSize: 14, marginBottom: 18 }}>
                <i className="bi bi-truck me-2" style={{ color: '#1a7f37' }}></i>Supplier Information
              </h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Supplier Name <span style={{ color: 'red' }}>*</span></label>
                  <input className="form-control" name="supplierName" value={form.supplierName} onChange={handleChange} placeholder="Supplier company name" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input className="form-control" name="supplierPhone" value={form.supplierPhone} onChange={handleChange} placeholder="+971 50 000 0000" />
                </div>
                <div className="col-12">
                  <label className="form-label">Address</label>
                  <textarea className="form-control" name="supplierAddress" value={form.supplierAddress} onChange={handleChange} rows={2} placeholder="Supplier address..." />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="client-form-card shadow-sm">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h6 style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>
                  <i className="bi bi-list-ul me-2" style={{ color: '#1a7f37' }}></i>Purchased Items
                </h6>
                <button type="button" onClick={addItem} style={{ background: '#1a7f37', border: 'none', color: 'white', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  <i className="bi bi-plus-lg me-1"></i>Add Item
                </button>
              </div>
              <div className="table-responsive">
                <table className="table" style={{ fontSize: 13.5 }}>
                  <thead style={{ background: '#f6f8fa' }}>
                    <tr>
                      <th style={{ fontWeight: 600, color: '#57606a', border: 'none', padding: '10px 12px' }}>#</th>
                      <th style={{ fontWeight: 600, color: '#57606a', border: 'none' }}>Item Description</th>
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
                        <td><input className="form-control form-control-sm" value={item.description} onChange={e => handleItemChange(i, 'description', e.target.value)} placeholder="Item name" /></td>
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
                <div style={{ minWidth: 280, background: '#f6f8fa', borderRadius: 10, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 6 }}><span style={{ color: '#57606a' }}>Subtotal</span><span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>AED {subtotal.toFixed(2)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 8 }}><span style={{ color: '#57606a' }}>Discount ({form.discount}%)</span><span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#cf222e' }}>- AED {discountAmt.toFixed(2)}</span></div>
                  <div style={{ height: 1, background: '#d0d7de', marginBottom: 8 }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}><span style={{ fontWeight: 700 }}>Total</span><span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#1a7f37' }}>AED {total.toFixed(2)}</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="client-form-card shadow-sm">
              <label className="form-label" style={{ fontWeight: 600, fontSize: 13 }}>Notes</label>
              <textarea className="form-control" name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Additional notes..." />
            </div>
          </div>

          <div className="col-12">
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" style={{ background: '#1a7f37', border: 'none', color: 'white', padding: '10px 24px', borderRadius: 8, fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                <i className="bi bi-check-lg me-2"></i>Submit Bill
              </button>
              <button type="button" className="btn-reset" onClick={() => setForm({ billNo: '', billDate: '', supplierName: '', supplierPhone: '', supplierAddress: '', items: [{ description: '', qty: 1, rate: 0 }], discount: 0, notes: '' })}>
                <i className="bi bi-arrow-counterclockwise me-2"></i>Reset
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
