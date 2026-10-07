import { services, staff, bookingSettings } from './data.js';

const $ = (sel) => document.querySelector(sel);
const fmt = (n) => '₦' + n.toLocaleString('en-NG');

const cart = [];
let bookingServices = [];
let step = 1;
let selectedDate = new Date();
let selectedTime = null;
let formData = { fullName: '', email: '', phone: '', staff: '' };

// A couple of slots always read as booked, same "already taken" pattern the
// real system shows, so the grid isn't suspiciously wide open.
const FAKE_BOOKED = ['11:00', '14:00'];

function canAddService(service) {
  if (service.isAddOn) return true;
  return !cart.some((s) => !s.isAddOn);
}

function addToCart(service) {
  if (!canAddService(service)) {
    alert('You can only book ONE main service at a time. You can add multiple add-ons to your booking.');
    return;
  }
  if (!cart.some((s) => s.id === service.id)) cart.push(service);
  renderServices();
  updateCartPill();
}

function updateCartPill() {
  $('#cart-count').textContent = cart.length;
  $('#cart-pill').style.display = cart.length ? 'flex' : 'none';
}

function serviceCard(s) {
  const inCart = cart.some((c) => c.id === s.id);
  const isOnSale = !!s.onSalesPrice;
  return `
    <div class="card">
      ${isOnSale ? `<div class="sale-banner">${s.onSaleTitle}</div>` : ''}
      ${s.isAddOn ? '<div class="addon-badge">Add-On</div>' : ''}
      <div class="card-img">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="3"/></svg>
      </div>
      <div class="card-body">
        <h3>${s.name}</h3>
        <div class="card-meta">
          <span>${s.duration} mins</span>
          ${isOnSale
            ? `<span class="price-row"><span class="sale-price">${fmt(s.onSalesPrice)}</span><span class="og-price">${fmt(s.price)}</span></span>`
            : `<span class="price">${fmt(s.price)}</span>`}
        </div>
        <div class="card-actions">
          ${inCart
            ? `<button class="btn-incart" data-view-cart="1">✓ Added - View Service</button>`
            : `<button class="btn-outline" data-add="${s.id}">${s.isAddOn ? 'Add Add-On' : 'Add Service'}</button><button class="btn-book" data-book="${s.id}">Book Now</button>`}
        </div>
      </div>
    </div>
  `;
}

function renderServices() {
  $('#content').innerHTML = `
    <div class="page-head">
      <h1>Our Services</h1>
      <p>Pick a service to get started, add extras after.</p>
    </div>
    <div class="service-grid">${services.map(serviceCard).join('')}</div>
  `;
}

// ---- Booking flow ----

function startBooking(serviceId) {
  const service = services.find((s) => s.id === serviceId);
  if (service && !cart.some((c) => c.id === service.id)) {
    if (!canAddService(service)) {
      alert('You can only book ONE main service at a time. You can add multiple add-ons to your booking.');
      return;
    }
    cart.push(service);
    updateCartPill();
  }
  bookingServices = [...cart];
  step = 1;
  selectedTime = null;
  renderBooking();
}

