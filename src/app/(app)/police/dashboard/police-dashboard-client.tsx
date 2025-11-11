
"use client";

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
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { DocumentReport } from "@/lib/types";

interface PoliceDashboardClientProps {
    initialCases: (DocumentReport & { escalationReason: string })[];
}

export function PoliceDashboardClient({ initialCases }: PoliceDashboardClientProps) {
  const [escalatedCases, setEscalatedCases] = useState<(DocumentReport & { escalationReason: string })[]>(initialCases);

  const handleClaimAction = async (documentId: string, action: 'approve' | 'deny') => {
      // In a real app, this would call an API endpoint to approve/deny the claim.
      console.log(`Claim for doc ${documentId} was ${action}d.`);
      // Optimistically remove from list
      setEscalatedCases(escalatedCases.filter(c => c.id !== documentId));
  }

  return (
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
            {escalatedCases.length === 0 ? (
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
  );
}
