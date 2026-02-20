import fs from 'fs';
import path from 'path';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  content: string;
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function parseFrontmatter(fileContent: string): { metadata: Record<string, string>; content: string } {
  const match = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { metadata: {}, content: fileContent };

  const metadata: Record<string, string> = {};
  match[1].split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;
    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
    metadata[key] = value;
  });

  return { metadata, content: match[2].trim() };
}

function markdownToHtml(md: string): string {
  let html = md
    // Headers
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-white mt-8 mb-3">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-white mt-10 mb-4">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-white mt-10 mb-4">$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-orange-400 hover:text-orange-300 underline">$1</a>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="border-gray-700 my-8" />')
    // Line breaks into paragraphs
    .split('\n\n')
    .map(block => {
      block = block.trim();
      if (!block) return '';
      if (block.startsWith('<h') || block.startsWith('<hr') || block.startsWith('<ul') || block.startsWith('<ol')) return block;
      return `<p class="text-gray-300 leading-relaxed mb-4">${block}</p>`;
    })
    .join('\n');

  return html;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));

  const posts = files.map(filename => {
    const slug = filename.replace('.md', '');
    const fileContent = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8');
    const { metadata, content } = parseFrontmatter(fileContent);

    return {
      slug,
      title: metadata.title || slug,
      date: metadata.date || '',
      excerpt: metadata.excerpt || '',
      author: metadata.author || 'Stoke-AI',
      content,
    };
  });

  return posts.sort((a, b) => (b.date > a.date ? 1 : -1));
}

export function getPostBySlug(slug: string): (BlogPost & { html: string }) | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { metadata, content } = parseFrontmatter(fileContent);

  return {
    slug,
    title: metadata.title || slug,
    date: metadata.date || '',
    excerpt: metadata.excerpt || '',
    author: metadata.author || 'Stoke-AI',
    content,
    html: markdownToHtml(content),
  };
}
