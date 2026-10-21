import { spawnSync } from "node:child_process";

const formKey = process.env.TRACER_FORM_KEY?.trim();
if (!formKey) {
  console.error("TRACER_FORM_KEY is required: the Organization's Forms key from Tracer (Integrations > Cloudflare). Export it once in your shell.");
  process.exit(1);
}

const build = spawnSync("npm", ["run", "build"], { stdio: "inherit" });
if (build.status !== 0) process.exit(build.status ?? 1);

const deploy = spawnSync("npx", ["wrangler", "deploy", "--var", `TRACER_FORM_KEY:${formKey}`], { stdio: "inherit" });
process.exit(deploy.status ?? 1);
