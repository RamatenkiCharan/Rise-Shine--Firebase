'use server';

/**
 * @fileOverview Creates a diet plan from a list of ingredients.
 *
 * - `dietFromIngredients` - A function that generates a diet plan.
 * - `DietFromIngredientsInput` - The input type for the function.
 * - `DietFromIngredientsOutput` - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DietFromIngredientsInputSchema = z.object({
  ingredients: z.string().describe('A comma-separated list of ingredients the user has.'),
});
export type DietFromIngredientsInput = z.infer<typeof DietFromIngredientsInputSchema>;

const DietFromIngredientsOutputSchema = z.object({
  dietPlan: z.string().describe('A detailed diet plan based on the provided ingredients.'),
  shoppingListSuggestions: z.string().optional().describe('A list of suggested ingredients to buy to supplement the plan.'),
});
export type DietFromIngredientsOutput = z.infer<typeof DietFromIngredientsOutputSchema>;

export async function dietFromIngredients(input: DietFromIngredientsInput): Promise<DietFromIngredientsOutput> {
  return dietFromIngredientsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dietFromIngredientsPrompt',
  input: {schema: DietFromIngredientsInputSchema},
  output: {schema: DietFromIngredientsOutputSchema},
  prompt: `You are a nutritionist. A user has the following ingredients and wants a diet plan.

Ingredients: {{ingredients}}

Create a healthy and balanced diet plan (breakfast, lunch, dinner, snacks) for one day using mainly these ingredients.
Also, suggest a small shopping list of complementary items if needed.`,
});

const dietFromIngredientsFlow = ai.defineFlow(
  {
    name: 'dietFromIngredientsFlow',
    inputSchema: DietFromIngredientsInputSchema,
    outputSchema: DietFromIngredientsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
