
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FeedbackClient } from "./feedback-client";
import type { Feedback, User } from "@/lib/types";

const API_URL = process.env.API_URL_INTERNAL;

async function getFeedbacks(): Promise<Feedback[]> {
    try {
        const response = await fetch(`${API_URL}/feedback`);
        if (!response.ok) {
            console.error('Failed to fetch feedback', await response.text());
            return [];
        }
        const data = await response.json();
        return data.map((f: any) => ({ ...f, id: f._id.toString() }));
    } catch (error) {
        console.error('Error fetching feedback:', error);
        return [];
    }
}

async function getUsers(): Promise<User[]> {
    try {
        const response = await fetch(`${API_URL}/users`);
        if (!response.ok) {
            console.error('Failed to fetch users', await response.text());
            return [];
        }
        const data = await response.json();
        return data.map((user: any) => ({ ...user, id: user._id.toString() }));
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

export default async function AdminFeedbackPage() {
  const [initialFeedback, users] = await Promise.all([
    getFeedbacks(),
    getUsers(),
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Feedback</CardTitle>
        <CardDescription>
          Review and manage feedback submitted by users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FeedbackClient initialFeedback={initialFeedback} users={users} />
      </CardContent>
    </Card>
  );
}

    