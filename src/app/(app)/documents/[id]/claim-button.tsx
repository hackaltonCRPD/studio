
"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { claimDocument } from "@/services/documentService";
import { Hand } from "lucide-react";
import { useState } from "react";

export function ClaimButton({ documentId, ownerId }: { documentId: string, ownerId: string }) {
    const { toast } = useToast();
    const [isClaimed, setIsClaimed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleClaim = async () => {
        // In a real app, you would get the current user's ID
        const claimantId = "user2"; // Mock claimant
        setIsLoading(true);
        try {
            await claimDocument(documentId, claimantId);
            
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
        return <Button size="sm" disabled>Claimed</Button>
    }

    return (
        <Button size="sm" onClick={handleClaim} disabled={isLoading}>
            {isLoading ? "Claiming..." : <><Hand className="mr-2 h-4 w-4" /> Claim This Item</>}
        </Button>
    );
}
