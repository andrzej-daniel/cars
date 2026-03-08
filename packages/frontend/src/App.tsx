import { useState, type FormEvent } from "react";
import { Logo } from "./components/Logo";

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
    <div className="min-h-screen flex flex-col bg-page-bg font-sans text-body-text">
      {/* Header */}
      <header className="bg-alcar-blue">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Logo variant="light" />
          <nav className="hidden md:flex gap-8">
            <a href="#" className="text-white/80 hover:text-white text-sm font-medium tracking-wide transition-colors">
              O NAS
            </a>
            <a href="#" className="text-white/80 hover:text-white text-sm font-medium tracking-wide transition-colors">
              USŁUGI
            </a>
            <a href="#" className="text-white/80 hover:text-white text-sm font-medium tracking-wide transition-colors">
              KONTAKT
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-alcar-blue py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Wyceń naprawę swojego samochodu
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Otrzymaj szacunkowy koszt naprawy w kilka sekund. Podaj dane swojego auta i opis problemu.
          </p>
          <a
            href="#formularz"
            className="inline-block bg-q-green hover:bg-q-green-dark text-white font-semibold px-8 py-3 rounded-lg text-lg transition-colors"
          >
            Rozpocznij wycenę
          </a>
        </div>
      </section>

      {/* Form section */}
      <main className="flex-1 py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-4" id="formularz">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
            <h2 className="text-2xl font-bold text-alcar-blue mb-6">
              Dane pojazdu i opis problemu
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-body-text mb-1.5">
                  Marka
                </label>
                <input
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="np. Volkswagen"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-q-green/50 focus:border-q-green transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-body-text mb-1.5">
                  Model
                </label>
                <input
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="np. Golf"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-q-green/50 focus:border-q-green transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-body-text mb-1.5">
                  Rocznik
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="np. 2018"
                  required
                  min={1950}
                  max={2026}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-q-green/50 focus:border-q-green transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-body-text mb-1.5">
                  Opis problemu
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Opisz co się dzieje z samochodem..."
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-q-green/50 focus:border-q-green transition-colors resize-vertical"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-q-green hover:bg-q-green-dark disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg text-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? "Wyceniam..." : "Wyceń naprawę"}
              </button>
            </form>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 p-5 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium">
              {error}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mt-6 bg-white rounded-2xl shadow-lg border-l-4 border-q-green p-6 md:p-8">
              <h2 className="text-xl font-bold text-alcar-blue mb-3">
                Szacunkowy koszt: {result.estimate}
              </h2>
              <p className="text-body-text mb-3">{result.details}</p>
              <p className="text-sm text-gray-500 italic">{result.disclaimer}</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-alcar-blue py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <Logo variant="light" />
            <div className="text-white/60 text-sm space-y-1">
              <p>Q Service Alcar - Profesjonalny serwis samochodowy</p>
              <p>&copy; {new Date().getFullYear()} Q Service Alcar. Wszelkie prawa zastrzeżone.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
