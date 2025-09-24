
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
import { Check, Hand, PackagePlus, Truck, X } from "lucide-react";
import { documents } from "@/lib/data";
import Link from "next/link";


// Mock data for claims - in a real app this would come from an API
const pendingClaims = documents.filter(d => d.status === 'found').slice(0, 2).map(d => ({...d, claimantName: 'John Doe'}));
const recentHandovers = documents.filter(d => d.status === 'claimed').slice(0, 3);


export default function RCStaffDashboardPage() {
  const foundItems = documents.filter(d => d.status === 'found');

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
                            <div className="text-2xl font-bold">{foundItems.length}</div>
                            <p className="text-xs text-muted-foreground">items waiting for claim</p>
                            <Button size="sm" className="mt-2" asChild>
                                <Link href="/documents/report">Log New Found Item</Link>
                            </Button>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
                            <Hand className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pendingClaims.length}</div>
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
                {pendingClaims.map(item => (
                     <TableRow key={item.id}>
                        <TableCell>
                            <Link href={`/documents/${item.id}`} className="font-mono hover:underline">{item.id}</Link>
                        </TableCell>
                        <TableCell className="font-medium">{item.documentType}</TableCell>
                        <TableCell>{item.claimantName}</TableCell>
                        <TableCell>{new Date().toLocaleDateString()}</TableCell>
                        <TableCell className="flex gap-2">
                           <Button size="sm">
                                <Check className="mr-2 h-4 w-4" />
                                Approve
                            </Button>
                            <Button size="sm" variant="destructive">
                                <X className="mr-2 h-4 w-4" />
                                Reject
                            </Button>
                            <Button size="sm" variant="outline">Escalate</Button>
                        </TableCell>
                    </TableRow>
                ))}
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
                         {recentHandovers.map(item => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Link href={`/documents/${item.id}`} className="font-mono hover:underline">{item.id}</Link>
                                </TableCell>
                                <TableCell className="font-medium">{item.documentType}</TableCell>
                                <TableCell>Jane Doe</TableCell>
                                <TableCell>{item.reportDate}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                 </Table>
             </CardContent>
        </Card>
    </div>
  );
}
