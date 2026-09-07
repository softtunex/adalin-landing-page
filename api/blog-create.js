const OWNER = 'softtunex';
const REPO = 'adalin-landing-page';
const BRANCH = 'main';

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function singleLine(text) {
  return String(text || '').replace(/\r?\n/g, ' ').trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { password, title, description, tags, body } = req.body || {};

  if (!password || password !== process.env.BLOG_ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: 'Incorrect password' });
  }

  if (!title || !body) {
    return res.status(400).json({ success: false, error: 'Title and body are required' });
  }

  if (!process.env.GITHUB_TOKEN) {
    return res.status(500).json({ success: false, error: 'Publishing is not configured yet' });
  }

  const slug = slugify(title);
  const date = new Date().toISOString().slice(0, 10);

  const frontmatter = [
    '---',
    `title: ${singleLine(title)}`,
    `slug: ${slug}`,
    `date: ${date}`,
    `description: ${singleLine(description)}`,
    `tags: ${singleLine(tags)}`,
    '---',
    '',
    body.trim(),
    '',
  ].join('\n');

  const path = `content/blog/${slug}.md`;
  const content = Buffer.from(frontmatter, 'utf8').toString('base64');

  try {
    const ghRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Add blog post: ${singleLine(title)}`,
        content,
        branch: BRANCH,
      }),
    });

    const data = await ghRes.json();

    if (!ghRes.ok) {
      return res.status(502).json({ success: false, error: data.message || 'Failed to publish' });
    }

    return res.status(200).json({ success: true, slug, url: `/blog/${slug}` });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}
