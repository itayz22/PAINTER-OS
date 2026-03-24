import { useState } from "react";
import { useApp } from "../context/AppContext";

const TRADES = [
  "Painter", "Electrician", "Plumber", "Builder", "Plasterer",
  "Tiler", "Landscaper", "Flooring Installer", "Carpenter", "Roofer",
];

const GST_RATE = 0.1;

const fmt = (n) =>
  "$" + Number(n || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function newLine() {
  return { id: Date.now() + Math.random(), desc: "", qty: 1, unit: "hr", rate: 0 };
}

const UNITS = ["hr", "m²", "m", "day", "item", "allow", "m³", "kg", "L"];

export default function QuoteBuilderPage() {
  const { selectedTrade, setSelectedTrade, addQuote } = useApp();

  const [client, setClient] = useState({ name: "", address: "", email: "", phone: "" });
  const [jobTitle, setJobTitle] = useState("");
  const [jobDate, setJobDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState([newLine()]);
  const [margin, setMargin] = useState(25);
  const [saved, setSaved] = useState(false);

  const subtotalBeforeMargin = lines.reduce((s, l) => s + (l.qty || 0) * (l.rate || 0), 0);
  const subtotal = subtotalBeforeMargin / (1 - margin / 100);
  const gst = subtotal * GST_RATE;
  const total = subtotal + gst;

  function updateLine(id, field, value) {
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: field === "desc" || field === "unit" ? value : Number(value) } : l))
    );
  }

  function removeLine(id) {
    setLines((prev) => (prev.length === 1 ? prev : prev.filter((l) => l.id !== id)));
  }

  function handleSave() {
    addQuote({
      client,
      trade: selectedTrade,
      jobTitle,
      jobDate,
      notes,
      lines,
      margin,
      subtotal,
      gst,
      total,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handlePrint() {
    window.print();
  }

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid #ede4d8",
    borderRadius: 10,
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    background: "#fff",
    color: "#1a1209",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    color: "#8a7560",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 6,
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
          Quote <span style={{ color: "#e8952e" }}>Builder</span>
        </h1>
        <p style={{ color: "#8a7560", fontSize: 14, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
          Build a professional, GST-inclusive quote in minutes.
        </p>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 16px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Trade */}
        <div style={{ background: "#fffdf9", border: "1.5px solid #ede4d8", borderRadius: 20, padding: "24px 20px" }}>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#c8782a", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 14px" }}>
            Your Trade
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {TRADES.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTrade(t)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 99,
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  background: selectedTrade === t ? "#c8782a" : "#fff",
                  color: selectedTrade === t ? "#fff" : "#6a5848",
                  border: `1.5px solid ${selectedTrade === t ? "#c8782a" : "#e0d4c4"}`,
                  cursor: "pointer",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Job + Client */}
        <div style={{ background: "#fffdf9", border: "1.5px solid #ede4d8", borderRadius: 20, padding: "24px 20px" }}>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#c8782a", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 18px" }}>
            Job Details
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelStyle}>Job Title / Description</label>
              <input style={inputStyle} value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Interior repaint — 3 bedroom house" />
            </div>
            <div>
              <label style={labelStyle}>Quote Date</label>
              <input type="date" style={inputStyle} value={jobDate} onChange={(e) => setJobDate(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Client Name</label>
              <input style={inputStyle} value={client.name} onChange={(e) => setClient((c) => ({ ...c, name: e.target.value }))} placeholder="John Smith" />
            </div>
            <div>
              <label style={labelStyle}>Client Phone</label>
              <input style={inputStyle} value={client.phone} onChange={(e) => setClient((c) => ({ ...c, phone: e.target.value }))} placeholder="04xx xxx xxx" />
            </div>
            <div>
              <label style={labelStyle}>Client Email</label>
              <input style={inputStyle} value={client.email} onChange={(e) => setClient((c) => ({ ...c, email: e.target.value }))} placeholder="john@example.com" />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelStyle}>Site Address</label>
              <input style={inputStyle} value={client.address} onChange={(e) => setClient((c) => ({ ...c, address: e.target.value }))} placeholder="123 Main St, Suburb VIC 3000" />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div style={{ background: "#fffdf9", border: "1.5px solid #ede4d8", borderRadius: 20, padding: "24px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#c8782a", letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>
              Line Items
            </h2>
            <button
              onClick={() => setLines((prev) => [...prev, newLine()])}
              style={{
                background: "#1a1209", color: "#fff", border: "none", borderRadius: 8,
                padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              + Add Line
            </button>
          </div>

          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "3fr 80px 90px 110px 90px 36px", gap: 8, marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid #ede4d8" }}>
            {["Description", "Qty", "Unit", "Rate (excl. GST)", "Amount", ""].map((h) => (
              <span key={h} style={{ fontSize: 10, fontWeight: 700, color: "#8a7560", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>{h}</span>
            ))}
          </div>

          {lines.map((line) => (
            <div key={line.id} style={{ display: "grid", gridTemplateColumns: "3fr 80px 90px 110px 90px 36px", gap: 8, marginBottom: 8, alignItems: "center" }}>
              <input
                style={{ ...inputStyle, padding: "8px 10px" }}
                value={line.desc}
                onChange={(e) => updateLine(line.id, "desc", e.target.value)}
                placeholder="e.g. Labour — prep and prime"
              />
              <input
                type="number"
                style={{ ...inputStyle, padding: "8px 10px" }}
                value={line.qty}
                min={0}
                onChange={(e) => updateLine(line.id, "qty", e.target.value)}
              />
              <select
                style={{ ...inputStyle, padding: "8px 10px" }}
                value={line.unit}
                onChange={(e) => updateLine(line.id, "unit", e.target.value)}
              >
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#8a7560", fontSize: 14 }}>$</span>
                <input
                  type="number"
                  style={{ ...inputStyle, padding: "8px 10px 8px 22px" }}
                  value={line.rate}
                  min={0}
                  onChange={(e) => updateLine(line.id, "rate", e.target.value)}
                />
              </div>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 700, color: "#1a1209", textAlign: "right" }}>
                {fmt(line.qty * line.rate)}
              </span>
              <button
                onClick={() => removeLine(line.id)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#c05020", fontSize: 16, padding: 0 }}
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}

          {/* Margin */}
          <div style={{ borderTop: "1px solid #ede4d8", marginTop: 16, paddingTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <label style={{ ...labelStyle, margin: 0, whiteSpace: "nowrap" }}>Profit Margin</label>
              <input
                type="range" min={0} max={60} step={1} value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                style={{ flex: 1 }}
              />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, fontWeight: 700, color: "#c8782a", minWidth: 40 }}>{margin}%</span>
            </div>
            <p style={{ margin: 0, fontSize: 11, color: "#b0a090" }}>Applied to cost before GST. Healthy range: 20–35%.</p>
          </div>
        </div>

        {/* Totals */}
        <div style={{ background: "#1a1209", borderRadius: 20, padding: "24px 20px" }}>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#c8782a", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 16px" }}>
            Quote Summary
          </h2>
          {[
            { label: "Cost (excl. margin)", value: fmt(subtotalBeforeMargin), muted: true },
            { label: `Subtotal (incl. ${margin}% margin)`, value: fmt(subtotal), muted: false },
            { label: "GST (10%)", value: fmt(gst), muted: true },
          ].map(({ label, value, muted }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: 13, color: muted ? "#8a7560" : "#fff", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: muted ? "#8a7560" : "#fff", fontWeight: 700 }}>{value}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0 0" }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#fff" }}>Total (incl. GST)</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 28, fontWeight: 700, color: "#e8952e" }}>{fmt(total)}</span>
          </div>
        </div>

        {/* Notes */}
        <div style={{ background: "#fffdf9", border: "1.5px solid #ede4d8", borderRadius: 20, padding: "24px 20px" }}>
          <label style={labelStyle}>Notes / Terms</label>
          <textarea
            style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Quote valid for 30 days. 50% deposit required on acceptance. All surfaces to be clean and clear before work begins."
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              minWidth: 160,
              padding: "15px 24px",
              background: saved ? "#5a9e5a" : "linear-gradient(135deg, #c8782a, #e8952e)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 6px 20px rgba(200,120,42,0.3)",
              transition: "background 0.3s",
            }}
          >
            {saved ? "✓ Saved to Dashboard" : "Save Quote →"}
          </button>
          <button
            onClick={handlePrint}
            style={{
              flex: 1,
              minWidth: 160,
              padding: "15px 24px",
              background: "transparent",
              color: "#8a7560",
              border: "1.5px solid #e0d4c4",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            🖨️ Print / Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}
