
"use client";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { MoreHorizontal, User, CheckCircle } from "lucide-react";
import { getEnquiries, getUsers } from "@/lib/data";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { Enquiry, User as UserType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminEnquiriesPage() {
  const [enquiryItems, setEnquiryItems] = useState<Enquiry[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
        const [enquiriesData, usersData] = await Promise.all([getEnquiries(), getUsers()]);
        setEnquiryItems(enquiriesData);
        setUsers(usersData);
    }
    fetchData();
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  const handleStatusChange = async (id: string, newStatus: "open" | "resolved") => {
    try {
        const response = await fetch(`http://localhost:5000/api/enquiries/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });
        if (!response.ok) throw new Error("Failed to update status");
        
        setEnquiryItems(enquiryItems.map(e => e.id === id ? { ...e, status: newStatus } : e));
        toast({
        title: "Enquiry Updated",
        description: `Enquiry has been marked as ${newStatus}.`,
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: "Could not update enquiry status.",
        });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>User Enquiries</CardTitle>
          <CardDescription>
            Review and manage enquiries submitted by users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enquiryItems.map((item) => {
                const user = users.find(u => u.id === item.userId);
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      {user ? (
                          <div className="flex items-center gap-3">
                              <Avatar className="hidden h-9 w-9 sm:flex">
                                  <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person face" />
                                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                              </Avatar>
                              <div className="font-medium">{user.name}</div>
                          </div>
                      ) : (
                          <div className="font-medium">{item.email}</div> // Fallback to email if user not found
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{item.subject}</TableCell>
                    <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'resolved' ? 'default' : 'secondary'} className="capitalize">{item.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => setSelectedEnquiry(item)}>
                              View Question
                          </DropdownMenuItem>
                          {user && 
                              <DropdownMenuItem asChild>
                                  <Link href={`/admin/users/${user.id}`}>
                                      <User className="mr-2 h-4 w-4" />
                                      View User
                                  </Link>
                              </DropdownMenuItem>
                          }
                          <DropdownMenuSeparator />
                          {item.status !== 'resolved' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(item.id, 'resolved')}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark as Resolved
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedEnquiry && (
         <Dialog open={!!selectedEnquiry} onOpenChange={(isOpen) => !isOpen && setSelectedEnquiry(null)}>
            <DialogContent className="sm:max-w-[425px] bg-card/80 backdrop-blur-sm">
                <DialogHeader>
                    <DialogTitle>{selectedEnquiry.subject}</DialogTitle>
                    <DialogDescription>
                        From: {users.find(u => u.id === selectedEnquiry.userId)?.name || selectedEnquiry.email} on {new Date(selectedEnquiry.date).toLocaleDateString()}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p>{selectedEnquiry.question}</p>
                </div>
            </DialogContent>
        </Dialog>
      )}
    </>
  );
}
