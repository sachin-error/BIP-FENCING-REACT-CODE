import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function DropdownItem({ label, icon, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="nav-item-link" onClick={() => setOpen(!open)}>
        <i className={`bi ${icon}`}></i>
        <span>{label}</span>
        <i className={`bi bi-chevron-right chevron ${open ? 'open' : ''}`}></i>
      </div>
      <div className="nav-dropdown-items" style={{ maxHeight: open ? '500px' : '0' }}>
        {children}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #0969da, #58a6ff)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, color: 'white', fontWeight: 700, flexShrink: 0
          }}>B</div>
          <div>
            <div className="brand-name">Bip Fencing</div>
            <div className="brand-sub">Admin Panel</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main</div>

        <NavLink to="/dashboard" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-grid-1x2-fill"></i>
          <span>Dashboard</span>
        </NavLink>

        <div className="nav-section-label">Billing</div>

        <DropdownItem label="Billing" icon="bi-receipt">
          <NavLink to="/tax-invoice" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-file-earmark-text"></i><span>Tax Invoice</span>
          </NavLink>
          <NavLink to="/purchase-bill" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-bag-check"></i><span>Purchase Bill</span>
          </NavLink>
          <NavLink to="/quotation" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-file-earmark-spreadsheet"></i><span>Quotation</span>
          </NavLink>
        </DropdownItem>

        <div className="nav-section-label">Inventory</div>

        <DropdownItem label="Stock Management" icon="bi-boxes">
          <NavLink to="/purchase-inventory" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-cart-plus"></i><span>Purchase Inventory</span>
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-box-seam"></i><span>Products</span>
          </NavLink>
        </DropdownItem>

        <div className="nav-section-label">HR</div>

        <DropdownItem label="Staff Management" icon="bi-people">
          <NavLink to="/salary" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-cash-stack"></i><span>Salary</span>
          </NavLink>
          <NavLink to="/attendance" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-calendar-check"></i><span>Attendance</span>
          </NavLink>
          <NavLink to="/ot" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-clock-history"></i><span>OT</span>
          </NavLink>
        </DropdownItem>

        <div className="nav-section-label">CRM</div>

        <NavLink to="/clients" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-person-lines-fill"></i>
          <span>Clients</span>
        </NavLink>

        <div style={{ padding: '12px 0 8px' }}>
          <div style={{ height: 1, background: '#1c2333', margin: '0 16px 12px' }}></div>
          <button className="nav-item-link sidebar-logout-btn" onClick={logout} style={{ color: '#f85149' }}>
            <i className="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
