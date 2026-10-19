export default function manifest() {
  return {
    name: "Meowmart",
    short_name: "Meowmart",
    description: "Katalog perlengkapan kucing Meowmart",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1f6b4f",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

