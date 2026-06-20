import React, { useEffect, useMemo, useRef, useState } from "react";
import "./styles.css";
import {
  api,
  imageUrl,
  defaultBrands,
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

const emptyBrandItem = {
  name: "",
  logo_url: "",
  description: "",
  warranty: "",
  position: 0,
  active: true,
};

const androidPackageName = "com.skenterprises.prayagraj";
const nativeApkUrl = "/downloads/SK-Enterprises.apk";

let statsCountersPlayed = false;

const featureCardsByLang = {
  en: [
    ["📜", "Genuine Products", "100% original company supplied products."],
    ["💰", "Wholesale Pricing", "Best market price for retail and bulk orders."],
    ["🚚", "Fast Delivery", "Quick material delivery directly to your site."],
    ["🧾", "GST Billing", "Transparent pricing with proper GST invoices."],
    ["🏗️", "Contractor Support", "Special priority processing for builders and plumbers."],
    ["✅", "Authorized Dealer", "Official dealer for top brands ensuring full warranty."],
  ],
  hi: [
    ["📜", "असली सामान", "100% ओरिजिनल कंपनी सप्लाई वाला सामान।"],
    ["💰", "थोक रेट", "रिटेल और बल्क ऑर्डर के लिए बढ़िया बाजार भाव।"],
    ["🚚", "तेज डिलीवरी", "साइट तक सामान की जल्दी और भरोसेमंद डिलीवरी।"],
    ["🧾", "GST बिलिंग", "साफ रेट और proper GST invoice के साथ बिलिंग।"],
    ["🏗️", "कॉन्ट्रैक्टर सपोर्ट", "बिल्डर और प्लंबर के लिए priority processing।"],
    ["✅", "अधिकृत डीलर", "टॉप ब्रांड की official dealership और warranty support।"],
  ],
  bho: [
    ["📜", "असली सामान", "100% ओरिजिनल कंपनी सप्लाई वाला सामान।"],
    ["💰", "थोक भाव", "रिटेल आ बल्क ऑर्डर खातिर बढ़िया बाजार भाव।"],
    ["🚚", "जल्दी डिलीवरी", "साइट तक सामान जल्दी आ भरोसेमंद तरीका से पहुंचावल जाला।"],
    ["🧾", "GST बिलिंग", "साफ रेट आ proper GST invoice के साथ बिलिंग।"],
    ["🏗️", "ठेकेदार सपोर्ट", "बिल्डर आ प्लंबर लोग खातिर priority processing।"],
    ["✅", "अधिकृत डीलर", "टॉप ब्रांड के official dealership आ warranty support।"],
  ],
};

const reviewsByLang = {
  en: [
    {
      name: "Dheeraj Pandey",
      text: "The shopkeeper's nature is very good. I got ESSEL fittings at a genuine rate with proper warranty card and guidance.",
    },
    {
      name: "Vivek Mishra",
      text: "I purchased tiles, sanitaryware and Roff material for my bathroom from here. Rates were clear and delivery was on time.",
    },
    {
      name: "Ramesh Gupta",
      text: "For builder work I needed Supreme pipes and bath fittings. Bulk pricing was good and GST billing was proper.",
    },
  ],
  hi: [
    {
      name: "Dheeraj Pandey",
      text: "दुकानदार का व्यवहार बहुत अच्छा है। ESSEL fittings सही रेट पर मिली और warranty card के साथ पूरी जानकारी भी दी।",
    },
    {
      name: "Vivek Mishra",
      text: "घर के bathroom के लिए tiles, sanitary और Roff material यहीं से लिया। रेट clear था और delivery भी time पर हुई।",
    },
    {
      name: "Ramesh Gupta",
      text: "Builder work के लिए Supreme pipes और bath fittings चाहिए थे। Bulk quantity पर अच्छा price मिला और GST bill proper मिला।",
    },
  ],
  bho: [
    {
      name: "Dheeraj Pandey",
      text: "दुकानदार के व्यवहार बहुत नीमन बा। ESSEL fittings सही रेट पर मिलल आ warranty card के साथ पूरा जानकारी भी मिलल।",
    },
    {
      name: "Vivek Mishra",
      text: "घर के bathroom खातिर tiles, sanitary आ Roff material इहे दुकान से लिहनी। रेट साफ रहे आ delivery समय पर भइल।",
    },
    {
      name: "Ramesh Gupta",
      text: "Builder work खातिर Supreme pipes आ bath fittings चाहीं रहे। Bulk quantity पर बढ़िया price मिलल आ GST bill proper मिलल।",
    },
  ],
};

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
    register: "Register",
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
    register: "रजिस्टर",
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
    register: "रजिस्टर",
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
  const [products, setProducts] = useState(demoProducts);
  const [brands, setBrands] = useState(defaultBrands);
  const [gallery, setGallery] = useState(defaultGallery);
  const [certificates, setCertificates] = useState(defaultCertificates);
  const [categories, setCategories] = useState(defaultCategories);
  const [query, setQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useLocalStorage("sk_fullstack_cart", []);
  const [auth, setAuth] = useLocalStorage("sk_fullstack_auth", null);
  const [notice, setNotice] = useState("");
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const updateInstallPrompt = () => setShowInstallPrompt(shouldShowMobileInstallPrompt());
    updateInstallPrompt();
    window.addEventListener("resize", updateInstallPrompt);
    window.addEventListener("orientationchange", updateInstallPrompt);
    return () => {
      window.removeEventListener("resize", updateInstallPrompt);
      window.removeEventListener("orientationchange", updateInstallPrompt);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("has-install-prompt", showInstallPrompt);
    return () => document.body.classList.remove("has-install-prompt");
  }, [showInstallPrompt]);

  useEffect(() => {
    loadCatalog();
  }, []);

  const t = (key) => copy[lang]?.[key] || copy.en[key] || key;

  async function loadCatalog() {
    setCatalogLoading(true);
    try {
      const [productRows, categoryRows, brandRows, galleryRows, certificateRows] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getBrands(),
        api.getGallery(),
        api.getCertificates(),
      ]);
      setProducts(productRows.length ? productRows : demoProducts);
      setCategories(categoryRows.length ? categoryRows.map((item) => item.name) : defaultCategories);
      setBrands(brandRows.length ? brandRows : defaultBrands);
      setGallery(galleryRows.length ? galleryRows : defaultGallery);
      setCertificates(certificateRows.length ? certificateRows : defaultCertificates);
    } catch {
      setProducts((current) => (current.length ? current : demoProducts));
      setCategories(defaultCategories);
      setBrands(defaultBrands);
      setGallery(defaultGallery);
      setCertificates(defaultCertificates);
      setNotice("Backend offline: demo catalog is visible. Start FastAPI + MongoDB for live data.");
    } finally {
      setCatalogLoading(false);
    }
  }

  const visibleProducts = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const searchable = `${product.name} ${product.brand} ${product.category} ${product.warranty} ${product.description}`.toLowerCase();
      const matchesSearch = !terms.length || terms.every((term) => searchable.includes(term));
      const brandName = selectedBrand.toLowerCase();
      const brandKey = brandName.split(" ")[0];
      const matchesBrand = !selectedBrand || searchable.includes(brandName) || searchable.includes(brandKey);
      return matchesCategory && matchesSearch && matchesBrand;
    });
  }, [products, category, query, selectedBrand]);

  const featured = products.filter((product) => product.featured).slice(0, 4);
  const cartQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  function addToCart(product, quantity = 1) {
    const stock = Number(product.stock || 0);
    let message = "Product added to cart";
    if (stock <= 0) {
      setNotice("This product is out of stock");
      return;
    }
    const existingCartItem = cart.find((item) => item.product_id === product.id);
    const currentQty = Number(existingCartItem?.quantity || 0);
    const availableQty = Math.max(0, stock - currentQty);
    if (availableQty <= 0) {
      setNotice(`Only ${stock} in stock. You already added maximum quantity.`);
      return;
    }
    const requestedQty = Math.max(1, Number(quantity || 1));
    const nextAddQty = Math.min(requestedQty, availableQty);
    if (nextAddQty < requestedQty) {
      message = `Only ${stock} in stock. Quantity adjusted.`;
    }
    setCart((oldCart) => {
      const existing = oldCart.find((item) => item.product_id === product.id);
      if (existing) {
        return oldCart.map((item) =>
          item.product_id === product.id ? { ...item, stock, quantity: item.quantity + nextAddQty } : item
        );
      }
      return [
        ...oldCart,
        {
          product_id: product.id,
          name: product.name,
          price: Number(product.price || 0),
          image_url: product.image_url,
          stock,
          quantity: nextAddQty,
        },
      ];
    });
    setNotice(message);
  }

  function updateQty(productId, quantity) {
    const cartItem = cart.find((item) => item.product_id === productId);
    const cartItemStock = Number(cartItem?.stock || 0);
    const requestedQty = Math.max(0, quantity);
    if (cartItemStock > 0 && requestedQty > cartItemStock) {
      setNotice(`Only ${cartItemStock} in stock.`);
    }
    setCart((oldCart) =>
      oldCart
        .map((item) => {
          if (item.product_id !== productId) return item;
          const stock = Number(item.stock || 0);
          const nextQty = stock > 0 ? Math.min(requestedQty, stock) : requestedQty;
          return { ...item, quantity: nextQty };
        })
        .filter((item) => item.quantity > 0)
    );
  }

  async function handleAuth(mode, form) {
    try {
      const payload = Object.fromEntries(new FormData(form));
      const result = mode === "register" ? await api.register(payload) : await api.login(payload);
      setAuth(result);
      setNotice(`Logged in as ${result.user.name}`);
      setPage(result.user.role === "customer" ? "store" : "admin");
    } catch (error) {
      setNotice(error.message || "Login/Register failed. Please check phone and password.");
    }
  }

  function logout() {
    setAuth(null);
    setPage("store");
  }

  async function handleLead(form) {
    try {
      const payload = Object.fromEntries(new FormData(form));
      await api.createLead(payload);
      setNotice("Inquiry saved. We will contact you soon.");
      form.reset();
    } catch (error) {
      setNotice(error.message || "Inquiry failed. Please check phone number.");
    }
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
        line2: data.line2,
        city: data.city || "Prayagraj",
        pincode: data.pincode || "",
      },
    };
    try {
      const result = await api.createOrder(payload, auth.token);
      setCart([]);
      setNotice(`Order ${result.order.order_no} placed`);
      const url = `https://wa.me/${result.whatsapp_number || whatsappNumber}?text=${encodeURIComponent(result.whatsapp_text)}`;
      window.open(url, "_blank", "noopener");
      setPage("orders");
    } catch (error) {
      setNotice(error.message || "Order failed. Please check phone and address.");
    }
  }

  function closeInstallPrompt() {
    sessionStorage.setItem("sk_install_prompt_closed", "1");
    setShowInstallPrompt(false);
  }

  return (
    <>
      <Header auth={auth} cartQty={cartQty} setPage={setPage} lang={lang} setLang={setLang} t={t} />
      {notice && <div className="notice" onClick={() => setNotice("")}>{notice}</div>}

      {page === "store" && (
        <StorePage
          t={t}
          lang={lang}
          featured={featured}
          products={visibleProducts}
          brands={brands}
          gallery={gallery}
          certificates={certificates}
          categories={categories}
          query={query}
          setQuery={setQuery}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          category={category}
          setCategory={setCategory}
          cart={cart}
          addToCart={addToCart}
          updateQty={updateQty}
          catalogLoading={catalogLoading}
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

      {(page === "login" || page === "register") && (
        <LoginPage
          auth={auth}
          logout={logout}
          onAuth={handleAuth}
          setPage={setPage}
          initialMode={page === "register" ? "register" : "login"}
        />
      )}

      {page === "orders" && (
        <OrderHistory auth={auth} setPage={setPage} />
      )}

      {page === "admin" && (
        <AdminPanel auth={auth} setPage={setPage} reloadCatalog={loadCatalog} />
      )}

      {showInstallPrompt && <MobileInstallPrompt onClose={closeInstallPrompt} />}
      <FloatingLinks />
      <Footer setPage={setPage} />
    </>
  );
}

function Header({ auth, cartQty, setPage, lang, setLang, t }) {
  const adminRole = ["owner", "admin", "staff"].includes(auth?.user?.role);
  const jumpTo = (id) => {
    setPage("store");
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  return (
    <header className="site-header">
      <button className="brand-button" onClick={() => setPage("store")}>
        <span className="brand-mark"><img src="/assets/sk-logo.png" alt="S.K. Enterprises logo" /></span>
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
        <LanguageSelect lang={lang} setLang={setLang} />
        <div className="lang-switch" aria-label="Language">
          {["en", "hi", "bho"].map((item) => (
            <button key={item} className={lang === item ? "active" : ""} onClick={() => setLang(item)}>
              {item === "en" ? "EN" : item === "hi" ? "हिं" : "भोज"}
            </button>
          ))}
        </div>
        {auth ? (
          <button className="soft-button account-button" onClick={() => setPage("login")}>{auth.user.name}</button>
        ) : (
          <div className="auth-buttons">
            <button className="soft-button account-button" onClick={() => setPage("login")}>{t("login")}</button>
            <button className="soft-button register-button" onClick={() => setPage("register")}>{t("register")}</button>
          </div>
        )}
        <button className="cart-button" onClick={() => setPage("cart")}>{t("cart")} <b>{cartQty}</b></button>
      </div>
    </header>
  );
}

function LanguageSelect({ lang, setLang }) {
  return (
    <label className="lang-select-wrap" aria-label="Language">
      <select value={lang} onChange={(event) => setLang(event.target.value)}>
        <option value="en">EN English</option>
        <option value="hi">हिंदी</option>
        <option value="bho">भोजपुरी</option>
      </select>
    </label>
  );
}

export function StorePage({
  t,
  lang,
  featured,
  products,
  brands,
  gallery,
  certificates,
  categories,
  query,
  setQuery,
  selectedBrand,
  setSelectedBrand,
  category,
  setCategory,
  cart,
  addToCart,
  updateQty,
  catalogLoading,
  submitLead,
  openDetail,
}) {
  const activeProductFilter = Boolean(selectedBrand || query.trim() || category !== "All");
  const cartByProductId = useMemo(
    () => new Map((cart || []).map((item) => [item.product_id, Number(item.quantity || 0)])),
    [cart]
  );
  const jumpToProductResults = () => {
    window.setTimeout(() => document.getElementById("products-list")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };
  const clearFilters = () => {
    setSelectedBrand("");
    setQuery("");
    setCategory("All");
  };
  const productResults = (
    <>
      {activeProductFilter && (
        <div className="filter-strip">
          <b>{selectedBrand ? `${selectedBrand} products` : query.trim() ? "Search results" : `${category} products`}</b>
          <button onClick={clearFilters}>Clear</button>
        </div>
      )}
      {catalogLoading && <div className="catalog-loading">Loading latest stock and prices...</div>}
      <div className="product-grid" id="products-list">
        {!products.length && <Empty message="No products found. Try another brand or search." />}
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            cartQuantity={cartByProductId.get(product.id) || 0}
            addToCart={addToCart}
            updateQty={updateQty}
            openDetail={openDetail}
            t={t}
          />
        ))}
      </div>
    </>
  );

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
      <BrandMarquee brands={brands} />
      <StatsBar t={t} />

      <section className="section" id="products">
        <SectionHead title={t("catalog")} sub={t("featuredSub")} />
        <form className="toolbar search-toolbar" onSubmit={(event) => { event.preventDefault(); setSelectedBrand(""); jumpToProductResults(); }}>
          <div className="search-box">
            <input value={query} onChange={(event) => { setQuery(event.target.value); setSelectedBrand(""); }} placeholder={t("search")} />
            <button type="submit" aria-label="Search">🔍</button>
          </div>
          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setSelectedBrand("");
              if (event.target.value !== "All") jumpToProductResults();
            }}
          >
            <option>All</option>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </form>
        <div className="category-tabs">
          {["All", ...categories].map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => {
                setCategory(item);
                setSelectedBrand("");
                if (item !== "All") jumpToProductResults();
              }}
            >
              {item === "All" ? t("all") : item}
            </button>
          ))}
        </div>
        {activeProductFilter && productResults}
        <ShopByBrand
          brands={brands}
          selectedBrand={selectedBrand}
          onSelect={(brand) => {
            setSelectedBrand(brand.name);
            setQuery("");
            setCategory("All");
            jumpToProductResults();
          }}
        />
        {!activeProductFilter && productResults}
      </section>

      <WhyUs t={t} lang={lang} />
      <DealershipSection t={t} certificates={certificates} />
      <ShowroomGallery gallery={gallery} t={t} />
      <ReviewsSection t={t} lang={lang} />
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

