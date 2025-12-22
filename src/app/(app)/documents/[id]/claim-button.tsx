
"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Hand } from "lucide-react";
import { useState, useEffect } from "react";
import { getAuthenticatedUser } from "@/lib/auth";
import type { User } from "@/lib/types";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function ClaimButton({ documentId, initialIsClaimedByCurrentUser }: { documentId: string, initialIsClaimedByCurrentUser: boolean }) {
    const { toast } = useToast();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isClaimed, setIsClaimed] = useState(initialIsClaimedByCurrentUser);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getAuthenticatedUser().then(u => {
            setUser(u);
            setIsLoading(false);
        });
    }, []);

    const handleClaim = async () => {
        if (!user) {
            router.push('/login?redirect=/documents/' + documentId);
            return;
        }
        
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/documents/${documentId}/claim`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ claimantId: user.id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to claim document');
            }
            
            setIsClaimed(true);
            toast({
                title: 'Claim Initiated',
                description: 'RC Staff has been notified. They will review your claim.',
            });
            
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Claim Failed',
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isClaimed) {
        return <Button size="sm" disabled>Claim Pending</Button>
    }

    return (
        <Button size="sm" onClick={handleClaim} disabled={isLoading}>
            {isLoading ? "Loading..." : <><Hand className="mr-2 h-4 w-4" /> Claim This Item</>}
        </Button>
    );
}
