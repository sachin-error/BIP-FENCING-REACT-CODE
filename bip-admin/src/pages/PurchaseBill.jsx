// // import { useState } from 'react';

// // export default function PurchaseBill() {
// //   const [form, setForm] = useState({
// //     billNo: '', billDate: '', supplierName: '', supplierPhone: '', supplierAddress: '',
// //     items: [{ description: '', qty: 1, rate: 0 }],
// //     discount: 0, notes: '',
// //   });

// //   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
// //   const handleItemChange = (i, field, value) => {
// //     const items = [...form.items];
// //     items[i][field] = value;
// //     setForm({ ...form, items });
// //   };
// //   const addItem = () => setForm({ ...form, items: [...form.items, { description: '', qty: 1, rate: 0 }] });
// //   const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });

// //   const subtotal = form.items.reduce((s, it) => s + Number(it.qty) * Number(it.rate), 0);
// //   const discountAmt = (subtotal * Number(form.discount)) / 100;
// //   const total = subtotal - discountAmt;

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     console.log('Purchase Bill Data:', { ...form, subtotal, discountAmt, total });
// //     alert('Purchase Bill submitted! Check console for data.');
// //   };

// //   return (
// //     <>
// //       <div className="page-header">
// //         <h1><i className="bi bi-bag-check-fill me-2" style={{ color: '#1a7f37' }}></i>Purchase Bill</h1>
// //         <p>Record and manage purchase bills from suppliers</p>
// //       </div>

// //       <form onSubmit={handleSubmit}>
// //         <div className="row g-3">

// //           <div className="col-12">
// //             <div className="client-form-card shadow-sm">
// //               <h6 style={{ fontWeight: 700, fontSize: 14, marginBottom: 18 }}>
// //                 <i className="bi bi-receipt me-2" style={{ color: '#1a7f37' }}></i>Bill Details
// //               </h6>
// //               <div className="row g-3">
// //                 <div className="col-md-4">
// //                   <label className="form-label">Bill Number <span style={{ color: 'red' }}>*</span></label>
// //                   <input className="form-control" name="billNo" value={form.billNo} onChange={handleChange} placeholder="BILL-0001" required />
// //                 </div>
// //                 <div className="col-md-4">
// //                   <label className="form-label">Bill Date <span style={{ color: 'red' }}>*</span></label>
// //                   <input type="date" className="form-control" name="billDate" value={form.billDate} onChange={handleChange} required />
// //                 </div>
// //                 <div className="col-md-4">
// //                   <label className="form-label">Discount %</label>
// //                   <input type="number" className="form-control" name="discount" value={form.discount} onChange={handleChange} min="0" max="100" />
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="col-12">
// //             <div className="client-form-card shadow-sm">
// //               <h6 style={{ fontWeight: 700, fontSize: 14, marginBottom: 18 }}>
// //                 <i className="bi bi-truck me-2" style={{ color: '#1a7f37' }}></i>Supplier Information
// //               </h6>
// //               <div className="row g-3">
// //                 <div className="col-md-6">
// //                   <label className="form-label">Supplier Name <span style={{ color: 'red' }}>*</span></label>
// //                   <input className="form-control" name="supplierName" value={form.supplierName} onChange={handleChange} placeholder="Supplier company name" required />
// //                 </div>
// //                 <div className="col-md-6">
// //                   <label className="form-label">Phone</label>
// //                   <input className="form-control" name="supplierPhone" value={form.supplierPhone} onChange={handleChange} placeholder="+971 50 000 0000" />
// //                 </div>
// //                 <div className="col-12">
// //                   <label className="form-label">Address</label>
// //                   <textarea className="form-control" name="supplierAddress" value={form.supplierAddress} onChange={handleChange} rows={2} placeholder="Supplier address..." />
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="col-12">
// //             <div className="client-form-card shadow-sm">
// //               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
// //                 <h6 style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>
// //                   <i className="bi bi-list-ul me-2" style={{ color: '#1a7f37' }}></i>Purchased Items
// //                 </h6>
// //                 <button type="button" onClick={addItem} style={{ background: '#1a7f37', border: 'none', color: 'white', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
// //                   <i className="bi bi-plus-lg me-1"></i>Add Item
// //                 </button>
// //               </div>
// //               <div className="table-responsive">
// //                 <table className="table" style={{ fontSize: 13.5 }}>
// //                   <thead style={{ background: '#f6f8fa' }}>
// //                     <tr>
// //                       <th style={{ fontWeight: 600, color: '#57606a', border: 'none', padding: '10px 12px' }}>#</th>
// //                       <th style={{ fontWeight: 600, color: '#57606a', border: 'none' }}>Item Description</th>
// //                       <th style={{ fontWeight: 600, color: '#57606a', border: 'none', width: 100 }}>Qty</th>
// //                       <th style={{ fontWeight: 600, color: '#57606a', border: 'none', width: 130 }}>Rate (AED)</th>
// //                       <th style={{ fontWeight: 600, color: '#57606a', border: 'none', width: 130 }}>Amount</th>
// //                       <th style={{ border: 'none', width: 50 }}></th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {form.items.map((item, i) => (
// //                       <tr key={i}>
// //                         <td style={{ verticalAlign: 'middle', padding: '8px 12px', color: '#57606a' }}>{i + 1}</td>
// //                         <td><input className="form-control form-control-sm" value={item.description} onChange={e => handleItemChange(i, 'description', e.target.value)} placeholder="Item name" /></td>
// //                         <td><input type="number" className="form-control form-control-sm" value={item.qty} onChange={e => handleItemChange(i, 'qty', e.target.value)} min="1" /></td>
// //                         <td><input type="number" className="form-control form-control-sm" value={item.rate} onChange={e => handleItemChange(i, 'rate', e.target.value)} min="0" /></td>
// //                         <td style={{ verticalAlign: 'middle', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>AED {(Number(item.qty) * Number(item.rate)).toFixed(2)}</td>
// //                         <td style={{ verticalAlign: 'middle' }}>
// //                           {form.items.length > 1 && <button type="button" onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', color: '#cf222e', cursor: 'pointer', fontSize: 16 }}><i className="bi bi-trash3"></i></button>}
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //               <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
// //                 <div style={{ minWidth: 280, background: '#f6f8fa', borderRadius: 10, padding: 16 }}>
// //                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 6 }}><span style={{ color: '#57606a' }}>Subtotal</span><span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>AED {subtotal.toFixed(2)}</span></div>
// //                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 8 }}><span style={{ color: '#57606a' }}>Discount ({form.discount}%)</span><span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#cf222e' }}>- AED {discountAmt.toFixed(2)}</span></div>
// //                   <div style={{ height: 1, background: '#d0d7de', marginBottom: 8 }}></div>
// //                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}><span style={{ fontWeight: 700 }}>Total</span><span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#1a7f37' }}>AED {total.toFixed(2)}</span></div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="col-12">
// //             <div className="client-form-card shadow-sm">
// //               <label className="form-label" style={{ fontWeight: 600, fontSize: 13 }}>Notes</label>
// //               <textarea className="form-control" name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Additional notes..." />
// //             </div>
// //           </div>

