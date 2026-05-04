// import { useState } from 'react';

// const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// const COMPANY = {
//   name: 'BIP FENCING CONTRACT WORK',
//   address: 'NO. 26/A, MAIN ROAD, PAMBANKULAM,\nKALANTHAPANAI, PANAGUDI-627109',
//   gstin: '33ABLPI5244C1Z1',
//   state: 'Tamil Nadu',
//   stateCode: '33',
// };

// const emptyForm = {
//   quoteNo: '', quoteDate: '', validUntil: '', clientName: '', clientPhone: '', clientEmail: '',
//   items: [{ description: '', qty: 1, rate: 0 }],
//   taxPercent: 5, discount: 0, notes: '',
// };

// const SEED = [
//   {
//     id: 1, quoteNo: 'QT-0001', quoteDate: '2026-04-01', validUntil: '2026-04-15',
//     clientName: 'Suresh Kumar', clientPhone: '+91 98765 43210', clientEmail: 'suresh@gmail.com',
//     items: [{ description: 'Chain Link Fencing (50m)', qty: 2, rate: 4500 }, { description: 'GI Post Installation', qty: 10, rate: 650 }],
//     taxPercent: 18, discount: 5, notes: 'Payment within 7 days of delivery.',
//   },
//   {
//     id: 2, quoteNo: 'QT-0002', quoteDate: '2026-04-10', validUntil: '2026-04-25',
//     clientName: 'Priya Nair', clientPhone: '+91 87654 32109', clientEmail: 'priya@email.com',
//     items: [{ description: 'PVC Fence Panels (10 units)', qty: 10, rate: 1800 }, { description: 'Labour Charges', qty: 1, rate: 3000 }],
//     taxPercent: 12, discount: 0, notes: '',
//   },
//   {
//     id: 3, quoteNo: 'QT-0003', quoteDate: '2026-04-20', validUntil: '2026-05-05',
//     clientName: 'Rajesh Mehta', clientPhone: '+91 76543 21098', clientEmail: 'rajesh@corp.in',
//     items: [{ description: 'Iron Gate (6ft, MS)', qty: 1, rate: 8200 }, { description: 'Welding & Finishing', qty: 1, rate: 2500 }],
//     taxPercent: 18, discount: 10, notes: 'Site visit required before installation.',
//   },
// ];

// function calcTotals(form) {
//   const subtotal     = form.items.reduce((s, it) => s + Number(it.qty) * Number(it.rate), 0);
//   const discountAmt  = (subtotal * Number(form.discount)) / 100;
//   const taxableAmt   = subtotal - discountAmt;
//   const halfTax      = (taxableAmt * Number(form.taxPercent)) / 200; // split equally CGST/SGST
//   const taxAmt       = halfTax * 2;
//   const total        = taxableAmt + taxAmt;
//   return { subtotal, discountAmt, taxableAmt, halfTax, taxAmt, total };
// }

// const inr = (v) => `₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
// const inrPlain = (v) => Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 });

// const fmtDate = (d) => {
//   if (!d) return '—';
//   const [y, m, day] = d.split('-');
//   return `${day}-${m}-${y}`;
// };

// // Convert number to words (Indian system)
// function toWords(num) {
//   const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine',
//     'Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
//   const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
//   if (num === 0) return 'Zero';
//   function helper(n) {
//     if (n < 20) return ones[n];
//     if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? ' ' + ones[n%10] : '');
//     if (n < 1000) return ones[Math.floor(n/100)] + ' Hundred' + (n%100 ? ' ' + helper(n%100) : '');
//     if (n < 100000) return helper(Math.floor(n/1000)) + ' Thousand' + (n%1000 ? ' ' + helper(n%1000) : '');
//     if (n < 10000000) return helper(Math.floor(n/100000)) + ' Lakh' + (n%100000 ? ' ' + helper(n%100000) : '');
//     return helper(Math.floor(n/10000000)) + ' Crore' + (n%10000000 ? ' ' + helper(n%10000000) : '');
//   }
//   const intPart = Math.floor(num);
//   const decPart = Math.round((num - intPart) * 100);
//   let result = 'INR ' + helper(intPart) + ' Only';
//   if (decPart > 0) result = 'INR ' + helper(intPart) + ' and ' + helper(decPart) + ' Paise Only';
//   return result;
// }

// function handlePrint(rec) {
//   const t = calcTotals(rec);
//   const totalQty = rec.items.reduce((s, it) => s + Number(it.qty), 0);

//   const html = `<!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8"/>
//   <title>Quotation ${rec.quoteNo}</title>
//   <style>
//     *{margin:0;padding:0;box-sizing:border-box;}
//     body{font-family:'Times New Roman',serif;font-size:11px;color:#000;background:#fff;padding:10mm;}
//     .page{width:190mm;margin:auto;border:1px solid #333;}

//     /* Header */
//     .header{display:flex;border-bottom:1px solid #333;}
//     .header-left{flex:1;padding:8px 12px;border-right:1px solid #333;}
//     .header-center{width:120px;display:flex;align-items:center;justify-content:center;border-right:1px solid #333;padding:8px;}
//     .header-right{flex:1;padding:8px 12px;}
//     .company-name{font-size:13px;font-weight:bold;text-transform:uppercase;margin-bottom:3px;}
//     .company-addr{font-size:10px;line-height:1.5;margin-bottom:3px;}
//     .title-box{text-align:center;}
//     .title-box h2{font-size:14px;font-weight:bold;letter-spacing:1px;}
//     .title-box p{font-size:9px;color:#555;margin-top:2px;}
//     .inv-grid{display:grid;grid-template-columns:1fr 1fr;font-size:10px;gap:0;}
//     .inv-row{display:flex;border-bottom:1px solid #ccc;padding:3px 0;}
//     .inv-row:last-child{border-bottom:none;}
//     .inv-lbl{color:#555;width:95px;flex-shrink:0;}
//     .inv-val{font-weight:600;}

//     /* Client */
//     .client-section{display:flex;border-bottom:1px solid #333;}
//     .client-box{flex:1;padding:7px 12px;border-right:1px solid #333;}
//     .client-box:last-child{border-right:none;}
//     .section-lbl{font-size:9.5px;font-weight:bold;text-transform:uppercase;color:#444;margin-bottom:4px;letter-spacing:.5px;}
//     .client-name{font-size:11px;font-weight:bold;margin-bottom:2px;}
//     .client-detail{font-size:10px;line-height:1.6;}

//     /* Items table */
//     .items-section{border-bottom:1px solid #333;}
//     .items-table{width:100%;border-collapse:collapse;}
//     .items-table th{background:#f0f0f0;border:1px solid #888;padding:5px 7px;font-size:10px;text-align:center;font-weight:bold;}
//     .items-table td{border:1px solid #bbb;padding:5px 7px;font-size:10.5px;vertical-align:top;}
//     .items-table .desc{text-align:left;}
//     .items-table .num{text-align:right;}
//     .items-table .center{text-align:center;}

//     /* Totals area */
//     .totals-section{display:flex;border-bottom:1px solid #333;}
//     .words-box{flex:1;padding:8px 12px;border-right:1px solid #333;}
//     .words-lbl{font-size:9.5px;font-weight:bold;text-transform:uppercase;color:#444;margin-bottom:5px;}
//     .words-val{font-size:10.5px;font-style:italic;}
//     .amounts-box{width:240px;padding:0;}
//     .amt-row{display:flex;justify-content:space-between;padding:4px 12px;border-bottom:1px solid #eee;font-size:10.5px;}
//     .amt-row:last-child{border-bottom:none;background:#fef9f5;font-weight:bold;font-size:11.5px;}
//     .amt-row.subtotal{background:#fafafa;}
//     .amt-label{color:#444;}
//     .amt-value{font-weight:600;}
//     .amt-total-val{color:#8b2200;font-weight:bold;}
//     .grand-total-row{display:flex;justify-content:space-between;padding:6px 12px;background:#fef9f5;font-weight:bold;font-size:12px;border-top:2px solid #333;}
//     .grand-total-row .amt-total-val{color:#8b2200;}

//     /* Tax table */
//     .tax-section{border-bottom:1px solid #333;padding:8px 12px;}
//     .tax-table{width:100%;border-collapse:collapse;margin-top:4px;}
//     .tax-table th{background:#f5f5f5;border:1px solid #999;padding:4px 8px;font-size:9.5px;text-align:center;}
//     .tax-table td{border:1px solid #ccc;padding:4px 8px;font-size:10px;text-align:right;}
//     .tax-table td.center{text-align:center;}
//     .tax-lbl{font-size:9.5px;font-weight:bold;text-transform:uppercase;color:#444;margin-bottom:4px;letter-spacing:.5px;}

//     /* Notes & sign */
//     .bottom-section{display:flex;border-bottom:1px solid #333;}
//     .notes-box{flex:1;padding:8px 12px;border-right:1px solid #333;}
//     .sign-box{width:200px;padding:8px 12px;text-align:center;}
//     .sign-label{font-size:10px;color:#444;margin-bottom:40px;}
//     .sign-line{border-top:1px solid #333;margin-top:10px;padding-top:4px;font-size:10px;font-weight:bold;}

//     /* Footer */
//     .footer{padding:6px 12px;text-align:center;font-size:9px;color:#666;border-top:1px solid #ccc;margin-top:0;}

//     .bold{font-weight:bold;}
//     .orange{color:#bc4c00;}

//     @media print{
//       body{padding:0;}
//       .page{border:1px solid #333;width:100%;}
//     }
//   </style>
// </head>
// <body>
// <div class="page">

//   <!-- ══ HEADER ══ -->
//   <div class="header">
//     <div class="header-left">
//       <div class="company-name">${COMPANY.name}</div>
//       <div class="company-addr">${COMPANY.address.replace(/\n/g,'<br/>')}</div>
//       <div class="company-addr">GSTIN/UIN: <strong>${COMPANY.gstin}</strong></div>
//       <div class="company-addr">State Name: ${COMPANY.state}, Code: ${COMPANY.stateCode}</div>
//     </div>
//     <div class="header-center">
//       <div class="title-box">
//         <h2>Quotation</h2>
//         <p>Tax Invoice</p>
//       </div>
//     </div>
//     <div class="header-right">
//       <div class="inv-grid">
//         <div class="inv-row"><span class="inv-lbl">Quote No.</span><span class="inv-val">${rec.quoteNo}</span></div>
//         <div class="inv-row"><span class="inv-lbl">Dated</span><span class="inv-val">${fmtDate(rec.quoteDate)}</span></div>
//         <div class="inv-row"><span class="inv-lbl">Valid Until</span><span class="inv-val">${fmtDate(rec.validUntil)}</span></div>
//       </div>
//     </div>
//   </div>

//   <!-- ══ CLIENT ══ -->
//   <div class="client-section">
//     <div class="client-box">
//       <div class="section-lbl">Bill To / Consignee</div>
//       <div class="client-name">${rec.clientName}</div>
//       ${rec.clientPhone ? `<div class="client-detail">Phone: ${rec.clientPhone}</div>` : ''}
//       ${rec.clientEmail ? `<div class="client-detail">Email: ${rec.clientEmail}</div>` : ''}
//       <div class="client-detail">State Name: Tamil Nadu, Code: 33</div>
//     </div>
//     <div class="client-box">
//       <div class="section-lbl">Quotation Info</div>
//       <div class="client-detail">Quote Date: <strong>${fmtDate(rec.quoteDate)}</strong></div>
//       <div class="client-detail">Valid Until: <strong>${fmtDate(rec.validUntil)}</strong></div>
//       <div class="client-detail">Discount: <strong>${rec.discount}%</strong></div>
//       <div class="client-detail">Tax: <strong>${rec.taxPercent}%</strong> (CGST ${rec.taxPercent/2}% + SGST ${rec.taxPercent/2}%)</div>
//     </div>
//   </div>

