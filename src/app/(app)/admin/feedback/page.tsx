
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getFeedbacks, getUsers } from "@/lib/data";
import { FeedbackClient } from "./feedback-client";
import { useEffect, useState } from "react";
import type { Feedback, User } from "@/lib/types";

export default function AdminFeedbackPage() {
  const [feedbackItems, setFeedbackItems] = useState<Feedback[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getFeedbacks(), getUsers()]).then(([feedback, userList]) => {
      setFeedbackItems(feedback);
      setUsers(userList);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading feedback...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Feedback</CardTitle>
        <CardDescription>
          Review and manage feedback submitted by users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FeedbackClient initialFeedback={feedbackItems} users={users} />
      </CardContent>
    </Card>
  );
}
