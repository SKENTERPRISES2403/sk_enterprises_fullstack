import React, { useEffect, useMemo, useState } from "react";
import "./styles.css";
import {
  api,
  imageUrl,
  demoProducts,
  orderStatuses,
  leadStatuses,
  categories as defaultCategories,
  whatsappNumber,
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

function App() {
  const [page, setPage] = useHashPage();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useLocalStorage("sk_fullstack_cart", []);
  const [auth, setAuth] = useLocalStorage("sk_fullstack_auth", null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    loadCatalog();
  }, []);

  async function loadCatalog() {
    try {
      const [productRows, categoryRows] = await Promise.all([api.getProducts(), api.getCategories()]);
      setProducts(productRows.length ? productRows : demoProducts);
      setCategories(categoryRows.length ? categoryRows.map((item) => item.name) : defaultCategories);
    } catch {
      setProducts(demoProducts);
      setCategories(defaultCategories);
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
      <Header auth={auth} cartQty={cartQty} setPage={setPage} logout={logout} />
      {notice && <div className="notice" onClick={() => setNotice("")}>{notice}</div>}

      {page === "store" && (
        <StorePage
          featured={featured}
          products={visibleProducts}
          categories={categories}
          query={query}
          setQuery={setQuery}
          category={category}
          setCategory={setCategory}
          addToCart={addToCart}
          openDetail={(product) => {
            setSelected(product);
            setPage("detail");
          }}
        />
      )}

      {page === "detail" && selected && (
        <ProductDetail product={selected} addToCart={addToCart} back={() => setPage("store")} />
      )}

      {page === "cart" && (
        <CartPage cart={cart} updateQty={updateQty} setPage={setPage} />
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
        <AdminPanel auth={auth} setAuth={setAuth} setPage={setPage} reloadCatalog={loadCatalog} />
      )}

      <Footer />
    </>
  );
}

function Header({ auth, cartQty, setPage, logout }) {
  const adminRole = ["owner", "admin", "staff"].includes(auth?.user?.role);
  return (
    <header className="site-header">
      <button className="brand-button" onClick={() => setPage("store")}>
        <span className="brand-mark">SK</span>
        <span>S.K. <strong>Enterprises</strong></span>
      </button>
      <nav>
        <button onClick={() => setPage("store")}>Shop</button>
        <button onClick={() => setPage("orders")}>Orders</button>
        {adminRole && <button onClick={() => setPage("admin")}>Admin</button>}
      </nav>
      <div className="header-actions">
        {auth ? (
          <button className="soft-button" onClick={logout}>{auth.user.name}</button>
        ) : (
          <button className="soft-button" onClick={() => setPage("login")}>Login</button>
        )}
        <button className="cart-button" onClick={() => setPage("cart")}>Cart <b>{cartQty}</b></button>
      </div>
    </header>
  );
}

export function StorePage({ featured, products, categories, query, setQuery, category, setCategory, addToCart, openDetail }) {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="pill">Prayagraj hardware and sanitary store</span>
          <h1>S.K. Enterprises</h1>
          <p>Product catalog, quote cart, offline payment and admin-managed stock for CP fittings, sanitaryware, tiles, tanks, pipes, sinks and Roff chemicals.</p>
          <div className="hero-actions">
            <a className="primary" href="#products">Shop products</a>
            <a className="whatsapp" href={`https://wa.me/${whatsappNumber}?text=Hello%20S.K.%20Enterprises,%20I%20need%20a%20quote`} target="_blank" rel="noreferrer">WhatsApp quote</a>
          </div>
        </div>
      </section>

      <section className="stats-row">
        <div><b>5+</b><span>Years</span></div>
        <div><b>1000+</b><span>Customers</span></div>
        <div><b>100+</b><span>Contractors</span></div>
        <div><b>Offline</b><span>Cash / UPI / WhatsApp</span></div>
      </section>

      <section className="section">
        <div className="section-head">
          <span className="pill">Featured</span>
          <h2>Featured Products</h2>
        </div>
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} openDetail={openDetail} />
          ))}
        </div>
      </section>

      <section className="section" id="products">
        <div className="section-head">
          <span className="pill">Catalog</span>
          <h2>Products</h2>
        </div>
        <div className="toolbar">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, brand, category..." />
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option>All</option>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="category-tabs">
          {["All", ...categories].map((item) => (
            <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>
          ))}
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} openDetail={openDetail} />
          ))}
        </div>
      </section>
    </main>
  );
}

function ProductCard({ product, addToCart, openDetail }) {
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
        <b>{product.price ? `Rs ${product.price}` : "Ask for quote"}</b>
      </div>
      <div className="card-actions">
        <button onClick={() => openDetail(product)}>Details</button>
        <button className="primary" onClick={() => addToCart(product)}>Add</button>
      </div>
    </article>
  );
}

export function ProductDetail({ product, addToCart, back }) {
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
          <div><dt>Price</dt><dd>{product.price ? `Rs ${product.price}` : "Final rate on WhatsApp / store"}</dd></div>
          <div><dt>MRP</dt><dd>{product.mrp ? `Rs ${product.mrp}` : "-"}</dd></div>
          <div><dt>Stock</dt><dd>{product.stock}</dd></div>
          <div><dt>Warranty</dt><dd>{product.warranty || "-"}</dd></div>
        </dl>
        <div className="qty-box">
          <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
          <b>{qty}</b>
          <button onClick={() => setQty(qty + 1)}>+</button>
          <button className="primary" onClick={() => addToCart(product, qty)}>Add to Cart</button>
        </div>
      </div>
    </main>
  );
}

export function CartPage({ cart, updateQty, setPage }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <main className="section narrow">
      <div className="section-head">
        <span className="pill">Cart</span>
        <h1>Your Cart</h1>
      </div>
      {!cart.length && <Empty message="Cart is empty. Add products first." />}
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
        <button className="primary" disabled={!cart.length} onClick={() => setPage("checkout")}>Checkout</button>
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
        Owner seed login: phone 7007062590, password Owner@12345. Change this after setup.
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
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");

  const canDelete = ["owner", "admin"].includes(auth?.user?.role);
  const canCreateStaff = ["owner", "admin"].includes(auth?.user?.role);

  useEffect(() => {
    if (!auth?.token || auth.user.role === "customer") return;
    refreshAdmin();
  }, [auth]);

  async function refreshAdmin() {
    const [stats, productRows, orderRows, leadRows] = await Promise.all([
      api.dashboard(auth.token),
      api.getProducts(),
      api.adminOrders(auth.token),
      api.adminLeads(auth.token),
    ]);
    setDashboard(stats);
    setProducts(productRows);
    setOrders(orderRows);
    setLeads(leadRows);
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

  async function deleteProduct(id) {
    await api.deleteProduct(id, auth.token);
    setMessage("Product deleted");
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

  return (
    <main className="admin-shell">
      <aside className="admin-menu">
        <b>Admin Panel</b>
        <small>{auth.user.role} access</small>
        {["dashboard", "products", "orders", "leads", "staff"].map((item) => (
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
  const items = stats || { products: 0, orders: 0, new_orders: 0, leads: 0, customers: 0 };
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

function Footer() {
  return (
    <footer>
      <div>
        <b>S.K. Enterprises</b>
        <span>Kanihar Road, Saray Taki, Prayagraj</span>
      </div>
      <div>
        <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">WhatsApp 94152 16320</a>
        <a href="tel:+917007062590">Call 70070 62590</a>
      </div>
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
