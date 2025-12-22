
import { EditUserForm } from "./edit-user-form";
import { notFound } from "next/navigation";
import type { User } from "@/lib/types";
import { getAuthenticatedUser } from "@/lib/auth";

const API_URL = process.env.API_URL_INTERNAL;

async function getUserById(id: string): Promise<User | null> {
    try {
        const response = await fetch(`${API_URL}/users/${id}`);
        if (!response.ok) return null;
        const data = await response.json();
        return { ...data, id: data._id.toString() };
    } catch (error) {
        console.error(`Error fetching user ${id}:`, error);
        return null;
    }
}

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

    