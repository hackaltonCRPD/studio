
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { MatchFinderClient } from "./match-finder-client";
import type { DocumentReport } from "@/lib/types";

const API_URL = process.env.API_URL_INTERNAL;

async function getDocuments(): Promise<DocumentReport[]> {
  if (!API_URL) return [];
  try {
    const response = await fetch(`${API_URL}/documents`, { cache: 'no-store' });
    if (!response.ok) {
      console.error("Failed to fetch documents", await response.text());
      return [];
    }
    const data = await response.json();
    return data.map((doc: any) => ({ ...doc, id: doc._id.toString() }));
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
}

export default async function MatchFinderPage() {
  const allDocuments = await getDocuments();
  const lostDocuments = allDocuments.filter(d => d.status === 'lost');
  const foundDocuments = allDocuments.filter(d => d.status === 'found');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Dashboard</span>
          </Link>
        </Button>
        <div className="flex-1">
          <CardTitle>Match Finder</CardTitle>
          <CardDescription>
            Compare lost and found documents to find potential matches.
          </CardDescription>
        </div>
      </div>

      <MatchFinderClient lostDocuments={lostDocuments} foundDocuments={foundDocuments} />
    </div>
  );
}
