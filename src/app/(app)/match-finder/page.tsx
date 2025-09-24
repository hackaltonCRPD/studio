"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { suggestDocumentMatches } from "@/ai/flows/suggest-document-matches";
import type { SuggestDocumentMatchesOutput } from "@/ai/flows/suggest-document-matches";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { BrainCircuit, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  foundDocument: z
    .string()
    .min(10, "Please provide more details for the found document."),
  lostDocument: z
    .string()
    .min(10, "Please provide more details for the lost document."),
});

export default function MatchFinderPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SuggestDocumentMatchesOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      foundDocument: "",
      lostDocument: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const matchResult = await suggestDocumentMatches({
        foundDocumentDetails: values.foundDocument,
        reportedDocumentDetails: values.lostDocument,
      });
      setResult(matchResult);
    } catch (error) {
      console.error("AI Match failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Intelligent Matching Tool</CardTitle>
          <CardDescription>
            Use AI to compare a found document with a lost document report.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="foundDocument"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Found Document Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the document that was found. Include type, names, numbers, condition, etc."
                          className="resize-y min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lostDocument"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lost Document Report Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the document that was reported lost. Include type, names, numbers, condition, etc."
                          className="resize-y min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <BrainCircuit className="mr-2 h-4 w-4" />
                )}
                Analyze for Match
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
         <Card>
            <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                    <div className="w-full space-y-2">
                        <div className="animate-pulse bg-muted rounded-md h-6 w-48"></div>
                        <div className="animate-pulse bg-muted rounded-md h-4 w-full"></div>
                        <div className="animate-pulse bg-muted rounded-md h-4 w-3/4"></div>
                    </div>
                </div>
            </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Matching Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="font-semibold">Potential Match:</div>
              <Badge variant={result.potentialMatch ? "default" : "destructive"}>
                {result.potentialMatch ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
               <div className="font-semibold">Confidence:</div>
                <div className="flex w-full max-w-sm items-center gap-2">
                    <Progress value={result.matchConfidence * 100} className="h-2" />
                    <span className="text-sm font-medium text-muted-foreground">{(result.matchConfidence * 100).toFixed(0)}%</span>
                </div>
            </div>
             <Separator />
            <div>
              <h3 className="font-semibold mb-2">Reasoning</h3>
              <p className="text-sm text-muted-foreground">{result.reasoning}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
