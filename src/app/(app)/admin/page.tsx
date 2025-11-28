
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
import type { User, UserStatus, UserRole } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUsers } from "@/lib/data";
import { UserTable } from "./user-table-client";


export default async function AdminPage({ searchParams }: { searchParams?: { status?: UserStatus | 'all', role?: UserRole | 'all' } }) {
    const initialUsers = await getUsers({
      status: searchParams?.status || 'all',
      role: searchParams?.role || 'all',
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                View, manage, and edit all users in the system.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <UserTable initialUsers={initialUsers} />
            </CardContent>
        </Card>
    )
}
