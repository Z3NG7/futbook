import React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import "./alert-dialog.css";

export function AlertDialog(props) {
  return <AlertDialogPrimitive.Root {...props} />;
}

export function AlertDialogTrigger(props) {
  return <AlertDialogPrimitive.Trigger {...props} />;
}

export function AlertDialogPortal(props) {
  return <AlertDialogPrimitive.Portal {...props} />;
}

export function AlertDialogOverlay(props) {
  return (
    <AlertDialogPrimitive.Overlay
      className="alert-overlay"
      {...props}
    />
  );
}

export function AlertDialogContent({ children, ...props }) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        className="alert-content"
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  );
}

export function AlertDialogHeader({ children, ...props }) {
  return (
    <div className="alert-header" {...props}>
      {children}
    </div>
  );
}

export function AlertDialogFooter({ children, ...props }) {
  return (
    <div className="alert-footer" {...props}>
      {children}
    </div>
  );
}

export function AlertDialogTitle(props) {
  return (
    <AlertDialogPrimitive.Title
      className="alert-title"
      {...props}
    />
  );
}

export function AlertDialogDescription(props) {
  return (
    <AlertDialogPrimitive.Description
      className="alert-description"
      {...props}
    />
  );
}

export function AlertDialogAction(props) {
  return (
    <AlertDialogPrimitive.Action
      className="alert-btn alert-action"
      {...props}
    />
  );
}

export function AlertDialogCancel(props) {
  return (
    <AlertDialogPrimitive.Cancel
      className="alert-btn alert-cancel"
      {...props}
    />
  );
}
