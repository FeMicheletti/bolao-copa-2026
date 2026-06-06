"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { PoolInviteInfo } from "@/types/api";

type InviteResponse = {
	ok: boolean;
	pool: PoolInviteInfo;
};

type JoinInviteResponse = {
	ok: boolean;
	pool: {
		id: string;
		name: string;
	};
};

type InviteClientProps = {
	inviteCode: string;
	isAuthenticated: boolean;
};

export function InviteClient({ inviteCode, isAuthenticated }: InviteClientProps) {
	const router = useRouter();

	const [pool, setPool] = useState<PoolInviteInfo | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isJoining, setIsJoining] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		async function loadInvite() {
			try {
				const data = await apiFetch<InviteResponse>(`/api/pools/invite/${inviteCode}`);

				setPool(data.pool);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Convite inválido ou expirado");
			} finally {
				setIsLoading(false);
			}
		}
		loadInvite();
	}, [inviteCode]);

	async function handleJoinPool() {
		if (!isAuthenticated) return router.push(`/login?redirect=/invite/${inviteCode}`);

		setIsJoining(true);
		setError("");

		try {
			const data = await apiFetch<JoinInviteResponse>(
				`/api/pools/join/${inviteCode}`,
				{
				method: "POST",
				}
			);

			router.push(`/pools/${data.pool.id}`);
			router.refresh();
		} catch (err) {
			if (err instanceof Error && err.message.toLowerCase().includes("already")) {
				if (pool) {
				router.push(`/pools/${pool.id}`);
				router.refresh();
				return;
				}
			}

			setError(err instanceof Error ? err.message: "Não foi possível entrar no bolão");
		} finally {
			setIsJoining(false);
		}
	}

	if (isLoading) {
		return (
			<section className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-md place-items-center">
				<div className="glass-panel w-full rounded-3xl p-6 text-sm text-muted-foreground">
				Carregando convite...
				</div>
			</section>
		);
	}

	if (!pool) {
		return (
			<section className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-md place-items-center">
				<div className="neon-card w-full rounded-3xl p-6 text-center">
					<p className="text-4xl">😵</p>

					<h1 className="mt-4 text-2xl font-black">Convite inválido</h1>

					<p className="mt-2 text-sm text-muted-foreground">
						Esse código não existe ou o link foi alterado.
					</p>

					<Link href="/" className="mt-6 inline-block rounded-2xl bg-primary px-5 py-3 font-bold text-primary-foreground">
						Voltar para início
					</Link>
				</div>
			</section>
		);
	}

	return (
		<section className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-md place-items-center">
			<div className="neon-card w-full rounded-3xl p-6 sm:p-8">
				<div className="text-center">
					<p className="neon-text text-xs font-bold uppercase tracking-[0.28em]">
						Convite de bolão
					</p>

					<h1 className="mt-4 text-3xl font-black">{pool.name}</h1>

					<p className="mt-2 text-sm text-muted-foreground">
						Você foi convidado para participar deste bolão da Copa.
					</p>
				</div>

				<div className="mt-6 grid gap-3">
					<div className="glass-panel rounded-2xl p-4">
						<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
							Dono
						</p>
						<p className="mt-1 font-bold">{pool.owner.name}</p>
					</div>

					<div className="glass-panel rounded-2xl p-4">
						<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
							Participantes
						</p>
						<p className="mt-1 font-bold">
							{pool._count.members} membro
							{pool._count.members === 1 ? "" : "s"}
						</p>
					</div>

					<div className="glass-panel rounded-2xl p-4">
						<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
							Código
						</p>
						<p className="mt-1 font-black tracking-widest text-primary">
							{pool.inviteCode}
						</p>
					</div>
				</div>

				{error && (
					<div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
						{error}
					</div>
				)}

				<button
					type="button"
					onClick={handleJoinPool}
					disabled={isJoining}
					className="mt-6 w-full rounded-2xl bg-primary px-5 py-3 font-bold text-primary-foreground shadow-[0_0_32px_rgba(176,38,255,0.35)] transition hover:scale-[1.01] hover:shadow-[0_0_44px_rgba(217,70,239,0.45)] disabled:cursor-not-allowed disabled:opacity-60">
					{isJoining ? "Entrando..." : isAuthenticated ? "Entrar no bolão" : "Entrar ou criar conta"}
				</button>

				<Link href="/" className="mt-4 block text-center text-sm text-muted-foreground transition hover:text-primary">
					Voltar
				</Link>
			</div>
		</section>
	);
}