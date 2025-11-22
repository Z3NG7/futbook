import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import "./dialog.css";

export function Dialog(props) {
  return <DialogPrimitive.Root {...props} />;
}

export function DialogTrigger(props) {
  return <DialogPrimitive.Trigger {...props} />;
}

export function DialogPortal(props) {
  return <DialogPrimitive.Portal {...props} />;
}

export function DialogClose(props) {
  return <DialogPrimitive.Close {...props} />;
}

export function DialogOverlay(props) {
  return (
    <DialogPrimitive.Overlay className="dialog-overlay" {...props} />
  );
}

export function DialogContent({ children, ...props }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content className="dialog-content" {...props}>
        {children}

        <DialogPrimitive.Close className="dialog-close-btn">
          <X />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export function DialogHeader({ ...props }) {
  return <div className="dialog-header" {...props} />;
}

export function DialogFooter({ ...props }) {
  return <div className="dialog-footer" {...props} />;
}

export function DialogTitle({ ...props }) {
  return <DialogPrimitive.Title className="dialog-title" {...props} />;
}

export function DialogDescription({ ...props }) {
  return (
    <DialogPrimitive.Description
      className="dialog-description"
      {...props}
    />
  );
}
