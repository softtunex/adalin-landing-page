import { company, customers, orders as seedOrders, inventory, staff, ledger, revenueTrend } from './data.js';

const orders = [...seedOrders];
const fmt = (n) => '₦' + n.toLocaleString('en-NG');
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const initials = (name) => name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const avatar = (name) => `<span class="avatar">${initials(name)}</span>`;
const person = (name) => `<div class="cell-person">${avatar(name)}<span>${name}</span></div>`;

const icons = {
  wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18"/><path d="M16 14.5h1.5"/></svg>',
  clipboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 3h6a1 1 0 0 1 1 1v1H8V4a1 1 0 0 1 1-1Z"/><path d="M8 11h8M8 15h5"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5 21 19H3L12 3.5Z"/><path d="M12 9.5v4.2"/><circle cx="12" cy="16.7" r=".6" fill="currentColor"/></svg>',
  up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16l6-6 4 4 6-8"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/></svg>',
};

const views = {
  dashboard: renderDashboard,
  orders: renderOrders,
  customers: renderCustomers,
  inventory: renderInventory,
  staff: renderStaff,
  payments: renderPayments,
  reports: renderReports,
};

const titles = {
  dashboard: ['Dashboard', 'A quick look at how the business is doing right now'],
  orders: ['Orders & Bookings', 'Every order, who placed it, and what’s been paid'],
  customers: ['Customers', 'Everyone who has ordered, and what they’ve spent'],
  inventory: ['Inventory', 'Stock on hand, and what needs reordering'],
  staff: ['Staff & Roles', 'Who has access, and to what'],
  payments: ['Payments', 'Money in and out, in one place'],
  reports: ['Reports', 'The numbers, without digging for them'],
};

function statusPill(status) {
  const cls = status === 'Completed' ? 'good' : status === 'Pending balance' ? 'warn' : 'dim';
  return `<span class="pill ${cls}">${status}</span>`;
}

function sparklinePath(data, w, h, pad = 4) {
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const step = (w - pad * 2) / (data.length - 1);
  const points = data.map((v, i) => {
    const x = pad + i * step;
    const y = pad + (1 - (v - min) / range) * (h - pad * 2);
    return [x, y];
  });
  const line = points.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const area = line + ` L${points[points.length - 1][0].toFixed(1)},${h} L${points[0][0].toFixed(1)},${h} Z`;
  return { line, area, last: points[points.length - 1] };
}

function renderTrendChart() {
  const w = 560, h = 120;
  const { line, area, last } = sparklinePath(revenueTrend, w, h);
  return `
    <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="width:100%;height:${h}px;overflow:visible;">
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FE6007" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#FE6007" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="${area}" fill="url(#trendFill)" />
      <path d="${line}" fill="none" stroke="#FE6007" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="${last[0]}" cy="${last[1]}" r="4" fill="#FE6007" style="stroke:var(--surface)" stroke-width="2" />
    </svg>
  `;
}

