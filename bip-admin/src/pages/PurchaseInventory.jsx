import { useState } from 'react';

const units = ['Pcs', 'Kg', 'Meter', 'Roll', 'Box', 'Set', 'Liter', 'Ton'];

export default function PurchaseInventory() {
  const [form, setForm] = useState({
    poNo: '', poDate: '', supplier: '', warehouse: '',
    items: [{ itemName: '', sku: '', qty: 1, unit: 'Pcs', costPrice: 0 }],
    notes: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleItemChange = (i, field, value) => {
    const items = [...form.items]; items[i][field] = value; setForm({ ...form, items });
  };
  const addItem = () => setForm({ ...form, items: [...form.items, { itemName: '', sku: '', qty: 1, unit: 'Pcs', costPrice: 0 }] });
  const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });

  const totalCost = form.items.reduce((s, it) => s + Number(it.qty) * Number(it.costPrice), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Purchase Inventory Data:', { ...form, totalCost });
    alert('Purchase Inventory submitted! Check console for data.');
  };

  return (
    <>
      <div className="page-header">
        <h1><i className="bi bi-cart-plus-fill me-2" style={{ color: '#8250df' }}></i>Purchase Inventory</h1>
        <p>Record incoming stock and inventory purchases</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">

          <div className="col-12">
            <div className="client-form-card shadow-sm">
              <h6 style={{ fontWeight: 700, fontSize: 14, marginBottom: 18 }}>
                <i className="bi bi-clipboard-data me-2" style={{ color: '#8250df' }}></i>Purchase Order Info
              </h6>
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">PO Number <span style={{ color: 'red' }}>*</span></label>
                  <input className="form-control" name="poNo" value={form.poNo} onChange={handleChange} placeholder="PO-0001" required />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Date <span style={{ color: 'red' }}>*</span></label>
                  <input type="date" className="form-control" name="poDate" value={form.poDate} onChange={handleChange} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Supplier</label>
                  <input className="form-control" name="supplier" value={form.supplier} onChange={handleChange} placeholder="Supplier name" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Warehouse / Location</label>
                  <input className="form-control" name="warehouse" value={form.warehouse} onChange={handleChange} placeholder="Main Warehouse" />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="client-form-card shadow-sm">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h6 style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>
                  <i className="bi bi-boxes me-2" style={{ color: '#8250df' }}></i>Stock Items
                </h6>
                <button type="button" onClick={addItem} style={{ background: '#8250df', border: 'none', color: 'white', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  <i className="bi bi-plus-lg me-1"></i>Add Item
                </button>
              </div>
              <div className="table-responsive">
                <table className="table" style={{ fontSize: 13.5 }}>
                  <thead style={{ background: '#f6f8fa' }}>
                    <tr>
                      <th style={{ fontWeight: 600, color: '#57606a', border: 'none', padding: '10px 12px' }}>#</th>
                      <th style={{ fontWeight: 600, color: '#57606a', border: 'none' }}>Item Name</th>
                      <th style={{ fontWeight: 600, color: '#57606a', border: 'none', width: 120 }}>SKU</th>
                      <th style={{ fontWeight: 600, color: '#57606a', border: 'none', width: 80 }}>Qty</th>
                      <th style={{ fontWeight: 600, color: '#57606a', border: 'none', width: 100 }}>Unit</th>
                      <th style={{ fontWeight: 600, color: '#57606a', border: 'none', width: 130 }}>Cost Price</th>
                      <th style={{ fontWeight: 600, color: '#57606a', border: 'none', width: 130 }}>Total</th>
                      <th style={{ border: 'none', width: 50 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.items.map((item, i) => (
                      <tr key={i}>
                        <td style={{ verticalAlign: 'middle', padding: '8px 12px', color: '#57606a' }}>{i + 1}</td>
                        <td><input className="form-control form-control-sm" value={item.itemName} onChange={e => handleItemChange(i, 'itemName', e.target.value)} placeholder="Item name" /></td>
                        <td><input className="form-control form-control-sm" value={item.sku} onChange={e => handleItemChange(i, 'sku', e.target.value)} placeholder="SKU-001" /></td>
                        <td><input type="number" className="form-control form-control-sm" value={item.qty} onChange={e => handleItemChange(i, 'qty', e.target.value)} min="1" /></td>
                        <td>
                          <select className="form-select form-select-sm" value={item.unit} onChange={e => handleItemChange(i, 'unit', e.target.value)}>
                            {units.map(u => <option key={u}>{u}</option>)}
                          </select>
                        </td>
                        <td><input type="number" className="form-control form-control-sm" value={item.costPrice} onChange={e => handleItemChange(i, 'costPrice', e.target.value)} min="0" /></td>
                        <td style={{ verticalAlign: 'middle', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>AED {(Number(item.qty) * Number(item.costPrice)).toFixed(2)}</td>
                        <td style={{ verticalAlign: 'middle' }}>
                          {form.items.length > 1 && <button type="button" onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', color: '#cf222e', cursor: 'pointer', fontSize: 16 }}><i className="bi bi-trash3"></i></button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                <div style={{ background: '#fbefff', border: '1px solid #d8b4fe', borderRadius: 10, padding: '12px 20px', minWidth: 220 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
                    <span style={{ fontWeight: 700 }}>Total Cost</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#8250df' }}>AED {totalCost.toFixed(2)}</span>
                  </div>
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
              <button type="submit" style={{ background: '#8250df', border: 'none', color: 'white', padding: '10px 24px', borderRadius: 8, fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                <i className="bi bi-check-lg me-2"></i>Submit Purchase Order
              </button>
              <button type="button" className="btn-reset" onClick={() => setForm({ poNo: '', poDate: '', supplier: '', warehouse: '', items: [{ itemName: '', sku: '', qty: 1, unit: 'Pcs', costPrice: 0 }], notes: '' })}>
                <i className="bi bi-arrow-counterclockwise me-2"></i>Reset
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
