import React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import "./progress.css";

export function Progress({ className = "", value = 0, ...props }) {
  return (
    <ProgressPrimitive.Root
      className={`progress-root ${className}`}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="progress-indicator"
        style={{
          transform: `translateX(-${100 - value}%)`,
        }}
      />
    </ProgressPrimitive.Root>
  );
}
