
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ShieldAlert, X } from "lucide-react";
import { getDocuments } from "@/lib/data";
import Link from "next/link";
import { PoliceDashboardClient } from "./police-dashboard-client";

export default async function PoliceDashboardPage() {
  
  // In a real app, you'd fetch only escalated cases.
  // We'll mock this by filtering for "found" and adding a reason.
  const docs = await getDocuments({ status: "found" });
  const mockEscalated = docs.slice(0,3).map(d => ({...d, escalationReason: "Multiple claims"}));

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
                 <PoliceDashboardClient initialCases={mockEscalated} />
            </CardContent>
        </Card>
    </div>
  );
}
