// Summarize key information from a document report using AI.

'use server';

/**
 * @fileOverview Summarizes key information from a document report using AI.
 *
 * - summarizeDocumentReport - A function that summarizes a document report.
 * - SummarizeDocumentReportInput - The input type for the summarizeDocumentReport function.
 * - SummarizeDocumentReportOutput - The return type for the summarizeDocumentReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDocumentReportInputSchema = z.object({
  reportDetails: z.string().describe('Details of the document report, including description, location found, etc.'),
  userRole: z.string().describe('The role of the user submitting the report.'),
});
export type SummarizeDocumentReportInput = z.infer<typeof SummarizeDocumentReportInputSchema>;

const SummarizeDocumentReportOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the document report.'),
});
export type SummarizeDocumentReportOutput = z.infer<typeof SummarizeDocumentReportOutputSchema>;

export async function summarizeDocumentReport(input: SummarizeDocumentReportInput): Promise<SummarizeDocumentReportOutput> {
  return summarizeDocumentReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDocumentReportPrompt',
  input: {schema: SummarizeDocumentReportInputSchema},
  output: {schema: SummarizeDocumentReportOutputSchema},
  prompt: `You are an AI assistant helping to summarize document reports.

  Summarize the following document report details, focusing on key information that would be relevant to RC staff.  Take into account the role of the user submitting the report.

  Report Details: {{{reportDetails}}}
  User Role: {{{userRole}}}
  `,
});

const summarizeDocumentReportFlow = ai.defineFlow(
  {
    name: 'summarizeDocumentReportFlow',
    inputSchema: SummarizeDocumentReportInputSchema,
    outputSchema: SummarizeDocumentReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
