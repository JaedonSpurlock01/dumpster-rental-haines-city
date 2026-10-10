/// <reference path="../worker-configuration.d.ts" />
/// <reference types="astro/client" />

type CloudflareRuntime = import("@astrojs/cloudflare/handler").Runtime<Env>;

declare namespace App {
  interface Locals extends CloudflareRuntime {}
}
