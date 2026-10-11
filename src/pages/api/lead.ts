import type { APIRoute } from "astro";
import { business, services } from "../../data/site";

export const prerender = false;

const allowedServices = new Set<string>(services.map((service) => service.name));

function redirect(request: Request, path: string): Response {
  return Response.redirect(new URL(path, request.url), 303);
}

function clean(value: FormDataEntryValue | null, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export const POST: APIRoute = async ({ request, locals }) => {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");

  if (origin && origin !== requestUrl.origin) {
    return new Response("Forbidden", { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return redirect(request, "/contact/?error=1#error-fields");
  }

  if (clean(formData.get("company_website"), 200)) {
    return redirect(request, "/thank-you/");
  }

  const service = clean(formData.get("service"), 100);
  const name = clean(formData.get("name"), 100);
  const phone = clean(formData.get("phone"), 30);
  const email = clean(formData.get("email"), 254).toLowerCase();
  const details = clean(formData.get("details"), 2000);
  const phoneDigits = phone.replace(/\D/g, "");
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (
    !allowedServices.has(service) ||
    !name ||
    phoneDigits.length < 10 ||
    phoneDigits.length > 15 ||
    !validEmail ||
    details.length < 3
  ) {
    return redirect(request, "/contact/?error=1#error-fields");
  }

  const env = locals.runtime?.env;
  const deliveryEmail = env?.LEAD_DELIVERY_EMAIL?.trim();
  const notifyEmail = env?.LEAD_NOTIFY_EMAIL?.trim();

  if (!env?.LEAD_EMAIL) {
    console.error(JSON.stringify({ message: "LEAD_EMAIL send failed:", reason: "missing binding" }));
    return redirect(request, "/contact/?error=bind#error-bind");
  }

  if (!deliveryEmail) {
    console.error(JSON.stringify({ message: "LEAD_EMAIL send failed:", reason: "missing delivery address" }));
    return redirect(request, "/contact/?error=config#error-config");
  }

  const safe = {
    name: escapeHtml(name),
    phone: escapeHtml(phone),
    email: escapeHtml(email),
    service: escapeHtml(service),
    details: escapeHtml(details).replaceAll("\n", "<br>"),
  };

  const message = {
    from: {
      name: business.name,
      email: business.email,
    },
    to: deliveryEmail,
    ...(notifyEmail && notifyEmail !== deliveryEmail ? { bcc: notifyEmail } : {}),
    replyTo: email,
    subject: `New ${service} lead from ${name}`,
    text: [
      `New lead from ${business.name}`,
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Service: ${service}`,
      "",
      "Project details:",
      details,
    ].join("\n"),
    html: `
      <h1>New dumpster rental lead</h1>
      <table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse">
        <tr><th align="left">Name</th><td>${safe.name}</td></tr>
        <tr><th align="left">Phone</th><td>${safe.phone}</td></tr>
        <tr><th align="left">Email</th><td>${safe.email}</td></tr>
        <tr><th align="left">Service</th><td>${safe.service}</td></tr>
        <tr><th align="left">Project details</th><td>${safe.details}</td></tr>
      </table>
    `,
  };

  try {
    await env.LEAD_EMAIL.send(message);
  } catch (error) {
    const sendError = error as { code?: string; message?: string };
    console.error(
      JSON.stringify({
        message: "LEAD_EMAIL send failed:",
        code: sendError.code ?? null,
        error: error instanceof Error ? error.message : String(error),
      }),
    );
    return redirect(request, "/contact/?error=send#error-send");
  }

  return redirect(request, "/thank-you/");
};

export const ALL: APIRoute = () =>
  new Response("Method Not Allowed", {
    status: 405,
    headers: { Allow: "POST" },
  });
