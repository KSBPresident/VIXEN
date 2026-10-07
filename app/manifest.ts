import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VIXEN — Control Your Power",
    short_name: "VIXEN",
    description: "The VIXEN public web app preview. Paid memberships and creator services are not active.",
    start_url: "/",
    display: "standalone",
    background_color: "#080609",
    theme_color: "#080609",
    icons: [
      {
        src: "/assets/vixen-mark-3d.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
