
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
import { documents } from "@/lib/data";
import Link from "next/link";

// Mock data for escalated cases - in a real app this would come from an API
const escalatedCases = documents.filter(d => d.status === 'found').slice(0, 3).map(d => ({...d, escalationReason: "Multiple claims"}));

export default function PoliceDashboardPage() {

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
                        {escalatedCases.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <Link href={`/documents/${item.id}`} className="font-mono hover:underline">{item.id}</Link>
                            </TableCell>
                            <TableCell className="font-medium">{item.documentType}</TableCell>
                            <TableCell>
                                <Badge variant="destructive">{item.escalationReason}</Badge>
                            </TableCell>
                            <TableCell>{item.reportDate}</TableCell>
                            <TableCell className="flex gap-2">
                                <Button size="sm" variant="outline" asChild>
                                    <Link href={`/documents/${item.id}`}>View Details</Link>
                                </Button>
                                <Button size="sm">
                                    <Check className="mr-2 h-4 w-4" />
                                    Approve Claim
                                </Button>
                                <Button size="sm" variant="destructive">
                                    <X className="mr-2 h-4 w-4" />
                                    Deny Claim
                                </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
