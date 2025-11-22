
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getVenues } from "../services/venueService.js";
import { Header } from "../components/Header.js";
import { VenueCard } from "../components/VenueCard.js";


export function HomePage() {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loadingVenues, setLoadingVenues] = useState(true);
  const [errorVenues, setErrorVenues] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const response = await getVenues();
      if (response.success) {
        setVenues(response.data);
        setFilteredVenues(response.data);
      } else {
        setErrorVenues(response.message);
      }
      setLoadingVenues(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredVenues(venues);
      return;
    }

    const q = searchQuery.toLowerCase();
    setFilteredVenues(
      venues.filter((v) =>
        v.name.toLowerCase().includes(q) ||
        (v.city && v.city.toLowerCase().includes(q)) ||
        (v.location && v.location.toLowerCase().includes(q))
      )
    );
  }, [searchQuery, venues]);

  const handleVenueSelect = (venue) => {
    navigate(`/venues/${venue._id}`, { state: { venue } });
  };

  return (
    <>
      <Header onResults={(data) => setFilteredVenues(data)} />

      <main className="page-content">
        <div className="pt-4">
          {loadingVenues && (
            <div className="text-center py-12 text-gray-500 text-lg">
              Loading venues...
            </div>
          )}

          {errorVenues && (
            <div className="text-center py-12 text-red-500 text-lg">
              {errorVenues}
            </div>
          )}

          {!loadingVenues && !errorVenues && (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl text-gray-900">Available Venues</h2>
                  <p className="text-gray-600">
                    {filteredVenues.length} venues found
                  </p>
                </div>
              </div>

              {filteredVenues.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No venues match your search.
                  </p>
                  <p className="text-gray-400 mt-2">Try changing filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVenues.map((venue) => (
                    <VenueCard
                      key={venue._id}
                      venue={venue}
                      onSelect={handleVenueSelect}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}


