

"use client";

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
import { useEffect, useState } from "react";
import type { DocumentReport } from "@/lib/types";

export default function PoliceDashboardPage() {
  const [escalatedCases, setEscalatedCases] = useState<(DocumentReport & { escalationReason: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEscalated = async () => {
        setIsLoading(true);
        // In a real app, you'd fetch only escalated cases.
        // We'll mock this by filtering for "found" and adding a reason.
        const docs = await getDocuments({ status: "found" });
        const mockEscalated = docs.slice(0,3).map(d => ({...d, escalationReason: "Multiple claims"}));
        setEscalatedCases(mockEscalated);
        setIsLoading(false);
    }
    fetchEscalated();
  }, []);

  const handleClaimAction = async (documentId: string, action: 'approve' | 'deny') => {
      // In a real app, this would call an API endpoint to approve/deny the claim.
      console.log(`Claim for doc ${documentId} was ${action}d.`);
      // Optimistically remove from list
      setEscalatedCases(escalatedCases.filter(c => c.id !== documentId));
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
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Document ID</TableHead>
                        <TableHead>Document Type</TableHead>
                        <TableHead>Reason for Escalation</TableHead>
                        <TableHead>Date Reported</TableHead>
                        <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                           <TableRow><TableCell colSpan={5} className="h-24 text-center">Loading cases...</TableCell></TableRow>
                        ) : escalatedCases.length === 0 ? (
                           <TableRow><TableCell colSpan={5} className="h-24 text-center">No escalated cases.</TableCell></TableRow>
                        ) : (
                            escalatedCases.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Link href={`/documents/${item.id}`} className="font-mono hover:underline">{item.id}</Link>
                                </TableCell>
                                <TableCell className="font-medium">{item.documentType}</TableCell>
                                <TableCell>
                                    <Badge variant="destructive">{item.escalationReason}</Badge>
                                </TableCell>
                                <TableCell>{new Date(item.reportDate).toLocaleDateString()}</TableCell>
                                <TableCell className="flex gap-2">
                                    <Button size="sm" variant="outline" asChild>
                                        <Link href={`/documents/${item.id}`}>View Details</Link>
                                    </Button>
                                    <Button size="sm" onClick={() => handleClaimAction(item.id, 'approve')}>
                                        <Check className="mr-2 h-4 w-4" />
                                        Approve Claim
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleClaimAction(item.id, 'deny')}>
                                        <X className="mr-2 h-4 w-4" />
                                        Deny Claim
                                    </Button>
                                </TableCell>
                            </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
