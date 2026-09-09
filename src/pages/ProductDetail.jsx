import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getProduct } from "../api/productsApi";
import EmptyState from "../components/common/EmptyState";
import ErrorAlert from "../components/common/ErrorAlert";
import ProductImage from "../components/common/ProductImage";
import Spinner from "../components/common/Spinner";
import StarRating from "../components/common/StarRating";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { IMAGE_PLACEHOLDER, parsePrice } from "../config/constants";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  const fetchProduct = async () => {
    try {
      setFetching(true);
      setError(null);

      const data = await getProduct(id);
      setProduct(data);
    } catch (err) {
      console.error("GET Product Error:", err);
      setError(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    setActiveImage(0);
    setAdded(false);
  }, [id]);

  const gallery = useMemo(() => {
    if (!product) return [];

    const images = [];

    if (product.image && /^https?:\/\//i.test(product.image)) {
      images.push(product.image);
    }

    if (Array.isArray(product.images)) {
      product.images
        .filter((url) => url && /^https?:\/\//i.test(url))
        .forEach((url) => {
          if (!images.includes(url)) images.push(url);
        });
    }

    return images.length > 0 ? images : [IMAGE_PLACEHOLDER];
  }, [product]);

  if (fetching) return <Spinner label="Loading product..." />;
  if (error) return <ErrorAlert error={error} onRetry={fetchProduct} />;
  if (!product) return <EmptyState message="Product not found." />;

  const wishlisted = isWishlisted(product.id);
  const price = parsePrice(product.price);
  const currentImage = gallery[activeImage] ?? gallery[0];

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="mt-5 pt-2">
      <section className="menu-section py-5" style={{ minHeight: "70vh" }}>
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/menu" className="text-decoration-none">Menu</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>

          <div className="row g-4">
            <div className="col-12 col-lg-6">
              <div className="product-detail-gallery">
                <div className="product-detail-main-img">
                  <ProductImage
                    src={currentImage}
                    alt={product.name}
                    style={{ width: "100%", height: 460, objectFit: "cover", borderRadius: 20 }}
                  />
                  <button
                    type="button"
                    className={`wishlist-btn large${wishlisted ? " active" : ""}`}
                    aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    onClick={() => toggleWishlist(product)}
                  >
                    {wishlisted ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>

                {gallery.length > 1 && (
                  <div className="product-detail-thumbs mt-3">
                    {gallery.map((url, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`thumb-btn${index === activeImage ? " active" : ""}`}
                        onClick={() => setActiveImage(index)}
                        aria-label={`View image ${index + 1}`}
                      >
                        <ProductImage src={url} alt={`${product.name} ${index + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="product-detail-info">
                {product.category && <span className="category-badge">{product.category}</span>}

                <h1 className="fw-bold display-6 mt-3">{product.name}</h1>

                <StarRating rating={product.rating} size={20} />

                <div className="price mt-3 mb-2">₹{price.toLocaleString()}</div>

                <p className="text-muted mt-3" style={{ fontSize: 16, lineHeight: 1.8 }}>
                  {product.description}
                </p>

                <div className="d-flex align-items-center gap-3 mt-4">
                  <span
                    className={`badge rounded-pill px-3 py-2 ${
                      product.status === "Available"
                        ? "text-bg-success"
                        : product.status === "Low Stock"
                          ? "text-bg-danger"
                          : "text-bg-secondary"
                    }`}
                  >
                    {product.status}
                  </span>
                  {Number(product.stock) > 0 && (
                    <span className="text-muted small">Stock: {product.stock}</span>
                  )}
                </div>

                <div className="d-flex flex-wrap gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-warning rounded-pill px-5 py-3 fw-bold"
                    onClick={handleAdd}
                    disabled={product.status === "Unavailable"}
                  >
                    {added ? "✓ Added to Cart" : "Add to Cart"}
                  </button>

                  <button
                    type="button"
                    className={`btn rounded-pill px-4 py-3 fw-bold ${
                      wishlisted ? "btn-danger text-white" : "btn-outline-danger"
                    }`}
                    onClick={() => toggleWishlist(product)}
                  >
                    {wishlisted ? "♥ In Wishlist" : "Add to Wishlist"}
                  </button>
                </div>

                <Link to="/cart" className="btn btn-outline-dark rounded-pill px-4 mt-2">
                  Go to Cart →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductDetail;