"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getFlagByCode } from "@/lib/countries";
import { MatchCard } from "@/components/match-card";
import { ScoringInfoButton } from "@/components/scoring-info-button";
import type { MatchPrediction, PoolDetails, PoolMatch, RankingItem } from "@/types/api";
import { getMatchStatus } from "@/lib/matchStatus";

type PoolResponse = {
	ok: boolean;
	pool: PoolDetails;
};

type MatchesResponse = {
	ok: boolean;
	matches: PoolMatch[];
};

type RankingResponse = {
	ok: boolean;
	ranking: RankingItem[];
};

type PredictionResponse = {
	ok: boolean;
	prediction: unknown;
};

type MatchPredictionsResponse = {
	ok: boolean;
	predictions: MatchPrediction[];
};

type PoolDetailsClientProps = {
	poolId: string;
	userName: string;
};

type ActiveTab = "matches" | "ranking";

export function PoolDetailsClient({ poolId, userName }: PoolDetailsClientProps) {
	const [activeTab, setActiveTab] = useState<ActiveTab>("matches");

	const [pool, setPool] = useState<PoolDetails | null>(null);
	const [matches, setMatches] = useState<PoolMatch[]>([]);
	const [ranking, setRanking] = useState<RankingItem[]>([]);

	const [selectedMatch, setSelectedMatch] = useState<PoolMatch | null>(null);
	const [homePrediction, setHomePrediction] = useState("");
	const [awayPrediction, setAwayPrediction] = useState("");

	const [isLoading, setIsLoading] = useState(true);
	const [isSavingPrediction, setIsSavingPrediction] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const [matchPredictions, setMatchPredictions] = useState<MatchPrediction[]>([]);
	const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);

	async function loadPoolData() {
		setError("");

		try {
			const [poolData, matchesData, rankingData] = await Promise.all([
				apiFetch<PoolResponse>(`/api/pools/${poolId}`),
				apiFetch<MatchesResponse>(`/api/pools/${poolId}/matches`),
				apiFetch<RankingResponse>(`/api/pools/${poolId}/ranking`),
			]);

			setPool(poolData.pool);
			setMatches(matchesData.matches);
			setRanking(rankingData.ranking);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao carregar bolão");
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		loadPoolData();
	}, [poolId]);

	const nextMatches = useMemo(() => {
		return matches.filter((match) => match.canPredict);
	}, [matches]);

	async function openMatch(match: PoolMatch) {
		setSelectedMatch(match);
		setHomePrediction(match.prediction?.home?.toString() ?? "");
		setAwayPrediction(match.prediction?.away?.toString() ?? "");
		setMatchPredictions([]);
		setError("");
		setSuccess("");

		if (match.canSeePredictions) {
			setIsLoadingPredictions(true);

			try {
				const data = await apiFetch<MatchPredictionsResponse>(`/api/pools/${poolId}/matches/${match.id}/predictions`);

				setMatchPredictions(data.predictions);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Não foi possível carregar os palpites do jogo");
			} finally {
				setIsLoadingPredictions(false);
			}
		}
	}

	function closePrediction() {
		setSelectedMatch(null);
		setHomePrediction("");
		setAwayPrediction("");
		setMatchPredictions([]);
	}

	async function handleSavePrediction(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!selectedMatch) return;

		setIsSavingPrediction(true);
		setError("");
		setSuccess("");

		try {
			await apiFetch<PredictionResponse>(
				`/api/pools/${poolId}/matches/${selectedMatch.id}/predictions`,
				{
				method: "POST",
				body: JSON.stringify({
					predictedHomeScore: Number(homePrediction),
					predictedAwayScore: Number(awayPrediction),
				}),
				}
			);

			setSuccess("Palpite salvo com sucesso!");
			closePrediction();
			await loadPoolData();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao salvar palpite");
		} finally {
			setIsSavingPrediction(false);
		}
	}

	async function copyInviteCode() {
		if (!pool) return;

		await navigator.clipboard.writeText(pool.inviteCode);
		setSuccess(`Código ${pool.inviteCode} copiado!`);
	}

	async function copyInviteLink() {
		if (!pool) return;

		const url = `${window.location.origin}/invite/${pool.inviteCode}`;
		await navigator.clipboard.writeText(url);
		setSuccess("Link de convite copiado!");
	}

	if (isLoading) {
		return (
			<div className="glass-panel rounded-3xl p-6 text-sm text-muted-foreground">
				Carregando bolão...
			</div>
		);
	}

	if (!pool) {
		return (
			<div className="glass-panel rounded-3xl p-6">
				<p className="font-bold">Bolão não encontrado.</p>
				<Link href="/pools" className="mt-4 inline-block text-primary">
					Voltar para meus bolões
				</Link>
			</div>
		);
	}

	return (
		<section className="grid min-w-0 max-w-full gap-6 overflow-x-hidden">
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
				<div className="min-w-0">
					<Link href="/pools" className="text-sm text-muted-foreground transition hover:text-primary">
						← Meus bolões
					</Link>

					<p className="neon-text mt-5 text-xs font-bold uppercase tracking-[0.28em]">
						Bolão
					</p>

					<h1 className="mt-2 truncate text-3xl font-black sm:text-4xl">
						{pool.name}
					</h1>

					<p className="mt-2 text-sm text-muted-foreground">
						Olá, {userName}. Seu grupo tem {pool.members.length} participante
						{pool.members.length === 1 ? "" : "s"}.
					</p>
				</div>

				<div className="grid min-w-0 max-w-full gap-2 sm:flex sm:flex-wrap sm:justify-end">
					<button
						type="button"
						onClick={copyInviteCode}
						className="min-w-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold transition hover:border-primary/50 hover:text-primary cursor-pointer"
					>
						<span className="block max-w-full truncate">
							Código: {pool.inviteCode}
						</span>
					</button>

					<button
						type="button"
						onClick={copyInviteLink}
						className="min-w-0 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/20 cursor-pointer"
					>
						Copiar link
					</button>
				</div>
			</div>

			{(error || success) && (
				<div className={`rounded-2xl border px-4 py-3 text-sm ${ error ? "border-red-500/30 bg-red-500/10 text-red-200" : "border-primary/30 bg-primary/10 text-primary"}`}>
					{error || success}
				</div>
			)}

			<div className="grid gap-4 sm:grid-cols-3">
				<div className="glass-panel rounded-2xl p-5">
					<p className="neon-text text-3xl font-black">{matches.length}</p>
					<p className="mt-1 text-sm text-muted-foreground">Jogos no bolão</p>
				</div>

				<div className="glass-panel rounded-2xl p-5">
					<p className="neon-text text-3xl font-black">{nextMatches.length}</p>
					<p className="mt-1 text-sm text-muted-foreground">
						Abertos para palpite
					</p>
				</div>

				<div className="glass-panel rounded-2xl p-5">
					<p className="neon-text text-3xl font-black">{ranking[0]?.totalPoints ?? 0}</p>
					<p className="mt-1 text-sm text-muted-foreground">
						Pontos do líder
					</p>
				</div>
			</div>

			<div className="sticky top-16.25 z-30 -mx-4 border-y border-white/10 bg-background/80 px-4 py-3 backdrop-blur-xl sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
				<div className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.25rem] gap-2 rounded-2xl bg-white/5 p-1">
					<button
						type="button"
						onClick={() => setActiveTab("matches")}
						className={`min-w-0 rounded-xl px-4 py-2 text-sm font-bold transition cursor-pointer ${
						activeTab === "matches"
							? "bg-primary text-primary-foreground shadow-[0_0_24px_rgba(176,38,255,0.25)]"
							: "text-muted-foreground hover:text-foreground"
						}`}
					>
						Jogos
					</button>

					<button
						type="button"
						onClick={() => setActiveTab("ranking")}
						className={`min-w-0 rounded-xl px-4 py-2 text-sm font-bold transition cursor-pointer ${
						activeTab === "ranking"
							? "bg-primary text-primary-foreground shadow-[0_0_24px_rgba(176,38,255,0.25)]"
							: "text-muted-foreground hover:text-foreground"
						}`}
					>
						Ranking
					</button>

					<div className="flex items-center justify-center pr-1">
						<ScoringInfoButton />
					</div>
				</div>
			</div>

			{activeTab === "matches" ? (
				<div className="grid min-w-0 max-w-full gap-4 lg:grid-cols-2">
					{matches.length === 0 ? (
						<div className="glass-panel rounded-3xl p-8 text-center lg:col-span-2">
							<p className="font-bold">Nenhum jogo sincronizado ainda.</p>
							<p className="mt-2 text-sm text-muted-foreground">
								Rode o cron de sincronização para carregar os jogos.
							</p>
						</div>) : 
					(matches.map((match) => (
						<button key={match.id} type="button" onClick={() => openMatch(match)} className="min-w-0 max-w-full text-left cursor-pointer">
							<MatchCard
								stage="Copa 2026"
								status={match.status}
								homeTeam={match.homeTeam}
								awayTeam={match.awayTeam}
								homeFlag={getFlagByCode(match.homeTeamCode)}
								awayFlag={getFlagByCode(match.awayTeamCode)}
								homeScore={match.result.home}
								awayScore={match.result.away}
								prediction={match.prediction}
								points={match.points}
								pointsReason={match.pointsReason}
								canPredict={match.canPredict} />
						</button>))
					)}
				</div>) : 
				(<div className="grid gap-3">
					{ranking.length === 0 ? (
						<div className="glass-panel rounded-3xl p-8 text-center">
							<p className="font-bold">Ranking vazio</p>
							<p className="mt-2 text-sm text-muted-foreground">
								O ranking aparece quando os participantes entrarem e pontuarem.
							</p>
							</div>
					) : (
					ranking.map((item, index) => (
						<article key={item.id} className="neon-card flex items-center justify-between gap-4 rounded-3xl p-4">
							<div className="flex min-w-0 items-center gap-3">
								<div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 font-black text-primary">
									{index + 1}
								</div>
								<div className="min-w-0">
									<h3 className="truncate font-black">{item.user.name}</h3>
									<p className="text-xs text-muted-foreground">
										{item.exactScores} placar exato • {item.correctResults} resultados
									</p>
								</div>
							</div>
							<div className="text-right">
								<p className="neon-text text-2xl font-black">
									{item.totalPoints}
								</p>
								<p className="text-xs text-muted-foreground">pts</p>
							</div>
						</article>
					))
				)}
				</div>
			)}

			{selectedMatch && (
				<div className="fixed inset-0 z-100 grid place-items-end overflow-hidden bg-black/70 p-0 backdrop-blur-sm sm:place-items-center sm:p-4">
					<div className="max-h-[92vh] w-full max-w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-background p-5 shadow-2xl sm:max-w-md sm:rounded-3xl">
						<div className="flex items-start justify-between gap-4">
							<div>
								<p className="neon-text text-xs font-bold uppercase tracking-[0.24em]">
									{selectedMatch.canPredict ? "Palpite" : "Detalhes do jogo"}
								</p>

								<h2 className="mt-2 text-xl font-black">
									{selectedMatch.homeTeam} x {selectedMatch.awayTeam}
								</h2>

								<p className="mt-1 text-sm text-muted-foreground">
									Status: {getMatchStatus(selectedMatch.status)}
								</p>
							</div>

							<button type="button" onClick={closePrediction} className="rounded-full border border-white/10 px-3 py-1 text-sm text-muted-foreground cursor-pointer">
								Fechar
							</button>
						</div>

						<div className="mt-5 rounded-2xl bg-black/25 p-4">
							<div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
								<div>
									<p className="truncate text-sm font-semibold">
										{selectedMatch.homeTeam}
									</p>
									<p className="mt-1 text-3xl font-black">
										{selectedMatch.result.home ?? "-"}
									</p>
								</div>

								<span className="neon-text text-2xl font-black">x</span>

								<div>
									<p className="truncate text-sm font-semibold">
										{selectedMatch.awayTeam}
									</p>
									<p className="mt-1 text-3xl font-black">
										{selectedMatch.result.away ?? "-"}
									</p>
								</div>
							</div>
						</div>

						{selectedMatch.canPredict ? (
							<form onSubmit={handleSavePrediction} className="mt-6 grid gap-5">
								<div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
									<div className="grid gap-2">
										<label className="truncate text-sm font-semibold">
											{selectedMatch.homeTeam} {getFlagByCode(selectedMatch.homeTeamCode)}
										</label>

										<input
											value={homePrediction}
											onChange={(event) => setHomePrediction(event.target.value)}
											required
											min={0}
											max={99}
											type="number"
											className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-center text-2xl font-black outline-none transition focus:border-primary/70 focus:ring-2 focus:ring-primary/20"/>
									</div>

									<span className="neon-text mt-7 text-2xl font-black">x</span>

									<div className="grid gap-2">
										<label className="truncate text-right text-sm font-semibold">
											{getFlagByCode(selectedMatch.awayTeamCode)} {selectedMatch.awayTeam}
										</label>

										<input
											value={awayPrediction}
											onChange={(event) => setAwayPrediction(event.target.value)}
											required
											min={0}
											max={99}
											type="number"
											className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-center text-2xl font-black outline-none transition focus:border-primary/70 focus:ring-2 focus:ring-primary/20"/>
									</div>
								</div>

								<button
									disabled={isSavingPrediction}
									className="rounded-2xl bg-primary px-5 py-3 font-bold text-primary-foreground shadow-[0_0_32px_rgba(176,38,255,0.35)] transition hover:scale-[1.01] hover:shadow-[0_0_44px_rgba(217,70,239,0.45)] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
								>
									{isSavingPrediction ? "Salvando..." : "Salvar palpite"}
								</button>
							</form>
						) : (
							<div className="mt-6 grid gap-4">
								<div className="flex items-center justify-between gap-3">
									<h3 className="font-black">Palpites do grupo</h3>
								</div>

								{!selectedMatch.canSeePredictions ? (
									<div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground">
										Os palpites ficam ocultos até o jogo começar.
									</div>
								) : isLoadingPredictions ? (
									<div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground">
										Carregando palpites...
									</div>
								) : matchPredictions.length === 0 ? (
									<div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground">
										Ninguém palpitou nesse jogo.
									</div>
								) : (
									<div className="grid gap-3">
										{matchPredictions.map((prediction) => (
											<div key={prediction.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
												<div className="flex items-start justify-between gap-3">
													<div className="min-w-0">
														<p className="truncate font-bold">
															{prediction.user.name}
														</p>

														<p className="mt-1 text-sm text-muted-foreground">
															Palpite:{" "}
															<span className="font-semibold text-foreground">
																{prediction.predictedHomeScore} x{" "}
																{prediction.predictedAwayScore}
															</span>
														</p>

														{prediction.pointsReason && (
															<p className="mt-1 text-xs text-muted-foreground">
																{prediction.pointsReason}
															</p>
														)}
													</div>

													<div className="text-right">
														<p className="neon-text text-2xl font-black">
															+{prediction.points}
														</p>
														<p className="text-xs text-muted-foreground">pts</p>
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						)}
					</div>
				</div>
				)}
		</section>
	);
}