import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const fmt = (n) =>
  "$" +
  Number(n || 0).toLocaleString("en-AU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });

const statusColor = { sent: "#6ab0d8", accepted: "#7ec882", pending: "#e8952e" };

export default function DashboardPage() {
  const { savedQuotes, deleteQuote } = useApp();
  const navigate = useNavigate();

  const totalRevenue = savedQuotes.reduce((s, q) => s + (q.total || 0), 0);
  const totalGst = savedQuotes.reduce((s, q) => s + (q.gst || 0), 0);
  const avgQuote = savedQuotes.length ? totalRevenue / savedQuotes.length : 0;

  const cardStyle = {
    background: "#fffdf9",
    border: "1.5px solid #ede4d8",
    borderRadius: 16,
    padding: "20px 18px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  };

  return (
    <div style={{ background: "#f7f1e8", minHeight: "100vh", padding: "0 0 64px" }}>
      {/* Header */}
      <div style={{ background: "#1a1209", padding: "32px 24px 28px", textAlign: "center" }}>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 900,
            color: "#fff",
            margin: "0 0 8px",
          }}
        >
          Business <span style={{ color: "#e8952e" }}>Dashboard</span>
        </h1>
        <p
          style={{
            color: "#8a7560",
            fontSize: 14,
            margin: 0,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          All your quotes in one place.
        </p>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 16px" }}>
        {/* Summary cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 14,
            marginBottom: 28,
          }}
        >
          {[
            {
              label: "Total Quoted",
              value: fmt(totalRevenue),
              sub: `${savedQuotes.length} quote${savedQuotes.length !== 1 ? "s" : ""}`,
              highlight: true,
            },
            {
              label: "Avg Quote Value",
              value: fmt(avgQuote),
              sub: "incl. GST",
            },
            {
              label: "Total GST",
              value: fmt(totalGst),
              sub: "to remit to ATO",
            },
            {
              label: "Quotes This Month",
              value: savedQuotes.filter((q) => {
                const d = new Date(q.createdAt);
                const now = new Date();
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              }).length,
              sub: new Date().toLocaleString("en-AU", { month: "long", year: "numeric" }),
            },
          ].map(({ label, value, sub, highlight }) => (
            <div
              key={label}
              style={{
                ...cardStyle,
                background: highlight
                  ? "linear-gradient(135deg, #c8782a 0%, #e8952e 100%)"
                  : "#fffdf9",
                border: highlight ? "none" : "1.5px solid #ede4d8",
                boxShadow: highlight
                  ? "0 8px 28px rgba(200,120,42,0.25)"
                  : "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: highlight ? "rgba(255,255,255,0.75)" : "#8a7560",
                  margin: "0 0 6px",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {label}
              </p>
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 24,
                  fontWeight: 700,
                  color: highlight ? "#fff" : "#1a1209",
                  margin: "0 0 4px",
                  lineHeight: 1.1,
                }}
              >
                {value}
              </p>
              {sub && (
                <p
                  style={{
                    fontSize: 12,
                    color: highlight ? "rgba(255,255,255,0.65)" : "#b0a090",
                    margin: 0,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {sub}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Quotes table */}
        {savedQuotes.length === 0 ? (
          <div
            style={{
              ...cardStyle,
              textAlign: "center",
              padding: "60px 24px",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 22,
                color: "#1a1209",
                margin: "0 0 10px",
              }}
            >
              No quotes yet
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "#8a7560",
                margin: "0 0 24px",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Head over to the Quote Builder and create your first quote.
            </p>
            <button
              onClick={() => navigate("/quote-builder")}
              style={{
                background: "linear-gradient(135deg, #c8782a, #e8952e)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "12px 24px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Build Your First Quote →
            </button>
          </div>
        ) : (
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h2
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#c8782a",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                Saved Quotes
              </h2>
              <button
                onClick={() => navigate("/quote-builder")}
                style={{
                  background: "#1a1209",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "7px 14px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                + New Quote
              </button>
            </div>

            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 120px 100px 110px 40px",
                gap: 8,
                padding: "0 8px 10px",
                borderBottom: "1px solid #ede4d8",
              }}
            >
              {["Job / Client", "Trade", "Date", "Total (incl. GST)", ""].map((h) => (
                <span
                  key={h}
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#8a7560",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {h}
                </span>
              ))}
            </div>

            {savedQuotes.map((q, i) => (
              <div
                key={q.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 120px 100px 110px 40px",
                  gap: 8,
                  padding: "14px 8px",
                  borderBottom: i < savedQuotes.length - 1 ? "1px solid #f0ebe2" : "none",
                  alignItems: "center",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#1a1209",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {q.jobTitle || "Untitled job"}
                  </p>
                  {q.client?.name && (
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: 12,
                        color: "#8a7560",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {q.client.name}
                    </p>
                  )}
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#8a7560",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {q.trade}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#8a7560",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {fmtDate(q.jobDate || q.createdAt)}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#1a1209",
                  }}
                >
                  {fmt(q.total)}
                </span>
                <button
                  onClick={() => deleteQuote(q.id)}
                  title="Delete"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#c05020",
                    fontSize: 18,
                    padding: 0,
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tips strip */}
        <div
          style={{
            background: "#1a1209",
            borderRadius: 20,
            padding: "24px 20px",
            marginTop: 20,
          }}
        >
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 16,
              color: "#fff",
              margin: "0 0 14px",
            }}
          >
            Quick Tips
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
            }}
          >
            {[
              { icon: "💡", tip: "Follow up quotes within 48 hours — conversion drops 80% after 72 hours." },
              { icon: "📅", tip: "Quote valid for 30 days. Always include this in your terms." },
              { icon: "💰", tip: "Require a 30–50% deposit before starting any job over $2,000." },
            ].map(({ icon, tip }) => (
              <div key={tip} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <p
                  style={{
                    fontSize: 13,
                    color: "#8a7560",
                    margin: 0,
                    lineHeight: 1.6,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
