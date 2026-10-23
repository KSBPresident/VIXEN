import { Storefront } from "@/components/store/storefront";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "VIXEN Store",
  description: "Browse real VIXEN store listings when verified inventory becomes available.",
};

export default function StorePage() {
  return <Storefront />;
}
