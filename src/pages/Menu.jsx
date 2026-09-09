import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { getProducts } from "../api/productsApi";
import EmptyState from "../components/common/EmptyState";
import ErrorAlert from "../components/common/ErrorAlert";
import ProductImage from "../components/common/ProductImage";
import Spinner from "../components/common/Spinner";
import StarRating from "../components/common/StarRating";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { parsePrice } from "../config/constants";
import { FaHeart, FaRegHeart, FaSearch } from "react-icons/fa";

const PAGE_SIZE = 6;

function flyToCart(sourceEl) {
  const cart = document.querySelector(".cart-btn");

  if (!cart || !sourceEl) return;

  const source = sourceEl.getBoundingClientRect();
  const target = cart.getBoundingClientRect();

  const dot = document.createElement("span");
  dot.className = "cart-fly-dot";
  dot.textContent = "🛒";
  document.body.appendChild(dot);

  const startX = source.left + source.width / 2 - 14;
  const startY = source.top + source.height / 2 - 14;
  const endX = target.left + target.width / 2 - 14;
  const endY = target.top + target.height / 2 - 14;

  dot.style.left = `${startX}px`;
  dot.style.top = `${startY}px`;

  const animation = dot.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 1 },
      {
        transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0.25)`,
        opacity: 0.5,
      },
    ],
    { duration: 700, easing: "cubic-bezier(0.2, 0.7, 0.4, 1)" }
  );

  animation.onfinish = () => dot.remove();
}

function Menu() {
  const { addItem, items } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [addedId, setAddedId] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const timerRef = useRef(null);

  const fetchProducts = async () => {
    try {
      setFetching(true);
      setError(null);

      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("GET Products Error:", err);
      setError(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const availableProducts = products.filter(
    (product) => product.status === "Available"
  );

  const categories = useMemo(() => {
    const unique = new Set(
      availableProducts
        .map((p) => p.category)
        .filter((c) => c && String(c).trim() !== "")
    );
    return ["All", ...unique];
  }, [availableProducts]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = availableProducts;

    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }

    if (query) {
      result = result.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(query) ||
          (p.description || "").toLowerCase().includes(query)
      );
    }

    return result;
  }, [availableProducts, category, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pageItems = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage]
  );

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  const getCartQty = (productId) =>
    items.find((item) => item.key === productId)?.qty ?? 0;

  const handleAdd = (product, event) => {
    if (getCartQty(product.id) > 0 || addedId === product.id) return;

    addItem(product);
    flyToCart(event.currentTarget);
    setAddedId(product.id);

    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <div className="mt-5">
      <section className="menu-section py-5" id="menu">
        <div className="container">
          <div className="text-center mb-4">
            <span className="section-title">OUR MENU</span>
            <h2 className="display-5 fw-bold mt-2">Popular Dishes</h2>
          </div>

          <div className="row justify-content-center mb-4">
            <div className="col-12 col-md-6 col-lg-5">
              <div className="menu-search-box">
                <FaSearch className="menu-search-icon" />
                <input
                  type="search"
                  className="form-control menu-search-input"
                  placeholder="Search dishes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="menu-category-slider mb-5">
            <div className="menu-category-track">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-chip${category === cat ? " active" : ""}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {error && <ErrorAlert error={error} onRetry={fetchProducts} />}

          {fetching ? (
            <Spinner />
          ) : pageItems.length === 0 ? (
            !error && (
              <EmptyState message="No dishes match your search. Try a different keyword!" />
            )
          ) : (
            <div className="row">
              {pageItems.map((product) => {
                const cartQty = getCartQty(product.id);
                const justAdded = addedId === product.id;
                const inCart = cartQty > 0;
                const wishlisted = isWishlisted(product.id);

                return (
                  <div className="col-lg-4 col-md-6 mb-4" key={product.id}>
                    <div
                      className={`card menu-card border-0 shadow${justAdded ? " menu-card-added" : ""}`}
                    >
                      <div className="menu-card-img-wrap">
                        <Link to={`/product/${product.id}`}>
                          <ProductImage
                            src={product.image}
                            alt={product.name}
                            className="card-img-top"
                          />
                        </Link>
                        <button
                          type="button"
                          className={`wishlist-btn${wishlisted ? " active" : ""}`}
                          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                          onClick={() => toggleWishlist(product)}
                        >
                          {wishlisted ? <FaHeart /> : <FaRegHeart />}
                        </button>
                        <span className="category-badge">{product.category}</span>
                      </div>

                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center gap-2">
                          <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                            <h5>{product.name}</h5>
                          </Link>
                          <span className="price">₹{parsePrice(product.price)}</span>
                        </div>

                        <StarRating rating={product.rating} size={15} />

                        <p className="text-muted mt-2">{product.description}</p>

                        <button
                          type="button"
                          onClick={(event) => handleAdd(product, event)}
                          disabled={inCart && !justAdded}
                          className={`btn rounded-pill px-4 add-to-cart-btn ${
                            justAdded
                              ? "added"
                              : inCart
                                ? "in-cart"
                                : "btn-warning"
                          }`}
                        >
                          {justAdded
                            ? "✓ Added!"
                            : inCart
                              ? `✓ In Cart${cartQty > 1 ? ` (${cartQty})` : ""}`
                              : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!fetching && !error && filtered.length > 0 && (
            <nav className="d-flex justify-content-center mt-2" aria-label="Menu pagination">
              <ul className="pagination pagination-lg">
                <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    ‹
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <li key={num} className={`page-item${num === currentPage ? " active" : ""}`}>
                    <button type="button" className="page-link" onClick={() => setPage(num)}>
                      {num}
                    </button>
                  </li>
                ))}
                <li className={`page-item${currentPage === totalPages ? " disabled" : ""}`}>
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    ›
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </section>
    </div>
  );
}

export default Menu;