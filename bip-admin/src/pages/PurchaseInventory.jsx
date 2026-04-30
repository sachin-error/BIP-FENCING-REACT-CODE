// import { useState } from 'react';

// const units = ['Pcs', 'Kg', 'Meter', 'Roll', 'Box', 'Set', 'Liter', 'Ton'];

// export default function PurchaseInventory() {
//   const [form, setForm] = useState({
//     poNo: '', poDate: '', supplier: '', warehouse: '',
//     items: [{ itemName: '', sku: '', qty: 1, unit: 'Pcs', costPrice: 0 }],
//     notes: '',
//   });

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
//   const handleItemChange = (i, field, value) => {
//     const items = [...form.items]; items[i][field] = value; setForm({ ...form, items });
//   };
//   const addItem = () => setForm({ ...form, items: [...form.items, { itemName: '', sku: '', qty: 1, unit: 'Pcs', costPrice: 0 }] });
//   const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });

//   const totalCost = form.items.reduce((s, it) => s + Number(it.qty) * Number(it.costPrice), 0);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Purchase Inventory Data:', { ...form, totalCost });
//     alert('Purchase Inventory submitted! Check console for data.');
//   };

//   return (
//     <>
//       <div className="page-header">
//         <h1><i className="bi bi-cart-plus-fill me-2" style={{ color: '#8250df' }}></i>Purchase Inventory</h1>
//         <p>Record incoming stock and inventory purchases</p>
//       </div>

//       <form onSubmit={handleSubmit}>
//         <div className="row g-3">

//           <div className="col-12">
//             <div className="client-form-card shadow-sm">
//               <h6 style={{ fontWeight: 700, fontSize: 14, marginBottom: 18 }}>
//                 <i className="bi bi-clipboard-data me-2" style={{ color: '#8250df' }}></i>Purchase Order Info
//               </h6>
//               <div className="row g-3">
//                 <div className="col-md-3">
//                   <label className="form-label">PO Number <span style={{ color: 'red' }}>*</span></label>
//                   <input className="form-control" name="poNo" value={form.poNo} onChange={handleChange} placeholder="PO-0001" required />
//                 </div>
//                 <div className="col-md-3">
//                   <label className="form-label">Date <span style={{ color: 'red' }}>*</span></label>
//                   <input type="date" className="form-control" name="poDate" value={form.poDate} onChange={handleChange} required />
//                 </div>
//                 <div className="col-md-3">
//                   <label className="form-label">Supplier</label>
//                   <input className="form-control" name="supplier" value={form.supplier} onChange={handleChange} placeholder="Supplier name" />
//                 </div>
//                 <div className="col-md-3">
//                   <label className="form-label">Warehouse / Location</label>
//                   <input className="form-control" name="warehouse" value={form.warehouse} onChange={handleChange} placeholder="Main Warehouse" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="col-12">
//             <div className="client-form-card shadow-sm">
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
//                 <h6 style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>
//                   <i className="bi bi-boxes me-2" style={{ color: '#8250df' }}></i>Stock Items
//                 </h6>
//                 <button type="button" onClick={addItem} style={{ background: '#8250df', border: 'none', color: 'white', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
//                   <i className="bi bi-plus-lg me-1"></i>Add Item
//                 </button>
//               </div>
//               <div className="table-responsive">
//                 <table className="table" style={{ fontSize: 13.5 }}>
//                   <thead style={{ background: '#f6f8fa' }}>
//                     <tr>
//                       <th style={{ fontWeight: 600, color: '#57606a', border: 'none', padding: '10px 12px' }}>#</th>
//                       <th style={{ fontWeight: 600, color: '#57606a', border: 'none' }}>Item Name</th>
//                       <th style={{ fontWeight: 600, color: '#57606a', border: 'none', width: 120 }}>SKU</th>
//                       <th style={{ fontWeight: 600, color: '#57606a', border: 'none', width: 80 }}>Qty</th>
//                       <th style={{ fontWeight: 600, color: '#57606a', border: 'none', width: 100 }}>Unit</th>
//                       <th style={{ fontWeight: 600, color: '#57606a', border: 'none', width: 130 }}>Cost Price</th>
//                       <th style={{ fontWeight: 600, color: '#57606a', border: 'none', width: 130 }}>Total</th>
//                       <th style={{ border: 'none', width: 50 }}></th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {form.items.map((item, i) => (
//                       <tr key={i}>
//                         <td style={{ verticalAlign: 'middle', padding: '8px 12px', color: '#57606a' }}>{i + 1}</td>
//                         <td><input className="form-control form-control-sm" value={item.itemName} onChange={e => handleItemChange(i, 'itemName', e.target.value)} placeholder="Item name" /></td>
//                         <td><input className="form-control form-control-sm" value={item.sku} onChange={e => handleItemChange(i, 'sku', e.target.value)} placeholder="SKU-001" /></td>
//                         <td><input type="number" className="form-control form-control-sm" value={item.qty} onChange={e => handleItemChange(i, 'qty', e.target.value)} min="1" /></td>
//                         <td>
//                           <select className="form-select form-select-sm" value={item.unit} onChange={e => handleItemChange(i, 'unit', e.target.value)}>
//                             {units.map(u => <option key={u}>{u}</option>)}
//                           </select>
//                         </td>
//                         <td><input type="number" className="form-control form-control-sm" value={item.costPrice} onChange={e => handleItemChange(i, 'costPrice', e.target.value)} min="0" /></td>
//                         <td style={{ verticalAlign: 'middle', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>AED {(Number(item.qty) * Number(item.costPrice)).toFixed(2)}</td>
//                         <td style={{ verticalAlign: 'middle' }}>
//                           {form.items.length > 1 && <button type="button" onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', color: '#cf222e', cursor: 'pointer', fontSize: 16 }}><i className="bi bi-trash3"></i></button>}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//               <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
//                 <div style={{ background: '#fbefff', border: '1px solid #d8b4fe', borderRadius: 10, padding: '12px 20px', minWidth: 220 }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
//                     <span style={{ fontWeight: 700 }}>Total Cost</span>
//                     <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#8250df' }}>AED {totalCost.toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="col-12">
//             <div className="client-form-card shadow-sm">
//               <label className="form-label" style={{ fontWeight: 600, fontSize: 13 }}>Notes</label>
//               <textarea className="form-control" name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Additional notes..." />
//             </div>
//           </div>

