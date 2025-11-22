import React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import "./separator.css";

export function Separator({
  className = "",
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  const orientationClass =
    orientation === "horizontal"
      ? "separator-horizontal"
      : "separator-vertical";

  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={`separator ${orientationClass} ${className}`}
      {...props}
    />
  );
}
