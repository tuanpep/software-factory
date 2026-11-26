import { Suspense } from "react";

import { NewRunWizard } from "@/modules/factory/features/runs/ui/new-run-wizard";

export default function NewRunPage() {
  return (
    <Suspense fallback={null}>
      <NewRunWizard />
    </Suspense>
  );
}
