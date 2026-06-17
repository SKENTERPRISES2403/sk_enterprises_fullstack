import React, { useEffect, useMemo, useState } from "react";
import "./styles.css";
import {
  api,
  imageUrl,
  demoProducts,
  defaultCertificates,
  defaultGallery,
  orderStatuses,
  leadStatuses,
  categories as defaultCategories,
  whatsappNumber,
  callNumber,
  alternateCallNumber,
  gstin,
  mapsUrl,
} from "./api";

const emptyProduct = {
  name: "",
  brand: "",
  category: "CP Fittings",
  price: 0,
  mrp: 0,
  stock: 0,
  warranty: "",
  description: "",
  image_url: "",
  featured: false,
  active: true,
};

const emptyGalleryItem = {
  title: "",
  caption: "",
  image_url: "",
  position: 0,
  active: true,
};

const emptyCertificateItem = {
  title: "",
  brand: "",
  caption: "",
  image_url: "",
  position: 0,
  active: true,
};

const brandTiles = [
  { name: "ESSEL BATH FITTINGS", line: "Authorized CP fittings", logo: "/assets/brands/essel-logo.png" },
  { name: "BIRLA PIVOT", line: "Sanitaryware partner", logo: "/assets/brands/birla-pivot-logo.jpg" },
  { name: "ROFF by PIDILITE", line: "Tile and stone fixing", logo: "/assets/brands/roff-logo.png" },
  { name: "SUPREME PIPES", line: "Plumbing systems", logo: "/assets/brands/supreme-logo.png" },
  { name: "ASHIRVAD PIPES", line: "CPVC and UPVC", logo: "/assets/brands/ashirvad-logo.png" },
  { name: "CERA", line: "Bath solutions", logo: "/assets/brands/cera-logo.png" },
  { name: "HINDWARE", line: "Sanitaryware", logo: "/assets/brands/hindware-logo.png" },
  { name: "SINTEX", line: "Water tanks", logo: "/assets/brands/sintex-logo.png" },
  { name: "ARALDITE", line: "Epoxy adhesive", logo: "/assets/brands/araldite-logo.png" },
];

const reviews = [
  {
    name: "Dheeraj Pandey",
    text: "Shopkeeper ka nature bahut accha hai. ESSEL fittings genuine rate par mile aur warranty card ke saath proper guidance bhi mili.",
  },
  {
    name: "Vivek Mishra",
    text: "Mere ghar ke bathroom ke liye tiles, sanitary aur Roff material yahin se liya. Rate clear tha aur delivery bhi time par ho gayi.",
  },
  {
    name: "Ramesh Gupta",
    text: "Builder work ke liye Supreme pipes aur bath fittings chahiye the. Bulk quantity par achha price mila aur GST bill bhi proper mila.",
  },
];