// //           <div className="col-12">
// //             <div style={{ display: 'flex', gap: 10 }}>
// //               <button type="submit" style={{ background: '#1a7f37', border: 'none', color: 'white', padding: '10px 24px', borderRadius: 8, fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
// //                 <i className="bi bi-check-lg me-2"></i>Submit Bill
// //               </button>
// //               <button type="button" className="btn-reset" onClick={() => setForm({ billNo: '', billDate: '', supplierName: '', supplierPhone: '', supplierAddress: '', items: [{ description: '', qty: 1, rate: 0 }], discount: 0, notes: '' })}>
// //                 <i className="bi bi-arrow-counterclockwise me-2"></i>Reset
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </form>
// //     </>
// //   );
// // }


// import { useState } from "react";

// export default function PurchaseBill() {
//   const [form, setForm] = useState({
//     billNo: "",
//     billDate: "",
//     supplierName: "",
//     supplierGST: "",
//     supplierPhone: "",
//     supplierAddress: "",
//     paymentMode: "Cash",
//     paidAmount: 0,

//     transportName: "",
//     vehicleNo: "",

//     items: [
//       {
//         description: "",
//         hsn: "",
//         qty: 1,
//         unit: "Nos",
//         rate: 0,
//         gst: 18,
//       },
//     ],

