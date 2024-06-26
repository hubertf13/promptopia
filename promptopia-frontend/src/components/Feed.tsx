"use client"

import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const PromptCardList = ({ data, handleTagClick }: {
  data: never[],
  handleTagClick: () => void
}) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post: {
        id: number,
        user: {
          id: number,
          username: string,
          email: string
        },
        prompt: string,
        tag: string,
      }) => (
        <PromptCard
          key={post.id}
          post={post}
          handleTagClick={handleTagClick}
          handleEdit={() => {}}
          handleDelete={() => {}}
        />
      ))}
    </div>
  )
}

export default function Feed() {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);

  const handleSearchChange = () => {

  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(new URL("/api/v1/post/all", baseUrl), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      }).then(res => res.json());

      setPosts(response)
    }

    fetchPosts();
  }, []);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      <PromptCardList
        data={posts}
        handleTagClick={() => { }}
      />
    </section>
  )
}
