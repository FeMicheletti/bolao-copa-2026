import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { PoolsClient } from "@/components/pools-client";

export default async function PoolsPage() {
	const user = await getCurrentUser();

	if (!user) redirect("/login");

	return <PoolsClient userName={user.name} />;
}