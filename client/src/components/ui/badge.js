import React from "react";
import "./badge.css";

export function Badge({
  className = "",
  variant = "default",
  asChild = false,
  children,
  ...props
}) {
  const Component = asChild ? React.Fragment : "span";

  const classes = `badge badge-${variant} ${className}`;

  // When using asChild, we don’t apply className to Fragment
  if (asChild) {
    return <Component {...props}>{children}</Component>;
  }

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}
