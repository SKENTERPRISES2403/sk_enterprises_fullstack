const runtimeApiBase = `${window.location.protocol}//${window.location.hostname}:8000/api`;
export const API_BASE = import.meta.env.VITE_API_URL || runtimeApiBase;
export const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");
export const whatsappNumber = "919415216320";
export const callNumber = "917007062590";
export const mapsUrl =
  "https://www.google.com/maps/place/S.K.+Enterprises/@25.4185751,81.9310271,94m/data=!3m1!1e3!4m6!3m5!1s0x39854b0f57259867:0xc30f389d3b657a9!8m2!3d25.4185216!4d81.9311958!16s%2Fg%2F11w3ckv82g?entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D";

export const categories = [
  "CP Fittings",
  "Sanitaryware",
  "Tiles",
  "Water Tanks",
  "Pipes",
  "Kitchen Sinks",
  "Construction Chemicals",
];

export const orderStatuses = [
  "New Order",
  "Confirmed",
  "Packed",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export const leadStatuses = ["New", "Contacted", "Converted", "Closed"];

export const demoProducts = [
  {
    id: "demo-essel-cp",
    name: "ESSEL CP Fittings Set",
    brand: "ESSEL",
    category: "CP Fittings",
    price: 0,
    mrp: 0,
    stock: 25,
    warranty: "Company warranty",
    description: "Chrome finish taps, mixers and CP bathroom fittings.",
    image_url: "/assets/essel_taps2.jpg",
    featured: true,
  },
  {
    id: "demo-black-taps",
    name: "Matte Black Tap Collection",
    brand: "TOYO / ESSEL",
    category: "CP Fittings",
    price: 0,
    mrp: 0,
    stock: 18,
    warranty: "As per brand",
    description: "Premium matte black fittings for modern bathrooms.",
    image_url: "/assets/black_taps.jpg",
    featured: true,
  },
  {
    id: "demo-toilet",
    name: "Birla Pivot Western Toilet",
    brand: "Birla Pivot",
    category: "Sanitaryware",
    price: 0,
    mrp: 0,
    stock: 12,
    warranty: "Brand warranty",
    description: "Modern western toilet and sanitaryware options.",
    image_url: "/assets/birla_toilet.jpg",
    featured: true,
  },
  {
    id: "demo-tiles",
    name: "Floor & Wall Tiles",
    brand: "Somany / Oasis / Nexcera",
    category: "Tiles",
    price: 0,
    mrp: 0,
    stock: 400,
    warranty: "",
    description: "Ceramic, vitrified and porcelain tile range.",
    image_url: "/assets/tiles.jpg",
    featured: true,
  },
  {
    id: "demo-tanks",
    name: "Water Tanks",
    brand: "Sintex / Supreme",
    category: "Water Tanks",
    price: 0,
    mrp: 0,
    stock: 14,
    warranty: "Brand warranty",
    description: "Durable water storage tanks for home and project use.",
    image_url: "/assets/tanks.jpg",
    featured: true,
  },
  {
    id: "demo-sink",
    name: "Kitchen Sink Range",
    brand: "Nirali / ESSEL / Gunjan",
    category: "Kitchen Sinks",
    price: 0,
    mrp: 0,
    stock: 20,
    warranty: "As per brand",
    description: "Scratch-resistant kitchen sinks in multiple sizes.",
    image_url: "/assets/sink.jpg",
    featured: true,
  },
  {
    id: "demo-roff",
    name: "Roff Tile Adhesive",
    brand: "Roff by Pidilite",
    category: "Construction Chemicals",
    price: 0,
    mrp: 0,
    stock: 75,
    warranty: "",
    description: "Tile and stone fixing adhesives, grouts and chemicals.",
    image_url: "/assets/roff.jpg",
    featured: true,
  },
  {
    id: "demo-pipes",
    name: "Supreme & Ashirvad Pipes",
    brand: "Supreme / Ashirvad",
    category: "Pipes",
    price: 0,
    mrp: 0,
    stock: 200,
    warranty: "Brand warranty",
    description: "Plumbing pipes and fittings for residential and project needs.",
    image_url: "/assets/shop.jpg",
    featured: false,
  },
];

export const defaultGallery = [
  {
    id: "gallery-shop",
    title: "Showroom Exterior",
    caption: "S.K. Enterprises storefront on Kanihar Road.",
    image_url: "/assets/shop.jpg",
    position: 1,
  },
  {
    id: "gallery-wall",
    title: "Dealership Wall",
    caption: "Authorized dealer boards and brand display.",
    image_url: "/assets/showroom_wall.jpg",
    position: 2,
  },
  {
    id: "gallery-sanitary",
    title: "Sanitaryware Display",
    caption: "Premium bath fittings, sanitaryware and CP collection.",
    image_url: "/assets/gallery2.jpg",
    position: 3,
  },
  {
    id: "gallery-tiles",
    title: "Tiles Collection",
    caption: "Floor, wall and bathroom tile samples.",
    image_url: "/assets/tile_samples.jpg",
    position: 4,
  },
  {
    id: "gallery-essel",
    title: "CP Fittings Range",
    caption: "ESSEL and TOYO tap collections.",
    image_url: "/assets/essel_taps2.jpg",
    position: 5,
  },
  {
    id: "gallery-roff",
    title: "Roff by Pidilite",
    caption: "Tile adhesive and construction chemicals.",
    image_url: "/assets/roff.jpg",
    position: 6,
  },
];

export function imageUrl(url) {
  if (!url) return "/assets/shop.jpg";
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  if (url.startsWith("/uploads")) return `${API_ORIGIN}${url}`;
  return url;
}

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  if (options.body && !(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body: options.body && !(options.body instanceof FormData) ? JSON.stringify(options.body) : options.body,
  });
  if (!response.ok) {
    let detail = "Request failed";
    try {
      const error = await response.json();
      detail = error.detail || detail;
    } catch {
      detail = response.statusText;
    }
    throw new Error(detail);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  getProducts: () => request("/products"),
  getCategories: () => request("/categories"),
  getGallery: () => request("/gallery"),
  productDetail: (id) => request(`/products/${id}`),
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  myOrders: (token) => request("/orders/my", { token }),
  createOrder: (payload, token) => request("/orders", { method: "POST", token, body: payload }),
  dashboard: (token) => request("/admin/dashboard", { token }),
  adminOrders: (token) => request("/admin/orders", { token }),
  adminLeads: (token) => request("/admin/leads", { token }),
  createProduct: (payload, token) => request("/admin/products", { method: "POST", token, body: payload }),
  updateProduct: (id, payload, token) => request(`/admin/products/${id}`, { method: "PUT", token, body: payload }),
  deleteProduct: (id, token) => request(`/admin/products/${id}`, { method: "DELETE", token }),
  updateOrderStatus: (id, status, token) => request(`/admin/orders/${id}/status`, { method: "PATCH", token, body: { status } }),
  updateLeadStatus: (id, status, token) => request(`/admin/leads/${id}/status`, { method: "PATCH", token, body: { status } }),
  createStaff: (payload, token) => request("/owner/users", { method: "POST", token, body: payload }),
  createLead: (payload) => request("/leads", { method: "POST", body: payload }),
  createGalleryItem: (payload, token) => request("/admin/gallery", { method: "POST", token, body: payload }),
  updateGalleryItem: (id, payload, token) => request(`/admin/gallery/${id}`, { method: "PUT", token, body: payload }),
  deleteGalleryItem: (id, token) => request(`/admin/gallery/${id}`, { method: "DELETE", token }),
  uploadImage: (file, token) => {
    const fd = new FormData();
    fd.append("file", file);
    return request("/admin/uploads/image", { method: "POST", token, body: fd });
  },
};
