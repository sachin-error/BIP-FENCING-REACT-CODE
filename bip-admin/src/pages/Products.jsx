import { useState } from 'react';

const categories = ['Fencing', 'Gate', 'Hardware', 'Pipe', 'Wire', 'Panel', 'Post', 'Other'];

export default function Products() {
  const [form, setForm] = useState({
    productName: '', sku: '', category: 'Fencing', unit: 'Pcs',
    costPrice: '', sellingPrice: '', stockQty: '', minStock: '', description: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const margin = form.costPrice && form.sellingPrice
    ? (((Number(form.sellingPrice) - Number(form.costPrice)) / Number(form.costPrice)) * 100).toFixed(1)
    : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Product Data:', { ...form, margin: `${margin}%` });
    alert('Product saved! Check console for data.');
  };

  return (
    <>
      <div className="page-header">
        <h1><i className="bi bi-box-seam-fill me-2" style={{ color: '#0969da' }}></i>Products</h1>
        <p>Add and manage your product catalog</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">

          <div className="col-12">
            <div className="client-form-card shadow-sm">
              <h6 style={{ fontWeight: 700, fontSize: 14, marginBottom: 18 }}>
                <i className="bi bi-info-circle me-2" style={{ color: '#0969da' }}></i>Product Information
              </h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Product Name <span style={{ color: 'red' }}>*</span></label>
                  <input className="form-control" name="productName" value={form.productName} onChange={handleChange} placeholder="Product name" required />
                </div>
                <div className="col-md-3">
                  <label className="form-label">SKU / Code</label>
                  <input className="form-control" name="sku" value={form.sku} onChange={handleChange} placeholder="PRD-001" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Category</label>
                  <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Unit</label>
                  <select className="form-select" name="unit" value={form.unit} onChange={handleChange}>
                    {['Pcs', 'Kg', 'Meter', 'Roll', 'Box', 'Set', 'Liter'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Cost Price (AED)</label>
                  <input type="number" className="form-control" name="costPrice" value={form.costPrice} onChange={handleChange} placeholder="0.00" min="0" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Selling Price (AED)</label>
                  <input type="number" className="form-control" name="sellingPrice" value={form.sellingPrice} onChange={handleChange} placeholder="0.00" min="0" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Profit Margin</label>
                  <div className="form-control" style={{ background: margin > 0 ? '#dafbe1' : '#f6f8fa', color: margin > 0 ? '#1a7f37' : '#57606a', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
                    {margin}%
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Current Stock Qty</label>
                  <input type="number" className="form-control" name="stockQty" value={form.stockQty} onChange={handleChange} placeholder="0" min="0" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Minimum Stock Alert</label>
                  <input type="number" className="form-control" name="minStock" value={form.minStock} onChange={handleChange} placeholder="10" min="0" />
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Product description, specifications..." />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn-submit"><i className="bi bi-plus-lg me-2"></i>Save Product</button>
              <button type="button" className="btn-reset" onClick={() => setForm({ productName: '', sku: '', category: 'Fencing', unit: 'Pcs', costPrice: '', sellingPrice: '', stockQty: '', minStock: '', description: '' })}>
                <i className="bi bi-arrow-counterclockwise me-2"></i>Reset
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
