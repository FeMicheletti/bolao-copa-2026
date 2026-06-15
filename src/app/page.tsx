import Link from "next/link";
import { MatchCard } from "@/components/match-card";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCountryFlagUrl } from "@/lib/countries";

export default async function HomePage() {
	const user = await getCurrentUser();

	if (user) redirect("/pools");

	return (
		<section className="grid gap-8 sm:gap-12">
			<div className="grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
				<div>
					<p className="neon-text text-xs font-bold uppercase tracking-[0.24em] sm:text-sm sm:tracking-[0.28em]">
						Copa 2026
					</p>

					<h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
						Seu bolão da Copa com ranking automático.
					</h1>

					<p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
						Crie um grupo, convide seus amigos, registre palpites e acompanhe a pontuação assim que os resultados forem atualizados.
					</p>

					<div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
						<Link href="/register" className="rounded-full bg-primary px-6 py-3 text-center font-bold text-primary-foreground shadow-[0_0_32px_rgba(176,38,255,0.35)] transition hover:scale-[1.02] hover:shadow-[0_0_44px_rgba(217,70,239,0.45)]">
							Começar agora
						</Link>

						<Link href="/login" className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-center font-semibold text-foreground transition hover:border-primary/60 hover:bg-primary/10">
							Já tenho conta
						</Link>
					</div>
				</div>

				<div className="grid gap-4">
					<MatchCard
						stage="Oitavas"
						status="FINISHED"
						homeTeam="Brasil"
						awayTeam="Japão"
						homeFlag={getCountryFlagUrl("BRA")}
						awayFlag={getCountryFlagUrl("JPN")}
						homeScore={2}
						awayScore={1}
						prediction={{ home: 2, away: 0 }}
						points={18}
						pointsReason="vencedor e gols do vencedor"
					/>

					<MatchCard
						stage="Grupo A"
						status="SCHEDULED"
						homeTeam="Argentina"
						awayTeam="França"
						homeFlag={getCountryFlagUrl("ARG")}
						awayFlag={getCountryFlagUrl("FRA")}
						prediction={{ home: 1, away: 1 }}
						canPredict
					/>
				</div>
			</div>

			<div className="grid gap-4 sm:grid-cols-3">
				<div className="glass-panel rounded-2xl p-5">
					<p className="neon-text text-3xl font-black">
						25
					</p>
					<h2 className="mt-2 font-bold">
						Placar exato
					</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						Acerte o resultado perfeito e dispare no ranking.
					</p>
				</div>

				<div className="glass-panel rounded-2xl p-5">
					<p className="neon-text text-3xl font-black">
						Auto
					</p>
					<h2 className="mt-2 font-bold">
						Resultados sincronizados
					</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						O cron atualiza jogos, resultados e pontuação automaticamente.
					</p>
				</div>

				<div className="glass-panel rounded-2xl p-5">
					<p className="neon-text text-3xl font-black">
						Link
					</p>
					<h2 className="mt-2 font-bold">
						Convite rápido
					</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						Crie um bolão e mande o código ou link para seus amigos.
					</p>
				</div>
			</div>
		</section>
	);
}