
"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Hand } from "lucide-react";
import { useState } from "react";
import { doc, updateDoc, serverTimestamp, addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/firebase/auth/use-user";

export function ClaimButton({ documentId, ownerId }: { documentId: string, ownerId: string }) {
    const { toast } = useToast();
    const { user } = useAuth();
    const [isClaimed, setIsClaimed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleClaim = async () => {
        if (!user) {
            toast({ variant: "destructive", title: "Not Authenticated", description: "You must be logged in to claim an item." });
            return;
        }
        setIsLoading(true);
        try {
            // Update the document status to "claimed"
            const docRef = doc(db, "documents", documentId);
            await updateDoc(docRef, {
                status: "claimed"
            });

            // Create a notification for the RC Staff and the item owner
            const notification = {
                userId: ownerId, // Notify the person who reported it
                title: "Your Item Has a Claim!",
                description: `${user.displayName} has initiated a claim on your found item: ${documentId}. RC Staff will review and contact you.`,
                timestamp: serverTimestamp(),
                isRead: false,
                link: `/documents/${documentId}`
            };
            await addDoc(collection(db, "notifications"), notification);
            
            // In a real app, you would also notify all RC Staff
            
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