//   <!-- ══ ITEMS ══ -->
//   <div class="items-section">
//     <table class="items-table">
//       <thead>
//         <tr>
//           <th style="width:35px">Sl No.</th>
//           <th>Description of Goods / Services</th>
//           <th style="width:65px">Quantity</th>
//           <th style="width:90px">Rate (INR)</th>
//           <th style="width:100px">Amount (INR)</th>
//         </tr>
//       </thead>
//       <tbody>
//         ${rec.items.map((it, i) => `
//         <tr>
//           <td class="center">${i+1}</td>
//           <td class="desc">${it.description || '—'}</td>
//           <td class="center">${it.qty} Nos</td>
//           <td class="num">${inrPlain(it.rate)}</td>
//           <td class="num">${inrPlain(Number(it.qty)*Number(it.rate))}</td>
//         </tr>`).join('')}
//         <!-- empty padding rows -->
//         ${rec.items.length < 6 ? Array(6-rec.items.length).fill('<tr><td>&nbsp;</td><td></td><td></td><td></td><td></td></tr>').join('') : ''}
//         <tr>
//           <td colspan="2" style="text-align:right;font-weight:bold;background:#fafafa;">
//             CGST Tax &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//             <br/>SGST Tax
//           </td>
//           <td class="center" style="font-weight:bold;">${totalQty} Nos</td>
//           <td></td>
//           <td class="num" style="font-weight:bold;">
//             ${inrPlain(t.halfTax)}<br/>${inrPlain(t.halfTax)}
//           </td>
//         </tr>
//         <tr style="background:#fef9f5;">
//           <td colspan="2" style="text-align:right;font-weight:bold;font-size:12px;">Total</td>
//           <td class="center" style="font-weight:bold;">${totalQty} Nos</td>
//           <td></td>
//           <td class="num" style="font-weight:bold;font-size:12px;color:#8b2200;">₹ ${inrPlain(t.total)}</td>
//         </tr>
//       </tbody>
//     </table>
//   </div>

//   <!-- ══ TOTALS + WORDS ══ -->
//   <div class="totals-section">
//     <div class="words-box">
//       <div class="words-lbl">Amount Chargeable (in words)</div>
//       <div class="words-val">${toWords(t.total)}</div>
//       ${rec.discount > 0 ? `<div style="margin-top:8px;font-size:9.5px;color:#555;">Discount (${rec.discount}%): ₹ ${inrPlain(t.discountAmt)} deducted from subtotal.</div>` : ''}
//     </div>
//     <div class="amounts-box">
//       <div class="amt-row subtotal">
//         <span class="amt-label">Subtotal</span>
//         <span class="amt-value">₹ ${inrPlain(t.subtotal)}</span>
//       </div>
//       ${rec.discount > 0 ? `
//       <div class="amt-row">
//         <span class="amt-label">Discount (${rec.discount}%)</span>
//         <span class="amt-value" style="color:#cf222e;">− ₹ ${inrPlain(t.discountAmt)}</span>
//       </div>` : ''}
//       <div class="amt-row">
//         <span class="amt-label">Taxable Value</span>
//         <span class="amt-value">₹ ${inrPlain(t.taxableAmt)}</span>
//       </div>
//       <div class="amt-row">
//         <span class="amt-label">CGST (${rec.taxPercent/2}%)</span>
//         <span class="amt-value">₹ ${inrPlain(t.halfTax)}</span>
//       </div>
//       <div class="amt-row">
//         <span class="amt-label">SGST (${rec.taxPercent/2}%)</span>
//         <span class="amt-value">₹ ${inrPlain(t.halfTax)}</span>
//       </div>
//       <div class="grand-total-row">
//         <span>Grand Total</span>
//         <span class="amt-total-val">₹ ${inrPlain(t.total)}</span>
//       </div>
//     </div>
//   </div>

//   <!-- ══ TAX TABLE ══ -->
//   <div class="tax-section">
//     <div class="tax-lbl">Tax Amount (in words): <em>${toWords(t.taxAmt)}</em></div>
//     <table class="tax-table" style="margin-top:8px;">
//       <thead>
//         <tr>
//           <th rowspan="2">HSN/SAC</th>
//           <th rowspan="2">Taxable Value</th>
//           <th colspan="2">CGST</th>
//           <th colspan="2">SGST/UTGST</th>
//           <th rowspan="2">Total Tax Amount</th>
//         </tr>
//         <tr>
//           <th>Rate</th><th>Amount</th>
//           <th>Rate</th><th>Amount</th>
//         </tr>
//       </thead>
//       <tbody>
//         <tr>
//           <td class="center">—</td>
//           <td>${inrPlain(t.taxableAmt)}</td>
//           <td class="center">${rec.taxPercent/2}%</td>
//           <td>${inrPlain(t.halfTax)}</td>
//           <td class="center">${rec.taxPercent/2}%</td>
//           <td>${inrPlain(t.halfTax)}</td>
//           <td>${inrPlain(t.taxAmt)}</td>
//         </tr>
//         <tr style="font-weight:bold;background:#f5f5f5;">
//           <td class="center">Total</td>
//           <td>${inrPlain(t.taxableAmt)}</td>
//           <td></td>
//           <td>${inrPlain(t.halfTax)}</td>
//           <td></td>
//           <td>${inrPlain(t.halfTax)}</td>
//           <td>${inrPlain(t.taxAmt)}</td>
//         </tr>
//       </tbody>
//     </table>
//   </div>

//   <!-- ══ NOTES & SIGNATURE ══ -->
//   <div class="bottom-section">
//     <div class="notes-box">
//       <div class="section-lbl">Terms &amp; Notes</div>
//       <div class="client-detail" style="line-height:1.7;">
//         ${rec.notes || 'No additional terms.'}
//       </div>
//       <div style="margin-top:10px;font-size:9.5px;color:#555;">
//         Declaration: We declare that this quotation shows the estimated price of the goods/services described and that all particulars are true and correct.
//       </div>
//     </div>
//     <div class="sign-box">
//       <div class="sign-label">for ${COMPANY.name}</div>
//       <div class="sign-line">Authorised Signatory</div>
//     </div>
//   </div>

//   <!-- ══ FOOTER ══ -->
//   <div class="footer">
//     This is a Computer Generated Quotation &nbsp;|&nbsp; ${COMPANY.name} &nbsp;|&nbsp; GSTIN: ${COMPANY.gstin}
//   </div>

// </div>
// <script>window.onload=()=>{ window.print(); }</script>
// </body>
// </html>`;

//   const win = window.open('', '_blank', 'width=900,height=700');
//   win.document.write(html);
//   win.document.close();
// }

// export default function Quotation() {
//   const [records, setRecords]   = useState(SEED);
//   const [form, setForm]         = useState(emptyForm);
//   const [view, setView]         = useState('form');
//   const [editId, setEditId]     = useState(null);
//   const [deleteId, setDeleteId] = useState(null);
//   const [viewRec, setViewRec]   = useState(null);
//   const [search, setSearch]     = useState('');

//   const { subtotal, discountAmt, taxAmt, total } = calcTotals(form);

//   const handleChange      = (e) => setForm({ ...form, [e.target.name]: e.target.value });
//   const handleItemChange  = (i, field, value) => {
//     const items = [...form.items]; items[i][field] = value; setForm({ ...form, items });
//   };
//   const addItem    = () => setForm({ ...form, items: [...form.items, { description: '', qty: 1, rate: 0 }] });
//   const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });
//   const resetForm  = () => { setForm(emptyForm); setEditId(null); };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (editId !== null) {
//       setRecords(records.map(r => r.id === editId ? { ...form, id: editId } : r));
//       setEditId(null);
//     } else {
//       setRecords([...records, { ...form, id: Date.now() }]);
//     }
//     setForm(emptyForm);
//     setView('table');
//   };

//   const handleEdit = (rec) => {
//     setForm({ ...rec });
//     setEditId(rec.id);
//     setView('form');
//     window.scrollTo(0, 0);
//   };

//   const handleDelete = (id) => {
//     setRecords(records.filter(r => r.id !== id));
//     setDeleteId(null);
//   };

//   const filtered = records.filter(r =>
//     r.clientName.toLowerCase().includes(search.toLowerCase()) ||
//     r.quoteNo.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <>
//       <style>{`
//         /* ── Tabs ── */
//         .qt-tab-bar { display:flex; gap:0; border-bottom:2px solid #e1e8ed; margin-bottom:24px; }
//         .qt-tab {
//           padding:10px 22px; font-size:13.5px; font-weight:600;
//           border:none; background:none; cursor:pointer; color:#57606a;
//           border-bottom:2px solid transparent; margin-bottom:-2px;
//           transition:all .15s; display:flex; align-items:center; gap:6px;
//           font-family:Sora,sans-serif;
//         }
//         .qt-tab.active { color:#bc4c00; border-bottom-color:#bc4c00; }
//         .qt-tab:hover:not(.active) { color:#24292f; background:#f6f8fa; }

//         .client-form-card { background:#fff; border-radius:12px; padding:20px; border:1px solid #e1e8ed; }

//         /* ── Table card ── */
//         .qt-records-card { background:#fff; border-radius:12px; border:1px solid #e1e8ed; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,.06); }

//         .qt-toolbar {
//           display:flex; align-items:center; gap:10px; flex-wrap:wrap;
//           padding:14px 18px; border-bottom:1px solid #e1e8ed; background:#f6f8fa;
//         }
//         .qt-search-wrap { position:relative; flex:1; min-width:180px; }
//         .qt-search-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#8c959f; pointer-events:none; }
//         .qt-search {
//           width:100%; padding:8px 12px 8px 34px; border:1px solid #d0d7de;
//           border-radius:7px; font-size:13px; font-family:Sora,sans-serif;
//           outline:none; background:#fff;
//         }
//         .qt-search:focus { border-color:#bc4c00; box-shadow:0 0 0 3px rgba(188,76,0,.1); }

//         /* Summary strip */
//         .qt-summary { display:flex; gap:0; border-bottom:1px solid #e1e8ed; }
//         .qt-sum-item {
//           flex:1; padding:12px 18px; border-right:1px solid #e1e8ed;
//           display:flex; flex-direction:column; gap:2px;
//         }
//         .qt-sum-item:last-child { border-right:none; }
//         .qt-sum-lbl { font-size:11px; color:#8c959f; text-transform:uppercase; letter-spacing:.06em; font-weight:600; }
//         .qt-sum-val { font-size:15px; font-weight:700; font-family:'JetBrains Mono',monospace; }

//         /* Table */
//         .qt-table-wrap { overflow-x:auto; }
//         .qt-table { width:100%; border-collapse:collapse; font-size:13.5px; }
//         .qt-table thead tr { background:#f6f8fa; }
//         .qt-table th {
//           padding:11px 14px; text-align:left; font-size:11.5px; font-weight:700;
//           text-transform:uppercase; letter-spacing:.07em; color:#57606a;
//           border-bottom:1px solid #e1e8ed; white-space:nowrap;
//         }
//         .qt-table td { padding:12px 14px; border-bottom:1px solid #f3f4f6; vertical-align:middle; color:#24292f; }
//         .qt-table tbody tr:last-child td { border-bottom:none; }
//         .qt-table tbody tr:hover td { background:#fdf7f4; }

//         .qt-client-name { font-weight:600; }
//         .qt-client-sub  { font-size:11.5px; color:#8c959f; margin-top:1px; }
//         .qt-quote-no    { font-family:'JetBrains Mono',monospace; font-weight:700; color:#bc4c00; font-size:12.5px; }
//         .qt-mono        { font-family:'JetBrains Mono',monospace; font-weight:600; }
//         .qt-total-val   { color:#bc4c00; }

