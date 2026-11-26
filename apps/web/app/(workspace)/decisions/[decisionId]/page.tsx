import { DecisionDetail } from "@/modules/factory/features/decisions/ui/decision-detail";

type PageProps = {
  params: Promise<{ decisionId: string }>;
};

export default async function DecisionPage({ params }: PageProps) {
  const { decisionId } = await params;
  return <DecisionDetail decisionId={decisionId} />;
}
