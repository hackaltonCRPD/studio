
"use client"

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface EditProfileFormProps {
    user: User;
}

export function EditProfileForm({ user }: EditProfileFormProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [name, setName] = useState(user.name);
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
    const [preferredContactMethod, setPreferredContactMethod] = useState(user.preferredContactMethod || "email");
    const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

    const validate = () => {
        const newErrors: { name?: string } = {};
        if (name.length < 2) {
            newErrors.name = "Name must be at least 2 characters.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!validate()) {
            return;
        }

        const changes: Partial<User> = {};
        if (name !== user.name) changes.name = name;
        if (phoneNumber !== (user.phoneNumber || "")) changes.phoneNumber = phoneNumber;
        if (preferredContactMethod !== (user.preferredContactMethod || "email")) changes.preferredContactMethod = preferredContactMethod;
        
        if (Object.keys(changes).length === 0) {
            toast({
                title: "No Changes",
                description: "You haven't made any changes to your profile.",
            });
            return;
        }

        startTransition(async () => {
            try {
                const response = await fetch(`${API_URL}/users/${user.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(changes),
                });
                if (!response.ok) throw new Error("Failed to update user");

                toast({
                    title: "Profile Updated",
                    description: "Your profile has been successfully updated.",
                });
                router.refresh();
            } catch (error) {
                console.error(error);
                toast({
                    variant: "destructive",
                    title: "Update Failed",
                    description: "Could not update your profile.",
                });
            }
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isPending}
                />
                {errors.name && <p className="text-sm font-medium text-destructive">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={user.email}
                    disabled
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="123-456-7890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={isPending}
                />
            </div>

            <div className="space-y-3">
                <Label>Preferred Contact Method</Label>
                <RadioGroup
                    onValueChange={(value: "email" | "phone") => setPreferredContactMethod(value)}
                    value={preferredContactMethod}
                    className="flex flex-row space-x-4"
                    disabled={isPending}
                >
                    <div className="flex items-center space-x-2 space-y-0">
                        <RadioGroupItem value="email" id="email"/>
                        <Label htmlFor="email" className="font-normal">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-y-0">
                        <RadioGroupItem value="phone" id="phone" />
                        <Label htmlFor="phone" className="font-normal">Phone</Label>
                    </div>
                </RadioGroup>
            </div>
            
            <div className="flex justify-start">
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    )
}
