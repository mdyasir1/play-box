"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  hideClose?: boolean;
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  hideClose = false,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#03050b]/80 backdrop-blur-sm data-[state=open]:animate-[fade-in_150ms_ease-out]" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 max-h-[85dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-[#0c1120] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.65)] outline-none sm:p-6",
            "data-[state=open]:animate-[modal-in_180ms_cubic-bezier(0.2,0.8,0.2,1)]",
            className,
          )}
        >
          <div className="pr-10">
            <Dialog.Title className="font-display text-xl font-bold tracking-tight text-text">
              {title}
            </Dialog.Title>
            {description ? (
              <Dialog.Description className="mt-1.5 text-sm leading-6 text-text-secondary">
                {description}
              </Dialog.Description>
            ) : null}
          </div>
          {hideClose ? null : (
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className="absolute right-3 top-3 inline-flex size-10 items-center justify-center rounded-xl text-text-muted transition hover:bg-white/10 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </Dialog.Close>
          )}
          <div className="mt-5">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
