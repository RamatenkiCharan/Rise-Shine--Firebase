'use server';
/**
 * @fileOverview Provides personalized exercise reminders to the user based on their preferences.
 *
 * - `getExerciseReminders` - A function that generates exercise reminders based on user preferences.
 * - `ExerciseRemindersInput` - The input type for the `getExerciseReminders` function.
 * - `ExerciseRemindersOutput` - The return type for the `getExerciseReminders` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExerciseRemindersInputSchema = z.object({
  preferences: z
    .string()
    .describe('The user preferences for exercises, e.g., preferred types, duration, intensity.'),
});

export type ExerciseRemindersInput = z.infer<typeof ExerciseRemindersInputSchema>;

const ExerciseRemindersOutputSchema = z.object({
  reminders: z
    .string()
    .describe(
      'A list of exercise reminders tailored to the user preferences, including specific exercises and recommended times.'
    ),
});

export type ExerciseRemindersOutput = z.infer<typeof ExerciseRemindersOutputSchema>;

export async function getExerciseReminders(
  input: ExerciseRemindersInput
): Promise<ExerciseRemindersOutput> {
  return exerciseRemindersFlow(input);
}

const exerciseRemindersPrompt = ai.definePrompt({
  name: 'exerciseRemindersPrompt',
  input: {schema: ExerciseRemindersInputSchema},
  output: {schema: ExerciseRemindersOutputSchema},
  prompt: `Based on the user's preferences:

Preferences: {{{preferences}}}

Generate a list of exercise reminders tailored to these preferences. Be specific about the exercises and recommend suitable times for them.`,
});

const exerciseRemindersFlow = ai.defineFlow(
  {
    name: 'exerciseRemindersFlow',
    inputSchema: ExerciseRemindersInputSchema,
    outputSchema: ExerciseRemindersOutputSchema,
  },
  async input => {
    const {output} = await ai.generate({
      model: 'gemini-1.5-flash',
      prompt: exerciseRemindersPrompt.compile(input),
      output: {
        format: 'json',
        schema: ExerciseRemindersOutputSchema,
      },
    });
    return output!;
  }
);