function BrandMarquee({ brands }) {
  const sorted = [...brands].sort((a, b) => Number(a.position || 0) - Number(b.position || 0));
  const items = [...sorted, ...sorted];
  return (
    <section className="brand-marquee" aria-label="Authorized brands">
      <div className="marquee-track">
        {items.map((brand, index) => (
          <div className="brand-tile" key={`${brand.name}-${index}`}>
            <span><img src={imageUrl(brand.logo_url)} alt={`${brand.name} logo`} /></span>
            <div>
              <b>{brand.name}</b>
              <small>{brand.warranty || brand.description}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ShopByBrand({ brands, selectedBrand, onSelect }) {
  const sorted = [...brands].sort((a, b) => Number(a.position || 0) - Number(b.position || 0));
  return (
    <section className="shop-by-brand" aria-label="Shop by brand">
      <div className="subsection-label">Shop by Brand</div>
      <div className="brand-grid">
        {sorted.map((brand) => (
          <button
            className={`brand-card ${selectedBrand === brand.name ? "active" : ""}`}
            data-brand-name={brand.name}
            key={brand.id || brand.name}
            onClick={() => onSelect(brand)}
          >
            <span><img src={imageUrl(brand.logo_url)} alt={`${brand.name} logo`} /></span>
            <b>{brand.name}</b>
            <small>{brand.warranty}</small>
            <p>{brand.description}</p>
          </button>
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
  const counterRef = useRef(null);
  const alreadyPlayedRef = useRef(statsCountersPlayed);
  const [value, setValue] = useState(alreadyPlayedRef.current ? target : 0);
  const [started, setStarted] = useState(alreadyPlayedRef.current);

  useEffect(() => {
    if (statsCountersPlayed) {
      setValue(target);
      setStarted(true);
      return undefined;
    }
    const node = counterRef.current;
    if (!node) return undefined;
    if (!("IntersectionObserver" in window)) {
      statsCountersPlayed = true;
      setStarted(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          statsCountersPlayed = true;
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.45 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (statsCountersPlayed && alreadyPlayedRef.current) {
      setValue(target);
      return undefined;
    }
    if (!started) {
      setValue(0);
      return undefined;
    }
    let frame = 0;
    const totalFrames = 110;
    const timer = window.setInterval(() => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress >= 1) window.clearInterval(timer);
    }, 24);
    return () => window.clearInterval(timer);
  }, [started, target]);
  return <span className="counter-number" ref={counterRef}>{value}{suffix}</span>;
}

function SectionHead({ kicker, title, sub }) {
  return (
    <div className="section-head">
      {kicker && <span className="pill">{kicker}</span>}
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </div>
  );
}

function PhoneInput({ name = "phone", placeholder = "Phone number", defaultValue = "", ...props }) {
  const syncValidity = (input) => {
    input.setCustomValidity(input.value && input.value.length !== 10 ? "Enter exactly 10 digits only." : "");
  };
  return (
    <input
      {...props}
      name={name}
      type="tel"
      inputMode="numeric"
      autoComplete="tel"
      pattern="[0-9]{10}"
      maxLength={10}
      defaultValue={defaultValue}
      placeholder={placeholder}
      title="Enter exactly 10 digits only"
      onBeforeInput={(event) => {
        if (event.data && !/^\d+$/.test(event.data)) event.preventDefault();
      }}
      onPaste={(event) => {
        const input = event.currentTarget;
        const pasted = event.clipboardData.getData("text").trim();
        const selected = Math.max(0, Number(input.selectionEnd) - Number(input.selectionStart));
        const nextLength = input.value.length - selected + pasted.length;
        if (!/^\d+$/.test(pasted) || nextLength > 10) {
          event.preventDefault();
          input.setCustomValidity("Enter exactly 10 digits only.");
          input.reportValidity();
        }
      }}
      onInput={(event) => {
        const input = event.currentTarget;
        input.value = input.value.replace(/\D/g, "").slice(0, 10);
        syncValidity(input);
      }}
      onInvalid={(event) => {
        event.currentTarget.setCustomValidity("Enter exactly 10 digits only.");
      }}
    />
  );
}

function PasswordInput({ name = "password", placeholder = "Password", defaultValue = "", ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="password-field">
      <input
        {...props}
        name={name}
        type={visible ? "text" : "password"}
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete={props.autoComplete || (name === "password" ? "current-password" : "off")}
      />
      <button
        className={`password-eye ${visible ? "showing" : ""}`}
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? "Hide password" : "Show password"}
        title={visible ? "Hide password" : "Show password"}
      >
        <svg className="eye-icon" viewBox="0 0 24 24" aria-hidden="true">
          {visible ? (
            <>
              <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
              <circle cx="12" cy="12" r="3" />
            </>
          ) : (
            <>
              <path d="M3 3l18 18" />
              <path d="M10.7 5.2A10.9 10.9 0 0 1 12 5c6 0 9.5 7 9.5 7a18 18 0 0 1-3 4.1" />
              <path d="M6.6 6.6C3.9 8.4 2.5 12 2.5 12s3.5 7 9.5 7a10.8 10.8 0 0 0 4.7-1.1" />
              <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
            </>
          )}
        </svg>
      </button>
    </div>
  );
}

function formatRupees(value) {
  return `Rs ${Math.round(Number(value || 0)).toLocaleString("en-IN")}`;
}

function getFormFiles(formData, name) {
  return formData
    .getAll(name)
    .filter((file) => file && typeof file === "object" && Number(file.size) > 0);
}

function statusClass(status) {
  return `status-${String(status || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}

function getProductPricing(product) {
  const price = Number(product.price || 0);
  const mrp = Number(product.mrp || 0);
  const discount = mrp > price && price > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;
  return { price, mrp, discount, hasPrice: price > 0 };
}

function PriceBlock({ product, t, large = false }) {
  const { price, mrp, discount, hasPrice } = getProductPricing(product);
  if (!hasPrice) return <b className="quote-price">{t("askQuote")}</b>;
  return (
    <div className={`price-block ${large ? "large" : ""}`}>
      <div className="selling-line">
        <b>{formatRupees(price)}</b>
        {discount > 0 && <span>{discount}% OFF</span>}
      </div>
      {mrp > price && (
        <div className="mrp-line">
          MRP <s>{formatRupees(mrp)}</s>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, cartQuantity, addToCart, updateQty, openDetail, t }) {
  const stock = Number(product.stock || 0);
  const inStock = stock > 0;
  const inCart = Number(cartQuantity || 0);
  return (
    <article className="product-card">
      <button className="image-button" onClick={() => openDetail(product)}>
        <img src={imageUrl(product.image_url)} alt={product.name} loading="lazy" decoding="async" />
        {product.featured && <span>Featured</span>}
      </button>
      <div className="product-body">
        <small>{product.category}</small>
        <h3>{product.name}</h3>
        <p>{product.brand}</p>
        <PriceBlock product={product} t={t} />
      </div>
      <div className="card-actions">
        <button onClick={() => openDetail(product)}>{t("details")}</button>
        {inCart > 0 ? (
          <div className="card-stepper" aria-label={`${product.name} cart quantity`}>
            <button onClick={() => updateQty(product.id, inCart - 1)}>-</button>
            <b>{inCart}</b>
            <button disabled={inCart >= stock} onClick={() => addToCart(product)}>+</button>
          </div>
        ) : (
          <button className="primary add-cart-button" disabled={!inStock} onClick={() => addToCart(product)}>
            {inStock ? t("addCart") : "Out"}
          </button>
        )}
      </div>
    </article>
  );
}

function WhyUs({ t, lang }) {
  const items = featureCardsByLang[lang] || featureCardsByLang.en;
  return (
    <section className="section why-us" id="why">
      <SectionHead title={t("whyTitle")} />
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
      <SectionHead title={t("dealership")} sub={t("dealershipSub")} />
      <div className="certs-grid">
        {sorted.map((item) => (
          <article className="cert-card" key={item.title}>
            <img src={imageUrl(item.image_url)} alt={item.title} loading="lazy" decoding="async" />
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
      <SectionHead title={t("gallery")} sub={t("gallerySub")} />
      <div className="gallery-grid">
        {sorted.map((item) => (
          <article className="gallery-card" key={item.id || item.image_url}>
            <img src={imageUrl(item.image_url)} alt={item.title} loading="lazy" decoding="async" />
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

function ReviewsSection({ t, lang }) {
  const reviews = reviewsByLang[lang] || reviewsByLang.en;
  return (
    <section className="section reviews-section">
      <SectionHead title={t("reviews")} sub={t("reviewsSub")} />
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
        <PhoneInput placeholder={t("formPhone")} required />
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
  const stock = Number(product.stock || 0);
  const maxQty = Math.max(1, stock);
  const [qty, setQty] = useState(stock > 0 ? 1 : 0);
  const photos = Array.from(new Set([product.image_url, ...(product.image_urls || [])].filter(Boolean)));
  const [activePhoto, setActivePhoto] = useState(photos[0] || product.image_url);
  return (
    <main className="section detail-layout">
      <button className="text-button" onClick={back}>Back to products</button>
      <div className="detail-media">
        <img className="detail-image" src={imageUrl(activePhoto || product.image_url)} alt={product.name} />
        {photos.length > 1 && (
          <div className="thumb-row">
            {photos.map((photo) => (
              <button className={activePhoto === photo ? "active" : ""} key={photo} onClick={() => setActivePhoto(photo)}>
                <img src={imageUrl(photo)} alt={product.name} />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="detail-copy">
        <span className="pill">{product.category}</span>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <PriceBlock product={product} t={t} large />
        <dl>
          <div><dt>Brand</dt><dd>{product.brand || "-"}</dd></div>
          <div><dt>SP</dt><dd>{product.price ? formatRupees(product.price) : t("finalRate")}</dd></div>
          <div><dt>MRP</dt><dd>{product.mrp ? formatRupees(product.mrp) : "-"}</dd></div>
          <div><dt>Stock</dt><dd>{product.stock}</dd></div>
          <div><dt>Warranty</dt><dd>{product.warranty || "-"}</dd></div>
        </dl>
        <div className="qty-box">
          <button disabled={stock <= 0} onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
          <b>{qty}</b>
          <button disabled={stock <= 0 || qty >= maxQty} onClick={() => setQty(Math.min(maxQty, qty + 1))}>+</button>
          <button className="primary" disabled={stock <= 0} onClick={() => addToCart(product, qty)}>{stock > 0 ? t("addCart") : "Out of Stock"}</button>
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
      {cart.map((item) => {
        const stock = Number(item.stock || 0);
        return (
          <div className="cart-line" key={item.product_id}>
            <img src={imageUrl(item.image_url)} alt={item.name} />
            <div>
              <h3>{item.name}</h3>
              <p>{item.price ? formatRupees(item.price) : "Quote item"}</p>
              {stock > 0 && <small>Stock limit: {stock}</small>}
            </div>
            <div className="qty-box">
              <button onClick={() => updateQty(item.product_id, item.quantity - 1)}>-</button>
              <b>{item.quantity}</b>
              <button disabled={stock > 0 && item.quantity >= stock} onClick={() => updateQty(item.product_id, item.quantity + 1)}>+</button>
            </div>
          </div>
        );
      })}
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
        <PhoneInput defaultValue={auth.user.phone} placeholder="Phone" required />
        <input name="line1" placeholder="Address line 1" required />
        <input name="line2" placeholder="Address line 2" required />
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

export function LoginPage({ auth, logout, onAuth, setPage, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode);
  const adminRole = ["owner", "admin", "staff"].includes(auth?.user?.role);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  if (auth) {
    return (
      <main className="section narrow">
        <div className="section-head">
          <span className="pill">Account</span>
          <h1>{auth.user.name}</h1>
          <p>You are logged in. Logout will happen only when you press the red button.</p>
        </div>
        <div className="panel-form account-panel">
          <div className="account-summary">
            <b>{auth.user.name}</b>
            <span>{auth.user.phone}</span>
            <small>{auth.user.role}</small>
          </div>
          <div className="account-actions">
            <button className="text-button" onClick={() => setPage("orders")}>My Orders</button>
            {adminRole && <button className="text-button" onClick={() => setPage("admin")}>Admin Panel</button>}
            <button className="logout-button" onClick={logout}>Logout</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="section narrow">
      <div className="section-head">
        <span className="pill">{mode === "login" ? "Login" : "Register"}</span>
        <h1>{mode === "login" ? "Customer / Staff Login" : "Create Customer Account"}</h1>
      </div>
      <div className="auth-mode-tabs">
        <button className={mode === "login" ? "active" : ""} onClick={() => setPage("login")}>Login</button>
        <button className={mode === "register" ? "active" : ""} onClick={() => setPage("register")}>Register</button>
      </div>
      <form className="panel-form auth-form" onSubmit={(event) => { event.preventDefault(); onAuth(mode, event.currentTarget); }}>
        {mode === "register" && <input name="name" placeholder="Full name" required />}
        <PhoneInput placeholder="Phone number" required />
        <PasswordInput placeholder="Password" autoComplete={mode === "register" ? "new-password" : "current-password"} required />
        <button className="primary">{mode === "login" ? "Login" : "Register"}</button>
      </form>
      <button className="text-button auth-switch" onClick={() => setPage(mode === "login" ? "register" : "login")}>
        {mode === "login" ? "New customer? Register" : "Already registered? Login"}
      </button>
    </main>
  );
}

export function OrderHistory({ auth, setPage }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadOrders() {
    if (!auth?.token) return;
    setLoading(true);
    try {
      const rows = await api.myOrders(auth.token);
      setOrders(rows);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!auth?.token) return undefined;
    loadOrders();
    const timer = window.setInterval(loadOrders, 30000);
    return () => window.clearInterval(timer);
  }, [auth?.token]);

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
      <div className="section-head order-history-head">
        <span className="pill">History</span>
        <h1>My Orders</h1>
        <p>Admin status update karega to yahin latest status dikhega.</p>
        <button className="text-button" onClick={loadOrders} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh Status"}
        </button>
      </div>
      <div className="table-list">
        {!orders.length && <Empty message="No orders yet." />}
        {orders.map((order) => (
          <article className="order-card" key={order.id}>
            <b>{order.order_no}</b>
            <span className={`status-badge ${statusClass(order.status)}`}>{order.status}</span>
            <small>{order.created_at?.slice(0, 10)}</small>
            {order.updated_at && <small>Updated: {order.updated_at.slice(0, 10)}</small>}
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
  const [brands, setBrands] = useState([]);
  const [orders, setOrders] = useState([]);
  const [leads, setLeads] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editingBrand, setEditingBrand] = useState(null);
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
    const [stats, productRows, brandRows, orderRows, leadRows, galleryRows, certificateRows] = await Promise.all([
      api.dashboard(auth.token),
      api.getProducts(),
      api.getBrands(),
      api.adminOrders(auth.token),
      api.adminLeads(auth.token),
      api.getGallery(),
      api.getCertificates(),
    ]);
    setDashboard(stats);
    setProducts(productRows);
    setBrands(brandRows);
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
    const imageFile = getFormFiles(fd, "image_file")[0];
    const imageUrls = String(fd.get("image_urls") || "")
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
    if (imageFile && imageFile.size) {
      const upload = await api.uploadImage(imageFile, auth.token);
      imageUrlValue = upload.image_url;
      imageUrls.unshift(upload.image_url);
    }
    const galleryFiles = getFormFiles(fd, "image_files");
    for (const file of galleryFiles) {
      const upload = await api.uploadImage(file, auth.token);
      imageUrls.push(upload.image_url);
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
      image_url: imageUrlValue || imageUrls[0] || "",
      image_urls: Array.from(new Set(imageUrls)),
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

  async function saveBrand(form) {
    const fd = new FormData(form);
    let logoUrlValue = fd.get("logo_url") || "";
    const logoFile = getFormFiles(fd, "logo_file")[0];
    if (logoFile && logoFile.size) {
      const upload = await api.uploadImage(logoFile, auth.token);
      logoUrlValue = upload.image_url;
    }
    const payload = {
      name: fd.get("name"),
      logo_url: logoUrlValue,
      description: fd.get("description"),
      warranty: fd.get("warranty"),
      position: Number(fd.get("position") || 0),
      active: true,
    };
    if (editingBrand?.id) await api.updateBrand(editingBrand.id, payload, auth.token);
    else await api.createBrand(payload, auth.token);
    setEditingBrand(null);
    form.reset();
    setMessage("Brand saved");
    refreshAdmin();
  }

  async function saveGalleryItem(form) {
    const fd = new FormData(form);
    let imageUrlValue = fd.get("image_url") || "";
    const imageFile = getFormFiles(fd, "image_file")[0];
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
    const imageFile = getFormFiles(fd, "image_file")[0];
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

  async function deleteBrand(id) {
    await api.deleteBrand(id, auth.token);
    setMessage("Brand deleted");
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
    setMessage(`Order status updated to ${status}. Customer account will show the latest status.`);
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
    ...(canDelete ? ["brands"] : []),
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
        {tab === "brands" && (
          <BrandsAdmin
            brands={brands}
            editing={editingBrand}
            setEditing={setEditingBrand}
            saveBrand={saveBrand}
            deleteBrand={deleteBrand}
            canDelete={canDelete}
          />
        )}
        {tab === "products" && (
          <ProductsAdmin
            products={products}
            brands={brands}
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
  const items = stats || { products: 0, brands: 0, orders: 0, new_orders: 0, leads: 0, gallery: 0, customers: 0 };
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

function AdminField({ label, hint, children }) {
  return (
    <div className="form-field">
      <span>{label}</span>
      {hint && <small>{hint}</small>}
      {children}
    </div>
  );
}

function PhotoUpload({ name, multiple = false }) {
  const [selected, setSelected] = useState("");
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);
  const updateSelected = (event, otherInputRef) => {
    if (otherInputRef.current) otherInputRef.current.value = "";
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      setSelected("");
      return;
    }
    setSelected(files.length === 1 ? files[0].name : `${files.length} photos selected`);
  };

  return (
    <div className="photo-upload-picker">
      <div className="photo-upload-actions">
        <label className="file-choice">
          <input ref={cameraRef} name={name} type="file" accept="image/*" capture="environment" onChange={(event) => updateSelected(event, galleryRef)} />
          <span>Camera</span>
        </label>
        <label className="file-choice">
          <input ref={galleryRef} name={name} type="file" accept="image/*" multiple={multiple} onChange={(event) => updateSelected(event, cameraRef)} />
          <span>Gallery</span>
        </label>
      </div>
      <small className="selected-file-note">{selected || "No photo selected"}</small>
    </div>
  );
}

function BrandsAdmin({ brands, editing, setEditing, saveBrand, deleteBrand, canDelete }) {
  const brand = editing || emptyBrandItem;
  return (
    <>
      <div className="section-head"><h1>Add / Edit Brand</h1></div>
      <form key={editing?.id || "new-brand"} className="panel-form admin-form" onSubmit={(event) => { event.preventDefault(); saveBrand(event.currentTarget); }}>
        <AdminField label="Brand name" hint="Company ka naam likho, jaise ESSEL, FlowKem, Roff.">
          <input name="name" defaultValue={brand.name} placeholder="Brand name" required />
        </AdminField>
        <AdminField label="Warranty / short line" hint="Card par dikhne wali short line, jaise 10 years warranty.">
          <input name="warranty" defaultValue={brand.warranty} placeholder="Warranty line" />
        </AdminField>
        <AdminField label="Brand description" hint="Brand ke products ya distributor/dealer info ka chhota description.">
          <textarea name="description" defaultValue={brand.description} placeholder="Brand description" />
        </AdminField>
        <div className="two-col">
          <AdminField label="Sort order" hint="Chhota number pehle dikhega.">
            <input name="position" type="number" defaultValue={brand.position} placeholder="Sort order" />
          </AdminField>
          <AdminField label="Existing logo URL" hint="Agar logo pehle se uploaded hai to URL yahan paste karo.">
            <input name="logo_url" defaultValue={brand.logo_url} placeholder="Existing logo URL" />
          </AdminField>
        </div>
        <AdminField label="Upload logo photo" hint="Phone camera/gallery se brand logo upload karo.">
          <PhotoUpload name="logo_file" />
        </AdminField>
        <button className="primary">{editing ? "Update Brand" : "Save Brand"}</button>
      </form>
      <div className="table-list">
        {brands.map((item) => (
          <article className="admin-row" key={item.id}>
            <img src={imageUrl(item.logo_url)} alt={item.name} />
            <div><b>{item.name}</b><small>{item.warranty || item.description}</small></div>
            <span>Order {item.position || 0}</span>
            <button onClick={() => setEditing(item)}>Edit</button>
            {canDelete && <button className="danger" onClick={() => deleteBrand(item.id)}>Delete</button>}
          </article>
        ))}
      </div>
    </>
  );
}

function ProductsAdmin({ products, brands, editing, setEditing, saveProduct, deleteProduct, canDelete }) {
  const product = editing || emptyProduct;
  return (
    <>
      <div className="section-head"><h1>Add / Edit Product</h1></div>
      <form key={editing?.id || "new-product"} className="panel-form admin-form" onSubmit={(event) => { event.preventDefault(); saveProduct(event.currentTarget); }}>
        <AdminField label="Product name" hint="Product ka naam likho, jaise FlowKem PTMT Tap ya ESSEL Basin Mixer.">
          <input name="name" defaultValue={product.name} placeholder="Product name" required />
        </AdminField>
        <AdminField label="Brand name" hint="Brand select/type karo, jaise ESSEL, FlowKem, Supreme.">
          <input name="brand" list="brand-options" defaultValue={product.brand} placeholder="Brand" />
        </AdminField>
        <datalist id="brand-options">
          {brands.map((item) => <option key={item.id || item.name} value={item.name} />)}
        </datalist>
        <AdminField label="Category" hint="Product kis category me dikhna chahiye.">
          <select name="category" defaultValue={product.category}>
            {defaultCategories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </AdminField>
        <div className="two-col">
          <AdminField label="Selling price (SP)" hint="Customer ko dikhne wala final selling price.">
            <input name="price" type="number" min="0" step="0.01" defaultValue={product.price} placeholder="Selling Price (SP)" required />
          </AdminField>
          <AdminField label="MRP" hint="Printed MRP, jisse cut price aur discount dikhega.">
            <input name="mrp" type="number" min="0" step="0.01" defaultValue={product.mrp} placeholder="MRP" required />
          </AdminField>
        </div>
        <div className="two-col">
          <AdminField label="Stock quantity" hint="Customer isse zyada quantity add/order nahi kar payega.">
            <input name="stock" type="number" min="0" defaultValue={product.stock} placeholder="Stock" />
          </AdminField>
          <AdminField label="Warranty" hint="Warranty line, jaise 10 years warranty ya brand warranty.">
            <input name="warranty" defaultValue={product.warranty} placeholder="Warranty" />
          </AdminField>
        </div>
        <AdminField label="Description" hint="Product details, use, size, material ya important notes likho.">
          <textarea name="description" defaultValue={product.description} placeholder="Description" />
        </AdminField>
        <AdminField label="Existing main image URL" hint="Agar photo pehle se uploaded hai to main image URL yahan paste karo.">
          <input name="image_url" defaultValue={product.image_url} placeholder="Existing image URL" />
        </AdminField>
        <AdminField label="Extra image URLs" hint="Har line me ek extra product photo URL daalo.">
          <textarea name="image_urls" defaultValue={(product.image_urls || []).join("\n")} placeholder="Extra image URLs, one per line" />
        </AdminField>
        <AdminField label="Upload main photo" hint="Phone camera/gallery se main product photo upload karo.">
          <PhotoUpload name="image_file" />
        </AdminField>
        <AdminField label="Upload extra photos" hint="Multiple product photos select karke gallery me add karo.">
          <PhotoUpload name="image_files" multiple />
        </AdminField>
        <label className="check-row"><input name="featured" type="checkbox" defaultChecked={product.featured} /> Featured product</label>
        <button className="primary">{editing ? "Update Product" : "Save Product"}</button>
      </form>
      <div className="table-list">
        {products.map((item) => (
          <article className="admin-row" key={item.id}>
            <img src={imageUrl(item.image_url)} alt={item.name} />
            <div><b>{item.name}</b><small>{item.category} / {item.brand}</small></div>
            <span>{item.price ? `${formatRupees(item.price)} SP / Stock ${item.stock}` : `Quote / Stock ${item.stock}`}</span>
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
        <AdminField label="Photo title" hint="Gallery me dikhne wala title, jaise Showroom Front ya Tiles Display.">
          <input name="title" defaultValue={item.title} placeholder="Photo title" required />
        </AdminField>
        <AdminField label="Caption" hint="Photo ke bare me chhota description.">
          <textarea name="caption" defaultValue={item.caption} placeholder="Caption" />
        </AdminField>
        <div className="two-col">
          <AdminField label="Sort order" hint="Chhota number pehle dikhega.">
            <input name="position" type="number" defaultValue={item.position} placeholder="Sort order" />
          </AdminField>
          <AdminField label="Existing image URL" hint="Agar photo pehle se uploaded hai to URL yahan paste karo.">
            <input name="image_url" defaultValue={item.image_url} placeholder="Existing image URL" />
          </AdminField>
        </div>
        <AdminField label="Upload gallery photo" hint="Phone camera/gallery se showroom photo upload karo.">
          <PhotoUpload name="image_file" />
        </AdminField>
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
        <AdminField label="Certificate title" hint="Title likho, jaise ESSEL Authorized Dealership.">
          <input name="title" defaultValue={item.title} placeholder="Certificate title" required />
        </AdminField>
        <AdminField label="Brand / company name" hint="Company ka naam, jaise ESSEL, Roff, Birla Pivot.">
          <input name="brand" defaultValue={item.brand} placeholder="Brand / company name" />
        </AdminField>
        <AdminField label="Caption" hint="Certificate ya board ke bare me chhota note.">
          <textarea name="caption" defaultValue={item.caption} placeholder="Caption" />
        </AdminField>
        <div className="two-col">
          <AdminField label="Sort order" hint="Chhota number pehle dikhega.">
            <input name="position" type="number" defaultValue={item.position} placeholder="Sort order" />
          </AdminField>
          <AdminField label="Existing image URL" hint="Agar certificate photo pehle se uploaded hai to URL yahan paste karo.">
            <input name="image_url" defaultValue={item.image_url} placeholder="Existing image URL" />
          </AdminField>
        </div>
        <AdminField label="Upload certificate photo" hint="Phone camera/gallery se certificate ya board photo upload karo.">
          <PhotoUpload name="image_file" />
        </AdminField>
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
            <span className={`status-badge ${statusClass(order.status)}`}>{order.status}</span>
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
        <AdminField label="User name" hint="Staff/admin ka naam likho.">
          <input name="name" placeholder="Name" required />
        </AdminField>
        <AdminField label="Phone number" hint="Sirf 10 digit mobile number. Isi se login hoga.">
          <PhoneInput placeholder="Phone" required />
        </AdminField>
        <AdminField label="Password" hint="Is user ke login ke liye password.">
          <PasswordInput placeholder="Password" autoComplete="new-password" required />
        </AdminField>
        <AdminField label="Access role" hint="Staff limited access, admin zyada access.">
          <select name="role">
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </AdminField>
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

function MobileInstallPrompt({ onClose }) {
  const openAppUrl = getNativeOpenUrl();

  return (
    <div className="mobile-install-prompt" role="region" aria-label="Open S.K. Enterprises Android app">
      <img src="/assets/sk-logo.png" alt="" aria-hidden="true" />
      <div className="install-copy">
        <b>S.K. Enterprises</b>
        <span>Android App</span>
      </div>
      <a className="install-button" href={openAppUrl}>
        Open App
      </a>
      <button className="install-close" type="button" onClick={onClose} aria-label="Close install option">
        x
      </button>
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
          <p>Prayagraj's trusted hardware and sanitary store. Authorized dealers of ESSEL, Birla Pivot, Roff, Supreme. FlowKem distributor.</p>
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

function shouldShowMobileInstallPrompt() {
  const params = new URLSearchParams(window.location.search);
  const isNativeApp = params.get("native_app") === "1" || navigator.userAgent.includes("SKEnterprisesApp");
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isMobileSize = window.matchMedia("(max-width: 820px)").matches;
  const dismissed = sessionStorage.getItem("sk_install_prompt_closed") === "1";
  return isAndroid && isMobileSize && !isNativeApp && !isStandalone && !dismissed;
}

function getNativeOpenUrl() {
  const fallbackUrl = `${window.location.origin}${nativeApkUrl}`;
  return `intent://open#Intent;scheme=skenterprises;package=${androidPackageName};S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};end`;
}

export default App;
