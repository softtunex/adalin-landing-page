import { getAllPosts } from '../lib/blog.js';
import { renderPage, escapeHtml } from '../lib/layout.js';

export default async function handler(req, res) {
  const posts = await getAllPosts();

  const cards = posts.length
    ? posts
        .map(
          (p) => `
          <a class="blog-card" href="/blog/${escapeHtml(p.slug)}">
            <span class="blog-card-date">${escapeHtml(p.date)}</span>
            <h3>${escapeHtml(p.title)}</h3>
            <p>${escapeHtml(p.description)}</p>
            <span class="blog-card-link">Read more
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </a>`
        )
        .join('')
    : `<p style="color:var(--gray); text-align:center;">No posts yet, check back soon.</p>`;

  const body = `
    <section class="section-pad" id="top">
      <div class="wrap">
        <div class="section-head reveal in">
          <div class="eyebrow" style="justify-content: center">Blog</div>
          <h2>Notes on software, AI, and automation.</h2>
          <p>What we're building, what we're learning, and what actually works.</p>
        </div>
        <div class="blog-grid">
          ${cards}
        </div>
      </div>
    </section>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(
    renderPage({
      title: 'Blog | Adalin Tech',
      description: 'Notes on software, AI, and automation from the Adalin Tech team.',
      canonical: 'https://adalintechnologies.com/blog',
      bodyContent: body,
    })
  );
}
