import { useState, useEffect, useRef } from "react";

// ─── SplitText Component (ReactBits-style) ───────────────────────────────────
function SplitText({ text, className = "", delay = 0, charDelay = 40 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: `opacity 0.5s ease ${i * charDelay}ms, transform 0.5s ease ${i * charDelay}ms`,
            whiteSpace: char === " " ? "pre" : "normal",
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

// ─── BlurIn Component ─────────────────────────────────────────────────────────
function BlurIn({ children, delay = 0, className = "" }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        filter: visible ? "blur(0px)" : "blur(12px)",
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.7s ease, filter 0.7s ease, transform 0.7s ease`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Pulse Ring ───────────────────────────────────────────────────────────────
function HeartPulse() {
  return (
    <div style={{ position: "relative", width: 56, height: 56, margin: "0 auto 8px" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "2px solid #e11d48",
            animation: `pulse 2s ease-out ${i * 0.6}s infinite`,
            opacity: 0,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
        }}
      >
        ♥
      </div>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

// ─── Field config ─────────────────────────────────────────────────────────────
const fields = [
  {
    key: "age", label: "Age", type: "number", placeholder: "e.g. 52",
    hint: "Patient age in years", min: 1, max: 120,
  },
  {
    key: "sex", label: "Sex", type: "select",
    options: [{ v: "", l: "Select…" }, { v: "1", l: "Male" }, { v: "0", l: "Female" }],
    hint: "Biological sex (1 = Male, 0 = Female)",
  },
  {
    key: "cp", label: "Chest Pain Type", type: "select",
    options: [
      { v: "", l: "Select…" },
      { v: "0", l: "0 – Typical Angina" },
      { v: "1", l: "1 – Atypical Angina" },
      { v: "2", l: "2 – Non-Anginal Pain" },
      { v: "3", l: "3 – Asymptomatic" },
    ],
    hint: "Type of chest pain experienced",
  },
  {
    key: "trestbps", label: "Resting Blood Pressure", type: "number",
    placeholder: "e.g. 130", hint: "mm Hg on admission", min: 50, max: 250,
  },
  {
    key: "chol", label: "Serum Cholesterol", type: "number",
    placeholder: "e.g. 250", hint: "mg/dl", min: 50, max: 600,
  },
  {
    key: "fbs", label: "Fasting Blood Sugar > 120 mg/dl", type: "select",
    options: [{ v: "", l: "Select…" }, { v: "1", l: "Yes (1)" }, { v: "0", l: "No (0)" }],
    hint: "Is fasting blood sugar > 120 mg/dl?",
  },
  {
    key: "restecg", label: "Resting ECG Results", type: "select",
    options: [
      { v: "", l: "Select…" },
      { v: "0", l: "0 – Normal" },
      { v: "1", l: "1 – ST-T Wave Abnormality" },
      { v: "2", l: "2 – Left Ventricular Hypertrophy" },
    ],
    hint: "Resting electrocardiographic results",
  },
  {
    key: "thalach", label: "Max Heart Rate Achieved", type: "number",
    placeholder: "e.g. 150", hint: "Maximum heart rate (bpm)", min: 50, max: 250,
  },
  {
    key: "exang", label: "Exercise Induced Angina", type: "select",
    options: [{ v: "", l: "Select…" }, { v: "1", l: "Yes (1)" }, { v: "0", l: "No (0)" }],
    hint: "Angina induced by exercise?",
  },
  {
    key: "oldpeak", label: "ST Depression (Oldpeak)", type: "number",
    placeholder: "e.g. 1.4", hint: "ST depression induced by exercise", min: 0, max: 10, step: 0.1,
  },
  {
    key: "slope", label: "Slope of Peak ST Segment", type: "select",
    options: [
      { v: "", l: "Select…" },
      { v: "0", l: "0 – Upsloping" },
      { v: "1", l: "1 – Flat" },
      { v: "2", l: "2 – Downsloping" },
    ],
    hint: "Shape of peak exercise ST segment",
  },
  {
    key: "ca", label: "Major Vessels Colored", type: "select",
    options: [
      { v: "", l: "Select…" },
      { v: "0", l: "0 vessels" },
      { v: "1", l: "1 vessel" },
      { v: "2", l: "2 vessels" },
      { v: "3", l: "3 vessels" },
    ],
    hint: "Number of major vessels colored by fluoroscopy (0–3)",
  },
  {
    key: "thal", label: "Thalassemia", type: "select",
    options: [
      { v: "", l: "Select…" },
      { v: "1", l: "1 – Normal" },
      { v: "2", l: "2 – Fixed Defect" },
      { v: "3", l: "3 – Reversible Defect" },
    ],
    hint: "Blood disorder type",
  },
];

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function HeartDiseasePredictor() {
  const [form, setForm] = useState({});
  const [result, setResult] = useState(null); // null | "healthy" | "risk"
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);
  const resultRef = useRef(null);

  const handleChange = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setResult(null);
  };

  const validate = () => {
    const errs = {};
    fields.forEach(({ key }) => {
      if (form[key] === undefined || form[key] === "") errs[key] = "Required";
    });
    return errs;
  };

  const handlePredict = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setResult(null);

    // Build the input tuple in the correct order
    const inputData = [
      Number(form.age), Number(form.sex), Number(form.cp),
      Number(form.trestbps), Number(form.chol), Number(form.fbs),
      Number(form.restecg), Number(form.thalach), Number(form.exang),
      Number(form.oldpeak), Number(form.slope), Number(form.ca), Number(form.thal),
    ];

    // Call Claude API for prediction via logistic-regression-style analysis
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a heart disease prediction model trained on the Cleveland Heart Disease dataset. 
Given these patient parameters in order (age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal):
${JSON.stringify(inputData)}

Based on clinical knowledge of this dataset and logistic regression patterns:
- 1 = defective heart (heart disease present)
- 0 = healthy heart (no heart disease)

Analyze the values and respond ONLY with a JSON object like:
{"prediction": 0, "confidence": 82, "keyFactors": ["low ST depression", "normal thalassemia"]}

prediction must be 0 or 1. confidence is 0-100. keyFactors is an array of 2-3 short clinical reasons (under 6 words each).`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed.prediction === 0 ? "healthy" : "risk");
      setResultData(parsed);
    } catch {
      setResult("error");
    }
    setLoading(false);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const [resultData, setResultData] = useState(null);

  const reset = () => { setForm({}); setResult(null); setResultData(null); setErrors({}); };

  // ── Styles ──
  const colors = {
    bg: "#0a0a0f",
    card: "#0f0f1a",
    border: "#1e1e30",
    borderHover: "#e11d48",
    accent: "#e11d48",
    accentSoft: "rgba(225,29,72,0.12)",
    text: "#f1f0f5",
    muted: "#7c7c9a",
    inputBg: "#13131f",
    healthy: "#10b981",
    healthySoft: "rgba(16,185,129,0.12)",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: colors.bg,
      fontFamily: "'DM Sans', system-ui, sans-serif",
      color: colors.text,
      padding: "0",
    }}>
      {/* Import fonts */}
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet" />

      {/* Noise texture overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
        opacity: 0.4,
      }} />

      {/* Gradient blob */}
      <div style={{
        position: "fixed", top: "-20%", left: "50%", transform: "translateX(-50%)",
        width: 700, height: 700, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(225,29,72,0.08) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto", padding: "60px 24px 80px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <HeartPulse />
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 700,
            margin: "16px 0 8px",
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
          }}>
            <SplitText text="Heart Disease" delay={200} charDelay={35} />
            <br />
            <span style={{ fontStyle: "italic", color: colors.accent }}>
              <SplitText text="Risk Predictor" delay={700} charDelay={35} />
            </span>
          </h1>
          <BlurIn delay={1400}>
            <p style={{ color: colors.muted, fontSize: 15, maxWidth: 440, margin: "0 auto", lineHeight: 1.7 }}>
              Enter your clinical parameters below. Our model analyzes 13 cardiac indicators to assess your heart disease risk.
            </p>
          </BlurIn>
        </div>

        {/* Form Card */}
        <BlurIn delay={800}>
          <div style={{
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: 20,
            padding: "40px 36px",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
            animation: "cardIn 0.8s ease 0.4s both",
          }}>
            {/* Section label */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              marginBottom: 32,
              paddingBottom: 20,
              borderBottom: `1px solid ${colors.border}`,
            }}>
              <div style={{
                width: 6, height: 28, background: colors.accent,
                borderRadius: 3, flexShrink: 0,
              }} />
              <span style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: colors.muted, fontWeight: 500 }}>
                Patient Parameters
              </span>
            </div>

            {/* Grid of fields */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px 24px" }}>
              {fields.map(({ key, label, type, placeholder, hint, options, min, max, step }, idx) => {
                const isFoc = focused === key;
                const hasErr = !!errors[key];
                const borderColor = hasErr ? "#f87171" : isFoc ? colors.accent : colors.border;

                return (
                  <div
                    key={key}
                    style={{ animation: `fadeSlideUp 0.5s ease ${idx * 50 + 200}ms both` }}
                  >
                    <label style={{ display: "block", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: isFoc ? colors.accent : colors.text, transition: "color 0.2s" }}>
                        {label}
                      </span>
                      {hasErr && (
                        <span style={{ fontSize: 11, color: "#f87171", marginLeft: 8 }}>— Required</span>
                      )}
                    </label>

                    {type === "select" ? (
                      <select
                        value={form[key] ?? ""}
                        onChange={(e) => handleChange(key, e.target.value)}
                        onFocus={() => setFocused(key)}
                        onBlur={() => setFocused(null)}
                        style={{
                          width: "100%",
                          background: colors.inputBg,
                          border: `1.5px solid ${borderColor}`,
                          borderRadius: 10,
                          color: form[key] !== undefined && form[key] !== "" ? colors.text : colors.muted,
                          fontSize: 14,
                          padding: "10px 14px",
                          outline: "none",
                          transition: "border-color 0.2s, box-shadow 0.2s",
                          boxShadow: isFoc ? `0 0 0 3px ${colors.accentSoft}` : "none",
                          cursor: "pointer",
                          appearance: "none",
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237c7c9a' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 14px center",
                          paddingRight: 36,
                        }}
                      >
                        {options.map(({ v, l }) => (
                          <option key={v} value={v} style={{ background: colors.card }}>{l}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="number"
                        value={form[key] ?? ""}
                        placeholder={placeholder}
                        min={min} max={max} step={step || 1}
                        onChange={(e) => handleChange(key, e.target.value)}
                        onFocus={() => setFocused(key)}
                        onBlur={() => setFocused(null)}
                        style={{
                          width: "100%",
                          background: colors.inputBg,
                          border: `1.5px solid ${borderColor}`,
                          borderRadius: 10,
                          color: colors.text,
                          fontSize: 14,
                          padding: "10px 14px",
                          outline: "none",
                          transition: "border-color 0.2s, box-shadow 0.2s",
                          boxShadow: isFoc ? `0 0 0 3px ${colors.accentSoft}` : "none",
                          boxSizing: "border-box",
                        }}
                      />
                    )}

                    <p style={{ fontSize: 11, color: colors.muted, margin: "5px 0 0", lineHeight: 1.5 }}>{hint}</p>
                  </div>
                );
              })}
            </div>

            {/* Submit */}
            <div style={{ marginTop: 40, textAlign: "center" }}>
              <button
                onClick={handlePredict}
                disabled={loading}
                style={{
                  background: loading ? colors.accentSoft : `linear-gradient(135deg, #e11d48, #be123c)`,
                  color: loading ? colors.accent : "#fff",
                  border: loading ? `1.5px solid ${colors.accent}` : "none",
                  borderRadius: 12,
                  padding: "14px 48px",
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: loading ? "not-allowed" : "pointer",
                  letterSpacing: 0.3,
                  transition: "all 0.2s",
                  boxShadow: loading ? "none" : "0 8px 32px rgba(225,29,72,0.35)",
                  transform: loading ? "scale(0.98)" : "scale(1)",
                }}
              >
                {loading ? "Analyzing…" : "Predict Heart Disease Risk"}
              </button>

              {loading && (
                <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 6 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 7, height: 7, borderRadius: "50%", background: colors.accent,
                      animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </BlurIn>

        {/* Result */}
        {result && (
          <div ref={resultRef} style={{ marginTop: 28, animation: "cardIn 0.6s ease both" }}>
            {result === "error" ? (
              <div style={{
                background: colors.card, border: `1px solid #f87171`,
                borderRadius: 20, padding: "32px 36px", textAlign: "center",
              }}>
                <p style={{ color: "#f87171", fontSize: 16 }}>⚠️ Analysis failed. Please try again.</p>
              </div>
            ) : (
              <div style={{
                background: colors.card,
                border: `1px solid ${result === "healthy" ? colors.healthy : colors.accent}`,
                borderRadius: 20, padding: "36px 40px",
                boxShadow: `0 24px 60px ${result === "healthy" ? "rgba(16,185,129,0.15)" : "rgba(225,29,72,0.2)"}`,
              }}>
                {/* Icon + status */}
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div style={{ fontSize: 52, marginBottom: 12, lineHeight: 1 }}>
                    {result === "healthy" ? "💚" : "❤️"}
                  </div>
                  <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.9rem",
                    fontWeight: 700,
                    color: result === "healthy" ? colors.healthy : colors.accent,
                    margin: "0 0 6px",
                  }}>
                    <SplitText
                      text={result === "healthy" ? "No Heart Disease Detected" : "Heart Disease Risk Detected"}
                      delay={100} charDelay={28}
                    />
                  </h2>
                  <BlurIn delay={600}>
                    <p style={{ color: colors.muted, fontSize: 14 }}>
                      {result === "healthy"
                        ? "Based on the provided parameters, the model predicts a healthy heart."
                        : "The model has identified indicators associated with heart disease."}
                    </p>
                  </BlurIn>
                </div>

                {/* Confidence + factors */}
                {resultData && (
                  <BlurIn delay={800}>
                    <div style={{
                      display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
                      borderTop: `1px solid ${colors.border}`, paddingTop: 24, marginTop: 8,
                    }}>
                      <div style={{
                        background: result === "healthy" ? colors.healthySoft : colors.accentSoft,
                        borderRadius: 12, padding: "16px 20px",
                      }}>
                        <p style={{ fontSize: 11, color: colors.muted, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 6px" }}>Confidence</p>
                        <p style={{ fontSize: 28, fontWeight: 700, color: result === "healthy" ? colors.healthy : colors.accent, margin: 0 }}>
                          {resultData.confidence}%
                        </p>
                      </div>
                      <div style={{
                        background: colors.inputBg,
                        borderRadius: 12, padding: "16px 20px",
                      }}>
                        <p style={{ fontSize: 11, color: colors.muted, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 10px" }}>Key Factors</p>
                        {(resultData.keyFactors || []).map((f, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                            <div style={{ width: 5, height: 5, borderRadius: "50%", background: result === "healthy" ? colors.healthy : colors.accent, flexShrink: 0 }} />
                            <span style={{ fontSize: 12, color: colors.text }}>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <p style={{
                      fontSize: 11, color: colors.muted, textAlign: "center",
                      marginTop: 20, lineHeight: 1.6,
                      borderTop: `1px solid ${colors.border}`, paddingTop: 16,
                    }}>
                      ⚕️ This is an AI-assisted prediction and not a medical diagnosis. Please consult a qualified cardiologist.
                    </p>
                  </BlurIn>
                )}

                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <button onClick={reset} style={{
                    background: "transparent", border: `1px solid ${colors.border}`,
                    color: colors.muted, borderRadius: 8, padding: "8px 24px",
                    fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.2s",
                  }}>
                    ← Reset & Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
