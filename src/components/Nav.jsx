import { NavLink } from "react-router-dom";
import { useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/pricing-tool", label: "Pricing Tool" },
  { to: "/quote-builder", label: "Quote Builder" },
  { to: "/dashboard", label: "Dashboard" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  const linkStyle = ({ isActive }) => ({
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    fontWeight: 600,
    color: isActive ? "#c8782a" : "#8a7560",
    textDecoration: "none",
    padding: "6px 12px",
    borderRadius: 99,
    background: isActive ? "rgba(200,120,42,0.1)" : "transparent",
    transition: "all 0.15s",
    letterSpacing: "0.02em",
  });

  return (
    <nav
      style={{
        background: "#1a1209",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 56,
        }}
      >
        {/* Logo */}
        <NavLink
          to="/"
          style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "linear-gradient(135deg, #c8782a, #e8952e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            🖌️
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 18,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            PAINTER<span style={{ color: "#e8952e" }}>OS</span>
          </span>
        </NavLink>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}
             className="hidden sm:flex">
          {links.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === "/"} style={linkStyle}>
              {label}
            </NavLink>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            background: "none",
            border: "none",
            color: "#8a7560",
            cursor: "pointer",
            fontSize: 22,
            lineHeight: 1,
            padding: 4,
          }}
          className="flex sm:hidden"
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "12px 0 16px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
          className="flex sm:hidden flex-col"
        >
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              style={linkStyle}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
