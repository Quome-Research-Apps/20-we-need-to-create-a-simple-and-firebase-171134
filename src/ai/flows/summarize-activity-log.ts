// Summarize Activity Log
'use server';
/**
 * @fileOverview Summarizes and categorizes time-tracking information from activity logs.
 *
 * - summarizeActivityLog - A function that takes activity logs as input and returns a summary.
 * - SummarizeActivityLogInput - The input type for the summarizeActivityLog function.
 * - SummarizeActivityLogOutput - The return type for the summarizeActivityLog function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeActivityLogInputSchema = z.array(
  z.object({
    description: z.string().describe('The description of the activity.'),
    timeElapsed: z.number().describe('The time elapsed for the activity in minutes.'),
  })
).describe('An array of activity log entries.');

export type SummarizeActivityLogInput = z.infer<typeof SummarizeActivityLogInputSchema>;

const SummarizeActivityLogOutputSchema = z.object({
  summary: z.string().describe('A summary of the time-tracking information, including categorization of activities and time spent on each category.'),
}).describe('A summary of the activity log.');

export type SummarizeActivityLogOutput = z.infer<typeof SummarizeActivityLogOutputSchema>;

export async function summarizeActivityLog(input: SummarizeActivityLogInput): Promise<SummarizeActivityLogOutput> {
  return summarizeActivityLogFlow(input);
}

const summarizeActivityLogPrompt = ai.definePrompt({
  name: 'summarizeActivityLogPrompt',
  input: {schema: SummarizeActivityLogInputSchema},
  output: {schema: SummarizeActivityLogOutputSchema},
  prompt: `You are an AI assistant for lawyers, helping them understand how they spend their time.

  Given the following activity log entries, summarize and categorize the information, highlighting the main areas where time is being spent. Include the percentage of time spent on each category.

  Activity Log:
  {{#each this}}
  - Description: {{{description}}}, Time Elapsed: {{{timeElapsed}}} minutes
  {{/each}}
  `
});

const summarizeActivityLogFlow = ai.defineFlow(
  {
    name: 'summarizeActivityLogFlow',
    inputSchema: SummarizeActivityLogInputSchema,
    outputSchema: SummarizeActivityLogOutputSchema,
  },
  async input => {
    const {output} = await summarizeActivityLogPrompt(input);
    return output!;
  }
);
