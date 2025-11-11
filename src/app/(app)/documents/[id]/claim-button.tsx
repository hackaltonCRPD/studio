
"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Hand } from "lucide-react";
import { useState } from "react";

export function ClaimButton({ documentId }: { documentId: string }) {
    const { toast } = useToast();
    const [isClaimed, setIsClaimed] = useState(false);

    const handleClaim = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/documents/${documentId}/claim`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to claim document.');
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
        }
    };

    if (isClaimed) {
        return <Button size="sm" disabled>Claimed</Button>
    }

    return (
        <Button size="sm" onClick={handleClaim}>
            <Hand className="mr-2 h-4 w-4" />
            Claim This Item
        </Button>
    );
}
