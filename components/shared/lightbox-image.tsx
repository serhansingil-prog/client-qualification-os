"use client";

import { useState } from "react";
import Image from "next/image";
import { XIcon, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";

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
        className="group relative flex h-40 w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-lg border bg-muted/30"
        aria-label={`${alt} — tam ekran görüntülemek için tıklayın`}
      >
        <Image src={src} width={width} height={height} alt={alt} className="h-full w-full object-contain" />
        <span className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-all group-hover:bg-foreground/10 group-hover:opacity-100">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-background/90 shadow">
            <ZoomIn className="h-4 w-4" aria-hidden="true" />
          </span>
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="top-0 left-0 h-screen max-h-screen w-screen max-w-none translate-x-0 translate-y-0 rounded-none border-0 bg-background/98 p-0 ring-0 sm:max-w-none"
        >
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <div className="flex h-full w-full items-center justify-center p-6 sm:p-12">
            <Image
              src={src}
              width={width}
              height={height}
              alt={alt}
              className="h-auto max-h-full w-auto max-w-full rounded-lg border object-contain shadow-2xl"
            />
          </div>
          <DialogClose
            render={
              <Button variant="outline" size="icon" className="absolute top-4 right-4 rounded-full" />
            }
          >
            <XIcon className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Kapat</span>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}
