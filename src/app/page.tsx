"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { RouterURLs } from "@/util/constanst";
import SignIn from "./(auth)/sign-in/page";

export default function Home() {
  useEffect(() => {
    redirect(RouterURLs.signIn);
  }, []);
  return (
    <div>
      <SignIn />
    </div>
  );
}
