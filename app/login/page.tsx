import { redirect } from "next/navigation";

type LoginPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = Array.isArray(params.next) ? params.next[0] : params.next;
  const query = new URLSearchParams({ type: "member", mode: "signin" });
  if (nextPath) query.set("next", nextPath);
  redirect(`/sign-up?${query.toString()}`);
}
