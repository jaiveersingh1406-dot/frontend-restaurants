import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createProduct,
  deleteProduct,
  getProducts,
} from "../api/productsApi";
import { uploadImage } from "../api/uploadApi";
import ErrorAlert from "../components/common/ErrorAlert";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";
import PageHeader from "../components/common/PageHeader";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_FORM_TEMPLATE,
  PRODUCT_STATUSES,
} from "../config/constants";
import { resolveProductImage } from "../config/constants";
import ProductImage from "../components/common/ProductImage";

const emptyForm = PRODUCT_FORM_TEMPLATE;

function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetchingProducts, setFetchingProducts] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);


  const fetchProducts = async () => {
    try {
      setFetchingProducts(true);
      setError(null);

      const data = await getProducts();

      console.log("GET PRODUCTS:", data);

      setProducts(data);

    } catch (err) {
      console.error("GET Products Error:", err);
      setError(err);
    } finally {
      setFetchingProducts(false);
    }
  };

  // Run when page loads
  useEffect(() => {
    fetchProducts();
  }, []);

 
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const result = await uploadImage(file);
      setForm((prev) => ({
        ...prev,
        image: result.url,
      }));
      alert("Image uploaded to Cloudinary successfully!");
    } catch (err) {
      console.error("Image Upload Error:", err);
      alert(err?.message || "Image upload failed. Please check Cloudinary config.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Please drop an image file");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const result = await uploadImage(file);
      setForm((prev) => ({
        ...prev,
        image: result.url,
      }));
      alert("Image uploaded to Cloudinary successfully!");
    } catch (err) {
      console.error("Image Upload Error:", err);
      alert(err?.message || "Image upload failed. Please check Cloudinary config.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.name ||
      !form.description ||
      !form.price ||
      !form.stock ||
      !form.image
    ) {
      alert("Please fill all fields");
      return;
    }

    const productData = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      stock: Number(form.stock),
      status: form.status,
      image: form.image,
    };

    console.log("POST DATA:", productData);

    try {
      setLoading(true);

      const data = await createProduct(productData);

      console.log("POST RESPONSE:", data);

      alert("Product added successfully!");

      // Clear form
      setForm(emptyForm);

      // GET latest products from database
      await fetchProducts();

    } catch (err) {
      console.error("POST Product Error:", err);

      alert(
        err?.message ||
          (err?.detail ? String(err.detail) : "Product insert failed. Please check backend.")
      );

    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;

    try {
      await deleteProduct(id);
      alert("Product deleted successfully!");
      await fetchProducts();
    } catch (err) {
      console.error("DELETE Product Error:", err);
      alert(err?.message || (err?.detail ? String(err.detail) : "Product delete failed. Please check backend."));
    }
  };

  return (
    <div className="admin-section-card">

      {/* ================= HEADER ================= */}

      <PageHeader
        badge="Products"
        title="Inventory & Pricing"
        actions={
          <button
            type="button"
            className="btn btn-warning rounded-pill px-4"
            onClick={() => {
              document
                .getElementById("product-form")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
          >
            Add Product
          </button>
        }
      />

      {error && <ErrorAlert error={error} onRetry={fetchProducts} />}

      <div className="row g-4">

        {/* ================= FORM ================= */}

        <div className="col-12 col-xl-5">

          <form
            id="product-form"
            className="product-form"
            onSubmit={handleSubmit}
          >

            <h5 className="mb-4">
              Add New Product
            </h5>

            {/* NAME */}

            <div className="mb-3">

              <label className="form-label">
                Product Name
              </label>

              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter dish name"
              />

            </div>

            {/* DESCRIPTION */}

            <div className="mb-3">

              <label className="form-label">
                Description
              </label>

              <textarea
                name="description"
                className="form-control"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows="3"
              />

            </div>

            {/* CATEGORY */}

            <div className="mb-3">

              <label className="form-label">
                Category
              </label>

              <select
                name="category"
                className="form-select"
                value={form.category}
                onChange={handleChange}
              >

                {PRODUCT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}

              </select>

            </div>

            <div className="row g-3">

              {/* PRICE */}

              <div className="col-12 col-md-6">

                <label className="form-label">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  className="form-control"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="100"
                  min="0"
                />

              </div>

              {/* STOCK */}

              <div className="col-12 col-md-6">

                <label className="form-label">
                  Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  className="form-control"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="20"
                  min="0"
                />

              </div>

            </div>

            {/* STATUS */}

            <div className="mb-3 mt-3">

              <label className="form-label">
                Status
              </label>

              <select
                name="status"
                className="form-select"
                value={form.status}
                onChange={handleChange}
              >

                {PRODUCT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}

              </select>

            </div>

            {/* IMAGE UPLOAD (DRAG & DROP) */}

            <div className="mb-3">

              <label className="form-label">
                Upload Product Image
              </label>

              <div
                className={`border-2 border-dashed rounded-3 p-4 text-center cursor-pointer transition-all ${
                  dragActive
                    ? "border-warning bg-warning bg-opacity-10"
                    : "border-secondary bg-light"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{
                  cursor: "pointer",
                  borderWidth: "2px",
                  minHeight: "150px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                }}
              >

                {uploading ? (
                  <div className="text-muted">
                    <div className="spinner-border spinner-border-sm text-warning mb-2" role="status">
                      <span className="visually-hidden">Uploading...</span>
                    </div>
                    <p className="small mb-0">Uploading to Cloudinary...</p>
                  </div>
                ) : form.image ? (
                  <div className="text-success">
                    <i className="bi bi-check-circle-fill" style={{ fontSize: "2rem" }}></i>
                    <p className="small mt-2 mb-0">Image uploaded successfully!</p>
                    <p className="small text-muted mb-0">Drag to replace</p>
                  </div>
                ) : (
                  <>
                    <i
                      className="bi bi-cloud-arrow-up"
                      style={{ fontSize: "3rem", color: "#ffc107" }}
                    ></i>
                    <p className="mb-1 fw-bold">Drag & drop your image here</p>
                    <p className="small text-muted mb-3">or</p>
                    <label className="btn btn-warning btn-sm rounded-pill">
                      Browse Files
                      <input
                        type="file"
                        accept="image/*"
                        className="d-none"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </label>
                  </>
                )}

              </div>

            </div>

            {/* IMAGE URL */}

            <div className="mb-3">

              <label className="form-label">
                Product Image URL
              </label>

              <input
                type="url"
                name="image"
                className="form-control"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />

            </div>

            {/* IMAGE PREVIEW */}

            {form.image && (
              <div className="mb-3">

                <ProductImage
                  src={resolveProductImage(form.image)}
                  alt="Product Preview"
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />

              </div>
            )}

            {/* SAVE BUTTON */}

            <button
              type="submit"
              className="btn btn-warning rounded-pill w-100 mt-3"
              disabled={loading}
            >

              {loading
                ? "Saving Product..."
                : "Save Product"}

            </button>

          </form>

        </div>

        {/* ================= PRODUCT LIST ================= */}

        <div className="col-12 col-xl-7">

          {fetchingProducts ? (

            <Spinner label="Loading products..." />

          ) : products.length === 0 ? (

            <EmptyState
              title="No Products Found"
              subtitle="Add your first product."
            />

          ) : (

            <div className="row g-3">

              {products.map((product, index) => (

                <div
                  className="col-12 col-md-6"
                  key={product.id || index}
                >

                  <div className="product-card product-card-animated">

                    {/* IMAGE */}

                    <ProductImage
                      src={resolveProductImage(product.image)}
                      alt={product.name}
                      className="product-thumb"
                    />

                    {/* NAME + STATUS */}

                    <div className="d-flex justify-content-between align-items-center mb-2 mt-3">

                      <h5 className="mb-0">
                        {product.name}
                      </h5>

                      <span
                        className={`badge ${
                          product.status === "Low Stock"
                            ? "text-bg-danger"
                            : product.status === "Unavailable"
                            ? "text-bg-secondary"
                            : "text-bg-success"
                        }`}
                      >
                        {product.status}
                      </span>

                    </div>

                    {/* CATEGORY */}

                    <p className="mb-2 text-muted">
                      {product.category}
                    </p>

                    {/* DESCRIPTION */}

                    <p className="small text-muted">
                      {product.description}
                    </p>

                    {/* PRICE */}

                    <div className="product-meta-row">

                      <span>
                        Price
                      </span>

                      <strong>
                        ${Number(product.price).toFixed(2)}
                      </strong>

                    </div>

                    {/* STOCK */}

                    <div className="product-meta-row">

                      <span>
                        Stock
                      </span>

                      <strong>
                        {product.stock} Items
                      </strong>

                    </div>

                    {/* ACTIONS */}

                    <div className="d-flex gap-2 mt-3">

                      <button
                        type="button"
                        className="btn btn-sm btn-warning rounded-pill px-3"
                        onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                      >
                        <i className="bi bi-pencil me-1"></i>
                        Edit
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                        onClick={() => handleDelete(product.id, product.name)}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default AdminProducts;