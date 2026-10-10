import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, BookOpen, Clock, Calendar, User } from "lucide-react";
import { BLOG_POSTS } from "@/config/blog";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Document Guides & Productivity Tutorials | trysomenew",
  description:
    "Honest how-to guides, document security tips, and browser-first productivity workflows written by the trysomenew engineering team.",
  alternates: {
    canonical: "https://trysomenew.com/blog",
  },
};

export default function BlogIndexPage() {
  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 text-left">
      <Breadcrumb
        items={[
          { label: "Guides & Blog" },
        ]}
      />

      <div className="mb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-[var(--pine-tint)] text-[var(--pine)] text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Guides & Tutorials</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-semibold">
          Document Guides & Workflows
        </h1>
        <p className="text-sm sm:text-base text-[var(--muted)] max-w-2xl leading-relaxed">
          Practical tutorials on in-browser document processing, optical character recognition,
          privacy auditing, and fast device synchronization.
        </p>
      </div>

      <div className="space-y-6">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.slug}
            className="p-6 bg-[var(--surface)] border border-[var(--line)] rounded-[8px] hover:border-[var(--pine)] transition-colors space-y-3 group"
          >
            <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
              <span className="px-2 py-0.5 rounded bg-[var(--sunken)] text-[var(--ink)] font-medium">
                {post.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{post.date}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime}</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold text-[var(--ink)] group-hover:text-[var(--pine)] transition-colors">
              <Link href={`/blog/${post.slug}`}>
                {post.title}
              </Link>
            </h2>

            <p className="text-sm text-[var(--muted)] leading-relaxed">
              {post.description}
            </p>

            <div className="pt-2">
              <Link
                href={`/blog/${post.slug}`}
                className="text-xs font-semibold text-[var(--pine)] hover:underline flex items-center gap-1"
              >
                <span>Read Full Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
