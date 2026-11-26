import { FollowDetail } from "@/modules/factory/features/follow/ui/follow-detail";

type PageProps = {
  params: Promise<{ draftId: string }>;
};

export default async function FollowDraftPage({ params }: PageProps) {
  const { draftId } = await params;
  return <FollowDetail draftId={draftId} />;
}
