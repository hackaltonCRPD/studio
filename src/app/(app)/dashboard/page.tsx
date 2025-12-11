

import {
  Activity,
  CreditCard,
  FileText,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
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
import { getDocuments, getUsers } from "@/lib/data";
import { getAuthenticatedUser } from "@/lib/auth";
import type { DocumentReport, User } from "@/lib/types";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    redirect('/login');
  }
  
  if (user.role === 'rc_staff') redirect('/rc-staff/dashboard');
  if (user.role === 'police') redirect('/police/dashboard');

  const [documents, allUsers] = await Promise.all([
    getDocuments(),
    user.role === 'admin' ? getUsers() : Promise.resolve([])
  ]);
  
  const recentReports = documents.slice(0, 5);
  const isAdmin = user.role === 'admin';

  if (isAdmin) {
    const activeUsers = allUsers.filter(u => u.status === 'active').length;
    const avgCredibility = allUsers.length > 0 
        ? Math.round(allUsers.reduce((acc, u) => acc + u.credibilityScore, 0) / allUsers.length) 
        : 0;

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <Link href="/admin">
                <Card className="hover:bg-muted/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">{allUsers.length}</div>
                    <p className="text-xs text-muted-foreground">+5 since last month</p>
                    </CardContent>
                </Card>
                </Link>
                <Link href="/admin?status=active">
                <Card className="hover:bg-muted/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">{activeUsers}</div>
                     <p className="text-xs text-muted-foreground">{allUsers.length > 0 ? `${Math.round((activeUsers / allUsers.length) * 100)}% of total users` : 'N/A'}</p>
                    </CardContent>
                </Card>
                </Link>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Credibility</CardTitle>
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{avgCredibility}%</div>
                    <p className="text-xs text-muted-foreground">-1.2% from last week</p>
                </CardContent>
                </Card>
                 <Link href="/documents/search">
                    <Card className="hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Reports
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                        <div className="text-2xl font-bold">{documents.length}</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
            <Card>
                <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>
                    A list of the most recently reported documents.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Document Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Date</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {recentReports.map((doc: DocumentReport) => (
                        <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.documentType}</TableCell>
                        <TableCell>
                            <Badge variant={doc.status === 'lost' ? 'destructive' : doc.status === 'found' ? 'secondary' : 'default'} className="capitalize">{doc.status}</Badge>
                        </TableCell>
                        <TableCell>{doc.location}</TableCell>
                        <TableCell>{new Date(doc.reportDate).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </div>
    )
  }

  const foundDocuments = documents.filter(d => d.status === 'found').length;
  const claimedDocuments = documents.filter(d => d.status === 'claimed').length;
  const matchRate = documents.length > 0 ? (claimedDocuments / documents.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Link href="/documents/search">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Reports
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents.length}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/documents/search?status=found">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents Found</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{foundDocuments}</div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/documents/search?status=claimed">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents Claimed</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{claimedDocuments}</div>
              <p className="text-xs text-muted-foreground">+19% from last month</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/match-finder">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Match Rate</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{matchRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">+2.1% since last week</p>
            </CardContent>
          </Card>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            A list of the most recently reported documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReports.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.documentType}</TableCell>
                  <TableCell>
                    <Badge variant={doc.status === 'lost' ? 'destructive' : doc.status === 'found' ? 'secondary' : 'default'} className="capitalize">{doc.status}</Badge>
                  </TableCell>
                  <TableCell>{doc.location}</TableCell>
                  <TableCell>{new Date(doc.reportDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
