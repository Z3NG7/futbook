import React from "react";
import { Slot } from "@radix-ui/react-slot";
import "./button.css";

export function Button({
  variant = "default",
  size = "default",
  asChild = false,
  className = "",
  ...props
}) {
  const Comp = asChild ? Slot : "button";

  const variantClass =
    {
      default: "ui-button-default",
      destructive: "ui-button-destructive",
      outline: "ui-button-outline",
      secondary: "ui-button-secondary",
      ghost: "ui-button-ghost",
      link: "ui-button-link",
    }[variant] || "ui-button-default";

  const sizeClass =
    {
      default: "ui-button-default-size",
      sm: "ui-button-sm",
      lg: "ui-button-lg",
      icon: "ui-button-icon",
    }[size] || "ui-button-default-size";

  return (
    <Comp
      className={`ui-button ${variantClass} ${sizeClass} ${className}`}
      {...props}
    />
  );
}
