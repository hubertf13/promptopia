"use client"

import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const PromptCardList = ({ data, handleTagClick }: {
  data: never[],
  handleTagClick: (tagName: string) => void
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
          handleEdit={() => { }}
          handleDelete={() => { }}
        />
      ))}
    </div>
  )
}

export default function Feed() {
  const [allPosts, setAllPosts] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [searchedResults, setSearchedResults] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(new URL("/api/v1/post/all", baseUrl), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      }).then(res => res.json());

      setAllPosts(response)
    }

    fetchPosts();
  }, []);

  const filterPrompts = (searchtext: string) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return allPosts.filter(
      (item: {
        id: number,
        user: {
          id: number,
          username: string,
          email: string
        },
        prompt: string,
        tag: string,
      }) =>
        regex.test(item.user.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleTagClick = (tagName: string) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  }

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

      {/* All Prompts */}
      {searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList data={allPosts} handleTagClick={handleTagClick} />
      )}
    </section>
  )
}
