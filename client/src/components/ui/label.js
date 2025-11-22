import React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import "./label.css";

export function Label({ className = "", ...props }) {
  return (
    <LabelPrimitive.Root
      className={`label ${className}`}
      {...props}
    />
  );
}
