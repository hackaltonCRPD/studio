
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getEnquiries, getUsers } from "@/lib/data";
import type { Enquiry, User as UserType } from "@/lib/types";
import { EnquiriesClient } from "./enquiries-client";

export default async function AdminEnquiriesPage() {
  const [enquiryItems, users] = await Promise.all([getEnquiries(), getUsers()]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Enquiries</CardTitle>
        <CardDescription>
          Review and manage enquiries submitted by users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EnquiriesClient initialEnquiries={enquiryItems} users={users} />
      </CardContent>
    </Card>
  );
}
