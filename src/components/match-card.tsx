import { getMatchStatus } from "@/lib/matchStatus";

type MatchCardProps = {
	stage: string;
	status: string;
	homeTeam: string;
	awayTeam: string;
	homeFlag?: string;
	awayFlag?: string;
	homeScore?: number | null;
	awayScore?: number | null;
	prediction?: {
		home: number;
		away: number;
	} | null;
	points?: number;
	pointsReason?: string | null;
	canPredict?: boolean;
};

export function MatchCard({ stage, status, homeTeam, awayTeam, homeFlag = "🏳️", awayFlag = "🏳️", homeScore, awayScore, prediction, points = 0, pointsReason, canPredict = false }: MatchCardProps) {
	const hasResult = homeScore !== null && homeScore !== undefined && awayScore !== null && awayScore !== undefined;

	return (
		<article className="neon-card rounded-2xl p-5">
			<div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
				<span>
					{stage}
				</span>
				<span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] text-primary">
					{getMatchStatus(status)}
				</span>
			</div>

			<div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
				<div className="flex items-center gap-2">
					<span className="text-2xl sm:text-3xl">
						{homeFlag}
					</span>
					<span className="truncate text-sm font-semibold sm:text-lg">
						{homeTeam}
					</span>
				</div>

				<div className="min-w-14 text-center sm:min-w-20">
					{hasResult ? (
						<div className="text-xl font-black sm:text-2xl">
							{homeScore} 
							<span className="neon-text">
								x
							</span> 
						{awayScore}
						</div>) : (
						<div className="neon-text text-xl font-black">VS</div>
					)}
				</div>

				<div className="flex items-center justify-end gap-2">
					<span className="truncate text-right text-lg font-semibold">
						{awayTeam}
					</span>
					<span className="text-3xl">
						{awayFlag}
					</span>
				</div>
			</div>

			<div className="mt-4 text-center text-sm text-muted-foreground">
				{prediction ? (
					<>
						Seu palpite:{" "}
						<span className="font-semibold text-foreground">
							{prediction.home} x {prediction.away}
						</span>
					</>) : 
				canPredict ? (
					<span className="text-primary">Palpite no grupo geral</span> ) : (
					<span>Sem palpite registrado</span>
				)}
			</div>

			<div className="mt-5 rounded-xl bg-black/20 px-4 py-3 text-sm">
				{points > 0 ? (
					<p className="font-semibold text-primary">
						+{points} {pointsReason}
					</p>) : 
				canPredict ? (
					<p className="text-muted-foreground">Clique para fazer seu palpite</p>) : (
					<p className="text-muted-foreground">Aguardando resultado</p>
				)}
			</div>
		</article>
	);
}