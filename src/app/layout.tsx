import type { Metadata } from "next";
import "./globals.css";
import { AppHeader } from "@/components/app-header";

export const metadata: Metadata = {
	title: "Bolão Copa",
	description: "Bolão simples para a Copa",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
	return (
		<html lang="pt-BR">
			<body>
				<AppHeader />
				<main className="mx-auto min-w-0 max-w-6xl overflow-x-hidden px-4 py-8">
					{children}
				</main>
			</body>
		</html>
	);
}