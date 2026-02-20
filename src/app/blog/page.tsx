import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';

export const metadata = {
  title: 'Blog | Stoke-AI',
  description: 'Practical AI insights for small businesses in the Magic Valley and beyond.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {/* Header */}
      <nav className="border-b border-gray-800 bg-[#0d0d0d]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-white hover:text-orange-400 transition-colors">
            Stoke-AI
          </Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Blog Header */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-8">
        <h1 className="text-4xl font-bold text-white mb-3">Blog</h1>
        <p className="text-gray-400 text-lg">Practical AI insights for small businesses — no jargon, just straight talk.</p>
      </div>

      {/* Posts */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet. Check back soon!</p>
        ) : (
          <div className="space-y-8">
            {posts.map(post => (
              <article key={post.slug} className="border border-gray-800 rounded-xl p-6 hover:border-orange-500/30 transition-colors">
                <Link href={`/blog/${post.slug}`}>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <time>{new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                    <span>·</span>
                    <span>{post.author}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2 hover:text-orange-400 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 leading-relaxed">{post.excerpt}</p>
                  <span className="inline-block mt-4 text-orange-400 text-sm font-medium">Read more →</span>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        <p>Stoke-AI — Practical AI for Magic Valley businesses — <a href="https://stoke-ai.com" className="text-orange-400 hover:text-orange-300">stoke-ai.com</a></p>
      </footer>
    </div>
  );
}
