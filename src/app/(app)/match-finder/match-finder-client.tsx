
"use client";

import { useState, useMemo } from "react";
import type { DocumentReport } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

interface MatchFinderClientProps {
  lostDocuments: DocumentReport[];
  foundDocuments: DocumentReport[];
}

interface MatchResult {
  lostDoc: DocumentReport;
  foundDoc: DocumentReport;
  score: number;
  reasons: string[];
}

// Simple rule-based matching algorithm
const calculateMatchScore = (lostDoc: DocumentReport, foundDoc: DocumentReport): MatchResult => {
  let score = 0;
  const reasons: string[] = [];

  // Rule 1: Document type must match exactly
  if (lostDoc.documentType.toLowerCase() === foundDoc.documentType.toLowerCase()) {
    score += 50;
    reasons.push("+50: Document types match.");
  } else {
    // If types don't match, it's not a potential match.
    return { score: 0, reasons: ["Document types do not match."], lostDoc, foundDoc };
  }

  // Rule 2: Location partial match
  const lostLoc = lostDoc.location.toLowerCase();
  const foundLoc = foundDoc.location.toLowerCase();
  if (lostLoc.includes(foundLoc) || foundLoc.includes(lostLoc)) {
    score += 30;
    reasons.push("+30: Locations are similar.");
  }

  // Rule 3: Date proximity (within 7 days)
  const dateDiff = Math.abs(new Date(lostDoc.dateLost).getTime() - new Date(foundDoc.dateLost).getTime());
  const diffDays = Math.ceil(dateDiff / (1000 * 60 * 60 * 24));
  if (diffDays <= 7) {
    score += 20;
    reasons.push(`+20: Dates are within ${diffDays} day(s).`);
  }
  
  // Rule 4: Description keyword match
  const lostKeywords = new Set(lostDoc.description.toLowerCase().split(/\s+/));
  const foundKeywords = new Set(foundDoc.description.toLowerCase().split(/\s+/));
  const intersection = new Set([...lostKeywords].filter(x => foundKeywords.has(x)));
  if(intersection.size > 0){
    score += (intersection.size * 5);
    reasons.push(`+${intersection.size * 5}: Found ${intersection.size} keyword match(es).`);
  }
  
  return { score, reasons, lostDoc, foundDoc };
};


export function MatchFinderClient({ lostDocuments, foundDocuments }: MatchFinderClientProps) {
  const [selectedLostDocId, setSelectedLostDocId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLostDocuments = useMemo(() => {
    if (!searchQuery) return lostDocuments;
    return lostDocuments.filter(
      (doc) =>
        doc.documentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [lostDocuments, searchQuery]);

  const potentialMatches = useMemo(() => {
    if (!selectedLostDocId) return [];

    const selectedLostDoc = lostDocuments.find(d => d.id === selectedLostDocId);
    if (!selectedLostDoc) return [];

    return foundDocuments
      .map(foundDoc => calculateMatchScore(selectedLostDoc, foundDoc))
      .filter(result => result.score >= 50)
      .sort((a, b) => b.score - a.score);

  }, [selectedLostDocId, lostDocuments, foundDocuments]);

  const getScoreVariant = (score: number) => {
    if (score >= 90) return "default";
    if (score >= 70) return "secondary";
    return "outline";
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Left Panel: Lost Documents */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>1. Select a Lost Document</CardTitle>
          <Input 
            placeholder="Filter by type or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </CardHeader>
        <CardContent className="space-y-2 max-h-[60vh] overflow-y-auto">
          {filteredLostDocuments.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setSelectedLostDocId(doc.id)}
              className={`w-full text-left p-3 rounded-lg border ${selectedLostDocId === doc.id ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted/50'}`}
            >
              <div className="font-semibold">{doc.documentType}</div>
              <div className="text-sm text-muted-foreground truncate">{doc.description}</div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Right Panel: Found Matches */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>2. Review Potential Matches</CardTitle>
          <CardDescription>
            {selectedLostDocId ? 'Showing best matches for the selected document.' : 'Select a lost document to see potential matches.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto">
          {potentialMatches.length > 0 ? (
            potentialMatches.map(({ lostDoc, foundDoc, score, reasons }) => (
              <Card key={foundDoc.id} className="bg-muted/50">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg">Match Found</CardTitle>
                            <CardDescription>Found: {foundDoc.documentType}</CardDescription>
                        </div>
                        <Badge variant={getScoreVariant(score)}>{score}% Match</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold">Lost Document Details</h4>
                      <p className="text-sm text-muted-foreground truncate">{lostDoc.description}</p>
                      <Button variant="link" asChild className="p-0 h-auto"><Link href={`/documents/${lostDoc.id}`}>View Lost Doc</Link></Button>
                    </div>
                    <div>
                      <h4 className="font-semibold">Found Document Details</h4>
                      <p className="text-sm text-muted-foreground truncate">{foundDoc.description}</p>
                      <Button variant="link" asChild className="p-0 h-auto"><Link href={`/documents/${foundDoc.id}`}>View Found Doc</Link></Button>
                    </div>
                  </div>
                  <Separator />
                  <div>
                      <h4 className="font-semibold mb-2">Matching Reasons</h4>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          {reasons.map((reason, i) => <li key={i}>{reason}</li>)}
                      </ul>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-10">
              {selectedLostDocId ? "No strong matches found in the database." : "Select a lost document to begin."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
