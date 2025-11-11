
import { getUserById } from "@/lib/data";
import { getAuthenticatedUser } from "@/lib/auth";
import { EditUserForm } from "./edit-user-form";
import { notFound } from "next/navigation";

export default async function EditUserPage({ params }: { params: { id: string } }) {
    const [userToEdit, currentUser] = await Promise.all([
        getUserById(params.id),
        getAuthenticatedUser()
    ]);
    
    if (!userToEdit || !currentUser) {
        notFound();
    }

    return <EditUserForm userToEdit={userToEdit} currentUser={currentUser} />;
}
