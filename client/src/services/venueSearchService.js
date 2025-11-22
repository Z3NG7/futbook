import { API_ENDPOINTS } from "../config/api";

export async function searchVenues({ query, city, minPrice, maxPrice }) {
  try {
    const url = new URL(API_ENDPOINTS.SEARCH_VENUES);

    if (query) url.searchParams.append("query", query);
    if (city && city !== "All Cities") url.searchParams.append("city", city);

    if (minPrice !== undefined && minPrice !== null) {
      url.searchParams.append("minPrice", minPrice);
    }

    if (maxPrice !== undefined && maxPrice !== null) {
      url.searchParams.append("maxPrice", maxPrice);
    }

    const res = await fetch(url.toString());
    return await res.json();

  } catch (err) {
    console.error("Search API error:", err);
    return { success: false, message: "Search failed" };
  }
}
