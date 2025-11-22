import React from "react";
import "./card.css";

// --- Card ---
export function Card({ className = "", ...props }) {
  return (
    <div data-slot="card" className={`ui-card ${className}`} {...props} />
  );
}

// --- Card Header ---
export function CardHeader({ className = "", ...props }) {
  return (
    <div
      data-slot="card-header"
      className={`ui-card-header ${className}`}
      {...props}
    />
  );
}

// --- Card Title ---
export function CardTitle({ className = "", ...props }) {
  return (
    <h4 data-slot="card-title" className={`ui-card-title ${className}`} {...props} />
  );
}

// --- Card Description ---
export function CardDescription({ className = "", ...props }) {
  return (
    <p
      data-slot="card-description"
      className={`ui-card-description ${className}`}
      {...props}
    />
  );
}

// --- Card Action ---
export function CardAction({ className = "", ...props }) {
  return (
    <div
      data-slot="card-action"
      className={`ui-card-action ${className}`}
      {...props}
    />
  );
}

// --- Card Content ---
export function CardContent({ className = "", ...props }) {
  return (
    <div
      data-slot="card-content"
      className={`ui-card-content ${className}`}
      {...props}
    />
  );
}

// --- Card Footer ---
export function CardFooter({ className = "", ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={`ui-card-footer ${className}`}
      {...props}
    />
  );
}
