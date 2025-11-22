import "./VenueCard.css";

import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge.js";
import { Button } from "./ui/button.js";
import { MapPin, Star, Clock, Users } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback.js";

export function VenueCard({ venue, onSelect }) {
  return (
    <Card className="venue-card">
      <div className="venue-image-wrapper">

        <ImageWithFallback
          src={venue.image}
          alt={venue.name}
          className="venue-image"
        />

        {/* Sport tag */}
        <div className="venue-sport-badge">
          <Badge className="badge badge-green">
            {venue.sports[0]}
          </Badge>
        </div>

        {/* Rating */}
        <div className="venue-rating-box">
          <Star className="icon-xs star-icon" />
          <span className="rating-text">{venue.rating}</span>
        </div>

      </div>

      <CardContent className="venue-content">

        <h3 className="venue-title">{venue.name}</h3>

        <div className="venue-location">
          <MapPin className="icon-sm" />
          <span>{venue.location}</span>
        </div>

        <div className="venue-details">
          <div className="venue-detail-item">
            <Clock className="icon-sm" />
            <span>{venue.openTime} - {venue.closeTime}</span>
          </div>

          <div className="venue-detail-item">
            <Users className="icon-sm" />
            <span>{venue.capacity} players</span>
          </div>
        </div>

        <div className="venue-bottom-row">
          <div>
            <span className="venue-price">Rs.{venue.pricePerHour}</span>
            <span className="venue-price-sub">/hour</span>
          </div>

          <Button
            onClick={() => onSelect(venue)}
            className="btn-green"
          >
            Book Now
          </Button>
        </div>

        <div className="venue-turf-info">
          {venue.turfs} turf{venue.turfs > 1 ? "s" : ""} available
        </div>

      </CardContent>
    </Card>
  );
}
