// backend/controllers/locationController.js
import { fetchPlaces, fetchWorkshops } from "../services/osmService.js";

// ─────────────────────────────────────────────────────────────
// GET /api/location/search?q=Kozhikode
// Returns autocomplete suggestions for the search input
// ─────────────────────────────────────────────────────────────
export const searchPlaces = async (req, res) => {
  try {
    const { q } = req.query;

    // Don't search if query is too short
    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    const results = await fetchPlaces(q);
    res.json(results);

  } catch (error) {
    console.error("searchPlaces error:", error.message);
    res.status(500).json({ error: "Could not search places. Please try again." });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/location/workshops?lat=11.25&lon=75.78&radius=5000
// Returns nearby workshops sorted by distance
// ─────────────────────────────────────────────────────────────
export const getWorkshops = async (req, res) => {
  try {
    const { lat, lon, radius } = req.query;

    // lat and lon are required
    if (!lat || !lon) {
      return res.status(400).json({ error: "lat and lon are required" });
    }

    const results = await fetchWorkshops(lat, lon, radius);
    res.json(results);

  } catch (error) {
    console.error("getWorkshops error:", error.message);
    res.status(500).json({ error: "Could not fetch workshops. Please try again." });
  }
};