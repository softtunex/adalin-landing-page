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

const ALLOWED_IMAGE_EXT = new Set(['jpg', 'jpeg', 'png', 'webp']);
const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // 3MB, stays comfortably under Vercel's request body limit once base64-encoded

async function commitFile(path, base64Content, message) {
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, content: base64Content, branch: BRANCH }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'GitHub commit failed');
  return data;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { password, title, description, tags, body, imageBase64, imageExt } = req.body || {};

  if (!password || password !== process.env.BLOG_ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: 'Incorrect password' });
  }

  if (!title || !body) {
    return res.status(400).json({ success: false, error: 'Title and body are required' });
  }

  if (!process.env.GITHUB_TOKEN) {
    return res.status(500).json({ success: false, error: 'Publishing is not configured yet' });
  }

  let imagePath = '';
  if (imageBase64) {
    const ext = (imageExt || '').toLowerCase().replace(/^\./, '');
    if (!ALLOWED_IMAGE_EXT.has(ext)) {
      return res.status(400).json({ success: false, error: 'Image must be jpg, png, or webp' });
    }
    const approxBytes = (imageBase64.length * 3) / 4;
    if (approxBytes > MAX_IMAGE_BYTES) {
      return res.status(400).json({ success: false, error: 'Image is too large, keep it under 3MB' });
    }
    imagePath = `/assets/image/blog/${slugify(title)}.${ext}`;
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
    ...(imagePath ? [`image: ${imagePath}`] : []),
    '---',
    '',
    body.trim(),
    '',
  ].join('\n');

  try {
    if (imageBase64) {
      await commitFile(imagePath.slice(1), imageBase64, `Add image for blog post: ${singleLine(title)}`);
    }
    await commitFile(`content/blog/${slug}.md`, Buffer.from(frontmatter, 'utf8').toString('base64'), `Add blog post: ${singleLine(title)}`);

    return res.status(200).json({ success: true, slug, url: `/blog/${slug}` });
  } catch (err) {
    return res.status(502).json({ success: false, error: err.message || 'Failed to publish' });
  }
}
