// TEMPORARY: reverted 2026-09-06, Resend says adalintech.com is not verified
// yet despite DNS records being in place. Restore both recipients and switch
// FROM_ADDRESS to no-reply@adalintech.com once resend.com/domains actually
// shows it Verified, not just "records added."
const NOTIFY_RECIPIENTS = ['olatunji.buari@adalintech.com'];

const FROM_ADDRESS = 'Adalin Tech Website <onboarding@resend.dev>';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { name, email, phone, notes, service } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Name and email are required' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ success: false, error: 'Email service is not configured' });
  }

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: NOTIFY_RECIPIENTS,
        reply_to: email,
        subject: 'New project inquiry from the Adalin Tech website',
        html: `
          <p><strong>Service:</strong> ${escapeHtml(service || 'Not specified')}</p>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone || 'Not provided')}</p>
          <p><strong>Notes:</strong> ${escapeHtml(notes || 'None')}</p>
        `,
      }),
    });

    const data = await resendRes.json();

    if (!resendRes.ok) {
      return res.status(502).json({ success: false, error: data.message || 'Failed to send email' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}
