'use server';

/**
 * @fileOverview AI flow to suggest potential matches between found and reported documents.
 *
 * - suggestDocumentMatches - Function to suggest document matches.
 * - SuggestDocumentMatchesInput - Input type for the suggestDocumentMatches function.
 * - SuggestDocumentMatchesOutput - Return type for the suggestDocumentMatches function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDocumentMatchesInputSchema = z.object({
  foundDocumentDetails: z
    .string()
    .describe('Details of the found document, including type, descriptions, and any identifying information.'),
  reportedDocumentDetails: z
    .string()
    .describe('Details of the reported lost document, including type, descriptions, and any identifying information.'),
});

export type SuggestDocumentMatchesInput = z.infer<
  typeof SuggestDocumentMatchesInputSchema
>;

const SuggestDocumentMatchesOutputSchema = z.object({
  potentialMatch: z
    .boolean()
    .describe(
      'Whether the AI determines there is a potential match between the found and reported documents.'
    ),
  matchConfidence: z
    .number()
    .describe(
      'A score (0-1) indicating the confidence level of the potential match. Higher values indicate greater confidence.'
    ),
  reasoning: z
    .string()
    .describe(
      'Explanation of why the AI thinks the documents match or do not match.'
    ),
});

export type SuggestDocumentMatchesOutput = z.infer<
  typeof SuggestDocumentMatchesOutputSchema
>;

export async function suggestDocumentMatches(
  input: SuggestDocumentMatchesInput
): Promise<SuggestDocumentMatchesOutput> {
  return suggestDocumentMatchesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDocumentMatchesPrompt',
  input: {
    schema: SuggestDocumentMatchesInputSchema,
  },
  output: {
    schema: SuggestDocumentMatchesOutputSchema,
  },
  prompt: `You are an AI assistant designed to determine if a found document potentially matches a reported lost document.

  Analyze the details of both documents and provide a determination of whether they are a potential match.  Provide a confidence score between 0 and 1. Provide an explanation of your reasoning.

  Found Document Details: {{{foundDocumentDetails}}}
  Reported Document Details: {{{reportedDocumentDetails}}}`,
});

const suggestDocumentMatchesFlow = ai.defineFlow(
  {
    name: 'suggestDocumentMatchesFlow',
    inputSchema: SuggestDocumentMatchesInputSchema,
    outputSchema: SuggestDocumentMatchesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
