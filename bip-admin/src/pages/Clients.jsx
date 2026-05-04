// import { useEffect, useState } from "react";

// export default function Dashboard() {
//   const [data, setData] = useState({
//     invoices: [],
//     purchases: [],
//     quotations: [],
//     employees: [],
//     attendance: [],
//     clients: [],
//     products: [],
//   });

//   useEffect(() => {
//     setData({
//       invoices: JSON.parse(localStorage.getItem("invoices")) || [],
//       purchases: JSON.parse(localStorage.getItem("purchaseBills")) || [],
//       quotations: JSON.parse(localStorage.getItem("quotes")) || [],
//       employees: JSON.parse(localStorage.getItem("employees")) || [],
//       attendance: JSON.parse(localStorage.getItem("attendance")) || [],
//       clients: JSON.parse(localStorage.getItem("clients")) || [],
//       products: JSON.parse(localStorage.getItem("products")) || [],
//     });
//   }, []);

//   // 🔢 CALCULATIONS
//   const totalRevenue = data.invoices.reduce((s, i) => s + (i.total || 0), 0);
//   const totalExpense = data.purchases.reduce((s, p) => s + (p.grandTotal || 0), 0);
//   const profit = totalRevenue - totalExpense;

//   const present = data.attendance.filter(a => a.status === "Present").length;
//   const absent = data.attendance.filter(a => a.status === "Absent").length;

//   const lowStock = data.products.filter(p => (p.stock || 0) < 10);

//   // 🔷 STAT CARDS (UPDATED)
//   const statCards = [
//     { label: 'Total Revenue', value: totalRevenue.toFixed(2), icon: 'bi-currency-rupee', color: 'card-green', unit: '₹ ' },
//     { label: 'Purchase Expense', value: totalExpense.toFixed(2), icon: 'bi-credit-card', color: 'card-red', unit: '₹ ' },
//     { label: 'Profit', value: profit.toFixed(2), icon: 'bi-graph-up', color: 'card-blue', unit: '₹ ' },
//     { label: 'Employees', value: data.employees.length, icon: 'bi-people', color: 'card-orange' },
//     { label: 'Present Today', value: present, icon: 'bi-check-circle', color: 'card-green' },
//     { label: 'Clients', value: data.clients.length, icon: 'bi-person-lines-fill', color: 'card-blue' },
//   ];

//   return (
//     <>
//       <div className="page-header">
//         <h1>Dashboard</h1>
//         <p>Welcome back! Here's your business overview.</p>
//       </div>

//       {/* 🔥 SUMMARY CARDS */}
//       <div className="row g-3 mb-4">
//         {statCards.map((card, i) => (
//           <div className="col-xl-2 col-md-4 col-6" key={i}>
//             <div className={`stat-card shadow-sm ${card.color}`}>
//               <div className="stat-icon">
//                 <i className={`bi ${card.icon}`}></i>
//               </div>
//               <div className="stat-label">{card.label}</div>
//               <div className="stat-value">
//                 {card.unit || ""}{card.value}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* 📊 SIMPLE GRAPH (USING YOUR STYLE) */}
//       <div className="row g-3 mb-4">
//         <div className="col-12">
//           <div className="chart-placeholder shadow-sm">
//             <h6 style={{ fontWeight: 700 }}>
//               <i className="bi bi-bar-chart-fill me-2"></i>
//               Revenue vs Expense
//             </h6>

//             <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
//               <div>
//                 <p style={{ fontSize: 12 }}>Revenue</p>
//                 <div style={{ height: totalRevenue / 50, width: 40, background: "#1a7f37" }}></div>
//               </div>

//               <div>
//                 <p style={{ fontSize: 12 }}>Expense</p>
//                 <div style={{ height: totalExpense / 50, width: 40, background: "#cf222e" }}></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 📋 RECENT ACTIVITY */}
//       <div className="row g-3">

//         <div className="col-md-4">
//           <div className="target-card shadow-sm p-3">
//             <h6>Recent Invoices</h6>
//             {data.invoices.slice(-3).map((i, idx) => (
//               <p key={idx}>{i.invoiceNo} - ₹ {i.total}</p>
//             ))}
//           </div>
//         </div>

