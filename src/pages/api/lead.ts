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

  // Tracer stores the submission under this Site's Workspace, forwards it to the business
  // from this Site's address, and counts it as a lead. Every Site shares one Forms key and
  // names itself by hostname.
  const env = locals.runtime?.env;
  const formsUrl = env?.TRACER_FORMS_URL?.trim();
  const formKey = env?.TRACER_FORM_KEY?.trim();
  if (!formsUrl || !formKey) {
    console.error(JSON.stringify({ message: "Tracer lead post skipped", reason: "missing TRACER_FORMS_URL or TRACER_FORM_KEY" }));
    return redirect(request, "/contact/?error=config#error-config");
  }

  const submission = {
    site: new URL(business.url).hostname,
    submissionId: crypto.randomUUID(),
    page: new URL(request.headers.get("referer") ?? "/contact/", request.url).pathname,
    fields: {
      Name: name,
      Phone: phone,
      Email: email,
      Service: service,
      "Project details": details,
    },
  };

  try {
    const response = await fetch(formsUrl, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${formKey}` },
      body: JSON.stringify(submission),
    });
    if (!response.ok) {
      console.error(JSON.stringify({ message: "Tracer refused the lead", status: response.status, body: await response.text().catch(() => "") }));
      return redirect(request, "/contact/?error=send#error-send");
    }
  } catch (error) {
    console.error(JSON.stringify({ message: "Tracer lead post failed", error: error instanceof Error ? error.message : String(error) }));
    return redirect(request, "/contact/?error=send#error-send");
  }

  return redirect(request, "/thank-you/");
};

export const ALL: APIRoute = () =>
  new Response("Method Not Allowed", {
    status: 405,
    headers: { Allow: "POST" },
  });