const copy = {
  en: {
    navProducts: "Products",
    navGallery: "Gallery",
    navWhy: "Why Us",
    navContact: "Contact",
    shop: "Shop",
    orders: "Orders",
    admin: "Admin",
    login: "Login",
    cart: "Cart",
    heroKicker: "GST registered authorized dealer in Prayagraj",
    heroTitle: "S.K. Enterprises",
    heroSub: "Premium hardware, CP fittings, sanitaryware, tiles, tanks, pipes and construction chemicals with site delivery and bulk order support.",
    quote: "Send Product List",
    browse: "Browse Products",
    trust1: "GST Registered",
    trust2: "Authorized Dealer",
    trust3: "Site Delivery Available",
    trust4: "Bulk Orders Accepted",
    stat1: "Years Experience",
    stat2: "Happy Customers",
    stat3: "Contractor Network",
    stat4: "Offline Payment",
    featured: "Featured Products",
    featuredSub: "Fast-moving categories for homes, projects and contractors.",
    catalog: "Product Catalog",
    search: "Search products, brand, category...",
    whyTitle: "Why S.K. Enterprises?",
    whySub: "हमारा विश्वास सिर्फ सामान बेचने में नहीं, रिश्ते बनाने में है।",
    feature1Title: "Genuine Products",
    feature1Text: "100% original company supplied products.",
    feature2Title: "Wholesale Pricing",
    feature2Text: "Best market price for retail and bulk orders.",
    feature3Title: "Fast Delivery",
    feature3Text: "Quick material delivery directly to your site.",
    feature4Title: "GST Billing",
    feature4Text: "Transparent pricing with proper GST invoices.",
    feature5Title: "Contractor Support",
    feature5Text: "Special priority processing for builders and plumbers.",
    feature6Title: "Authorized Dealer",
    feature6Text: "Official dealer for top brands ensuring full warranty.",
    dealership: "Dealership & Brand Proof",
    dealershipSub: "Real dealership boards, certificates and stock photos from the showroom.",
    gallery: "Showroom Gallery",
    gallerySub: "A quick look at the showroom, product walls and display range.",
    reviews: "Customer Reviews",
    reviewsSub: "Realistic feedback from local customers and site buyers.",
    contactTitle: "Visit or send your requirement",
    contactSub: "Call, WhatsApp or open location directly. You can also leave a quick inquiry.",
    address: "Kanihar Road, Saray Taki, Prayagraj, Uttar Pradesh 211019",
    plusCode: "Plus Code: CW9J+CF Prayagraj",
    formTitle: "Request a quick quote",
    formName: "Full name",
    formPhone: "Phone number",
    formCategory: "Category",
    formMessage: "Requirement / site details",
    formButton: "Send Inquiry",
    askQuote: "Ask for quote",
    details: "Details",
    add: "Add",
    addCart: "Add to Cart",
    all: "All",
    finalRate: "Final rate on WhatsApp / store",
    checkout: "Checkout",
    emptyCart: "Cart is empty. Add products first.",
  },
  hi: {
    navProducts: "प्रोडक्ट्स",
    navGallery: "गैलरी",
    navWhy: "क्यों हम",
    navContact: "संपर्क",
    shop: "शॉप",
    orders: "ऑर्डर",
    admin: "एडमिन",
    login: "लॉगिन",
    cart: "कार्ट",
    heroKicker: "प्रयागराज में GST रजिस्टर्ड अधिकृत डीलर",
    heroTitle: "S.K. Enterprises",
    heroSub: "हार्डवेयर, CP फिटिंग्स, सेनेटरीवेयर, टाइल्स, टैंक, पाइप और कंस्ट्रक्शन केमिकल्स के लिए भरोसेमंद दुकान।",
    quote: "लिस्ट भेजें",
    browse: "प्रोडक्ट देखें",
    trust1: "GST रजिस्टर्ड",
    trust2: "अधिकृत डीलर",
    trust3: "साइट डिलीवरी उपलब्ध",
    trust4: "बल्क ऑर्डर स्वीकार",
    stat1: "साल का अनुभव",
    stat2: "खुश ग्राहक",
    stat3: "कॉन्ट्रैक्टर नेटवर्क",
    stat4: "ऑफलाइन पेमेंट",
    featured: "फीचर्ड प्रोडक्ट्स",
    featuredSub: "घर, प्रोजेक्ट और कॉन्ट्रैक्टर के लिए जरूरी कैटेगरी।",
    catalog: "प्रोडक्ट कैटलॉग",
    search: "प्रोडक्ट, ब्रांड, कैटेगरी खोजें...",
    whyTitle: "Why S.K. Enterprises?",
    whySub: "हमारा विश्वास सिर्फ सामान बेचने में नहीं, रिश्ते बनाने में है।",
    feature1Title: "Genuine Products",
    feature1Text: "100% original company supplied products.",
    feature2Title: "Wholesale Pricing",
    feature2Text: "Best market price for retail and bulk orders.",
    feature3Title: "Fast Delivery",
    feature3Text: "Quick material delivery directly to your site.",
    feature4Title: "GST Billing",
    feature4Text: "Transparent pricing with proper GST invoices.",
    feature5Title: "Contractor Support",
    feature5Text: "Special priority processing for builders and plumbers.",
    feature6Title: "Authorized Dealer",
    feature6Text: "Official dealer for top brands ensuring full warranty.",
    dealership: "डीलरशिप और ब्रांड प्रूफ",
    dealershipSub: "शोरूम के रियल बोर्ड, सर्टिफिकेट और स्टॉक फोटो।",
    gallery: "शोरूम गैलरी",
    gallerySub: "शोरूम, डिस्प्ले और प्रोडक्ट रेंज की झलक।",
    reviews: "कस्टमर रिव्यू",
    reviewsSub: "लोकल ग्राहकों और साइट खरीदारों की राय।",
    contactTitle: "दुकान आएं या जरूरत भेजें",
    contactSub: "Call, WhatsApp या location direct open करें। Quick inquiry भी भेज सकते हैं।",
    address: "कनिहार रोड, सराय तकी, प्रयागराज, उत्तर प्रदेश 211019",
    plusCode: "Plus Code: CW9J+CF Prayagraj",
    formTitle: "फ्री कोटेशन लें",
    formName: "पूरा नाम",
    formPhone: "फोन नंबर",
    formCategory: "कैटेगरी",
    formMessage: "जरूरत / साइट डिटेल",
    formButton: "Inquiry भेजें",
    askQuote: "रेट पूछें",
    details: "डिटेल",
    add: "Add",
    addCart: "कार्ट में जोड़ें",
    all: "All",
    finalRate: "Final rate WhatsApp / store पर",
    checkout: "Checkout",
    emptyCart: "कार्ट खाली है। पहले प्रोडक्ट जोड़ें।",
  },
  bho: {
    navProducts: "प्रोडक्ट",
    navGallery: "गैलरी",
    navWhy: "काहे हम",
    navContact: "संपर्क",
    shop: "शॉप",
    orders: "ऑर्डर",
    admin: "एडमिन",
    login: "लॉगिन",
    cart: "कार्ट",
    heroKicker: "प्रयागराज में GST रजिस्टर्ड अधिकृत डीलर",
    heroTitle: "S.K. Enterprises",
    heroSub: "हार्डवेयर, CP फिटिंग, सेनेटरी, टाइल्स, टैंक, पाइप आ कंस्ट्रक्शन केमिकल्स खातिर भरोसेमंद दुकान।",
    quote: "लिस्ट भेजीं",
    browse: "प्रोडक्ट देखीं",
    trust1: "GST रजिस्टर्ड",
    trust2: "अधिकृत डीलर",
    trust3: "साइट डिलीवरी बा",
    trust4: "थोक ऑर्डर लेवल जाला",
    stat1: "साल के अनुभव",
    stat2: "खुश ग्राहक",
    stat3: "ठेकेदार नेटवर्क",
    stat4: "ऑफलाइन पेमेंट",
    featured: "फीचर्ड प्रोडक्ट",
    featuredSub: "घर, प्रोजेक्ट आ ठेकेदार खातिर जरूरी सामान।",
    catalog: "प्रोडक्ट कैटलॉग",
    search: "प्रोडक्ट, ब्रांड, कैटेगरी खोजीं...",
    whyTitle: "Why S.K. Enterprises?",
    whySub: "हमनी के भरोसा खाली सामान बेचे में ना, रिश्ता बनावे में बा।",
    feature1Title: "Genuine Products",
    feature1Text: "100% original company supplied products.",
    feature2Title: "Wholesale Pricing",
    feature2Text: "Best market price for retail and bulk orders.",
    feature3Title: "Fast Delivery",
    feature3Text: "Quick material delivery directly to your site.",
    feature4Title: "GST Billing",
    feature4Text: "Transparent pricing with proper GST invoices.",
    feature5Title: "Contractor Support",
    feature5Text: "Special priority processing for builders and plumbers.",
    feature6Title: "Authorized Dealer",
    feature6Text: "Official dealer for top brands ensuring full warranty.",
    dealership: "डीलरशिप आ ब्रांड प्रूफ",
    dealershipSub: "शोरूम के असली बोर्ड, सर्टिफिकेट आ स्टॉक फोटो।",
    gallery: "शोरूम गैलरी",
    gallerySub: "शोरूम, डिस्प्ले आ प्रोडक्ट रेंज के झलक।",
    reviews: "ग्राहकन के राय",
    reviewsSub: "लोकल ग्राहक आ साइट खरीदारन के भरोसेमंद बात।",
    contactTitle: "दुकान आईं या जरूरत भेजीं",
    contactSub: "Call, WhatsApp या location direct खोल सकत बानी। Quick inquiry भी भेजीं।",
    address: "कनिहार रोड, सराय तकी, प्रयागराज, उत्तर प्रदेश 211019",
    plusCode: "Plus Code: CW9J+CF Prayagraj",
    formTitle: "फ्री कोटेशन लीं",
    formName: "पूरा नाम",
    formPhone: "फोन नंबर",
    formCategory: "कैटेगरी",
    formMessage: "जरूरत / साइट डिटेल",
    formButton: "Inquiry भेजीं",
    askQuote: "रेट पूछीं",
    details: "डिटेल",
    add: "Add",
    addCart: "कार्ट में जोड़ीं",
    all: "All",
    finalRate: "Final rate WhatsApp / store पर",
    checkout: "Checkout",
    emptyCart: "कार्ट खाली बा। पहिले प्रोडक्ट जोड़ीं।",
  },
};

