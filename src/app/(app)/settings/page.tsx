
import { getAuthenticatedUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import { EditProfileForm } from "./edit-profile-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


export default async function SettingsPage() {
    const user = await getAuthenticatedUser();
    
    if (!user) {
        notFound();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your account settings and profile information.</CardDescription>
            </CardHeader>
            <CardContent>
                <EditProfileForm user={user} />
            </CardContent>
        </Card>
    );
}
