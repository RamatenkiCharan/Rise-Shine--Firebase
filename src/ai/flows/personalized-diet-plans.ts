'use server';

/**
 * @fileOverview Personalized diet plan AI agent.
 *
 * - personalizedDietPlan - A function that generates a personalized diet plan based on user weight and height.
 * - PersonalizedDietPlanInput - The input type for the personalizedDietPlan function.
 * - PersonalizedDietPlanOutput - The return type for the personalizedDietPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedDietPlanInputSchema = z.object({
  weightKg: z.number().describe('The weight of the user in kilograms.'),
  heightCm: z.number().describe('The height of the user in centimeters.'),
  dietaryPreferences: z.string().optional().describe('Any dietary preferences or restrictions the user has (e.g., vegetarian, vegan, allergies).'),
  goal: z.string().describe('The user goal, should be either weight loss, weight gain, or maintain weight.'),
});
export type PersonalizedDietPlanInput = z.infer<typeof PersonalizedDietPlanInputSchema>;

const PersonalizedDietPlanOutputSchema = z.object({
  dietPlan: z.string().describe('A detailed personalized diet plan for the user.'),
  macronutrientRatios: z.string().describe('Macronutrient ratios for the diet plan (protein, carbs, fats).'),
  vitaminAndMineralSuggestions: z.string().describe('Suggestions for key vitamins and minerals to focus on.'),
  caloriesBurnedSuggestion: z.string().describe('Suggestion to adjust calories burned to support goal.'),
});
export type PersonalizedDietPlanOutput = z.infer<typeof PersonalizedDietPlanOutputSchema>;

export async function personalizedDietPlan(input: PersonalizedDietPlanInput): Promise<PersonalizedDietPlanOutput> {
  return personalizedDietPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedDietPlanPrompt',
  input: {schema: PersonalizedDietPlanInputSchema},
  output: {schema: PersonalizedDietPlanOutputSchema},
  prompt: `You are a nutritionist who is an expert in creating personalized diet plans.

Based on the user's weight, height, dietary preferences, and goal, create a detailed diet plan. Include macronutrient ratios, vitamin and mineral suggestions, and whether or not to adjust calories burned.

Weight: {{{weightKg}}} kg
Height: {{{heightCm}}} cm
Dietary Preferences: {{{dietaryPreferences}}}
Goal: {{{goal}}}.

Ensure the diet plan is safe, healthy, and effective for the user.`,
});

const personalizedDietPlanFlow = ai.defineFlow(
  {
    name: 'personalizedDietPlanFlow',
    inputSchema: PersonalizedDietPlanInputSchema,
    outputSchema: PersonalizedDietPlanOutputSchema,
  },
  async input => {
    const {output} = await ai.generate({
      model: 'gemini-1.5-flash',
      prompt: prompt.compile(input),
      output: {
        format: 'json',
        schema: PersonalizedDietPlanOutputSchema,
      },
    });
    return output!;
  }
);
