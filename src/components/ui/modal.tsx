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
};

export function Modal({ open, onOpenChange, title, description, children, className }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-text/20 backdrop-blur-[2px]" />
        <Dialog.Content className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 outline-none">
          <div
            className={cn(
              "animate-modal pointer-events-auto max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-lg border border-border bg-bg-elevated shadow-2xl",
              className,
            )}
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-border bg-bg-elevated px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <Dialog.Title className="font-display text-xl font-semibold tracking-tight">
                  {title}
                </Dialog.Title>
                {description ? (
                  <Dialog.Description className="mt-1 text-sm text-text-secondary">
                    {description}
                  </Dialog.Description>
                ) : null}
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close"
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-text-muted transition hover:bg-surface-hover hover:text-text"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>
            <div className="px-5 py-5 sm:px-6">{children}</div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
