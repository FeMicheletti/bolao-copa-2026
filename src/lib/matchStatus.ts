const matchStatus: Record<string, string> = {
	"TIMED": "Agendada",
	"IN_PLAY": "Em andamento",
	"PAUSED": "Pausada",
	"FINISHED": "Finalizada",
	"SCHEDULED": "Agendada",
	"CANCELED": "Cancelada",
	"POSTPONED": "Adiada",
	"SUSPENDED": "Suspensa",
	"AWARDED": "Atribuída",
	"DELAYED": "Atrasada"
}

export function getMatchStatus(code?: string | null) {
	return matchStatus[code?.toUpperCase() ?? ""] ?? "Desconhecido";
}