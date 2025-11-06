"use client";

import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  children: React.ReactNode;
  title: string | React.ReactNode;
  onClose: () => void;
  isOpen?: boolean;
};

export default function Modal({ title, onClose, children, isOpen = true }: ButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (!isOpen) {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }

    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 250);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!shouldRender) return null;

  return createPortal(
    <div
      className={`fixed inset-0 bg-[#1D2C3F]/50 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onMouseDown={handleBackdropClick}
    >
      <div
        className={cn(
          "bg-c1 flex flex-col w-[350px] md:w-[640px] max-h-[90vh] rounded-md transition-all duration-300 ease-out transform",
          isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4",
        )}
      >
        <div className="flex justify-between items-center px-5 py-3 rounded-t-md flex-shrink-0 bg-c1 border-b border-slate-200">
          <div className="flex items-center w-full gap-[10px]">
            {typeof title === "string" ? (
              <p className={"text-sm md:text-xl font-semibold text-c8"}>{title}</p>
            ) : (
              title
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="bg-transparent transition-transform duration-200 hover:scale-110 active:scale-95 flex-shrink-0 cursor-pointer"
          >
            <X className="size-4 md:size-6 text-c10" />
          </button>
        </div>

        <div className={cn("flex flex-col bg-c1 overflow-hidden flex-1 min-h-0 rounded-b-md")}>
          <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
