type CountryInfo = {
	name: string;
	iso2?: string;
	customFlagUrl?: string;
};

const countryMap: Record<string, CountryInfo> = {
	MEX: { name: "México", iso2: "mx" },
	KOR: { name: "Coreia do Sul", iso2: "kr" },
	CAN: { name: "Canadá", iso2: "ca" },
	USA: { name: "Estados Unidos", iso2: "us" },
	QAT: { name: "Catar", iso2: "qa" },
	BRA: { name: "Brasil", iso2: "br" },
	HAI: { name: "Haiti", iso2: "ht" },
	AUS: { name: "Austrália", iso2: "au" },
	GER: { name: "Alemanha", iso2: "de" },
	NED: { name: "Holanda", iso2: "nl" },
	CIV: { name: "Costa do Marfim", iso2: "ci" },
	SWE: { name: "Suécia", iso2: "se" },
	ESP: { name: "Espanha", iso2: "es" },
	BEL: { name: "Bélgica", iso2: "be" },
	KSA: { name: "Arábia Saudita", iso2: "sa" },
	IRN: { name: "Irã", iso2: "ir" },
	FRA: { name: "França", iso2: "fr" },
	IRQ: { name: "Iraque", iso2: "iq" },
	ARG: { name: "Argentina", iso2: "ar" },
	AUT: { name: "Áustria", iso2: "at" },
	POR: { name: "Portugal", iso2: "pt" },
	ENG: { name: "Inglaterra", customFlagUrl: "https://flagcdn.com/gb-eng.svg" },
	GHA: { name: "Gana", iso2: "gh" },
	UZB: { name: "Uzbequistão", iso2: "uz" },
	CZE: { name: "República Tcheca", iso2: "cz" },
	SUI: { name: "Suíça", iso2: "ch" },
	SCO: { name: "Escócia", customFlagUrl: "https://flagcdn.com/gb-sct.svg" },
	TUR: { name: "Turquia", iso2: "tr" },
	ECU: { name: "Equador", iso2: "ec" },
	TUN: { name: "Tunísia", iso2: "tn" },
	URY: { name: "Uruguai", iso2: "uy" },
	NZL: { name: "Nova Zelândia", iso2: "nz" },
	NOR: { name: "Noruega", iso2: "no" },
	JOR: { name: "Jordânia", iso2: "jo" },
	PAN: { name: "Panamá", iso2: "pa" },
	COL: { name: "Colômbia", iso2: "co" },
	BIH: { name: "Bósnia e Herzegovina", iso2: "ba" },
	MAR: { name: "Marrocos", iso2: "ma" },
	RSA: { name: "África do Sul", iso2: "za" },
	CUR: { name: "Curaçao", customFlagUrl: "https://flagcdn.com/cw.svg" },
	JPN: { name: "Japão", iso2: "jp" },
	PAR: { name: "Paraguai", iso2: "py" },
	SEN: { name: "Senegal", iso2: "sn" },
	CPV: { name: "Cabo Verde", iso2: "cv" },
	EGY: { name: "Egito", iso2: "eg" },
	CRO: { name: "Croácia", iso2: "hr" },
	COD: { name: "RD Congo", iso2: "cd" },
	ALG: { name: "Argélia", iso2: "dz" }
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
	"Democratic Republic of the Congo": "RD Congo",
	"Algeria": "Argélia"
};

export function getCountryName({ code, fallback }: { code?: string | null; fallback?: string | null; }) {
	if (code && countryMap[code.toUpperCase()]) return countryMap[code.toUpperCase()].name;

	if (fallback && fallbackNameMap[fallback]) return fallbackNameMap[fallback];

	return fallback?.trim() || "A definir";
}

export function getCountryFlagUrl(code?: string | null) {
	if (!code) return null;

	const country = countryMap[code.toUpperCase()];
	if (!country) return null;

	if (country.customFlagUrl) return country.customFlagUrl;

	if (country.iso2) return `https://flagcdn.com/w80/${country.iso2.toLowerCase()}.png`;

	return null;
}