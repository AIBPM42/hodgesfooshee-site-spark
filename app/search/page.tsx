"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function PaginationControls() {
  const params = useSearchParams();
  const router = useRouter();
  const page = Number(params.get("page") || "1");

  const goToPage = (newPage: number) => {
    const query = new URLSearchParams(params);
    query.set("page", String(newPage));
    router.push(`/search?${query.toString()}`);
  };

  return (
    <div>
      <button disabled={page <= 1} onClick={() => goToPage(page - 1)}>← Prev</button>
      <span>Page {page}</span>
      <button onClick={() => goToPage(page + 1)}>Next →</button>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <PaginationControls />
    </Suspense>
  );
}
