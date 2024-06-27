"use client";

import Profile from "@/components/Profile";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function UserProfile({ 
    params 
}: {
    params: { id: number}
}) {
    const searchParams = useSearchParams();
    const userName = searchParams.get("name") || "";

    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(new URL(`/api/v1/post/all/user/${params?.id}`, baseUrl), {
                    method: "GET",
                    cache: "no-cache",
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const responseData = await response.json();
                setUserPosts(responseData);
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        if (params?.id) {
            fetchPosts();
        }
      }, [params.id]);

    return (
        <Profile
            name={userName}
            desc={`Welcome to ${userName}'s personalized profile page. Explore ${userName}'s exceptional prompts and be inspired by the power of their imagination`}
            data={userPosts}
            handleEdit={() => {}}
            handleDelete={() => {}}
        />
    );
}
