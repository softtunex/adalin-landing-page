// Representative service data for the demo, not live customer records.
// Modelled on LashBabe's real content schema (Name, Duration, Price,
// OnSalesPrice, OnSaleTitle, IsAddOn, Deposit).
export const services = [
  {
    id: 'classic', name: 'Classic Lash Set', duration: 90, price: 25000,
    onSalesPrice: 20000, onSaleTitle: 'New Client Special', isAddOn: false, deposit: 5000,
  },
  {
    id: 'hybrid', name: 'Hybrid Lash Set', duration: 105, price: 30000,
    onSalesPrice: null, onSaleTitle: null, isAddOn: false, deposit: 7000,
  },
  {
    id: 'volume', name: 'Volume Lash Set', duration: 120, price: 35000,
    onSalesPrice: null, onSaleTitle: null, isAddOn: false, deposit: 8000,
  },
  {
    id: 'lift', name: 'Lash Lift & Tint', duration: 60, price: 18000,
    onSalesPrice: null, onSaleTitle: null, isAddOn: false, deposit: 4000,
  },
  {
    id: 'fill', name: 'Lash Fill (2 weeks)', duration: 75, price: 15000,
    onSalesPrice: null, onSaleTitle: null, isAddOn: false, deposit: 3000,
  },
  {
    id: 'lower', name: 'Lower Lash Extensions', duration: 20, price: 5000,
    onSalesPrice: null, onSaleTitle: null, isAddOn: true, deposit: 1000,
  },
];

export const staff = [
  { id: 1, name: 'Amaka' },
  { id: 2, name: 'Precious' },
  { id: 3, name: 'Ivie' },
];

export const bookingSettings = {
  startHour: 9,
  endHour: 18,
  slotMinutes: 60,
  windowHours: 24,
};
