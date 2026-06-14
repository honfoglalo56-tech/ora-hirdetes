"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const G = "#C9A84C";
const GL = "#E8D08A";
const DM = "#2A2420";
const CD = "#E8E0D0";
const MU = "#8A7A6A";

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [copied, setCopied] = useState(null);
  const [finalTexts, setFinalTexts] = useState({});
  const [showFinal, setShowFinal] = useState({});
  const [finalSaved, setFinalSaved] = useState({});

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/history", { cache: "no-store" });
      const data = await res.json();
      setItems(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  const deleteItem = async (id) => {
    if (!confirm("Biztosan törlöd ezt az előzményt?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/history/${id}`, { method: "DELETE" });
      if (res.ok) {
        await loadHistory();
        if (expanded === id) setExpanded(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const saveFinal = async (item) => {
    const text = finalTexts[item.id];
    if (!text || !text.trim()) return;
    try {
      const res = await fetch("/api/references", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: item.model, text })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFinalSaved(prev => ({ ...prev, [item.id]: true }));
      setTimeout(() => {
        setFinalSaved(prev => ({ ...prev, [item.id]: false }));
        setShowFinal(prev => ({ ...prev, [item.id]: false }));
        setFinalTexts(prev => ({ ...prev, [item.id]: "" }));
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const copyText = (id, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const filtered = items.filter(r =>
    r.model.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("hu-HU", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #1A1612; color: #F5F0E8; font-family: 'DM Sans', sans-serif; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .hist-card { animation: fadeIn 0.3s ease; }
      `}</style>

      <header style={{ textAlign: "center", padding: "2.5rem 2rem 2rem", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.4rem)", fontWeight: 400, color: GL, letterSpacing: "0.02em" }}>
          Előzmények
        </h1>
        <p style={{ marginTop: "0.4rem", color: MU, fontSize: "0.85rem" }}>Minden generált hirdetési szöveg</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "1rem" }}>
          <Link href="/" style={{ color: G, fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>← Főoldal</Link>
          <Link href="/references" style={{ color: G, fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>Referenciák →</Link>
        </div>
      </header>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Keresés márka vagy modell alapján..."
          style={{ background: DM, border: "1px solid rgba(201,168,76,0.15)", borderRadius: 2, color: "#F5F0E8", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", padding: "0.7rem 1rem", width: "100%", outline: "none" }}
        />

        {!loading && (
          <div style={{ color: MU, fontSize: "0.8rem", letterSpacing: "0.05em" }}>
            {filtered.length} generálás {search && `("${search}" keresésre)`}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", color: MU, padding: "2rem", fontSize: "0.85rem" }}>Betöltés...</div>
        )}

        {filtered.map(item => (
          <div key={item.id} className="hist-card" style={{ background: DM, border: "1px solid rgba(201,168,76,0.12)", borderRadius: 2, overflow: "hidden" }}>
            <div
              style={{ padding: "1.25rem 1.5rem", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
            >
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: CD, fontWeight: 400 }}>{item.model}</div>
                <div style={{ fontSize: "0.72rem", color: MU, marginTop: "0.25rem", display: "flex", gap: "0.75rem" }}>
                  <span>{formatDate(item.created_at)}</span>
                  <span style={{ color: G, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.65rem" }}>{item.lang === "en" ? "English" : "Magyar"}</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <button
                  onClick={e => { e.stopPropagation(); copyText(item.id, item.text); }}
                  style={{ background: "transparent", border: "none", color: MU, cursor: "pointer", fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase" }}
                >
                  {copied === item.id ? "Másolva ✓" : "Másolás"}
                </button>
                <button
                  onClick={e => { e.stopPropagation(); deleteItem(item.id); }}
                  disabled={deleting === item.id}
                  style={{ background: "transparent", border: "none", color: MU, cursor: "pointer", fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase" }}
                >
                  {deleting === item.id ? "..." : "Törlés"}
                </button>
                <span style={{ color: G, fontSize: "0.8rem" }}>{expanded === item.id ? "▲" : "▼"}</span>
              </div>
            </div>

            {expanded === item.id && (
              <div style={{ borderTop: "1px solid rgba(201,168,76,0.1)", padding: "1.25rem 1.5rem" }}>
                <div style={{ fontSize: "0.88rem", lineHeight: 1.8, color: CD, whiteSpace: "pre-wrap", borderLeft: `2px solid ${G}`, paddingLeft: "1.25rem" }}>
                  {item.text}
                </div>

                <div style={{ marginTop: "1.25rem" }}>
                  <button
                    onClick={() => setShowFinal(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                    style={{ background: "transparent", border: "none", color: MU, fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", padding: 0 }}
                  >
                    {showFinal[item.id] ? "▲ Elrejt" : "▼ Végleges szöveg megadása"}
                  </button>

                  {showFinal[item.id] && (
                    <div style={{ marginTop: "0.75rem" }}>
                      <textarea
                        value={finalTexts[item.id] || ""}
                        onChange={e => setFinalTexts(prev => ({ ...prev, [item.id]: e.target.value }))}
                        placeholder="Illeszd be a módosított végleges szöveget – átkerül a referenciák közé..."
                        style={{ background: "#3A322C", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 2, color: "#F5F0E8", fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", padding: "0.6rem 0.8rem", width: "100%", minHeight: 120, resize: "vertical", lineHeight: 1.5, outline: "none" }}
                      />
                      <button
                        onClick={() => saveFinal(item)}
                        disabled={!finalTexts[item.id]?.trim()}
                        style={{ marginTop: "0.5rem", padding: "0.55rem 1.3rem", background: "transparent", border: `1px solid ${finalSaved[item.id] ? "#6A8A6A" : G}`, color: finalSaved[item.id] ? "#6A8A6A" : GL, fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2 }}
                      >
                        {finalSaved[item.id] ? "Elmentve ✓" : "Mentés referenciák közé"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", color: MU, padding: "3rem", fontSize: "0.85rem" }}>
            {search ? "Nincs találat." : "Még nincs előzmény."}
          </div>
        )}

      </div>
    </>
  );
}
