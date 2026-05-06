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

export default function Dashboard() {
  const [data, setData] = useState({
    invoices: [],
    purchases: [],
    quotations: [],
    employees: [],
    attendance: [],
    clients: [],
    products: [],
  });

  const [quoteSummary, setQuoteSummary] = useState({
    totalQuotes: 0,
    totalSubtotal: 0,
    totalDiscount: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    setData({
      invoices:   JSON.parse(localStorage.getItem("invoices"))      || [],
      purchases:  JSON.parse(localStorage.getItem("purchaseBills")) || [],
      quotations: JSON.parse(localStorage.getItem("quotes"))        || [],
      employees:  JSON.parse(localStorage.getItem("employees"))     || [],
      attendance: JSON.parse(localStorage.getItem("attendance"))    || [],
      clients:    JSON.parse(localStorage.getItem("clients"))       || [],
      products:   JSON.parse(localStorage.getItem("products"))      || [],
    });

    const saved = localStorage.getItem("quotes_summary");
    if (saved) {
      try { setQuoteSummary(JSON.parse(saved)); } catch (_) {}
    }
  }, []);

  // 🔢 CALCULATIONS
  const totalRevenue = data.invoices.reduce((s, i) => s + (i.total || 0), 0);
  const totalExpense = data.purchases.reduce((s, p) => s + (p.grandTotal || 0), 0);
  const profit = totalRevenue - totalExpense;

  const present = data.attendance.filter(a => a.status === "Present").length;
  const absent  = data.attendance.filter(a => a.status === "Absent").length;

  const lowStock = data.products.filter(p => (p.stock || 0) < 10);

  // 🔷 STAT CARDS
  const statCards = [
    { label: 'Total Revenue',    value: totalRevenue.toFixed(2), icon: 'bi-currency-rupee',   color: 'card-green',  unit: '₹ ' },
    { label: 'Purchase Expense', value: totalExpense.toFixed(2), icon: 'bi-credit-card',       color: 'card-red',    unit: '₹ ' },
    { label: 'Profit',           value: profit.toFixed(2),       icon: 'bi-graph-up',          color: 'card-blue',   unit: '₹ ' },
    { label: 'Employees',        value: data.employees.length,   icon: 'bi-people',            color: 'card-orange'             },
    { label: 'Present Today',    value: present,                 icon: 'bi-check-circle',      color: 'card-green'              },
    { label: 'Clients',          value: data.clients.length,     icon: 'bi-person-lines-fill', color: 'card-blue'               },
  ];

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's your business overview.</p>
      </div>

      {/* 🔥 SUMMARY CARDS — Row 1: financial (3 cards), Row 2: counts (3 cards) */}
      <div className="row g-3 mb-4">

        {/* Row 1 — financial cards with large rupee values */}
        {statCards.slice(0, 3).map((card, i) => (
          <div className="col-md-4 col-12" key={i}>
            <div className={`shadow-sm ${card.color}`} style={statCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={statLabelStyle}>{card.label}</div>
                <div style={statIconStyle}><i className={`bi ${card.icon}`}></i></div>
              </div>
              <div style={statValueStyle}>
                {card.unit || ""}{card.value}
              </div>
            </div>
          </div>
        ))}

        {/* Row 2 — count cards with small numbers, bigger font */}
        {statCards.slice(3).map((card, i) => (
          <div className="col-md-4 col-12" key={i + 3}>
            <div className={`shadow-sm ${card.color}`} style={statCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={statLabelStyle}>{card.label}</div>
                <div style={statIconStyle}><i className={`bi ${card.icon}`}></i></div>
              </div>
              <div style={{ ...statValueStyle, fontSize: '28px' }}>
                {card.unit || ""}{card.value}
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* 📊 SIMPLE GRAPH */}
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

      {/* 📋 RECENT ACTIVITY */}
      <div className="row g-3">

        <div className="col-md-4">
          <div className="target-card shadow-sm p-3">
            <h6>Recent Invoices</h6>
            {data.invoices.length === 0 && <p style={{ color:"#aaa", fontSize:13 }}>No invoices yet</p>}
            {data.invoices.slice(-3).map((i, idx) => (
              <p key={idx}>{i.invoiceNo} - ₹ {i.total}</p>
            ))}
          </div>
        </div>

        <div className="col-md-4">
          <div className="target-card shadow-sm p-3">
            <h6>Recent Purchase Bills</h6>
            {data.purchases.length === 0 && <p style={{ color:"#aaa", fontSize:13 }}>No bills yet</p>}
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
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '6px 10px',
                marginBottom: 10,
                padding: '8px 10px',
                background: '#f6f8fa',
                borderRadius: 8,
                border: '1px solid #e1e8ed',
              }}>
                {[
                  { lbl: 'Total Quotes',   val: quoteSummary.totalQuotes,           mono: false, color: '#24292f' },
                  { lbl: 'Total Subtotal', val: inr(quoteSummary.totalSubtotal),    mono: true,  color: '#24292f' },
                  { lbl: 'Total Discount', val: inr(quoteSummary.totalDiscount),    mono: true,  color: '#cf222e' },
                  { lbl: 'Total Revenue',  val: inr(quoteSummary.totalRevenue),     mono: true,  color: '#bc4c00' },
                ].map(s => (
                  <div key={s.lbl}>
                    <div style={{ fontSize: 9.5, color: '#8c959f', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                      {s.lbl}
                    </div>
                    <div style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: s.color,
                      fontFamily: s.mono ? "'JetBrains Mono',monospace" : 'inherit',
                    }}>
                      {s.val}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {data.quotations.length === 0 && <p style={{ color:"#aaa", fontSize:13 }}>No quotations yet</p>}
            {data.quotations.slice(-3).map((q, idx) => (
              <p key={idx} style={{ marginBottom: 4, fontSize: 13 }}>
                <span style={{ fontWeight: 600, color: '#bc4c00' }}>{q.quoteNo}</span>
                {' - '}
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>
                  {inr(q.total)}
                </span>
                {q.clientName && (
                  <span style={{ color: '#8c959f', fontSize: 11.5 }}> · {q.clientName}</span>
                )}
              </p>
            ))}
          </div>
        </div>

      </div>

      {/* 🧑‍💼 EMPLOYEE + STOCK */}
      <div className="row g-3 mt-2">

        <div className="col-md-6">
          <div className="target-card shadow-sm p-3">
            <h6>Employee Status</h6>
            <p>Present: {present}</p>
            <p>Absent: {absent}</p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="target-card shadow-sm p-3">
            <h6>Low Stock Alert</h6>
            {lowStock.length === 0 && <p>No low stock</p>}
            {lowStock.map((p, i) => (
              <p key={i}>{p.name} - {p.stock}</p>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}