import { company, customers, orders as seedOrders, inventory, staff, ledger } from './data.js';

const orders = [...seedOrders];
const fmt = (n) => '₦' + n.toLocaleString('en-NG');
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

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

function renderDashboard() {
  const totalRevenue = orders.reduce((s, o) => s + o.paid, 0);
  const pendingBalance = orders.filter((o) => o.status === 'Pending balance').length;
  const lowStock = inventory.filter((i) => i.status === 'Low').length;
  const recent = orders.slice(0, 5);
  return `
    <div class="stat-grid">
      <div class="stat"><div class="val">${fmt(totalRevenue)}</div><div class="label">Collected this month</div></div>
      <div class="stat"><div class="val">${orders.length}</div><div class="label">Total orders</div></div>
      <div class="stat"><div class="val">${pendingBalance}</div><div class="label">Awaiting balance</div></div>
      <div class="stat"><div class="val">${lowStock}</div><div class="label">Items low on stock</div></div>
    </div>
    <div class="card">
      <div class="card-head"><h3>Recent orders</h3><button class="btn-ghost" data-nav="orders">View all</button></div>
      <table>
        <thead><tr><th>Order</th><th>Customer</th><th>Status</th><th class="num">Total</th></tr></thead>
        <tbody>${recent.map((o) => `<tr><td>${o.id}</td><td>${o.customer}</td><td>${statusPill(o.status)}</td><td class="num">${fmt(o.total)}</td></tr>`).join('')}</tbody>
      </table>
    </div>
  `;
}

function renderOrders() {
  return `
    <div class="card">
      <div class="card-head"><h3>All orders</h3><button class="btn" id="new-order-btn">+ New order</button></div>
      <table>
        <thead><tr><th>Order</th><th>Customer</th><th>Item</th><th>Status</th><th class="num">Total</th><th class="num">Paid</th><th>Due</th></tr></thead>
        <tbody>${orders.map((o) => `<tr><td>${o.id}</td><td>${o.customer}</td><td>${o.item}</td><td>${statusPill(o.status)}</td><td class="num">${fmt(o.total)}</td><td class="num">${fmt(o.paid)}</td><td>${o.due}</td></tr>`).join('')}</tbody>
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
        <tbody>${customers.map((c) => `<tr><td>${c.name}</td><td>${c.phone}</td><td>${c.since}</td><td class="num">${fmt(c.total)}</td></tr>`).join('')}</tbody>
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
        <tbody>${staff.map((s) => `<tr><td>${s.name}</td><td>${s.role}</td><td>${s.access}</td></tr>`).join('')}</tbody>
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
      <div class="stat"><div class="val">${fmt(totalIn)}</div><div class="label">Total in, this period</div></div>
      <div class="stat"><div class="val">${fmt(Math.abs(totalOut))}</div><div class="label">Total out, this period</div></div>
      <div class="stat"><div class="val">${fmt(avgOrder)}</div><div class="label">Average order value</div></div>
      <div class="stat"><div class="val">${customers.length}</div><div class="label">Active customers</div></div>
    </div>
    <div class="banner">In the real system, every number on this page is live, it updates the moment an order or payment is logged. Nothing is typed twice.</div>
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

function initGate() {
  $('#company-name').textContent = company.name;
  $('#company-tagline').textContent = company.tagline;
  $('#enter-demo').addEventListener('click', () => {
    $('#gate').style.display = 'none';
    $('#app').classList.add('active');
    go('dashboard');
  });
}

initGate();
initModal();
