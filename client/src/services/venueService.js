// src/services/venueService.js

import { API_ENDPOINTS } from "../config/api";

export async function getVenues() {
  try {
    const res = await fetch(API_ENDPOINTS.GET_VENUES);
    const data = await res.json();
    return data; // contains { success, data }
  } catch (err) {
    return { success: false, message: "Server unreachable" };
  }
}

export async function createVenue(venueData) {
  try {
    const res = await fetch(API_ENDPOINTS.CREATE_VENUE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(venueData),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: "Cannot create venue" };
  }
}

export async function updateVenue(id, updateData) {
  try {
    const res = await fetch(`${API_ENDPOINTS.UPDATE_VENUE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: "Cannot update venue" };
  }
}

export async function deleteVenue(id) {
  try {
    const res = await fetch(`${API_ENDPOINTS.DELETE_VENUE}/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: "Cannot delete venue" };
  }
}



// async function handleBooking() {
//   const res = await fetch(API_ENDPOINTS.BOOK_SLOT, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       venueId: venue._id,
//       courtId: selectedTurf.id,
//       date: selectedDate,
//       timeSlot: selectedTimeSlot,
//       userId: "123" // optional
//     }),
//   });

//   const data = await res.json();

//   if (data.success) {
//     alert("Booked successfully!");
//     onBookTurf(selectedTurf, selectedTimeSlot, selectedDate);
//   } else {
//     alert(data.message);
//   }
// }
