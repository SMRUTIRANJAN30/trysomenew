import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArrowLeft, ArrowRight, Calendar, Clock, User, BookOpen, ShieldCheck } from "lucide-react";
import { BLOG_POSTS, BlogPost } from "@/config/blog";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Article Not Found | trysomenew" };

  return {
    title: `${post.title} | trysomenew`,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `https://trysomenew.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author,
      url: "https://trysomenew.com/about",
    },
    publisher: {
      "@type": "Organization",
      name: "trysomenew",
      url: "https://trysomenew.com",
    },
  };

  return (
    <article className="w-full max-w-[840px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 text-left">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <Breadcrumb
        items={[
          { label: "Guides & Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      <header className="mb-8 space-y-3 pb-6 border-b border-[var(--line)]">
        <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-0.5 rounded bg-[var(--sunken)] text-[var(--ink)]">
          <span>{post.category}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-semibold text-[var(--ink)] leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--muted)] pt-1">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            <span>{post.author}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{post.date}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readTime}</span>
          </span>
        </div>
      </header>

      {/* Content */}
      <div className="prose prose-neutral max-w-none text-sm sm:text-base text-[var(--ink)] leading-relaxed space-y-6">
        <p className="text-base sm:text-lg font-medium text-[var(--muted)] leading-relaxed">
          {post.description}
        </p>

        <div className="space-y-4 whitespace-pre-line">
          {post.content}
        </div>
      </div>

      {/* CTA Box */}
      <div className="mt-12 p-6 bg-[var(--sunken)] border border-[var(--line)] rounded-[8px] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-[var(--ink)] mb-1">
            Ready to try private in-browser document tools?
          </h3>
          <p className="text-xs text-[var(--muted)]">
            Over 177+ free tools with zero file retention.
          </p>
        </div>
        <Link href="/tools" className="btn-terracotta text-sm h-10 px-5 shrink-0">
          <span>Explore Tools</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="mt-8 pt-4 border-t border-[var(--line)]">
        <Link
          href="/blog"
          className="text-xs font-semibold text-[var(--pine)] hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Guides</span>
        </Link>
      </div>
    </article>
  );
}
