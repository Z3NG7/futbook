import React from "react";
import { Toaster as Sonner } from "sonner";

export function Toaster(props) {
  return (
    <Sonner
      className="toaster"
      style={{
        backgroundColor: "#ffffff",
        color: "#000000",
        border: "1px solid #e5e5e5",
        padding: "8px",
        borderRadius: "6px",
      }}
      {...props}
    />
  );
}
