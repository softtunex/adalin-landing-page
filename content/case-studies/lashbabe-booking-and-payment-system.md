<!--
DRAFT — not published anywhere. Nothing in the site reads this folder,
it's just stored here so it doesn't get lost before a destination is decided
(GoodFirms/Clutch portfolio, an "Our Work" site section, or something else).
-->

# How We Built a Booking and Payment System for LashBabe

A real, in-production booking platform with deposit payments, automated emails, and staff scheduling, built for a Lagos beauty business.

Most of what we talk about on this blog is what businesses should be automating. This one is different, it's what we actually built.

LashBabe is a lash extension and beauty business in Lagos. Before this project, bookings happened the way they do for most service businesses: back and forth on WhatsApp, deposits sent by hand, no-shows nobody could really prevent, and no easy way to see what the week looked like. We built them a real booking platform to fix that, and it's been running in production since.

## What it actually does

A client visits the site, picks a service, picks a time, and pays a deposit on the spot. That's the whole flow, and everything behind it is built to make that simple moment actually work reliably.

**Live availability, not a static calendar.** Available time slots are calculated in real time from three things at once: existing bookings, staff-configured blocked dates, and the business's actual operating hours. If a slot is taken or the business is closed that day, it simply isn't offered, no double-bookings, no manual calendar upkeep.

**Deposits handled through Paystack, properly.** This is the part most people get wrong when they wire up a payment provider, so it's worth being specific: the payment webhook verifies Paystack's signature on every request using HMAC-SHA512 before trusting anything it says. It also checks for an existing payment record before creating a new one, so if Paystack retries a webhook (which it does), the client doesn't end up with a duplicate charge on record. A booking only flips from Pending to Confirmed once the deposit is actually verified as paid, not before.

**Automated emails that actually match what happened.** The client gets a branded confirmation email the moment their deposit clears, with the service, staff member, date, time, and amount paid. If the appointment gets rescheduled or its status changes, they get a separate email for that too, and the business owner gets her own version of each notification, not a copy of the client's email.

**Everything else a real booking system needs.** A service catalog with pricing and duration, staff assignment per booking, promotions and discount codes, and a booking policy page clients are pointed to before they confirm.

## The stack

- **Frontend:** React 19, with React Router and a proper multi-step booking flow (date/time, details, confirmation)
- **Backend:** Strapi 5 (TypeScript), PostgreSQL
- **Payments:** Paystack, with signature-verified webhooks
- **Email:** transactional templates via SendGrid/Resend, branded to match the business
- **Media:** Cloudinary for image handling

## Where it stands

This isn't a demo. As of writing, the system holds over 260 real records across appointments, payments, services, and staff, and bookings are coming in and being paid for while you read this.

---

**Still open:**
- Confirm LashBabe is okay being named publicly before this goes anywhere.
- Decide destination: GoodFirms/Clutch portfolio, site "Our Work" section, or both.
- Need a real screenshot or image if this becomes a site page.
