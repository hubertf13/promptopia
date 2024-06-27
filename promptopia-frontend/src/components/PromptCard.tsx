"use client"

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "./AuthProvider";
import { usePathname, useRouter } from "next/navigation";
import { CircleUserRound } from "lucide-react";

export default function PromptCard({ post, handleTagClick, handleEdit, handleDelete }: {
  post: {
    id: number,
    user: {
      id: number,
      username: string,
      email: string
    },
    prompt: string,
    tag: string,
  },
  handleTagClick: (tag: string) => void,
  handleEdit: () => void,
  handleDelete: () => void,
}) {
  const auth = useAuth();
  const pathName = usePathname();
  const router = useRouter();
  const [copied, setCopied] = useState("");

  const handleProfileClick = () => {
    if (post.user.id === auth.userId)
      return router.push("/profile");

    router.push(`/profile/${post.user.id}?name=${post.user.username}`);
  };

  const handleCopy = () => {
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(""), 3000);
  }

  return (
    <div className="prompt_card">
      <div className="flex justify-between items-start gap-5">
        <div
          className="flex-1 flex justify-start items-center gap-3 cursor-pointer"
          onClick={handleProfileClick}
        >
          <CircleUserRound
            width={40}
            height={40}
            className="rounded-full object-contain"
          />

          <div className="flex flex-col">
            <h3 className="font-satoshi font-semibold text-gray-900">
              {post.user.username}
            </h3>
            <p className="font-inter text-sm text-gray-500">
              {post.user.email}
            </p>
          </div>
        </div>

        <div className="copy_btn" onClick={handleCopy}
        >
          <Image
            src={copied == post.prompt
              ? '/assets/icons/tick.svg'
              : '/assets/icons/copy.svg'
            }
            width={12}
            height={12}
            alt="Copy"
          />
        </div>
      </div>

      <p className="my-4 font-satoshi text-sm text-gray-700">{post.prompt}</p>
      <p className="font-inter text-sm blue_gradient cursor-pointer"
        onClick={() => handleTagClick && handleTagClick(post.tag)}
      >
        #{post.tag}
      </p>

      {auth?.userId === post.user.id &&
        pathName === '/profile' && (
          <div className="mt-5 flex-center gap-4 border-t border-gray-100 pt-3">
            <p
              className="font-inter text-sm green_gradient cursor-pointer"
              onClick={handleEdit}
            >
              Edit
            </p>
            <p
              className="font-inter text-sm orange_gradient cursor-pointer"
              onClick={handleDelete}
            >
              Delete
            </p>
          </div>
        )}
    </div>
  )
}
