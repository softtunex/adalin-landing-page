import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog');

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const [, frontmatter, body] = match;
  const data = {};
  for (const line of frontmatter.split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    data[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { data, body: body.trim() };
}

function toSummary(data, slug) {
  return {
    slug: data.slug || slug,
    title: data.title || 'Untitled',
    date: data.date || '',
    description: data.description || '',
    tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
  };
}

async function readPostFiles() {
  try {
    return (await readdir(POSTS_DIR)).filter((f) => f.endsWith('.md'));
  } catch {
    return [];
  }
}

export async function getAllPosts() {
  const files = await readPostFiles();
  const posts = [];
  for (const file of files) {
    const raw = await readFile(path.join(POSTS_DIR, file), 'utf8');
    const { data } = parseFrontmatter(raw);
    posts.push(toSummary(data, file.replace(/\.md$/, '')));
  }
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

export async function getPostBySlug(slug) {
  const files = await readPostFiles();
  for (const file of files) {
    const raw = await readFile(path.join(POSTS_DIR, file), 'utf8');
    const { data, body } = parseFrontmatter(raw);
    const postSlug = data.slug || file.replace(/\.md$/, '');
    if (postSlug === slug) {
      return { ...toSummary(data, postSlug), html: marked.parse(body) };
    }
  }
  return null;
}
