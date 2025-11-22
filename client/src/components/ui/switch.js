import React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import "./switch.css"; // <-- custom CSS file

export function Switch({ className = "", ...props }) {
  return (
    <SwitchPrimitive.Root
      className={`switch-root ${className}`}
      {...props}
    >
      <SwitchPrimitive.Thumb className="switch-thumb" />
    </SwitchPrimitive.Root>
  );
}
