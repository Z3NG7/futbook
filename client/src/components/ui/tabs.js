import React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import "./tabs.css"; // <-- custom CSS file

export function Tabs({ className = "", ...props }) {
  return (
    <TabsPrimitive.Root
      className={`tabs-root ${className}`}
      {...props}
    />
  );
}

export function TabsList({ className = "", ...props }) {
  return (
    <TabsPrimitive.List
      className={`tabs-list ${className}`}
      {...props}
    />
  );
}

export function TabsTrigger({ className = "", ...props }) {
  return (
    <TabsPrimitive.Trigger
      className={`tabs-trigger ${className}`}
      {...props}
    />
  );
}

export function TabsContent({ className = "", ...props }) {
  return (
    <TabsPrimitive.Content
      className={`tabs-content ${className}`}
      {...props}
    />
  );
}
