
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getFeedbacks, getUsers } from "@/lib/data";
import { FeedbackClient } from "./feedback-client";

export default async function AdminFeedbackPage() {
  const [feedbackItems, users] = await Promise.all([getFeedbacks(), getUsers()]);

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
