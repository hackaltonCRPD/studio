
'use client';
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
import { useEffect, useState } from "react";

export default function AdminEnquiriesPage() {
  const [enquiryItems, setEnquiryItems] = useState<Enquiry[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getEnquiries(), getUsers()]).then(([enquiries, userList]) => {
      setEnquiryItems(enquiries);
      setUsers(userList);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading enquiries...</div>
  }

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
