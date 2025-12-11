"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/config/Appwriteconfig";
import { useAuth } from "@/hooks/Authcontext";

export default function OAuthSuccess() {
  const router = useRouter();
  const { checkSession } = useAuth();
  const [message, setMessage] = useState("Finishing login...");

  useEffect(() => {
    let retries = 0;

    const checkOAuthSession = async () => {
      try {
        const user = await account.get();  // WILL FAIL first few tries
        await checkSession();

        // Optional: check onboarding data if you store it in DB
        router.push("/onboarding");
      } catch (err) {
        if (retries < 5) {
          retries++;
          setMessage(`Verifying session... (${retries})`);
          // wait 500ms and try again
          setTimeout(checkOAuthSession, 500);
        } else {
          console.error(err);
          setMessage("Failed to authenticate. Redirecting...");
          router.push("/login");
        }
      }
    };

    checkOAuthSession();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-[#3A0A21] text-sm">{message}</p>
    </div>
  );
}
