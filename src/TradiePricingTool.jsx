import { useState, useEffect, useRef } from "react";

const formatCurrency = (val) => {
  if (isNaN(val) || val === null) return "$0";
  return "$" + Number(val).toLocaleString("en-AU", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const formatHours = (h) => {
  if (!h) return "0h";
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
};

const AnimatedNumber = ({ value, prefix = "", suffix = "", decimals = 0 }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const start = display;
    const end = isNaN(value) ? 0 : value;
    if (start === end) return;
    const duration = 600;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      setDisplay(current);
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [value]);
  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : Math.round(display).toLocaleString("en-AU");
  return <span>{prefix}{formatted}{suffix}</span>;
};

const Slider = ({ label, value, onChange, min, max, step = 1, prefix = "", suffix = "", hint }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#8a7560", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</label>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 700, color: "#1a1209" }}>
          {prefix}{typeof value === "number" ? value.toLocaleString("en-AU") : value}{suffix}
        </span>
      </div>
      <div style={{ position: "relative", height: 6, borderRadius: 99, background: "#e8ddd0", cursor: "pointer" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", borderRadius: 99, background: "linear-gradient(90deg, #c8782a, #e8952e)", width: `${pct}%`, transition: "width 0.1s" }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            position: "absolute", inset: 0, width: "100%", opacity: 0, cursor: "pointer", height: 6, margin: 0, padding: 0
          }}
        />
        <div style={{
          position: "absolute", top: "50%", left: `${pct}%`, transform: "translate(-50%, -50%)",
          width: 18, height: 18, borderRadius: "50%", background: "#c8782a",
          border: "3px solid #fff", boxShadow: "0 2px 8px rgba(200,120,42,0.4)", pointerEvents: "none", transition: "left 0.1s"
        }} />
      </div>
      {hint && <p style={{ margin: "6px 0 0", fontSize: 11, color: "#b0a090" }}>{hint}</p>}
    </div>
  );
};

const MetricCard = ({ label, value, sub, highlight, danger, large }) => (
  <div style={{
    background: highlight ? "linear-gradient(135deg, #c8782a 0%, #e8952e 100%)" : danger ? "#fff5f0" : "#fffdf9",
    border: `1.5px solid ${highlight ? "transparent" : danger ? "#f4c0a0" : "#ede4d8"}`,
    borderRadius: 16,
    padding: large ? "24px 20px" : "18px 16px",
    display: "flex", flexDirection: "column", gap: 4,
    boxShadow: highlight ? "0 8px 32px rgba(200,120,42,0.25)" : "0 2px 8px rgba(0,0,0,0.04)"
  }}>
    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: highlight ? "rgba(255,255,255,0.75)" : danger ? "#c05020" : "#8a7560" }}>{label}</span>
    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: large ? 32 : 22, fontWeight: 700, color: highlight ? "#fff" : danger ? "#c05020" : "#1a1209", lineHeight: 1.1 }}>{value}</span>
    {sub && <span style={{ fontSize: 12, color: highlight ? "rgba(255,255,255,0.65)" : "#b0a090", marginTop: 2 }}>{sub}</span>}
  </div>
);

const GaugeBar = ({ label, pct, color }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
      <span style={{ fontSize: 12, color: "#8a7560", fontWeight: 600 }}>{label}</span>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#1a1209", fontWeight: 700 }}>{pct.toFixed(1)}%</span>
    </div>
    <div style={{ height: 8, borderRadius: 99, background: "#e8ddd0", overflow: "hidden" }}>
      <div style={{ height: "100%", borderRadius: 99, background: color, width: `${Math.min(pct, 100)}%`, transition: "width 0.6s cubic-bezier(0.34,1.56,0.64,1)" }} />
    </div>
  </div>
);

