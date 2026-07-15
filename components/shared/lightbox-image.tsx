"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface LightboxImageProps {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export function LightboxImage({ src, width, height, alt }: LightboxImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-lg border"
        aria-label={`${alt} — büyütmek için tıklayın`}
      >
        <Image src={src} width={width} height={height} alt={alt} className="h-auto w-full" />
        <span className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-all group-hover:bg-foreground/10 group-hover:opacity-100">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-background/90 shadow">
            <ZoomIn className="h-4 w-4" aria-hidden="true" />
          </span>
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[min(90vw,1100px)] bg-transparent p-0 ring-0">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <Image
            src={src}
            width={width}
            height={height}
            alt={alt}
            className="max-h-[85vh] w-auto rounded-lg border bg-background object-contain"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
