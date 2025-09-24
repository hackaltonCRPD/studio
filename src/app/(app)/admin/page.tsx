
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
import { users as initialUsers } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useState, useMemo } from "react";
import type { User, UserStatus, UserRole } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function AdminPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const { toast } = useToast();
  const [credibilityFilter, setCredibilityFilter] = useState<[number, number]>([0, 100]);
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");

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

  const handleUserStatusChange = (userId: string, newStatus: UserStatus) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    toast({
      title: "User Updated",
      description: `User has been ${newStatus}.`,
    });
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                View and manage all users in the system.
                </CardDescription>
            </div>
             <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-auto gap-1.5 text-sm">
                        <SlidersHorizontal className="h-4 w-4" />
                        Filter
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Filters</h4>
                            <p className="text-sm text-muted-foreground">
                                Adjust the filters to refine your search.
                            </p>
                        </div>
                        <div className="grid gap-2">
                             <Label>Status</Label>
                             <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as UserStatus | "all")}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    {userStatuses.map(status => (
                                        <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="grid gap-2">
                             <Label>Role</Label>
                              <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as UserRole | "all")}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    {userRoles.map(role => (
                                        <SelectItem key={role} value={role} className="capitalize">
                                            {role.replace('_', ' ')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Credibility Score</Label>
                             <div className="flex items-center gap-4">
                                <span>{credibilityFilter[0]}%</span>
                                <Slider
                                    defaultValue={[0, 100]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={(value) => setCredibilityFilter(value as [number, number])}
                                />
                                <span>{credibilityFilter[1]}%</span>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
      </CardHeader>
      <CardContent>
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
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
