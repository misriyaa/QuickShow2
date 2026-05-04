// backend/services/osmService.js
import fetch from "node-fetch";

// ─────────────────────────────────────────────────────────────
// Your Google Maps API key — add this to your .env file:
// GOOGLE_MAPS_API_KEY=your_key_here
//
// HOW TO GET A FREE KEY (5 min setup):
// 1. Go to console.cloud.google.com
// 2. Create a project → Enable "Street View Static API"
// 3. Go to APIs & Services → Credentials → Create API Key
// 4. Paste it in your .env file
//
// Cost: FREE up to $200/month credit (~28,000 images/month)
// The metadata check (to see if a photo exists) is always FREE
// ─────────────────────────────────────────────────────────────
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// ─────────────────────────────────────────────────────────────
// HELPER: Real Google Street View photo of the actual building
// Uses GPS coordinates to get a real photo of that street/shop
// ─────────────────────────────────────────────────────────────
function getStreetViewUrl(lat, lon) {
  return (
    `https://maps.googleapis.com/maps/api/streetview` +
    `?size=600x300&location=${lat},${lon}&fov=90&pitch=10&key=${GOOGLE_API_KEY}`
  );
}

// ─────────────────────────────────────────────────────────────
// HELPER: Check if Street View has a photo for this location
// This API call is FREE — it doesn't charge any quota
// Returns "OK" if a real photo exists, otherwise something else
// ─────────────────────────────────────────────────────────────
async function hasStreetViewPhoto(lat, lon) {
  if (!GOOGLE_API_KEY) return false;
  try {
    const url =
      `https://maps.googleapis.com/maps/api/streetview/metadata` +
      `?location=${lat},${lon}&key=${GOOGLE_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.status === "OK"; // true = real photo exists
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// HELPER: Fallback — real OpenStreetMap tile of the location
// Shows the actual map at the workshop's GPS coordinates.
// Not a photo, but it IS the real location (no stock images).
// Free, no API key needed.
// ─────────────────────────────────────────────────────────────
function getStaticMapUrl(lat, lon) {
  return (
    `https://staticmap.openstreetmap.de/staticmap.php` +
    `?center=${lat},${lon}&zoom=16&size=600x300&markers=${lat},${lon},red-pushpin`
  );
}

// ─────────────────────────────────────────────────────────────
// HELPER: Haversine distance between two GPS points (in km)
// ─────────────────────────────────────────────────────────────
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return parseFloat((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2));
}

// ─────────────────────────────────────────────────────────────
// 1. SEARCH PLACES — Nominatim (free, no key needed)
// ─────────────────────────────────────────────────────────────
export const fetchPlaces = async (query) => {
  if (!query || query.trim().length < 2) return [];

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&addressdetails=1`,
    { headers: { "User-Agent": "AutoAid-App/1.0" } }
  );

  if (!res.ok) throw new Error("Nominatim request failed");
  return await res.json();
};

// ─────────────────────────────────────────────────────────────
// 2. FETCH WORKSHOPS — Overpass API + Street View images
// ─────────────────────────────────────────────────────────────
export const fetchWorkshops = async (lat, lon, radius = 5000) => {
  // Query OpenStreetMap for all car repair shops in the radius
  const overpassQuery = `
[out:json][timeout:25];
(
  node["shop"="car_repair"](around:${radius},${lat},${lon});
  node["amenity"="car_repair"](around:${radius},${lat},${lon});
  node["shop"="tyres"](around:${radius},${lat},${lon});
  node["craft"="car_repair"](around:${radius},${lat},${lon});
  way["shop"="car_repair"](around:${radius},${lat},${lon});
  way["amenity"="car_repair"](around:${radius},${lat},${lon});
);
out center;
`.trim();

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(overpassQuery)}`,
  });

  if (!res.ok) throw new Error("Overpass API failed");

  const json = await res.json();

  // Filter out elements with no coordinates
  const elements = (json.elements || []).filter(
    (el) => (el.lat ?? el.center?.lat) && (el.lon ?? el.center?.lon)
  );

  // Process all workshops in parallel (faster than one by one)
  const results = await Promise.all(
    elements.map(async (el) => {
      const shopLat = el.lat ?? el.center?.lat;
      const shopLon = el.lon ?? el.center?.lon;
      const shopType = el.tags?.shop || el.tags?.amenity || el.tags?.craft || "car_repair";

      // Build full address from OSM tags
      const addressParts = [
        el.tags?.["addr:housenumber"],
        el.tags?.["addr:street"],
        el.tags?.["addr:suburb"],
        el.tags?.["addr:city"],
      ].filter(Boolean);

      // Decide which image to use:
      // ✅ Option A: Real Street View photo of the actual building
      // ⚠️ Option B: Real map tile of the exact location (fallback)
      let image, imageType;

      const hasPhoto = await hasStreetViewPhoto(shopLat, shopLon);

      if (hasPhoto) {
        // Google has a real street-level photo of this location
        image = getStreetViewUrl(shopLat, shopLon);
        imageType = "streetview"; // real photo
      } else {
        // No street photo — show a real map of the exact location
        image = getStaticMapUrl(shopLat, shopLon);
        imageType = "map"; // real map (not a stock photo)
      }

      return {
        id: el.id,
        name: el.tags?.name || "Workshop",
        type: shopType,
        lat: shopLat,
        lon: shopLon,
        distance: getDistance(Number(lat), Number(lon), shopLat, shopLon),
        phone: el.tags?.phone || el.tags?.["contact:phone"] || null,
        website: el.tags?.website || el.tags?.["contact:website"] || null,
        opening_hours: el.tags?.opening_hours || null,
        address: addressParts.length > 0 ? addressParts.join(", ") : null,
        city: el.tags?.["addr:city"] || el.tags?.["addr:suburb"] || null,
        image,
        imageType, // "streetview" or "map" — used in frontend to show a label
        mapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${shopLat},${shopLon}`,
      };
    })
  );

  return results.sort((a, b) => a.distance - b.distance); // nearest first
};