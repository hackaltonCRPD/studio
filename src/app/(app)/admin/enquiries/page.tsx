
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getEnquiries, getUsers } from "@/lib/data";
import { EnquiriesClient } from "./enquiries-client";

export default async function AdminEnquiriesPage() {
  const [initialEnquiries, users] = await Promise.all([
    getEnquiries(),
    getUsers(),
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Enquiries</CardTitle>
        <CardDescription>
          Review and manage enquiries submitted by users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EnquiriesClient initialEnquiries={initialEnquiries} users={users} />
      </CardContent>
    </Card>
  );
}
