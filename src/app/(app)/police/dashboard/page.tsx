
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { PoliceDashboardClient } from "./police-dashboard-client";
import type { DocumentReport } from "@/lib/types";

const API_URL = process.env.API_URL_INTERNAL;

async function getDocuments(filters?: { status?: string }): Promise<DocumentReport[]> {
    try {
        const query = new URLSearchParams(filters as Record<string, string>).toString();
        const response = await fetch(`${API_URL}/documents?${query}`);
        if (!response.ok) {
            console.error('Failed to fetch documents', await response.text());
            return [];
        }
        const data = await response.json();
        return data.map((doc: any) => ({ ...doc, id: doc._id.toString() }));
    } catch (error) {
        console.error('Error fetching documents:', error);
        return [];
    }
}

export default async function PoliceDashboardPage() {
  // In a real app, you'd fetch only escalated cases from a specific collection/field.
  // We'll mock this by filtering for "claimed" and adding a reason.
  const docs = await getDocuments({ status: "claimed" });
  const escalatedCases = docs.slice(0, 3).map(d => ({ ...d, escalationReason: "Multiple claims" }));

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

    