//         .qt-date-chip {
//           display:inline-block; padding:3px 10px; border-radius:20px;
//           background:#fef3ec; color:#bc4c00; font-size:11.5px; font-weight:700;
//         }
//         .qt-valid-chip {
//           display:inline-block; padding:3px 10px; border-radius:20px;
//           background:#ddf4e8; color:#1a7f37; font-size:11.5px; font-weight:700;
//         }
//         .qt-expired-chip {
//           display:inline-block; padding:3px 10px; border-radius:20px;
//           background:#fff1f0; color:#cf222e; font-size:11.5px; font-weight:700;
//         }

//         /* Action buttons */
//         .qt-actions { display:flex; gap:5px; flex-wrap:wrap; }
//         .qt-btn-view {
//           display:inline-flex; align-items:center; gap:4px;
//           padding:5px 9px; border-radius:6px; font-size:11.5px; font-weight:600;
//           border:1px solid #d0d7de; background:#f6f8fa; color:#24292f; cursor:pointer;
//           font-family:Sora,sans-serif; transition:all .15s;
//         }
//         .qt-btn-view:hover { background:#fff; border-color:#8c959f; }
//         .qt-btn-edit {
//           display:inline-flex; align-items:center; gap:4px;
//           padding:5px 9px; border-radius:6px; font-size:11.5px; font-weight:600;
//           border:1px solid #d4e9f7; background:#f0f8ff; color:#0969da; cursor:pointer;
//           font-family:Sora,sans-serif; transition:all .15s;
//         }
//         .qt-btn-edit:hover { background:#dbeeff; }
//         .qt-btn-print {
//           display:inline-flex; align-items:center; gap:4px;
//           padding:5px 9px; border-radius:6px; font-size:11.5px; font-weight:600;
//           border:1px solid #d4f7d4; background:#f0fff0; color:#1a7f37; cursor:pointer;
//           font-family:Sora,sans-serif; transition:all .15s;
//         }
//         .qt-btn-print:hover { background:#d0f0d0; }
//         .qt-btn-del {
//           display:inline-flex; align-items:center; gap:4px;
//           padding:5px 9px; border-radius:6px; font-size:11.5px; font-weight:600;
//           border:1px solid #ffd8d3; background:#fff1f0; color:#cf222e; cursor:pointer;
//           font-family:Sora,sans-serif; transition:all .15s;
//         }
//         .qt-btn-del:hover { background:#ffe0db; }

//         /* Empty state */
//         .qt-empty { text-align:center; padding:56px 20px; color:#8c959f; }
//         .qt-empty-icon { font-size:3rem; margin-bottom:12px; }

//         /* ── Modals ── */
//         .qt-modal-backdrop {
//           position:fixed; inset:0; background:rgba(0,0,0,.45);
//           z-index:1000; display:flex; align-items:center; justify-content:center;
//           padding:20px; animation:qt-fade .15s ease;
//         }
//         @keyframes qt-fade { from{opacity:0} to{opacity:1} }
//         @keyframes qt-up   { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }

//         /* Delete modal */
//         .qt-del-modal {
//           background:#fff; border-radius:12px; padding:28px 28px 22px;
//           max-width:380px; width:100%; box-shadow:0 8px 32px rgba(0,0,0,.18);
//           animation:qt-up .18s ease;
//         }
//         .qt-del-icon  { font-size:2.4rem; margin-bottom:10px; }
//         .qt-del-title { font-size:16px; font-weight:700; color:#24292f; margin-bottom:6px; }
//         .qt-del-msg   { font-size:13.5px; color:#57606a; margin-bottom:22px; line-height:1.5; }
//         .qt-del-actions { display:flex; gap:10px; justify-content:flex-end; }
//         .qt-cancel-btn {
//           padding:8px 18px; border:1px solid #d0d7de; border-radius:7px;
//           background:#f6f8fa; color:#24292f; font-size:13px; font-weight:600;
//           cursor:pointer; font-family:Sora,sans-serif;
//         }
//         .qt-cancel-btn:hover { background:#e1e8ed; }
//         .qt-confirm-del {
//           padding:8px 18px; border:none; border-radius:7px;
//           background:#cf222e; color:#fff; font-size:13px; font-weight:600;
//           cursor:pointer; font-family:Sora,sans-serif; transition:background .15s;
//         }
//         .qt-confirm-del:hover { background:#a11423; }

//         /* View modal */
//         .qt-view-modal {
//           background:#fff; border-radius:14px; max-width:600px; width:100%;
//           box-shadow:0 8px 40px rgba(0,0,0,.2); animation:qt-up .18s ease;
//           overflow:hidden; max-height:90vh; display:flex; flex-direction:column;
//         }
//         .qt-view-header {
//           padding:20px 24px 16px;
//           background:linear-gradient(135deg,#bc4c00 0%,#d4682a 100%);
//           color:#fff; flex-shrink:0;
//         }
//         .qt-view-header h3 { font-size:17px; font-weight:700; margin-bottom:2px; }
//         .qt-view-header p  { font-size:12.5px; opacity:.82; }
//         .qt-view-body { padding:20px 24px; overflow-y:auto; display:flex; flex-direction:column; gap:16px; }
//         .qt-view-section { }
//         .qt-view-section-title {
//           font-size:11px; font-weight:700; text-transform:uppercase;
//           letter-spacing:.08em; color:#8c959f; margin-bottom:8px;
//         }
//         .qt-view-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px 16px; }
//         .qt-view-lbl  { font-size:11.5px; color:#8c959f; font-weight:600; }
//         .qt-view-val  { font-size:13.5px; color:#24292f; font-weight:500; margin-top:1px; }

//         .qt-items-table { width:100%; border-collapse:collapse; font-size:13px; }
//         .qt-items-table th {
//           padding:7px 10px; text-align:left; font-size:11px; font-weight:700;
//           text-transform:uppercase; letter-spacing:.07em; color:#57606a;
//           border-bottom:1px solid #e1e8ed; background:#f6f8fa;
//         }
//         .qt-items-table td { padding:9px 10px; border-bottom:1px solid #f3f4f6; color:#24292f; }
//         .qt-items-table tr:last-child td { border-bottom:none; }

//         .qt-view-amounts {
//           background:#f6f8fa; border-radius:10px; padding:14px 16px;
//           display:flex; flex-direction:column; gap:7px;
//         }
//         .qt-view-row { display:flex; justify-content:space-between; font-size:13.5px; }
//         .qt-view-divider { height:1px; background:#d0d7de; margin:4px 0; }
//         .qt-view-net { font-weight:700; font-size:15px; }

//         .qt-view-footer {
//           padding:14px 24px; border-top:1px solid #e1e8ed;
//           display:flex; justify-content:flex-end; flex-shrink:0;
//         }
//         .qt-close-btn {
//           padding:8px 20px; border:1px solid #d0d7de; border-radius:7px;
//           background:#f6f8fa; color:#24292f; font-weight:600; font-size:13px;
//           cursor:pointer; font-family:Sora,sans-serif;
//         }

//         /* Form buttons */
//         .qt-submit-btn {
//           background:#bc4c00; border:none; color:white;
//           padding:10px 24px; border-radius:8px; font-family:Sora,sans-serif;
//           font-size:14px; font-weight:600; cursor:pointer;
//           display:inline-flex; align-items:center; gap:7px; transition:background .15s;
//         }
//         .qt-submit-btn:hover { background:#953c00; }
//         .btn-reset {
//           padding:10px 20px; border-radius:8px; border:1px solid #d0d7de;
//           background:#f6f8fa; color:#24292f; font-family:Sora,sans-serif;
//           font-size:14px; font-weight:600; cursor:pointer;
//           display:inline-flex; align-items:center; gap:7px;
//         }
//         .btn-reset:hover { background:#e1e8ed; }
//         .qt-add-new-btn {
//           padding:8px 16px; background:#bc4c00; border:none; border-radius:7px;
//           color:#fff; font-size:13px; font-weight:600; cursor:pointer;
//           font-family:Sora,sans-serif; display:flex; align-items:center; gap:6px;
//           transition:background .15s;
//         }
//         .qt-add-new-btn:hover { background:#953c00; }
//       `}</style>

//       {/* ── Page header ── */}
//       <div className="page-header">
//         <h1>
//           <i className="bi bi-file-earmark-spreadsheet-fill me-2" style={{ color:'#bc4c00' }}></i>
//           Quotation
//         </h1>
//         <p>Create and send quotations to potential clients</p>
//       </div>

//       {/* ── Tab bar ── */}
//       <div className="qt-tab-bar">
//         <button className={`qt-tab ${view==='form'?'active':''}`}
//           onClick={() => { setView('form'); resetForm(); }}>
//           <i className="bi bi-plus-circle"></i>
//           {editId !== null ? 'Edit Quotation' : 'New Quotation'}
//         </button>
//         <button className={`qt-tab ${view==='table'?'active':''}`}
//           onClick={() => { setView('table'); setEditId(null); }}>
//           <i className="bi bi-table"></i>
//           All Quotations
//           <span style={{
//             background:'#fef3ec', color:'#bc4c00', borderRadius:20,
//             padding:'1px 8px', fontSize:11.5, fontWeight:700, marginLeft:2
//           }}>{records.length}</span>
//         </button>
//       </div>

//       {/* ══ FORM VIEW ══ */}
//       {view === 'form' && (
//         <form onSubmit={handleSubmit} className="container-fluid px-0 mt-0">
//           <div className="row g-3 w-100">

