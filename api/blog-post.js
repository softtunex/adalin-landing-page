import { getPostBySlug } from '../lib/blog.js';
import { renderPage, escapeHtml } from '../lib/layout.js';

export default async function handler(req, res) {
  const slug = req.query.slug;
  const post = await getPostBySlug(slug);

  if (!post) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(404).send(
      renderPage({
        title: 'Post Not Found | Adalin Tech',
        description: 'This post does not exist.',
        canonical: `https://adalintechnologies.com/blog/${escapeHtml(slug || '')}`,
        robots: 'noindex, nofollow',
        bodyContent: `
          <section class="section-pad" id="top">
            <div class="wrap" style="text-align:center;">
              <h2>Post not found.</h2>
              <p><a href="/blog" class="btn btn-primary" style="margin-top:20px; display:inline-flex;">Back to Blog</a></p>
            </div>
          </section>`,
      })
    );
    return;
  }

  const tags = post.tags.length
    ? `<div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:16px;">${post.tags
        .map((t) => `<span class="pf-tag" style="background:var(--amber-soft); color:var(--amber); font-size:11.5px; font-weight:700; padding:5px 12px; border-radius:100px; font-family:var(--font-head);">${escapeHtml(t)}</span>`)
        .join('')}</div>`
    : '';

  const featuredImage = post.image
    ? `<img src="${escapeHtml(post.image)}" alt="" style="width:100%; border-radius:var(--radius); margin:28px 0; display:block;" />`
    : '';

  const body = `
    <section class="section-pad" id="top">
      <div class="wrap" style="max-width:720px;">
        <div class="section-head left reveal in" style="text-align:left;">
          <div class="eyebrow"><a href="/blog" style="color:var(--amber);">Blog</a></div>
          <h1 style="font-size:clamp(1.7rem,3.2vw,2.4rem); margin-bottom:10px;">${escapeHtml(post.title)}</h1>
          <p style="color:var(--gray-dim); font-size:14px;">${escapeHtml(post.date)}</p>
          ${tags}
        </div>
        ${featuredImage}
        <article class="blog-body">
          ${post.html}
        </article>
        <div style="margin-top:48px; padding-top:32px; border-top:1px solid var(--border);">
          <a href="/blog" class="btn btn-ghost">← Back to Blog</a>
        </div>
      </div>
    </section>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(
    renderPage({
      title: `${post.title} | Adalin Tech`,
      description: post.description,
      canonical: `https://adalintechnologies.com/blog/${post.slug}`,
      image: post.image ? `https://adalintechnologies.com${post.image}` : undefined,
      bodyContent: body,
    })
  );
}