function App() {
  const [page, setPage] = useHashPage();
  const [lang, setLang] = useLocalStorage("sk_lang", "en");
  const [products, setProducts] = useState([]);
  const [gallery, setGallery] = useState(defaultGallery);
  const [certificates, setCertificates] = useState(defaultCertificates);
  const [categories, setCategories] = useState(defaultCategories);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useLocalStorage("sk_fullstack_cart", []);
  const [auth, setAuth] = useLocalStorage("sk_fullstack_auth", null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    loadCatalog();
  }, []);

  const t = (key) => copy[lang]?.[key] || copy.en[key] || key;

  async function loadCatalog() {
    try {
      const [productRows, categoryRows, galleryRows, certificateRows] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getGallery(),
        api.getCertificates(),
      ]);
      setProducts(productRows.length ? productRows : demoProducts);
      setCategories(categoryRows.length ? categoryRows.map((item) => item.name) : defaultCategories);
      setGallery(galleryRows.length ? galleryRows : defaultGallery);
      setCertificates(certificateRows.length ? certificateRows : defaultCertificates);
    } catch {
      setProducts(demoProducts);
      setCategories(defaultCategories);
      setGallery(defaultGallery);
      setCertificates(defaultCertificates);
      setNotice("Backend offline: demo catalog is visible. Start FastAPI + MongoDB for live data.");
    }
  }

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const search = `${product.name} ${product.brand} ${product.category} ${product.description}`.toLowerCase();
      return matchesCategory && (!query || search.includes(query.toLowerCase()));
    });
  }, [products, category, query]);

  const featured = products.filter((product) => product.featured).slice(0, 4);
  const cartQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  function addToCart(product, quantity = 1) {
    setCart((oldCart) => {
      const existing = oldCart.find((item) => item.product_id === product.id);
      if (existing) {
        return oldCart.map((item) =>
          item.product_id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...oldCart,
        {
          product_id: product.id,
          name: product.name,
          price: Number(product.price || 0),
          image_url: product.image_url,
          quantity,
        },
      ];
    });
    setNotice("Product added to cart");
  }

  function updateQty(productId, quantity) {
    setCart((oldCart) =>
      oldCart
        .map((item) => (item.product_id === productId ? { ...item, quantity: Math.max(0, quantity) } : item))
        .filter((item) => item.quantity > 0)
    );
  }

  async function handleAuth(mode, form) {
    const payload = Object.fromEntries(new FormData(form));
    const result = mode === "register" ? await api.register(payload) : await api.login(payload);
    setAuth(result);
    setNotice(`Logged in as ${result.user.name}`);
    setPage(result.user.role === "customer" ? "store" : "admin");
  }

  function logout() {
    setAuth(null);
    setPage("store");
  }

  async function handleLead(form) {
    const payload = Object.fromEntries(new FormData(form));
    await api.createLead(payload);
    setNotice("Inquiry saved. We will contact you soon.");
    form.reset();
  }

  async function placeOrder(form) {
    if (!auth?.token) {
      setPage("login");
      setNotice("Login/register before checkout");
      return;
    }
    if (!cart.length) {
      setNotice("Cart is empty");
      return;
    }
    const data = Object.fromEntries(new FormData(form));
    const payload = {
      items: cart,
      payment_method: data.payment_method,
      note: data.note || "",
      address: {
        label: "Delivery",
        name: data.name,
        phone: data.phone,
        line1: data.line1,
        line2: data.line2 || "",
        city: data.city || "Prayagraj",
        pincode: data.pincode || "",
      },
    };
    const result = await api.createOrder(payload, auth.token);
    setCart([]);
    setNotice(`Order ${result.order.order_no} placed`);
    const url = `https://wa.me/${result.whatsapp_number || whatsappNumber}?text=${encodeURIComponent(result.whatsapp_text)}`;
    window.open(url, "_blank", "noopener");
    setPage("orders");
  }

  return (
    <>
      <Header auth={auth} cartQty={cartQty} setPage={setPage} logout={logout} lang={lang} setLang={setLang} t={t} />
      {notice && <div className="notice" onClick={() => setNotice("")}>{notice}</div>}

      {page === "store" && (
        <StorePage
          t={t}
          lang={lang}
          featured={featured}
          products={visibleProducts}
          gallery={gallery}
          certificates={certificates}
          categories={categories}
          query={query}
          setQuery={setQuery}
          category={category}
          setCategory={setCategory}
          addToCart={addToCart}
          submitLead={handleLead}
          openDetail={(product) => {
            setSelected(product);
            setPage("detail");
          }}
        />
      )}

      {page === "detail" && selected && (
        <ProductDetail product={selected} addToCart={addToCart} back={() => setPage("store")} t={t} />
      )}

      {page === "cart" && (
        <CartPage cart={cart} updateQty={updateQty} setPage={setPage} t={t} />
      )}

      {page === "checkout" && (
        <CheckoutPage auth={auth} cart={cart} placeOrder={placeOrder} setPage={setPage} />
      )}

      {page === "login" && (
        <LoginPage onAuth={handleAuth} />
      )}

      {page === "orders" && (
        <OrderHistory auth={auth} setPage={setPage} />
      )}

      {page === "admin" && (
        <AdminPanel auth={auth} setPage={setPage} reloadCatalog={loadCatalog} />
      )}

      <FloatingLinks />
      <Footer setPage={setPage} />
    </>
  );
}

