"use client";

import { BuildProgress } from "@/components/progress/buildProgress";

export default function ProgressPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <BuildProgress />
    </div>
  );
}
