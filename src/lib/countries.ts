type CountryInfo = {
	name: string;
	flag: string;
};

const countryMap: Record<string, CountryInfo> = {
	MEX: { name: "México", flag: "🇲🇽" },
	KOR: { name: "Coreia do Sul", flag: "🇰🇷" },
	CAN: { name: "Canadá", flag: "🇨🇦" },
	USA: { name: "Estados Unidos", flag: "🇺🇸" },
	QAT: { name: "Catar", flag: "🇶🇦" },
	BRA: { name: "Brasil", flag: "🇧🇷" },
	HAI: { name: "Haiti", flag: "🇭🇹" },
	AUS: { name: "Austrália", flag: "🇦🇺" },
	GER: { name: "Alemanha", flag: "🇩🇪" },
	NED: { name: "Holanda", flag: "🇳🇱" },
	CIV: { name: "Costa do Marfim", flag: "🇨🇮" },
	SWE: { name: "Suécia", flag: "🇸🇪" },
	ESP: { name: "Espanha", flag: "🇪🇸" },
	BEL: { name: "Bélgica", flag: "🇧🇪" },
	KSA: { name: "Arábia Saudita", flag: "🇸🇦" },
	IRN: { name: "Irã", flag: "🇮🇷" },
	FRA: { name: "França", flag: "🇫🇷" },
	IRQ: { name: "Iraque", flag: "🇮🇶" },
	ARG: { name: "Argentina", flag: "🇦🇷" },
	AUT: { name: "Áustria", flag: "🇦🇹" },
	POR: { name: "Portugal", flag: "🇵🇹" },
	ENG: { name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
	GHA: { name: "Gana", flag: "🇬🇭" },
	UZB: { name: "Uzbequistão", flag: "🇺🇿" },
	CZE: { name: "República Tcheca", flag: "🇨🇿" },
	SUI: { name: "Suíça", flag: "🇨🇭" },
	SCO: { name: "Escócia", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
	TUR: { name: "Turquia", flag: "🇹🇷" },
	ECU: { name: "Equador", flag: "🇪🇨" },
	TUN: { name: "Tunísia", flag: "🇹🇳" },
	URY: { name: "Uruguai", flag: "🇺🇾" },
	NZL: { name: "Nova Zelândia", flag: "🇳🇿" },
	NOR: { name: "Noruega", flag: "🇳🇴" },
	JOR: { name: "Jordânia", flag: "🇯🇴" },
	PAN: { name: "Panamá", flag: "🇵🇦" },
	COL: { name: "Colômbia", flag: "🇨🇴" },
	BIH: { name: "Bósnia e Herzegovina", flag: "🇧🇦" },
	MAR: { name: "Marrocos", flag: "🇲🇦" },
	RSA: { name: "África do Sul", flag: "🇿🇦" },
	CUW: { name: "Curaçao", flag: "🇨🇼" },
	JPN: { name: "Japão", flag: "🇯🇵" },
	PAR: { name: "Paraguai", flag: "🇵🇾" },
	SEN: { name: "Senegal", flag: "🇸🇳" },
	CPV: { name: "Cabo Verde", flag: "🇨🇻" },
	EGY: { name: "Egito", flag: "🇪🇬" },
	CRO: { name: "Croácia", flag: "🇭🇷" },
	COD: { name: "República Democrática do Congo", flag: "🇨🇩" },
	ALG: { name: "Argélia", flag: "🇩🇿" }
};

const fallbackNameMap: Record<string, string> = {
	"Mexico": "México",
	"South Korea": "Coreia do Sul",
	"Canada": "Canadá",
	"United States": "Estados Unidos",
	"Qatar": "Catar",
	"Brazil": "Brasil",
	"Haiti": "Haiti",
	"Australia": "Austrália",
	"Germany": "Alemanha",
	"Netherlands": "Holanda",
	"Côte d'Ivoire": "Costa do Marfim",
	"Sweden": "Suécia",
	"Spain": "Espanha",
	"Belgium": "Bélgica",
	"Saudi Arabia": "Arábia Saudita",
	"Iran": "Irã",
	"France": "França",
	"Iraq": "Iraque",
	"Argentina": "Argentina",
	"Austria": "Áustria",
	"Portugal": "Portugal",
	"England": "Inglaterra",
	"Ghana": "Gana",
	"Uzbekistan": "Uzbequistão",
	"Czech Republic": "República Tcheca",
	"Switzerland": "Suíça",
	"Scotland": "Escócia",
	"Turkey": "Turquia",
	"Ecuador": "Equador",
	"Tunisia": "Tunísia",
	"Uruguay": "Uruguai",
	"New Zealand": "Nova Zelândia",
	"Norway": "Noruega",
	"Jordan": "Jordânia",
	"Panama": "Panamá",
	"Colombia": "Colômbia",
	"Bosnia and Herzegovina": "Bósnia e Herzegovina",
	"Morocco": "Marrocos",
	"South Africa": "África do Sul",
	"Curaçao": "Curaçao",
	"Japan": "Japão",
	"Paraguay": "Paraguai",
	"Senegal": "Senegal",
	"Cape Verde": "Cabo Verde",
	"Egypt": "Egito",
	"Croatia": "Croácia",
	"Democratic Republic of the Congo": "República Democrática do Congo",
	"Algeria": "Argélia"
};

export function getCountryName({ code, fallback }: { code?: string | null; fallback?: string | null; }) {
	if (code && countryMap[code.toUpperCase()]) return countryMap[code.toUpperCase()].name;

	if (fallback && fallbackNameMap[fallback]) return fallbackNameMap[fallback];

	return fallback?.trim() || "A definir";
}

export function getFlagByCode(code?: string | null) {
	if (!code) return "🏳️";
	return countryMap[code.toUpperCase()]?.flag ?? "🏳️";
}