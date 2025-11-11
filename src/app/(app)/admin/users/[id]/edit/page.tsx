
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserById } from "@/lib/data";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { User, UserRole } from "@/lib/types";
import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/auth";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phoneNumber: z.string().optional(),
  role: z.enum(["reporter", "finder", "rc_staff", "police", "admin"]),
  preferredContactMethod: z.enum(["email", "phone"]).optional(),
});

export default function EditUserPage({ params }: { params: { id: string } }) {
    const { toast } = useToast();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phoneNumber: "",
            role: "reporter",
            preferredContactMethod: "email",
        },
    });

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const [userToEdit, authUser] = await Promise.all([
                getUserById(params.id),
                getAuthenticatedUser()
            ]);
            setUser(userToEdit);
            setCurrentUser(authUser);
            setIsLoading(false);

             if (userToEdit) {
                form.reset({
                    name: userToEdit.name,
                    email: userToEdit.email,
                    phoneNumber: userToEdit.phoneNumber || "",
                    role: userToEdit.role,
                    preferredContactMethod: userToEdit.preferredContactMethod || "email",
                });
            }
        }
        fetchData();
    }, [params.id, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            if (!response.ok) throw new Error("Failed to update user");

            toast({
                title: "User Updated",
                description: `${values.name}'s profile has been successfully updated.`,
            });
            router.push("/admin");
        } catch (error) {
            console.error(error);
             toast({
                variant: "destructive",
                title: "Update Failed",
                description: "Could not update user.",
            });
        }
    }

    if (isLoading) {
        return <Skeleton className="h-96 w-full" />;
    }
    
    if (!user) {
        return <div>User not found.</div>
    }


    const availableRoles: UserRole[] = currentUser?.role === 'admin' 
        ? ["admin", "rc_staff", "police", "reporter", "finder"]
        : ["reporter", "finder"];

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Edit User</CardTitle>
                        <CardDescription>Make changes to the user's profile below.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="name@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input type="tel" placeholder="123-456-7890" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {availableRoles.map(role => (
                                        <SelectItem key={role} value={role} className="capitalize">
                                            {role.replace('_', ' ')}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="preferredContactMethod"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>Preferred Contact Method</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-row space-x-4"
                                    >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="email" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Email</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="phone" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Phone</FormLabel>
                                    </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <div className="flex justify-end gap-2 w-full">
                            <Button variant="outline" asChild><Link href="/admin">Cancel</Link></Button>
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}