//         <div className="col-md-4">
//           <div className="target-card shadow-sm p-3">
//             <h6>Recent Purchase Bills</h6>
//             {data.purchases.slice(-3).map((p, idx) => (
//               <p key={idx}>{p.billNo} - ₹ {p.grandTotal}</p>
//             ))}
//           </div>
//         </div>

//         <div className="col-md-4">
//           <div className="target-card shadow-sm p-3">
//             <h6>Recent Quotations</h6>
//             {data.quotations.slice(-3).map((q, idx) => (
//               <p key={idx}>{q.quoteNo} - ₹ {q.total}</p>
//             ))}
//           </div>
//         </div>

//       </div>

//       {/* 🧑‍💼 EMPLOYEE + STOCK */}
//       <div className="row g-3 mt-2">

//         <div className="col-md-6">
//           <div className="target-card shadow-sm p-3">
//             <h6>Employee Status</h6>
//             <p>Present: {present}</p>
//             <p>Absent: {absent}</p>
//           </div>
//         </div>

//         <div className="col-md-6">
//           <div className="target-card shadow-sm p-3">
//             <h6>Low Stock Alert</h6>
//             {lowStock.length === 0 && <p>No low stock</p>}
//             {lowStock.map((p, i) => (
//               <p key={i}>{p.name} - {p.stock}</p>
//             ))}
//           </div>
//         </div>

//       </div>
//     </>
//   );
// }

import { useEffect, useState } from "react";

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
    // Seed sample clients into localStorage if none exist yet
    if (!localStorage.getItem("clients")) {
      const sampleClients = [
        { id: 1, name: "ABC Constructions" },
        { id: 2, name: "XYZ Developers" },
        { id: 3, name: "Global Infra Ltd" },
        { id: 4, name: "City Builders" },
        { id: 5, name: "Horizon Projects" },
        { id: 6, name: "SkyLine Corp" },
      ];
      localStorage.setItem("clients", JSON.stringify(sampleClients));
    }

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

  // 🔷 STAT CARDS (UPDATED)
  const statCards = [
    { label: 'Total Revenue', value: totalRevenue.toFixed(2), icon: 'bi-currency-rupee', color: 'card-green', unit: '₹ ' },
    { label: 'Purchase Expense', value: totalExpense.toFixed(2), icon: 'bi-credit-card', color: 'card-red', unit: '₹ ' },
    { label: 'Profit', value: profit.toFixed(2), icon: 'bi-graph-up', color: 'card-blue', unit: '₹ ' },
    { label: 'Employees', value: data.employees.length, icon: 'bi-people', color: 'card-orange' },
    { label: 'Present Today', value: present, icon: 'bi-check-circle', color: 'card-green' },
    { label: 'Clients', value: data.clients.length, icon: 'bi-person-lines-fill', color: 'card-blue' },
  ];

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's your business overview.</p>
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

      {/* 📊 SIMPLE GRAPH (USING YOUR STYLE) */}
      <div className="row g-3 mb-4">
        <div className="col-12">
          <div className="chart-placeholder shadow-sm">
            <h6 style={{ fontWeight: 700 }}>
              <i className="bi bi-bar-chart-fill me-2"></i>
              Revenue vs Expense
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
            {data.invoices.slice(-3).map((i, idx) => (
              <p key={idx}>{i.invoiceNo} - ₹ {i.total}</p>
            ))}
          </div>
        </div>

        <div className="col-md-4">
          <div className="target-card shadow-sm p-3">
            <h6>Recent Purchase Bills</h6>
            {data.purchases.slice(-3).map((p, idx) => (
              <p key={idx}>{p.billNo} - ₹ {p.grandTotal}</p>
            ))}
          </div>
        </div>

        <div className="col-md-4">
          <div className="target-card shadow-sm p-3">
            <h6>Recent Quotations</h6>
            {data.quotations.slice(-3).map((q, idx) => (
              <p key={idx}>{q.quoteNo} - ₹ {q.total}</p>
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