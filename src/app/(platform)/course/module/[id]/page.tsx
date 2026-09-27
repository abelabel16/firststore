import { modules } from "@/content/course";
import { ModuleContent } from "./module-content";

/** Pre-render every module page at build time (static export). */
export function generateStaticParams() {
  return modules.map((m) => ({ id: m.id }));
}

export default async function ModulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ModuleContent id={id} />;
}
