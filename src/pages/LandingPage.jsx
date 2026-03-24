import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    icon: "💰",
    title: "Pricing Tool",
    desc: "Know your true cost per hour and the minimum rate you need to actually profit — not just break even.",
    cta: "Run My Numbers →",
    to: "/pricing-tool",
  },
  {
    icon: "📋",
    title: "Quote Builder",
    desc: "Build professional, itemised quotes with GST in seconds. Save them, print them, send them.",
    cta: "Build a Quote →",
    to: "/quote-builder",
  },
  {
    icon: "📊",
    title: "Business Dashboard",
    desc: "See all your quotes in one place. Track totals, spot trends, and never lose a job again.",
    cta: "Open Dashboard →",
    to: "/dashboard",
  },
];

const STATS = [
  { value: "68%", label: "of painters undercharge for prep" },
  { value: "32%", label: "average margin gap" },
  { value: "$52k", label: "left on the table p/a" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: "#f7f1e8", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(160deg, #1a1209 0%, #2d1f0e 100%)",
          padding: "80px 24px 72px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse at 20% 60%, rgba(200,120,42,0.18) 0%, transparent 55%), radial-gradient(ellipse at 80% 40%, rgba(232,149,46,0.12) 0%, transparent 55%)",
          }}
        />
        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(200,120,42,0.2)",
              border: "1px solid rgba(200,120,42,0.4)",
              borderRadius: 99,
              padding: "5px 16px",
              marginBottom: 28,
            }}
          >
            <div
              style={{ width: 6, height: 6, borderRadius: "50%", background: "#e8952e" }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#e8952e",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Free tools for Australian painters
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(32px, 6vw, 58px)",
              fontWeight: 900,
              color: "#fff",
              margin: "0 0 20px",
              lineHeight: 1.1,
            }}
          >
            Stop guessing.<br />
            <span style={{ color: "#e8952e" }}>Start profiting.</span>
          </h1>

          <p
            style={{
              color: "#8a7560",
              fontSize: "clamp(15px, 2vw, 18px)",
              margin: "0 0 40px",
              lineHeight: 1.7,
              maxWidth: 520,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            PAINTER-OS gives Australian painters the numbers they need — true cost per job,
            winning quote prices, and a dashboard that keeps the business on track.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/pricing-tool")}
              style={{
                background: "linear-gradient(135deg, #c8782a, #e8952e)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "16px 32px",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 6px 24px rgba(200,120,42,0.4)",
                letterSpacing: "0.02em",
              }}
            >
              Check My Rates — Free →
            </button>
            <button
              onClick={() => navigate("/quote-builder")}
              style={{
                background: "rgba(255,255,255,0.07)",
                color: "#fff",
                border: "1.5px solid rgba(255,255,255,0.15)",
                borderRadius: 12,
                padding: "16px 32px",
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "0.02em",
              }}
            >
              Build a Quote
            </button>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section
        style={{
          background: "#c8782a",
          padding: "20px 24px",
          display: "flex",
          justifyContent: "center",
          gap: "clamp(24px, 6vw, 80px)",
          flexWrap: "wrap",
        }}
      >
        {STATS.map(({ value, label }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "clamp(22px, 4vw, 32px)",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {value}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>
              {label}
            </div>
          </div>
        ))}
      </section>

      {/* Feature cards */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px" }}>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 700,
            color: "#1a1209",
            textAlign: "center",
            margin: "0 0 48px",
          }}
        >
          Everything a painter needs
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {FEATURES.map(({ icon, title, desc, cta, to }) => (
            <div
              key={title}
              style={{
                background: "#fffdf9",
                border: "1.5px solid #ede4d8",
                borderRadius: 20,
                padding: "32px 28px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 36 }}>{icon}</div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#1a1209",
                  margin: 0,
                }}
              >
                {title}
              </h3>
              <p style={{ fontSize: 14, color: "#8a7560", margin: 0, lineHeight: 1.7, flex: 1 }}>
                {desc}
              </p>
              <button
                onClick={() => navigate(to)}
                style={{
                  alignSelf: "flex-start",
                  background: "none",
                  border: "none",
                  color: "#c8782a",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  padding: 0,
                  letterSpacing: "0.02em",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
              >
                {cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: "#1a1209", padding: "64px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 48px",
            }}
          >
            Three steps to better margins
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 32,
            }}
          >
            {[
              { n: "01", title: "Enter your numbers", desc: "Hours, rates, overhead, wages — honest inputs only." },
              { n: "02", title: "See your true cost", desc: "Instantly know what every billable hour actually costs you." },
              { n: "03", title: "Quote with confidence", desc: "Build itemised quotes with the right margin baked in." },
            ].map(({ n, title, desc }) => (
              <div key={n} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 48,
                    fontWeight: 700,
                    color: "rgba(200,120,42,0.3)",
                    lineHeight: 1,
                    marginBottom: 12,
                  }}
                >
                  {n}
                </div>
                <h4
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 18,
                    color: "#fff",
                    margin: "0 0 8px",
                  }}
                >
                  {title}
                </h4>
                <p style={{ fontSize: 13, color: "#8a7560", margin: 0, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/pricing-tool")}
            style={{
              marginTop: 48,
              background: "linear-gradient(135deg, #c8782a, #e8952e)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "16px 36px",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 6px 24px rgba(200,120,42,0.35)",
            }}
          >
            Get Started — It&apos;s Free →
          </button>
        </div>
      </section>
    </div>
  );
}
