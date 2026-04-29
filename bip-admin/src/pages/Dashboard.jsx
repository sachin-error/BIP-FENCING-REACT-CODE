const barHeights = [55, 80, 45, 90, 65, 100, 75];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const statCards = [
  { label: 'Invoices Today', value: '0', icon: 'bi-file-earmark-check', color: 'card-blue', badge: 'Today', unit: '' },
  { label: 'Sales Today', value: '0.00', icon: 'bi-currency-exchange', color: 'card-green', badge: 'AED', unit: 'AED ' },
  { label: 'Invoices in Month', value: '0', icon: 'bi-calendar3', color: 'card-red', badge: 'Month', unit: '' },
  { label: 'Sales in Month', value: '0.00', icon: 'bi-graph-up-arrow', color: 'card-orange', badge: 'AED', unit: 'AED ' },
];

const targets = [
  { label: 'Expected Income', icon: 'bi-wallet2', color: '#0969da', bg: '#ddf4ff', progress: 0, value: 'AED 0.00' },
  { label: 'Expected Expenses', icon: 'bi-credit-card', color: '#cf222e', bg: '#fff1f0', progress: 0, value: 'AED 0.00' },
  { label: 'Expected Sales', icon: 'bi-bag-heart', color: '#1a7f37', bg: '#dafbe1', progress: 0, value: 'AED 0.00' },
  { label: 'Expected Invoices', icon: 'bi-receipt-cutoff', color: '#bc4c00', bg: '#fff1e5', progress: 0, value: '0' },
];

export default function Dashboard() {
  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your business today.</p>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {statCards.map((card, i) => (
          <div className="col-xl-3 col-md-6" key={i}>
            <div className={`stat-card shadow-sm ${card.color}`}>
              <span className="stat-badge" style={{ background: 'rgba(255,255,255,0.2)' }}>
                {card.badge}
              </span>
              <div className="stat-icon" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <i className={`bi ${card.icon}`}></i>
              </div>
              <div className="stat-label">{card.label}</div>
              <div className="stat-value">{card.unit}{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="row g-3 mb-4">
        <div className="col-12">
          <div className="chart-placeholder shadow-sm">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h6 style={{ fontWeight: 700, fontSize: 15, margin: 0, color: '#0d1117' }}>
                  <i className="bi bi-bar-chart-fill me-2" style={{ color: '#0969da' }}></i>
                  Sales: Last 7 Active Days
                </h6>
                <p style={{ margin: 0, fontSize: 12.5, color: '#57606a', marginTop: 2 }}>
                  Weekly performance overview
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 11, background: '#ddf4ff', color: '#0969da', padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>
                  This Week
                </span>
              </div>
            </div>

            <div className="chart-area">
              <div className="chart-bars" style={{ width: '100%', padding: '0 32px' }}>
                {barHeights.map((h, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div
                      className="chart-bar"
                      style={{ height: h * 1.1, width: '100%', maxWidth: 48 }}
                    ></div>
                    <span style={{ fontSize: 10.5, color: '#57606a', fontWeight: 600 }}>{days[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 14 }}>
              <span style={{ fontSize: 12, color: '#57606a', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#0969da', display: 'inline-block' }}></span>
                Total Sales
              </span>
              <span style={{ fontSize: 12, color: '#57606a', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#1a7f37', display: 'inline-block' }}></span>
                Invoices
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Targets */}
      <div style={{ marginBottom: 10 }}>
        <h6 style={{ fontWeight: 700, fontSize: 14, color: '#0d1117', marginBottom: 14 }}>
          <i className="bi bi-bullseye me-2" style={{ color: '#0969da' }}></i>
          Monthly Targets
        </h6>
      </div>
      <div className="row g-3">
        {targets.map((t, i) => (
          <div className="col-xl-3 col-md-6" key={i}>
            <div className="target-card shadow-sm">
              <div className="target-icon" style={{ background: t.bg, color: t.color }}>
                <i className={`bi ${t.icon}`}></i>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#57606a', marginBottom: 4 }}>{t.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#0d1117', fontFamily: 'JetBrains Mono, monospace', letterSpacing: -0.5 }}>{t.value}</div>
              <div className="progress">
                <div className="progress-bar" role="progressbar" style={{ width: `${t.progress}%`, background: t.color }} />
              </div>
              <div style={{ fontSize: 11, color: '#8c959f', marginTop: 5 }}>0% of target reached</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
