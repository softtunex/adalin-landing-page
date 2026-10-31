import { getCaseStudyBySlug } from '../lib/blog.js';
import { renderPage, escapeHtml } from '../lib/layout.js';

export default async function handler(req, res) {
  const slug = req.query.slug;
  const study = await getCaseStudyBySlug(slug);

  if (!study) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(404).send(
      renderPage({
        title: 'Case Study Not Found | Adalin Tech',
        description: 'This case study does not exist.',
        canonical: `https://adalintechnologies.com/work/${escapeHtml(slug || '')}`,
        robots: 'noindex, nofollow',
        bodyContent: `
          <section class="section-pad" id="top">
            <div class="wrap">
              <h2>Case study not found.</h2>
              <p><a href="/#work" class="btn btn-primary" style="margin-top:20px; display:inline-flex;">See our work</a></p>
            </div>
          </section>`,
      })
    );
    return;
  }

  const image = study.image
    ? `<div class="work-shot" style="margin:28px 0;"><img src="${escapeHtml(study.image)}" alt="${escapeHtml(study.imageAlt)}" /></div>`
    : '';

  const body = `
    <section class="section-pad" id="top">
      <div class="wrap" style="max-width:760px;">
        <div class="section-head">
          <div class="eyebrow"><a href="/#work">Our work</a></div>
          <h1 style="font-size:clamp(1.8rem,3.4vw,2.5rem); line-height:1.15; margin-bottom:12px;">${escapeHtml(study.title)}</h1>
          <p>${escapeHtml(study.description)}</p>
        </div>
        ${image}
        <article class="blog-body">
          ${study.html}
        </article>
        <div style="margin-top:48px; padding-top:32px; border-top:1px solid var(--border); display:flex; gap:12px; flex-wrap:wrap;">
          <a href="/#quote" class="btn btn-primary">Get a free proposal</a>
          <a href="/#work" class="btn btn-ghost">Back to our work</a>
        </div>
      </div>
    </section>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(
    renderPage({
      title: `${study.title} | Adalin Tech`,
      description: study.description,
      canonical: `https://adalintechnologies.com/work/${study.slug}`,
      image: study.image ? `https://adalintechnologies.com${study.image}` : undefined,
      bodyContent: body,
    })
  );
}
