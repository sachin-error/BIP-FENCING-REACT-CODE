import { useEffect, useState } from "react";

const fmt2 = (n) =>
  Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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

  useEffect(() => {
    setData({
      invoices: JSON.parse(localStorage.getItem("invoices")) || [],
      purchases: JSON.parse(localStorage.getItem("purchaseBills")) || [],
      quotations: JSON.parse(localStorage.getItem("quotes")) || [],
      employees: JSON.parse(localStorage.getItem("employees")) || [],
      attendance: JSON.parse(localStorage.getItem("attendance")) || [],
      clients: JSON.parse(localStorage.getItem("clients")) || [],
      products: JSON.parse(localStorage.getItem("products")) || [],
    });
  }, []);

  // 🔢 CALCULATIONS
  const totalRevenue = data.invoices.reduce((s, i) => s + (i.total || 0), 0);
  const totalExpense = data.purchases.reduce((s, p) => s + (p.grandTotal || 0), 0);
  const profit = totalRevenue - totalExpense;

  const present = data.attendance.filter(a => a.status === "Present").length;
  const absent = data.attendance.filter(a => a.status === "Absent").length;

  const lowStock = data.products.filter(p => (p.stock || 0) < 10);

  // 🔷 STAT CARDS
  const statCards = [
    { label: 'Total Revenue', value: fmt2(totalRevenue), icon: 'bi-currency-rupee', color: 'card-green', unit: '₹ ' },
    { label: 'Purchase Expense', value: fmt2(totalExpense), icon: 'bi-credit-card', color: 'card-red', unit: '₹ ' },
    { label: 'Profit', value: fmt2(profit), icon: 'bi-graph-up', color: 'card-blue', unit: '₹ ' },
    { label: 'Employees', value: data.employees.length, icon: 'bi-people', color: 'card-orange' },
    { label: 'Present Today', value: present, icon: 'bi-check-circle', color: 'card-green' },
    { label: 'Clients', value: data.clients.length, icon: 'bi-person-lines-fill', color: 'card-blue' },
  ];

  return (
    <>
      {/* ── PAGE HEADER with Clear Button ── */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your business overview.</p>
        </div>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => {
            if (window.confirm("Clear all invoice data? This cannot be undone.")) {
              localStorage.removeItem("invoices");
              window.location.reload();
            }
          }}
        >
          🗑️ Clear Invoice Data
        </button>
      </div>

      {/* 🔥 SUMMARY CARDS */}
      <div className="row g-3 mb-4">
        {statCards.map((card, i) => (
          <div className="col-xl-2 col-md-4 col-6" key={i}>
            <div className={`stat-card shadow-sm ${card.color}`}>
              <div className="stat-icon">
                <i className={`bi ${card.icon}`}></i>
              </div>
              <div className="stat-label">{card.label}</div>
              <div className="stat-value">
                {card.unit || ""}{card.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 📊 REVENUE VS EXPENSE CHART */}
      <div className="row g-3 mb-4">
        <div className="col-12">
          <div className="chart-placeholder shadow-sm">
            <h6 style={{ fontWeight: 700 }}>
              <i className="bi bi-bar-chart-fill me-2"></i>
              Revenue vs Expense
            </h6>

            {totalRevenue === 0 && totalExpense === 0 ? (
              <p style={{ color: "#8c959f", fontSize: 13, marginTop: 16 }}>
                No data yet. Create invoices and purchase bills to see the chart.
              </p>
            ) : (
              (() => {
                const max = Math.max(totalRevenue, totalExpense, 1);
                const scale = (val) => Math.max((val / max) * 180, val > 0 ? 8 : 0);
                return (
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 32, marginTop: 24, paddingBottom: 8 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#1a7f37" }}>₹ {fmt2(totalRevenue)}</span>
                      <div style={{ height: scale(totalRevenue), width: 52, background: "#1a7f37", borderRadius: "4px 4px 0 0", transition: "height 0.4s" }}></div>
                      <span style={{ fontSize: 12, color: "#57606a" }}>Revenue</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#cf222e" }}>₹ {fmt2(totalExpense)}</span>
                      <div style={{ height: scale(totalExpense), width: 52, background: "#cf222e", borderRadius: "4px 4px 0 0", transition: "height 0.4s" }}></div>
                      <span style={{ fontSize: 12, color: "#57606a" }}>Expense</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: profit >= 0 ? "#0969da" : "#cf222e" }}>₹ {fmt2(profit)}</span>
                      <div style={{ height: scale(Math.abs(profit)), width: 52, background: profit >= 0 ? "#0969da" : "#cf222e", borderRadius: "4px 4px 0 0", transition: "height 0.4s" }}></div>
                      <span style={{ fontSize: 12, color: "#57606a" }}>Profit</span>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      </div>

      {/* 📋 RECENT ACTIVITY */}
      <div className="row g-3">

        {/* ✅ FIXED: Recent Invoices — reads from localStorage saved by TaxInvoice.jsx */}
        <div className="col-md-4">
          <div className="target-card shadow-sm p-3">
            <h6>Recent Invoices</h6>
            {data.invoices.length === 0 ? (
              <p style={{ color: "#8c959f", fontSize: 13 }}>No invoices yet.</p>
            ) : (
              [...data.invoices].reverse().slice(0, 3).map((inv, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                  <span style={{ fontWeight: 600 }}>{inv.invoiceNo}</span>
                  <span style={{ color: "#1a7f37" }}>₹ {Number(inv.total || 0).toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="col-md-4">
          <div className="target-card shadow-sm p-3">
            <h6>Recent Purchase Bills</h6>
            {data.purchases.length === 0 ? (
              <p style={{ color: "#8c959f", fontSize: 13 }}>No purchase bills yet.</p>
            ) : (
              [...data.purchases].reverse().slice(0, 3).map((p, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                  <span style={{ fontWeight: 600 }}>{p.billNo}</span>
                  <span style={{ color: "#cf222e" }}>₹ {Number(p.grandTotal || 0).toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="col-md-4">
          <div className="target-card shadow-sm p-3">
            <h6>Recent Quotations</h6>
            {data.quotations.length === 0 ? (
              <p style={{ color: "#8c959f", fontSize: 13 }}>No quotations yet.</p>
            ) : (
              [...data.quotations].reverse().slice(0, 3).map((q, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                  <span style={{ fontWeight: 600 }}>{q.quoteNo}</span>
                  <span style={{ color: "#0969da" }}>₹ {Number(q.total || 0).toFixed(2)}</span>
                </div>
              ))
            )}
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