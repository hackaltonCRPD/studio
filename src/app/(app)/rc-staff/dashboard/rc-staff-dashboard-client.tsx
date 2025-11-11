
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
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { DocumentReport } from "@/lib/types";

type Claim = DocumentReport & { claimantName: string };

interface RCStaffDashboardClientProps {
    initialPendingClaims: Claim[];
    initialRecentHandovers: DocumentReport[];
}

export function RCStaffDashboardClient({ initialPendingClaims, initialRecentHandovers }: RCStaffDashboardClientProps) {
  const [pendingClaims, setPendingClaims] = useState<Claim[]>(initialPendingClaims);
  const [recentHandovers, setRecentHandovers] = useState<DocumentReport[]>(initialRecentHandovers);

  const handleClaimAction = async (documentId: string, action: 'approve' | 'reject' | 'escalate') => {
      console.log(`Action: ${action} on document ${documentId}`);
      // Optimistically remove from list
      setPendingClaims(pendingClaims.filter(c => c.id !== documentId));
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Pending Claims</CardTitle>
          <CardDescription>
            Review and approve or reject claims made by users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document ID</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Claimant</TableHead>
                <TableHead>Date Claimed</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {pendingClaims.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="h-24 text-center">No pending claims.</TableCell></TableRow>
                ) : (
                    pendingClaims.map(item => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <Link href={`/documents/${item.id}`} className="font-mono hover:underline">{item.id}</Link>
                            </TableCell>
                            <TableCell className="font-medium">{item.documentType}</TableCell>
                            <TableCell>{item.claimantName}</TableCell>
                            <TableCell>{new Date().toLocaleDateString()}</TableCell>
                            <TableCell className="flex gap-2">
                            <Button size="sm" onClick={() => handleClaimAction(item.id, 'approve')}>
                                    <Check className="mr-2 h-4 w-4" />
                                    Approve
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleClaimAction(item.id, 'reject')}>
                                    <X className="mr-2 h-4 w-4" />
                                    Reject
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleClaimAction(item.id, 'escalate')}>Escalate</Button>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

        <Card>
            <CardHeader>
                <CardTitle>Recent Handovers</CardTitle>
                 <CardDescription>Log and view recently returned items.</CardDescription>
            </CardHeader>
             <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Document ID</TableHead>
                            <TableHead>Document Type</TableHead>
                            <TableHead>Claimant</TableHead>
                            <TableHead>Handover Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {recentHandovers.length === 0 ? (
                            <TableRow><TableCell colSpan={4} className="h-24 text-center">No recent handovers.</TableCell></TableRow>
                         ) : (
                            recentHandovers.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Link href={`/documents/${item.id}`} className="font-mono hover:underline">{item.id}</Link>
                                    </TableCell>
                                    <TableCell className="font-medium">{item.documentType}</TableCell>
                                    <TableCell>Jane Doe</TableCell>
                                    <TableCell>{new Date(item.reportDate).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))
                         )}
                    </TableBody>
                 </Table>
             </CardContent>
        </Card>
    </>
  );
}
