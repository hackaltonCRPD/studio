
"use client";

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
import Link from "next/link";
import { useState } from "react";
import type { Feedback, User as UserType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FeedbackClientProps {
    initialFeedback: Feedback[];
    users: UserType[];
}

export function FeedbackClient({ initialFeedback, users }: FeedbackClientProps) {
  const [feedbackItems, setFeedbackItems] = useState<Feedback[]>(initialFeedback);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const { toast } = useToast();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  const handleStatusChange = async (id: string, newStatus: "open" | "resolved") => {
    try {
        const response = await fetch(`http://localhost:5000/api/feedback/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });
        if (!response.ok) throw new Error("Failed to update status");

        setFeedbackItems(feedbackItems.map(f => f.id === id ? { ...f, status: newStatus } : f));
        toast({
            title: "Feedback Updated",
            description: `Feedback has been marked as ${newStatus}.`,
        });
    } catch(error) {
         toast({
            variant: "destructive",
            title: "Update Failed",
            description: "Could not update feedback status.",
        });
    }
  };

  return (
    <>
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
          {feedbackItems.map((item) => {
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
                      <div className="font-medium">Unknown User</div>
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
                      <DropdownMenuItem onSelect={() => setSelectedFeedback(item)}>
                          View Message
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
      {selectedFeedback && (
         <Dialog open={!!selectedFeedback} onOpenChange={(isOpen) => !isOpen && setSelectedFeedback(null)}>
            <DialogContent className="sm:max-w-[425px] bg-card/80 backdrop-blur-sm">
                <DialogHeader>
                    <DialogTitle>{selectedFeedback.subject}</DialogTitle>
                    <DialogDescription>
                        From: {users.find(u => u.id === selectedFeedback.userId)?.name || 'Unknown User'} on {new Date(selectedFeedback.date).toLocaleDateString()}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p>{selectedFeedback.message}</p>
                </div>
            </DialogContent>
        </Dialog>
      )}
    </>
  );
}
