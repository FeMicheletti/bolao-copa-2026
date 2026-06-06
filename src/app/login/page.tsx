import { AuthCard } from "@/components/auth-card";

type LoginPageProps = {
	searchParams: Promise<{
		redirect?: string;
	}>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
	const { redirect } = await searchParams;

	return <AuthCard mode="login" redirectTo={redirect || "/pools"} />;
}