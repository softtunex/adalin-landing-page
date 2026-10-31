---
title: A Booking and Deposit System for LashBabe
slug: lashbabe
date: 2026-10-31
description: How we built online booking, Paystack deposits and automatic confirmation emails for LashBabe, a lash studio in Lagos.
tags: Booking system, Payments, Client work
image: /assets/image/work/booking-demo.jpg
imageAlt: The booking step: a calendar with a date picked and the open time slots beside it
---

LashBabe is a lash extension and beauty studio in Lagos. Before this project, bookings worked the way they do for most service businesses: back and forth on WhatsApp, deposits sent by hand and checked against bank alerts, no-shows nobody could really prevent, and no single place to see what the week looked like.

We built them a booking platform that takes care of all of that, and it has been running in production since.

## What it does

A client visits the site, picks a service, picks a time, and pays a deposit on the spot. That is the whole flow for the client. Everything behind it exists to make that moment reliable.

**Live availability.** Open time slots are worked out from three things at once: existing bookings, dates the staff have blocked off, and the studio's opening hours. If a slot is taken or the studio is closed that day, it is never offered, so there are no double bookings and nobody has to keep a calendar up to date by hand.

**Deposits through Paystack, done properly.** Every payment notification is checked to make sure it really came from Paystack before the system trusts it, and a repeated notification never records the same payment twice. A booking only moves from Pending to Confirmed once the deposit has actually been paid.

**Emails that match what happened.** The client gets a branded confirmation as soon as the deposit clears, with the service, staff member, date, time and amount paid. If the appointment is moved or its status changes, they get an email for that too, and the owner gets her own version of each notice.

**The rest of what a booking business needs.** A service list with prices and durations, add-ons on top of a main service, staff assigned to each booking, discount codes, and a booking policy clients see before they pay.

## Built with

- **Website:** React, with a step-by-step booking flow (date and time, details, confirmation)
- **Back office:** Strapi and PostgreSQL
- **Payments:** Paystack
- **Email:** branded transactional emails
- **Images:** Cloudinary

## Try it

You can walk through the same booking flow in our [booking demo](/demo/). It uses sample services and a simulated payment, so nothing is charged.

If your business still takes bookings or orders in chats, [tell us how it works today](/#quote) and we'll send you a free proposal.
