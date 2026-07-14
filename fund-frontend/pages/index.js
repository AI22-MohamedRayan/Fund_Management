import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const router = useRouter();
  const { ready, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!ready) return;
    router.replace(isAuthenticated ? "/funds" : "/login");
  }, [ready, isAuthenticated, router]);

  return null;
}
