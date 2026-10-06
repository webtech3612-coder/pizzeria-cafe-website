export const restaurant = {
  name: 'Pizzeria Cafe',
  tagline: 'The Real Taste of Happiness',
  phone: '9310912659',
  whatsapp: '919310912659',
  address: 'Shop No. 4, Opp. Rajeev Arora Provision Store, Near Auto Stand, Ghukna, Ghaziabad, Uttar Pradesh',
  hours: '10:00 AM–10:00 PM',
  vegetarian: true,
  directionsUrl: 'https://maps.app.goo.gl/7onhh399CkAdeUW66',
  delivery: { label: 'Free home delivery', minimumOrder: 300, minimumLabel: 'Rs. 300/-' },
};

export type MenuSize = { name: string; price: number };
export type MenuItem = {
  id: string;
  name: string;
  category: string;
  note?: string;
  sizes?: MenuSize[];
  price?: number;
  verify?: string;
};

const pizzaSizes = (regular: number, medium: number, large: number): MenuSize[] => [
  { name: 'Regular', price: regular },
  { name: 'Medium', price: medium },
  { name: 'Large', price: large },
];

export const menuCategories = [
  'Pan Pizza',
  'Single Topping Pizza',
  'Veg Lover',
  'Veg Treat',
  'Veg Special',
  'Veg Feast Pizza',
  'Double Topping Pizza',
  'Extra Cheese',
  'Pasta',
  'French Fries',
  'Side Order',
  'Burgers',
  'More Snacks',
  'Set of Four',
  'Meal for Family',
  'Combo - 1',
  'Combo - 2',
  'Combo - 3',
];