//             <div className="col-12">
//               <div className="client-form-card shadow-sm">
//                 <h6 style={{ fontWeight:700, fontSize:14, marginBottom:18 }}>
//                   <i className="bi bi-file-earmark me-2" style={{ color:'#bc4c00' }}></i>Quotation Details
//                 </h6>
//                 <div className="row g-3">
//                   <div className="col-md-4">
//                     <label className="form-label">Quote Number <span style={{ color:'red' }}>*</span></label>
//                     <input className="form-control" name="quoteNo" value={form.quoteNo} onChange={handleChange} placeholder="QT-0001" required />
//                   </div>
//                   <div className="col-md-4">
//                     <label className="form-label">Quote Date <span style={{ color:'red' }}>*</span></label>
//                     <input type="date" className="form-control" name="quoteDate" value={form.quoteDate} onChange={handleChange} required />
//                   </div>
//                   <div className="col-md-4">
//                     <label className="form-label">Valid Until</label>
//                     <input type="date" className="form-control" name="validUntil" value={form.validUntil} onChange={handleChange} />
//                   </div>
//                   <div className="col-md-6">
//                     <label className="form-label">Discount %</label>
//                     <input type="number" className="form-control" name="discount" value={form.discount} onChange={handleChange} min="0" max="100" />
//                   </div>
//                   <div className="col-md-6">
//                     <label className="form-label">Tax %</label>
//                     <input type="number" className="form-control" name="taxPercent" value={form.taxPercent} onChange={handleChange} min="0" max="100" />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="col-12">
//               <div className="client-form-card shadow-sm">
//                 <h6 style={{ fontWeight:700, fontSize:14, marginBottom:18 }}>
//                   <i className="bi bi-person me-2" style={{ color:'#bc4c00' }}></i>Client Information
//                 </h6>
//                 <div className="row g-3">
//                   <div className="col-md-4">
//                     <label className="form-label">Client Name <span style={{ color:'red' }}>*</span></label>
//                     <input className="form-control" name="clientName" value={form.clientName} onChange={handleChange} placeholder="Client name" required />
//                   </div>
//                   <div className="col-md-4">
//                     <label className="form-label">Phone</label>
//                     <input className="form-control" name="clientPhone" value={form.clientPhone} onChange={handleChange} placeholder="+91 98765 43210" />
//                   </div>
//                   <div className="col-md-4">
//                     <label className="form-label">Email</label>
//                     <input type="email" className="form-control" name="clientEmail" value={form.clientEmail} onChange={handleChange} placeholder="client@email.com" />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="col-12">
//               <div className="client-form-card shadow-sm">
//                 <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
//                   <h6 style={{ fontWeight:700, fontSize:14, margin:0 }}>
//                     <i className="bi bi-list-ul me-2" style={{ color:'#bc4c00' }}></i>Quotation Items
//                   </h6>
//                   <button type="button" onClick={addItem}
//                     style={{ background:'#bc4c00', border:'none', color:'white', padding:'6px 14px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer' }}>
//                     <i className="bi bi-plus-lg me-1"></i>Add Item
//                   </button>
//                 </div>
//                 <div className="table-responsive">
//                   <table className="table" style={{ fontSize:13.5 }}>
//                     <thead style={{ background:'#f6f8fa' }}>
//                       <tr>
//                         <th style={{ fontWeight:600, color:'#57606a', border:'none', padding:'10px 12px' }}>#</th>
//                         <th style={{ fontWeight:600, color:'#57606a', border:'none' }}>Description</th>
//                         <th style={{ fontWeight:600, color:'#57606a', border:'none', width:100 }}>Qty</th>
//                         <th style={{ fontWeight:600, color:'#57606a', border:'none', width:130 }}>Rate (INR)</th>
//                         <th style={{ fontWeight:600, color:'#57606a', border:'none', width:130 }}>Amount</th>
//                         <th style={{ border:'none', width:50 }}></th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {form.items.map((item, i) => (
//                         <tr key={i}>
//                           <td style={{ verticalAlign:'middle', padding:'8px 12px', color:'#57606a' }}>{i+1}</td>
//                           <td><input className="form-control form-control-sm" value={item.description} onChange={e=>handleItemChange(i,'description',e.target.value)} placeholder="Service / Product" /></td>
//                           <td><input type="number" className="form-control form-control-sm" value={item.qty} onChange={e=>handleItemChange(i,'qty',e.target.value)} min="1" /></td>
//                           <td><input type="number" className="form-control form-control-sm" value={item.rate} onChange={e=>handleItemChange(i,'rate',e.target.value)} min="0" /></td>
//                           <td style={{ verticalAlign:'middle', fontWeight:600, fontFamily:'JetBrains Mono,monospace' }}>
//                             {inr(Number(item.qty)*Number(item.rate))}
//                           </td>
//                           <td style={{ verticalAlign:'middle' }}>
//                             {form.items.length>1 && (
//                               <button type="button" onClick={()=>removeItem(i)}
//                                 style={{ background:'none', border:'none', color:'#cf222e', cursor:'pointer', fontSize:16 }}>
//                                 <i className="bi bi-trash3"></i>
//                               </button>
//                             )}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 <div style={{ display:'flex', justifyContent:'flex-end', marginTop:10 }}>
//                   <div style={{ minWidth:300, background:'#f6f8fa', borderRadius:10, padding:16 }}>
//                     {[
//                       ['Subtotal', inr(subtotal), ''],
//                       [`Discount (${form.discount}%)`, `- ${inr(discountAmt)}`, '#cf222e'],
//                       [`Tax (${form.taxPercent}%)`, inr(taxAmt), ''],
//                     ].map(([l,v,c],i) => (
//                       <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:13.5, marginBottom:6 }}>
//                         <span style={{ color:'#57606a' }}>{l}</span>
//                         <span style={{ fontFamily:'JetBrains Mono,monospace', fontWeight:600, color:c||'#24292f' }}>{v}</span>
//                       </div>
//                     ))}
//                     <div style={{ height:1, background:'#d0d7de', margin:'8px 0' }}></div>
//                     <div style={{ display:'flex', justifyContent:'space-between', fontSize:15 }}>
//                       <span style={{ fontWeight:700 }}>Grand Total</span>
//                       <span style={{ fontFamily:'JetBrains Mono,monospace', fontWeight:700, color:'#bc4c00' }}>{inr(total)}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="col-12">
//               <div className="client-form-card shadow-sm">
//                 <label className="form-label" style={{ fontWeight:600, fontSize:13 }}>Terms & Notes</label>
//                 <textarea className="form-control" name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Terms and conditions, notes..." />
//               </div>
//             </div>

//             <div className="col-12">
//               <div style={{ display:'flex', gap:10 }}>
//                 <button type="submit" className="qt-submit-btn">
//                   <i className={`bi ${editId!==null?'bi-pencil-square':'bi-send-fill'}`}></i>
//                   {editId!==null?'Update Quotation':'Submit Quotation'}
//                 </button>
//                 <button type="button" className="btn-reset" onClick={resetForm}>
//                   <i className="bi bi-arrow-counterclockwise"></i>Reset
//                 </button>
//                 {records.length>0 && (
//                   <button type="button" className="btn-reset" style={{ marginLeft:'auto' }}
//                     onClick={()=>setView('table')}>
//                     <i className="bi bi-table me-1"></i>View All Quotations
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </form>
//       )}

//       {/* ══ TABLE VIEW ══ */}
//       {view === 'table' && (
//         <div className="qt-records-card">
//           <div className="qt-toolbar">
//             <div className="qt-search-wrap">
//               <span className="qt-search-icon"><i className="bi bi-search" style={{ fontSize:13 }}></i></span>
//               <input className="qt-search" placeholder="Search by client name or quote no…"
//                 value={search} onChange={e=>setSearch(e.target.value)} />
//             </div>
//             <button className="qt-add-new-btn"
//               onClick={()=>{ setView('form'); resetForm(); }}>
//               <i className="bi bi-plus-lg"></i>New Quotation
//             </button>
//           </div>

//           <div className="qt-summary">
//             {[
//               { lbl:'Total Quotes',   val: filtered.length,                                                        mono:false, color:'#24292f' },
//               { lbl:'Total Subtotal', val: inr(filtered.reduce((s,r)=>s+calcTotals(r).subtotal,0)),               mono:true,  color:'#24292f' },
//               { lbl:'Total Discount', val: inr(filtered.reduce((s,r)=>s+calcTotals(r).discountAmt,0)),            mono:true,  color:'#cf222e' },
//               { lbl:'Total Revenue',  val: inr(filtered.reduce((s,r)=>s+calcTotals(r).total,0)),                  mono:true,  color:'#bc4c00' },
//             ].map(s=>(
//               <div key={s.lbl} className="qt-sum-item">
//                 <div className="qt-sum-lbl">{s.lbl}</div>
//                 <div className="qt-sum-val" style={{ color:s.color, fontFamily:s.mono?"'JetBrains Mono',monospace":'Sora,sans-serif' }}>
//                   {s.val}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="qt-table-wrap">
//             {filtered.length===0 ? (
//               <div className="qt-empty">
//                 <div className="qt-empty-icon">📄</div>
//                 <p>No quotations found.<br />
//                   <span style={{ color:'#bc4c00', cursor:'pointer', fontWeight:600 }}
//                     onClick={()=>{ setView('form'); resetForm(); }}>
//                     Create the first quotation →
//                   </span>
//                 </p>
//               </div>
//             ) : (
//               <table className="qt-table">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>Quote No</th>
//                     <th>Client</th>
//                     <th>Date</th>
//                     <th>Valid Until</th>
//                     <th>Items</th>
//                     <th>Discount</th>
//                     <th>Tax</th>
//                     <th>Grand Total</th>
//                     <th style={{ textAlign:'right' }}>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filtered.map((rec, idx) => {
//                     const t = calcTotals(rec);
//                     const today = new Date().toISOString().split('T')[0];
//                     const expired = rec.validUntil && rec.validUntil < today;
//                     return (
//                       <tr key={rec.id}>
//                         <td style={{ color:'#8c959f', fontWeight:600, fontSize:12 }}>{idx+1}</td>
//                         <td><span className="qt-quote-no">{rec.quoteNo}</span></td>
//                         <td>
//                           <div className="qt-client-name">{rec.clientName}</div>
//                           {rec.clientPhone && <div className="qt-client-sub">{rec.clientPhone}</div>}
//                         </td>
//                         <td><span className="qt-date-chip">{fmtDate(rec.quoteDate)}</span></td>
//                         <td>
//                           {rec.validUntil
//                             ? <span className={expired?'qt-expired-chip':'qt-valid-chip'}>{fmtDate(rec.validUntil)}</span>
//                             : <span style={{ color:'#8c959f' }}>—</span>}
//                         </td>
//                         <td style={{ color:'#57606a', fontWeight:600 }}>{rec.items.length} item{rec.items.length!==1?'s':''}</td>
//                         <td><span className="qt-mono" style={{ color:'#cf222e' }}>-{inr(t.discountAmt)}</span></td>
//                         <td><span className="qt-mono" style={{ color:'#0969da' }}>{inr(t.taxAmt)}</span></td>
//                         <td><span className="qt-mono qt-total-val">{inr(t.total)}</span></td>
//                         <td>
//                           <div className="qt-actions" style={{ justifyContent:'flex-end' }}>
//                             <button className="qt-btn-view" onClick={()=>setViewRec(rec)}>
//                               <i className="bi bi-eye" style={{ fontSize:11 }}></i> View
//                             </button>
//                             <button className="qt-btn-edit" onClick={()=>handleEdit(rec)}>
//                               <i className="bi bi-pencil" style={{ fontSize:11 }}></i> Edit
//                             </button>
//                             <button className="qt-btn-print" onClick={()=>handlePrint(rec)}>
//                               <i className="bi bi-printer" style={{ fontSize:11 }}></i> Print
//                             </button>
//                             <button className="qt-btn-del" onClick={()=>setDeleteId(rec.id)}>
//                               <i className="bi bi-trash" style={{ fontSize:11 }}></i> Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ══ DELETE MODAL ══ */}
//       {deleteId!==null && (
//         <div className="qt-modal-backdrop" onClick={()=>setDeleteId(null)}>
//           <div className="qt-del-modal" onClick={e=>e.stopPropagation()}>
//             <div className="qt-del-icon">🗑️</div>
//             <div className="qt-del-title">Delete Quotation?</div>
//             <div className="qt-del-msg">
//               This will permanently delete quotation{' '}
//               <strong>{records.find(r=>r.id===deleteId)?.quoteNo}</strong> for{' '}
//               <strong>{records.find(r=>r.id===deleteId)?.clientName}</strong>.
//               This action cannot be undone.
//             </div>
//             <div className="qt-del-actions">
//               <button className="qt-cancel-btn" onClick={()=>setDeleteId(null)}>Cancel</button>
//               <button className="qt-confirm-del" onClick={()=>handleDelete(deleteId)}>
//                 <i className="bi bi-trash me-1"></i>Yes, Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ══ VIEW DETAIL MODAL ══ */}
//       {viewRec && (() => {
//         const t = calcTotals(viewRec);
//         return (
//           <div className="qt-modal-backdrop" onClick={()=>setViewRec(null)}>
//             <div className="qt-view-modal" onClick={e=>e.stopPropagation()}>
//               <div className="qt-view-header">
//                 <h3>{viewRec.quoteNo} — {viewRec.clientName}</h3>
//                 <p>
//                   {viewRec.clientPhone && `${viewRec.clientPhone}  ·  `}
//                   {viewRec.clientEmail && viewRec.clientEmail}
//                 </p>
//               </div>
//               <div className="qt-view-body">
//                 <div className="qt-view-section">
//                   <div className="qt-view-section-title">Quotation Details</div>
//                   <div className="qt-view-grid">
//                     <div><div className="qt-view-lbl">Quote Date</div><div className="qt-view-val">{fmtDate(viewRec.quoteDate)}</div></div>
//                     <div><div className="qt-view-lbl">Valid Until</div><div className="qt-view-val">{fmtDate(viewRec.validUntil)}</div></div>
//                     <div><div className="qt-view-lbl">Discount</div><div className="qt-view-val">{viewRec.discount}%</div></div>
//                     <div><div className="qt-view-lbl">Tax</div><div className="qt-view-val">{viewRec.taxPercent}%</div></div>
//                   </div>
//                 </div>
//                 <div className="qt-view-section">
//                   <div className="qt-view-section-title">Items ({viewRec.items.length})</div>
//                   <table className="qt-items-table">
//                     <thead>
//                       <tr><th>#</th><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr>
//                     </thead>
//                     <tbody>
//                       {viewRec.items.map((it, i) => (
//                         <tr key={i}>
//                           <td style={{ color:'#8c959f' }}>{i+1}</td>
//                           <td>{it.description || '—'}</td>
//                           <td>{it.qty}</td>
//                           <td style={{ fontFamily:"'JetBrains Mono',monospace" }}>{inr(it.rate)}</td>
//                           <td style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:600 }}>{inr(Number(it.qty)*Number(it.rate))}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//                 <div className="qt-view-amounts">
//                   <div className="qt-view-row"><span style={{ color:'#57606a' }}>Subtotal</span><span style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:600 }}>{inr(t.subtotal)}</span></div>
//                   <div className="qt-view-row"><span style={{ color:'#57606a' }}>Discount ({viewRec.discount}%)</span><span style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:600, color:'#cf222e' }}>−{inr(t.discountAmt)}</span></div>
//                   <div className="qt-view-row"><span style={{ color:'#57606a' }}>Tax ({viewRec.taxPercent}%)</span><span style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:600, color:'#0969da' }}>{inr(t.taxAmt)}</span></div>
//                   <div className="qt-view-divider" />
//                   <div className="qt-view-row qt-view-net"><span>Grand Total</span><span style={{ fontFamily:"'JetBrains Mono',monospace", color:'#bc4c00' }}>{inr(t.total)}</span></div>
//                 </div>
//                 {viewRec.notes && (
//                   <div className="qt-view-section">
//                     <div className="qt-view-section-title">Terms & Notes</div>
//                     <div style={{ fontSize:13.5, color:'#57606a', lineHeight:1.6 }}>{viewRec.notes}</div>
//                   </div>
//                 )}
//               </div>
//               <div className="qt-view-footer">
//                 <button className="qt-btn-print" style={{ marginRight:10 }} onClick={()=>handlePrint(viewRec)}>
//                   <i className="bi bi-printer me-1"></i>Print Invoice
//                 </button>
//                 <button className="qt-close-btn" onClick={()=>setViewRec(null)}>Close</button>
//               </div>
//             </div>
//           </div>
//         );
//       })()}
//     </>
//   );
// }




