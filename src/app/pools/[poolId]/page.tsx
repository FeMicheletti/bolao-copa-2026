import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { PoolDetailsClient } from "@/components/pool-details-client";

type PoolPageProps = {
	params: Promise<{
		poolId: string;
	}>;
};

export default async function PoolPage({ params }: PoolPageProps) {
	const user = await getCurrentUser();

	if (!user) redirect("/login");

	const { poolId } = await params;

	return <PoolDetailsClient poolId={poolId} userName={user.name} />;
}