//     discount: 0,
//     notes: "",
//   });

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleItemChange = (i, field, value) => {
//     const items = [...form.items];
//     items[i][field] = value;
//     setForm({ ...form, items });
//   };

//   const addItem = () =>
//     setForm({
//       ...form,
//       items: [
//         ...form.items,
//         { description: "", hsn: "", qty: 1, unit: "Nos", rate: 0, gst: 18 },
//       ],
//     });

//   const removeItem = (i) =>
//     setForm({
//       ...form,
//       items: form.items.filter((_, idx) => idx !== i),
//     });

//   // 🔢 Calculations
//   const subtotal = form.items.reduce(
//     (s, it) => s + Number(it.qty) * Number(it.rate),
//     0
//   );

//   const discountAmt = (subtotal * Number(form.discount)) / 100;
//   const taxable = subtotal - discountAmt;

//   const totalGST = form.items.reduce((sum, it) => {
//     const itemTotal = it.qty * it.rate;
//     return sum + (itemTotal * it.gst) / 100;
//   }, 0);

//   const grandTotal = taxable + totalGST;

//   const balance = grandTotal - Number(form.paidAmount || 0);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Advanced Purchase Bill:", {
//       ...form,
//       subtotal,
//       discountAmt,
//       taxable,
//       totalGST,
//       grandTotal,
//       balance,
//     });
//     alert("Purchase Bill Saved (Check Console)");
//   };

//   return (
//     <form onSubmit={handleSubmit} className="container mt-3">
//       <h3>Advanced Purchase Bill</h3>

//       {/* BILL DETAILS */}
//       <div className="row mb-3">
//         <div className="col-md-4">
//           <input
//             className="form-control"
//             name="billNo"
//             placeholder="Bill No"
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="col-md-4">
//           <input
//             type="date"
//             className="form-control"
//             name="billDate"
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="col-md-4">
//           <select
//             className="form-control"
//             name="paymentMode"
//             onChange={handleChange}
//           >
//             <option>Cash</option>
//             <option>UPI</option>
//             <option>Bank</option>
//             <option>Credit</option>
//           </select>
//         </div>
//       </div>

//       {/* SUPPLIER */}
//       <h5>Supplier Details</h5>
//       <input
//         className="form-control mb-2"
//         name="supplierName"
//         placeholder="Supplier Name"
//         onChange={handleChange}
//       />
//       <input
//         className="form-control mb-2"
//         name="supplierGST"
//         placeholder="GSTIN"
//         onChange={handleChange}
//       />
//       <input
//         className="form-control mb-2"
//         name="supplierPhone"
//         placeholder="Phone"
//         onChange={handleChange}
//       />
//       <textarea
//         className="form-control mb-3"
//         name="supplierAddress"
//         placeholder="Address"
//         onChange={handleChange}
//       />

//       {/* TRANSPORT */}
//       <h5>Transport</h5>
//       <div className="row mb-3">
//         <div className="col-md-6">
//           <input
//             className="form-control"
//             name="transportName"
//             placeholder="Transport Name"
//             onChange={handleChange}
//           />
//         </div>
//         <div className="col-md-6">
//           <input
//             className="form-control"
//             name="vehicleNo"
//             placeholder="Vehicle No"
//             onChange={handleChange}
//           />
//         </div>
//       </div>

//       {/* ITEMS */}
//       <h5>Items</h5>
//       {form.items.map((item, i) => (
//         <div className="row mb-2" key={i}>
//           <div className="col-md-2">
//             <input
//               placeholder="Item"
//               className="form-control"
//               onChange={(e) =>
//                 handleItemChange(i, "description", e.target.value)
//               }
//             />
//           </div>
//           <div className="col-md-1">
//             <input
//               placeholder="HSN"
//               className="form-control"
//               onChange={(e) => handleItemChange(i, "hsn", e.target.value)}
//             />
//           </div>
//           <div className="col-md-1">
//             <input
//               placeholder="Qty"
//               type="number"
//               className="form-control"
//               onChange={(e) =>
//                 handleItemChange(i, "qty", Number(e.target.value))
//               }
//             />
//           </div>
//           <div className="col-md-1">
//             <input
//               placeholder="Unit"
//               className="form-control"
//               onChange={(e) => handleItemChange(i, "unit", e.target.value)}
//             />
//           </div>
//           <div className="col-md-2">
//             <input
//               placeholder="Rate"
//               type="number"
//               className="form-control"
//               onChange={(e) =>
//                 handleItemChange(i, "rate", Number(e.target.value))
//               }
//             />
//           </div>
//           <div className="col-md-2">
//             <input
//               placeholder="GST %"
//               type="number"
//               className="form-control"
//               onChange={(e) =>
//                 handleItemChange(i, "gst", Number(e.target.value))
//               }
//             />
//           </div>
//           <div className="col-md-2">
//             <b>
//               ₹ {(item.qty * item.rate).toFixed(2)}
//             </b>
//           </div>
//           <div className="col-md-1">
//             <button
//               type="button"
//               className="btn btn-danger"
//               onClick={() => removeItem(i)}
//             >
//               X
//             </button>
//           </div>
//         </div>
//       ))}

//       <button type="button" className="btn btn-secondary" onClick={addItem}>
//         Add Item
//       </button>

//       {/* PAYMENT */}
//       <h5 className="mt-4">Payment</h5>
//       <input
//         className="form-control mb-2"
//         name="paidAmount"
//         placeholder="Paid Amount"
//         type="number"
//         onChange={handleChange}
//       />

//       {/* DISCOUNT */}
//       <input
//         className="form-control mb-2"
//         name="discount"
//         placeholder="Discount %"
//         type="number"
//         onChange={handleChange}
//       />

//       {/* SUMMARY */}
//       <div className="bg-light p-3 rounded mt-3">
//         <p>Subtotal: ₹ {subtotal.toFixed(2)}</p>
//         <p>Discount: ₹ {discountAmt.toFixed(2)}</p>
//         <p>Taxable: ₹ {taxable.toFixed(2)}</p>
//         <p>Total GST: ₹ {totalGST.toFixed(2)}</p>
//         <h5>Grand Total: ₹ {grandTotal.toFixed(2)}</h5>
//         <p>Balance: ₹ {balance.toFixed(2)}</p>
//       </div>

//       {/* NOTES */}
//       <textarea
//         className="form-control mt-3"
//         name="notes"
//         placeholder="Notes"
//         onChange={handleChange}
//       />

//       <br />

//       <button className="btn btn-success">Save Purchase Bill</button>
//     </form>
//   );
// }



import { useState } from "react";

// ─── STATIC COMPANY (BUYER) DETAILS ─────────────────────────────────────────
const COMPANY = {
  name: "BIP FENCING CONTRACT WORK",
  address: "NO. 26/A, MAIN ROAD, PAMBANKULAM, KALANTHAPANAI, PANAGUDI - 627109",
  gst: "33ABLPI5244C1Z1",
  state: "Tamil Nadu",
  stateCode: "33",
  phone: "9655072445",
};

const DECLARATION =
  "We declare that this bill shows the actual price of the goods described and all particulars are true and correct.";

// ─── NUMBER TO INDIAN WORDS ──────────────────────────────────────────────────
const _ones = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];
const _tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function numToWords(n) {
  const num = Math.round(n);
  if (num === 0) return "Zero";
  if (num < 0) return "Minus " + numToWords(-num);
  if (num < 20) return _ones[num];
  if (num < 100) return _tens[Math.floor(num / 10)] + (num % 10 ? " " + _ones[num % 10] : "");
  if (num < 1000) return _ones[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " " + numToWords(num % 100) : "");
  if (num < 100000) return numToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + numToWords(num % 1000) : "");
  if (num < 10000000) return numToWords(Math.floor(num / 100000)) + " Lakh" + (num % 100000 ? " " + numToWords(num % 100000) : "");
  return numToWords(Math.floor(num / 10000000)) + " Crore" + (num % 10000000 ? " " + numToWords(num % 10000000) : "");
}

function amountInWords(amount) {
  const n = Math.round(amount * 100);
  const rupees = Math.floor(n / 100);
  const paise = n % 100;
  if (paise > 0) return "INR " + numToWords(rupees) + " and " + numToWords(paise) + " Paise Only";
  return "INR " + numToWords(rupees) + " Only";
}

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtDate = (d) => {
  if (!d) return "";
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" });
};

