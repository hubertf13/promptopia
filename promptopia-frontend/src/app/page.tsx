"use client"

import { Button } from "@/components/ui/button";

export default function Home() {

  const checkFetch = async () => {

    const token = '';
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/demo-controller", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      console.log('Network response was not ok');
    }
    const data = await response.text();
    console.log(data);
  };

  return (
    <>
      <h1>Welcome Home!</h1>
      <Button onClick={checkFetch}>Click me!</Button>
    </>
  )
}