"use client";
import { useEffect } from "react";
import type { ReactNode, MouseEvent } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const modalRoot = typeof document !== "undefined"
  ? document.getElementById("modal-root") ?? (() => {
      const el = document.createElement("div");
      el.id = "modal-root";
      document.body.appendChild(el);
      return el;
    })()
  : null;

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !modalRoot) return null;

  const onBackdrop = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={onBackdrop}>
      <div className={css.modal}>{children}</div>
    </div>,
    modalRoot
  );
}
