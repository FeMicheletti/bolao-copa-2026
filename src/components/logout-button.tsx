"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { LogOut } from "lucide-react";

export function LogoutButton() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	async function handleLogout() {
		setIsLoading(true);

		try {
			await apiFetch("/api/auth/logout", {
				method: "POST",
			});

			router.push("/");
			router.refresh();
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<button
			type="button"
			onClick={handleLogout}
			disabled={isLoading}
			className="rounded-full px-3 py-2 text-muted-foreground transition hover:bg-white/5 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 cursor-pointer">
			<LogOut className="h-4 w-4" />
		</button>
	);
}