//           <div className="col-12">
//             <div style={{ display: 'flex', gap: 10 }}>
//               <button type="submit" style={{ background: '#8250df', border: 'none', color: 'white', padding: '10px 24px', borderRadius: 8, fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
//                 <i className="bi bi-check-lg me-2"></i>Submit Purchase Order
//               </button>
//               <button type="button" className="btn-reset" onClick={() => setForm({ poNo: '', poDate: '', supplier: '', warehouse: '', items: [{ itemName: '', sku: '', qty: 1, unit: 'Pcs', costPrice: 0 }], notes: '' })}>
//                 <i className="bi bi-arrow-counterclockwise me-2"></i>Reset
//               </button>
//             </div>
//           </div>
//         </div>
//       </form>
//     </>
//   );
// }



import { useState } from 'react';

const units = ['Pcs', 'Kg', 'Meter', 'Roll', 'Box', 'Set', 'Liter', 'Ton'];
const paymentMethods = ['Cash', 'Bank Transfer', 'Cheque', 'Credit'];
const warehouses = ['Main Warehouse', 'Site A - Dubai', 'Site B - Sharjah', 'Site C - Abu Dhabi'];

const DUMMY_HISTORY = [
  { id: 1, poNo: 'PO-0004', poDate: '2026-04-28', supplier: 'Al Faris Trading', warehouse: 'Main Warehouse', items: [{ itemName: 'Chain Link Fencing', sku: 'SKU-001', qty: 50, unit: 'Meter', costPrice: 85 }, { itemName: 'Steel Posts 2m', sku: 'SKU-002', qty: 100, unit: 'Pcs', costPrice: 45 }], totalCost: 8750, amountPaid: 8750, paymentMethod: 'Bank Transfer', paymentRef: 'TXN-2045', notes: '' },
  { id: 2, poNo: 'PO-0003', poDate: '2026-04-22', supplier: 'Gulf Steel Co', warehouse: 'Site A - Dubai', items: [{ itemName: 'Barbed Wire Roll', sku: 'SKU-010', qty: 30, unit: 'Roll', costPrice: 120 }], totalCost: 3600, amountPaid: 2000, paymentMethod: 'Cheque', paymentRef: 'CHQ-881', notes: 'Partial payment' },
  { id: 3, poNo: 'PO-0002', poDate: '2026-04-15', supplier: 'Emirates Hardware', warehouse: 'Main Warehouse', items: [{ itemName: 'Razor Wire', sku: 'SKU-022', qty: 20, unit: 'Roll', costPrice: 180 }], totalCost: 3600, amountPaid: 3600, paymentMethod: 'Cash', paymentRef: '', notes: '' },
  { id: 4, poNo: 'PO-0001', poDate: '2026-04-08', supplier: 'Dubai Metals LLC', warehouse: 'Site B - Sharjah', items: [{ itemName: 'Galvanized Pipes', sku: 'SKU-033', qty: 200, unit: 'Meter', costPrice: 35 }], totalCost: 7000, amountPaid: 3000, paymentMethod: 'Credit', paymentRef: '', notes: 'Balance due' },
];

