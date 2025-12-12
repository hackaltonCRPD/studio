
"use client"

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
import { updateUserStatus } from "@/services/userService";

interface UserTableProps {
  initialUsers: User[];
}

export function UserTable({ initialUsers }: UserTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<User[]>(initialUsers);

  const [credibilityFilter, setCredibilityFilter] = useState<[number, number]>([0, 100]);
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">(searchParams.get('status') as UserStatus | 'all' || "all");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">(searchParams.get('role') as UserRole | 'all' || "all");

  useEffect(() => {
    setUsers(initialUsers)
  }, [initialUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const credibilityMatch = user.credibilityScore >= credibilityFilter[0] && user.credibilityScore <= credibilityFilter[1];
      // Server-side filters are applied via page reload, so client-side filtering is for real-time adjustments
      return credibilityMatch;
    });
  }, [users, credibilityFilter]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  const handleUserStatusChange = async (userId: string, newStatus: UserStatus) => {
    try {
        await updateUserStatus(userId, newStatus);
        setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
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
  
  const handleFilterChange = (filter: 'status' | 'role', value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value !== 'all') {
      params.set(filter, value);
    } else {
      params.delete(filter);
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
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8">
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            Filters
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                       <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Filters</h4>
                            <p className="text-sm text-muted-foreground">Adjust filters to refine results.</p>
                        </div>
                        <div className="grid gap-2">
                             <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="role">Role</Label>
                                <Select defaultValue={roleFilter} onValueChange={(value) => handleFilterChange('role', value)}>
                                    <SelectTrigger id="role" className="col-span-2 h-8">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Roles</SelectItem>
                                        {userRoles.map(role => <SelectItem key={role} value={role} className="capitalize">{role.replace('_', ' ')}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="status">Status</Label>
                                <Select defaultValue={statusFilter} onValueChange={(value) => handleFilterChange('status', value)}>
                                    <SelectTrigger id="status" className="col-span-2 h-8">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        {userStatuses.map(status => <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="grid grid-cols-1 items-center gap-4">
                                <Label>Credibility Range: {credibilityFilter[0]}% - {credibilityFilter[1]}%</Label>
                                <Slider
                                    defaultValue={[0, 100]}
                                    max={100}
                                    step={1}
                                    onValueChange={setCredibilityFilter}
                                />
                            </div>
                        </div>
                       </div>
                    </PopoverContent>
                </Popover>
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
