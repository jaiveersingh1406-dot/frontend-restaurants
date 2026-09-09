import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getProduct, updateProduct } from "../api/productsApi";
import { uploadImage } from "../api/uploadApi";
import ErrorAlert from "../components/common/ErrorAlert";
import PageHeader from "../components/common/PageHeader";
import Spinner from "../components/common/Spinner";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_FORM_TEMPLATE,
  PRODUCT_STATUSES,
} from "../config/constants";
import { resolveProductImage } from "../config/constants";
import ProductImage from "../components/common/ProductImage";

const emptyForm = PRODUCT_FORM_TEMPLATE;

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const getProductData = async () => {
      try {
        setError(null);

        const data = await getProduct(id);

        setForm({
          name: data.name ?? "",
          description: data.description ?? "",
          category: data.category ?? PRODUCT_CATEGORIES[0],
          price: data.price ?? "",
          stock: data.stock ?? "",
          status: data.status ?? PRODUCT_STATUSES[0],
          image: data.image ?? "",
          rating: data.rating ?? 5,
          images: Array.isArray(data.images) ? data.images : [],
        });
      } catch (err) {
        console.error("GET Product Error:", err);
        setError(err);
      } finally {
        setFetching(false);
      }
    };

    getProductData();
  }, [id]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.price || !form.stock) {
      alert("Please fill all required fields");
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
      rating: Number(form.rating) || 0,
      images: (form.images || []).filter(Boolean),
    };

    try {
      setLoading(true);

      await updateProduct(id, productData);

      alert("Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error("PUT Product Error:", err);
      alert(err?.message || "Product update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-section-card">

      <PageHeader
        badge="Menu"
        title="Edit Product"
      />

      {error && <ErrorAlert error={error} />}

      {fetching ? (
        <Spinner label="Loading product..." />
      ) : (
        <form className="product-form col-12 col-xl-6" onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter dish name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="3"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
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

            <div className="col-12 col-md-6">
              <label className="form-label">Price</label>
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

            <div className="col-12 col-md-6">
              <label className="form-label">Stock</label>
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

          <div className="mb-3 mt-3">
            <label className="form-label">Status</label>
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

          <div className="mb-3">
            <label className="form-label">Rating (0 - 5)</label>
            <input
              type="number"
              name="rating"
              className="form-control"
              value={form.rating}
              onChange={handleChange}
              placeholder="4.5"
              min="0"
              max="5"
              step="0.1"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Upload Image (Cloudinary)</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            {uploading && (
              <div className="small text-muted mt-2">
                Uploading to Cloudinary...
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Product Image URL</label>
            <input
              type="url"
              name="image"
              className="form-control"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

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

          <div className="mb-3">
            <label className="form-label">Additional Gallery Images</label>
            <input
              type="text"
              className="form-control"
              placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
              value={(form.images || []).join(", ")}
              onChange={(e) => {
                const urls = e.target.value
                  .split(",")
                  .map((u) => u.trim())
                  .filter(Boolean);
                setForm((prev) => ({ ...prev, images: urls }));
              }}
            />
            <small className="text-muted">
              Comma-separated image URLs (shown as gallery on the product page).
            </small>
          </div>

          <button
            type="submit"
            className="btn btn-warning rounded-pill px-4 mt-2"
            disabled={loading}
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>

        </form>
      )}
    </div>
  );
}

export default EditProduct;
