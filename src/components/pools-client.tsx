"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { PoolListItem } from "@/types/api";

type PoolsResponse = {
	ok: boolean;
	pools: PoolListItem[];
};

type CreatePoolResponse = {
	ok: boolean;
	pool: PoolListItem;
};

type JoinPoolResponse = {
	ok: boolean;
	pool: PoolListItem;
};

type PoolsClientProps = {
	userName: string;
};

export function PoolsClient({ userName }: PoolsClientProps) {
	const [pools, setPools] = useState<PoolListItem[]>([]);
	const [poolName, setPoolName] = useState("");
	const [inviteCode, setInviteCode] = useState("");

	const [isLoading, setIsLoading] = useState(true);
	const [isCreating, setIsCreating] = useState(false);
	const [isJoining, setIsJoining] = useState(false);

	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	async function loadPools() {
		setError("");

		try {
			const data = await apiFetch<PoolsResponse>("/api/pools");
			setPools(data.pools);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao carregar bolões");
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		loadPools();
	}, []);

	async function handleCreatePool(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!poolName.trim()) return;

		setIsCreating(true);
		setError("");
		setSuccess("");

		try {
			await apiFetch<CreatePoolResponse>("/api/pools", {
				method: "POST",
				body: JSON.stringify({
				name: poolName.trim(),
				}),
			});

			setPoolName("");
			setSuccess("Bolão criado com sucesso!");
			await loadPools();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao criar bolão");
		} finally {
			setIsCreating(false);
		}
	}

	async function handleJoinPool(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!inviteCode.trim()) return;

		setIsJoining(true);
		setError("");
		setSuccess("");

		try {
			await apiFetch<JoinPoolResponse>("/api/pools/join", {
				method: "POST",
				body: JSON.stringify({
				inviteCode: inviteCode.trim().toUpperCase(),
				}),
			});

			setInviteCode("");
			setSuccess("Você entrou no bolão!");
			await loadPools();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao entrar no bolão");
		} finally {
			setIsJoining(false);
		}
	}

	async function copyInviteCode(code: string) {
		await navigator.clipboard.writeText(code);
		setSuccess(`Código ${code} copiado!`);
	}

  return (
    <section className="grid gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="neon-text text-xs font-bold uppercase tracking-[0.28em]">
            Meus bolões
          </p>

          <h1 className="mt-3 text-3xl font-black sm:text-4xl">
            Olá, {userName}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Crie um bolão, convide seus amigos ou entre usando um código.
          </p>
        </div>
      </div>

      {(error || success) && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            error
              ? "border-red-500/30 bg-red-500/10 text-red-200"
              : "border-primary/30 bg-primary/10 text-primary"
          }`}
        >
          {error || success}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <form onSubmit={handleCreatePool} className="glass-panel rounded-3xl p-5">
          <h2 className="text-xl font-black">Criar bolão</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Dê um nome para o grupo e compartilhe o código com seus amigos.
          </p>

          <div className="mt-5 grid gap-3">
            <input
              value={poolName}
              onChange={(event) => setPoolName(event.target.value)}
              placeholder="Ex: Bolão dos cria"
              className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/70 focus:ring-2 focus:ring-primary/20"
            />

            <button
              disabled={isCreating}
              className="rounded-2xl bg-primary px-5 py-3 font-bold text-primary-foreground shadow-[0_0_32px_rgba(176,38,255,0.25)] transition hover:scale-[1.01] hover:shadow-[0_0_44px_rgba(217,70,239,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreating ? "Criando..." : "Criar bolão"}
            </button>
          </div>
        </form>

        <form onSubmit={handleJoinPool} className="glass-panel rounded-3xl p-5">
          <h2 className="text-xl font-black">Entrar por código</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Recebeu um código de convite? Digite aqui para entrar no bolão.
          </p>

          <div className="mt-5 grid gap-3">
            <input
              value={inviteCode}
              onChange={(event) => setInviteCode(event.target.value)}
              placeholder="Ex: ABC12345"
              className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm uppercase outline-none transition placeholder:normal-case placeholder:text-muted-foreground focus:border-primary/70 focus:ring-2 focus:ring-primary/20"
            />

            <button
              disabled={isJoining}
              className="rounded-2xl border border-primary/40 bg-primary/10 px-5 py-3 font-bold text-primary transition hover:border-primary hover:bg-primary/20 hover:shadow-[0_0_32px_rgba(176,38,255,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isJoining ? "Entrando..." : "Entrar no bolão"}
            </button>
          </div>
        </form>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black">Seus grupos</h2>

          <span className="text-sm text-muted-foreground">
            {pools.length} bolão{pools.length === 1 ? "" : "ões"}
          </span>
        </div>

        {isLoading ? (
          <div className="glass-panel rounded-3xl p-6 text-sm text-muted-foreground">
            Carregando seus bolões...
          </div>
        ) : pools.length === 0 ? (
          <div className="glass-panel rounded-3xl p-8 text-center">
            <p className="text-lg font-bold">Nenhum bolão ainda</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Crie seu primeiro bolão ou entre usando um código.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pools.map((pool) => (
              <article key={pool.id} className="neon-card rounded-3xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-black">{pool.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Dono: {pool.owner.name}
                    </p>
                  </div>

                  <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    {pool._count.members}
                  </span>
                </div>

                <div className="mt-5 rounded-2xl bg-black/25 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Código
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <code className="text-lg font-black tracking-widest text-primary">
                      {pool.inviteCode}
                    </code>

                    <button
                      type="button"
                      onClick={() => copyInviteCode(pool.inviteCode)}
                      className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/50 hover:text-primary"
                    >
                      Copiar
                    </button>
                  </div>
                </div>

                <Link
                  href={`/pools/${pool.id}`}
                  className="mt-5 block rounded-2xl bg-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground transition hover:shadow-[0_0_32px_rgba(217,70,239,0.35)]"
                >
                  Abrir bolão
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}