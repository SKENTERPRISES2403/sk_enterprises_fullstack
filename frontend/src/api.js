const localHostnames = ["localhost", "127.0.0.1", "0.0.0.0"];
const runtimeApiBase = localHostnames.includes(window.location.hostname)
  ? `${window.location.protocol}//${window.location.hostname}:8000/api`
  : "https://sk-enterprises-api.onrender.com/api";
export const API_BASE = import.meta.env.VITE_API_URL || runtimeApiBase;
export const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");
export const whatsappNumber = "919415216320";
export const callNumber = "917007062590";
export const alternateCallNumber = "916386743995";
export const gstin = "09AHBPD2893G3ZC";
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
    series: "Ehit Series",
    category: "CP Fittings",
    price: 2499,
    mrp: 3499,
    stock: 25,
    warranty: "Company warranty",
    description: "Chrome finish taps, mixers and CP bathroom fittings.",
    image_url: "/assets/essel_taps2.jpg",
    image_urls: ["/assets/essel_taps2.jpg"],
    featured: true,
  },
  {
    id: "demo-black-taps",
    name: "Matte Black Tap Collection",
    brand: "TOYO / ESSEL",
    series: "Enzo Series",
    category: "CP Fittings",
    price: 1899,
    mrp: 2599,
    stock: 18,
    warranty: "As per brand",
    description: "Premium matte black fittings for modern bathrooms.",
    image_url: "/assets/black_taps.jpg",
    image_urls: ["/assets/black_taps.jpg"],
    featured: true,
  },
  {
    id: "demo-flowkem-ptmt",
    name: "FlowKem PTMT Taps",
    brand: "FlowKem",
    series: "PTMT Range",
    category: "CP Fittings",
    price: 299,
    mrp: 449,
    stock: 30,
    warranty: "Brand warranty",
    description: "FlowKem PTMT taps, fittings, pipes and tanks for home and project use.",
    image_url: "/assets/brands/flowkem-logo.png",
    image_urls: ["/assets/brands/flowkem-logo.png"],
    featured: false,
  },
  {
    id: "demo-toilet",
    name: "Birla Pivot Western Toilet",
    brand: "Birla Pivot",
    series: "Trendy Series",
    category: "Sanitaryware",
    price: 7490,
    mrp: 9490,
    stock: 12,
    warranty: "Brand warranty",
    description: "Modern western toilet and sanitaryware options.",
    image_url: "/assets/birla_toilet.jpg",
    image_urls: ["/assets/birla_toilet.jpg"],
    featured: true,
  },
  {
    id: "demo-tiles",
    name: "Floor & Wall Tiles",
    brand: "Somany / Oasis / Nexcera",
    category: "Tiles",
    price: 64,
    mrp: 85,
    stock: 400,
    warranty: "",
    description: "Ceramic, vitrified and porcelain tile range.",
    image_url: "/assets/tiles.jpg",
    image_urls: ["/assets/tiles.jpg"],
    featured: true,
  },
  {
    id: "demo-tanks",
    name: "Water Tanks",
    brand: "Sintex / Supreme",
    category: "Water Tanks",
    price: 4490,
    mrp: 5790,
    stock: 14,
    warranty: "Brand warranty",
    description: "Durable water storage tanks for home and project use.",
    image_url: "/assets/tanks.jpg",
    image_urls: ["/assets/tanks.jpg"],
    featured: true,
  },
  {
    id: "demo-sink",
    name: "Kitchen Sink Range",
    brand: "Nirali / ESSEL / Gunjan",
    category: "Kitchen Sinks",
    price: 2690,
    mrp: 3490,
    stock: 20,
    warranty: "As per brand",
    description: "Scratch-resistant kitchen sinks in multiple sizes.",
    image_url: "/assets/sink.jpg",
    image_urls: ["/assets/sink.jpg"],
    featured: true,
  },
  {
    id: "demo-roff",
    name: "Roff Tile Adhesive",
    brand: "Roff by Pidilite",
    category: "Construction Chemicals",
    price: 420,
    mrp: 550,
    stock: 75,
    warranty: "",
    description: "Tile and stone fixing adhesives, grouts and chemicals.",
    image_url: "/assets/roff.jpg",
    image_urls: ["/assets/roff.jpg"],
    featured: true,
  },
  {
    id: "demo-araldite",
    name: "Araldite Epoxy Adhesive",
    brand: "Araldite",
    category: "Construction Chemicals",
    price: 180,
    mrp: 240,
    stock: 40,
    warranty: "As per brand",
    description: "Strong epoxy adhesive for repair, bonding and project work.",
    image_url: "/assets/brands/araldite-logo.png",
    image_urls: ["/assets/brands/araldite-logo.png"],
    featured: false,
  },
  {
    id: "demo-pipes",
    name: "Supreme & Ashirvad Pipes",
    brand: "Supreme / Ashirvad",
    category: "Pipes",
    price: 95,
    mrp: 125,
    stock: 200,
    warranty: "Brand warranty",
    description: "Plumbing pipes and fittings for residential and project needs.",
    image_url: "/assets/shop.jpg",
    image_urls: ["/assets/shop.jpg"],
    featured: false,
  },
];

