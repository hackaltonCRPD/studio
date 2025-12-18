
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
import { Check, X, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { DocumentReport, Claim, User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ClaimsClientProps {
    initialClaims: DocumentReport[];
    currentUser: User;
}

export function ClaimsClient({ initialClaims, currentUser }: ClaimsClientProps) {
  const [claims, setClaims] = useState<DocumentReport[]>(initialClaims);
  const { toast } = useToast();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleClaimAction = async (docId: string, claimId: string, action: 'approve' | 'reject') => {
    setLoadingAction(`${claimId}-${action}`);
    try {
        const response = await fetch(`${API_URL}/documents/${docId}/claims/${claimId}/${action}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `Failed to ${action} claim.`);
        }

        // Refetch or optimistically update UI
        setClaims(prevClaims => {
            const updatedDocs = prevClaims.map(doc => {
                if (doc.id === docId) {
                    const updatedClaims = doc.claims.map(claim => 
                        claim._id === claimId ? { ...claim, status: action === 'approve' ? 'approved' : 'rejected' } : claim
                    );
                    // If claim was approved, document is now claimed.
                    const newDocStatus = action === 'approve' ? 'claimed' : doc.status;
                    return { ...doc, claims: updatedClaims, status: newDocStatus };
                }
                return doc;
            });
            
            // Filter out documents that no longer have pending claims
            return updatedDocs.filter(doc => doc.claims.some(c => c.status === 'pending'));
        });

        toast({
            title: "Claim Updated",
            description: `The claim has been successfully ${action}d.`,
        });

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Action Failed",
            description: error.message,
        });
    } finally {
        setLoadingAction(null);
    }
  };

  const getStatusVariant = (status: Claim['status']) => {
    switch (status) {
        case 'approved': return 'default';
        case 'pending': return 'secondary';
        case 'rejected': return 'destructive';
        default: return 'outline';
    }
  };

  const pendingClaims = claims.flatMap(doc => 
    doc.claims
        .filter(claim => claim.status === 'pending')
        .map(claim => ({ doc, claim }))
  );

  return (
     <Table>
        <TableHeader>
            <TableRow>
            <TableHead>Document Type</TableHead>
            <TableHead>Claimant</TableHead>
            <TableHead>Claim Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {pendingClaims.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="h-24 text-center">No pending claims found.</TableCell></TableRow>
            ) : (
                pendingClaims.map(({ doc, claim }) => (
                    <TableRow key={claim._id}>
                        <TableCell className="font-medium">{doc.documentType}</TableCell>
                        <TableCell>{claim.claimant?.name || 'Unknown User'}</TableCell>
                        <TableCell>{format(new Date(claim.claimDate), "PPP")}</TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(claim.status)} className="capitalize">{claim.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right flex items-center justify-end gap-2">
                             <Button variant="outline" size="sm" asChild>
                                <Link href={`/documents/${doc.id}`}><Eye className="mr-2 h-4 w-4" />View Doc</Link>
                             </Button>
                             <Button size="sm" onClick={() => handleClaimAction(doc.id, claim._id, 'approve')} disabled={!!loadingAction}>
                                <Check className="mr-2 h-4 w-4" />Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleClaimAction(doc.id, claim._id, 'reject')} disabled={!!loadingAction}>
                                <X className="mr-2 h-4 w-4" />Reject
                            </Button>
                        </TableCell>
                    </TableRow>
                ))
            )}
        </TableBody>
    </Table>
  );
}
