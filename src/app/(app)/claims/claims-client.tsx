
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, MoreHorizontal, Eye } from "lucide-react";
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

  const handleClaimAction = async (docId: string, claimId: string, action: 'approve' | 'reject') => {
    try {
        const response = await fetch(`${API_URL}/documents/${docId}/claims/${claimId}/${action}`, {
            method: 'PUT',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `Failed to ${action} claim.`);
        }

        // Optimistically update UI
        setClaims(prevClaims => prevClaims.filter(doc => doc.id !== docId));

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
    }
  };

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
            {claims.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="h-24 text-center">No pending claims found.</TableCell></TableRow>
            ) : (
                claims.flatMap(doc => 
                    doc.claims
                    .filter(claim => claim.status === 'pending')
                    .map(claim => (
                        <TableRow key={claim._id}>
                            <TableCell className="font-medium">{doc.documentType}</TableCell>
                            <TableCell>{claim.claimant?.name || 'Unknown User'}</TableCell>
                            <TableCell>{format(new Date(claim.claimDate), "PPP")}</TableCell>
                            <TableCell>
                               <Badge variant="secondary" className="capitalize">{claim.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/documents/${doc.id}`}>
                                            <Eye className="mr-2 h-4 w-4" /> View Document
                                        </Link>
                                    </DropdownMenuItem>
                                     <DropdownMenuItem onClick={() => handleClaimAction(doc.id, claim._id, 'approve')}>
                                        <Check className="mr-2 h-4 w-4" />Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive" onClick={() => handleClaimAction(doc.id, claim._id, 'reject')}>
                                        <X className="mr-2 h-4 w-4" />Reject
                                    </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))
                )
            )}
        </TableBody>
    </Table>
  );
}
