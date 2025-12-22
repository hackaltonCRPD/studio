
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EnquiriesClient } from "./enquiries-client";
import type { Enquiry, User } from "@/lib/types";

const API_URL = process.env.API_URL_INTERNAL;

async function getEnquiries(): Promise<Enquiry[]> {
    try {
        const response = await fetch(`${API_URL}/enquiries`);
        if (!response.ok) {
            console.error('Failed to fetch enquiries', await response.text());
            return [];
        }
        const data = await response.json();
        return data.map((e: any) => ({ ...e, id: e._id.toString() }));
    } catch (error) {
        console.error('Error fetching enquiries:', error);
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

    