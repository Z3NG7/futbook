export const API_BASE_URL = "http://localhost:5000";

export const API_ENDPOINTS = {
  // Venue CRUD
  GET_VENUES: `${API_BASE_URL}/api/venues`,
  CREATE_VENUE: `${API_BASE_URL}/api/venues`,
  UPDATE_VENUE: (id) => `${API_BASE_URL}/api/venues/${id}`,
  DELETE_VENUE: (id) => `${API_BASE_URL}/api/venues/${id}`,

  // Searching
  SEARCH_VENUES: `${API_BASE_URL}/api/venues/search`,

  // Booking
  BOOK_SLOT: `${API_BASE_URL}/api/bookings`,

  // Fetch booked slots for a specific court & date
  GET_BOOKED_SLOTS: (venueId, courtId, date) =>
    `${API_BASE_URL}/api/venues/${venueId}/court/${courtId}/bookings?date=${date}`,
};
