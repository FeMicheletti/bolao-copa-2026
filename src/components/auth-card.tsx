"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { apiFetch } from "@/lib/api";

type AuthCardProps = {
	mode: "login" | "register";
	redirectTo?: string;
};

export function AuthCard({ mode, redirectTo = "/pools"  }: AuthCardProps) {
	const router = useRouter();
	const isRegister = mode === "register";

	const redirectQuery = redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : "";

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			await apiFetch(isRegister ? "/api/auth/register" : "/api/auth/login", {
				method: "POST",
				body: JSON.stringify(
				isRegister ? { name, email, password } : { email, password }
				),
			});

			router.push(redirectTo);
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Não foi possível continuar");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-md place-items-center">
			<div className="neon-card w-full rounded-3xl p-6 sm:p-8">
				<div className="mb-8 text-center">
					<p className="neon-text text-xs font-bold uppercase tracking-[0.28em]">
						Bolão Copa
					</p>

					<h1 className="mt-3 text-3xl font-black">
						{isRegister ? "Criar conta" : "Entrar na conta"}
					</h1>

					<p className="mt-2 text-sm text-muted-foreground">
						{isRegister ? "Crie sua conta para montar ou entrar em um bolão." : "Entre para acessar seus bolões e palpites."}
					</p>
				</div>

				<form onSubmit={handleSubmit} className="grid gap-4">
					{isRegister && (
						<div className="grid gap-2">
							<label className="text-sm font-semibold">Nome</label>
							<input
								value={name}
								onChange={(event) => setName(event.target.value)}
								required
								minLength={2}
								placeholder="Seu nome"
								className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/70 focus:ring-2 focus:ring-primary/20"/>
						</div>
					)}

					<div className="grid gap-2">
						<label className="text-sm font-semibold">E-mail</label>
						<input
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							required
							type="email"
							placeholder="voce@email.com"
							className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/70 focus:ring-2 focus:ring-primary/20"/>
					</div>

					<div className="grid gap-2">
						<label className="text-sm font-semibold">Senha</label>
						<input
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							required
							minLength={6}
							type="password"
							placeholder="Mínimo 6 caracteres"
							className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/70 focus:ring-2 focus:ring-primary/20"/>
					</div>

					{error && (
						<div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
							{error}
						</div>
					)}

					<button disabled={isLoading} className="mt-2 rounded-2xl bg-primary px-5 py-3 font-bold text-primary-foreground shadow-[0_0_32px_rgba(176,38,255,0.35)] transition hover:scale-[1.01] hover:shadow-[0_0_44px_rgba(217,70,239,0.45)] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer">
						{isLoading ? "Carregando..." : isRegister ? "Criar conta" : "Entrar"}
					</button>
				</form>

				<div className="mt-6 text-center text-sm text-muted-foreground">
					{isRegister ? (
						<>
							Já tem conta?{" "}
							<Link href="/login" className="font-semibold text-primary">
								Entrar
							</Link>
						</> ) : (
						<>
							Ainda não tem conta?{" "}
							<Link href="/register" className="font-semibold text-primary">
								Criar conta
							</Link>
						</>
					)}
				</div>
			</div>
		</div>
	);
}