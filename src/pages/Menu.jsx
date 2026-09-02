import { useEffect, useRef, useState } from "react";

import { getProducts } from "../api/productsApi";
import EmptyState from "../components/common/EmptyState";
import ErrorAlert from "../components/common/ErrorAlert";
import ProductImage from "../components/common/ProductImage";
import Spinner from "../components/common/Spinner";
import { useCart } from "../context/CartContext";
import { parsePrice } from "../config/constants";

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
  const [products, setProducts] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [addedId, setAddedId] = useState(null);
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

        <div className="text-center mb-5">
          <span className="section-title">OUR MENU</span>
          <h2 className="display-5 fw-bold mt-2">
            Popular Dishes
          </h2>
        </div>

        {error && <ErrorAlert error={error} onRetry={fetchProducts} />}

        {fetching ? (
          <Spinner />
        ) : availableProducts.length === 0 ? (
          !error && (
            <EmptyState message="No dishes available right now. Please check back soon!" />
          )
        ) : (
          <div className="row">

            {availableProducts.map((product) => {
              const cartQty = getCartQty(product.id);
              const justAdded = addedId === product.id;
              const inCart = cartQty > 0;

              return (
                <div className="col-lg-4 col-md-6 mb-4" key={product.id}>

                  <div className={`card menu-card border-0 shadow${justAdded ? " menu-card-added" : ""}`}>

                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      className="card-img-top"
                    />

                    <div className="card-body">

                      <div className="d-flex justify-content-between align-items-center gap-2">

                        <h5>{product.name}</h5>

                        <span className="price">
                          ₹{parsePrice(product.price)}
                        </span>

                      </div>

                      <p className="text-muted mt-3">
                        {product.description}
                      </p>

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

        <section id="menu"></section>
      </div>
      </section>
      </div>


  );
}

export default Menu;