function Header({ auth, cartQty, setPage, logout, lang, setLang, t }) {
  const adminRole = ["owner", "admin", "staff"].includes(auth?.user?.role);
  const jumpTo = (id) => {
    setPage("store");
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  return (
    <header className="site-header">
      <button className="brand-button" onClick={() => setPage("store")}>
        <span className="brand-mark">SK</span>
        <span>S.K. <strong>Enterprises</strong></span>
      </button>
      <nav className="main-nav">
        <button onClick={() => jumpTo("products")}>{t("navProducts")}</button>
        <button onClick={() => jumpTo("gallery")}>{t("navGallery")}</button>
        <button onClick={() => jumpTo("why")}>{t("navWhy")}</button>
        <button onClick={() => jumpTo("contact")}>{t("navContact")}</button>
        <button onClick={() => setPage("orders")}>{t("orders")}</button>
        {adminRole && <button onClick={() => setPage("admin")}>{t("admin")}</button>}
      </nav>
      <div className="header-actions">
        <div className="lang-switch" aria-label="Language">
          {["en", "hi", "bho"].map((item) => (
            <button key={item} className={lang === item ? "active" : ""} onClick={() => setLang(item)}>
              {item === "en" ? "EN" : item === "hi" ? "हिं" : "भोज"}
            </button>
          ))}
        </div>
        {auth ? (
          <button className="soft-button" onClick={logout}>{auth.user.name}</button>
        ) : (
          <button className="soft-button" onClick={() => setPage("login")}>{t("login")}</button>
        )}
        <button className="cart-button" onClick={() => setPage("cart")}>{t("cart")} <b>{cartQty}</b></button>
      </div>
    </header>
  );
}

export function StorePage({
  t,
  featured,
  products,
  gallery,
  certificates,
  categories,
  query,
  setQuery,
  category,
  setCategory,
  addToCart,
  submitLead,
  openDetail,
}) {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="pill light">{t("heroKicker")}</span>
          <h1>{t("heroTitle")}</h1>
          <p>{t("heroSub")}</p>
          <div className="hero-actions">
            <a className="whatsapp" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello S.K. Enterprises, I need a product quote.")}`} target="_blank" rel="noreferrer">
              {t("quote")}
            </a>
            <button className="primary" onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}>
              {t("browse")}
            </button>
            <a className="outline-light" href={mapsUrl} target="_blank" rel="noreferrer">Location</a>
          </div>
        </div>
      </section>

      <TrustBar t={t} />
      <BrandMarquee />
      <StatsBar t={t} />

      <section className="section" id="products">
        <SectionHead kicker="Catalog" title={t("catalog")} sub={t("featuredSub")} />
        <div className="toolbar">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("search")} />
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option>All</option>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="category-tabs">
          {["All", ...categories].map((item) => (
            <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>
              {item === "All" ? t("all") : item}
            </button>
          ))}
        </div>
        {!!featured.length && (
          <>
            <div className="subsection-label">{t("featured")}</div>
            <div className="product-grid featured-grid">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} addToCart={addToCart} openDetail={openDetail} t={t} />
              ))}
            </div>
          </>
        )}
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} openDetail={openDetail} t={t} />
          ))}
        </div>
      </section>

      <WhyUs t={t} />
      <DealershipSection t={t} certificates={certificates} />
      <ShowroomGallery gallery={gallery} t={t} />
      <ReviewsSection t={t} />
      <ContactSection t={t} submitLead={submitLead} />
    </main>
  );
}

function TrustBar({ t }) {
  return (
    <section className="trust-bar">
      {[t("trust1"), t("trust2"), t("trust3"), t("trust4")].map((item) => (
        <span key={item}>{item}</span>
      ))}
    </section>
  );
}

