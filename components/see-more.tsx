"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function SeeMore({
  path,
  limit,
}: { path?: string; limit?: string; totalItems?: number }) {
  const router = useRouter();

  const handleClick = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(limit);
    params.set("limit", (Number(limit?.trim() || 0) + 10).toString() || "10");
    router.push(`/${path}?${params.toString()}`);
  };

  return <Button onClick={handleClick}>Ver mais</Button>;
}
