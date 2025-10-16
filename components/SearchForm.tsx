"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

const schema = z.object({
  city: z.string(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  beds: z.string().optional(),
  baths: z.string().optional(),
});

export default function SearchForm() {
  const router = useRouter();
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: any) => {
    const query = new URLSearchParams(data).toString();
    router.push(`/search?${query}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("city")} placeholder="City" />
      <input {...register("minPrice")} placeholder="Min Price" />
      <input {...register("maxPrice")} placeholder="Max Price" />
      <input {...register("beds")} placeholder="Beds" />
      <input {...register("baths")} placeholder="Baths" />
      <button type="submit">Search</button>
    </form>
  );
}
