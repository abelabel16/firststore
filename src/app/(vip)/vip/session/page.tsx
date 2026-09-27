import { Suspense } from "react";
import { PageSkeleton } from "@/components/ui/skeleton";
import { SessionContent } from "./session-content";

export default function SessionPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <SessionContent />
    </Suspense>
  );
}
