
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { getDocuments } from "@/lib/data";
import { PoliceDashboardClient } from "./police-dashboard-client";
import { useEffect, useState } from "react";
import type { DocumentReport } from "@/lib/types";

export default function PoliceDashboardPage() {
  const [escalatedCases, setEscalatedCases] = useState<(DocumentReport & {escalationReason: string})[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, you'd fetch only escalated cases from a specific collection/field.
    // We'll mock this by filtering for "claimed" and adding a reason.
    getDocuments({ status: "claimed" }).then(docs => {
        const mockEscalated = docs.slice(0,3).map(d => ({...d, escalationReason: "Multiple claims"}));
        setEscalatedCases(mockEscalated);
        setLoading(false);
    });
  }, []);

  if(loading) {
    return <div>Loading police dashboard...</div>
  }

  return (
     <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Police Dashboard</CardTitle>
                <CardDescription>
                    Review and manage escalated document claims.
                </CardDescription>
            </CardHeader>
        </Card>
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <ShieldAlert className="h-6 w-6 text-destructive" />
                    <CardTitle>Escalated Cases</CardTitle>
                </div>
                <CardDescription>
                    These cases have been flagged for police review due to potential fraud or conflicting claims.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <PoliceDashboardClient initialCases={escalatedCases} />
            </CardContent>
        </Card>
    </div>
  );
}
