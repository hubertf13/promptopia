"use client";

import { useState, useEffect } from "react";

import Profile from "@components/Profile";
import { useAuth } from "@components/AuthProvider";
import { useRouter } from "next/router";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function MyProfile() {
    const auth = useAuth();
    const router = useRouter();

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch(new URL(`/api/v1/post/all/user/${auth.userId}`, baseUrl), {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                    "Content-Type": "application/json",
                },
                cache: "no-cache",
            }).then((res) => res.json());

            setPosts(response);
        };

        if (auth.isUserLoggedIn) {
            fetchPosts();
        }
    });

    const handleEdit = (post: {
        id: number,
        user: {
          id: number,
          username: string,
          email: string
        },
        prompt: string,
        tag: string,
      }) => {
        router.push(`/update-prompt?id=${post.id}`)
        
    };

    const handleDelete = async (post: {
        id: number,
        user: {
          id: number,
          username: string,
          email: string
        },
        prompt: string,
        tag: string,
      }) => {

      };

    return (
        <Profile
            name="My"
            desc="Welcome to your personalized profile page"
            data={posts}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
        />
    );
}
