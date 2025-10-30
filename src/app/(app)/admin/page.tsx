

"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, SlidersHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import type { User, UserStatus, UserRole } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";


export function UserTable({ initialUsers }: { initialUsers: User[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const { toast } = useToast();
  
  const [credibilityFilter, setCredibilityFilter] = useState<[number, number]>([0, 100]);
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">(searchParams.get('status') as UserStatus | 'all' || "all");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">(searchParams.get('role') as UserRole | 'all' || "all");

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const credibilityMatch = user.credibilityScore >= credibilityFilter[0] && user.credibilityScore <= credibilityFilter[1];
      const statusMatch = statusFilter === "all" || user.status === statusFilter;
      const roleMatch = roleFilter === "all" || user.role === roleFilter;
      return credibilityMatch && statusMatch && roleMatch;
    });
  }, [users, credibilityFilter, statusFilter, roleFilter]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  const handleUserStatusChange = async (userId: string, newStatus: UserStatus) => {
    try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });
        if (!response.ok) throw new Error("Failed to update user status");

        const updatedUser = await response.json();
        setUsers(users.map(u => u.id === userId ? { ...u, status: updatedUser.status } : u));
        toast({
            title: "User Updated",
            description: `User has been ${newStatus}.`,
        });
    } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: "Could not update user status.",
        });
    }
  };

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
  
  const userRoles: UserRole[] = ["admin", "rc_staff", "police", "reporter", "finder"];
  const userStatuses: UserStatus[] = ["active", "suspended", "archived"];
  
  // This is a client component, so we can't use async/await in the main body.
  // Instead, we use a client-side navigation.
  const handleFilterChange = () => {
    const params = new URLSearchParams(searchParams);
    if (statusFilter !== 'all') {
      params.set('status', statusFilter);
    } else {
      params.delete('status');
    }
    if (roleFilter !== 'all') {
      params.set('role', roleFilter);
    } else {
      params.delete('role');
    }
    router.push(`/admin?${params.toString()}`);
  };


  return (
    <Table>
        <TableHeader>
        <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="w-[250px]">Credibility / Fraud Risk</TableHead>
            <TableHead>
            <span className="sr-only">Actions</span>
            </TableHead>
        </TableRow>
        </TableHeader>
        <TableBody>
        {filteredUsers.map((user) => (
            <TableRow key={user.id} className={user.status === 'archived' ? 'opacity-50' : ''}>
            <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person face" />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <Link href={`/admin/users/${user.id}`} className="hover:underline font-semibold">{user.name}</Link>
                </div>
            </TableCell>
            <TableCell>
                <Badge variant="outline" className="capitalize">{user.role.replace('_', ' ')}</Badge>
            </TableCell>
            <TableCell>
                <Badge variant={getStatusVariant(user.status)} className="capitalize">{user.status}</Badge>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                <span className="font-medium">{user.credibilityScore}%</span>
                <Progress value={user.credibilityScore} className="h-2 w-24" indicatorClassName={getFraudBarColor(user.credibilityScore)} />
                </div>
            </TableCell>
            <TableCell>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost" disabled={user.status === 'archived'}>
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <Link href={`/admin/users/${user.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                    <Link href={`/admin/users/${user.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUserStatusChange(user.id, user.status === 'suspended' ? 'active' : 'suspended')}>
                    {user.status === 'suspended' ? 'Un-suspend' : 'Suspend'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => handleUserStatusChange(user.id, 'archived')}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Archive
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
            </TableRow>
        ))}
        </TableBody>
    </Table>
  );
}
