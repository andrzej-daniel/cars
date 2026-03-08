import { useState, type FormEvent } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface EstimateResult {
  estimate: string;
  details: string;
  disclaimer: string;
}

export function App() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/api/estimate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, model, year: Number(year), description }),
      });

      if (!res.ok) {
        throw new Error("Błąd serwera");
      }

      const data = await res.json();
      setResult(data);
    } catch {
      setError("Nie udało się uzyskać wyceny. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: "0 20px", fontFamily: "system-ui, sans-serif" }}>
      <h1>Wycena naprawy samochodu</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Marka</label>
          <input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="np. Volkswagen"
            required
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Model</label>
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="np. Golf"
            required
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Rocznik</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="np. 2018"
            required
            min={1950}
            max={2026}
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Opis problemu</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Opisz co się dzieje z samochodem..."
            required
            rows={4}
            style={{ width: "100%", padding: 8, boxSizing: "border-box", resize: "vertical" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 24px",
            background: loading ? "#999" : "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: 16,
          }}
        >
          {loading ? "Wyceniam..." : "Wyceń naprawę"}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: 20, padding: 16, background: "#fee2e2", borderRadius: 8, color: "#dc2626" }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 20, padding: 16, background: "#f0fdf4", borderRadius: 8 }}>
          <h2 style={{ margin: "0 0 8px" }}>Szacunkowy koszt: {result.estimate}</h2>
          <p style={{ margin: "0 0 8px" }}>{result.details}</p>
          <p style={{ margin: 0, fontSize: 13, color: "#666", fontStyle: "italic" }}>{result.disclaimer}</p>
        </div>
      )}
    </div>
  );
}