function fmt(n) {
  return Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function StatusBadge({ paid, total }) {
  const bal = total - paid;
  if (bal <= 0) return <span style={{ background: '#d1fae5', color: '#065f46', padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>Paid</span>;
  if (paid > 0) return <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>Partial</span>;
  return <span style={{ background: '#fee2e2', color: '#991b1b', padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>Pending</span>;
}

function StatCard({ label, value, sub, color }) {
  const palette = {
    indigo: { bg: 'linear-gradient(135deg,#eef2ff,#e0e7ff)', val: '#3730a3', border: '#c7d2fe' },
    red:    { bg: 'linear-gradient(135deg,#fff1f2,#ffe4e6)', val: '#be123c', border: '#fecdd3' },
    green:  { bg: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', val: '#166534', border: '#bbf7d0' },
    amber:  { bg: 'linear-gradient(135deg,#fffbeb,#fef3c7)', val: '#92400e', border: '#fde68a' },
  };
  const c = palette[color] || palette.indigo;
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 14, padding: '18px 22px', flex: 1, minWidth: 160 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: c.val, fontFamily: 'IBM Plex Mono, monospace', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 5, fontFamily: 'DM Sans, sans-serif' }}>{sub}</div>}
    </div>
  );
}

const EMPTY_FORM = () => ({
  poNo: '',
  poDate: new Date().toISOString().split('T')[0],
  supplier: '',
  warehouse: 'Main Warehouse',
  items: [{ itemName: '', sku: '', qty: 1, unit: 'Pcs', costPrice: 0 }],
  amountPaid: 0,
  paymentMethod: 'Cash',
  paymentRef: '',
  paymentDate: new Date().toISOString().split('T')[0],
  notes: '',
});

export default function PurchaseInventory() {
  const [activeTab, setActiveTab] = useState('new');
  const [history, setHistory] = useState(DUMMY_HISTORY);
  const [viewPO, setViewPO] = useState(null);
  const [searchQ, setSearchQ] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [payingId, setPayingId] = useState(null);
  const [extraPayment, setExtraPayment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toast, setToast] = useState(null);

  const nextPoNo = () => `PO-${String(history.length + 1).padStart(4, '0')}`;

  const [form, setForm] = useState({ ...EMPTY_FORM(), poNo: 'PO-0005' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleItemChange = (i, field, value) => {
    const items = [...form.items];
    items[i] = { ...items[i], [field]: value };
    setForm({ ...form, items });
  };
  const addItem = () => setForm({ ...form, items: [...form.items, { itemName: '', sku: '', qty: 1, unit: 'Pcs', costPrice: 0 }] });
  const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });

  const totalCost = form.items.reduce((s, it) => s + Number(it.qty) * Number(it.costPrice), 0);
  const balanceDue = Math.max(0, totalCost - Number(form.amountPaid));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setHistory(history.map(p => p.id === editingId ? { ...p, ...form, totalCost, amountPaid: Number(form.amountPaid) } : p));
      setEditingId(null);
      showToast('Purchase Order updated successfully!');
    } else {
      const newPO = { id: Date.now(), ...form, totalCost, amountPaid: Number(form.amountPaid) };
      setHistory([newPO, ...history]);
      showToast('Purchase Order submitted successfully!');
    }
    setForm({ ...EMPTY_FORM(), poNo: nextPoNo() });
    setActiveTab('history');
  };

  const handleEdit = (po) => {
    setForm({
      poNo: po.poNo, poDate: po.poDate, supplier: po.supplier || '', warehouse: po.warehouse || 'Main Warehouse',
      items: po.items.map(it => ({ ...it })),
      amountPaid: po.amountPaid, paymentMethod: po.paymentMethod || 'Cash',
      paymentRef: po.paymentRef || '', paymentDate: po.paymentDate || new Date().toISOString().split('T')[0],
      notes: po.notes || '',
    });
    setEditingId(po.id);
    setActiveTab('new');
  };

  const handleDelete = (id) => {
    setHistory(history.filter(p => p.id !== id));
    setDeleteConfirmId(null);
    showToast('Purchase Order deleted.', 'error');
  };

  const totalPurchases = history.reduce((s, p) => s + p.totalCost, 0);
  const totalPaid = history.reduce((s, p) => s + Number(p.amountPaid), 0);
  const totalBalance = totalPurchases - totalPaid;
  const pendingCount = history.filter(p => Number(p.amountPaid) < p.totalCost).length;

  const filteredHistory = history.filter(p => {
    const bal = p.totalCost - Number(p.amountPaid);
    const statusMatch = filterStatus === 'All' || (filterStatus === 'Paid' && bal <= 0) || (filterStatus === 'Partial' && bal > 0 && p.amountPaid > 0) || (filterStatus === 'Pending' && p.amountPaid == 0);
    const searchMatch = !searchQ || p.poNo.toLowerCase().includes(searchQ.toLowerCase()) || (p.supplier || '').toLowerCase().includes(searchQ.toLowerCase());
    return statusMatch && searchMatch;
  });

  const pendingPayments = history.filter(p => Number(p.amountPaid) < p.totalCost);

  // ── Styles ──────────────────────────────────────────────────────────────────
  const S = {
    root: {
      width: '100%',
      minHeight: '100vh',
      background: '#f5f6fa',
      fontFamily: 'DM Sans, sans-serif',
      boxSizing: 'border-box',
    },
    header: {
      background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)',
      padding: '28px 32px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
    },
    headerTitle: {
      margin: 0,
      fontSize: 22,
      fontWeight: 800,
      color: '#fff',
      fontFamily: 'Playfair Display, serif',
      letterSpacing: '-0.3px',
    },
    headerSub: {
      margin: '4px 0 0',
      fontSize: 13,
      color: '#c7d2fe',
      fontFamily: 'DM Sans, sans-serif',
    },
    body: {
      padding: '24px 28px',
      maxWidth: '100%',
    },
    statsRow: {
      display: 'flex',
      gap: 14,
      marginBottom: 22,
      flexWrap: 'wrap',
    },
    tabBar: {
      display: 'flex',
      gap: 4,
      background: '#fff',
      border: '1px solid #e0e7ff',
      borderRadius: 12,
      padding: 4,
      marginBottom: 22,
      width: 'fit-content',
      flexWrap: 'wrap',
    },
    card: {
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 14,
      padding: '22px 24px',
      marginBottom: 18,
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    },
    cardTitle: {
      fontWeight: 700,
      fontSize: 13,
      marginBottom: 18,
      color: '#1e1b4b',
      fontFamily: 'DM Sans, sans-serif',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
    },
    label: {
      display: 'block',
      fontSize: 12,
      fontWeight: 600,
      color: '#374151',
      marginBottom: 5,
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
    },
    input: {
      width: '100%',
      padding: '9px 13px',
      fontSize: 14,
      border: '1.5px solid #e0e7ff',
      borderRadius: 9,
      background: '#fafafa',
      color: '#1f2937',
      fontFamily: 'DM Sans, sans-serif',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'border 0.2s',
    },
    select: {
      width: '100%',
      padding: '9px 13px',
      fontSize: 14,
      border: '1.5px solid #e0e7ff',
      borderRadius: 9,
      background: '#fafafa',
      color: '#1f2937',
      fontFamily: 'DM Sans, sans-serif',
      outline: 'none',
      boxSizing: 'border-box',
    },
    btn: {
      padding: '10px 22px',
      borderRadius: 9,
      fontSize: 13,
      fontWeight: 700,
      cursor: 'pointer',
      fontFamily: 'DM Sans, sans-serif',
      border: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      letterSpacing: '0.02em',
      transition: 'opacity 0.15s',
    },
    btnPrimary: { background: 'linear-gradient(135deg,#4338ca,#6366f1)', color: '#fff' },
    btnDanger: { background: '#dc2626', color: '#fff' },
    btnGhost: { background: 'none', border: '1.5px solid #d1d5db', color: '#374151' },
    btnSm: { padding: '5px 12px', fontSize: 12, borderRadius: 7, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, border: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 },
    th: { fontWeight: 700, color: '#6b7280', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '11px 12px', background: '#f9fafb', border: 'none', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' },
    td: { padding: '10px 12px', fontSize: 13, color: '#374151', borderBottom: '1px solid #f3f4f6', verticalAlign: 'middle', fontFamily: 'DM Sans, sans-serif' },
    mono: { fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600 },
  };

  const tabStyle = (t) => ({
    padding: '8px 18px',
    borderRadius: 9,
    fontSize: 13,
    cursor: 'pointer',
    border: 'none',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 700,
    letterSpacing: '0.02em',
    transition: 'all 0.15s',
    background: activeTab === t ? 'linear-gradient(135deg,#4338ca,#6366f1)' : 'transparent',
    color: activeTab === t ? '#fff' : '#6b7280',
    whiteSpace: 'nowrap',
  });

  const gridRow = { display: 'grid', gap: 16 };

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600;700&display=swap');
        * { box-sizing: border-box; }
        input:focus, select:focus, textarea:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
        .tbl-row:hover td { background: #f5f3ff; }
        @media (max-width: 900px) {
          .stats-row { flex-direction: column !important; }
          .form-grid-4 { grid-template-columns: 1fr 1fr !important; }
          .form-grid-2 { grid-template-columns: 1fr !important; }
          .pay-grid { grid-template-columns: 1fr !important; }
          .header-inner { flex-direction: column; align-items: flex-start !important; }
          .body-pad { padding: 16px 14px !important; }
          .tab-bar { width: 100% !important; }
          .tab-bar button { flex: 1; justify-content: center; padding: 8px 10px !important; font-size: 12px !important; }
          .history-toolbar { flex-direction: column !important; align-items: stretch !important; }
          .history-toolbar input, .history-toolbar select { width: 100% !important; }
          .action-btns { flex-wrap: wrap; }
          .table-wrap { overflow-x: auto; }
        }
        @media (max-width: 600px) {
          .form-grid-4 { grid-template-columns: 1fr !important; }
          .stats-card-val { font-size: 17px !important; }
          .header-title { font-size: 18px !important; }
        }
        @media (max-width: 480px) {
          .modal-inner { padding: 18px 14px !important; }
        }
      `}</style>

      <div style={S.root}>
        {/* Header */}
        <div style={S.header} className="header-inner">
          <div>
            <h1 style={S.headerTitle} className="header-title">📦 Purchase Inventory</h1>
            <p style={S.headerSub}>Record incoming stock · Track payments · Manage history</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '8px 16px', fontSize: 12, color: '#e0e7ff', fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>
              {history.length} Orders · ₹{fmt(totalPurchases)}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px' }} className="body-pad">

          {/* Stats */}
          <div style={S.statsRow} className="stats-row">
            <StatCard label="Total Purchases" value={`₹${fmt(totalPurchases)}`} sub={`${history.length} orders`} color="indigo" />
            <StatCard label="Total Paid" value={`₹${fmt(totalPaid)}`} sub="All time" color="green" />
            <StatCard label="Balance Due" value={`₹${fmt(totalBalance)}`} sub={`${pendingCount} pending`} color="red" />
            <StatCard label="Pending Orders" value={pendingCount} sub="Awaiting full payment" color="amber" />
          </div>

          {/* Tabs */}
          <div style={S.tabBar} className="tab-bar">
            <button style={tabStyle('new')} onClick={() => { setActiveTab('new'); if (!editingId) setForm({ ...EMPTY_FORM(), poNo: nextPoNo() }); }}>
              {editingId ? '✏️ Edit PO' : '+ New Purchase'}
            </button>
            <button style={tabStyle('history')} onClick={() => setActiveTab('history')}>📋 Purchase History</button>
            <button style={tabStyle('pending')} onClick={() => setActiveTab('pending')}>⏳ Pending Payments {pendingCount > 0 && <span style={{ background: '#dc2626', color: '#fff', borderRadius: 99, padding: '1px 7px', fontSize: 10, marginLeft: 4 }}>{pendingCount}</span>}</button>
          </div>

          {/* ── TAB: NEW / EDIT PURCHASE ── */}
          {activeTab === 'new' && (
            <form onSubmit={handleSubmit}>
              {editingId && (
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#1d4ed8', fontWeight: 600 }}>
                  ✏️ Editing {form.poNo} — changes will update the existing record.
                  <button type="button" onClick={() => { setEditingId(null); setForm({ ...EMPTY_FORM(), poNo: nextPoNo() }); }} style={{ marginLeft: 16, fontSize: 12, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>Cancel Edit ×</button>
                </div>
              )}

              {/* PO Info */}
              <div style={S.card}>
                <div style={S.cardTitle}><span style={{ color: '#6366f1' }}>●</span> Purchase Order Info</div>
                <div className="form-grid-4" style={{ ...gridRow, gridTemplateColumns: 'repeat(4,1fr)' }}>
                  <div>
                    <label style={S.label}>PO Number *</label>
                    <input style={S.input} name="poNo" value={form.poNo} onChange={handleChange} placeholder="PO-0001" required />
                  </div>
                  <div>
                    <label style={S.label}>Date *</label>
                    <input type="date" style={S.input} name="poDate" value={form.poDate} onChange={handleChange} required />
                  </div>
                  <div>
                    <label style={S.label}>Supplier</label>
                    <input style={S.input} name="supplier" value={form.supplier} onChange={handleChange} placeholder="Supplier name" list="supplier-list" />
                    <datalist id="supplier-list">
                      <option value="Al Faris Trading" /><option value="Gulf Steel Co" /><option value="Emirates Hardware" /><option value="Dubai Metals LLC" />
                    </datalist>
                  </div>
                  <div>
                    <label style={S.label}>Warehouse</label>
                    <select style={S.select} name="warehouse" value={form.warehouse} onChange={handleChange}>
                      {warehouses.map(w => <option key={w}>{w}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Stock Items */}
              <div style={S.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 8 }}>
                  <div style={S.cardTitle}><span style={{ color: '#6366f1' }}>●</span> Stock Items</div>
                  <button type="button" onClick={addItem} style={{ ...S.btn, ...S.btnPrimary, padding: '7px 16px', fontSize: 12 }}>
                    + Add Item
                  </button>
                </div>
                <div className="table-wrap" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr>
                        {['#', 'Item Name', 'SKU', 'Qty', 'Unit', 'Cost Price (₹)', 'Total (₹)', ''].map((h, i) => (
                          <th key={i} style={{ ...S.th, minWidth: i === 1 ? 160 : undefined }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {form.items.map((item, i) => (
                        <tr key={i}>
                          <td style={{ ...S.td, color: '#9ca3af', fontWeight: 700, width: 36 }}>{i + 1}</td>
                          <td style={S.td}><input style={{ ...S.input, minWidth: 140 }} value={item.itemName} onChange={e => handleItemChange(i, 'itemName', e.target.value)} placeholder="Item name" /></td>
                          <td style={S.td}><input style={{ ...S.input, minWidth: 90 }} value={item.sku} onChange={e => handleItemChange(i, 'sku', e.target.value)} placeholder="SKU-001" /></td>
                          <td style={S.td}><input type="number" style={{ ...S.input, width: 72 }} value={item.qty} onChange={e => handleItemChange(i, 'qty', e.target.value)} min="1" /></td>
                          <td style={S.td}>
                            <select style={{ ...S.select, width: 90 }} value={item.unit} onChange={e => handleItemChange(i, 'unit', e.target.value)}>
                              {units.map(u => <option key={u}>{u}</option>)}
                            </select>
                          </td>
                          <td style={S.td}><input type="number" style={{ ...S.input, width: 110 }} value={item.costPrice} onChange={e => handleItemChange(i, 'costPrice', e.target.value)} min="0" /></td>
                          <td style={{ ...S.td, ...S.mono, color: '#4338ca' }}>₹{fmt(Number(item.qty) * Number(item.costPrice))}</td>
                          <td style={S.td}>
                            {form.items.length > 1 && (
                              <button type="button" onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 16, padding: 2 }}>×</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
                  <div style={{ background: 'linear-gradient(135deg,#eef2ff,#e0e7ff)', border: '1px solid #c7d2fe', borderRadius: 12, padding: '12px 22px' }}>
                    <span style={{ fontSize: 13, color: '#4338ca', fontWeight: 700, fontFamily: 'DM Sans, sans-serif' }}>Order Total: </span>
                    <span style={{ ...S.mono, fontSize: 18, color: '#3730a3' }}>₹{fmt(totalCost)}</span>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div style={S.card}>
                <div style={S.cardTitle}><span style={{ color: '#6366f1' }}>●</span> Payment Details</div>
                <div className="pay-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={S.label}>Payment Method</label>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                        {paymentMethods.map(m => (
                          <button key={m} type="button" onClick={() => setForm({ ...form, paymentMethod: m })} style={{
                            padding: '7px 16px', borderRadius: 99, fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
                            border: form.paymentMethod === m ? '2px solid #6366f1' : '1.5px solid #e0e7ff',
                            background: form.paymentMethod === m ? 'linear-gradient(135deg,#eef2ff,#e0e7ff)' : '#fff',
                            color: form.paymentMethod === m ? '#3730a3' : '#6b7280',
                          }}>{m}</button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={S.label}>Amount Paid (₹)</label>
                        <input type="number" style={S.input} name="amountPaid" value={form.amountPaid} onChange={handleChange} min="0" max={totalCost} />
                      </div>
                      <div>
                        <label style={S.label}>Payment Date</label>
                        <input type="date" style={S.input} name="paymentDate" value={form.paymentDate} onChange={handleChange} />
                      </div>
                    </div>
                    <div>
                      <label style={S.label}>Payment Reference</label>
                      <input style={S.input} name="paymentRef" value={form.paymentRef} onChange={handleChange} placeholder="Transaction ID, cheque no., etc." />
                    </div>
                  </div>

                  {/* Balance summary */}
                  <div>
                    <label style={S.label}>Balance Summary</label>
                    <div style={{ background: '#f9fafb', borderRadius: 12, padding: 16, border: '1px solid #e5e7eb' }}>
                      {[['Order Total', `₹${fmt(totalCost)}`, '#374151'], ['Amount Paid', `₹${fmt(Number(form.amountPaid))}`, '#16a34a']].map(([l, v, c]) => (
                        <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f3f4f6', fontSize: 13 }}>
                          <span style={{ color: '#6b7280', fontFamily: 'DM Sans, sans-serif' }}>{l}</span>
                          <span style={{ ...S.mono, color: c, fontSize: 13 }}>{v}</span>
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 2px', fontSize: 15 }}>
                        <span style={{ fontWeight: 700, color: '#1f2937' }}>Balance Due</span>
                        <span style={{ ...S.mono, color: balanceDue > 0 ? '#dc2626' : '#16a34a', fontSize: 16 }}>₹{fmt(balanceDue)}</span>
                      </div>
                    </div>
                    <div style={{ marginTop: 10 }}>
                      {balanceDue > 0
                        ? <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: 9, padding: '10px 14px', fontSize: 12, color: '#92400e', fontWeight: 600 }}>⚠️ ₹{fmt(balanceDue)} outstanding after this payment.</div>
                        : totalCost > 0
                          ? <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 9, padding: '10px 14px', fontSize: 12, color: '#065f46', fontWeight: 600 }}>✓ Fully paid — no balance due.</div>
                          : null}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div style={S.card}>
                <label style={S.label}>Notes / Remarks</label>
                <textarea style={{ ...S.input, resize: 'vertical', minHeight: 70 }} name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Delivery instructions, remarks..." />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button type="submit" style={{ ...S.btn, ...S.btnPrimary }}>
                  {editingId ? '✓ Update Purchase Order' : '✓ Submit Purchase Order'}
                </button>
                <button type="button" style={{ ...S.btn, ...S.btnGhost }} onClick={() => { setForm({ ...EMPTY_FORM(), poNo: nextPoNo() }); setEditingId(null); }}>
                  ↺ Reset
                </button>
              </div>
            </form>
          )}

          {/* ── TAB: PURCHASE HISTORY ── */}
          {activeTab === 'history' && (
            <div style={S.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }} className="history-toolbar">
                <div style={S.cardTitle}><span style={{ color: '#6366f1' }}>●</span> All Purchase Orders</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <input type="text" style={{ ...S.input, width: 210 }} placeholder="🔍  Search PO, supplier..." value={searchQ} onChange={e => setSearchQ(e.target.value)} />
                  <select style={{ ...S.select, width: 140 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    {['All', 'Paid', 'Partial', 'Pending'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="table-wrap" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['PO No.', 'Date', 'Supplier', 'Warehouse', 'Items', 'Total (₹)', 'Paid (₹)', 'Balance (₹)', 'Status', 'Actions'].map(h => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.length === 0 && (
                      <tr><td colSpan={10} style={{ textAlign: 'center', color: '#9ca3af', padding: 40, fontFamily: 'DM Sans, sans-serif' }}>No purchase orders found.</td></tr>
                    )}
                    {filteredHistory.map(po => {
                      const bal = po.totalCost - Number(po.amountPaid);
                      return (
                        <tr key={po.id} className="tbl-row" style={{ transition: 'background 0.15s' }}>
                          <td style={{ ...S.td, fontWeight: 700, color: '#4338ca' }}>{po.poNo}</td>
                          <td style={S.td}>{po.poDate}</td>
                          <td style={S.td}>{po.supplier || '—'}</td>
                          <td style={{ ...S.td, fontSize: 12, color: '#6b7280' }}>{po.warehouse || '—'}</td>
                          <td style={{ ...S.td, color: '#6b7280' }}>{po.items.length} item{po.items.length !== 1 ? 's' : ''}</td>
                          <td style={{ ...S.td, ...S.mono }}>{fmt(po.totalCost)}</td>
                          <td style={{ ...S.td, ...S.mono, color: '#16a34a' }}>{fmt(Number(po.amountPaid))}</td>
                          <td style={{ ...S.td, ...S.mono, color: bal > 0 ? '#dc2626' : '#16a34a' }}>{fmt(bal)}</td>
                          <td style={S.td}><StatusBadge paid={Number(po.amountPaid)} total={po.totalCost} /></td>
                          <td style={S.td}>
                            <div style={{ display: 'flex', gap: 5 }} className="action-btns">
                              <button type="button" onClick={() => setViewPO(po)} style={{ ...S.btnSm, background: '#f3f4f6', color: '#374151' }}>👁 View</button>
                              <button type="button" onClick={() => handleEdit(po)} style={{ ...S.btnSm, background: '#eff6ff', color: '#1d4ed8' }}>✏️ Edit</button>
                              <button type="button" onClick={() => setDeleteConfirmId(po.id)} style={{ ...S.btnSm, background: '#fff1f2', color: '#be123c' }}>🗑 Del</button>
                              {bal > 0 && (
                                <button type="button" onClick={() => { setPayingId(po.id); setExtraPayment(''); }} style={{ ...S.btnSm, background: 'linear-gradient(135deg,#4338ca,#6366f1)', color: '#fff' }}>💳 Pay</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TAB: PENDING PAYMENTS ── */}
          {activeTab === 'pending' && (
            <div>
              <div style={{ display: 'flex', gap: 14, marginBottom: 22, flexWrap: 'wrap' }} className="stats-row">
                <StatCard label="Total Outstanding" value={`₹${fmt(pendingPayments.reduce((s, p) => s + p.totalCost - Number(p.amountPaid), 0))}`} sub={`${pendingPayments.length} orders`} color="red" />
                <StatCard label="Partial Payments" value={pendingPayments.filter(p => p.amountPaid > 0).length} sub="Some amount paid" color="amber" />
                <StatCard label="Not Paid" value={pendingPayments.filter(p => p.amountPaid == 0).length} sub="Zero payment" color="red" />
              </div>
              <div style={S.card}>
                <div style={S.cardTitle}><span style={{ color: '#dc2626' }}>●</span> Pending & Partial Payments</div>
                {pendingPayments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 52, color: '#9ca3af', fontFamily: 'DM Sans, sans-serif' }}>
                    <div style={{ fontSize: 38, marginBottom: 10 }}>✅</div>
                    All payments are cleared!
                  </div>
                ) : (
                  <div className="table-wrap" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>{['PO No.', 'Supplier', 'Order Total', 'Paid', 'Balance Due', 'Method', 'Status', 'Action'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                      </thead>
                      <tbody>
                        {pendingPayments.map(po => {
                          const bal = po.totalCost - Number(po.amountPaid);
                          return (
                            <tr key={po.id} className="tbl-row">
                              <td style={{ ...S.td, fontWeight: 700, color: '#4338ca' }}>{po.poNo}</td>
                              <td style={S.td}>{po.supplier || '—'}</td>
                              <td style={{ ...S.td, ...S.mono }}>₹{fmt(po.totalCost)}</td>
                              <td style={{ ...S.td, ...S.mono, color: '#16a34a' }}>₹{fmt(Number(po.amountPaid))}</td>
                              <td style={{ ...S.td, ...S.mono, color: '#dc2626', fontWeight: 700 }}>₹{fmt(bal)}</td>
                              <td style={{ ...S.td, fontSize: 12 }}>{po.paymentMethod || '—'}</td>
                              <td style={S.td}><StatusBadge paid={Number(po.amountPaid)} total={po.totalCost} /></td>
                              <td style={S.td}>
                                <button type="button" onClick={() => { setPayingId(po.id); setExtraPayment(''); }} style={{ ...S.btn, ...S.btnPrimary, padding: '6px 16px', fontSize: 12 }}>
                                  💳 Pay Now
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL: VIEW PO ── */}
      {viewPO && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="modal-inner" style={{ background: '#fff', borderRadius: 18, padding: 28, width: '100%', maxWidth: 660, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h5 style={{ margin: 0, fontWeight: 800, color: '#3730a3', fontFamily: 'Playfair Display, serif', fontSize: 20 }}>📄 {viewPO.poNo}</h5>
              <button onClick={() => setViewPO(null)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#9ca3af', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px', fontSize: 13, marginBottom: 18 }}>
              {[['Date', viewPO.poDate], ['Supplier', viewPO.supplier || '—'], ['Warehouse', viewPO.warehouse || '—'], ['Payment Method', viewPO.paymentMethod || '—'], viewPO.paymentRef ? ['Ref', viewPO.paymentRef] : null].filter(Boolean).map(([l, v]) => (
                <div key={l} style={{ padding: '5px 0', borderBottom: '1px solid #f3f4f6', fontFamily: 'DM Sans, sans-serif' }}>
                  <span style={{ color: '#9ca3af' }}>{l}: </span><strong style={{ color: '#1f2937' }}>{v}</strong>
                </div>
              ))}
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead><tr>{['Item', 'SKU', 'Qty', 'Unit', 'Rate (₹)', 'Total (₹)'].map(h => <th key={h} style={{ ...S.th, padding: '9px 10px' }}>{h}</th>)}</tr></thead>
                <tbody>
                  {viewPO.items.map((it, i) => (
                    <tr key={i} className="tbl-row">
                      <td style={S.td}>{it.itemName}</td>
                      <td style={{ ...S.td, fontSize: 12, color: '#6b7280' }}>{it.sku}</td>
                      <td style={S.td}>{it.qty}</td>
                      <td style={S.td}>{it.unit}</td>
                      <td style={{ ...S.td, ...S.mono }}>{fmt(it.costPrice)}</td>
                      <td style={{ ...S.td, ...S.mono, color: '#4338ca' }}>{fmt(Number(it.qty) * Number(it.costPrice))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ background: '#f9fafb', borderRadius: 12, padding: 14, marginTop: 14 }}>
              {[['Order Total', `₹${fmt(viewPO.totalCost)}`, '#374151'], ['Amount Paid', `₹${fmt(Number(viewPO.amountPaid))}`, '#16a34a']].map(([l, v, c]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, borderBottom: '1px solid #f3f4f6', fontFamily: 'DM Sans, sans-serif' }}>
                  <span style={{ color: '#6b7280' }}>{l}</span><span style={{ ...S.mono, color: c }}>{v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, padding: '10px 0 2px', fontFamily: 'DM Sans, sans-serif' }}>
                <span style={{ fontWeight: 700, color: '#1f2937' }}>Balance Due</span>
                <span style={{ ...S.mono, fontSize: 16, color: viewPO.totalCost - viewPO.amountPaid > 0 ? '#dc2626' : '#16a34a' }}>₹{fmt(viewPO.totalCost - Number(viewPO.amountPaid))}</span>
              </div>
            </div>
            {viewPO.notes && <p style={{ fontSize: 12, color: '#6b7280', marginTop: 12, fontFamily: 'DM Sans, sans-serif' }}><strong>Notes:</strong> {viewPO.notes}</p>}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={() => { handleEdit(viewPO); setViewPO(null); }} style={{ ...S.btn, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>✏️ Edit</button>
              <button onClick={() => setViewPO(null)} style={{ ...S.btn, ...S.btnPrimary }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: DELETE CONFIRM ── */}
      {deleteConfirmId && (() => {
        const po = history.find(p => p.id === deleteConfirmId);
        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div className="modal-inner" style={{ background: '#fff', borderRadius: 18, padding: 28, width: '100%', maxWidth: 400, boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🗑️</div>
                <h5 style={{ fontWeight: 800, color: '#1f2937', fontFamily: 'Playfair Display, serif', margin: 0 }}>Delete {po?.poNo}?</h5>
                <p style={{ color: '#6b7280', fontSize: 13, margin: '10px 0 0', fontFamily: 'DM Sans, sans-serif' }}>This will permanently remove this purchase order. This action cannot be undone.</p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setDeleteConfirmId(null)} style={{ ...S.btn, ...S.btnGhost, flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button onClick={() => handleDelete(deleteConfirmId)} style={{ ...S.btn, ...S.btnDanger, flex: 1, justifyContent: 'center' }}>Delete</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── MODAL: PAY BALANCE ── */}
      {payingId && (() => {
        const po = history.find(p => p.id === payingId);
        if (!po) return null;
        const bal = po.totalCost - Number(po.amountPaid);
        const payAmt = Number(extraPayment) || 0;
        const newBal = Math.max(0, bal - payAmt);
        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div className="modal-inner" style={{ background: '#fff', borderRadius: 18, padding: 28, width: '100%', maxWidth: 420, boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h5 style={{ margin: 0, fontWeight: 800, fontFamily: 'Playfair Display, serif', color: '#1f2937' }}>💳 Record Payment</h5>
                <button onClick={() => setPayingId(null)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#9ca3af' }}>×</button>
              </div>
              <div style={{ background: '#f9fafb', borderRadius: 12, padding: 14, marginBottom: 16, fontSize: 13 }}>
                {[['PO', po.poNo], ['Supplier', po.supplier || '—'], ['Outstanding', `₹${fmt(bal)}`]].map(([l, v], i) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontFamily: 'DM Sans, sans-serif' }}>
                    <span style={{ color: '#6b7280' }}>{l}</span>
                    <strong style={{ color: i === 2 ? '#dc2626' : '#1f2937', fontFamily: i === 2 ? 'IBM Plex Mono, monospace' : 'DM Sans, sans-serif' }}>{v}</strong>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={S.label}>Amount to Pay (₹)</label>
                <input type="number" style={S.input} value={extraPayment} onChange={e => setExtraPayment(e.target.value)} min="0" max={bal} placeholder={`Max: ₹${fmt(bal)}`} />
              </div>
              {payAmt > 0 && (
                <div style={{ background: newBal <= 0 ? '#d1fae5' : '#fef9c3', border: `1px solid ${newBal <= 0 ? '#6ee7b7' : '#fde047'}`, borderRadius: 9, padding: '10px 14px', marginBottom: 14, fontSize: 13, fontWeight: 600, color: newBal <= 0 ? '#065f46' : '#92400e', fontFamily: 'DM Sans, sans-serif' }}>
                  {newBal <= 0 ? '✓ This will fully settle the balance.' : `Remaining after payment: ₹${fmt(newBal)}`}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setPayingId(null)} style={{ ...S.btn, ...S.btnGhost, flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="button"
                  disabled={payAmt <= 0 || payAmt > bal}
                  onClick={() => {
                    setHistory(history.map(p => p.id === payingId ? { ...p, amountPaid: Number(p.amountPaid) + payAmt } : p));
                    setPayingId(null); setExtraPayment('');
                    showToast('Payment recorded successfully!');
                  }}
                  style={{ ...S.btn, ...S.btnPrimary, flex: 1, justifyContent: 'center', opacity: payAmt <= 0 || payAmt > bal ? 0.45 : 1 }}>
                  ✓ Confirm Payment
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── TOAST ── */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 2000,
          background: toast.type === 'error' ? '#dc2626' : '#166534',
          color: '#fff', borderRadius: 12, padding: '12px 22px',
          fontSize: 13, fontWeight: 700, fontFamily: 'DM Sans, sans-serif',
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          animation: 'slideUp 0.3s ease',
        }}>
          {toast.type === 'error' ? '🗑️' : '✅'} {toast.msg}
        </div>
      )}
      <style>{`@keyframes slideUp { from { transform: translateY(20px); opacity:0 } to { transform: translateY(0); opacity:1 } }`}</style>
    </>
  );
}