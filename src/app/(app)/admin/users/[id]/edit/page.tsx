
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { users } from "@/lib/data";
import { notFound, useRouter } from "next/navigation";
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

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  role: z.enum(["reporter", "finder", "rc_staff", "police", "admin"]),
});

export default function EditUserPage({ params }: { params: { id: string } }) {
    const user = users.find(u => u.id === params.id);
    const { toast } = useToast();
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        getAuthenticatedUser().then(setCurrentUser);
    }, []);

    if (!user) {
        notFound();
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Updated user data:", values);
        // Here you would typically call an API to update the user data.
        // For now, we'll just show a success toast.
        toast({
            title: "User Updated",
            description: `${values.name}'s profile has been successfully updated.`,
        });
        router.push("/admin");
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
