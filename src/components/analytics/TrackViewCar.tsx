"use client";

import { useEffect } from "react";
import { trackViewCar } from "@/lib/analytics";

interface TrackViewCarProps {
  car: {
    id: string;
    name: string;
    price: number;
    fuel?: string;
    transmission?: string;
    year?: number;
  };
}

/** Fires GA4 view_item + Meta ViewContent on mount */
export default function TrackViewCar({ car }: TrackViewCarProps) {
  useEffect(() => {
    trackViewCar(car);
  }, [car]);

  return null;
}
