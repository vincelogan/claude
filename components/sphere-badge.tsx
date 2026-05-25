"use client";
import { cn } from "@/lib/utils";
import { SPHERE_META } from "@/lib/spheres";
import type { SphereSlug } from "@/lib/types";

export function SphereBadge({
  slug,
  segmentName,
  className,
}: {
  slug: SphereSlug;
  segmentName?: string | null;
  className?: string;
}) {
  const meta = SPHERE_META[slug];
  return (
    <span
      className={cn("badge", className)}
      style={{ backgroundColor: `${meta.color}1a`, color: meta.color }}
      title={meta.name}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: meta.color }} />
      {meta.name}{segmentName ? ` · ${segmentName}` : ""}
    </span>
  );
}