function calendarDays() {
  const days = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

function timeSlots() {
  const slots = [];
  for (let h = bookingSettings.startHour; h < bookingSettings.endHour; h++) {
    slots.push(String(h).padStart(2, '0') + ':00');
  }
  return slots;
}

function isTooSoon(slot) {
  const [h] = slot.split(':').map(Number);
  const slotTime = new Date(selectedDate);
  slotTime.setHours(h, 0, 0, 0);
  const minTime = new Date(Date.now() + bookingSettings.windowHours * 3600000);
  return slotTime < minTime;
}

function renderStep1() {
  const days = calendarDays();
  const dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return `
    <h2 class="step-title">Select Date &amp; Time</h2>
    <p style="text-align:center;color:var(--grey-mid);font-size:.85rem;margin-top:-16px;margin-bottom:20px;">Bookings must be made at least ${bookingSettings.windowHours} hours in advance.</p>
    <div class="dt-layout">
      <div class="cal-box">
        <div class="cal-head">${selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
        <div class="cal-grid">
          ${dow.map((d) => `<div class="dow">${d}</div>`).join('')}
          ${days.map((d) => {
            const sel = d.toDateString() === selectedDate.toDateString();
            return `<div class="cal-day${sel ? ' selected' : ''}" data-date="${d.toISOString()}">${d.getDate()}</div>`;
          }).join('')}
        </div>
      </div>
      <div>
        <div class="slots-title">Available Time Slots</div>
        <div class="slots-grid">
          ${timeSlots().map((slot) => {
            const disabled = FAKE_BOOKED.includes(slot) || isTooSoon(slot);
            const sel = selectedTime === slot;
            return `<div class="slot${disabled ? ' disabled' : ''}${sel ? ' selected' : ''}" data-slot="${disabled ? '' : slot}">${slot}</div>`;
          }).join('')}
        </div>
        <p style="font-size:.78rem;color:var(--grey-mid);text-align:center;margin-top:10px;">Disabled slots are already booked or unavailable.</p>
      </div>
    </div>
    <button class="nextButton" id="step1-next" style="margin-top:24px;" ${selectedTime ? '' : 'disabled'}>Continue</button>
  `;
}

function renderStep2() {
  const sorted = [...bookingServices].sort((a, b) => (a.isAddOn === b.isAddOn ? 0 : a.isAddOn ? 1 : -1));
  const totalDeposit = bookingServices.reduce((s, x) => s + x.deposit, 0);
  const totalPrice = bookingServices.reduce((s, x) => s + (x.onSalesPrice || x.price), 0);
  const totalDuration = bookingServices.reduce((s, x) => s + x.duration, 0);
  return `
    <h2 class="step-title">Enter Your Details</h2>
    <div class="summary-card">
      <h3>Booking Summary</h3>
      ${sorted.map((s, i) => `<div class="summary-line"><strong>${i + 1}. ${s.name}</strong>${s.isAddOn ? ' <span style="font-size:.7rem;background:var(--charcoal);color:#fff;padding:2px 9px;border-radius:12px;">Add-On</span>' : ''}<div style="color:var(--grey-mid);font-size:.88rem;">${s.duration} minutes</div></div>`).join('')}
      <div class="summary-line"><strong>Date:</strong> ${selectedDate.toDateString()}</div>
      <div class="summary-line"><strong>Time:</strong> ${selectedTime}</div>
      <div class="summary-line"><strong>Total Duration:</strong> ${totalDuration} minutes</div>
      <div class="summary-line"><strong>Total Price:</strong> ${fmt(totalPrice)}</div>
      <div class="deposit-box"><strong>Total Deposit Required:</strong> ${fmt(totalDeposit)}</div>
    </div>
    <div class="form-grid">
      <input id="f-name" placeholder="Full Name" value="${formData.fullName}" />
      <input id="f-email" type="email" placeholder="Email Address" value="${formData.email}" />
      <input id="f-phone" type="tel" placeholder="Phone Number" value="${formData.phone}" />
      <select id="f-staff">
        <option value="">Select Technician (Optional)</option>
        ${staff.map((s) => `<option value="${s.name}">${s.name}</option>`).join('')}
      </select>
      <div class="btn-row">
        <button class="btn-back" id="step2-back" type="button">Back</button>
        <button class="nextButton" id="step2-next" type="button">Review Policy &amp; Deposit</button>
      </div>
    </div>
  `;
}

function renderStep3() {
  return `
    <div class="confirm-box">
      <span class="checkmark">✓</span>
      <h2>Booking Confirmed!</h2>
      <p>Thank you, ${formData.fullName || 'guest'}. Your deposit has been received.</p>
      <button class="btn-primary" id="step3-home">Back to Services</button>
    </div>
  `;
}

function renderBooking() {
  const titles = ['Select Time', 'Details', 'Confirm'];
  $('#content').innerHTML = `
    <div class="booking-panel">
      <div class="progress">
        ${titles.map((t, i) => `<div class="progress-step${step >= i + 1 ? ' active' : ''}">${t}</div>`).join('')}
      </div>
      <div id="booking-step">${step === 1 ? renderStep1() : step === 2 ? renderStep2() : renderStep3()}</div>
    </div>
  `;
}

// ---- Policy / payment modal ----

function openPolicyModal() {
  $('#policy-backdrop').classList.add('active');
}
function closePolicyModal() {
  $('#policy-backdrop').classList.remove('active');
}

function completeBooking() {
  closePolicyModal();
  cart.length = 0;
  updateCartPill();
  step = 3;
  renderBooking();
}

// ---- Events ----

document.addEventListener('click', (e) => {
  const addBtn = e.target.closest('[data-add]');
  if (addBtn) { addToCart(services.find((s) => s.id === addBtn.dataset.add)); return; }

  const bookBtn = e.target.closest('[data-book]');
  if (bookBtn) { startBooking(bookBtn.dataset.book); return; }

  if (e.target.closest('[data-view-cart], #cart-pill')) {
    bookingServices = [...cart];
    if (bookingServices.length) { step = 1; selectedTime = null; renderBooking(); }
    return;
  }

  const dayEl = e.target.closest('[data-date]');
  if (dayEl) { selectedDate = new Date(dayEl.dataset.date); selectedTime = null; renderBooking(); return; }

  const slotEl = e.target.closest('[data-slot]');
  if (slotEl && slotEl.dataset.slot) { selectedTime = slotEl.dataset.slot; renderBooking(); return; }

  if (e.target.closest('#step1-next')) { step = 2; renderBooking(); return; }
  if (e.target.closest('#step2-back')) { step = 1; renderBooking(); return; }

  if (e.target.closest('#step2-next')) {
    formData.fullName = $('#f-name').value.trim();
    formData.email = $('#f-email').value.trim();
    formData.phone = $('#f-phone').value.trim();
    formData.staff = $('#f-staff').value;
    if (!formData.fullName || !formData.email || !formData.phone) {
      alert('Please fill in your name, email, and phone to continue.');
      return;
    }
    openPolicyModal();
    return;
  }

  if (e.target.closest('#policy-agree')) { completeBooking(); return; }
  if (e.target.closest('#policy-cancel')) { closePolicyModal(); return; }

  if (e.target.closest('#step3-home')) { renderServices(); return; }
  if (e.target.closest('#nav-logo, #nav-logo-2')) { renderServices(); return; }
});

function initGate() {
  $('#enter-demo').addEventListener('click', () => {
    $('#gate').style.display = 'none';
    $('#app').classList.add('active');
    renderServices();
  });
}

initGate();
