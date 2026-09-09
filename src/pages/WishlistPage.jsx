import { Link } from "react-router-dom";

import EmptyState from "../components/common/EmptyState";
import ProductImage from "../components/common/ProductImage";
import StarRating from "../components/common/StarRating";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { parsePrice } from "../config/constants";
import { FaTrash } from "react-icons/fa";

function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="mt-5 pt-3">
        <section className="menu-section py-5" style={{ minHeight: "60vh" }}>
          <div className="container text-center">
            <EmptyState
              title="Your Wishlist is Empty"
              subtitle="Tap the heart on any dish to save it here."
              message=""
            />
            <Link to="/menu" className="btn btn-warning rounded-pill px-5 mt-3">
              Browse Menu
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mt-5 pt-3">
      <section className="menu-section py-5" style={{ minHeight: "60vh" }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-title">SAVED DISHES</span>
            <h2 className="display-5 fw-bold mt-2">My Wishlist</h2>
          </div>

          <div className="row">
            {items.map((item) => (
              <div className="col-12 col-md-6 col-lg-4 mb-4" key={item.id}>
                <div className="card menu-card border-0 shadow">
                  <div className="menu-card-img-wrap">
                    <Link to={`/product/${item.id}`}>
                      <ProductImage
                        src={item.image}
                        alt={item.name}
                        className="card-img-top"
                      />
                    </Link>
                    <button
                      type="button"
                      className="wishlist-btn active"
                      aria-label="Remove from wishlist"
                      onClick={() => removeItem(item.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center gap-2">
                      <Link to={`/product/${item.id}`} className="text-decoration-none text-dark">
                        <h5>{item.name}</h5>
                      </Link>
                      <span className="price">₹{parsePrice(item.price)}</span>
                    </div>

                    <StarRating rating={item.rating} size={15} />

                    <p className="text-muted mt-2">{item.description}</p>

                    <button
                      type="button"
                      className="btn btn-warning rounded-pill px-4 add-to-cart-btn"
                      onClick={() => addItem(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default WishlistPage;