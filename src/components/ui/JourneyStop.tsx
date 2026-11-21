"use client";

import { useEffect, useRef } from "react";
import { STOPS, placeMarker } from "@/lib/journey";

type Props = {
  id: keyof typeof STOPS;
  /** Inside a pinned scene: the pin progress (0–1) at which the date lands here… */
  frac?: number;
  /** …and until which it stays (defaults to `frac`). */
  fracEnd?: number;
};

/**
 * Invisible marker on a resting place for the travelling date.
 * Place it inside the photograph's (relative, cover-fitted) frame; it keeps
 * itself sized and centred on the spot defined in `STOPS`.
 */
export function JourneyStop({ id, frac, fracEnd }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marker = ref.current!;
    const frame = marker.parentElement!;
    const ro = new ResizeObserver(() =>
      placeMarker(marker, { w: frame.clientWidth, h: frame.clientHeight }, STOPS[id]),
    );
    ro.observe(frame);
    return () => ro.disconnect();
  }, [id]);

  return (
    <div
      ref={ref}
      aria-hidden
      data-journey-stop={id}
      data-journey-frac={frac}
      data-journey-frac-end={fracEnd}
      className="pointer-events-none absolute"
    />
  );
}
