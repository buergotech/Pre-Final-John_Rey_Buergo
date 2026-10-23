
import { useMemo, useState, type FormEvent } from "react";
import "./App.css";

type Category = "Car Parts" | "Car Accessories" | "Driver Gear";

type Product = {
  id: number;
  name: string;
  category: Category;
  description: string;
  specifications: string;
  image: string;
  rating: number;
  price: number;
  quantity: number;
  stock: number;
};

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Brake Disc (Front)",
    category: "Car Parts",
    description: "Durable front brake disc for reliable braking performance.",
    specifications: "Vented steel disc, front axle",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzdbM4F-3KE8ymVZpAjKifZMk-jwNIG_IbWyVYV_lcIQ&s=10",
    rating: 4.8,
    price: 2800,
    quantity: 1,
    stock: 12,
  },
  {
    id: 2,
    name: "LED Headlight Bulb (H4)",
    category: "Car Accessories",
    description: "Bright LED lighting for better road visibility.",
    specifications: "H4 LED, white light",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-qy-I6ZTrS8U5I7YDAeumNUJCuREtiLkzsIJhfiEOmQ&s=10",
    rating: 4.7,
    price: 1250,
    quantity: 1,
    stock: 15,
  },
  {
    id: 3,
    name: "Full Face Helmet",
    category: "Driver Gear",
    description: "Protective full-face helmet for everyday riders.",
    specifications: "Full-face shell, clear visor",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfladRqu40bNUiZ5PCePWTR24ZG6nrFyNMw8QOf7vqtQ&s=10",
    rating: 4.9,
    price: 3500,
    quantity: 1,
    stock: 8,
  },
  {
    id: 4,
    name: "Riding Gloves",
    category: "Driver Gear",
    description: "Comfortable riding gloves with reinforced palms.",
    specifications: "Protective padding, adjustable wrist",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpljNXIvy6ICpg4TcMMELmqmUS5dp_Ws42SCs4jFHxmw&s=10",
    rating: 4.6,
    price: 850,
    quantity: 1,
    stock: 3,
  },
  {
    id: 5,
    name: "Air Filter",
    category: "Car Parts",
    description: "Replacement air filter to help maintain engine airflow.",
    specifications: "Washable performance filter",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLMsjaFk1FJeF7PxbPWyQ-ehS4LAKg_uUumbyExHbeRg&s=10",
    rating: 4.5,
    price: 650,
    quantity: 0,
    stock: 20,
  },
  {
    id: 6,
    name: "Floor Mats Set",
    category: "Car Accessories",
    description: "Easy-to-clean mats that help protect your car interior.",
    specifications: "Four-piece rubber mat set",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnF6ohq-JdXe32I8-xUUy0mi1BmlCwO3r1iHJWUOclLg&s=10",
    rating: 4.4,
    price: 1100,
    quantity: 0,
    stock: 10,
  },
  {
    id: 7,
    name: "Racing Jacket",
    category: "Driver Gear",
    description: "Protective riding jacket with a sporty design.",
    specifications: "Padded shoulders and elbows",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQORqG4To2dXnwOCraSS1TpPN9HA7ErJ-hX0JSai8hoOw&s=10",
    rating: 4.8,
    price: 2200,
    quantity: 0,
    stock: 2,
  },
  {
    id: 8,
    name: "Spark Plugs (Set)",
    category: "Car Parts",
    description: "Replacement spark plugs for consistent engine ignition.",
    specifications: "Four-piece replacement set",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZzgn-A12u7zDUgj3q8PkmbfzBo88wK6i4xRYWfYmSwA&s",
    rating: 4.6,
    price: 950,
    quantity: 0,
    stock: 18,
  },
];

const categories: Category[] = [
  "Car Parts",
  "Car Accessories",
  "Driver Gear",
];

const money = (amount: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);

const emptyForm = {
  name: "",
  category: "Car Parts" as Category,
  description: "",
  specifications: "",
  image: "",
  rating: "5",
  price: "",
  quantity: "1",
  stock: "10",
};

