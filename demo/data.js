// Entirely fictional. No real company, customer, or transaction.
export const company = {
  name: 'Everline',
  tagline: 'Demo workspace — sample data only, not a real business',
};

export const customers = [
  { id: 1, name: 'Tunde Afolabi', phone: '0803 221 4590', since: '2026-04-12', total: 428000 },
  { id: 2, name: 'Chioma Eze', phone: '0906 773 1182', since: '2026-05-03', total: 165000 },
  { id: 3, name: 'Grace Okon', phone: '0812 004 7761', since: '2026-05-21', total: 612500 },
  { id: 4, name: 'Ibrahim Sule', phone: '0705 992 3340', since: '2026-06-09', total: 94000 },
  { id: 5, name: 'Ngozi Umeh', phone: '0814 556 2201', since: '2026-07-02', total: 310000 },
  { id: 6, name: 'Femi Bankole', phone: '0901 338 6675', since: '2026-07-18', total: 48000 },
];

export const orders = [
  { id: 'OB-108', customer: 'Grace Okon', item: 'Service package, 3 sessions', status: 'Confirmed', due: '2026-10-09', total: 185000, paid: 185000 },
  { id: 'OB-107', customer: 'Tunde Afolabi', item: 'Standard booking', status: 'Pending balance', due: '2026-10-08', total: 96000, paid: 50000 },
  { id: 'OB-106', customer: 'Ngozi Umeh', item: 'Consultation + follow-up', status: 'Completed', due: '2026-10-05', total: 72000, paid: 72000 },
  { id: 'OB-105', customer: 'Chioma Eze', item: 'Monthly subscription', status: 'Confirmed', due: '2026-10-12', total: 45000, paid: 45000 },
  { id: 'OB-104', customer: 'Ibrahim Sule', item: 'Single visit', status: 'Pending balance', due: '2026-10-07', total: 38000, paid: 10000 },
  { id: 'OB-103', customer: 'Femi Bankole', item: 'Call-out service', status: 'Completed', due: '2026-10-02', total: 48000, paid: 48000 },
  { id: 'OB-102', customer: 'Grace Okon', item: 'Standard booking', status: 'Completed', due: '2026-09-28', total: 94000, paid: 94000 },
  { id: 'OB-101', customer: 'Tunde Afolabi', item: 'Consultation', status: 'Completed', due: '2026-09-24', total: 35000, paid: 35000 },
];

export const inventory = [
  { id: 1, name: 'Consumable A (box)', unit: 'box', onHand: 42, reorderAt: 15, status: 'OK' },
  { id: 2, name: 'Consumable B (pack)', unit: 'pack', onHand: 8, reorderAt: 10, status: 'Low' },
  { id: 3, name: 'Equipment set, type 1', unit: 'set', onHand: 6, reorderAt: 2, status: 'OK' },
  { id: 4, name: 'Printed materials', unit: 'ream', onHand: 3, reorderAt: 5, status: 'Low' },
  { id: 5, name: 'Spare part, type A', unit: 'unit', onHand: 19, reorderAt: 8, status: 'OK' },
];

export const staff = [
  { id: 1, name: 'Director (you)', role: 'Owner', access: 'Full access' },
  { id: 2, name: 'Adaeze N.', role: 'Front desk', access: 'Orders, customers' },
  { id: 3, name: 'Kelvin O.', role: 'Field staff', access: 'Orders, inventory' },
  { id: 4, name: 'Blessing A.', role: 'Accounts', access: 'Payments, reports' },
];

export const ledger = [
  { id: 1, date: '2026-10-07', desc: 'Payment, OB-108', type: 'In', amount: 185000 },
  { id: 2, date: '2026-10-06', desc: 'Supplier restock, Consumable A', type: 'Out', amount: -64000 },
  { id: 3, date: '2026-10-05', desc: 'Payment, OB-106', type: 'In', amount: 72000 },
  { id: 4, date: '2026-10-05', desc: 'Payment, OB-105', type: 'In', amount: 45000 },
  { id: 5, date: '2026-10-04', desc: 'Staff payroll', type: 'Out', amount: -210000 },
  { id: 6, date: '2026-10-02', desc: 'Payment, OB-103', type: 'In', amount: 48000 },
  { id: 7, date: '2026-10-01', desc: 'Utility bill', type: 'Out', amount: -38000 },
];
