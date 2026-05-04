// frontend/src/components/LocationSearch.jsx
import { useState, useEffect, useRef } from "react";
import API from "../services/api";

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ─────────────────────────────────────────────────────────────
// IMAGE AREA — Street View photo OR live OSM map pin
// ─────────────────────────────────────────────────────────────
function ShopImage({ shop }) {
  const [imgError, setImgError] = useState(false);

  // If Street View is available, show real photo
  if (shop.imageType === "streetview" && shop.image && !imgError) {
    return (
      <div style={{ position: "relative", height: "170px", overflow: "hidden", background: "#f1f5f9" }}>
        <img
          src={shop.image}
          alt={shop.name}
          onError={() => setImgError(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={distancePill}>{shop.distance} km away</div>
        <div style={imageBadge}>📷 Street View</div>
      </div>
    );
  }

  // Fallback — live OpenStreetMap embed (always works, free, no key needed)
  // bbox = bounding box: a small area around the workshop coordinates
  const delta = 0.004; // roughly 400m on each side
  const bbox = `${shop.lon - delta},${shop.lat - delta},${shop.lon + delta},${shop.lat + delta}`;
  const osmUrl =
    `https://www.openstreetmap.org/export/embed.html` +
    `?bbox=${bbox}&layer=mapnik&marker=${shop.lat},${shop.lon}`;

  return (
    <div style={{ position: "relative", height: "170px", overflow: "hidden", background: "#e2e8f0" }}>
      <iframe
        src={osmUrl}
        title={`Map for ${shop.name}`}
        width="100%"
        height="170"
        style={{ border: "none", display: "block", pointerEvents: "none" }}
        loading="lazy"
      />
      <div style={distancePill}>{shop.distance} km away</div>
      <div style={imageBadge}>🗺 Live Map</div>
    </div>
  );
}

const distancePill = {
  position: "absolute", top: "10px", right: "10px",
  background: "rgba(0,0,0,0.65)", color: "white",
  padding: "4px 10px", borderRadius: "20px",
  fontSize: "12px", fontWeight: "700",
};

const imageBadge = {
  position: "absolute", bottom: "8px", left: "8px",
  background: "rgba(0,0,0,0.55)", color: "white",
  padding: "3px 8px", borderRadius: "12px",
  fontSize: "11px", fontWeight: "600",
};

// ─────────────────────────────────────────────────────────────
// WORKSHOP CARD
// ─────────────────────────────────────────────────────────────
function WorkshopCard({ shop }) {
  const typeLabels = {
    car_repair: { label: "Car Repair", color: "#f59e0b" },
    tyres:      { label: "Tyre Shop",  color: "#3b82f6" },
    craft:      { label: "Garage",     color: "#8b5cf6" },
  };
  const badge = typeLabels[shop.type] || { label: "Workshop", color: "#64748b" };

  return (
    <div style={{
      background: "white", borderRadius: "16px",
      border: "1px solid #e2e8f0", overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      display: "flex", flexDirection: "column",
    }}>

      {/* Real image or live map */}
      <ShopImage shop={shop} />

      {/* Details */}
      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>

        <span style={{
          display: "inline-block", width: "fit-content",
          background: badge.color + "20", color: badge.color,
          fontSize: "11px", fontWeight: "700",
          padding: "2px 8px", borderRadius: "20px",
          letterSpacing: "0.5px", textTransform: "uppercase",
        }}>
          {badge.label}
        </span>

        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "#0f172a", lineHeight: "1.3" }}>
          {shop.name}
        </h3>

        {(shop.address || shop.city) && (
          <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
            📍 {shop.address || shop.city}
          </p>
        )}

        {shop.phone && (
          <a href={`tel:${shop.phone}`} style={{ fontSize: "13px", color: "#3b82f6", textDecoration: "none" }}>
            📞 {shop.phone}
          </a>
        )}

        {shop.opening_hours && (
          <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
            🕐 {shop.opening_hours}
          </p>
        )}

        <div style={{ flex: 1 }} />

        {/* Buttons */}
        <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
          <a
            href={shop.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1, textAlign: "center",
              background: "#eab308", color: "black",
              padding: "10px", borderRadius: "10px",
              fontSize: "13px", fontWeight: "700",
              textDecoration: "none",
            }}
          >
            🗺 Get Directions
          </a>
          {shop.website && (
            <a
              href={shop.website.startsWith("http") ? shop.website : `https://${shop.website}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "10px 14px", background: "#f1f5f9", color: "#374151",
                borderRadius: "10px", fontSize: "13px", fontWeight: "700",
                textDecoration: "none",
              }}
            >
              🌐
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SKELETON CARD
// ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
      <div style={{ height: "170px", background: "#f1f5f9", animation: "pulse 1.5s infinite" }} />
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ height: "13px", width: "40%", background: "#f1f5f9", borderRadius: "6px" }} />
        <div style={{ height: "18px", width: "80%", background: "#f1f5f9", borderRadius: "6px" }} />
        <div style={{ height: "13px", width: "60%", background: "#f1f5f9", borderRadius: "6px" }} />
        <div style={{ height: "38px", background: "#f1f5f9", borderRadius: "10px", marginTop: "8px" }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function LocationSearch() {
  const [query, setQuery]                             = useState("");
  const [suggestions, setSuggestions]                 = useState([]);
  const [selectedPlace, setSelectedPlace]             = useState(null);
  const [workshops, setWorkshops]                     = useState([]);
  const [radius, setRadius]                           = useState(5);
  const [loadingSuggestions, setLoadingSuggestions]   = useState(false);
  const [loadingWorkshops, setLoadingWorkshops]       = useState(false);
  const [error, setError]                             = useState(null);
  const [showDropdown, setShowDropdown]               = useState(false);

  const debouncedQuery = useDebounce(query, 400);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (debouncedQuery.length < 3 || selectedPlace) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setLoadingSuggestions(true);
    API.get(`/location/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((res) => { setSuggestions(res.data || []); setShowDropdown(res.data.length > 0); })
      .catch(() => setError("Could not load suggestions."))
      .finally(() => setLoadingSuggestions(false));
  }, [debouncedQuery, selectedPlace]);

  useEffect(() => {
    if (!selectedPlace) return;
    setLoadingWorkshops(true);
    setError(null);
    API.get(`/location/workshops?lat=${selectedPlace.lat}&lon=${selectedPlace.lon}&radius=${radius * 1000}`)
      .then((res) => setWorkshops(res.data || []))
      .catch(() => setError("Could not load workshops. Try again in a moment."))
      .finally(() => setLoadingWorkshops(false));
  }, [selectedPlace, radius]);

  const handleSelect = (place) => {
    setQuery(place.display_name);
    setSelectedPlace(place);
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleClear = () => {
    setQuery(""); setSelectedPlace(null);
    setSuggestions([]); setWorkshops([]);
    setError(null); setShowDropdown(false);
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>

      <section style={{ maxWidth: "960px", margin: "0 auto", padding: "0 20px 60px", fontFamily: "system-ui,sans-serif" }}>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px" }}>
            Find Nearby Workshops
          </h2>
          <p style={{ color: "#64748b", margin: 0, fontSize: "15px" }}>
            Search any location to see real car repair workshops near you
          </p>
        </div>

        {/* Search card */}
        <div style={{
          background: "white", borderRadius: "20px",
          border: "1px solid #e2e8f0", padding: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.07)", marginBottom: "24px",
        }}>
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              background: "#f8fafc", borderRadius: "12px",
              border: "2px solid #e2e8f0", padding: "0 14px",
            }}>
              <span style={{ color: "#94a3b8", fontSize: "18px" }}>
                {loadingSuggestions ? "⏳" : "🔍"}
              </span>
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); if (selectedPlace) setSelectedPlace(null); }}
                onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                placeholder="Type a city or area (e.g. Perinthalmanna)..."
                autoComplete="off"
                style={{ flex: 1, border: "none", background: "transparent", fontSize: "15px", fontWeight: "500", color: "#1e293b", padding: "14px 0", outline: "none" }}
              />
              {query && (
                <button onClick={handleClear} style={{ border: "none", background: "none", cursor: "pointer", fontSize: "18px", color: "#94a3b8" }}>
                  ✕
                </button>
              )}
            </div>

            {showDropdown && suggestions.length > 0 && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 50,
                background: "white", borderRadius: "14px",
                border: "1px solid #e2e8f0", boxShadow: "0 8px 30px rgba(0,0,0,0.12)", overflow: "hidden",
              }}>
                {suggestions.map((s, i) => (
                  <div key={i} onClick={() => handleSelect(s)}
                    style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 16px", cursor: "pointer", borderBottom: i < suggestions.length - 1 ? "1px solid #f1f5f9" : "none", background: "white" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                  >
                    <span style={{ marginTop: "2px" }}>📍</span>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>{s.display_name.split(",")[0]}</div>
                      <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>{s.display_name}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Radius slider */}
          <div style={{ marginTop: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Search Radius</label>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#eab308", background: "#fefce8", border: "1px solid #fde68a", padding: "2px 10px", borderRadius: "20px" }}>
                {radius} km
              </span>
            </div>
            <input type="range" min="1" max="20" step="1" value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#eab308", cursor: "pointer" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
              <span>1 km</span><span>20 km</span>
            </div>
          </div>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "14px 16px", color: "#dc2626", fontSize: "14px", marginBottom: "20px" }}>
            ⚠️ {error}
          </div>
        )}

        {loadingWorkshops && (
          <div>
            <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>
              Finding workshops...
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              <SkeletonCard /><SkeletonCard /><SkeletonCard />
            </div>
          </div>
        )}

        {!loadingWorkshops && workshops.length > 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1e293b" }}>
                {workshops.length} workshop{workshops.length !== 1 ? "s" : ""} found
              </h3>
              <span style={{ fontSize: "13px", color: "#64748b" }}>
                within {radius} km · nearest first
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {workshops.map((shop, i) => <WorkshopCard key={`${shop.id}-${i}`} shop={shop} />)}
            </div>
          </div>
        )}

        {!loadingWorkshops && selectedPlace && workshops.length === 0 && !error && (
          <div style={{ textAlign: "center", padding: "48px 20px", background: "white", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔧</div>
            <h3 style={{ color: "#1e293b", margin: "0 0 8px", fontWeight: "700" }}>No workshops found nearby</h3>
            <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>Try increasing the radius or searching a different area.</p>
          </div>
        )}
      </section>
    </>
  );
}