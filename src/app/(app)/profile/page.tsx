import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your user profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is your profile page. More content will be added here.</p>
      </CardContent>
    </Card>
  );
}