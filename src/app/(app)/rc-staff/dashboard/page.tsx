

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
import { Skeleton } from "@/components/ui/skeleton";

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
        try {
            const [found, claimed] = await Promise.all([
                getDocuments({status: 'found'}),
                getDocuments({status: 'claimed'})
            ]);
            
            // Mocking claims and handovers
            setFoundItems(found);
            setPendingClaims(found.slice(0,2).map(d => ({ ...d, claimantName: 'John Doe' })));
            setRecentHandovers(claimed.slice(0,3));
        } catch (error) {
            console.error("Failed to fetch RC Staff data", error);
        }

        setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleClaimAction = async (documentId: string, action: 'approve' | 'reject' | 'escalate') => {
      console.log(`Action: ${action} on document ${documentId}`);
      // Optimistically remove from list
      setPendingClaims(pendingClaims.filter(c => c.id !== documentId));
  }

  const StatCard = ({ title, value, icon: Icon, description, buttonLink, buttonText }: { title: string, value: string | number, icon: React.ElementType, description: string, buttonLink?: string, buttonText?: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
            {buttonLink && buttonText &&
                <Button size="sm" className="mt-2" asChild>
                    <Link href={buttonLink}>{buttonText}</Link>
                </Button>
            }
        </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
       <div className="space-y-6">
           <Card>
            <CardHeader>
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </CardHeader>
             <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                    <Skeleton className="h-36" />
                    <Skeleton className="h-36" />
                    <Skeleton className="h-36" />
                </div>
            </CardContent>
        </Card>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
       </div>
    );
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
                     <StatCard 
                        title="Found Items"
                        value={foundItems.length}
                        icon={PackagePlus}
                        description="items waiting for claim"
                        buttonLink="/documents/report?status=found"
                        buttonText="Log New Found Item"
                     />
                     <StatCard 
                        title="Pending Claims"
                        value={pendingClaims.length}
                        icon={Hand}
                        description="claims to review"
                     />
                     <StatCard 
                        title="Handovers Today"
                        value={5}
                        icon={Truck}
                        description="items returned to owners"
                     />
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
    </div>
  );
}
