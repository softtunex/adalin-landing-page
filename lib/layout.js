function nav() {
  return `
    <div class="scroll-progress" id="scrollProgress"></div>
    <div class="nav-outer">
      <nav class="nav" id="mainNav">
        <a href="/" class="brand" aria-label="Adalin home">
          <img class="icon" src="/assets/image/logo-icon-light.png" alt="" />
          <img class="word" src="/assets/image/logo-wordmark-light.png" alt="Adalin" />
        </a>
        <div class="nav-links">
          <a href="/#what-we-do">What We Do</a>
          <a href="/#how-it-works">How It Works</a>
          <a href="/blog">Blog</a>
        </div>
        <div style="display: flex; align-items: center; gap: 10px">
          <a href="/#quote" class="btn btn-primary btn-sm">Get a Free Quote</a>
          <button class="nav-toggle" id="navToggle" aria-label="Open menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M3 6h18M3 12h18M3 18h18" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </nav>
    </div>
    <div class="mobile-menu" id="mobileMenu">
      <a href="/#what-we-do">What We Do</a>
      <a href="/#how-it-works">How It Works</a>
      <a href="/blog">Blog</a>
      <a href="/#quote" class="btn btn-primary btn-block">Get a Free Quote</a>
    </div>`;
}

function footer() {
  return `
    <footer>
      <div class="wrap">
        <div class="footer-top">
          <div class="footer-bio">
            <div class="brand">
              <img class="icon" src="/assets/image/logo-icon-light.png" alt="" />
              <img class="word" src="/assets/image/logo-wordmark-light.png" alt="Adalin" style="height: 14px" />
            </div>
            <p>Adalin Digital Technologies LTD builds custom software and AI automation for ambitious businesses.</p>
            <a href="https://wa.me/message" class="whatsapp-btn">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.38a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.1a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.13.82.83-3.05-.19-.31a8.2 8.2 0 0 1-1.26-4.34c0-4.53 3.69-8.22 8.23-8.22 4.53 0 8.22 3.69 8.22 8.23 0 4.53-3.69 8.19-8.23 8.19zm4.51-6.16c-.25-.12-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.79.96-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.22-1.46-1.37-1.7-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.36-.77-1.86-.2-.48-.41-.42-.56-.42-.14-.01-.31-.01-.48-.01-.16 0-.43.06-.66.31-.23.25-.86.85-.86 2.06 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.67-1.17.2-.58.2-1.08.14-1.18-.06-.1-.22-.16-.47-.28z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>
          <div class="footer-col">
            <h4>Quick Links</h4>
            <a href="/#what-we-do">What We Do</a>
            <a href="/#how-it-works">How It Works</a>
            <a href="/blog">Blog</a>
            <a href="/#quote">Get a Free Quote</a>
          </div>
          <div class="footer-col">
            <h4>Contact</h4>
            <a href="mailto:contact@adalintech.com">contact@adalintech.com</a>
            <a href="mailto:buariolatunji@gmail.com">buariolatunji@gmail.com</a>
          </div>
        </div>
        <div class="footer-bottom">
          <div class="footer-legal">© 2026 Adalin Digital Technologies LTD. All rights reserved.</div>
          <div class="social-row">
            <a href="#" aria-label="X / Twitter"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.1l-5.6-6.9L4.2 22H1l8.1-9.3L1 2h7.3l5.1 6.3L18.9 2zm-1.2 18h1.9L7.4 4H5.4l12.3 16z" /></svg></a>
            <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></svg></a>
            <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.05c.53-1 1.83-2 3.77-2 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.3-.02-3-1.83-3-1.83 0-2.1 1.43-2.1 2.9V21h-4V9z" /></svg></a>
          </div>
        </div>
      </div>
    </footer>
    <script src="/script.js"></script>`;
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const DEFAULT_IMAGE = 'https://adalintechnologies.com/assets/image/social/adalin-tech-ai-automation-launch.png';

export function renderPage({ title, description, canonical, robots = 'index, follow', image, bodyContent }) {
  const shareImage = image || DEFAULT_IMAGE;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="${robots}" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Adalin Tech" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${shareImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${shareImage}" />
    <link rel="icon" type="image/png" href="/assets/image/favicon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    ${nav()}
    ${bodyContent}
    ${footer()}
  </body>
</html>`;
}
