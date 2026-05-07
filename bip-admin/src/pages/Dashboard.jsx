import { useEffect, useState } from "react";

const inr = (v) => `₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

const statCardStyle = {
  position: 'relative',
  borderRadius: '14px',
  padding: '14px 12px 12px',
  color: '#fff',
  minHeight: '100px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  overflow: 'visible',
  boxSizing: 'border-box',
  height: '100%',
};

const statIconStyle = {
  fontSize: '18px',
  opacity: 0.85,
  lineHeight: 1,
  flexShrink: 0,
};

const statLabelStyle = {
  fontSize: '10px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  opacity: 0.90,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  flex: 1,
  minWidth: 0,
};

const statValueStyle = {
  fontSize: '15px',
  fontWeight: 700,
  whiteSpace: 'normal',
  wordBreak: 'break-all',
  lineHeight: 1.25,
  maxWidth: '100%',
  marginTop: '8px',
};

const DEPARTMENTS = [
  'Operations', 'Installation', 'Fabrication', 'Welding',
  'Logistics', 'Administration', 'Site Supervision', 'Other',
];

export default function Dashboard() {
  const [data, setData] = useState({
    invoices: [],
    purchases: [],
    quotations: [],
    employees: [],
    attendance: [],
    clients: [],
    products: [],
    otRecords: [],
  });

  const [quoteSummary, setQuoteSummary] = useState({
    totalQuotes: 0,
    totalSubtotal: 0,
    totalDiscount: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    setData({
      invoices:   JSON.parse(localStorage.getItem("invoices"))              || [],
      purchases:  JSON.parse(localStorage.getItem("purchaseBills"))         || [],
      quotations: JSON.parse(localStorage.getItem("quotes"))                || [],
      employees:  JSON.parse(localStorage.getItem("employees"))             || [],
      attendance: JSON.parse(localStorage.getItem("bip_attendance_records"))|| [],
      clients:    JSON.parse(localStorage.getItem("bip_clients"))           || [],
      products:   JSON.parse(localStorage.getItem("products"))              || [],
      otRecords:  JSON.parse(localStorage.getItem("bip_ot_records"))        || [],
    });

    const saved = localStorage.getItem("quotes_summary");
    if (saved) {
      try { setQuoteSummary(JSON.parse(saved)); } catch (_) {}
    }
  }, []);

  // ── Financial ─────────────────────────────────────────────────────────────
  const totalRevenue = data.invoices.reduce((s, i) => s + (i.total || 0), 0);
  const totalExpense = data.purchases.reduce((s, p) => s + (p.grandTotal || 0), 0);
  const profit       = totalRevenue - totalExpense;

  // ── Attendance ────────────────────────────────────────────────────────────
  const today           = new Date().toISOString().split("T")[0];
  const todayAttendance = data.attendance.filter(a => a.date === today);
  const uniqueEmployees = [...new Set(data.attendance.map(a => a.employeeId || a.employeeName))];
  const totalEmployees  = uniqueEmployees.length;
  const present         = todayAttendance.filter(a => a.status === "Present").length;
  const absent          = todayAttendance.filter(a => a.status === "Absent").length;

  // ── OT Stats ──────────────────────────────────────────────────────────────
  const activeOT        = data.otRecords.filter(r => r.status === 'Approved' || r.status === 'Pending');
  const totalOnOT       = new Set(activeOT.map(r => r.employeeId || r.employeeName)).size;
  const totalOTHours    = data.otRecords.reduce((s, r) => s + (Number(r.otHours) || 0), 0);
  const totalOTPay      = data.otRecords.reduce((s, r) => s + (Number(r.otPay)  || 0), 0);

  // OT by department
  const otByDept = DEPARTMENTS.map(dept => {
    const deptRecords = activeOT.filter(r => r.department === dept);
    const empCount    = new Set(deptRecords.map(r => r.employeeId || r.employeeName)).size;
    return { dept, count: empCount };
  }).filter(d => d.count > 0);

  // ── Stock ─────────────────────────────────────────────────────────────────
  const lowStock = data.products.filter(p => (p.stock || 0) < 10);

  // ── Stat Cards ────────────────────────────────────────────────────────────
  const statCards = [
    { label: 'Total Revenue',    value: totalRevenue.toFixed(2), icon: 'bi-currency-rupee',   color: 'card-green',  unit: '₹ ' },
    { label: 'Purchase Expense', value: totalExpense.toFixed(2), icon: 'bi-credit-card',       color: 'card-red',    unit: '₹ ' },
    { label: 'Profit',           value: profit.toFixed(2),       icon: 'bi-graph-up',          color: 'card-blue',   unit: '₹ ' },
    { label: 'Employees',        value: totalEmployees,          icon: 'bi-people',            color: 'card-orange'             },
    { label: 'Present Today',    value: present,                 icon: 'bi-check-circle',      color: 'card-green'              },
    { label: 'Clients',          value: data.clients.length,     icon: 'bi-person-lines-fill', color: 'card-blue'               },
  ];

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's your business overview.</p>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        {statCards.slice(0, 3).map((card, i) => (
          <div className="col-md-4 col-12" key={i}>
            <div className={`shadow-sm ${card.color}`} style={statCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={statLabelStyle}>{card.label}</div>
                <div style={statIconStyle}><i className={`bi ${card.icon}`}></i></div>
              </div>
              <div style={statValueStyle}>{card.unit || ""}{card.value}</div>
            </div>
          </div>
        ))}
        {statCards.slice(3).map((card, i) => (
          <div className="col-md-4 col-12" key={i + 3}>
            <div className={`shadow-sm ${card.color}`} style={statCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={statLabelStyle}>{card.label}</div>
                <div style={statIconStyle}><i className={`bi ${card.icon}`}></i></div>
              </div>
              <div style={{ ...statValueStyle, fontSize: '28px' }}>{card.unit || ""}{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Graph */}
      <div className="row g-3 mb-4">
        <div className="col-12">
          <div className="chart-placeholder shadow-sm">
            <h6 style={{ fontWeight: 700 }}>
              <i className="bi bi-bar-chart-fill me-2"></i>Revenue vs Expense
            </h6>
            <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
              <div>
                <p style={{ fontSize: 12 }}>Revenue</p>
                <div style={{ height: totalRevenue / 50, width: 40, background: "#1a7f37" }}></div>
              </div>
              <div>
                <p style={{ fontSize: 12 }}>Expense</p>
                <div style={{ height: totalExpense / 50, width: 40, background: "#cf222e" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row g-3">
        <div className="col-md-4">
          <div className="target-card shadow-sm p-3">
            <h6>Recent Invoices</h6>
            {data.invoices.length === 0 && <p style={{ color: "#aaa", fontSize: 13 }}>No invoices yet</p>}
            {data.invoices.slice(-3).map((i, idx) => (
              <p key={idx}>{i.invoiceNo} - ₹ {i.total}</p>
            ))}
          </div>
        </div>

        <div className="col-md-4">
          <div className="target-card shadow-sm p-3">
            <h6>Recent Purchase Bills</h6>
            {data.purchases.length === 0 && <p style={{ color: "#aaa", fontSize: 13 }}>No bills yet</p>}
            {data.purchases.slice(-3).map((p, idx) => (
              <p key={idx}>{p.billNo} - ₹ {p.grandTotal}</p>
            ))}
          </div>
        </div>

        <div className="col-md-4">
          <div className="target-card shadow-sm p-3">
            <h6>Recent Quotations</h6>
            {quoteSummary.totalQuotes > 0 && (
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 10px',
                marginBottom: 10, padding: '8px 10px',
                background: '#f6f8fa', borderRadius: 8, border: '1px solid #e1e8ed',
              }}>
                {[
                  { lbl: 'Total Quotes',   val: quoteSummary.totalQuotes,              mono: false, color: '#24292f' },
                  { lbl: 'Total Subtotal', val: inr(quoteSummary.totalSubtotal),       mono: true,  color: '#24292f' },
                  { lbl: 'Total Discount', val: inr(quoteSummary.totalDiscount),       mono: true,  color: '#cf222e' },
                  { lbl: 'Total Revenue',  val: inr(quoteSummary.totalRevenue),        mono: true,  color: '#bc4c00' },
                ].map(s => (
                  <div key={s.lbl}>
                    <div style={{ fontSize: 9.5, color: '#8c959f', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>{s.lbl}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: s.color, fontFamily: s.mono ? "'JetBrains Mono',monospace" : 'inherit' }}>{s.val}</div>
                  </div>
                ))}
              </div>
            )}
            {data.quotations.length === 0 && <p style={{ color: "#aaa", fontSize: 13 }}>No quotations yet</p>}
            {data.quotations.slice(-3).map((q, idx) => (
              <p key={idx} style={{ marginBottom: 4, fontSize: 13 }}>
                <span style={{ fontWeight: 600, color: '#bc4c00' }}>{q.quoteNo}</span>
                {' - '}
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{inr(q.total)}</span>
                {q.clientName && <span style={{ color: '#8c959f', fontSize: 11.5 }}> · {q.clientName}</span>}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Employee Status + OT Section */}
      <div className="row g-3 mt-2">

        {/* Employee Status */}
        <div className="col-md-4">
          <div className="target-card shadow-sm p-3" style={{ height: '100%' }}>
            <h6 style={{ fontWeight: 700, marginBottom: 12 }}>Employee Status</h6>
            <p style={{ marginBottom: 6 }}>Total Employees: <strong>{totalEmployees}</strong></p>
            <p style={{ marginBottom: 6 }}>Present: <strong style={{ color: '#1a7f37' }}>{present}</strong></p>
            <p style={{ marginBottom: 0 }}>Absent: <strong style={{ color: '#cf222e' }}>{absent}</strong></p>
          </div>
        </div>

        {/* OT Status */}
        <div className="col-md-4">
          <div className="target-card shadow-sm p-3" style={{ height: '100%' }}>
            <h6 style={{ fontWeight: 700, marginBottom: 12 }}>
              <i className="bi bi-clock-history me-2" style={{ color: '#bc4c00' }}></i>
              Overtime Status
            </h6>

            {/* Top summary row */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <div style={{ flex: 1, background: '#fff8f0', borderRadius: 8, padding: '6px 10px', border: '1px solid #f5d6b0' }}>
                <div style={{ fontSize: 10, color: '#8c959f', fontWeight: 700, textTransform: 'uppercase' }}>Total Employees</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#24292f' }}>{totalEmployees}</div>
              </div>
              <div style={{ flex: 1, background: '#fff8f0', borderRadius: 8, padding: '6px 10px', border: '1px solid #f5d6b0' }}>
                <div style={{ fontSize: 10, color: '#8c959f', fontWeight: 700, textTransform: 'uppercase' }}>On OT</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#bc4c00' }}>{totalOnOT}</div>
              </div>
            </div>

            {/* By department */}
            <div style={{ fontSize: 11, color: '#8c959f', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              By Department
            </div>

            {otByDept.length === 0 ? (
              <p style={{ fontSize: 13, color: '#aaa', marginBottom: 0 }}>No active OT records</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {DEPARTMENTS.map(dept => {
                  const entry = otByDept.find(d => d.dept === dept);
                  if (!entry) return null;
                  return (
                    <div key={dept} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13 }}>{dept}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#bc4c00' }}>{entry.count}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="col-md-4">
          <div className="target-card shadow-sm p-3" style={{ height: '100%' }}>
            <h6 style={{ fontWeight: 700, marginBottom: 12 }}>Low Stock Alert</h6>
            {lowStock.length === 0
              ? <p style={{ marginBottom: 0 }}>No low stock</p>
              : lowStock.map((p, i) => <p key={i} style={{ marginBottom: 6 }}>{p.name} - <strong style={{ color: '#cf222e' }}>{p.stock}</strong></p>)
            }
          </div>
        </div>

      </div>
    </>
  );
}