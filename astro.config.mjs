import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://dumpsterrentalshainescity.com",
  output: "static",
  adapter: cloudflare({
    imageService: "compile",
  }),
  integrations: [
    sitemap({
      filter: (page) => page !== "https://dumpsterrentalshainescity.com/thank-you/",
    }),
  ],
  build: {
    inlineStylesheets: "always",
  },
  compressHTML: true,
});
