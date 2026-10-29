import { redirect } from "next/navigation";

type SignInPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const nextPath = Array.isArray(params.next) ? params.next[0] : params.next;
  const query = new URLSearchParams({ type: "member", mode: "signin" });
  if (nextPath) query.set("next", nextPath);
  redirect(`/sign-up?${query.toString()}`);
}
