import type { Metadata } from "next";
import Link from "next/link";
import { TOOLS_CONFIG, CATEGORY_NAMES, ToolConfig, ToolFaq } from "@/config/tools";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

/** All working tools that live on the given page path (several tools can share one page). */
export function toolsForPath(path: string): ToolConfig[] {
  return TOOLS_CONFIG.filter((t) => t.href.split("?")[0] === path);
}

function primaryTool(path: string): ToolConfig {
  const tools = toolsForPath(path);
  if (tools.length === 0) throw new Error(`No ready tool registered for ${path}`);
  // Prefer the popular / curated entry as the page's identity.
  return tools.find((t) => t.isPopular) ?? tools[0];
}

function clip(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

function pageDescription(tool: ToolConfig) {
  const tail = tool.isLocal
    ? " Free, no sign-up, runs in your browser — files never leave your device."
    : " Free, no sign-up, no watermark.";
  return clip(tool.shortDescription.replace(/\.?$/, ".") + tail, 160);
}

/** Per-page metadata: unique title, description, self-canonical, OG and Twitter. */
export function toolMetadata(path: string, overrides: Partial<{ title: string; description: string }> = {}): Metadata {
  const tool = primaryTool(path);
  const title = overrides.title ?? `${tool.name} Online — Free${tool.isLocal ? " & Private" : ""}`;
  const description = overrides.description ?? pageDescription(tool);
  const keywords = Array.from(new Set(toolsForPath(path).flatMap((t) => [t.name.toLowerCase(), ...t.keywords])));
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: { title: `${title} | ${SITE_NAME}`, description, url: path, type: "website", siteName: SITE_NAME, images: ["/og-image.png"] },
    twitter: { card: "summary_large_image", title: `${title} | ${SITE_NAME}`, description, images: ["/og-image.png"] },
  };
}

/** Metadata for non-tool pages (home, about, category hubs…). */
export function pageMetadata(path: string, title: string, description: string, opts: { noindex?: boolean } = {}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", siteName: SITE_NAME, images: ["/og-image.png"] },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
    ...(opts.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

function genericFaq(tool: ToolConfig): ToolFaq[] {
  const faq: ToolFaq[] = [
    { question: `Is ${tool.name} free?`, answer: `Yes. ${tool.name} on ${SITE_NAME} is completely free — no account, no watermark and no daily limit.` },
  ];
  if (tool.isLocal) {
    faq.push(
      { question: "Are my files uploaded to a server?", answer: "No. Processing happens entirely inside your browser using JavaScript and WebAssembly, so your data never leaves your device." },
      { question: "Does it work offline or on mobile?", answer: "Yes. Once the page has loaded it works on any modern browser — Chrome, Safari, Edge or Firefox — on desktop, Android and iPhone." },
    );
  }
  return faq;
}

function steps(tool: ToolConfig) {
  const fileBased = (tool.inputExtensions?.length ?? 0) > 0;
  const input = fileBased ? `Drop your ${tool.inputExtensions!.slice(0, 3).map((e) => e.toUpperCase()).join(" / ")} file into the box above, or tap to choose one.` : "Type or paste your input into the tool above.";
  const out = tool.outputExtensions?.length ? `Download the result as ${tool.outputExtensions.slice(0, 2).map((e) => e.toUpperCase()).join(" or ")}.` : "Copy or download the result instantly.";
  return [
    { title: fileBased ? "Add your file" : "Enter your data", desc: input },
    { title: "Adjust options", desc: "Pick the settings you need — the preview updates in real time." },
    { title: "Get the result", desc: out },
  ];
}

/**
 * Server-rendered, crawlable content shown under every tool:
 * how-to steps, feature list, FAQ, related-tool links and JSON-LD.
 */
export function ToolSeoContent({ path, hideFaq = false }: { path: string; hideFaq?: boolean }) {
  const tools = toolsForPath(path);
  const tool = primaryTool(path);
  const faq = [...(tool.faq?.length ? tool.faq : []), ...genericFaq(tool)].filter(
    (f, i, arr) => arr.findIndex((x) => x.question === f.question) === i,
  );
  const seen = new Set(tools.map((t) => t.href.split("?")[0]));
  const related: ToolConfig[] = [];
  const pushRelated = (t?: ToolConfig) => {
    if (!t) return;
    const h = t.href.split("?")[0];
    if (seen.has(h)) return;
    seen.add(h);
    related.push(t);
  };
  tool.related.forEach((slug) => pushRelated(TOOLS_CONFIG.find((t) => t.slug === slug)));
  TOOLS_CONFIG.filter((t) => t.category === tool.category).forEach((t) => related.length < 8 && pushRelated(t));
  TOOLS_CONFIG.filter((t) => t.isPopular).forEach((t) => related.length < 8 && pushRelated(t));

  const url = absoluteUrl(path);
  const catName = CATEGORY_NAMES[tool.category];
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: tool.name,
      url,
      description: tool.shortDescription,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any (web browser)",
      browserRequirements: "Requires JavaScript",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: tools.map((t) => t.name),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "All tools", item: absoluteUrl("/tools") },
        { "@type": "ListItem", position: 3, name: tool.name, item: url },
      ],
    },
    ...(!hideFaq && faq.length
      ? [{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
        }]
      : []),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      {!hideFaq && (
        <section aria-label={`About ${tool.name}`} className="max-w-4xl mx-auto px-4 md:px-6 pb-16 space-y-12 text-[var(--ink)]">
          <nav aria-label="Breadcrumb" className="text-xs text-[var(--muted)] border-t border-[var(--line)] pt-8">
            <Link href="/" className="hover:underline">Home</Link> <span aria-hidden>›</span>{" "}
            <Link href="/tools" className="hover:underline">{catName}</Link> <span aria-hidden>›</span>{" "}
            <span>{tool.name}</span>
          </nav>

          <div>
            <h2 className="text-xl font-semibold mb-5">How to use {tool.name}</h2>
            <ol className="grid gap-4 sm:grid-cols-3">
              {steps(tool).map((s, i) => (
                <li key={s.title} className="p-4 rounded-lg border border-[var(--line)] bg-[var(--surface)]">
                  <span className="font-mono text-xs font-bold text-[var(--pine)]">Step {i + 1}</span>
                  <h3 className="font-semibold mt-1">{s.title}</h3>
                  <p className="text-sm text-[var(--muted)] mt-1 leading-relaxed">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>

          {tools.length > 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">What this tool can do</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {tools.map((t) => (
                  <li key={t.slug} className="text-sm"><strong>{t.name}</strong> — <span className="text-[var(--muted)]">{t.shortDescription}</span></li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold mb-4">Frequently asked questions</h2>
            <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {faq.map((f) => (
                <details key={f.question} className="group py-3">
                  <summary className="cursor-pointer font-medium text-sm list-none flex justify-between gap-4">
                    {f.question}<span className="text-[var(--muted)] group-open:rotate-45 transition-transform" aria-hidden>+</span>
                  </summary>
                  <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>

          {related.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Related tools</h2>
              <ul className="grid gap-2 grid-cols-2 sm:grid-cols-4">
                {related.slice(0, 8).map((t) => (
                  <li key={t.slug}>
                    <Link href={t.href} className="block p-3 rounded-lg border border-[var(--line)] hover:border-[var(--pine)] text-sm font-medium">
                      {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </>
  );
}
