import React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import "./avatar.css";

export function Avatar({ className = "", ...props }) {
  return (
    <AvatarPrimitive.Root
      className={`avatar-root ${className}`}
      {...props}
    />
  );
}

export function AvatarImage({ className = "", ...props }) {
  return (
    <AvatarPrimitive.Image
      className={`avatar-image ${className}`}
      {...props}
    />
  );
}

export function AvatarFallback({ className = "", ...props }) {
  return (
    <AvatarPrimitive.Fallback
      className={`avatar-fallback ${className}`}
      {...props}
    />
  );
}
