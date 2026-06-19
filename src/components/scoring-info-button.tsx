"use client";

import { useEffect, useState } from "react";

export function ScoringInfoButton() {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (!isOpen) return;

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") setIsOpen(false);
		}

		document.addEventListener("keydown", handleKeyDown);

		return () => { document.removeEventListener("keydown", handleKeyDown); };
	}, [isOpen]);

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="flex size-7 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-xs font-black text-primary transition hover:border-primary hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(176,38,255,0.35)] cursor-pointer"
				aria-label="Ver regras de pontuação"
			>
				?
			</button>

			{isOpen && (
				<div
					className="fixed inset-0 z-120 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
					onClick={() => setIsOpen(false)}
				>
					<div
						className="max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-3xl border border-primary/30 bg-background p-5 shadow-[0_0_40px_rgba(176,38,255,0.25)] sm:max-w-md"
						onClick={(event) => event.stopPropagation()}
					>
						<div className="flex items-start justify-between gap-3">
							<div>
								<p className="neon-text text-xs font-bold uppercase tracking-[0.22em]">
									Pontuação
								</p>

								<h3 className="mt-1 text-xl font-black">Como funciona?</h3>
							</div>

							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="rounded-full border border-white/10 px-3 py-1 text-sm text-muted-foreground transition hover:border-primary/50 hover:text-primary cursor-pointer"
							>
								Fechar
							</button>
						</div>

						<div className="mt-5 grid gap-2 text-sm text-muted-foreground">
							<Rule points={25} text="Placar exato" />
							<Rule points={18} text="Vencedor e gols do vencedor" />
							<Rule points={15} text="Saldo de gols" />
							<Rule points={12} text="Vencedor e gols do perdedor" />
							<Rule points={10} text="Vencedor correto" />
							{/* <Rule points={3} text="Placar de algum time" /> */}
						</div>

						<p className="mt-5 text-xs leading-5 text-muted-foreground">
							O sistema aplica sempre a melhor regra possível. O máximo por jogo
							é <span className="font-bold text-primary">25 pontos</span>.
						</p>
					</div>
				</div>
			)}
		</>
	);
}

function Rule({ points, text }: { points: number; text: string }) {
	return (
		<div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2">
			<span>{text}</span>
			<span className="font-black text-primary">+{points}</span>
		</div>
	);
}