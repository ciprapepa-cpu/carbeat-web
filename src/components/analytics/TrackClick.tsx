"use client";

import { type ReactNode, useCallback } from "react";
import * as analytics from "@/lib/analytics";

type TrackEvent =
  | { event: "whatsapp"; context: string; carName?: string }
  | { event: "phone"; context: string; carName?: string }
  | { event: "navigate" }
  | { event: "gallery"; carName: string; photoIndex: number }
  | { event: "selectCar"; id: string; name: string; price: number; listName?: string };

interface TrackClickProps {
  track: TrackEvent;
  children: ReactNode;
  className?: string;
}

/**
 * Wraps children in a <span> that fires an analytics event on click.
 * Use around <a> or <Link> elements in Server Components.
 */
export default function TrackClick({ track, children, className }: TrackClickProps) {
  const handleClick = useCallback(() => {
    switch (track.event) {
      case "whatsapp":
        analytics.trackWhatsAppClick(track.context, track.carName);
        break;
      case "phone":
        analytics.trackPhoneClick(track.context, track.carName);
        break;
      case "navigate":
        analytics.trackNavigateClick();
        break;
      case "gallery":
        analytics.trackGalleryOpen(track.carName, track.photoIndex);
        break;
      case "selectCar":
        analytics.trackSelectCar(track);
        break;
    }
  }, [track]);

  return (
    <span onClick={handleClick} className={className}>
      {children}
    </span>
  );
}
