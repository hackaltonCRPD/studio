
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/firebase/auth/use-user";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Edit } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
      return <div>Loading profile...</div>;
  }

  if (!user) {
    redirect("/login");
  }
  
  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '';
  }

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person face" />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
            <CardTitle className="text-3xl">{user.name}</CardTitle>
            <CardDescription className="capitalize text-lg">{user.role.replace('_', ' ')}</CardDescription>
        </div>
        <Button variant="outline" asChild>
            <Link href="/settings">
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
             <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="flex items-center gap-2"> <Mail className="h-4 w-4" /> {user.email}</p>
            </div>
             <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {user.phoneNumber || 'Not provided'}</p>
            </div>
            <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Preferred Contact</p>
                <p className="capitalize">{user.preferredContactMethod || 'Not set'}</p>
            </div>
             <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={user.status === 'active' ? 'default' : 'destructive'} className="capitalize">{user.status}</Badge>
            </div>
        </div>
      </CardContent>
       <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
        Member since {format(new Date(user.createdAt), "PPP")}
      </CardFooter>
    </Card>
  );
}
