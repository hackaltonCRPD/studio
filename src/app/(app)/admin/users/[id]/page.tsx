
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserById } from "@/lib/data";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import type { User, UserStatus } from "@/lib/types";
import { ArrowLeft, Edit, FileText, Mail, Phone } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";


export default function UserDetailsPage({ params }: { params: { id: string } }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserById(params.id).then(userData => {
            setUser(userData);
            setLoading(false);
        });
    }, [params.id]);

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) {
        notFound();
    }
    
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    const getStatusVariant = (status: UserStatus) => {
        switch (status) {
        case 'active':
            return 'default';
        case 'suspended':
            return 'secondary';
        case 'archived':
            return 'destructive';
        default:
            return 'outline';
        }
    }

    const getFraudBarColor = (score: number) => {
        if (score > 75) return "bg-green-500";
        if (score > 40) return "bg-yellow-500";
        return "bg-red-500";
    }

    return (
        <div className="space-y-6">
             <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                  <Link href="/admin">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                  </Link>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    User Details
                </h1>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                    <Button variant="outline" size="sm" asChild>
                       <Link href={`/admin/users/${user.id}/edit`}>
                            <Edit className="h-4 w-4" />
                            Edit
                       </Link>
                    </Button>
                </div>
            </div>
            <Card>
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4">
                     <Avatar className="h-20 w-20">
                        <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person face" />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <CardTitle className="text-3xl">{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                         {user.phoneNumber && <CardDescription>{user.phoneNumber}</CardDescription>}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                             <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Role</h3>
                                <Badge variant="outline" className="capitalize text-base">{user.role.replace('_', ' ')}</Badge>
                             </div>
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                                <Badge variant={getStatusVariant(user.status)} className="capitalize text-base">{user.status}</Badge>
                             </div>
                             <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">User ID</h3>
                                <p className="text-sm font-mono">{user.id}</p>
                             </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Credibility / Fraud Risk</h3>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-lg">{user.credibilityScore}%</span>
                                    <Progress value={user.credibilityScore} className="h-3 w-32" indicatorClassName={getFraudBarColor(100 - user.credibilityScore)} />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Lower score indicates higher risk.</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Member Since</h3>
                                <p className="text-sm">{format(new Date(user.createdAt), "PPP")}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Preferred Contact Method</h3>
                                <div className="flex items-center gap-2 text-sm">
                                    {user.preferredContactMethod === "email" ? <Mail className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                                    <span className="capitalize">{user.preferredContactMethod || "Not set"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t pt-6">
                    <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/users/${user.id}/activity`}>
                            <FileText className="h-4 w-4" />
                            View Activity Log
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