function BrandMarquee() {
  const items = [...brandTiles, ...brandTiles];
  return (
    <section className="brand-marquee" aria-label="Authorized brands">
      <div className="marquee-track">
        {items.map((brand, index) => (
          <div className="brand-tile" key={`${brand.name}-${index}`}>
            <span><img src={brand.logo} alt={`${brand.name} logo`} /></span>
            <div>
              <b>{brand.name}</b>
              <small>{brand.line}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatsBar({ t }) {
  const stats = [
    [{ target: 5, suffix: "+" }, t("stat1")],
    [{ target: 1000, suffix: "+" }, t("stat2")],
    [{ target: 100, suffix: "+" }, t("stat3")],
    ["Cash / UPI", t("stat4")],
  ];
  return (
    <section className="stats-row">
      {stats.map(([value, label]) => (
        <div key={label}><b>{typeof value === "string" ? value : <AnimatedCounter {...value} />}</b><span>{label}</span></div>
      ))}
    </section>
  );
}

function AnimatedCounter({ target, suffix = "" }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame = 0;
    const totalFrames = 42;
    const timer = window.setInterval(() => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress >= 1) window.clearInterval(timer);
    }, 22);
    return () => window.clearInterval(timer);
  }, [target]);
  return <>{value}{suffix}</>;
}

function SectionHead({ kicker, title, sub }) {
  return (
    <div className="section-head">
      <span className="pill">{kicker}</span>
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </div>
  );
}

function ProductCard({ product, addToCart, openDetail, t }) {
  return (
    <article className="product-card">
      <button className="image-button" onClick={() => openDetail(product)}>
        <img src={imageUrl(product.image_url)} alt={product.name} />
        {product.featured && <span>Featured</span>}
      </button>
      <div className="product-body">
        <small>{product.category}</small>
        <h3>{product.name}</h3>
        <p>{product.brand}</p>
        <b>{product.price ? `Rs ${product.price}` : t("askQuote")}</b>
      </div>
      <div className="card-actions">
        <button onClick={() => openDetail(product)}>{t("details")}</button>
        <button className="primary" onClick={() => addToCart(product)}>{t("add")}</button>
      </div>
    </article>
  );
}

function WhyUs({ t }) {
  const items = [
    ["📜", t("feature1Title"), t("feature1Text")],
    ["💰", t("feature2Title"), t("feature2Text")],
    ["🚚", t("feature3Title"), t("feature3Text")],
    ["🧾", t("feature4Title"), t("feature4Text")],
    ["🏗️", t("feature5Title"), t("feature5Text")],
    ["✅", t("feature6Title"), t("feature6Text")],
  ];
  return (
    <section className="section why-us" id="why">
      <SectionHead kicker="Trust" title={t("whyTitle")} />
      <div className="quote-box">{t("whySub")}</div>
      <div className="features-grid">
        {items.map(([icon, title, text]) => (
          <article className="feature-box" key={title}>
            <span className="feature-icon">{icon}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function DealershipSection({ t, certificates }) {
  const sorted = [...certificates].sort((a, b) => Number(a.position || 0) - Number(b.position || 0));
  return (
    <section className="section dealership-section">
      <SectionHead kicker="Authorized" title={t("dealership")} sub={t("dealershipSub")} />
      <div className="certs-grid">
        {sorted.map((item) => (
          <article className="cert-card" key={item.title}>
            <img src={imageUrl(item.image_url)} alt={item.title} />
            <div>
              <b>{item.title}</b>
              <small>{item.brand || item.caption}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ShowroomGallery({ gallery, t }) {
  const sorted = [...gallery].sort((a, b) => Number(a.position || 0) - Number(b.position || 0));
  return (
    <section className="section gallery-section" id="gallery">
      <SectionHead kicker="Showroom" title={t("gallery")} sub={t("gallerySub")} />
      <div className="gallery-grid">
        {sorted.map((item) => (
          <article className="gallery-card" key={item.id || item.image_url}>
            <img src={imageUrl(item.image_url)} alt={item.title} />
            <div>
              <b>{item.title}</b>
              <p>{item.caption}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReviewsSection({ t }) {
  return (
    <section className="section reviews-section">
      <SectionHead kicker="Reviews" title={t("reviews")} sub={t("reviewsSub")} />
      <div className="reviews-grid">
        {reviews.map((review) => (
          <article className="review-card" key={review.name}>
            <div className="stars">★★★★★</div>
            <p>{review.text}</p>
            <b>{review.name}</b>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactSection({ t, submitLead }) {
  return (
    <section className="section contact-section" id="contact">
      <div className="contact-copy">
        <span className="pill">Contact</span>
        <h2>{t("contactTitle")}</h2>
        <p>{t("contactSub")}</p>
        <div className="quick-links">
          <a className="whatsapp" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello S.K. Enterprises, I need a quote.")}`} target="_blank" rel="noreferrer">WhatsApp</a>
          <a className="call-link" href={`tel:+${callNumber}`}>Call</a>
          <a className="map-link" href={mapsUrl} target="_blank" rel="noreferrer">Location</a>
        </div>
        <div className="contact-card">
          <b>{t("address")}</b>
          <span>{t("plusCode")}</span>
          <a href={mapsUrl} target="_blank" rel="noreferrer">Open Google Maps</a>
        </div>
      </div>
      <form className="panel-form lead-form" onSubmit={(event) => { event.preventDefault(); submitLead(event.currentTarget); }}>
        <h3>{t("formTitle")}</h3>
        <input name="name" placeholder={t("formName")} required />
        <input name="phone" placeholder={t("formPhone")} required />
        <select name="category" defaultValue="">
          <option value="">{t("formCategory")}</option>
          {defaultCategories.map((item) => <option key={item}>{item}</option>)}
        </select>
        <textarea name="message" placeholder={t("formMessage")} required />
        <button className="primary">{t("formButton")}</button>
      </form>
    </section>
  );
}

export function ProductDetail({ product, addToCart, back, t = (key) => copy.en[key] || key }) {
  const [qty, setQty] = useState(1);
  return (
    <main className="section detail-layout">
      <button className="text-button" onClick={back}>Back to products</button>
      <img className="detail-image" src={imageUrl(product.image_url)} alt={product.name} />
      <div className="detail-copy">
        <span className="pill">{product.category}</span>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <dl>
          <div><dt>Brand</dt><dd>{product.brand || "-"}</dd></div>
          <div><dt>Price</dt><dd>{product.price ? `Rs ${product.price}` : t("finalRate")}</dd></div>
          <div><dt>MRP</dt><dd>{product.mrp ? `Rs ${product.mrp}` : "-"}</dd></div>
          <div><dt>Stock</dt><dd>{product.stock}</dd></div>
          <div><dt>Warranty</dt><dd>{product.warranty || "-"}</dd></div>
        </dl>
        <div className="qty-box">
          <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
          <b>{qty}</b>
          <button onClick={() => setQty(qty + 1)}>+</button>
          <button className="primary" onClick={() => addToCart(product, qty)}>{t("addCart")}</button>
        </div>
      </div>
    </main>
  );
}

export function CartPage({ cart, updateQty, setPage, t = (key) => copy.en[key] || key }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <main className="section narrow">
      <div className="section-head">
        <span className="pill">Cart</span>
        <h1>Your Cart</h1>
      </div>
      {!cart.length && <Empty message={t("emptyCart")} />}
      {cart.map((item) => (
        <div className="cart-line" key={item.product_id}>
          <img src={imageUrl(item.image_url)} alt={item.name} />
          <div>
            <h3>{item.name}</h3>
            <p>{item.price ? `Rs ${item.price}` : "Quote item"}</p>
          </div>
          <div className="qty-box">
            <button onClick={() => updateQty(item.product_id, item.quantity - 1)}>-</button>
            <b>{item.quantity}</b>
            <button onClick={() => updateQty(item.product_id, item.quantity + 1)}>+</button>
          </div>
        </div>
      ))}
      <div className="checkout-bar">
        <strong>{total ? `Approx total: Rs ${total}` : "Final rate will be confirmed offline"}</strong>
        <button className="primary" disabled={!cart.length} onClick={() => setPage("checkout")}>{t("checkout")}</button>
      </div>
    </main>
  );
}

export function CheckoutPage({ auth, cart, placeOrder, setPage }) {
  if (!auth) {
    return (
      <main className="section narrow">
        <Empty message="Login/register before checkout." />
        <button className="primary" onClick={() => setPage("login")}>Login / Register</button>
      </main>
    );
  }
  return (
    <main className="section narrow">
      <div className="section-head">
        <span className="pill">Offline payment only</span>
        <h1>Checkout</h1>
        <p>Order will save in database and WhatsApp will open for confirmation.</p>
      </div>
      <form className="panel-form" onSubmit={(event) => { event.preventDefault(); placeOrder(event.currentTarget); }}>
        <input name="name" defaultValue={auth.user.name} placeholder="Name" required />
        <input name="phone" defaultValue={auth.user.phone} placeholder="Phone" required />
        <input name="line1" placeholder="Address line 1" required />
        <input name="line2" placeholder="Address line 2" />
        <div className="two-col">
          <input name="city" defaultValue="Prayagraj" placeholder="City" />
          <input name="pincode" placeholder="Pincode" />
        </div>
        <select name="payment_method" defaultValue="WhatsApp">
          <option>WhatsApp</option>
          <option>Cash</option>
          <option>UPI</option>
        </select>
        <textarea name="note" placeholder="Order note, delivery timing, site details..." />
        <button className="primary" disabled={!cart.length}>Place Order</button>
      </form>
    </main>
  );
}

export function LoginPage({ onAuth }) {
  const [mode, setMode] = useState("login");
  return (
    <main className="section narrow">
      <div className="section-head">
        <span className="pill">{mode === "login" ? "Login" : "Register"}</span>
        <h1>{mode === "login" ? "Customer / Staff Login" : "Create Customer Account"}</h1>
      </div>
      <form className="panel-form" onSubmit={(event) => { event.preventDefault(); onAuth(mode, event.currentTarget); }}>
        {mode === "register" && <input name="name" placeholder="Full name" required />}
        <input name="phone" placeholder="Phone number" required />
        <input name="password" type="password" placeholder="Password" required />
        <button className="primary">{mode === "login" ? "Login" : "Register"}</button>
      </form>
      <button className="text-button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login" ? "New customer? Register" : "Already registered? Login"}
      </button>
      <div className="hint-box">
        Owner seed login: phone 7007062590. Change the seeded password after setup.
      </div>
    </main>
  );
}

export function OrderHistory({ auth, setPage }) {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    if (!auth?.token) return;
    api.myOrders(auth.token).then(setOrders).catch(() => setOrders([]));
  }, [auth]);
  if (!auth) {
    return (
      <main className="section narrow">
        <Empty message="Login to see order history." />
        <button className="primary" onClick={() => setPage("login")}>Login</button>
      </main>
    );
  }
  return (
    <main className="section">
      <div className="section-head"><span className="pill">History</span><h1>My Orders</h1></div>
      <div className="table-list">
        {!orders.length && <Empty message="No orders yet." />}
        {orders.map((order) => (
          <article className="order-card" key={order.id}>
            <b>{order.order_no}</b>
            <span>{order.status}</span>
            <small>{order.created_at?.slice(0, 10)}</small>
            <p>{order.items.map((item) => `${item.name} x ${item.quantity}`).join(", ")}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

export function AdminPanel({ auth, setPage, reloadCatalog }) {
  const [tab, setTab] = useState("dashboard");
  const [dashboard, setDashboard] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [leads, setLeads] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editingGallery, setEditingGallery] = useState(null);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [message, setMessage] = useState("");

  const canDelete = ["owner", "admin"].includes(auth?.user?.role);
  const canCreateStaff = ["owner", "admin"].includes(auth?.user?.role);

  useEffect(() => {
    if (!auth?.token || auth.user.role === "customer") return;
    refreshAdmin();
  }, [auth]);

  async function refreshAdmin() {
    const [stats, productRows, orderRows, leadRows, galleryRows, certificateRows] = await Promise.all([
      api.dashboard(auth.token),
      api.getProducts(),
      api.adminOrders(auth.token),
      api.adminLeads(auth.token),
      api.getGallery(),
      api.getCertificates(),
    ]);
    setDashboard(stats);
    setProducts(productRows);
    setOrders(orderRows);
    setLeads(leadRows);
    setGallery(galleryRows);
    setCertificates(certificateRows);
    reloadCatalog();
  }

  if (!auth || auth.user.role === "customer") {
    return (
      <main className="section narrow">
        <Empty message="Admin/staff login required." />
        <button className="primary" onClick={() => setPage("login")}>Login</button>
      </main>
    );
  }

  async function saveProduct(form) {
    const fd = new FormData(form);
    let imageUrlValue = fd.get("image_url") || "";
    const imageFile = fd.get("image_file");
    if (imageFile && imageFile.size) {
      const upload = await api.uploadImage(imageFile, auth.token);
      imageUrlValue = upload.image_url;
    }
    const payload = {
      name: fd.get("name"),
      brand: fd.get("brand"),
      category: fd.get("category"),
      price: Number(fd.get("price") || 0),
      mrp: Number(fd.get("mrp") || 0),
      stock: Number(fd.get("stock") || 0),
      warranty: fd.get("warranty"),
      description: fd.get("description"),
      image_url: imageUrlValue,
      featured: fd.get("featured") === "on",
      active: true,
    };
    if (editing?.id) await api.updateProduct(editing.id, payload, auth.token);
    else await api.createProduct(payload, auth.token);
    setEditing(null);
    form.reset();
    setMessage("Product saved");
    refreshAdmin();
  }

  async function saveGalleryItem(form) {
    const fd = new FormData(form);
    let imageUrlValue = fd.get("image_url") || "";
    const imageFile = fd.get("image_file");
    if (imageFile && imageFile.size) {
      const upload = await api.uploadImage(imageFile, auth.token);
      imageUrlValue = upload.image_url;
    }
    const payload = {
      title: fd.get("title"),
      caption: fd.get("caption"),
      image_url: imageUrlValue,
      position: Number(fd.get("position") || 0),
      active: true,
    };
    if (editingGallery?.id) await api.updateGalleryItem(editingGallery.id, payload, auth.token);
    else await api.createGalleryItem(payload, auth.token);
    setEditingGallery(null);
    form.reset();
    setMessage("Gallery photo saved");
    refreshAdmin();
  }

  async function saveCertificate(form) {
    const fd = new FormData(form);
    let imageUrlValue = fd.get("image_url") || "";
    const imageFile = fd.get("image_file");
    if (imageFile && imageFile.size) {
      const upload = await api.uploadImage(imageFile, auth.token);
      imageUrlValue = upload.image_url;
    }
    const payload = {
      title: fd.get("title"),
      brand: fd.get("brand"),
      caption: fd.get("caption"),
      image_url: imageUrlValue,
      position: Number(fd.get("position") || 0),
      active: true,
    };
    if (editingCertificate?.id) await api.updateCertificate(editingCertificate.id, payload, auth.token);
    else await api.createCertificate(payload, auth.token);
    setEditingCertificate(null);
    form.reset();
    setMessage("Certificate saved");
    refreshAdmin();
  }

  async function deleteProduct(id) {
    await api.deleteProduct(id, auth.token);
    setMessage("Product deleted");
    refreshAdmin();
  }

  async function deleteGalleryItem(id) {
    await api.deleteGalleryItem(id, auth.token);
    setMessage("Gallery photo deleted");
    refreshAdmin();
  }

  async function deleteCertificate(id) {
    await api.deleteCertificate(id, auth.token);
    setMessage("Certificate deleted");
    refreshAdmin();
  }

  async function updateOrder(id, status) {
    await api.updateOrderStatus(id, status, auth.token);
    refreshAdmin();
  }

  async function updateLead(id, status) {
    await api.updateLeadStatus(id, status, auth.token);
    refreshAdmin();
  }

  async function createStaff(form) {
    const payload = Object.fromEntries(new FormData(form));
    await api.createStaff(payload, auth.token);
    setMessage("Staff/admin user created");
    form.reset();
  }

  const menuItems = [
    "dashboard",
    "products",
    ...(canDelete ? ["certificates", "gallery"] : []),
    "orders",
    "leads",
    ...(canCreateStaff ? ["staff"] : []),
  ];

  return (
    <main className="admin-shell">
      <aside className="admin-menu">
        <b>Admin Panel</b>
        <small>{auth.user.role} access</small>
        {menuItems.map((item) => (
          <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>
        ))}
      </aside>
      <section className="admin-content">
        {message && <div className="notice inline" onClick={() => setMessage("")}>{message}</div>}
        {tab === "dashboard" && <Dashboard stats={dashboard} />}
        {tab === "products" && (
          <ProductsAdmin
            products={products}
            editing={editing}
            setEditing={setEditing}
            saveProduct={saveProduct}
            deleteProduct={deleteProduct}
            canDelete={canDelete}
          />
        )}
        {tab === "gallery" && (
          <GalleryAdmin
            gallery={gallery}
            editing={editingGallery}
            setEditing={setEditingGallery}
            saveGalleryItem={saveGalleryItem}
            deleteGalleryItem={deleteGalleryItem}
            canDelete={canDelete}
          />
        )}
        {tab === "certificates" && (
          <CertificatesAdmin
            certificates={certificates}
            editing={editingCertificate}
            setEditing={setEditingCertificate}
            saveCertificate={saveCertificate}
            deleteCertificate={deleteCertificate}
            canDelete={canDelete}
          />
        )}
        {tab === "orders" && <OrdersAdmin orders={orders} updateOrder={updateOrder} />}
        {tab === "leads" && <LeadsAdmin leads={leads} updateLead={updateLead} />}
        {tab === "staff" && (
          canCreateStaff ? <StaffAdmin createStaff={createStaff} /> : <Empty message="Only owner/admin can create staff or admin users." />
        )}
      </section>
    </main>
  );
}

function Dashboard({ stats }) {
  const items = stats || { products: 0, orders: 0, new_orders: 0, leads: 0, gallery: 0, customers: 0 };
  return (
    <>
      <div className="section-head"><span className="pill">Dashboard</span><h1>Business Overview</h1></div>
      <div className="stats-grid">
        {Object.entries(items).map(([key, value]) => (
          <div key={key}><b>{value}</b><span>{key.replace("_", " ")}</span></div>
        ))}
      </div>
    </>
  );
}

function ProductsAdmin({ products, editing, setEditing, saveProduct, deleteProduct, canDelete }) {
  const product = editing || emptyProduct;
  return (
    <>
      <div className="section-head"><span className="pill">Products</span><h1>Add / Edit Product</h1></div>
      <form key={editing?.id || "new-product"} className="panel-form admin-form" onSubmit={(event) => { event.preventDefault(); saveProduct(event.currentTarget); }}>
        <input name="name" defaultValue={product.name} placeholder="Product name" required />
        <input name="brand" defaultValue={product.brand} placeholder="Brand" />
        <select name="category" defaultValue={product.category}>
          {defaultCategories.map((item) => <option key={item}>{item}</option>)}
        </select>
        <div className="two-col">
          <input name="price" type="number" defaultValue={product.price} placeholder="Price" />
          <input name="mrp" type="number" defaultValue={product.mrp} placeholder="MRP" />
        </div>
        <div className="two-col">
          <input name="stock" type="number" defaultValue={product.stock} placeholder="Stock" />
          <input name="warranty" defaultValue={product.warranty} placeholder="Warranty" />
        </div>
        <textarea name="description" defaultValue={product.description} placeholder="Description" />
        <input name="image_url" defaultValue={product.image_url} placeholder="Existing image URL" />
        <input name="image_file" type="file" accept="image/*" capture="environment" />
        <label className="check-row"><input name="featured" type="checkbox" defaultChecked={product.featured} /> Featured product</label>
        <button className="primary">{editing ? "Update Product" : "Save Product"}</button>
      </form>
      <div className="table-list">
        {products.map((item) => (
          <article className="admin-row" key={item.id}>
            <img src={imageUrl(item.image_url)} alt={item.name} />
            <div><b>{item.name}</b><small>{item.category} / {item.brand}</small></div>
            <span>Stock {item.stock}</span>
            <button onClick={() => setEditing(item)}>Edit</button>
            {canDelete && <button className="danger" onClick={() => deleteProduct(item.id)}>Delete</button>}
          </article>
        ))}
      </div>
    </>
  );
}

function GalleryAdmin({ gallery, editing, setEditing, saveGalleryItem, deleteGalleryItem, canDelete }) {
  const item = editing || emptyGalleryItem;
  return (
    <>
      <div className="section-head"><span className="pill">Showroom</span><h1>Add / Edit Gallery Photo</h1></div>
      <form key={editing?.id || "new-gallery"} className="panel-form admin-form" onSubmit={(event) => { event.preventDefault(); saveGalleryItem(event.currentTarget); }}>
        <input name="title" defaultValue={item.title} placeholder="Photo title" required />
        <textarea name="caption" defaultValue={item.caption} placeholder="Caption" />
        <div className="two-col">
          <input name="position" type="number" defaultValue={item.position} placeholder="Sort order" />
          <input name="image_url" defaultValue={item.image_url} placeholder="Existing image URL" />
        </div>
        <input name="image_file" type="file" accept="image/*" capture="environment" />
        <button className="primary">{editing ? "Update Photo" : "Save Photo"}</button>
      </form>
      <div className="table-list">
        {gallery.map((row) => (
          <article className="admin-row gallery-admin-row" key={row.id}>
            <img src={imageUrl(row.image_url)} alt={row.title} />
            <div><b>{row.title}</b><small>{row.caption || "No caption"}</small></div>
            <span>Order {row.position || 0}</span>
            <button onClick={() => setEditing(row)}>Edit</button>
            {canDelete && <button className="danger" onClick={() => deleteGalleryItem(row.id)}>Delete</button>}
          </article>
        ))}
      </div>
    </>
  );
}

function CertificatesAdmin({ certificates, editing, setEditing, saveCertificate, deleteCertificate, canDelete }) {
  const item = editing || emptyCertificateItem;
  return (
    <>
      <div className="section-head"><span className="pill">Certificates</span><h1>Add / Edit Dealership Proof</h1></div>
      <form key={editing?.id || "new-certificate"} className="panel-form admin-form" onSubmit={(event) => { event.preventDefault(); saveCertificate(event.currentTarget); }}>
        <input name="title" defaultValue={item.title} placeholder="Certificate title" required />
        <input name="brand" defaultValue={item.brand} placeholder="Brand / company name" />
        <textarea name="caption" defaultValue={item.caption} placeholder="Caption" />
        <div className="two-col">
          <input name="position" type="number" defaultValue={item.position} placeholder="Sort order" />
          <input name="image_url" defaultValue={item.image_url} placeholder="Existing image URL" />
        </div>
        <input name="image_file" type="file" accept="image/*" capture="environment" />
        <button className="primary">{editing ? "Update Certificate" : "Save Certificate"}</button>
      </form>
      <div className="table-list">
        {certificates.map((row) => (
          <article className="admin-row certificate-admin-row" key={row.id}>
            <img src={imageUrl(row.image_url)} alt={row.title} />
            <div><b>{row.title}</b><small>{row.brand || row.caption || "No caption"}</small></div>
            <span>Order {row.position || 0}</span>
            <button onClick={() => setEditing(row)}>Edit</button>
            {canDelete && <button className="danger" onClick={() => deleteCertificate(row.id)}>Delete</button>}
          </article>
        ))}
      </div>
    </>
  );
}

function OrdersAdmin({ orders, updateOrder }) {
  return (
    <>
      <div className="section-head"><span className="pill">Orders</span><h1>Manage Orders</h1></div>
      <div className="table-list">
        {orders.map((order) => (
          <article className="order-card" key={order.id}>
            <b>{order.order_no}</b>
            <small>{order.customer?.name} / {order.customer?.phone}</small>
            <p>{order.items.map((item) => `${item.name} x ${item.quantity}`).join(", ")}</p>
            <select value={order.status} onChange={(event) => updateOrder(order.id, event.target.value)}>
              {orderStatuses.map((item) => <option key={item}>{item}</option>)}
            </select>
          </article>
        ))}
      </div>
    </>
  );
}

function LeadsAdmin({ leads, updateLead }) {
  return (
    <>
      <div className="section-head"><span className="pill">Leads</span><h1>Customer Inquiries</h1></div>
      <div className="table-list">
        {leads.map((lead) => (
          <article className="order-card" key={lead.id}>
            <b>{lead.name}</b>
            <small>{lead.phone} / {lead.category}</small>
            <p>{lead.message}</p>
            <select value={lead.status} onChange={(event) => updateLead(lead.id, event.target.value)}>
              {leadStatuses.map((item) => <option key={item}>{item}</option>)}
            </select>
          </article>
        ))}
      </div>
    </>
  );
}

function StaffAdmin({ createStaff }) {
  return (
    <>
      <div className="section-head"><span className="pill">Owner controls</span><h1>Create Staff / Admin</h1></div>
      <form className="panel-form" onSubmit={(event) => { event.preventDefault(); createStaff(event.currentTarget); }}>
        <input name="name" placeholder="Name" required />
        <input name="phone" placeholder="Phone" required />
        <input name="password" placeholder="Password" required />
        <select name="role">
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        <button className="primary">Create User</button>
      </form>
    </>
  );
}

function FloatingLinks() {
  return (
    <div className="float-links" aria-label="Quick contact links">
      <a className="wa" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">WA</a>
      <a className="call" href={`tel:+${callNumber}`}>Call</a>
      <a className="map" href={mapsUrl} target="_blank" rel="noreferrer">Map</a>
    </div>
  );
}

function Footer({ setPage }) {
  const jumpTo = (id) => {
    setPage("store");
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <b>S.K. ENTERPRISES</b>
          <p>Prayagraj's trusted hardware and sanitary store. Authorized dealers of ESSEL, Birla Pivot, Roff, Supreme.</p>
          <small>GSTIN: {gstin}</small>
        </div>
        <div className="footer-col">
          <b>Quick Links</b>
          <button onClick={() => jumpTo("products")}>Products</button>
          <button onClick={() => jumpTo("why")}>Contractors</button>
          <button onClick={() => jumpTo("gallery")}>Gallery</button>
          <button onClick={() => jumpTo("contact")}>Contact</button>
        </div>
        <div className="footer-col">
          <b>Contact Us</b>
          <span>📍 Kanihar Road, Saray Taki<br />Prayagraj - 211019</span>
          <a href={`tel:+${callNumber}`}>📞 70070 62590</a>
          <a href={`tel:+${alternateCallNumber}`}>📞 63867 43995</a>
          <a href={mapsUrl} target="_blank" rel="noreferrer">Location CW9J+CF</a>
        </div>
      </div>
      <div className="footer-bottom">© 2026 S.K. Enterprises, Prayagraj. All Rights Reserved.</div>
    </footer>
  );
}

function Empty({ message }) {
  return <div className="empty">{message}</div>;
}

function useHashPage() {
  const getPage = () => (window.location.hash || "#store").replace("#", "");
  const [page, setPageState] = useState(getPage);
  useEffect(() => {
    const onHash = () => setPageState(getPage());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const setPage = (next) => {
    window.location.hash = next;
    setPageState(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return [page, setPage];
}

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

export default App;
