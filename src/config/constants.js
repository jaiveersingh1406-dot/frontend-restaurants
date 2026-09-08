export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "https://restaurants-8.onrender.com";

export const STORAGE_KEYS = {
  TOKEN: "platia_token",
  USER: "platia_user",
  LAST_LOGIN: "platia_last_login",
  CART: "platia_cart",
};

export const ORDER_STATUSES = ["Pending", "Preparing", "Completed", "Cancelled"];

export function parsePrice(value) {
  if (typeof value === "number") return value;

  const parsed = parseFloat(String(value).replace(/[^\d.]/g, ""));

  return Number.isNaN(parsed) ? 0 : parsed;
}

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const PRODUCT_CATEGORIES = [
  "Main Course",
  "Special",
  "Signature",
  "Dessert",
];

export const PRODUCT_STATUSES = ["Available", "Low Stock", "Unavailable"];

export const PRODUCT_FORM_TEMPLATE = {
  name: "",
  description: "",
  category: PRODUCT_CATEGORIES[0],
  price: "",
  stock: "",
  status: PRODUCT_STATUSES[0],
  image: "",
};

export const ACCOUNTING_FORM_TEMPLATE = {
  day: WEEKDAYS[0],
  revenue: "",
  expenses: "",
  orders: "",
};

export const RESERVATION_FORM_TEMPLATE = {
  customer_name: "",
  phone: "",
  reservation_date: "",
  time_slot: "",
  guests: "2",
  table_no: "T-01",
  special_request: "",
};

const PLACEHOLDER_SVG = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'>
     <rect width='400' height='300' fill='#1a1a1a'/>
     <circle cx='200' cy='150' r='70' fill='none' stroke='#ffc107' stroke-width='3'/>
     <circle cx='200' cy='150' r='52' fill='none' stroke='#ffc107' stroke-width='1.5' opacity='0.5'/>
     <text x='200' y='160' text-anchor='middle' fill='#ffc107' font-family='Arial' font-size='20' font-weight='bold'>PLATIA</text>
   </svg>`
);

export const IMAGE_PLACEHOLDER = `data:image/svg+xml,${PLACEHOLDER_SVG}`;

export function resolveProductImage(url) {
  if (url && /^https?:\/\//i.test(url)) {
    return url;
  }

  return IMAGE_PLACEHOLDER;
}
