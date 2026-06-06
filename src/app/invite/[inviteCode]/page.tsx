import { InviteClient } from "@/components/invite-client";
import { getCurrentUser } from "@/lib/auth";

type InvitePageProps = {
	params: Promise<{
		inviteCode: string;
	}>;
};

export default async function InvitePage({ params }: InvitePageProps) {
	const { inviteCode } = await params;
	const user = await getCurrentUser();

	return (
		<InviteClient inviteCode={inviteCode} isAuthenticated={!!user}/>
	);
}