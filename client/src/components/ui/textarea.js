import React from "react";
import "./textarea.css"; // <-- custom CSS file

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={`custom-textarea ${className}`}
      {...props}
    />
  );
}
