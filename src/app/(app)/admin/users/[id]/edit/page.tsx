import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { users } from "@/lib/data";
import { notFound } from "next/navigation";

export default function EditUserPage({ params }: { params: { id: string } }) {
    const user = users.find(u => u.id === params.id);

    if (!user) {
        notFound();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit User</CardTitle>
                <CardDescription>Editing user: {user.name}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>This is where the form to edit the user will go.</p>
            </CardContent>
        </Card>
    )
}