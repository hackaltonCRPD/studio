
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Hand } from "lucide-react";
import type { DocumentReport, User } from "@/lib/types";
import { ClaimsClient } from "./claims-client";
import { getAuthenticatedUser } from "@/lib/auth";
import { redirect } from "next/navigation";

const API_URL = process.env.API_URL_INTERNAL;

async function getPendingClaims(): Promise<DocumentReport[]> {
    if (!API_URL) return [];
    try {
        // Fetch documents that have pending claims. The backend should filter these.
        const response = await fetch(`${API_URL}/documents?hasPendingClaims=true`, { cache: 'no-store' });
        if (!response.ok) {
            console.error('Failed to fetch documents with pending claims', await response.text());
            return [];
        }
        const data = await response.json();
        return data.map((doc: any) => ({ ...doc, id: doc._id.toString() }));
    } catch (error) {
        console.error('Error fetching documents with pending claims:', error);
        return [];
    }
}

export default async function ClaimsPage() {
    const user = await getAuthenticatedUser();
    if (!user || !['admin', 'rc_staff', 'police'].includes(user.role)) {
        redirect('/dashboard');
    }
    
    const claims = await getPendingClaims();
    
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Hand className="h-6 w-6 text-primary" />
                    <CardTitle>Manage Claims</CardTitle>
                </div>
                <CardDescription>
                    Review, approve, or reject pending claims for found documents.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ClaimsClient initialClaims={claims} currentUser={user} />
            </CardContent>
        </Card>
    );
}