import { useState, useEffect } from 'react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const COMPANY = {
  name: 'BIP FENCING CONTRACT WORK',
  address: 'NO. 26/A, MAIN ROAD, PAMBANKULAM,\nKALANTHAPANAI, PANAGUDI-627109',
  gstin: '33ABLPI5244C1Z1',
  state: 'Tamil Nadu',
  stateCode: '33',
};

const emptyForm = {
  quoteNo: '', quoteDate: '', validUntil: '', clientName: '', clientPhone: '', clientEmail: '',
  items: [{ description: '', qty: 1, rate: 0 }],
  taxPercent: 5, discount: 0, notes: '',
};

const SEED = [
  {
    id: 1, quoteNo: 'QT-0001', quoteDate: '2026-04-01', validUntil: '2026-04-15',
    clientName: 'Suresh Kumar', clientPhone: '+91 98765 43210', clientEmail: 'suresh@gmail.com',
    items: [{ description: 'Chain Link Fencing (50m)', qty: 2, rate: 4500 }, { description: 'GI Post Installation', qty: 10, rate: 650 }],
    taxPercent: 18, discount: 5, notes: 'Payment within 7 days of delivery.',
  },
  {
    id: 2, quoteNo: 'QT-0002', quoteDate: '2026-04-10', validUntil: '2026-04-25',
    clientName: 'Priya Nair', clientPhone: '+91 87654 32109', clientEmail: 'priya@email.com',
    items: [{ description: 'PVC Fence Panels (10 units)', qty: 10, rate: 1800 }, { description: 'Labour Charges', qty: 1, rate: 3000 }],
    taxPercent: 12, discount: 0, notes: '',
  },
  {
    id: 3, quoteNo: 'QT-0003', quoteDate: '2026-04-20', validUntil: '2026-05-05',
    clientName: 'Rajesh Mehta', clientPhone: '+91 76543 21098', clientEmail: 'rajesh@corp.in',
    items: [{ description: 'Iron Gate (6ft, MS)', qty: 1, rate: 8200 }, { description: 'Welding & Finishing', qty: 1, rate: 2500 }],
    taxPercent: 18, discount: 10, notes: 'Site visit required before installation.',
  },
];

const STORAGE_KEY = 'bip_quotation_records';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function saveToStorage(records) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {}
}

export function calcTotals(form) {
  const subtotal     = form.items.reduce((s, it) => s + Number(it.qty) * Number(it.rate), 0);
  const discountAmt  = (subtotal * Number(form.discount)) / 100;
  const taxableAmt   = subtotal - discountAmt;
  const halfTax      = (taxableAmt * Number(form.taxPercent)) / 200;
  const taxAmt       = halfTax * 2;
  const total        = taxableAmt + taxAmt;
  return { subtotal, discountAmt, taxableAmt, halfTax, taxAmt, total };
}

const inr = (v) => `₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
const inrPlain = (v) => Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 });

const fmtDate = (d) => {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}-${m}-${y}`;
};

function toWords(num) {
  const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine',
    'Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  if (num === 0) return 'Zero';
  function helper(n) {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? ' ' + ones[n%10] : '');
    if (n < 1000) return ones[Math.floor(n/100)] + ' Hundred' + (n%100 ? ' ' + helper(n%100) : '');
    if (n < 100000) return helper(Math.floor(n/1000)) + ' Thousand' + (n%1000 ? ' ' + helper(n%1000) : '');
    if (n < 10000000) return helper(Math.floor(n/100000)) + ' Lakh' + (n%100000 ? ' ' + helper(n%100000) : '');
    return helper(Math.floor(n/10000000)) + ' Crore' + (n%10000000 ? ' ' + helper(n%10000000) : '');
  }
  const intPart = Math.floor(num);
  const decPart = Math.round((num - intPart) * 100);
  let result = 'INR ' + helper(intPart) + ' Only';
  if (decPart > 0) result = 'INR ' + helper(intPart) + ' and ' + helper(decPart) + ' Paise Only';
  return result;
}