export const defaultBrands = [
  {
    id: "brand-essel",
    name: "ESSEL",
    logo_url: "/assets/brands/essel-logo.png",
    description: "CP fittings, taps, showers, urinals, basins and bathroom accessories.",
    warranty: "Up to 10 years warranty on selected fittings",
    position: 1,
  },
  {
    id: "brand-birla",
    name: "Birla Pivot",
    logo_url: "/assets/brands/birla-pivot-logo.jpg",
    description: "Sanitaryware and modern bath solutions for homes and projects.",
    warranty: "Brand warranty on selected sanitaryware",
    position: 2,
  },
  {
    id: "brand-roff",
    name: "Roff by Pidilite",
    logo_url: "/assets/brands/roff-logo.png",
    description: "Tile adhesive, grout and tile-stone fixing chemicals.",
    warranty: "Company supplied project material",
    position: 3,
  },
  {
    id: "brand-supreme",
    name: "Supreme",
    logo_url: "/assets/brands/supreme-logo.png",
    description: "Pipes, fittings and water management products.",
    warranty: "Brand warranty on selected products",
    position: 4,
  },
  {
    id: "brand-ashirvad",
    name: "Ashirvad",
    logo_url: "/assets/brands/ashirvad-logo.png",
    description: "CPVC, UPVC and plumbing pipe systems.",
    warranty: "Brand warranty on selected pipes",
    position: 5,
  },
  {
    id: "brand-cera",
    name: "CERA",
    logo_url: "/assets/brands/cera-logo.png",
    description: "Premium sanitaryware and bathroom solutions.",
    warranty: "Brand warranty on selected sanitaryware",
    position: 6,
  },
  {
    id: "brand-hindware",
    name: "Hindware",
    logo_url: "/assets/brands/hindware-logo.png",
    description: "Sanitaryware, basins, toilets and bath products.",
    warranty: "Brand warranty on selected products",
    position: 7,
  },
  {
    id: "brand-sintex",
    name: "Sintex",
    logo_url: "/assets/brands/sintex-logo.png",
    description: "Water tanks and storage solutions.",
    warranty: "Brand warranty on selected tanks",
    position: 8,
  },
  {
    id: "brand-araldite",
    name: "Araldite",
    logo_url: "/assets/brands/araldite-logo.png",
    description: "Epoxy adhesive for repairs, bonding and project work.",
    warranty: "As per brand",
    position: 9,
  },
  {
    id: "brand-flowkem",
    name: "FlowKem",
    logo_url: "/assets/brands/flowkem-logo.png",
    description: "PTMT taps, pipes, fittings and tanks for homes and projects.",
    warranty: "Brand warranty on selected products",
    position: 10,
  },
];

export const defaultCertificates = [
  {
    id: "cert-essel",
    title: "ESSEL Authorized Dealership",
    brand: "ESSEL Bath Fittings",
    caption: "Certificate of authorised dealership for S.K. Enterprises, Prayagraj.",
    image_url: "/assets/certificates/essel-certificate.jpeg",
    position: 1,
  },
  {
    id: "cert-roff",
    title: "Roff Dealer Certificate",
    brand: "Roff by Pidilite",
    caption: "Dealer certificate for tile and stone fixing solutions.",
    image_url: "/assets/certificates/roff-certificate.jpeg",
    position: 2,
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
  getBrands: () => request("/brands"),
  getGallery: () => request("/gallery"),
  getCertificates: () => request("/certificates"),
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
  createBrand: (payload, token) => request("/admin/brands", { method: "POST", token, body: payload }),
  updateBrand: (id, payload, token) => request(`/admin/brands/${id}`, { method: "PUT", token, body: payload }),
  deleteBrand: (id, token) => request(`/admin/brands/${id}`, { method: "DELETE", token }),
  createCertificate: (payload, token) => request("/admin/certificates", { method: "POST", token, body: payload }),
  updateCertificate: (id, payload, token) => request(`/admin/certificates/${id}`, { method: "PUT", token, body: payload }),
  deleteCertificate: (id, token) => request(`/admin/certificates/${id}`, { method: "DELETE", token }),
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