// ─── PRINT STYLES ────────────────────────────────────────────────────────────
const printCSS = `
@media print {
  body * { visibility: hidden !important; }
  #pb-invoice-print, #pb-invoice-print * { visibility: visible !important; }
  #pb-invoice-print {
    position: fixed !important;
    top: 0; left: 0;
    width: 100%;
    margin: 0; padding: 0;
  }
  .no-print { display: none !important; }
  @page { size: A4 portrait; margin: 8mm; }
}
`;

const cell = (extra = {}) => ({
  border: "1px solid #000",
  padding: "4px 6px",
  fontSize: 12,
  verticalAlign: "top",
  ...extra,
});

const emptyItem = () => ({
  description: "",
  hsn: "",
  qty: 1,
  unit: "Nos",
  rate: 0,
  gst: 18,
});

// ════════════════════════════════════════════════════════════════════════════
export default function PurchaseBill() {
  const [step, setStep] = useState(1); // 1 = form, 2 = preview

  const [form, setForm] = useState({
    billNo: "",
    billDate: new Date().toISOString().split("T")[0],
    supplierName: "",
    supplierGST: "",
    supplierPhone: "",
    supplierAddress: "",
    supplierState: "Tamil Nadu",
    supplierStateCode: "33",
    paymentMode: "Cash",
    paidAmount: "",
    transportName: "",
    vehicleNo: "",
    discount: 0,
    notes: "",
    items: [emptyItem()],
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleItemChange = (i, field, value) => {
    const items = [...form.items];
    items[i] = { ...items[i], [field]: value };
    setForm((p) => ({ ...p, items }));
  };

  const addItem = () => setForm((p) => ({ ...p, items: [...p.items, emptyItem()] }));
  const removeItem = (i) => {
    if (form.items.length === 1) return;
    setForm((p) => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }));
  };

  // ── CALCULATIONS ─────────────────────────────────────────────────────────
  const rows = form.items.map((it) => {
    const qty = parseFloat(it.qty) || 0;
    const rate = parseFloat(it.rate) || 0;
    const gstPct = parseFloat(it.gst) || 0;
    const baseAmt = qty * rate;
    const gstAmt = (baseAmt * gstPct) / 100;
    return { ...it, qty, rate, gstPct, baseAmt, gstAmt, totalAmt: baseAmt + gstAmt };
  });

  const subtotal = rows.reduce((s, r) => s + r.baseAmt, 0);
  const discountAmt = (subtotal * parseFloat(form.discount || 0)) / 100;
  const taxable = subtotal - discountAmt;
  const totalGST = rows.reduce((s, r) => s + (r.baseAmt - discountAmt / rows.length) * r.gstPct / 100, 0);
  // Simpler GST: apply discount proportionally then sum GST
  const taxableRows = rows.map((r) => {
    const discountedBase = r.baseAmt - (r.baseAmt / subtotal) * discountAmt;
    const gstAmt = (discountedBase * r.gstPct) / 100;
    return { ...r, discountedBase, gstAmt };
  });
  const totalGSTFinal = taxableRows.reduce((s, r) => s + r.gstAmt, 0);
  const grandTotal = taxable + totalGSTFinal;
  const paidAmount = parseFloat(form.paidAmount) || 0;
  const balance = grandTotal - paidAmount;

  // Group by HSN for GST summary
  const hsnGroups = {};
  taxableRows.forEach((r) => {
    const key = r.hsn || "–";
    const cgstR = r.gstPct / 2;
    const sgstR = r.gstPct / 2;
    if (!hsnGroups[key]) hsnGroups[key] = { taxable: 0, cgst: 0, sgst: 0, cgstRate: cgstR, sgstRate: sgstR };
    hsnGroups[key].taxable += r.discountedBase;
    hsnGroups[key].cgst += r.gstAmt / 2;
    hsnGroups[key].sgst += r.gstAmt / 2;
  });

  // ── VALIDATION ────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.billNo.trim()) e.billNo = "Required";
    if (!form.billDate) e.billDate = "Required";
    if (!form.supplierName.trim()) e.supplierName = "Required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setStep(2);
    window.scrollTo(0, 0);
  };

  const errStyle = (name) => ({ borderColor: errors[name] ? "#dc3545" : undefined });

  // ════════════════════════════════════════════════════════════════════════════
  // STEP 1 — FORM
  // ════════════════════════════════════════════════════════════════════════════
  if (step === 1) {
    return (
      <>
        <style>{printCSS}</style>
        <div className="container-fluid py-3 no-print" style={{ maxWidth: 1060 }}>

          {/* Page header */}
          <div className="d-flex align-items-center gap-2 mb-3">
            <div style={{
              background: "#1a3a5c", color: "#fff", borderRadius: 8,
              padding: "7px 13px", fontWeight: "bold", fontSize: 13, letterSpacing: 1,
            }}>📦 PURCHASE BILL</div>
            <div style={{ fontSize: 13, color: "#555" }}>— BIP Fencing Contract Work</div>
          </div>

          <form onSubmit={handleSubmit}>

            {/* ── Bill Details ── */}
            <div className="card shadow-sm mb-3" style={{ border: "1px solid #dde3ea" }}>
              <div className="card-header py-2" style={{ background: "#f7f9fc", borderBottom: "1px solid #dde3ea" }}>
                <strong style={{ fontSize: 13 }}>🧾 Bill Details</strong>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Bill No *</label>
                    <input className="form-control form-control-sm" name="billNo" value={form.billNo}
                      onChange={handleChange} style={errStyle("billNo")} placeholder="BILL-001" />
                    {errors.billNo && <div className="text-danger" style={{ fontSize: 11 }}>{errors.billNo}</div>}
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Bill Date *</label>
                    <input type="date" className="form-control form-control-sm" name="billDate"
                      value={form.billDate} onChange={handleChange} style={errStyle("billDate")} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Payment Mode</label>
                    <select className="form-select form-select-sm" name="paymentMode" value={form.paymentMode} onChange={handleChange}>
                      {["Cash", "UPI", "Bank Transfer", "Cheque", "Credit"].map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Paid Amount (₹)</label>
                    <input type="number" className="form-control form-control-sm" name="paidAmount"
                      value={form.paidAmount} onChange={handleChange} placeholder="0.00" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Discount (%)</label>
                    <input type="number" className="form-control form-control-sm" name="discount"
                      value={form.discount} onChange={handleChange} min="0" max="100" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Supplier Details ── */}
            <div className="card shadow-sm mb-3" style={{ border: "1px solid #dde3ea" }}>
              <div className="card-header py-2" style={{ background: "#f7f9fc", borderBottom: "1px solid #dde3ea" }}>
                <strong style={{ fontSize: 13 }}>🏭 Supplier Details</strong>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Supplier Name *</label>
                    <input className="form-control form-control-sm" name="supplierName" value={form.supplierName}
                      onChange={handleChange} style={errStyle("supplierName")} placeholder="Supplier company name" />
                    {errors.supplierName && <div className="text-danger" style={{ fontSize: 11 }}>{errors.supplierName}</div>}
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold" style={{ fontSize: 12 }}>GST No (Supplier)</label>
                    <input className="form-control form-control-sm" name="supplierGST" value={form.supplierGST}
                      onChange={handleChange} placeholder="33XXXXX..." />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Phone</label>
                    <input className="form-control form-control-sm" name="supplierPhone" value={form.supplierPhone}
                      onChange={handleChange} placeholder="9XXXXXXXXX" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Address</label>
                    <textarea className="form-control form-control-sm" rows={2} name="supplierAddress"
                      value={form.supplierAddress} onChange={handleChange} placeholder="Supplier full address" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold" style={{ fontSize: 12 }}>State</label>
                    <input className="form-control form-control-sm" name="supplierState" value={form.supplierState} onChange={handleChange} />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-semibold" style={{ fontSize: 12 }}>State Code</label>
                    <input className="form-control form-control-sm" name="supplierStateCode" value={form.supplierStateCode} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Transport ── */}
            <div className="card shadow-sm mb-3" style={{ border: "1px solid #dde3ea" }}>
              <div className="card-header py-2" style={{ background: "#f7f9fc", borderBottom: "1px solid #dde3ea" }}>
                <strong style={{ fontSize: 13 }}>🚛 Transport Details</strong>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-5">
                    <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Transport / Courier Name</label>
                    <input className="form-control form-control-sm" name="transportName" value={form.transportName} onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Vehicle No</label>
                    <input className="form-control form-control-sm" name="vehicleNo" value={form.vehicleNo} onChange={handleChange} placeholder="TN XX XX XXXX" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Items ── */}
            <div className="card shadow-sm mb-3" style={{ border: "1px solid #dde3ea" }}>
              <div className="card-header py-2 d-flex justify-content-between align-items-center"
                style={{ background: "#f7f9fc", borderBottom: "1px solid #dde3ea" }}>
                <strong style={{ fontSize: 13 }}>📋 Purchased Items</strong>
                <button type="button" className="btn btn-sm text-white"
                  style={{ background: "#1a3a5c", fontSize: 12 }} onClick={addItem}>
                  + Add Item
                </button>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-bordered table-sm mb-0" style={{ fontSize: 12 }}>
                    <thead style={{ background: "#1a3a5c", color: "#fff" }}>
                      <tr>
                        <th style={{ width: 32, textAlign: "center" }}>#</th>
                        <th>Description</th>
                        <th style={{ width: 80 }}>HSN/SAC</th>
                        <th style={{ width: 70 }}>Qty</th>
                        <th style={{ width: 60 }}>Unit</th>
                        <th style={{ width: 100 }}>Rate (₹)</th>
                        <th style={{ width: 70 }}>GST %</th>
                        <th style={{ width: 100 }}>Amount (₹)</th>
                        <th style={{ width: 38 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.items.map((it, i) => {
                        const amt = (parseFloat(it.qty) || 0) * (parseFloat(it.rate) || 0);
                        return (
                          <tr key={i}>
                            <td className="text-center align-middle">{i + 1}</td>
                            <td>
                              <input className="form-control form-control-sm" value={it.description}
                                onChange={(e) => handleItemChange(i, "description", e.target.value)}
                                placeholder="Item name" />
                            </td>
                            <td>
                              <input className="form-control form-control-sm" value={it.hsn}
                                onChange={(e) => handleItemChange(i, "hsn", e.target.value)} />
                            </td>
                            <td>
                              <input type="number" min="0" className="form-control form-control-sm" value={it.qty}
                                onChange={(e) => handleItemChange(i, "qty", e.target.value)} />
                            </td>
                            <td>
                              <select className="form-select form-select-sm" value={it.unit}
                                onChange={(e) => handleItemChange(i, "unit", e.target.value)}>
                                {["Nos", "KGS", "MTR", "SQM", "PCS", "SET", "LTR", "RFT"].map((u) => <option key={u}>{u}</option>)}
                              </select>
                            </td>
                            <td>
                              <input type="number" min="0" step="0.01" className="form-control form-control-sm" value={it.rate}
                                onChange={(e) => handleItemChange(i, "rate", e.target.value)} />
                            </td>
                            <td>
                              <select className="form-select form-select-sm" value={it.gst}
                                onChange={(e) => handleItemChange(i, "gst", e.target.value)}>
                                {[0, 5, 12, 18, 28].map((g) => <option key={g} value={g}>{g}%</option>)}
                              </select>
                            </td>
                            <td className="text-end align-middle fw-semibold">₹ {fmt(amt)}</td>
                            <td className="text-center align-middle">
                              <button type="button" className="btn btn-sm btn-outline-danger"
                                onClick={() => removeItem(i)} disabled={form.items.length === 1}>✕</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Summary */}
              <div className="card-footer d-flex justify-content-end" style={{ background: "#f7f9fc" }}>
                <div style={{ minWidth: 260, fontSize: 13 }}>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Subtotal</span>
                    <span className="fw-semibold">₹ {fmt(subtotal)}</span>
                  </div>
                  {parseFloat(form.discount) > 0 && (
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Discount ({form.discount}%)</span>
                      <span className="text-danger">– ₹ {fmt(discountAmt)}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Taxable Value</span>
                    <span className="fw-semibold">₹ {fmt(taxable)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Total GST</span>
                    <span className="fw-semibold">₹ {fmt(totalGSTFinal)}</span>
                  </div>
                  <div className="d-flex justify-content-between border-top pt-1 mt-1">
                    <span className="fw-bold fs-6">Grand Total</span>
                    <span className="fw-bold fs-6" style={{ color: "#1a3a5c" }}>₹ {fmt(grandTotal)}</span>
                  </div>
                  {paidAmount > 0 && (
                    <div className="d-flex justify-content-between mt-1">
                      <span className="text-muted">Balance Due</span>
                      <span className="fw-semibold text-danger">₹ {fmt(balance)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Notes ── */}
            <div className="card shadow-sm mb-3" style={{ border: "1px solid #dde3ea" }}>
              <div className="card-header py-2" style={{ background: "#f7f9fc", borderBottom: "1px solid #dde3ea" }}>
                <strong style={{ fontSize: 13 }}>📝 Notes</strong>
              </div>
              <div className="card-body">
                <textarea className="form-control form-control-sm" rows={2} name="notes"
                  value={form.notes} onChange={handleChange} placeholder="Additional notes..." />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mb-4">
              <button type="button" className="btn btn-outline-secondary"
                onClick={() => setForm({ ...form, billNo: "", billDate: new Date().toISOString().split("T")[0], supplierName: "", supplierGST: "", supplierPhone: "", supplierAddress: "", paidAmount: "", discount: 0, notes: "", items: [emptyItem()] })}>
                Reset
              </button>
              <button type="submit" className="btn text-white px-4"
                style={{ background: "#1a3a5c" }}>
                Preview Bill →
              </button>
            </div>

          </form>
        </div>
      </>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // STEP 2 — PURCHASE BILL PREVIEW + PRINT
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <>
      <style>{printCSS}</style>

      {/* Action Bar */}
      <div className="no-print py-3 d-flex justify-content-center gap-3">
        <button className="btn btn-outline-secondary px-4" onClick={() => setStep(1)}>✏️ Edit</button>
        <button className="btn text-white px-4" style={{ background: "#1a3a5c" }} onClick={() => window.print()}>
          🖨️ Confirm &amp; Print
        </button>
      </div>

      {/* ═══════════════════════════════════
          PRINTABLE PURCHASE BILL
      ═══════════════════════════════════ */}
      <div
        id="pb-invoice-print"
        style={{
          maxWidth: 900,
          margin: "0 auto 30px",
          fontFamily: "'Times New Roman', Times, serif",
          color: "#000",
          background: "#fff",
          border: "2px solid #000",
        }}
      >
        {/* Copy label */}
        <div style={{ textAlign: "right", padding: "3px 10px 2px", fontStyle: "italic", fontSize: 11, borderBottom: "1px solid #bbb" }}>
          (ORIGINAL FOR RECIPIENT)
        </div>

        {/* ── HEADER ── */}
        <table style={{ width: "100%", borderCollapse: "collapse", borderBottom: "2px solid #000" }}>
          <tbody>
            <tr>
              {/* Logo box */}
              <td style={{ width: 80, borderRight: "1px solid #000", padding: 6, textAlign: "center", verticalAlign: "middle" }}>
                <div style={{
                  width: 66, height: 66, border: "2px solid #000",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: "bold", fontSize: 10, textAlign: "center", lineHeight: 1.3,
                }}>
                  BIP<br />FENCING
                </div>
              </td>
              {/* Company info */}
              <td style={{ padding: "6px 14px", textAlign: "center", verticalAlign: "middle" }}>
                <div style={{ fontSize: 20, fontWeight: "bold", letterSpacing: 2, textTransform: "uppercase" }}>
                  {COMPANY.name}
                </div>
                <div style={{ fontSize: 12, marginTop: 2 }}>{COMPANY.address}</div>
                <div style={{ fontSize: 12 }}>
                  GSTIN/UIN: <strong>{COMPANY.gst}</strong>&nbsp;&nbsp;
                  State: {COMPANY.state}, Code: {COMPANY.stateCode}
                </div>
                <div style={{ fontSize: 12 }}>Ph: {COMPANY.phone}</div>
              </td>
              {/* PURCHASE BILL badge */}
              <td style={{ width: 110, borderLeft: "1px solid #000", padding: 6, textAlign: "center", verticalAlign: "middle" }}>
                <div style={{
                  border: "2px solid #000", padding: "6px 4px",
                  fontWeight: "bold", fontSize: 13, textTransform: "uppercase", lineHeight: 1.3,
                }}>
                  PURCHASE<br />BILL
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* ── SUPPLIER + BILL META ── */}
        <table style={{ width: "100%", borderCollapse: "collapse", borderBottom: "1px solid #000" }}>
          <tbody>
            <tr>
              {/* Supplier */}
              <td style={{ width: "52%", borderRight: "1px solid #000", padding: "6px 8px", verticalAlign: "top" }}>
                <div style={{ fontWeight: "bold", fontSize: 11, textTransform: "uppercase", borderBottom: "1px dashed #999", paddingBottom: 2, marginBottom: 3 }}>
                  Supplier Details
                </div>
                <div style={{ fontWeight: "bold", fontSize: 13 }}>{form.supplierName}</div>
                {form.supplierAddress && <div style={{ fontSize: 12 }}>{form.supplierAddress}</div>}
                {form.supplierPhone && <div style={{ fontSize: 12 }}>Ph: {form.supplierPhone}</div>}
                {form.supplierGST && <div style={{ fontSize: 12 }}>GSTIN/UIN: {form.supplierGST}</div>}
                <div style={{ fontSize: 12 }}>
                  State: {form.supplierState}, Code: {form.supplierStateCode}
                </div>
              </td>
              {/* Bill Meta */}
              <td style={{ padding: "6px 8px", verticalAlign: "top" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <tbody>
                    {[
                      ["Bill No.", form.billNo],
                      ["Bill Date", fmtDate(form.billDate)],
                      ["Payment Mode", form.paymentMode],
                      form.transportName ? ["Transport", form.transportName] : null,
                      form.vehicleNo ? ["Vehicle No.", form.vehicleNo] : null,
                    ].filter(Boolean).map(([k, v]) => (
                      <tr key={k}>
                        <td style={{ fontWeight: "bold", width: "45%", paddingBottom: 3, fontSize: 11 }}>{k}</td>
                        <td style={{ paddingBottom: 3 }}>: {v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        {/* ── PRODUCT TABLE ── */}
        <table style={{ width: "100%", borderCollapse: "collapse", borderBottom: "1px solid #000" }}>
          <thead>
            <tr style={{ background: "#e8e8e8" }}>
              {[
                { label: "Sl\nNo.", w: 30, align: "center" },
                { label: "Description of Goods", align: "left" },
                { label: "HSN/\nSAC", w: 65, align: "center" },
                { label: "Qty", w: 55, align: "center" },
                { label: "Unit", w: 45, align: "center" },
                { label: "Rate (₹)", w: 80, align: "right" },
                { label: "GST\n(%)", w: 45, align: "center" },
                { label: "Amount (₹)", w: 95, align: "right" },
              ].map((c) => (
                <th key={c.label} style={{ ...cell({ background: "#e8e8e8", whiteSpace: "pre-line", textAlign: c.align, fontSize: 11 }), width: c.w }}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={cell({ textAlign: "center" })}>{i + 1}</td>
                <td style={cell()}><strong>{r.description}</strong></td>
                <td style={cell({ textAlign: "center" })}>{r.hsn || "–"}</td>
                <td style={cell({ textAlign: "center" })}>{r.qty}</td>
                <td style={cell({ textAlign: "center" })}>{r.unit}</td>
                <td style={cell({ textAlign: "right" })}>{fmt(r.rate)}</td>
                <td style={cell({ textAlign: "center" })}>{r.gstPct}%</td>
                <td style={cell({ textAlign: "right" })}>{fmt(r.baseAmt)}</td>
              </tr>
            ))}
            {/* blank fillers */}
            {rows.length < 5 &&
              Array.from({ length: 5 - rows.length }).map((_, i) => (
                <tr key={`b${i}`} style={{ height: 22 }}>
                  {Array(8).fill(null).map((__, j) => <td key={j} style={cell()}>&nbsp;</td>)}
                </tr>
              ))}
            {/* Totals section */}
            <tr>
              <td colSpan={7} style={cell({ textAlign: "right", fontStyle: "italic", fontWeight: "bold" })}>Sub Total</td>
              <td style={cell({ textAlign: "right" })}>₹ {fmt(subtotal)}</td>
            </tr>
            {parseFloat(form.discount) > 0 && (
              <tr>
                <td colSpan={7} style={cell({ textAlign: "right", fontStyle: "italic" })}>Discount ({form.discount}%)</td>
                <td style={cell({ textAlign: "right" })}>– ₹ {fmt(discountAmt)}</td>
              </tr>
            )}
            <tr>
              <td colSpan={7} style={cell({ textAlign: "right", fontStyle: "italic", fontWeight: "bold" })}>CGST Tax</td>
              <td style={cell({ textAlign: "right" })}>₹ {fmt(totalGSTFinal / 2)}</td>
            </tr>
            <tr>
              <td colSpan={7} style={cell({ textAlign: "right", fontStyle: "italic", fontWeight: "bold" })}>SGST Tax</td>
              <td style={cell({ textAlign: "right" })}>₹ {fmt(totalGSTFinal / 2)}</td>
            </tr>
            {/* Grand total row */}
            <tr style={{ background: "#000", color: "#fff" }}>
              <td colSpan={3} style={{ ...cell({ background: "#000", color: "#fff", fontWeight: "bold", fontSize: 13 }), border: "1px solid #000" }}>
                Total
              </td>
              <td style={{ ...cell({ background: "#000", color: "#fff", textAlign: "center", fontWeight: "bold" }), border: "1px solid #000" }}>
                {rows.reduce((s, r) => s + r.qty, 0)}
              </td>
              <td style={{ ...cell({ background: "#000", color: "#fff" }), border: "1px solid #000" }}></td>
              <td style={{ ...cell({ background: "#000", color: "#fff" }), border: "1px solid #000" }}></td>
              <td style={{ ...cell({ background: "#000", color: "#fff" }), border: "1px solid #000" }}></td>
              <td style={{ ...cell({ background: "#000", color: "#fff", textAlign: "right", fontWeight: "bold", fontSize: 13 }), border: "1px solid #000" }}>
                ₹ {fmt(grandTotal)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* ── AMOUNT IN WORDS + GRAND TOTAL ── */}
        <table style={{ width: "100%", borderCollapse: "collapse", borderBottom: "1px solid #000" }}>
          <tbody>
            <tr>
              <td style={{ width: "55%", borderRight: "1px solid #000", padding: "6px 8px", verticalAlign: "top", fontSize: 12 }}>
                <div style={{ fontWeight: "bold", marginBottom: 3 }}>Amount Chargeable (in words)</div>
                <div style={{ fontStyle: "italic", fontSize: 13 }}>{amountInWords(grandTotal)}</div>
              </td>
              <td style={{ padding: "6px 8px", verticalAlign: "middle" }}>
                <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: "bold" }}>Taxable Value</td>
                      <td style={{ textAlign: "right" }}>₹ {fmt(taxable)}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold" }}>Total GST</td>
                      <td style={{ textAlign: "right" }}>₹ {fmt(totalGSTFinal)}</td>
                    </tr>
                    <tr style={{ borderTop: "1px solid #000" }}>
                      <td style={{ fontWeight: "bold", fontSize: 14 }}>Grand Total</td>
                      <td style={{ textAlign: "right", fontWeight: "bold", fontSize: 16 }}>₹ {fmt(grandTotal)}</td>
                    </tr>
                    {paidAmount > 0 && <>
                      <tr>
                        <td style={{ color: "#444" }}>Paid Amount</td>
                        <td style={{ textAlign: "right" }}>₹ {fmt(paidAmount)}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: "bold" }}>Balance Due</td>
                        <td style={{ textAlign: "right", fontWeight: "bold", color: balance > 0 ? "#c00" : "#080" }}>₹ {fmt(balance)}</td>
                      </tr>
                    </>}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        {/* ── HSN/SAC TAX SUMMARY TABLE ── */}
        <table style={{ width: "100%", borderCollapse: "collapse", borderBottom: "1px solid #000" }}>
          <thead>
            <tr style={{ background: "#e8e8e8" }}>
              {["HSN/SAC", "Taxable\nValue", "CGST\nRate", "CGST\nAmount", "SGST/UTGST\nRate", "SGST/UTGST\nAmount", "Total Tax\nAmount"].map((h) => (
                <th key={h} style={cell({ textAlign: "center", fontSize: 11, whiteSpace: "pre-line", background: "#e8e8e8" })}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(hsnGroups).map(([hsn, d]) => (
              <tr key={hsn}>
                <td style={cell({ textAlign: "center" })}>{hsn}</td>
                <td style={cell({ textAlign: "right" })}>{fmt(d.taxable)}</td>
                <td style={cell({ textAlign: "center" })}>{d.cgstRate}%</td>
                <td style={cell({ textAlign: "right" })}>{fmt(d.cgst)}</td>
                <td style={cell({ textAlign: "center" })}>{d.sgstRate}%</td>
                <td style={cell({ textAlign: "right" })}>{fmt(d.sgst)}</td>
                <td style={cell({ textAlign: "right" })}>{fmt(d.cgst + d.sgst)}</td>
              </tr>
            ))}
            <tr style={{ fontWeight: "bold", background: "#f5f5f5" }}>
              <td style={cell()}>Total</td>
              <td style={cell({ textAlign: "right" })}>{fmt(taxable)}</td>
              <td style={cell()}></td>
              <td style={cell({ textAlign: "right" })}>{fmt(totalGSTFinal / 2)}</td>
              <td style={cell()}></td>
              <td style={cell({ textAlign: "right" })}>{fmt(totalGSTFinal / 2)}</td>
              <td style={cell({ textAlign: "right" })}>{fmt(totalGSTFinal)}</td>
            </tr>
          </tbody>
        </table>

        {/* Tax in words */}
        <div style={{ padding: "3px 8px", borderBottom: "1px solid #000", fontSize: 12 }}>
          <strong>Tax Amount (in words):</strong>&nbsp;
          <em>{amountInWords(totalGSTFinal)}</em>
        </div>

        {/* ── FOOTER ── */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              {/* Declaration + Notes */}
              <td style={{ width: "55%", borderRight: "1px solid #000", padding: "6px 8px", verticalAlign: "top", fontSize: 12 }}>
                {form.notes && (
                  <div style={{ marginBottom: 6 }}>
                    <strong>Notes:</strong> {form.notes}
                  </div>
                )}
                <div style={{ fontSize: 11 }}>
                  <strong>Declaration:</strong> {DECLARATION}
                </div>
              </td>
              {/* Signatures */}
              <td style={{ padding: "6px 8px", verticalAlign: "top" }}>
                <div style={{ textAlign: "right", fontWeight: "bold", fontSize: 12, marginBottom: 2 }}>
                  for {COMPANY.name}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 44 }}>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ borderTop: "1px solid #000", paddingTop: 4, fontSize: 12 }}>
                      Receiver's Signature
                    </div>
                  </div>
                  <div style={{ flex: 0.2 }}></div>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ borderTop: "1px solid #000", paddingTop: 4, fontSize: 12 }}>
                      Authorised Signatory
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "center", marginTop: 8, fontSize: 10, color: "#666" }}>
                  This is a Computer Generated Bill
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bottom actions */}
      <div className="no-print d-flex justify-content-center gap-3 pb-4">
        <button className="btn btn-outline-secondary px-4" onClick={() => setStep(1)}>✏️ Edit</button>
        <button className="btn text-white px-4" style={{ background: "#1a3a5c" }} onClick={() => window.print()}>
          🖨️ Confirm &amp; Print
        </button>
      </div>
    </>
  );
}