export const menuItems: MenuItem[] = [
  ...[
    ['Onion Pizza', 60, 120, 200],
    ['Corn Pizza', 60, 120, 200],
    ['Capsicum Pizza', 60, 120, 200],
    ['Tomato Pizza', 60, 120, 200],
    ['Paneer Pizza', 80, 150, 250],
  ].map(([name, r, m, l]) => ({ id: `pan-${String(name).toLowerCase().replaceAll(' ', '-')}`, name: String(name), category: 'Pan Pizza', sizes: pizzaSizes(Number(r), Number(m), Number(l)) })),
  ...[
    ['Cheese & Garden Corn', 100, 180, 290],
    ['Cheese & Onion', 100, 180, 290],
    ['Cheese & Tomato', 100, 180, 290],
    ['Cheese & Capsicum', 100, 180, 290],
    ['Cheese & Paneer', 100, 180, 290],
  ].map(([name, r, m, l]) => ({ id: `single-${String(name).toLowerCase().replaceAll(/[^a-z]+/g, '-')}`, name: String(name), category: 'Single Topping Pizza', sizes: pizzaSizes(Number(r), Number(m), Number(l)) })),
  { id: 'margherita', name: 'Margherita Pizza', category: 'Veg Lover', sizes: pizzaSizes(100, 180, 290) },
  { id: 'double-cheese-paneer', name: 'Double Cheese Paneer Pizza', category: 'Veg Lover', sizes: pizzaSizes(120, 200, 320) },
  { id: 'mix-veg-pizza', name: 'Mix Veg Pizza', category: 'Veg Lover', sizes: pizzaSizes(100, 180, 290) },
  { id: 'farm-fresh-pizza', name: 'Farm Fresh Pizza', category: 'Veg Treat', note: 'Toppings description needs manual verification.', sizes: pizzaSizes(120, 190, 330) },
  { id: 'mexican-pizza', name: 'Mexican Farm Fresh Pizza', category: 'Veg Treat', note: 'Toppings description needs manual verification.', sizes: pizzaSizes(130, 200, 370) },
  { id: 'deluxe-veggie-pizza', name: 'Deluxe Veg Pizza', category: 'Veg Treat', note: 'Toppings description needs manual verification.', sizes: pizzaSizes(120, 180, 330) },
  { id: 'tasty-pizza', name: 'Tasty Pizza', category: 'Veg Treat', note: 'Toppings description needs manual verification.', sizes: pizzaSizes(140, 210, 360) },
  { id: 'spicy-paneer-pizza', name: 'Spicy Paneer Pizza', category: 'Veg Treat', note: 'Toppings description needs manual verification.', sizes: pizzaSizes(120, 190, 350) },
  { id: 'extra-veg-pizza', name: 'Extra Veg Pizza', category: 'Veg Special', note: 'Buy 1 Get 1 Free offer applies to Veg Special pizzas on Tuesday & Thursday.', sizes: pizzaSizes(170, 300, 430) },
  { id: 'supreme-veg-pizza', name: 'Supreme Veg Pizza', category: 'Veg Special', note: 'Buy 1 Get 1 Free offer applies to Veg Special pizzas on Tuesday & Thursday.', sizes: pizzaSizes(160, 290, 390) },
  { id: 'tandoori-pizza', name: 'Tandoori Pizza', category: 'Veg Special', note: 'Buy 1 Get 1 Free offer applies to Veg Special pizzas on Tuesday & Thursday.', sizes: pizzaSizes(160, 270, 400) },
  { id: 'makhani-pizza', name: 'Makhani Pizza', category: 'Veg Special', note: 'Buy 1 Get 1 Free offer applies to Veg Special pizzas on Tuesday & Thursday.', sizes: pizzaSizes(150, 270, 400) },
  { id: 'italian-pizza', name: 'Italian Pizza', category: 'Veg Feast Pizza', note: 'Buy 1 Get 1 Free offer applies to Veg Feast pizzas on Tuesday & Thursday.', sizes: pizzaSizes(170, 300, 430) },
  { id: 'veg-feast-special', name: 'Printed variety name unclear', category: 'Veg Feast Pizza', note: 'Buy 1 Get 1 Free applies to Veg Feast pizzas on Tuesday & Thursday.', sizes: pizzaSizes(150, 270, 380), verify: 'Printed variety name needs manual verification.' },
  { id: 'country-feast', name: 'Country Feast', category: 'Veg Feast Pizza', note: 'Buy 1 Get 1 Free offer applies to Veg Feast pizzas on Tuesday & Thursday.', sizes: pizzaSizes(200, 330, 500) },
  { id: 'paneer-tikka-pizza', name: 'Paneer Tikka Pizza', category: 'Veg Feast Pizza', note: 'Buy 1 Get 1 Free offer applies to Veg Feast pizzas on Tuesday & Thursday.', sizes: pizzaSizes(200, 330, 500) },
  { id: 'wow-pizza', name: 'Wow Pizza', category: 'Veg Feast Pizza', note: 'Buy 1 Get 1 Free offer applies to Veg Feast pizzas on Tuesday & Thursday.', sizes: pizzaSizes(250, 380, 550) },
  ...[
    ['Onion & Corn', 70, 140, 230],
    ['Corn & Capsicum', 70, 140, 230],
    ['Corn & Paneer', 90, 160, 250],
    ['Green Chilli & Paneer Pizza', 100, 180, 300],
    ['Triple Topping Pizza', 110, 180, 270],
    ['Corn & Mushroom Pizza', 100, 160, 290],
  ].map(([name, r, m, l]) => ({ id: `double-${String(name).toLowerCase().replaceAll(/[^a-z]+/g, '-')}`, name: String(name), category: 'Double Topping Pizza', sizes: pizzaSizes(Number(r), Number(m), Number(l)) })),
  { id: 'extra-cheese', name: 'Extra Cheese', category: 'Extra Cheese', sizes: pizzaSizes(20, 30, 60) },
  { id: 'pasta-red-sauce', name: 'Pasta Red Sauce', category: 'Pasta', price: 100 },
  { id: 'pasta-white-sauce', name: 'Pasta White Sauce', category: 'Pasta', price: 100 },
  { id: 'pasta-mix-sauce', name: 'Pasta Mix Sauce', category: 'Pasta', price: 100 },
  { id: 'tandoori-pasta', name: 'Tandoori Pasta', category: 'Pasta', price: 120 },
  { id: 'makhani-pasta', name: 'Makhani Pasta', category: 'Pasta', price: 120 },
  { id: 'french-fries-salted', name: 'French Fries Salted', category: 'French Fries', price: 70 },
  { id: 'french-fries-peri-peri', name: 'French Fries Peri Peri', category: 'French Fries', price: 80 },
  { id: 'choco-lava', name: 'Chocolava', category: 'Side Order', price: 70 },
  { id: 'stuffed-garlic-bread', name: 'Stuffed Garlic Bread', category: 'Side Order', price: 100 },
  { id: 'calzone-pocket', name: 'Calzone Pocket', category: 'Side Order', price: 100 },
  { id: 'cheese-dip', name: 'Cheese Dip', category: 'Side Order', price: 20 },
  { id: 'burger-normal', name: 'Burger Normal', category: 'Burgers', price: 50 },
  { id: 'burger-spicy', name: 'Burger Spicy', category: 'Burgers', price: 60 },
  { id: 'burger-paneer', name: 'Burger Paneer', category: 'Burgers', price: 70 },
  { id: 'burger-pizza', name: 'Burger Pizza', category: 'More Snacks', price: 80 },
  { id: 'set-of-four', name: 'Set of Four', category: 'Set of Four', note: 'Onion, corn, capsicum, tomato', price: 220 },
  { id: 'meal-for-family', name: 'Meal for Family', category: 'Meal for Family', note: 'Mix veg regular pizza, 1 burger & 250ml Coke', price: 130 },
  { id: 'combo-1', name: 'Combo - 1', category: 'Combo - 1', note: '1 medium Mix Veg pizza, 750ml Coke & 1 garlic bread', price: 249 },
  { id: 'combo-2', name: 'Combo - 2', category: 'Combo - 2', note: '1 Farm Fresh medium pizza, calzone pocket & 750ml Coke', price: 290 },
  { id: 'combo-3', name: 'Combo - 3', category: 'Combo - 3', note: '2 medium pizzas, 1 garlic bread & 750ml Coke', price: 499 },
];

export const offers = [
  {
    title: 'Buy 1 Get 1 Free',
    description: 'On Veg Special & Veg Feast Pizza',
    timing: 'Tuesday & Thursday',
    category: 'Weekly offer',
  },
];

export const gallery = [
  { src: '/images/cafe-interior-seating.jpeg', alt: 'Colorful dining area and seating inside Pizzeria Cafe in Ghukna', label: 'A seat at the cafe', kind: 'Cafe' },
  { src: '/images/cafe-interior-counter.jpeg', alt: 'The colorful counter and illuminated interior at Pizzeria Cafe', label: 'The cafe counter', kind: 'Ambience' },
  { src: '/images/pizzeria-branding.jpeg', alt: 'Pizzeria Cafe orange-and-cream food branding and cafe details', label: 'Pizzeria Cafe branding', kind: 'Cafe' },
  { src: '/images/pizzeria-menu.jpeg', alt: 'Printed blackboard-style Pizzeria Cafe menu', label: 'The printed menu', kind: 'Menu' },
];

export const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Menu', href: '#menu' },
  { label: 'Offers', href: '#offers' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Visit Us', href: '#visit' },
  { label: 'Contact', href: '#contact' },
];

export const whatsappLink = (message: string) => `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(message)}`;
export const formatPrice = (value: number) => `₹${value}`;
