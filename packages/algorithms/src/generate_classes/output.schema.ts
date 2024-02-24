import {z} from "zod"

// TODO déjà défini ailleurs ?
export const ClassSchema = z.object({
	students: z.string().array()
})

export const RuleOutputSchema = z.object({
	respect_percent: z.number()
})

export const OutputSchema = z.object({
	classes: ClassSchema.array(),
	duration: z.number(),
	rules: RuleOutputSchema.array()
})


export type Output = z.infer<typeof OutputSchema>;