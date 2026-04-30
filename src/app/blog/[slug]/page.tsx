import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: `${post.title} | Stoke-AI Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {/* Header */}
      <nav className="border-b border-gray-800 bg-[#0d0d0d]/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-white hover:text-orange-400 transition-colors">
            Stoke-AI
          </Link>
          <Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← All Posts
          </Link>
        </div>
      </nav>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 pt-16 pb-20">
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
          <time>{new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          <span>·</span>
          <span>{post.author}</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-8 leading-tight">{post.title}</h1>
        <div
          className="prose prose-invert max-w-none text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div className="border border-gray-800 rounded-xl p-8 text-center bg-gradient-to-b from-gray-900/50 to-transparent">
          <h3 className="text-xl font-bold text-white mb-2">Want to see what AI can do for your business?</h3>
          <p className="text-gray-400 mb-4">No pressure, no jargon — just a conversation about what&apos;s possible.</p>
          <Link
            href="/"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        <p>Stoke-AI — Practical AI for Magic Valley businesses — <a href="https://stoke-ai.com" className="text-orange-400 hover:text-orange-300">stoke-ai.com</a></p>
      </footer>
    </div>
  );
}
