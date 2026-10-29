import { useEffect, useState } from "react";

type GitHubProfile = {
  public_repos: number;
  followers: number;
  public_gists: number;
  html_url: string;
  updated_at: string;
};

type WeatherResponse = {
  current: {
    temperature_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
};

type SignalsState = {
  github: GitHubProfile | null;
  weather: WeatherResponse["current"] | null;
  loading: boolean;
  error: string | null;
};

const CACHE_KEY = "portfolio-public-signals";
const CACHE_TTL = 15 * 60 * 1000;

const weatherLabel = (code: number) => {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  return "Storm conditions";
};

const readCache = (): Omit<SignalsState, "loading" | "error"> | null => {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null") as { timestamp: number; data: Omit<SignalsState, "loading" | "error"> } | null;
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.data;
  } catch {
    return null;
  }
  return null;
};

const PublicSignals = () => {
  const [state, setState] = useState<SignalsState>(() => {
    const cached = typeof window !== "undefined" ? readCache() : null;
    return { ...(cached || { github: null, weather: null }), loading: !cached, error: null };
  });

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const [githubResponse, weatherResponse] = await Promise.all([
          fetch("https://api.github.com/users/DARREN-2000", { signal: controller.signal, headers: { Accept: "application/vnd.github+json" } }),
          fetch("https://api.open-meteo.com/v1/forecast?latitude=49.4521&longitude=11.0767&current=temperature_2m,weather_code,wind_speed_10m&timezone=Europe%2FBerlin", { signal: controller.signal }),
        ]);
        if (!githubResponse.ok || !weatherResponse.ok) {
          const status = !githubResponse.ok ? githubResponse.status : weatherResponse.status;
          throw new Error(`Public signals are temporarily unavailable (HTTP ${status}).`);
        }
        const data = {
          github: await githubResponse.json() as GitHubProfile,
          weather: (await weatherResponse.json() as WeatherResponse).current,
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
        setState({ ...data, loading: false, error: null });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState((current) => ({ ...current, loading: false, error: error instanceof Error ? error.message : "Public signals are unavailable." }));
      }
    };
    load();
    return () => controller.abort();
  }, []);

  return (
    <section className="section public-signals-section" aria-labelledby="public-signals-title">
      <div className="section-container">
        <div className="section-header">
          <span className="section-eyebrow">Public signals</span>
          <h2 id="public-signals-title" className="section-title">A small window<br /><span className="accent-text">into now</span></h2>
          <p className="section-sub">Keyless public data, cached locally and shown with a fallback when an external service is unavailable. No visitor analytics are sent.</p>
        </div>
        {state.loading ? (
          <div className="signals-loading" role="status">Loading public signals…</div>
        ) : (
          <div className="signals-grid">
            <a className="signal-card signal-card--github" href={state.github?.html_url || "https://github.com/DARREN-2000"} target="_blank" rel="noopener noreferrer">
              <span className="signal-card-label">GitHub profile</span>
              <strong>{state.github?.public_repos ?? "—"}</strong>
              <span>public repositories</span>
              <small>{state.github ? `${state.github.followers} followers · ${state.github.public_gists} public gists` : "Open profile ↗"}</small>
            </a>
            <div className="signal-card signal-card--weather">
              <span className="signal-card-label">Nürnberg, Germany</span>
              <strong>{state.weather ? `${Math.round(state.weather.temperature_2m)}°C` : "—"}</strong>
              <span>{state.weather ? weatherLabel(state.weather.weather_code) : "Weather unavailable"}</span>
              <small>{state.weather ? `Wind ${Math.round(state.weather.wind_speed_10m)} km/h · Open-Meteo` : "Try again later"}</small>
            </div>
            <div className="signal-card signal-card--principle">
              <span className="signal-card-label">Operating principle</span>
              <strong>Build for inspection</strong>
              <span>Readable systems, measured outcomes, honest boundaries.</span>
              <small>Updated with the portfolio’s engineering practice</small>
            </div>
          </div>
        )}
        {state.error && <p className="signals-note" role="status">{state.error} Showing cached or static portfolio content instead.</p>}
      </div>
    </section>
  );
};

export default PublicSignals;