function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [notice, setNotice] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;

      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, search]);

  const cartProducts = products.filter((product) => product.quantity > 0);

  const totalItems = cartProducts.reduce(
    (sum, product) => sum + product.quantity,
    0
  );

  const grandTotal = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  function changeQuantity(id: number, amount: number) {
    setProducts((current) =>
      current.map((product) => {
        if (product.id !== id) return product;

        const nextQuantity = Math.max(
          0,
          Math.min(product.stock, product.quantity + amount)
        );

        return { ...product, quantity: nextQuantity };
      })
    );
  }

  function addProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const price = Number(form.price);
    const quantity = Number(form.quantity);
    const stock = Number(form.stock);
    const rating = Number(form.rating);

    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.specifications.trim() ||
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isInteger(quantity) ||
      quantity < 0 ||
      !Number.isInteger(stock) ||
      stock < 0 ||
      quantity > stock ||
      !Number.isFinite(rating) ||
      rating < 0 ||
      rating > 5
    ) {
      setNotice("Please enter valid product details and quantities.");
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      specifications: form.specifications.trim(),
      image:
        form.image.trim() ||
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600",
      rating,
      price,
      quantity,
      stock,
    };

    setProducts((current) => [newProduct, ...current]);
    setActiveCategory("All");
    setSearch("");
    setForm(emptyForm);
    setShowForm(false);
    setNotice("Product added successfully!");
  }

  function deleteProduct(id: number) {
    setProducts((current) => current.filter((product) => product.id !== id));
    setSelectedProduct(null);
    setNotice("Product removed.");
  }

  function clearCart() {
    setProducts((current) =>
      current.map((product) => ({ ...product, quantity: 0 }))
    );
    setNotice("Cart cleared. Product inventory remains unchanged.");
  }

  function openCategory(category: string) {
    setActiveCategory(category);
    setNotice("");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="brand"
          onClick={() => {
            openCategory("All");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="brand-icon">🚘</span>
          <span>
            <span className="brand-name">
              Buergo <span><span>Gear </span>Shop</span>
            </span>
            <span className="brand-caption">
              Car Parts · Accessories · Driver Gear
            </span>
          </span>
        </button>

        <div className="search-box">
          <span>⌕</span>
          <input
            aria-label="Search products"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} aria-label="Clear search">
              ×
            </button>
          )}
        </div>

        <button
          className="header-cart"
          onClick={() =>
            document.getElementById("cart")?.scrollIntoView({
              behavior: "smooth",
            })
          }
          aria-label="View cart"
        >
          🛒 <span className="cart-badge">{totalItems}</span>
        </button>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <nav className="side-nav">
            <button
              className={activeCategory === "All" ? "nav-link active" : "nav-link"}
              onClick={() => openCategory("All")}
            >
              <span>⌂</span> Home
            </button>
            <button
              className={activeCategory === "Car Parts" ? "nav-link active" : "nav-link"}
              onClick={() => openCategory("Car Parts")}
            >
              <span>⚙</span> Car Parts
            </button>
            <button
              className={activeCategory === "Car Accessories" ? "nav-link active" : "nav-link"}
              onClick={() => openCategory("Car Accessories")}
            >
              <span>🚗</span> Car Accessories
            </button>
            <button
              className={activeCategory === "Driver Gear" ? "nav-link active" : "nav-link"}
              onClick={() => openCategory("Driver Gear")}
            >
              <span>⛑</span> Driver Gear
            </button>
            <button
              className="nav-link"
              onClick={() =>
                document.getElementById("cart")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              <span>🛒</span> Cart
              <span className="nav-count">{totalItems}</span>
            </button>
          </nav>

          <div className="sidebar-promo">
            <span className="promo-icon">🚘</span>
            <h3>Drive Safe,</h3>
            <h3>Stay Equipped</h3>
            <p>Quality parts and gear for every journey.</p>
            <span className="promo-decoration">DRIVE • EXPLORE • REPEAT</span>
          </div>

          <div className="sidebar-note">
            <span className="status-dot" />
            Inventory Management
            <small>{products.length} products listed</small>
          </div>
        </aside>

        <main className="main-content">
          <section className="hero">
            <div className="hero-content">
              <span className="eyebrow">YOUR BUERGO'S AUTOMOTIVE SHOP</span>
              <h1>
                Upgrade Your Ride
                <br />
                <span>with the Right Parts</span>
              </h1>
              <p>
                Quality car parts, accessories, and driver gear — all in one
                place.
              </p>
              <button
                className="primary-button"
                onClick={() =>
                  document.getElementById("products")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
              >
                Shop Now <span>→</span>
              </button>
            </div>
            <div className="hero-car" aria-hidden="true">
              🏎️
            </div>
          </section>

          {notice && (
            <div className="notice" role="status">
              <span>{notice}</span>
              <button onClick={() => setNotice("")}>×</button>
            </div>
          )}

          <section className="featured-section">
            <div className="section-heading">
              <div>
                <h2>Featured Products</h2>
                <p>Find the right equipment for your next drive.</p>
              </div>
              <button className="text-button" onClick={() => openCategory("All")}>
                View All →
              </button>
            </div>

            <div className="featured-grid">
              {products.slice(0, 4).map((product) => (
                <button
                  className="featured-item"
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                >
                  <span className="featured-emoji">
                    {product.category === "Driver Gear"
                      ? "🪖"
                      : product.category === "Car Accessories"
                        ? "💡"
                        : "⚙️"}
                  </span>
                  <span className="featured-name">{product.name}</span>
                  <span className="featured-price">{money(product.price)}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="products-section" id="products">
            <div className="section-heading product-heading">
              <div>
                <h2>Product List</h2>
                <p>{filteredProducts.length} products found</p>
              </div>
              <button
                className="primary-button add-new-button"
                onClick={() => {
                  setForm(emptyForm);
                  setShowForm(true);
                }}
              >
                <span>＋</span> Add New Product
              </button>
            </div>

            <div className="category-bar">
              {["All", ...categories].map((category) => (
                <button
                  key={category}
                  className={
                    activeCategory === category
                      ? "category-chip selected"
                      : "category-chip"
                  }
                  onClick={() => openCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <button
                    className="product-image"
                    onClick={() => setSelectedProduct(product)}
                    aria-label={`View ${product.name} details`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                    <span className="image-fallback">
                      {product.category === "Driver Gear" ? "🪖" : "⚙️"}
                    </span>
                    {product.stock < 5 && product.stock > 0 && (
                      <span className="low-stock">Low Stock</span>
                    )}
                    {product.stock === 0 && (
                      <span className="out-stock">Out of Stock</span>
                    )}
                  </button>

                  <div className="product-info">
                    <span className="product-category">{product.category}</span>
                    <button
                      className="product-name"
                      onClick={() => setSelectedProduct(product)}
                    >
                      {product.name}
                    </button>
                    <div className="product-rating">
                      <span>★</span> {product.rating.toFixed(1)}
                      <span className="rating-count">· Stock: {product.stock}</span>
                    </div>
                    <div className="product-price">{money(product.price)}</div>

                    <div className="quantity-row">
                      <span>Quantity</span>
                      <div className="quantity-control">
                        <button
                          onClick={() => changeQuantity(product.id, -1)}
                          disabled={product.quantity === 0}
                          aria-label={`Decrease ${product.name} quantity`}
                        >
                          −
                        </button>
                        <span>{product.quantity}</span>
                        <button
                          onClick={() => changeQuantity(product.id, 1)}
                          disabled={product.quantity >= product.stock}
                          aria-label={`Increase ${product.name} quantity`}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="subtotal-row">
                      <span>Subtotal</span>
                      <strong>{money(product.price * product.quantity)}</strong>
                    </div>

                    <button
                      className="details-button"
                      onClick={() => setSelectedProduct(product)}
                    >
                      View Details
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="empty-state">
                <span>🔎</span>
                <h3>No products found</h3>
                <p>Try a different search or category.</p>
                <button
                  className="primary-button"
                  onClick={() => {
                    setSearch("");
                    openCategory("All");
                  }}
                >
                  Show All Products
                </button>
              </div>
            )}
          </section>

          <section className="inventory-summary">
            <div>
              <span className="summary-icon">📦</span>
              <div>
                <small>Total Products</small>
                <strong>{products.length}</strong>
              </div>
            </div>
            <div>
              <span className="summary-icon">🛒</span>
              <div>
                <small>Items Selected</small>
                <strong>{totalItems}</strong>
              </div>
            </div>
            <div>
              <span className="summary-icon">💰</span>
              <div>
                <small>Total Product Value</small>
                <strong>{money(grandTotal)}</strong>
              </div>
            </div>
          </section>
        </main>

        <aside className="cart-sidebar" id="cart">
          <section className="cart-panel">
            <div className="cart-heading">
              <div>
                <span className="cart-title-icon">🛒</span>
                <h2>Your Cart</h2>
                <span className="cart-item-count">({totalItems})</span>
              </div>
              <button className="text-button" onClick={clearCart}>
                Clear Cart
              </button>
            </div>

            {cartProducts.length === 0 ? (
              <div className="cart-empty">
                <span>🛒</span>
                <h3>Your cart is empty</h3>
                <p>Increase a product's quantity to add it here.</p>
              </div>
            ) : (
              <div className="cart-items">
                {cartProducts.map((product) => (
                  <div className="cart-item" key={product.id}>
                    <div className="cart-item-image">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="cart-item-details">
                      <strong>{product.name}</strong>
                      <span>{money(product.price)} each</span>
                      <div className="quantity-control cart-quantity">
                        <button onClick={() => changeQuantity(product.id, -1)}>
                          −
                        </button>
                        <span>{product.quantity}</span>
                        <button
                          onClick={() => changeQuantity(product.id, 1)}
                          disabled={product.quantity >= product.stock}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="cart-item-end">
                      <button
                        className="remove-item"
                        onClick={() => {
                          setProducts((current) =>
                            current.map((item) =>
                              item.id === product.id
                                ? { ...item, quantity: 0 }
                                : item
                            )
                          );
                        }}
                        aria-label={`Remove ${product.name} from cart`}
                      >
                        ×
                      </button>
                      <strong>{money(product.price * product.quantity)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="cart-totals">
              <div>
                <span>Subtotal</span>
                <strong>{money(grandTotal)}</strong>
              </div>
              <div>
                <span>Shipping</span>
                <strong>{money(totalItems > 0 ? 150 : 0)}</strong>
              </div>
              <div className="grand-total">
                <span>Total</span>
                <strong>{money(grandTotal + (totalItems > 0 ? 150 : 0))}</strong>
              </div>
            </div>

            <button
              className="checkout-button"
              disabled={totalItems === 0}
              onClick={() =>
                setNotice("Checkout demo: your cart total is " +
                  money(grandTotal + 150) + ".")
              }
            >
              🛒 Proceed to Checkout →
            </button>

            <p className="checkout-note">🔒 Secure checkout ·</p>
          </section>

          <section className="stock-panel">
            <span>🛡️</span>
            <div>
              <strong>Inventory Status</strong>
              <p>
                {products.filter((product) => product.stock < 5).length} products
                have low stock.
              </p>
            </div>
          </section>
        </aside>
      </div>

      {showForm && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowForm(false);
          }}
        >
          <section className="modal">
            <div className="modal-heading">
              <div>
                <span className="eyebrow">INVENTORY MANAGEMENT</span>
                <h2>Add New Product</h2>
                <p>Enter the details of your automotive product.</p>
              </div>
              <button
                className="modal-close"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={addProduct}>
              <div className="form-grid">
                <label>
                  Product Name *
                  <input
                    required
                    value={form.name}
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                    placeholder="e.g. Racing Helmet"
                  />
                </label>

                <label>
                  Category *
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        category: event.target.value as Category,
                      })
                    }
                  >
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>

                <label className="full-field">
                  Description *
                  <textarea
                    required
                    value={form.description}
                    onChange={(event) =>
                      setForm({ ...form, description: event.target.value })
                    }
                    placeholder="Describe the product..."
                  />
                </label>

                <label className="full-field">
                  Product Specifications *
                  <input
                    required
                    value={form.specifications}
                    onChange={(event) =>
                      setForm({ ...form, specifications: event.target.value })
                    }
                    placeholder="e.g. Size, material, compatibility"
                  />
                </label>

                <label className="full-field">
                  Image URL
                  <input
                    type="url"
                    value={form.image}
                    onChange={(event) =>
                      setForm({ ...form, image: event.target.value })
                    }
                    placeholder="https://example.com/product.jpg"
                  />
                </label>

                <label>
                  Price (₱) *
                  <input
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.price}
                    onChange={(event) =>
                      setForm({ ...form, price: event.target.value })
                    }
                    placeholder="1500"
                  />
                </label>

                <label>
                  Rating (0–5) *
                  <input
                    required
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.rating}
                    onChange={(event) =>
                      setForm({ ...form, rating: event.target.value })
                    }
                  />
                </label>

                <label>
                  Quantity to Select *
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={form.quantity}
                    onChange={(event) =>
                      setForm({ ...form, quantity: event.target.value })
                    }
                  />
                </label>

                <label>
                  Available Stock *
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(event) =>
                      setForm({ ...form, stock: event.target.value })
                    }
                  />
                </label>
              </div>

              <div className="form-preview-total">
                <span>Initial Subtotal</span>
                <strong>
                  {money(
                    (Number(form.price) || 0) *
                      (Number(form.quantity) || 0)
                  )}
                </strong>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  ＋ Save Product
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {selectedProduct && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedProduct(null);
          }}
        >
          <section className="modal detail-modal">
            <button
              className="modal-close detail-close"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close details"
            >
              ×
            </button>
            <div className="detail-layout">
              <div className="detail-image">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                />
              </div>
              <div className="detail-info">
                <span className="product-category">
                  {selectedProduct.category}
                </span>
                <h2>{selectedProduct.name}</h2>
                <div className="product-rating">
                  <span>★</span> {selectedProduct.rating.toFixed(1)} / 5
                </div>
                <h3>{money(selectedProduct.price)}</h3>
                <p>{selectedProduct.description}</p>
                <div className="specification-box">
                  <strong>Specifications</strong>
                  <p>{selectedProduct.specifications}</p>
                  <strong>Available stock</strong>
                  <p>{selectedProduct.stock} units</p>
                </div>
                <div className="quantity-row">
                  <span>Quantity</span>
                  <div className="quantity-control">
                    <button
                      onClick={() => changeQuantity(selectedProduct.id, -1)}
                      disabled={selectedProduct.quantity === 0}
                    >
                      −
                    </button>
                    <span>{selectedProduct.quantity}</span>
                    <button
                      onClick={() => changeQuantity(selectedProduct.id, 1)}
                      disabled={selectedProduct.quantity >= selectedProduct.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="subtotal-row">
                  <span>Subtotal</span>
                  <strong>
                    {money(selectedProduct.price * selectedProduct.quantity)}
                  </strong>
                </div>
                <button
                  className="primary-button detail-done"
                  onClick={() => setSelectedProduct(null)}
                >
                  Done
                </button>
                <button
                  className="delete-product-button"
                  onClick={() => deleteProduct(selectedProduct.id)}
                >
                  Remove Product from Inventory
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      <footer className="footer">
        <span>🚘 BUERGOSHOP</span>
        <span>Pre-Final Exam Project · Product Management App</span>
      </footer>
    </div>

    
  );
}

export default App;
