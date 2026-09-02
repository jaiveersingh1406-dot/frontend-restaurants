import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { deleteProduct, getProducts } from "../api/productsApi";
import EmptyState from "../components/common/EmptyState";
import ErrorAlert from "../components/common/ErrorAlert";
import PageHeader from "../components/common/PageHeader";
import Spinner from "../components/common/Spinner";

function AdminMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  const getProductsData = async () => {
    try {
      setFetching(true);
      setError(null);

      const data = await getProducts();
      setMenuItems(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteProduct(id);

      // Remove deleted product from UI
      setMenuItems((prevItems) =>
        prevItems.filter((item) => item.id !== id)
      );

    } catch (err) {
      console.error("Delete error:", err);
      alert(err?.message || "Failed to delete product");
    }
  };

  return (
    <div className="admin-section-card">

      <PageHeader
        badge="Menu"
        title="Inventory & Pricing"
        actions={
          <button className="btn btn-warning rounded-pill px-4">
            Add Dish
          </button>
        }
      />

      {error && <ErrorAlert error={error} onRetry={getProductsData} />}

      {/* Products */}
      {fetching ? (
        <Spinner label="Loading menu items..." />
      ) : (
        <div className="row g-3">

          {menuItems.length === 0 ? (
            <div className="col-12">
              <EmptyState
                title="No products found."
              />
            </div>
          ) : (
          menuItems.map((item) => (

            <div className="col-12 col-md-6" key={item.id}>

              <div className="admin-list-item">

                {/* Product Info */}
                <div>
                  <h5>{item.name}</h5>

                  <p>{item.category}</p>
                </div>

                {/* Price / Stock / Actions */}
                <div className="text-end">

                  <div className="fw-bold text-warning">
                    ₹{item.price}
                  </div>

                  <small>
                    Stock: {item.stock}
                  </small>

                  <div className="mt-2">

                    <span
                      className={`badge ${
                        item.status === "Low Stock"
                          ? "text-bg-danger"
                          : "text-bg-success"
                      }`}
                    >
                      {item.status}
                    </span>

                  </div>

                  {/* Buttons */}
                  <div className="mt-3">

                    <Link to={`/admin/menu/edit/${item.id}`} className="btn btn-outline-warning btn-sm me-2" >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))

        )}

        </div>
      )}
    </div>
  );
}

export default AdminMenu;
