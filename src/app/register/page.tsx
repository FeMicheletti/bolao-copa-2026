import { AuthCard } from "@/components/auth-card";

type RegisterPageProps = {
	searchParams: Promise<{
		redirect?: string;
	}>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
	const { redirect } = await searchParams;

	return <AuthCard mode="register" redirectTo={redirect || "/pools"} />;
}