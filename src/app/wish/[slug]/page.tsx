import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import WishExperience from "@/components/experience/WishExperience";

export default async function WishPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  console.log("Loading wish with slug:", slug);

  const supabase = createClient();

  const { data, error } = await supabase
    .from("wishes")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("SUPABASE ERROR:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });

    notFound();
  }

  if (!data) {
    console.error("No wish found for slug:", slug);
    notFound();
  }

  return <WishExperience wish={data} />;
}