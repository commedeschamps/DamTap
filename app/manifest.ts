import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DamTap",
    short_name: "DamTap",
    description: "Вкусная еда по выгодной цене",
    start_url: "/",
    display: "standalone",
    background_color: "#F7FBF5",
    theme_color: "#006F73",
    lang: "ru",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