function handlePrint(rec) {
  const t = calcTotals(rec);
  const totalQty = rec.items.reduce((s, it) => s + Number(it.qty), 0);

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Quotation ${rec.quoteNo}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:'Times New Roman',serif;font-size:11px;color:#000;background:#fff;padding:10mm;}
    .page{width:190mm;margin:auto;border:1px solid #333;}
    .header{display:flex;border-bottom:1px solid #333;}
    .header-left{flex:1;padding:8px 12px;border-right:1px solid #333;}
    .header-center{width:120px;display:flex;align-items:center;justify-content:center;border-right:1px solid #333;padding:8px;}
    .header-right{flex:1;padding:8px 12px;}
    .company-name{font-size:13px;font-weight:bold;text-transform:uppercase;margin-bottom:3px;}
    .company-addr{font-size:10px;line-height:1.5;margin-bottom:3px;}
    .title-box{text-align:center;}
    .title-box h2{font-size:14px;font-weight:bold;letter-spacing:1px;}
    .title-box p{font-size:9px;color:#555;margin-top:2px;}
    .inv-grid{display:grid;grid-template-columns:1fr 1fr;font-size:10px;gap:0;}
    .inv-row{display:flex;border-bottom:1px solid #ccc;padding:3px 0;}
    .inv-row:last-child{border-bottom:none;}
    .inv-lbl{color:#555;width:95px;flex-shrink:0;}
    .inv-val{font-weight:600;}
    .client-section{display:flex;border-bottom:1px solid #333;}
    .client-box{flex:1;padding:7px 12px;border-right:1px solid #333;}
    .client-box:last-child{border-right:none;}
    .section-lbl{font-size:9.5px;font-weight:bold;text-transform:uppercase;color:#444;margin-bottom:4px;letter-spacing:.5px;}
    .client-name{font-size:11px;font-weight:bold;margin-bottom:2px;}
    .client-detail{font-size:10px;line-height:1.6;}
    .items-section{border-bottom:1px solid #333;}
    .items-table{width:100%;border-collapse:collapse;}
    .items-table th{background:#f0f0f0;border:1px solid #888;padding:5px 7px;font-size:10px;text-align:center;font-weight:bold;}
    .items-table td{border:1px solid #bbb;padding:5px 7px;font-size:10.5px;vertical-align:top;}
    .items-table .desc{text-align:left;}
    .items-table .num{text-align:right;}
    .items-table .center{text-align:center;}
    .totals-section{display:flex;border-bottom:1px solid #333;}
    .words-box{flex:1;padding:8px 12px;border-right:1px solid #333;}
    .words-lbl{font-size:9.5px;font-weight:bold;text-transform:uppercase;color:#444;margin-bottom:5px;}
    .words-val{font-size:10.5px;font-style:italic;}
    .amounts-box{width:240px;padding:0;}
    .amt-row{display:flex;justify-content:space-between;padding:4px 12px;border-bottom:1px solid #eee;font-size:10.5px;}
    .amt-row:last-child{border-bottom:none;background:#fef9f5;font-weight:bold;font-size:11.5px;}
    .amt-row.subtotal{background:#fafafa;}
    .amt-label{color:#444;}
    .amt-value{font-weight:600;}
    .amt-total-val{color:#8b2200;font-weight:bold;}
    .grand-total-row{display:flex;justify-content:space-between;padding:6px 12px;background:#fef9f5;font-weight:bold;font-size:12px;border-top:2px solid #333;}
    .grand-total-row .amt-total-val{color:#8b2200;}
    .tax-section{border-bottom:1px solid #333;padding:8px 12px;}
    .tax-table{width:100%;border-collapse:collapse;margin-top:4px;}
    .tax-table th{background:#f5f5f5;border:1px solid #999;padding:4px 8px;font-size:9.5px;text-align:center;}
    .tax-table td{border:1px solid #ccc;padding:4px 8px;font-size:10px;text-align:right;}
    .tax-table td.center{text-align:center;}
    .tax-lbl{font-size:9.5px;font-weight:bold;text-transform:uppercase;color:#444;margin-bottom:4px;letter-spacing:.5px;}
    .bottom-section{display:flex;border-bottom:1px solid #333;}
    .notes-box{flex:1;padding:8px 12px;border-right:1px solid #333;}
    .sign-box{width:200px;padding:8px 12px;text-align:center;}
    .sign-label{font-size:10px;color:#444;margin-bottom:40px;}
    .sign-line{border-top:1px solid #333;margin-top:10px;padding-top:4px;font-size:10px;font-weight:bold;}
    .footer{padding:6px 12px;text-align:center;font-size:9px;color:#666;border-top:1px solid #ccc;margin-top:0;}
    @media print{body{padding:0;}.page{border:1px solid #333;width:100%;}}
  </style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="header-left">
      <div class="company-name">${COMPANY.name}</div>
      <div class="company-addr">${COMPANY.address.replace(/\n/g,'<br/>')}</div>
      <div class="company-addr">GSTIN/UIN: <strong>${COMPANY.gstin}</strong></div>
      <div class="company-addr">State Name: ${COMPANY.state}, Code: ${COMPANY.stateCode}</div>
    </div>
    <div class="header-center">
      <div class="title-box">
        <h2>Quotation</h2>
        <p>Tax Invoice</p>
      </div>
    </div>
    <div class="header-right">
      <div class="inv-grid">
        <div class="inv-row"><span class="inv-lbl">Quote No.</span><span class="inv-val">${rec.quoteNo}</span></div>
        <div class="inv-row"><span class="inv-lbl">Dated</span><span class="inv-val">${fmtDate(rec.quoteDate)}</span></div>
        <div class="inv-row"><span class="inv-lbl">Valid Until</span><span class="inv-val">${fmtDate(rec.validUntil)}</span></div>
      </div>
    </div>
  </div>
  <div class="client-section">
    <div class="client-box">
      <div class="section-lbl">Bill To / Consignee</div>
      <div class="client-name">${rec.clientName}</div>
      ${rec.clientPhone ? `<div class="client-detail">Phone: ${rec.clientPhone}</div>` : ''}
      ${rec.clientEmail ? `<div class="client-detail">Email: ${rec.clientEmail}</div>` : ''}
      <div class="client-detail">State Name: Tamil Nadu, Code: 33</div>
    </div>
    <div class="client-box">
      <div class="section-lbl">Quotation Info</div>
      <div class="client-detail">Quote Date: <strong>${fmtDate(rec.quoteDate)}</strong></div>
      <div class="client-detail">Valid Until: <strong>${fmtDate(rec.validUntil)}</strong></div>
      <div class="client-detail">Discount: <strong>${rec.discount}%</strong></div>
      <div class="client-detail">Tax: <strong>${rec.taxPercent}%</strong> (CGST ${rec.taxPercent/2}% + SGST ${rec.taxPercent/2}%)</div>
    </div>
  </div>
  <div class="items-section">
    <table class="items-table">
      <thead>
        <tr>
          <th style="width:35px">Sl No.</th>
          <th>Description of Goods / Services</th>
          <th style="width:65px">Quantity</th>
          <th style="width:90px">Rate (INR)</th>
          <th style="width:100px">Amount (INR)</th>
        </tr>
      </thead>
      <tbody>
        ${rec.items.map((it, i) => `
        <tr>
          <td class="center">${i+1}</td>
          <td class="desc">${it.description || '—'}</td>
          <td class="center">${it.qty} Nos</td>
          <td class="num">${inrPlain(it.rate)}</td>
          <td class="num">${inrPlain(Number(it.qty)*Number(it.rate))}</td>
        </tr>`).join('')}
        ${rec.items.length < 6 ? Array(6-rec.items.length).fill('<tr><td>&nbsp;</td><td></td><td></td><td></td><td></td></tr>').join('') : ''}
        <tr>
          <td colspan="2" style="text-align:right;font-weight:bold;background:#fafafa;">
            CGST Tax &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br/>SGST Tax
          </td>
          <td class="center" style="font-weight:bold;">${totalQty} Nos</td>
          <td></td>
          <td class="num" style="font-weight:bold;">${inrPlain(t.halfTax)}<br/>${inrPlain(t.halfTax)}</td>
        </tr>
        <tr style="background:#fef9f5;">
          <td colspan="2" style="text-align:right;font-weight:bold;font-size:12px;">Total</td>
          <td class="center" style="font-weight:bold;">${totalQty} Nos</td>
          <td></td>
          <td class="num" style="font-weight:bold;font-size:12px;color:#8b2200;">₹ ${inrPlain(t.total)}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="totals-section">
    <div class="words-box">
      <div class="words-lbl">Amount Chargeable (in words)</div>
      <div class="words-val">${toWords(t.total)}</div>
      ${rec.discount > 0 ? `<div style="margin-top:8px;font-size:9.5px;color:#555;">Discount (${rec.discount}%): ₹ ${inrPlain(t.discountAmt)} deducted from subtotal.</div>` : ''}
    </div>
    <div class="amounts-box">
      <div class="amt-row subtotal"><span class="amt-label">Subtotal</span><span class="amt-value">₹ ${inrPlain(t.subtotal)}</span></div>
      ${rec.discount > 0 ? `<div class="amt-row"><span class="amt-label">Discount (${rec.discount}%)</span><span class="amt-value" style="color:#cf222e;">− ₹ ${inrPlain(t.discountAmt)}</span></div>` : ''}
      <div class="amt-row"><span class="amt-label">Taxable Value</span><span class="amt-value">₹ ${inrPlain(t.taxableAmt)}</span></div>
      <div class="amt-row"><span class="amt-label">CGST (${rec.taxPercent/2}%)</span><span class="amt-value">₹ ${inrPlain(t.halfTax)}</span></div>
      <div class="amt-row"><span class="amt-label">SGST (${rec.taxPercent/2}%)</span><span class="amt-value">₹ ${inrPlain(t.halfTax)}</span></div>
      <div class="grand-total-row"><span>Grand Total</span><span class="amt-total-val">₹ ${inrPlain(t.total)}</span></div>
    </div>
  </div>
  <div class="tax-section">
    <div class="tax-lbl">Tax Amount (in words): <em>${toWords(t.taxAmt)}</em></div>
    <table class="tax-table" style="margin-top:8px;">
      <thead>
        <tr>
          <th rowspan="2">HSN/SAC</th><th rowspan="2">Taxable Value</th>
          <th colspan="2">CGST</th><th colspan="2">SGST/UTGST</th><th rowspan="2">Total Tax Amount</th>
        </tr>
        <tr><th>Rate</th><th>Amount</th><th>Rate</th><th>Amount</th></tr>
      </thead>
      <tbody>
        <tr>
          <td class="center">—</td><td>${inrPlain(t.taxableAmt)}</td>
          <td class="center">${rec.taxPercent/2}%</td><td>${inrPlain(t.halfTax)}</td>
          <td class="center">${rec.taxPercent/2}%</td><td>${inrPlain(t.halfTax)}</td>
          <td>${inrPlain(t.taxAmt)}</td>
        </tr>
        <tr style="font-weight:bold;background:#f5f5f5;">
          <td class="center">Total</td><td>${inrPlain(t.taxableAmt)}</td>
          <td></td><td>${inrPlain(t.halfTax)}</td>
          <td></td><td>${inrPlain(t.halfTax)}</td>
          <td>${inrPlain(t.taxAmt)}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="bottom-section">
    <div class="notes-box">
      <div class="section-lbl">Terms &amp; Notes</div>
      <div class="client-detail" style="line-height:1.7;">${rec.notes || 'No additional terms.'}</div>
      <div style="margin-top:10px;font-size:9.5px;color:#555;">
        Declaration: We declare that this quotation shows the estimated price of the goods/services described and that all particulars are true and correct.
      </div>
    </div>
    <div class="sign-box">
      <div class="sign-label">for ${COMPANY.name}</div>
      <div class="sign-line">Authorised Signatory</div>
    </div>
  </div>
  <div class="footer">
    This is a Computer Generated Quotation &nbsp;|&nbsp; ${COMPANY.name} &nbsp;|&nbsp; GSTIN: ${COMPANY.gstin}
  </div>
</div>
<script>window.onload=()=>{ window.print(); }</script>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=900,height=700');
  win.document.write(html);
  win.document.close();
}

export default function Quotation() {
  const [records, setRecords]   = useState(() => loadFromStorage() || SEED);
  const [form, setForm]         = useState(emptyForm);
  const [view, setView]         = useState('form');
  const [editId, setEditId]     = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [viewRec, setViewRec]   = useState(null);
  const [search, setSearch]     = useState('');

  // ── Persist to localStorage whenever records change so Dashboard can read them ──
  useEffect(() => {
    saveToStorage(records);
    // Dispatch a custom event so Dashboard (if mounted) can react without a page reload
    window.dispatchEvent(new CustomEvent('bip_quotations_updated', { detail: records }));
  }, [records]);

  const { subtotal, discountAmt, taxAmt, total } = calcTotals(form);

  const handleChange      = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleItemChange  = (i, field, value) => {
    const items = [...form.items]; items[i][field] = value; setForm({ ...form, items });
  };
  const addItem    = () => setForm({ ...form, items: [...form.items, { description: '', qty: 1, rate: 0 }] });
  const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });
  const resetForm  = () => { setForm(emptyForm); setEditId(null); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId !== null) {
      setRecords(records.map(r => r.id === editId ? { ...form, id: editId } : r));
      setEditId(null);
    } else {
      setRecords([...records, { ...form, id: Date.now() }]);
    }
    setForm(emptyForm);
    setView('table');
  };

  const handleEdit = (rec) => {
    setForm({ ...rec });
    setEditId(rec.id);
    setView('form');
    window.scrollTo(0, 0);
  };

  const handleDelete = (id) => {
    setRecords(records.filter(r => r.id !== id));
    setDeleteId(null);
  };

  const filtered = records.filter(r =>
    r.clientName.toLowerCase().includes(search.toLowerCase()) ||
    r.quoteNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        .qt-tab-bar { display:flex; gap:0; border-bottom:2px solid #e1e8ed; margin-bottom:24px; }
        .qt-tab {
          padding:10px 22px; font-size:13.5px; font-weight:600;
          border:none; background:none; cursor:pointer; color:#57606a;
          border-bottom:2px solid transparent; margin-bottom:-2px;
          transition:all .15s; display:flex; align-items:center; gap:6px;
          font-family:Sora,sans-serif;
        }
        .qt-tab.active { color:#bc4c00; border-bottom-color:#bc4c00; }
        .qt-tab:hover:not(.active) { color:#24292f; background:#f6f8fa; }
        .client-form-card { background:#fff; border-radius:12px; padding:20px; border:1px solid #e1e8ed; }
        .qt-records-card { background:#fff; border-radius:12px; border:1px solid #e1e8ed; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,.06); }
        .qt-toolbar {
          display:flex; align-items:center; gap:10px; flex-wrap:wrap;
          padding:14px 18px; border-bottom:1px solid #e1e8ed; background:#f6f8fa;
        }
        .qt-search-wrap { position:relative; flex:1; min-width:180px; }
        .qt-search-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#8c959f; pointer-events:none; }
        .qt-search {
          width:100%; padding:8px 12px 8px 34px; border:1px solid #d0d7de;
          border-radius:7px; font-size:13px; font-family:Sora,sans-serif;
          outline:none; background:#fff;
        }
        .qt-search:focus { border-color:#bc4c00; box-shadow:0 0 0 3px rgba(188,76,0,.1); }
        .qt-summary { display:flex; gap:0; border-bottom:1px solid #e1e8ed; }
        .qt-sum-item {
          flex:1; padding:12px 18px; border-right:1px solid #e1e8ed;
          display:flex; flex-direction:column; gap:2px;
        }
        .qt-sum-item:last-child { border-right:none; }
        .qt-sum-lbl { font-size:11px; color:#8c959f; text-transform:uppercase; letter-spacing:.06em; font-weight:600; }
        .qt-sum-val { font-size:15px; font-weight:700; font-family:'JetBrains Mono',monospace; }
        .qt-table-wrap { overflow-x:auto; }
        .qt-table { width:100%; border-collapse:collapse; font-size:13.5px; }
        .qt-table thead tr { background:#f6f8fa; }
        .qt-table th {
          padding:11px 14px; text-align:left; font-size:11.5px; font-weight:700;
          text-transform:uppercase; letter-spacing:.07em; color:#57606a;
          border-bottom:1px solid #e1e8ed; white-space:nowrap;
        }
        .qt-table td { padding:12px 14px; border-bottom:1px solid #f3f4f6; vertical-align:middle; color:#24292f; }
        .qt-table tbody tr:last-child td { border-bottom:none; }
        .qt-table tbody tr:hover td { background:#fdf7f4; }
        .qt-client-name { font-weight:600; }
        .qt-client-sub  { font-size:11.5px; color:#8c959f; margin-top:1px; }
        .qt-quote-no    { font-family:'JetBrains Mono',monospace; font-weight:700; color:#bc4c00; font-size:12.5px; }
        .qt-mono        { font-family:'JetBrains Mono',monospace; font-weight:600; }
        .qt-total-val   { color:#bc4c00; }
        .qt-date-chip {
          display:inline-block; padding:3px 10px; border-radius:20px;
          background:#fef3ec; color:#bc4c00; font-size:11.5px; font-weight:700;
        }
        .qt-valid-chip {
          display:inline-block; padding:3px 10px; border-radius:20px;
          background:#ddf4e8; color:#1a7f37; font-size:11.5px; font-weight:700;
        }
        .qt-expired-chip {
          display:inline-block; padding:3px 10px; border-radius:20px;
          background:#fff1f0; color:#cf222e; font-size:11.5px; font-weight:700;
        }
        .qt-actions { display:flex; gap:5px; flex-wrap:wrap; }
        .qt-btn-view {
          display:inline-flex; align-items:center; gap:4px;
          padding:5px 9px; border-radius:6px; font-size:11.5px; font-weight:600;
          border:1px solid #d0d7de; background:#f6f8fa; color:#24292f; cursor:pointer;
          font-family:Sora,sans-serif; transition:all .15s;
        }
        .qt-btn-view:hover { background:#fff; border-color:#8c959f; }
        .qt-btn-edit {
          display:inline-flex; align-items:center; gap:4px;
          padding:5px 9px; border-radius:6px; font-size:11.5px; font-weight:600;
          border:1px solid #d4e9f7; background:#f0f8ff; color:#0969da; cursor:pointer;
          font-family:Sora,sans-serif; transition:all .15s;
        }
        .qt-btn-edit:hover { background:#dbeeff; }
        .qt-btn-print {
          display:inline-flex; align-items:center; gap:4px;
          padding:5px 9px; border-radius:6px; font-size:11.5px; font-weight:600;
          border:1px solid #d4f7d4; background:#f0fff0; color:#1a7f37; cursor:pointer;
          font-family:Sora,sans-serif; transition:all .15s;
        }
        .qt-btn-print:hover { background:#d0f0d0; }
        .qt-btn-del {
          display:inline-flex; align-items:center; gap:4px;
          padding:5px 9px; border-radius:6px; font-size:11.5px; font-weight:600;
          border:1px solid #ffd8d3; background:#fff1f0; color:#cf222e; cursor:pointer;
          font-family:Sora,sans-serif; transition:all .15s;
        }
        .qt-btn-del:hover { background:#ffe0db; }
        .qt-empty { text-align:center; padding:56px 20px; color:#8c959f; }
        .qt-empty-icon { font-size:3rem; margin-bottom:12px; }
        .qt-modal-backdrop {
          position:fixed; inset:0; background:rgba(0,0,0,.45);
          z-index:1000; display:flex; align-items:center; justify-content:center;
          padding:20px; animation:qt-fade .15s ease;
        }
        @keyframes qt-fade { from{opacity:0} to{opacity:1} }
        @keyframes qt-up   { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }
        .qt-del-modal {
          background:#fff; border-radius:12px; padding:28px 28px 22px;
          max-width:380px; width:100%; box-shadow:0 8px 32px rgba(0,0,0,.18);
          animation:qt-up .18s ease;
        }
        .qt-del-icon  { font-size:2.4rem; margin-bottom:10px; }
        .qt-del-title { font-size:16px; font-weight:700; color:#24292f; margin-bottom:6px; }
        .qt-del-msg   { font-size:13.5px; color:#57606a; margin-bottom:22px; line-height:1.5; }
        .qt-del-actions { display:flex; gap:10px; justify-content:flex-end; }
        .qt-cancel-btn {
          padding:8px 18px; border:1px solid #d0d7de; border-radius:7px;
          background:#f6f8fa; color:#24292f; font-size:13px; font-weight:600;
          cursor:pointer; font-family:Sora,sans-serif;
        }
        .qt-cancel-btn:hover { background:#e1e8ed; }
        .qt-confirm-del {
          padding:8px 18px; border:none; border-radius:7px;
          background:#cf222e; color:#fff; font-size:13px; font-weight:600;
          cursor:pointer; font-family:Sora,sans-serif; transition:background .15s;
        }
        .qt-confirm-del:hover { background:#a11423; }
        .qt-view-modal {
          background:#fff; border-radius:14px; max-width:600px; width:100%;
          box-shadow:0 8px 40px rgba(0,0,0,.2); animation:qt-up .18s ease;
          overflow:hidden; max-height:90vh; display:flex; flex-direction:column;
        }
        .qt-view-header {
          padding:20px 24px 16px;
          background:linear-gradient(135deg,#bc4c00 0%,#d4682a 100%);
          color:#fff; flex-shrink:0;
        }
        .qt-view-header h3 { font-size:17px; font-weight:700; margin-bottom:2px; }
        .qt-view-header p  { font-size:12.5px; opacity:.82; }
        .qt-view-body { padding:20px 24px; overflow-y:auto; display:flex; flex-direction:column; gap:16px; }
        .qt-view-section { }
        .qt-view-section-title {
          font-size:11px; font-weight:700; text-transform:uppercase;
          letter-spacing:.08em; color:#8c959f; margin-bottom:8px;
        }
        .qt-view-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px 16px; }
        .qt-view-lbl  { font-size:11.5px; color:#8c959f; font-weight:600; }
        .qt-view-val  { font-size:13.5px; color:#24292f; font-weight:500; margin-top:1px; }
        .qt-items-table { width:100%; border-collapse:collapse; font-size:13px; }
        .qt-items-table th {
          padding:7px 10px; text-align:left; font-size:11px; font-weight:700;
          text-transform:uppercase; letter-spacing:.07em; color:#57606a;
          border-bottom:1px solid #e1e8ed; background:#f6f8fa;
        }
        .qt-items-table td { padding:9px 10px; border-bottom:1px solid #f3f4f6; color:#24292f; }
        .qt-items-table tr:last-child td { border-bottom:none; }
        .qt-view-amounts {
          background:#f6f8fa; border-radius:10px; padding:14px 16px;
          display:flex; flex-direction:column; gap:7px;
        }
        .qt-view-row { display:flex; justify-content:space-between; font-size:13.5px; }
        .qt-view-divider { height:1px; background:#d0d7de; margin:4px 0; }
        .qt-view-net { font-weight:700; font-size:15px; }
        .qt-view-footer {
          padding:14px 24px; border-top:1px solid #e1e8ed;
          display:flex; justify-content:flex-end; flex-shrink:0;
        }
        .qt-close-btn {
          padding:8px 20px; border:1px solid #d0d7de; border-radius:7px;
          background:#f6f8fa; color:#24292f; font-weight:600; font-size:13px;
          cursor:pointer; font-family:Sora,sans-serif;
        }
        .qt-submit-btn {
          background:#bc4c00; border:none; color:white;
          padding:10px 24px; border-radius:8px; font-family:Sora,sans-serif;
          font-size:14px; font-weight:600; cursor:pointer;
          display:inline-flex; align-items:center; gap:7px; transition:background .15s;
        }
        .qt-submit-btn:hover { background:#953c00; }
        .btn-reset {
          padding:10px 20px; border-radius:8px; border:1px solid #d0d7de;
          background:#f6f8fa; color:#24292f; font-family:Sora,sans-serif;
          font-size:14px; font-weight:600; cursor:pointer;
          display:inline-flex; align-items:center; gap:7px;
        }
        .btn-reset:hover { background:#e1e8ed; }
        .qt-add-new-btn {
          padding:8px 16px; background:#bc4c00; border:none; border-radius:7px;
          color:#fff; font-size:13px; font-weight:600; cursor:pointer;
          font-family:Sora,sans-serif; display:flex; align-items:center; gap:6px;
          transition:background .15s;
        }
        .qt-add-new-btn:hover { background:#953c00; }
      `}</style>

      <div className="page-header">
        <h1>
          <i className="bi bi-file-earmark-spreadsheet-fill me-2" style={{ color:'#bc4c00' }}></i>
          Quotation
        </h1>
        <p>Create and send quotations to potential clients</p>
      </div>

      <div className="qt-tab-bar">
        <button className={`qt-tab ${view==='form'?'active':''}`}
          onClick={() => { setView('form'); resetForm(); }}>
          <i className="bi bi-plus-circle"></i>
          {editId !== null ? 'Edit Quotation' : 'New Quotation'}
        </button>
        <button className={`qt-tab ${view==='table'?'active':''}`}
          onClick={() => { setView('table'); setEditId(null); }}>
          <i className="bi bi-table"></i>
          All Quotations
          <span style={{
            background:'#fef3ec', color:'#bc4c00', borderRadius:20,
            padding:'1px 8px', fontSize:11.5, fontWeight:700, marginLeft:2
          }}>{records.length}</span>
        </button>
      </div>

      {/* ══ FORM VIEW ══ */}
      {view === 'form' && (
        <form onSubmit={handleSubmit} className="container-fluid px-0 mt-0">
          <div className="row g-3 w-100">

            <div className="col-12">
              <div className="client-form-card shadow-sm">
                <h6 style={{ fontWeight:700, fontSize:14, marginBottom:18 }}>
                  <i className="bi bi-file-earmark me-2" style={{ color:'#bc4c00' }}></i>Quotation Details
                </h6>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Quote Number <span style={{ color:'red' }}>*</span></label>
                    <input className="form-control" name="quoteNo" value={form.quoteNo} onChange={handleChange} placeholder="QT-0001" required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Quote Date <span style={{ color:'red' }}>*</span></label>
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
                <h6 style={{ fontWeight:700, fontSize:14, marginBottom:18 }}>
                  <i className="bi bi-person me-2" style={{ color:'#bc4c00' }}></i>Client Information
                </h6>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Client Name <span style={{ color:'red' }}>*</span></label>
                    <input className="form-control" name="clientName" value={form.clientName} onChange={handleChange} placeholder="Client name" required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Phone</label>
                    <input className="form-control" name="clientPhone" value={form.clientPhone} onChange={handleChange} placeholder="+91 98765 43210" />
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
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
                  <h6 style={{ fontWeight:700, fontSize:14, margin:0 }}>
                    <i className="bi bi-list-ul me-2" style={{ color:'#bc4c00' }}></i>Quotation Items
                  </h6>
                  <button type="button" onClick={addItem}
                    style={{ background:'#bc4c00', border:'none', color:'white', padding:'6px 14px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                    <i className="bi bi-plus-lg me-1"></i>Add Item
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="table" style={{ fontSize:13.5 }}>
                    <thead style={{ background:'#f6f8fa' }}>
                      <tr>
                        <th style={{ fontWeight:600, color:'#57606a', border:'none', padding:'10px 12px' }}>#</th>
                        <th style={{ fontWeight:600, color:'#57606a', border:'none' }}>Description</th>
                        <th style={{ fontWeight:600, color:'#57606a', border:'none', width:100 }}>Qty</th>
                        <th style={{ fontWeight:600, color:'#57606a', border:'none', width:130 }}>Rate (INR)</th>
                        <th style={{ fontWeight:600, color:'#57606a', border:'none', width:130 }}>Amount</th>
                        <th style={{ border:'none', width:50 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.items.map((item, i) => (
                        <tr key={i}>
                          <td style={{ verticalAlign:'middle', padding:'8px 12px', color:'#57606a' }}>{i+1}</td>
                          <td><input className="form-control form-control-sm" value={item.description} onChange={e=>handleItemChange(i,'description',e.target.value)} placeholder="Service / Product" /></td>
                          <td><input type="number" className="form-control form-control-sm" value={item.qty} onChange={e=>handleItemChange(i,'qty',e.target.value)} min="1" /></td>
                          <td><input type="number" className="form-control form-control-sm" value={item.rate} onChange={e=>handleItemChange(i,'rate',e.target.value)} min="0" /></td>
                          <td style={{ verticalAlign:'middle', fontWeight:600, fontFamily:'JetBrains Mono,monospace' }}>
                            {inr(Number(item.qty)*Number(item.rate))}
                          </td>
                          <td style={{ verticalAlign:'middle' }}>
                            {form.items.length>1 && (
                              <button type="button" onClick={()=>removeItem(i)}
                                style={{ background:'none', border:'none', color:'#cf222e', cursor:'pointer', fontSize:16 }}>
                                <i className="bi bi-trash3"></i>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ display:'flex', justifyContent:'flex-end', marginTop:10 }}>
                  <div style={{ minWidth:300, background:'#f6f8fa', borderRadius:10, padding:16 }}>
                    {[
                      ['Subtotal', inr(subtotal), ''],
                      [`Discount (${form.discount}%)`, `- ${inr(discountAmt)}`, '#cf222e'],
                      [`Tax (${form.taxPercent}%)`, inr(taxAmt), ''],
                    ].map(([l,v,c],i) => (
                      <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:13.5, marginBottom:6 }}>
                        <span style={{ color:'#57606a' }}>{l}</span>
                        <span style={{ fontFamily:'JetBrains Mono,monospace', fontWeight:600, color:c||'#24292f' }}>{v}</span>
                      </div>
                    ))}
                    <div style={{ height:1, background:'#d0d7de', margin:'8px 0' }}></div>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:15 }}>
                      <span style={{ fontWeight:700 }}>Grand Total</span>
                      <span style={{ fontFamily:'JetBrains Mono,monospace', fontWeight:700, color:'#bc4c00' }}>{inr(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="client-form-card shadow-sm">
                <label className="form-label" style={{ fontWeight:600, fontSize:13 }}>Terms & Notes</label>
                <textarea className="form-control" name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Terms and conditions, notes..." />
              </div>
            </div>

            <div className="col-12">
              <div style={{ display:'flex', gap:10 }}>
                <button type="submit" className="qt-submit-btn">
                  <i className={`bi ${editId!==null?'bi-pencil-square':'bi-send-fill'}`}></i>
                  {editId!==null?'Update Quotation':'Submit Quotation'}
                </button>
                <button type="button" className="btn-reset" onClick={resetForm}>
                  <i className="bi bi-arrow-counterclockwise"></i>Reset
                </button>
                {records.length>0 && (
                  <button type="button" className="btn-reset" style={{ marginLeft:'auto' }}
                    onClick={()=>setView('table')}>
                    <i className="bi bi-table me-1"></i>View All Quotations
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ══ TABLE VIEW ══ */}
      {view === 'table' && (
        <div className="qt-records-card">
          <div className="qt-toolbar">
            <div className="qt-search-wrap">
              <span className="qt-search-icon"><i className="bi bi-search" style={{ fontSize:13 }}></i></span>
              <input className="qt-search" placeholder="Search by client name or quote no…"
                value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
            <button className="qt-add-new-btn"
              onClick={()=>{ setView('form'); resetForm(); }}>
              <i className="bi bi-plus-lg"></i>New Quotation
            </button>
          </div>

          <div className="qt-summary">
            {[
              { lbl:'Total Quotes',   val: filtered.length,                                                        mono:false, color:'#24292f' },
              { lbl:'Total Subtotal', val: inr(filtered.reduce((s,r)=>s+calcTotals(r).subtotal,0)),               mono:true,  color:'#24292f' },
              { lbl:'Total Discount', val: inr(filtered.reduce((s,r)=>s+calcTotals(r).discountAmt,0)),            mono:true,  color:'#cf222e' },
              { lbl:'Total Revenue',  val: inr(filtered.reduce((s,r)=>s+calcTotals(r).total,0)),                  mono:true,  color:'#bc4c00' },
            ].map(s=>(
              <div key={s.lbl} className="qt-sum-item">
                <div className="qt-sum-lbl">{s.lbl}</div>
                <div className="qt-sum-val" style={{ color:s.color, fontFamily:s.mono?"'JetBrains Mono',monospace":'Sora,sans-serif' }}>
                  {s.val}
                </div>
              </div>
            ))}
          </div>

          <div className="qt-table-wrap">
            {filtered.length===0 ? (
              <div className="qt-empty">
                <div className="qt-empty-icon">📄</div>
                <p>No quotations found.<br />
                  <span style={{ color:'#bc4c00', cursor:'pointer', fontWeight:600 }}
                    onClick={()=>{ setView('form'); resetForm(); }}>
                    Create the first quotation →
                  </span>
                </p>
              </div>
            ) : (
              <table className="qt-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Quote No</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Valid Until</th>
                    <th>Items</th>
                    <th>Discount</th>
                    <th>Tax</th>
                    <th>Grand Total</th>
                    <th style={{ textAlign:'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((rec, idx) => {
                    const t = calcTotals(rec);
                    const today = new Date().toISOString().split('T')[0];
                    const expired = rec.validUntil && rec.validUntil < today;
                    return (
                      <tr key={rec.id}>
                        <td style={{ color:'#8c959f', fontWeight:600, fontSize:12 }}>{idx+1}</td>
                        <td><span className="qt-quote-no">{rec.quoteNo}</span></td>
                        <td>
                          <div className="qt-client-name">{rec.clientName}</div>
                          {rec.clientPhone && <div className="qt-client-sub">{rec.clientPhone}</div>}
                        </td>
                        <td><span className="qt-date-chip">{fmtDate(rec.quoteDate)}</span></td>
                        <td>
                          {rec.validUntil
                            ? <span className={expired?'qt-expired-chip':'qt-valid-chip'}>{fmtDate(rec.validUntil)}</span>
                            : <span style={{ color:'#8c959f' }}>—</span>}
                        </td>
                        <td style={{ color:'#57606a', fontWeight:600 }}>{rec.items.length} item{rec.items.length!==1?'s':''}</td>
                        <td><span className="qt-mono" style={{ color:'#cf222e' }}>-{inr(t.discountAmt)}</span></td>
                        <td><span className="qt-mono" style={{ color:'#0969da' }}>{inr(t.taxAmt)}</span></td>
                        <td><span className="qt-mono qt-total-val">{inr(t.total)}</span></td>
                        <td>
                          <div className="qt-actions" style={{ justifyContent:'flex-end' }}>
                            <button className="qt-btn-view" onClick={()=>setViewRec(rec)}>
                              <i className="bi bi-eye" style={{ fontSize:11 }}></i> View
                            </button>
                            <button className="qt-btn-edit" onClick={()=>handleEdit(rec)}>
                              <i className="bi bi-pencil" style={{ fontSize:11 }}></i> Edit
                            </button>
                            <button className="qt-btn-print" onClick={()=>handlePrint(rec)}>
                              <i className="bi bi-printer" style={{ fontSize:11 }}></i> Print
                            </button>
                            <button className="qt-btn-del" onClick={()=>setDeleteId(rec.id)}>
                              <i className="bi bi-trash" style={{ fontSize:11 }}></i> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ══ DELETE MODAL ══ */}
      {deleteId!==null && (
        <div className="qt-modal-backdrop" onClick={()=>setDeleteId(null)}>
          <div className="qt-del-modal" onClick={e=>e.stopPropagation()}>
            <div className="qt-del-icon">🗑️</div>
            <div className="qt-del-title">Delete Quotation?</div>
            <div className="qt-del-msg">
              This will permanently delete quotation{' '}
              <strong>{records.find(r=>r.id===deleteId)?.quoteNo}</strong> for{' '}
              <strong>{records.find(r=>r.id===deleteId)?.clientName}</strong>.
              This action cannot be undone.
            </div>
            <div className="qt-del-actions">
              <button className="qt-cancel-btn" onClick={()=>setDeleteId(null)}>Cancel</button>
              <button className="qt-confirm-del" onClick={()=>handleDelete(deleteId)}>
                <i className="bi bi-trash me-1"></i>Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ VIEW DETAIL MODAL ══ */}
      {viewRec && (() => {
        const t = calcTotals(viewRec);
        return (
          <div className="qt-modal-backdrop" onClick={()=>setViewRec(null)}>
            <div className="qt-view-modal" onClick={e=>e.stopPropagation()}>
              <div className="qt-view-header">
                <h3>{viewRec.quoteNo} — {viewRec.clientName}</h3>
                <p>
                  {viewRec.clientPhone && `${viewRec.clientPhone}  ·  `}
                  {viewRec.clientEmail && viewRec.clientEmail}
                </p>
              </div>
              <div className="qt-view-body">
                <div className="qt-view-section">
                  <div className="qt-view-section-title">Quotation Details</div>
                  <div className="qt-view-grid">
                    <div><div className="qt-view-lbl">Quote Date</div><div className="qt-view-val">{fmtDate(viewRec.quoteDate)}</div></div>
                    <div><div className="qt-view-lbl">Valid Until</div><div className="qt-view-val">{fmtDate(viewRec.validUntil)}</div></div>
                    <div><div className="qt-view-lbl">Discount</div><div className="qt-view-val">{viewRec.discount}%</div></div>
                    <div><div className="qt-view-lbl">Tax</div><div className="qt-view-val">{viewRec.taxPercent}%</div></div>
                  </div>
                </div>
                <div className="qt-view-section">
                  <div className="qt-view-section-title">Items ({viewRec.items.length})</div>
                  <table className="qt-items-table">
                    <thead>
                      <tr><th>#</th><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr>
                    </thead>
                    <tbody>
                      {viewRec.items.map((it, i) => (
                        <tr key={i}>
                          <td style={{ color:'#8c959f' }}>{i+1}</td>
                          <td>{it.description || '—'}</td>
                          <td>{it.qty}</td>
                          <td style={{ fontFamily:"'JetBrains Mono',monospace" }}>{inr(it.rate)}</td>
                          <td style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:600 }}>{inr(Number(it.qty)*Number(it.rate))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="qt-view-amounts">
                  <div className="qt-view-row"><span style={{ color:'#57606a' }}>Subtotal</span><span style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:600 }}>{inr(t.subtotal)}</span></div>
                  <div className="qt-view-row"><span style={{ color:'#57606a' }}>Discount ({viewRec.discount}%)</span><span style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:600, color:'#cf222e' }}>−{inr(t.discountAmt)}</span></div>
                  <div className="qt-view-row"><span style={{ color:'#57606a' }}>Tax ({viewRec.taxPercent}%)</span><span style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:600, color:'#0969da' }}>{inr(t.taxAmt)}</span></div>
                  <div className="qt-view-divider" />
                  <div className="qt-view-row qt-view-net"><span>Grand Total</span><span style={{ fontFamily:"'JetBrains Mono',monospace", color:'#bc4c00' }}>{inr(t.total)}</span></div>
                </div>
                {viewRec.notes && (
                  <div className="qt-view-section">
                    <div className="qt-view-section-title">Terms & Notes</div>
                    <div style={{ fontSize:13.5, color:'#57606a', lineHeight:1.6 }}>{viewRec.notes}</div>
                  </div>
                )}
              </div>
              <div className="qt-view-footer">
                <button className="qt-btn-print" style={{ marginRight:10 }} onClick={()=>handlePrint(viewRec)}>
                  <i className="bi bi-printer me-1"></i>Print Invoice
                </button>
                <button className="qt-close-btn" onClick={()=>setViewRec(null)}>Close</button>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}