export default function Footer() {
  return (
    <footer
      style={{
        background: "#1a1209",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "32px 24px",
        textAlign: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 16,
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 8px",
          }}
        >
          PAINTER<span style={{ color: "#e8952e" }}>OS</span>
        </p>
        <p style={{ fontSize: 13, color: "#8a7560", margin: 0 }}>
          Built for Australian painters. Run your business, not just your brush.
        </p>
        <p style={{ fontSize: 11, color: "#4a3a2a", margin: "16px 0 0" }}>
          © {new Date().getFullYear()} TradeOS · All prices in AUD
        </p>
      </div>
    </footer>
  );
}
