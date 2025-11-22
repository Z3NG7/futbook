import React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import "./scroll-area.css";

export function ScrollArea({ className = "", children, ...props }) {
  return (
    <ScrollAreaPrimitive.Root
      className={`scroll-area-root ${className}`}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        className="scroll-area-viewport"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>

      <ScrollBar />

      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

export function ScrollBar({
  className = "",
  orientation = "vertical",
  ...props
}) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      orientation={orientation}
      className={`scroll-area-scrollbar ${className}`}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb className="scroll-area-thumb" />
    </ScrollAreaPrimitive.Scrollbar>
  );
}
