"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const G = "#C9A84C";
const GL = "#E8D08A";
const DM = "#2A2420";
const DS = "#3A322C";
const CR = "#F5F0E8";
const CD = "#E8E0D0";
const MU = "#8A7A6A";

export default function ReferencesPage() {
  const [refs, setRefs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    loadRefs();
  }, []);

  const loadRefs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/references");
      const data = await res.json();
      setRefs(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteRef = async (id) => {
    if (!confirm("Biztosan törlöd ezt a referenciát?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/references/${id}`, { method: "DELETE" });
      setRefs(refs.filter(r => r.id !== id));
      if (expanded === id) setExpanded(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = refs.filter(r =>
    r.model.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #1A1612; color: #F5F0E8; font-family: 'DM Sans', sans-serif; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .ref-card { animation: fadeIn 0.3s ease; }
      `}</style>

      <header style={{ textAlign: "center", padding: "2.5rem 2rem 2rem", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.4rem)", fontWeight: 400, color: GL, letterSpacing: "0.02em" }}>
          Referenciák
        </h1>
        <p style={{ marginTop: "0.4rem", color: MU, fontSize: "0.85rem" }}>Elmentett végleges hirdetési szövegek</p>
        <Link href="/" style={{ display: "inline-block", marginTop: "1rem", color: G, fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>
          ← Vissza a főoldalra
        </Link>
      </header>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Kereső */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Keresés márka vagy modell alapján..."
          style={{ background: DM, border: "1px solid rgba(201,168,76,0.15)", borderRadius: 2, color: CR, fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", padding: "0.7rem 1rem", width: "100%", outline: "none" }}
          onFocus={e => e.target.style.borderColor = G}
          onBlur={e => e.target.style.borderColor = "rgba(201,168,76,0.15)"}
        />

        {/* Szám */}
        {!loading && (
          <div style={{ color: MU, fontSize: "0.8rem", letterSpacing: "0.05em" }}>
            {filtered.length} referencia {search && `("${search}" keresésre)`}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", color: MU, padding: "2rem", fontSize: "0.85rem" }}>Betöltés...</div>
        )}

        {/* Kártyák */}
        {filtered.map(ref => (
          <div key={ref.id} className="ref-card" style={{ background: DM, border: "1px solid rgba(201,168,76,0.12)", borderRadius: 2, overflow: "hidden" }}>
            {/* Fejléc */}
            <div
              style={{ padding: "1.25rem 1.5rem", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              onClick={() => setExpanded(expanded === ref.id ? null : ref.id)}
            >
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: CD, fontWeight: 400 }}>{ref.model}</div>
                <div style={{ fontSize: "0.75rem", color: MU, marginTop: "0.25rem" }}>{formatDate(ref.created_at)}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <button
                  onClick={e => { e.stopPropagation(); deleteRef(ref.id); }}
                  disabled={deleting === ref.id}
                  style={{ background: "transparent", border: "none", color: MU, cursor: "pointer", fontSize: "0.75rem", letterSpacing: "0.06em", textTransform: "uppercase" }}
                >
                  {deleting === ref.id ? "..." : "Törlés"}
                </button>
                <span style={{ color: G, fontSize: "0.8rem" }}>{expanded === ref.id ? "▲" : "▼"}</span>
              </div>
            </div>

            {/* Szöveg */}
            {expanded === ref.id && (
              <div style={{ borderTop: "1px solid rgba(201,168,76,0.1)", padding: "1.25rem 1.5rem" }}>
                <div style={{ fontSize: "0.88rem", lineHeight: 1.8, color: CD, whiteSpace: "pre-wrap", borderLeft: `2px solid ${G}`, paddingLeft: "1.25rem" }}>
                  {ref.text}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Üres állapot */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", color: MU, padding: "3rem", fontSize: "0.85rem" }}>
            {search ? "Nincs találat erre a keresésre." : "Még nincs elmentett referencia."}
          </div>
        )}

      </div>
    </>
  );
}
