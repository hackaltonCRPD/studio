
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
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Info, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { User, ActivityLog } from "@/lib/types";

const API_URL = process.env.API_URL_INTERNAL;

async function getUserById(id: string): Promise<User | null> {
    try {
        const response = await fetch(`${API_URL}/users/${id}`);
        if (!response.ok) return null;
        const data = await response.json();
        return { ...data, id: data._id.toString() };
    } catch (error) {
        console.error(`Error fetching user ${id}:`, error);
        return null;
    }
}

async function getActivityLogsForUser(userId: string): Promise<ActivityLog[]> {
    try {
        const response = await fetch(`${API_URL}/users/${userId}/activity`);
        if (!response.ok) {
            console.error(`Failed to fetch activity logs for user ${userId}`, await response.text());
            return [];
        }
        const data = await response.json();
        return data.map((log: any) => ({ ...log, id: log._id.toString() }));
    } catch (error) {
        console.error(`Error fetching activity logs for user ${userId}:`, error);
        return [];
    }
}


export default async function ActivityLogPage({ params }: { params: { id: string } }) {
  const [user, logs] = await Promise.all([
    getUserById(params.id),
    getActivityLogsForUser(params.id)
  ]);

  if (!user) {
    notFound();
  }
  
  const getActivityIcon = (activity: string) => {
    if (activity.toLowerCase().includes('login')) return <Clock className="h-4 w-4 text-green-500" />;
    if (activity.toLowerCase().includes('failed')) return <ShieldAlert className="h-4 w-4 text-red-500" />;
    return <Info className="h-4 w-4 text-blue-500" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href={`/admin/users/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="flex-1">
            <h1 className="text-xl font-semibold tracking-tight">
                Activity Log
            </h1>
             <p className="text-sm text-muted-foreground">
                Showing activity for <Link href={`/admin/users/${user.id}`} className="font-medium text-primary hover:underline">{user.name}</Link>
            </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>A log of actions performed by this user.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]"></TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                        <div className="flex items-center justify-center">
                            {getActivityIcon(log.activity)}
                        </div>
                    </TableCell>
                    <TableCell className="font-medium">{log.activity}</TableCell>
                    <TableCell>{log.details || 'N/A'}</TableCell>
                    <TableCell>
                        <Badge variant="outline">{log.ipAddress}</Badge>
                    </TableCell>
                    <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No activity recorded for this user.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

    