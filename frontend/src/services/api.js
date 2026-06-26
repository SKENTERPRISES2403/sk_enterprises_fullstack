export const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
export const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");
export const whatsappNumber = "919415216320";

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

const uploadAssetMap = {
  "/uploads/essel-logo.png": "/assets/brands/essel-logo.png",
  "/uploads/birla-pivot-logo.jpg": "/assets/brands/birla-pivot-logo.jpg",
  "/uploads/roff-logo.png": "/assets/brands/roff-logo.png",
  "/uploads/supreme-logo.png": "/assets/brands/supreme-logo.png",
  "/uploads/ashirvad-logo.png": "/assets/brands/ashirvad-logo.png",
  "/uploads/cera-logo.png": "/assets/brands/cera-logo.png",
  "/uploads/hindware-logo.png": "/assets/brands/hindware-logo.png",
  "/uploads/sintex-logo.png": "/assets/brands/sintex-logo.png",
  "/uploads/araldite-logo.png": "/assets/brands/araldite-logo.png",
  "/uploads/flowkem-logo.png": "/assets/brands/flowkem-logo.png",
  "/uploads/essel_taps2.jpg": "/assets/essel_taps2.jpg",
  "/uploads/black_taps.jpg": "/assets/black_taps.jpg",
  "/uploads/bathroom_demo.jpg": "/assets/bathroom_demo.jpg",
  "/uploads/birla_pivot_stock.jpg": "/assets/birla_pivot_stock.jpg",
  "/uploads/birla_toilet.jpg": "/assets/birla_toilet.jpg",
  "/uploads/essel.jpg.jpeg": "/assets/essel.jpg.jpeg",
  "/uploads/essel_cert.jpg": "/assets/essel_cert.jpg",
  "/uploads/tiles.jpg": "/assets/tiles.jpg",
  "/uploads/tile_samples.jpg": "/assets/tile_samples.jpg",
  "/uploads/tanks.jpg": "/assets/tanks.jpg",
  "/uploads/shop.jpg": "/assets/shop.jpg",
  "/uploads/shop_exterior.jpg": "/assets/shop_exterior.jpg",
  "/uploads/sink.jpg": "/assets/sink.jpg",
  "/uploads/roff.jpg": "/assets/roff.jpg",
  "/uploads/roff.jpg (2).jpeg": "/assets/roff.jpg (2).jpeg",
  "/uploads/roff_cert.jpg": "/assets/roff_cert.jpg",
  "/uploads/sanitary.jpg": "/assets/sanitary.jpg",
  "/uploads/taps.jpg": "/assets/taps.jpg",
  "/uploads/toyo_taps.jpg": "/assets/toyo_taps.jpg",
  "/uploads/gallery1.jpg": "/assets/gallery1.jpg",
  "/uploads/gallery2.jpg": "/assets/gallery2.jpg",
  "/uploads/gallery3.jpg": "/assets/gallery3.jpg",
  "/uploads/gallery4.jpg": "/assets/gallery4.jpg",
  "/uploads/gallery5.jpg": "/assets/gallery5.jpg",
  "/uploads/gallery6.jpg": "/assets/gallery6.jpg",
  "/uploads/gallery7.jpg": "/assets/gallery7.jpg",
  "/uploads/gallery8.jpg": "/assets/gallery8.jpg",
  "/uploads/showroom_wall.jpg": "/assets/showroom_wall.jpg",
  "/uploads/essel-certificate.jpeg": "/assets/certificates/essel-certificate.jpeg",
  "/uploads/roff-certificate.jpeg": "/assets/certificates/roff-certificate.jpeg",
};

export function imageUrl(url) {
  const value = String(url || "").trim();
  if (!value) return "/assets/shop.jpg";
  if (value.startsWith("http") || value.startsWith("data:")) return value;
  const path = value.split(/[?#]/)[0];
  const suffix = value.slice(path.length);
  if (uploadAssetMap[path]) return `${uploadAssetMap[path]}${suffix}`;
  if (value.startsWith("/uploads")) return `${API_ORIGIN}${value}`;
  return value;
}

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  if (options.body && !(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  const method = String(options.method || "GET").toUpperCase();
  const url = new URL(`${API_BASE}${path}`, window.location.origin);
  if (method === "GET") url.searchParams.set("_fresh", Date.now().toString());
  const { token, body, headers: _headers, ...fetchOptions } = options;
  const response = await fetch(url.toString(), {
    ...fetchOptions,
    method,
    cache: "no-store",
    headers,
    body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
  });
  if (!response.ok) {
    let detail = "Request failed";
    try {
      const error = await response.json();
      detail = error.detail || detail;
    } catch {
      detail = response.statusText;
    }
    const requestError = new Error(detail);
    requestError.status = response.status;
    throw requestError;
  }
  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  getCatalog: () => request("/catalog"),
  getProducts: () => request("/products"),
  getCategories: () => request("/categories"),
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
  uploadImage: (file, token) => {
    const fd = new FormData();
    fd.append("file", file);
    return request("/admin/uploads/image", { method: "POST", token, body: fd });
  },
  uploadCatalog: (file, token) => {
    const fd = new FormData();
    fd.append("file", file);
    return request("/admin/uploads/catalog", { method: "POST", token, body: fd });
  },
};
