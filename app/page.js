"use client";
import { useState, useRef, useCallback } from "react";

const G = "#C9A84C";
const GL = "#E8D08A";
const DM = "#2A2420";
const DS = "#3A322C";
const CR = "#F5F0E8";
const CD = "#E8E0D0";
const MU = "#8A7A6A";

const s = {
  wrap: { maxWidth: 800, margin: "0 auto", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" },
  header: { textAlign: "center", padding: "2.5rem 2rem 2rem", borderBottom: "1px solid rgba(201,168,76,0.15)" },
  h1: { fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.4rem)", fontWeight: 400, color: GL, letterSpacing: "0.02em" },
  sub: { marginTop: "0.4rem", color: MU, fontSize: "0.85rem", fontWeight: 300, letterSpacing: "0.04em" },
  card: { background: DM, border: "1px solid rgba(201,168,76,0.12)", borderRadius: 2, padding: "1.75rem" },
  cardTitle: { fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: G, marginBottom: "1.25rem", fontWeight: 500 },
  uploadZone: { border: "1px dashed rgba(201,168,76,0.3)", borderRadius: 2, padding: "2rem", textAlign: "center", cursor: "pointer", background: "rgba(201,168,76,0.02)", transition: "all 0.3s" },
  preview: { maxWidth: "100%", maxHeight: 280, objectFit: "contain", borderRadius: 2, display: "block", margin: "0 auto" },
  label: { fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: G, fontWeight: 500, display: "block", marginBottom: "0.4rem" },
  input: { background: DS, border: "1px solid rgba(201,168,76,0.15)", borderRadius: 2, color: CR, fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", padding: "0.6rem 0.8rem", width: "100%", outline: "none" },
  textarea: { background: DS, border: "1px solid rgba(201,168,76,0.15)", borderRadius: 2, color: CR, fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", padding: "0.6rem 0.8rem", width: "100%", minHeight: 75, resize: "vertical", lineHeight: 1.5, outline: "none" },
  genBtn: { width: "100%", padding: "0.9rem 2rem", background: "transparent", border: `1px solid ${G}`, color: GL, fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontStyle: "italic", letterSpacing: "0.08em", cursor: "pointer", borderRadius: 2 },
  goldBtn: { padding: "0.55rem 1.3rem", background: G, color: "#1A1612", border: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500, cursor: "pointer", borderRadius: 2 },
  outlineBtn: { padding: "0.55rem 1.3rem", background: "transparent", border: "1px solid rgba(201,168,76,0.25)", color: MU, fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2 },
  resultText: { fontSize: "0.9rem", lineHeight: 1.85, color: CD, whiteSpace: "pre-wrap", borderLeft: `2px solid ${G}`, paddingLeft: "1.25rem" },
  error: { color: "#E87070", fontSize: "0.82rem", padding: "0.7rem 1rem", background: "rgba(232,112,112,0.08)", border: "1px solid rgba(232,112,112,0.2)", borderRadius: 2 },
  divider: { height: 1, background: `linear-gradient(to right, transparent, rgba(201,168,76,0.2), transparent)`, margin: "0.25rem 0 1.25rem" },
  row: { display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr" },
  langWrap: { display: "flex", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 2, overflow: "hidden", width: "fit-content" },
  langBtn: (active) => ({ padding: "0.45rem 1.1rem", background: active ? G : "transparent", color: active ? "#1A1612" : MU, border: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", cursor: "pointer", fontWeight: active ? 500 : 400 }),
};

export default function Page() {
  const [lang, setLang] = useState("hu");
  const [imageB64, setImageB64] = useState(null);
  const [imageType, setImageType] = useState(null);
  const [preview, setPreview] = useState(null);
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [caseM, setCaseM] = useState("");
  const [condition, setCondition] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [refining, setRefining] = useState(false);
  const [finalText, setFinalText] = useState("");
  const [showFinal, setShowFinal] = useState(false);
  const [finalSaved, setFinalSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setError("A kép túl nagy (max 10MB)."); return; }
    setImageType(file.type);
    const reader = new FileReader();
    reader.onload = (e) => { setImageB64(e.target.result.split(",")[1]); setPreview(e.target.result); };
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }, []);

  const callAPI = async (body) => {
    const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.text;
  };

  const generate = async () => {
    if (!model.trim()) { setError("Kérlek add meg legalább a márka és modell mezőt."); return; }
    setError(null); setResult(null); setLoading(true);
    try {
      const text = await callAPI({ model, year, caseM, condition, lang, image: imageB64, imageType });
      setResult(text);
    } catch (err) { setError("Hiba történt. Kérlek próbáld újra."); }
    finally { setLoading(false); }
  };

  const refine = async () => {
    if (!feedback.trim()) return;
    setRefining(true); setError(null);
    try {
      const text = await callAPI({ model, year, caseM, condition, lang, image: imageB64, imageType, feedback, previousResult: result });
      setResult(text); setFeedback("");
    } catch (err) { setError("Hiba történt a finomítás során."); }
    finally { setRefining(false); }
  };

  const saveFinal = async () => {
    if (!finalText.trim()) return;
    try {
      const res = await fetch("/api/references", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model, text: finalText }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFinalSaved(true);
      setTimeout(() => { setFinalSaved(false); setShowFinal(false); setFinalText(""); }, 2000);
    } catch (err) { setError("Hiba a mentés során."); }
  };

  const copy = () => {
    navigator.clipboard.writeText(result).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const reset = () => {
    setModel(""); setYear(""); setCaseM(""); setCondition("");
    setImageB64(null); setImageType(null); setPreview(null);
    setResult(null); setError(null); setFeedback("");
  };

  return (
    <>
      <header style={s.header}>
        <h1 style={s.h1}>Óra Hirdetési Asszisztens</h1>
        <p style={s.sub}>Mutass egy képet, adj meg pár adatot és már kész is</p>
      </header>

      <div style={s.wrap}>

        {/* Fotó */}
        <div style={s.card}>
          <div style={s.cardTitle}>Fotó</div>
          {!preview ? (
            <div
              style={{ ...s.uploadZone, borderColor: drag ? G : "rgba(201,168,76,0.3)" }}
              onClick={() => fileRef.current.click()}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={onDrop}
            >
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={MU} strokeWidth="1.5" style={{ margin: "0 auto 0.75rem", display: "block" }}>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <strong style={{ display: "block", color: CD, fontSize: "0.9rem", marginBottom: "0.25rem" }}>Húzd ide a képet vagy kattints</strong>
              <span style={{ color: MU, fontSize: "0.8rem" }}>JPG, PNG – maximum 10MB</span>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <img src={preview} style={s.preview} alt="Előnézet" />
              <button style={{ ...s.outlineBtn, marginTop: "0.75rem" }} onClick={() => { setPreview(null); setImageB64(null); }}>Kép cseréje</button>
            </div>
          )}
        </div>

        {/* Adatok */}
        <div style={s.card}>
          <div style={s.cardTitle}>Az óra adatai</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={s.row}>
              <div><label style={s.label}>Márka és modell *</label><input style={s.input} value={model} onChange={(e) => setModel(e.target.value)} placeholder="pl. King Seiko 45KS Hi-Beat" /></div>
              <div><label style={s.label}>Gyártási év / korszak</label><input style={s.input} value={year} onChange={(e) => setYear(e.target.value)} placeholder="pl. 1968–1974" /></div>
            </div>
            <div><label style={s.label}>Tok anyaga</label><input style={s.input} value={caseM} onChange={(e) => setCaseM(e.target.value)} placeholder="pl. aranyozott acél, rozsdamentes" /></div>
            <div><label style={s.label}>Állapot és különlegességek</label><textarea style={s.textarea} value={condition} onChange={(e) => setCondition(e.target.value)} placeholder="pl. frissen szervizelt, tropical patina, eredeti számlap..." /></div>
          </div>
        </div>

        {/* Nyelv */}
        <div style={s.card}>
          <div style={s.cardTitle}>Nyelv</div>
          <div style={s.langWrap}>
            <button style={s.langBtn(lang === "hu")} onClick={() => setLang("hu")}>Magyar</button>
            <button style={s.langBtn(lang === "en")} onClick={() => setLang("en")}>English</button>
          </div>
        </div>

        {/* Gomb */}
        <button style={s.genBtn} onClick={generate} disabled={loading}>
          {loading ? "Generálás folyamatban…" : "Hirdetési szöveg generálása"}
        </button>

        {error && <div style={s.error}>{error}</div>}
        {loading && <div style={{ textAlign: "center", color: MU, fontSize: "0.82rem", letterSpacing: "0.1em" }}>Egy pillanat, az óra történetét kutatjuk…</div>}

        {/* Eredmény */}
        {result && (
          <div style={{ ...s.card, animation: "fadeIn 0.4s ease" }}>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            <div style={s.cardTitle}>Generált hirdetési szöveg</div>
            <div style={s.divider} />
            <div style={s.resultText}>{result}</div>

            {/* Visszajelzés */}
            <div style={{ marginTop: "1.5rem" }}>
              <label style={s.label}>Visszajelzés</label>
              <textarea
                style={s.textarea}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Mit változtassak? pl. az első mondat túl marketinges..."
              />
            </div>

            {/* Végleges szöveg */}
            <div style={{ marginTop: "1rem" }}>
              <button onClick={() => setShowFinal(!showFinal)} style={{ background: "transparent", border: "none", color: MU, fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", padding: 0 }}>
                {showFinal ? "▲ Elrejt" : "▼ Végleges szöveg megadása"}
              </button>
              {showFinal && (
                <div style={{ marginTop: "0.75rem" }}>
                  <textarea
                    style={{ ...s.textarea, minHeight: 120 }}
                    value={finalText}
                    onChange={(e) => setFinalText(e.target.value)}
                    placeholder="Illeszd be a módosított végleges szöveget – ebből tanul a rendszer..."
                  />
                  <button onClick={saveFinal} disabled={!finalText.trim()} style={{ ...s.outlineBtn, marginTop: "0.5rem", borderColor: finalSaved ? "#6A8A6A" : G, color: finalSaved ? "#6A8A6A" : GL }}>
                    {finalSaved ? "Elmentve ✓" : "Végleges szöveg mentése"}
                  </button>
                </div>
              )}
            </div>

            {/* Gombok */}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
              <button style={s.goldBtn} onClick={copy}>{copied ? "Másolva ✓" : "Másolás"}</button>
              {feedback.trim() && (
                <button style={{ ...s.outlineBtn, borderColor: G, color: GL }} onClick={refine} disabled={refining}>
                  {refining ? "Finomítás…" : "Finomítás visszajelzés alapján"}
                </button>
              )}
              <button style={s.outlineBtn} onClick={reset}>Új hirdetés</button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
