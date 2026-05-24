import { z } from "zod";

export const predictionSchema = z.object({
	predictedHomeScore: z
		.number()
		.int()
		.min(0)
		.max(99),

	predictedAwayScore: z
		.number()
		.int()
		.min(0)
		.max(99),
});

export type PredictionInput = z.infer<typeof predictionSchema>;