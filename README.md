# Dumpster Rentals Haines City

Static-first Astro lead-generation site deployed as a Cloudflare Worker. Most pages are prerendered; the contact page and lead endpoint run on demand.

## Local setup

Requires Node.js 20 or newer.

```sh
npm install
npm run cf-typegen
npm run dev
```

Useful checks:

```sh
npm run check
npm run build
npx wrangler deploy --dry-run
```

After changing bindings or variables in `wrangler.jsonc`, rerun `npm run cf-typegen`.

## Lead email configuration

The form posts to `/api/lead`, which posts the submission to Tracer with the Organization's Forms key; Tracer stores it under the Workspace, emails the business from the site's `info@` address, and counts it as a lead.

- Public sender: `info@dumpsterrentalshainescity.com`
- Delivery inbox: `spurjae@gmail.com`
- Notification inbox: `spurjae@gmail.com` (not BCCed because it matches delivery)
- Worker name: `dumpsterrentalhainescity`

Before deploying:

1. Add `dumpsterrentalshainescity.com` to Cloudflare and onboard it under **Email → Email Sending**.
2. Confirm `info@dumpsterrentalshainescity.com` is an allowed sender.
3. Verify `spurjae@gmail.com` as a destination address when Cloudflare requires destination verification.
4. Keep every To/BCC address in `allowed_destination_addresses` in `wrangler.jsonc`.
5. Run a real form submission after deploy and confirm delivery.

Wrangler deployments replace dashboard-only variables. `TRACER_FORMS_URL` lives in `wrangler.jsonc` (Tracer Staging until Tracer reaches Production); the Forms key is exported in your shell as `TRACER_FORM_KEY` and `npm run deploy` passes it to the Worker.

## Inbound public email

Email Routing is separate from Email Sending. To receive messages sent directly to the public address, configure this Cloudflare Email Routing rule:

```text
Custom address: info@dumpsterrentalshainescity.com
Action: Send to an email
Destination: spurjae@gmail.com
```

Verify the destination inbox and enable the Cloudflare Email Routing DNS records. This inbound rule does not configure outbound form delivery.

## Deploy

The production Worker is configured with `workers_dev: false` and `preview_urls: false`, so attach the custom domain in the Cloudflare dashboard or CI deployment configuration before launch.

```sh
npm run deploy
```

Build output is written to `dist/`. The Worker entrypoint is `dist/_worker.js/index.js`, and `public/.assetsignore` prevents that directory from being uploaded as a static asset.
