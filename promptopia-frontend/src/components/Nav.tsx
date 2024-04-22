"use client";

import Link from "next/link";
import Image from "next/image";
import { CircleUserRound, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { useAuth } from "./AuthProvider";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Nav() {
    const auth = useAuth();

    const logOut = async () => {

        await fetch(new URL("/api/v1/auth/logout", baseUrl), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            },
            cache: "no-cache",
        });

        localStorage.removeItem("jwt");
        auth.setIsUserLoggedIn(false);
    };

    return (
        <nav className="flex-between w-full mb-16 pt-3">
            <Link href="/" className="flex gap-2 flex-center">
                <Image
                    src="/assets/images/logo.svg"
                    alt="Promptopia Logo"
                    width={30}
                    height={30}
                    className="object-contain"
                />
                <p className="logo_text">Promptopia</p>
            </Link>

            {!auth.isLoading ?
                (<>
                    {/* Desktop Navigation */}
                    <div className="sm:flex hidden">
                        {auth.isUserLoggedIn ? (
                            <div className="flex gap-3 md:gap-5">
                                <Link href="/create-prompt">
                                    <Button>Create Post</Button>
                                </Link>

                                <Button variant="secondary" type="button" onClick={logOut}>
                                    Log Out
                                </Button>

                                <Link href="/profile">
                                    <CircleUserRound
                                        width={37}
                                        height={37}
                                        className="rounded-full"
                                    />
                                </Link>
                            </div>
                        ) : (
                            <>
                                {!auth.isUserLoggedIn &&
                                    <div className="flex gap-3 md:gap-5">
                                        <Link href="/login">
                                            <Button
                                                variant="outline"
                                                type="button"
                                            >
                                                Log In
                                            </Button>
                                        </Link>

                                        <Link href="/register">
                                            <Button
                                                type="button"
                                            >
                                                Register
                                            </Button>
                                        </Link>
                                    </div>
                                }
                            </>
                        )}
                    </div>

                    {/* Mobile Navigation */}
                    <div className="sm:hidden flex relative">
                        {auth.isUserLoggedIn ? (
                            <div className="flex">
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Menu
                                            width={37}
                                            height={37}
                                            className="rounded-full"
                                        />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>
                                            <Link
                                                href="/profile"
                                            >
                                                My Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Link
                                                href="/create-prompt"
                                            >
                                                Create Prompt
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => logOut()}>
                                            Log Out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <>
                                {!auth.isUserLoggedIn &&
                                    <Link href="/login">
                                        <Button
                                            type="button"
                                        >
                                            Log In
                                        </Button>
                                    </Link>
                                }
                            </>
                        )}
                    </div>
                </>) : (
                    <>
                        {/* Desktop Navigation */}
                        <div className="sm:flex hidden">
                            <div className="flex gap-3 md:gap-5">
                                <Skeleton className="h-10 w-[105px]" />
                                <Skeleton className="h-10 w-[80px]" />
                                <Skeleton className="h-10 w-[37px] rounded-full" />
                            </div>
                        </div>

                        {/* Mobile Navigation */}
                        <div className="sm:hidden flex relative">
                            <div className="flex">
                                <Skeleton className="h-10 w-[37px]" />
                            </div>
                        </div>
                    </>
                )
            }
        </nav>
    )
}
