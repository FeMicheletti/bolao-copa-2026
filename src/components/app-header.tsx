import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "./logout-button";

export async function AppHeader() {
	const user = await getCurrentUser();

	return (
		<header className="sticky top-0 z-50 border-b border-white/10 bg-background/75 backdrop-blur-xl">
			<div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
				<Link href="/" className="flex min-w-0 items-center gap-2">
					{/* <span className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-base shadow-[0_0_24px_rgba(176,38,255,0.25)] sm:size-9 sm:text-lg">
						🏆
					</span> */}
					<span className="truncate text-lg font-black tracking-tight sm:text-xl">
						Bolão <span className="neon-text">Copa</span>
					</span>
				</Link>

				<nav className="flex shrink-0 items-center gap-1 text-xs sm:gap-2 sm:text-sm">
					{user ? (
						<>
							<span className="max-w-30 truncate rounded-full px-3 py-2 text-muted-foreground sm:max-w-45 sm:px-4">
								{user.name}
							</span>

							<Link href="/pools" className="rounded-full border border-primary/40 bg-primary/10 px-3 py-2 font-semibold text-primary transition hover:border-primary hover:bg-primary/20 hover:shadow-[0_0_24px_rgba(176,38,255,0.3)] sm:px-4">
								Bolões
							</Link>

							<LogoutButton />
						</> ) : (
						<>
							<Link href="/register" className="rounded-full px-3 py-2 text-muted-foreground transition hover:bg-white/5 hover:text-foreground sm:px-4">
								Criar conta
							</Link>

							<Link href="/login" className="rounded-full border border-primary/40 bg-primary/10 px-3 py-2 font-semibold text-primary transition hover:border-primary hover:bg-primary/20 hover:shadow-[0_0_24px_rgba(176,38,255,0.3)] sm:px-4">
								Entrar
							</Link>
						</>
					)}
				</nav>
			</div>
		</header>
	);
}