function renderDashboard() {
  const totalRevenue = orders.reduce((s, o) => s + o.paid, 0);
  const pendingBalance = orders.filter((o) => o.status === 'Pending balance').length;
  const lowStock = inventory.filter((i) => i.status === 'Low').length;
  const recent = orders.slice(0, 5);
  return `
    <div class="stat-grid">
      <div class="stat">
        <div class="stat-top"><div class="stat-icon">${icons.wallet}</div><div class="stat-trend up">${icons.up}+12%</div></div>
        <div class="val">${fmt(totalRevenue)}</div><div class="label">Collected this month</div>
      </div>
      <div class="stat">
        <div class="stat-top"><div class="stat-icon">${icons.clipboard}</div></div>
        <div class="val">${orders.length}</div><div class="label">Total orders</div>
      </div>
      <div class="stat">
        <div class="stat-top"><div class="stat-icon warn">${icons.clock}</div></div>
        <div class="val">${pendingBalance}</div><div class="label">Awaiting balance</div>
      </div>
      <div class="stat">
        <div class="stat-top"><div class="stat-icon warn">${icons.alert}</div></div>
        <div class="val">${lowStock}</div><div class="label">Items low on stock</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-head"><div><h3>Revenue trend</h3><div class="meta">Last 8 weeks</div></div></div>
        <div class="card-body">${renderTrendChart()}</div>
      </div>
      <div class="card">
        <div class="card-head"><h3>Recent orders</h3><button class="btn-ghost" data-nav="orders">View all</button></div>
        <table>
          <tbody>${recent.map((o) => `<tr><td>${person(o.customer)}</td><td class="num" style="text-align:right">${fmt(o.total)}</td></tr>`).join('')}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderOrders() {
  return `
    <div class="card">
      <div class="card-head"><h3>All orders</h3><button class="btn" id="new-order-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" width="14" height="14"><path d="M12 5v14M5 12h14"/></svg>New order</button></div>
      <table>
        <thead><tr><th>Order</th><th>Customer</th><th>Item</th><th>Status</th><th class="num">Total</th><th class="num">Paid</th><th>Due</th></tr></thead>
        <tbody>${orders.map((o) => `<tr><td>${o.id}</td><td>${person(o.customer)}</td><td>${o.item}</td><td>${statusPill(o.status)}</td><td class="num">${fmt(o.total)}</td><td class="num">${fmt(o.paid)}</td><td>${o.due}</td></tr>`).join('')}</tbody>
      </table>
    </div>
  `;
}

function renderCustomers() {
  return `
    <div class="card">
      <div class="card-head"><h3>Customers</h3></div>
      <table>
        <thead><tr><th>Name</th><th>Phone</th><th>Customer since</th><th class="num">Total spent</th></tr></thead>
        <tbody>${customers.map((c) => `<tr><td>${person(c.name)}</td><td>${c.phone}</td><td>${c.since}</td><td class="num">${fmt(c.total)}</td></tr>`).join('')}</tbody>
      </table>
    </div>
  `;
}

function renderInventory() {
  return `
    <div class="card">
      <div class="card-head"><h3>Stock on hand</h3></div>
      <table>
        <thead><tr><th>Item</th><th>Unit</th><th class="num">On hand</th><th class="num">Reorder at</th><th>Status</th></tr></thead>
        <tbody>${inventory.map((i) => `<tr><td>${i.name}</td><td>${i.unit}</td><td class="num">${i.onHand}</td><td class="num">${i.reorderAt}</td><td><span class="pill ${i.status === 'Low' ? 'warn' : 'good'}">${i.status}</span></td></tr>`).join('')}</tbody>
      </table>
    </div>
  `;
}

function renderStaff() {
  return `
    <div class="card">
      <div class="card-head"><h3>Team</h3></div>
      <table>
        <thead><tr><th>Name</th><th>Role</th><th>Access</th></tr></thead>
        <tbody>${staff.map((s) => `<tr><td>${person(s.name)}</td><td>${s.role}</td><td>${s.access}</td></tr>`).join('')}</tbody>
      </table>
    </div>
  `;
}

function renderPayments() {
  let running = 0;
  const rows = ledger.map((l) => { running += l.amount; return { ...l, running }; });
  return `
    <div class="card">
      <div class="card-head"><h3>Ledger</h3></div>
      <table>
        <thead><tr><th>Date</th><th>Description</th><th class="num">Amount</th><th class="num">Balance</th></tr></thead>
        <tbody>${rows.map((l) => `<tr><td>${l.date}</td><td>${l.desc}</td><td class="num" style="color:${l.amount < 0 ? 'var(--warn)' : 'var(--good)'}">${l.amount < 0 ? '-' : '+'}${fmt(Math.abs(l.amount))}</td><td class="num">${fmt(l.running)}</td></tr>`).join('')}</tbody>
      </table>
    </div>
  `;
}

function renderReports() {
  const totalIn = ledger.filter((l) => l.amount > 0).reduce((s, l) => s + l.amount, 0);
  const totalOut = ledger.filter((l) => l.amount < 0).reduce((s, l) => s + l.amount, 0);
  const avgOrder = Math.round(orders.reduce((s, o) => s + o.total, 0) / orders.length);
  return `
    <div class="stat-grid">
      <div class="stat"><div class="stat-top"><div class="stat-icon good">${icons.wallet}</div></div><div class="val">${fmt(totalIn)}</div><div class="label">Total in, this period</div></div>
      <div class="stat"><div class="stat-top"><div class="stat-icon warn">${icons.wallet}</div></div><div class="val">${fmt(Math.abs(totalOut))}</div><div class="label">Total out, this period</div></div>
      <div class="stat"><div class="stat-top"><div class="stat-icon">${icons.clipboard}</div></div><div class="val">${fmt(avgOrder)}</div><div class="label">Average order value</div></div>
      <div class="stat"><div class="stat-top"><div class="stat-icon">${icons.spark}</div></div><div class="val">${customers.length}</div><div class="label">Active customers</div></div>
    </div>
    <div class="banner">${icons.up}In the real system, every number on this page is live, it updates the moment an order or payment is logged. Nothing is typed twice.</div>
  `;
}

function go(view) {
  $$('.nav-item').forEach((el) => el.classList.toggle('active', el.dataset.view === view));
  $('#content').innerHTML = views[view]();
  const [title, sub] = titles[view];
  $('#view-title').textContent = title;
  $('#view-sub').textContent = sub;
  window.scrollTo(0, 0);
}

// One delegated listener for all nav clicks, including buttons re-rendered
// inside #content, instead of rebinding listeners on every render.
document.addEventListener('click', (e) => {
  const navEl = e.target.closest('[data-nav]');
  if (navEl) { go(navEl.dataset.nav); return; }
  if (e.target.closest('#new-order-btn')) openOrderModal();
});

function openOrderModal() {
  $('#modal-backdrop').classList.add('active');
}
function closeOrderModal() {
  $('#modal-backdrop').classList.remove('active');
  $('#order-form').reset();
}

function initModal() {
  $('#order-cancel').addEventListener('click', closeOrderModal);
  $('#modal-backdrop').addEventListener('click', (e) => { if (e.target.id === 'modal-backdrop') closeOrderModal(); });
  $('#order-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const total = Number(fd.get('total')) || 0;
    orders.unshift({
      id: 'OB-' + (109 + orders.length),
      customer: fd.get('customer') || 'New customer',
      item: fd.get('item') || 'New order',
      status: 'Confirmed',
      due: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10),
      total,
      paid: 0,
    });
    closeOrderModal();
    go('orders');
  });
}

function initTheme() {
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem('everline-theme'); } catch { /* private window etc, fall through to system */ }
  if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);

  $('#theme-toggle').addEventListener('click', () => {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const current = root.getAttribute('data-theme') || (systemDark ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('everline-theme', next); } catch { /* ignore, toggle still works for this view */ }
  });
}

function initGate() {
  $('#company-name').textContent = company.name;
  $('#company-tagline').textContent = company.tagline;
  $('#enter-demo').addEventListener('click', () => {
    $('#gate').style.display = 'none';
    $('#app').classList.add('active');
    go('dashboard');
  });
}

initTheme();
initGate();
initModal();
