"use client";

import { useState, useEffect } from "react";

import Profile from "@/components/Profile";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

type Post = {
    id: number,
    user: {
      id: number,
      username: string,
      email: string
    },
    prompt: string,
    tag: string,
  }

export default function MyProfile() {
    const auth = useAuth();
    const router = useRouter();

    const [myPosts, setMyPosts] = useState([]);

    useEffect(() => {
        if (!auth.isUserLoggedIn && !auth.isLoading) {
            router.push("/login");
        }
    }, [auth.isUserLoggedIn, auth.isLoading, router]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(new URL(`/api/v1/post/all/user/${auth.userId}`, baseUrl), {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`
                    },
                    cache: "no-cache",
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const responseData = await response.json();
                setMyPosts(responseData);
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        if (auth.isUserLoggedIn) {
            fetchPosts();
        }
    }, [auth.isUserLoggedIn, auth.userId]);

    const handleEdit = (post: Post) => {
        router.push(`/update-prompt?id=${post.id}`)
    };

    const handleDelete = async (post: Post) => {
        const hasConfirmed = confirm("Are you sure you want to delete this prompt?");

        if (hasConfirmed) {
            try {
                await fetch(new URL(`/api/v1/post/delete/${post.id}`, baseUrl), {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`
                    },
                    cache: "no-cache",
                });

                const filteredPosts = myPosts.filter((p: Post) => p.id !== post.id)
                setMyPosts(filteredPosts);

            } catch (error) {
                console.error('Fetch error:', error);
            }
        }
    };

    if (auth.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {!auth.isUserLoggedIn ? null 
            : <Profile
                name="My"
                desc="Welcome to your personalized profile page"
                data={myPosts}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />}
        </>
    );
}
