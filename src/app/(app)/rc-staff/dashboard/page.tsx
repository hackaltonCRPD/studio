
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hand, PackagePlus, Truck } from "lucide-react";
import { getDocuments } from "@/lib/data";
import Link from "next/link";
import { RCStaffDashboardClient } from "./rc-staff-dashboard-client";
import { useEffect, useState } from "react";
import type { DocumentReport } from "@/lib/types";

type StatCardProps = {
    title: string;
    value: string | number;
    icon: React.ElementType;
    description: string;
    buttonLink?: string;
    buttonText?: string;
};

const StatCard = ({ title, value, icon: Icon, description, buttonLink, buttonText }: StatCardProps) => (
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


export default function RCStaffDashboardPage() {
    const [foundItems, setFoundItems] = useState<DocumentReport[]>([]);
    const [pendingClaims, setPendingClaims] = useState<(DocumentReport & { claimantName: string })[]>([]);
    const [recentHandovers, setRecentHandovers] = useState<DocumentReport[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getDocuments({status: 'found'}),
            getDocuments({status: 'claimed'})
        ]).then(([found, claimed]) => {
            setFoundItems(found);
            // Mocking claims and handovers from claimed items
            const mockClaims = claimed.slice(0,2).map(d => ({ ...d, claimantName: 'John Doe' }));
            setPendingClaims(mockClaims);
            setRecentHandovers(claimed.slice(2,5));
            setLoading(false);
        });
    }, []);
    
    if (loading) {
        return <div>Loading RC Staff dashboard...</div>;
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
                        value={5} // Mock data
                        icon={Truck}
                        description="items returned to owners"
                     />
                </div>
            </CardContent>
        </Card>
      
        <RCStaffDashboardClient 
            initialPendingClaims={pendingClaims} 
            initialRecentHandovers={recentHandovers} 
        />
    </div>
  );
}