export default function TradiePricingTool() {
  const [hourlyRate, setHourlyRate] = useState(65);
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [billableRatio, setBillableRatio] = useState(75);
  const [overheadWeekly, setOverheadWeekly] = useState(800);
  const [wagesCost, setWagesCost] = useState(0);
  const [materialsCost, setMaterialsCost] = useState(0);
  const [targetMargin, setTargetMargin] = useState(25);
  const [activeTab, setActiveTab] = useState("inputs");
  const [aiInsight, setAiInsight] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Core calculations
  const billableHoursPerWeek = (hoursPerDay * daysPerWeek * billableRatio) / 100;
  const grossRevenueWeekly = billableHoursPerWeek * hourlyRate;
  const totalCostsWeekly = overheadWeekly + wagesCost + materialsCost;
  const grossProfitWeekly = grossRevenueWeekly - totalCostsWeekly;
  const grossMarginPct = grossRevenueWeekly > 0 ? (grossProfitWeekly / grossRevenueWeekly) * 100 : 0;
  const revenueNeededForMargin = totalCostsWeekly / (1 - targetMargin / 100);
  const minHourlyRate = billableHoursPerWeek > 0 ? revenueNeededForMargin / billableHoursPerWeek : 0;
  const annualRevenue = grossRevenueWeekly * 48; // 48 working weeks
  const annualProfit = grossProfitWeekly * 48;
  const annualCosts = totalCostsWeekly * 48;
  const costPerBillableHour = billableHoursPerWeek > 0 ? totalCostsWeekly / billableHoursPerWeek : 0;
  const trueCostPerHour = totalCostsWeekly / (hoursPerDay * daysPerWeek || 1);
  const marginHealth = grossMarginPct >= targetMargin ? "healthy" : grossMarginPct >= targetMargin * 0.7 ? "warning" : "danger";

  const getAiInsight = async () => {
    setAiLoading(true);
    setAiInsight("");
    setShowResult(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a no-nonsense business coach for Australian painting contractors. Analyse this painter's numbers and give brutally honest, practical advice.
THEIR NUMBERS:
- Hourly rate charged: $${hourlyRate}/hr
- Hours on the tools per day: ${hoursPerDay}h
- Days per week: ${daysPerWeek} days
- Billable ratio: ${billableRatio}% (only ${billableRatio}% of time is charged to clients — quoting, prep, travel = not billable)
- Weekly overhead costs: $${overheadWeekly} (vehicle, insurance, equipment)
- Weekly wages/subcontractors: $${wagesCost}
- Weekly paint & supplies: $${materialsCost}
- Actual billable hours/week: ${billableHoursPerWeek.toFixed(1)}h
- Weekly revenue: ${formatCurrency(grossRevenueWeekly)}
- Weekly profit: ${formatCurrency(grossProfitWeekly)}
- Gross margin: ${grossMarginPct.toFixed(1)}%
- Their target margin: ${targetMargin}%
- Minimum rate needed to hit target: ${formatCurrency(minHourlyRate)}/hr
- True cost per billable hour: ${formatCurrency(costPerBillableHour)}/hr
Give your response in this EXACT format with these 4 sections:
🔍 REALITY CHECK
[2-3 sentences being blunt about their situation. Are they undercharging? Not charging for prep time? Barely surviving?]
💸 THE NUMBER THEY NEED TO KNOW
[One clear actionable number or insight — the most important thing. Make it specific to painting.]
⚡ 3 QUICK WINS
[3 bullet points, each ONE sentence, practical and specific to a painting business at these numbers — e.g. quoting prep separately, materials markup, square metre pricing]
📈 IF THEY DO NOTHING
[1-2 sentences on what happens if they keep operating at these numbers over 12 months. Be honest but not cruel.]
Keep total response under 220 words. Be direct, practical, Australian in tone. No fluff.`
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      setAiInsight(text);
    } catch (e) {
      setAiInsight("⚠️ Couldn't connect to AI analysis. Check your connection and try again.");
    }
    setAiLoading(false);
  };

  const tabStyle = (active) => ({
    padding: "10px 20px", borderRadius: 99, fontSize: 13, fontWeight: 700,
    background: active ? "#1a1209" : "transparent",
    color: active ? "#fff" : "#8a7560",
    border: "none", cursor: "pointer", transition: "all 0.2s",
    letterSpacing: "0.04em"
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f7f1e8",
      fontFamily: "'Georgia', serif",
      padding: "0 0 60px"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input[type=range] { -webkit-appearance: none; appearance: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; }
        .ai-text { white-space: pre-line; font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 1.8; color: #2a1f10; }
        .ai-text strong { color: #c8782a; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .skeleton { animation: pulse 1.2s ease infinite; background: #e8ddd0; border-radius: 8px; }
      `}</style>

      {/* Header */}
      <div style={{
        background: "#1a1209",
        padding: "32px 24px 28px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(200,120,42,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(232,149,46,0.1) 0%, transparent 60%)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(200,120,42,0.2)", border: "1px solid rgba(200,120,42,0.4)", borderRadius: 99, padding: "4px 14px", marginBottom: 16 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#e8952e" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#e8952e", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Free Tool for Painters</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 900, color: "#fff", margin: "0 0 10px", lineHeight: 1.15 }}>
            Are You Charging<br /><span style={{ color: "#e8952e" }}>Enough?</span>
          </h1>
          <p style={{ color: "#8a7560", fontSize: 15, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
            Find out your true cost per hour — and the rate you actually need to profit.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, background: "#ede4d8", borderRadius: 99, padding: 4, margin: "24px 0 0", fontFamily: "'DM Sans', sans-serif" }}>
          {["inputs", "results"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={tabStyle(activeTab === tab)}>
              {tab === "inputs" ? "⚙️ My Numbers" : "📊 My Results"}
            </button>
          ))}
        </div>

        {/* INPUTS TAB */}
        {activeTab === "inputs" && (
          <div className="fade-up" style={{ background: "#fffdf9", borderRadius: 20, padding: "28px 24px", marginTop: 16, border: "1.5px solid #ede4d8", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: 13, color: "#8a7560", marginTop: 0, marginBottom: 28, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
              Enter your real numbers — not what you wish they were. Honest inputs = honest results.
            </p>
            <div style={{ borderBottom: "1px solid #ede4d8", paddingBottom: 28, marginBottom: 28, fontFamily: "'DM Sans', sans-serif" }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: "#c8782a", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 0, marginBottom: 20 }}>💰 Revenue Side</h3>
              <Slider label="Hourly Rate Charged" value={hourlyRate} onChange={setHourlyRate} min={30} max={250} step={5} prefix="$" suffix="/hr" hint="What you actually charge clients per hour" />
              <Slider label="Hours on the tools per day" value={hoursPerDay} onChange={setHoursPerDay} min={2} max={14} step={0.5} suffix=" hrs" hint="Total hours worked, not just billable" />
              <Slider label="Days worked per week" value={daysPerWeek} onChange={setDaysPerWeek} min={1} max={7} hint="Average across the year" />
              <Slider label="Billable ratio" value={billableRatio} onChange={setBillableRatio} min={20} max={100} suffix="%" hint="What % of your time is actually charged to clients? (quoting, travel, admin = not billable)" />
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: "#c8782a", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 0, marginBottom: 20 }}>📦 Cost Side</h3>
              <Slider label="Weekly Overhead" value={overheadWeekly} onChange={setOverheadWeekly} min={0} max={5000} step={50} prefix="$" suffix="/wk" hint="Vehicle, insurance, ladders, sprayers, scaffolding hire, phone, software — everything" />
              <Slider label="Wages & Subcontractors" value={wagesCost} onChange={setWagesCost} min={0} max={10000} step={100} prefix="$" suffix="/wk" hint="Any labourers or subbies you pay weekly" />
              <Slider label="Materials & Supplies" value={materialsCost} onChange={setMaterialsCost} min={0} max={5000} step={50} prefix="$" suffix="/wk" hint="Paint, primer, brushes, rollers, tape, drop sheets — average weekly spend" />
              <Slider label="Your Target Profit Margin" value={targetMargin} onChange={setTargetMargin} min={5} max={60} suffix="%" hint="Healthy trades businesses run 20–35%. What's your goal?" />
            </div>
            <button
              onClick={() => { setActiveTab("results"); getAiInsight(); }}
              style={{
                width: "100%", marginTop: 12, padding: "16px 24px",
                background: "linear-gradient(135deg, #c8782a, #e8952e)",
                color: "#fff", border: "none", borderRadius: 14, fontSize: 16,
                fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                letterSpacing: "0.02em",
                boxShadow: "0 6px 24px rgba(200,120,42,0.35)",
                transition: "transform 0.15s, box-shadow 0.15s"
              }}
              onMouseOver={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 10px 32px rgba(200,120,42,0.45)"; }}
              onMouseOut={e => { e.target.style.transform = ""; e.target.style.boxShadow = "0 6px 24px rgba(200,120,42,0.35)"; }}
            >
              Calculate My True Numbers →
            </button>
          </div>
        )}

        {/* RESULTS TAB */}
        {activeTab === "results" && (
          <div className="fade-up" style={{ marginTop: 16 }}>
            {/* Key metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <MetricCard
                label="Weekly Revenue"
                value={<AnimatedNumber value={grossRevenueWeekly} prefix="$" />}
                sub={`${billableHoursPerWeek.toFixed(1)} billable hrs`}
                large
              />
              <MetricCard
                label="Weekly Profit"
                value={<AnimatedNumber value={grossProfitWeekly} prefix="$" />}
                sub={`After all costs`}
                highlight={grossMarginPct >= targetMargin}
                danger={grossMarginPct < targetMargin * 0.7}
                large
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
              <MetricCard label="Annual Revenue" value={<AnimatedNumber value={annualRevenue} prefix="$" />} sub="48 working weeks" />
              <MetricCard label="Annual Profit" value={<AnimatedNumber value={annualProfit} prefix="$" />} sub="Take-home" />
              <MetricCard label="Annual Costs" value={<AnimatedNumber value={annualCosts} prefix="$" />} sub="Total outgoings" danger />
            </div>

            {/* THE CRITICAL NUMBER */}
            <div style={{
              background: "linear-gradient(135deg, #1a1209 0%, #2d1f0e 100%)",
              borderRadius: 20, padding: "24px 20px", marginBottom: 12,
              border: "1px solid #3d2d18", position: "relative", overflow: "hidden"
            }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(200,120,42,0.15)" }} />
              <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#c8782a", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 8px" }}>🎯 The Rate You Actually Need</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 44, fontWeight: 700, color: "#fff" }}>
                    <AnimatedNumber value={minHourlyRate} prefix="$" />
                  </span>
                  <span style={{ color: "#8a7560", fontSize: 16 }}>/hr</span>
                </div>
                <p style={{ color: "#8a7560", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                  To hit your <strong style={{ color: "#e8952e" }}>{targetMargin}% target margin</strong>, you need to charge at least {formatCurrency(minHourlyRate)}/hr — compared to your current {formatCurrency(hourlyRate)}/hr.
                  {hourlyRate < minHourlyRate
                    ? <span style={{ color: "#f4a060" }}> You're <strong style={{ color: "#f4a060" }}>{formatCurrency(minHourlyRate - hourlyRate)}/hr short.</strong></span>
                    : <span style={{ color: "#7ec882" }}> ✅ You're pricing correctly.</span>
                  }
                </p>
              </div>
            </div>

            {/* Margin health */}
            <div style={{ background: "#fffdf9", borderRadius: 20, padding: "22px 20px", marginBottom: 12, border: "1.5px solid #ede4d8" }}>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#8a7560", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 18px" }}>Margin Breakdown</h3>
              <GaugeBar label="Gross Margin" pct={grossMarginPct} color={marginHealth === "healthy" ? "#7ec882" : marginHealth === "warning" ? "#e8952e" : "#e85a2e"} />
              <GaugeBar label="Target Margin" pct={targetMargin} color="#c8782a" />
              <GaugeBar label="Billable Ratio" pct={billableRatio} color="#6ab0d8" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 18, fontFamily: "'DM Sans', sans-serif" }}>
                <div style={{ background: "#f7f1e8", borderRadius: 12, padding: "14px 16px" }}>
                  <p style={{ margin: 0, fontSize: 11, color: "#8a7560", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>True Cost / Billable Hr</p>
                  <p style={{ margin: "4px 0 0", fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 700, color: "#1a1209" }}>{formatCurrency(costPerBillableHour)}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: "#b0a090" }}>What every billable hour actually costs you</p>
                </div>
                <div style={{ background: "#f7f1e8", borderRadius: 12, padding: "14px 16px" }}>
                  <p style={{ margin: 0, fontSize: 11, color: "#8a7560", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Non-billable hrs/wk</p>
                  <p style={{ margin: "4px 0 0", fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 700, color: "#1a1209" }}>{formatHours(hoursPerDay * daysPerWeek - billableHoursPerWeek)}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: "#b0a090" }}>Hours you work but don't get paid for</p>
                </div>
              </div>
            </div>

            {/* AI Insight */}
            <div style={{ background: "#fffdf9", borderRadius: 20, padding: "22px 20px", border: "1.5px solid #ede4d8", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #c8782a, #e8952e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🤖</div>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1a1209" }}>AI Business Coach Analysis</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#8a7560" }}>Personalised to your painting business numbers</p>
                </div>
                {!aiInsight && !aiLoading && (
                  <button onClick={getAiInsight} style={{
                    marginLeft: "auto", padding: "8px 16px", background: "#1a1209",
                    color: "#fff", border: "none", borderRadius: 99, fontSize: 12, fontWeight: 700,
                    cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
                  }}>Analyse →</button>
                )}
              </div>
              {aiLoading && (
                <div>
                  {[90, 70, 80, 55].map((w, i) => (
                    <div key={i} className="skeleton" style={{ height: 14, width: `${w}%`, marginBottom: 10 }} />
                  ))}
                </div>
              )}
              {aiInsight && !aiLoading && (
                <div className="fade-up ai-text" dangerouslySetInnerHTML={{
                  __html: aiInsight
                    .replace(/🔍|💸|⚡|📈/g, m => `<span style="font-size:16px">${m}</span>`)
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br/>')
                }} />
              )}
            </div>

            {/* CTA — lead magnet conversion */}
            <div style={{
              background: "linear-gradient(135deg, #c8782a 0%, #e8952e 100%)",
              borderRadius: 20, padding: "24px 20px", textAlign: "center",
              boxShadow: "0 8px 32px rgba(200,120,42,0.3)"
            }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>Want a full quoting system?</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.8)", margin: "0 0 20px", lineHeight: 1.6 }}>
                PAINTER-OS turns these numbers into professional quotes, accurate job pricing, and a dashboard to run your painting business.
              </p>
              <button style={{
                background: "#fff", color: "#c8782a", border: "none", borderRadius: 12,
                padding: "14px 28px", fontSize: 15, fontWeight: 700,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)"
              }}>
                Get Early Access — Free →
              </button>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.6)", margin: "12px 0 0" }}>No credit card. No spam. Just better margins.</p>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button
                onClick={() => setActiveTab("inputs")}
                style={{
                  flex: 1, padding: "13px",
                  background: "transparent", color: "#8a7560",
                  border: "1.5px solid #e0d4c4", borderRadius: 12, fontSize: 13,
                  fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
                }}
              >← Adjust My Numbers</button>
              <button
                onClick={() => window.print()}
                style={{
                  flex: 1, padding: "13px",
                  background: "transparent", color: "#8a7560",
                  border: "1.5px solid #e0d4c4", borderRadius: 12, fontSize: 13,
                  fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
                }}
              >🖨️ Print / Save PDF</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
