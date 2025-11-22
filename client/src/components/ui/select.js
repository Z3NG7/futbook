import React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import "./select.css";

// Root
export function Select(props) {
  return <SelectPrimitive.Root {...props} />;
}

// Group
export function SelectGroup(props) {
  return <SelectPrimitive.Group {...props} />;
}

// Value
export function SelectValue(props) {
  return <SelectPrimitive.Value {...props} />;
}

// Trigger
export function SelectTrigger({ className = "", children, ...props }) {
  return (
    <SelectPrimitive.Trigger
      className={`select-trigger ${className}`}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon>
        <ChevronDown size={16} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

// Content
export function SelectContent({ className = "", children, ...props }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={`select-content ${className}`}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className="select-viewport">
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

// Label
export function SelectLabel({ className = "", ...props }) {
  return (
    <SelectPrimitive.Label
      className={`select-label ${className}`}
      {...props}
    />
  );
}

// Item
export function SelectItem({ className = "", children, ...props }) {
  return (
    <SelectPrimitive.Item
      className={`select-item ${className}`}
      {...props}
    >
      <SelectPrimitive.ItemText>
        {children}
      </SelectPrimitive.ItemText>

      <SelectPrimitive.ItemIndicator>
        <Check size={16} className="select-check" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

// Separator
export function SelectSeparator() {
  return (
    <div
      style={{
        height: 1,
        background: "#ddd",
        margin: "4px 0"
      }}
    />
  );
}

// Scroll Up
export function SelectScrollUpButton({ className = "", ...props }) {
  return (
    <SelectPrimitive.ScrollUpButton
      className={`select-scroll-btn ${className}`}
      {...props}
    >
      <ChevronUp size={16} />
    </SelectPrimitive.ScrollUpButton>
  );
}

// Scroll Down
export function SelectScrollDownButton({ className = "", ...props }) {
  return (
    <SelectPrimitive.ScrollDownButton
      className={`select-scroll-btn ${className}`}
      {...props}
    >
      <ChevronDown size={16} />
    </SelectPrimitive.ScrollDownButton>
  );
}
