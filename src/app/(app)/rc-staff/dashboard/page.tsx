

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
import { Check, Hand, PackagePlus, Truck, X } from "lucide-react";
import { getDocuments } from "@/lib/data";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { DocumentReport } from "@/lib/types";

type Claim = DocumentReport & { claimantName: string };

export default function RCStaffDashboardPage() {
  const [foundItems, setFoundItems] = useState<DocumentReport[]>([]);
  const [pendingClaims, setPendingClaims] = useState<Claim[]>([]);
  const [recentHandovers, setRecentHandovers] = useState<DocumentReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        // In a real app, you'd have specific endpoints for these
        const [allDocs, found, claimed] = await Promise.all([
            getDocuments(),
            getDocuments({status: 'found'}),
            getDocuments({status: 'claimed'})
        ]);
        
        // Mocking claims and handovers
        setFoundItems(found);
        setPendingClaims(found.slice(0,2).map(d => ({ ...d, claimantName: 'John Doe' })));
        setRecentHandovers(claimed.slice(0,3));

        setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleClaimAction = async (documentId: string, action: 'approve' | 'reject' | 'escalate') => {
      console.log(`Action: ${action} on document ${documentId}`);
      // Optimistically remove from list
      setPendingClaims(pendingClaims.filter(c => c.id !== documentId));
  }


  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>RC Staff Dashboard</CardTitle>
                <CardDescription>
                    Manage found items, approve claims, and log handovers.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Found Items</CardTitle>
                            <PackagePlus className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{isLoading ? '...' : foundItems.length}</div>
                            <p className="text-xs text-muted-foreground">items waiting for claim</p>
                            <Button size="sm" className="mt-2" asChild>
                                <Link href="/documents/report?status=found">Log New Found Item</Link>
                            </Button>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
                            <Hand className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{isLoading ? '...' : pendingClaims.length}</div>
                            <p className="text-xs text-muted-foreground">claims to review</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Handovers Today</CardTitle>
                            <Truck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">5</div>
                            <p className="text-xs text-muted-foreground">items returned to owners</p>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>
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
                {isLoading ? (
                    <TableRow><TableCell colSpan={5} className="h-24 text-center">Loading claims...</TableCell></TableRow>
                ) : pendingClaims.length === 0 ? (
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
                         {isLoading ? (
                            <TableRow><TableCell colSpan={4} className="h-24 text-center">Loading handovers...</TableCell></TableRow>
                         ) : recentHandovers.length === 0 ? (
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
    </div>
  );
}
