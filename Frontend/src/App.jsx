
import { useEffect, useState } from "react";
import axios from "axios";

import {
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  FileText,
  Repeat,
  IndianRupee,
  LogOut,
  Plus,
  Trash2,
  X,
  CalendarDays
} from "lucide-react";

import "./App.css";

import SubscriptionPage from "./subscriptionPage.jsx";
import InvoicePage from "./InvoicePage.jsx";
import PaymentPage from "./PaymentPage.jsx";

const API = "http://localhost:5000/api";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const [data, setData] = useState(null);
  const [products, setProducts] = useState([]);
  const [plans, setPlans] = useState([]);

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);

  const [saving, setSaving] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    type: "service",
    salesPrice: "",
    costPrice: "",
    notes: ""
  });

  const [plan, setPlan] = useState({
    name: "",
    price: "",
    frequency: "monthly",
    minimumQuantity: 1,
    allowPause: true,
    allowRenew: true
  });

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  // DASHBOARD
  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`${API}/dashboard`, config);
      setData(res.data.dashboard);
    } catch (err) {
      setError(
        err.response?.data?.message || "Dashboard load nahi hua."
      );
    }
  };

  // PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`, config);

      const result = res.data.products || res.data;

      setProducts(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Products load nahi hue."
      );
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      await axios.post(
        `${API}/products`,
        {
          ...product,
          salesPrice: Number(product.salesPrice),
          costPrice: Number(product.costPrice || 0)
        },
        config
      );

      setProduct({
        name: "",
        type: "service",
        salesPrice: "",
        costPrice: "",
        notes: ""
      });

      setShowForm(false);

      await fetchProducts();

    } catch (err) {
      setError(
        err.response?.data?.message || "Product add nahi hua."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await axios.delete(`${API}/products/${id}`, config);
      fetchProducts();
    } catch (err) {
      setError(
        err.response?.data?.message || "Product delete nahi hua."
      );
    }
  };

  // PLANS
  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${API}/plans`, config);

      const result = res.data.plans || res.data;

      setPlans(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Plans load nahi hue."
      );
    }
  };

  const handleAddPlan = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      await axios.post(
        `${API}/plans`,
        {
          ...plan,
          price: Number(plan.price),
          minimumQuantity: Number(plan.minimumQuantity)
        },
        config
      );

      setPlan({
        name: "",
        price: "",
        frequency: "monthly",
        minimumQuantity: 1,
        allowPause: true,
        allowRenew: true
      });

      setShowPlanForm(false);

      await fetchPlans();

    } catch (err) {
      setError(
        err.response?.data?.message || "Plan add nahi hua."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) {
      return;
    }

    try {
      await axios.delete(`${API}/plans/${id}`, config);
      fetchPlans();
    } catch (err) {
      setError(
        err.response?.data?.message || "Plan delete nahi hua."
      );
    }
  };

  // INITIAL DATA
  useEffect(() => {
    fetchDashboard();
    fetchProducts();
    fetchPlans();
  }, []);

  // SIDEBAR MENU
  const menu = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Customers", icon: Users },
    { name: "Products", icon: Package },
    { name: "Plans", icon: CalendarDays },
    { name: "Subscriptions", icon: Repeat },
    { name: "Invoices", icon: FileText },
    { name: "Payments", icon: CreditCard }
  ];

  // DASHBOARD CARDS
  const cards = data
    ? [
        {
          title: "Total Customers",
          value: data.totalCustomers,
          icon: Users
        },
        {
          title: "Subscriptions",
          value: data.totalSubscriptions,
          icon: Repeat
        },
        {
          title: "Active Subscriptions",
          value: data.activeSubscriptions,
          icon: Package
        },
        {
          title: "Total Revenue",
          value: `₹${data.totalRevenue}`,
          icon: IndianRupee
        },
        {
          title: "Total Invoices",
          value: data.totalInvoices,
          icon: FileText
        },
        {
          title: "Pending Invoices",
          value: data.pendingInvoices,
          icon: CreditCard
        }
      ]
    : [];

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>Brightloop</h2>

        <p className="side-label">MAIN MENU</p>

        {menu.map(({ name, icon: Icon }) => (
          <div
            key={name}
            className={`nav ${
              activePage === name ? "active" : ""
            }`}
            onClick={() => {
              setActivePage(name);
              setError("");

              if (name === "Dashboard") fetchDashboard();
              if (name === "Products") fetchProducts();
              if (name === "Plans") fetchPlans();
            }}
          >
            <Icon size={20} />
            {name}
          </div>
        ))}

        <div
          className="nav logout"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
        >
          <LogOut size={20} />
          Logout
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">

        {/* TOPBAR */}
        <header className="topbar">
          <div>
            <h2>{activePage}</h2>
            <p>Welcome to Brightloop Admin Panel</p>
          </div>

          <span className="admin">Administrator</span>
        </header>

        <section className="content">

          {error && <p className="error">{error}</p>}

          {/* DASHBOARD */}
          {activePage === "Dashboard" && (
            <>
              <h3>Overview</h3>

              {!data && !error && (
                <p>Loading dashboard...</p>
              )}

              <div className="cards">
                {cards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <div className="card" key={card.title}>
                      <div className="card-top">
                        <span>{card.title}</span>
                        <Icon size={22} />
                      </div>

                      <h2>{card.value}</h2>
                    </div>
                  );
                })}
              </div>

              {data && (
                <div className="report">
                  <h3>Subscription Summary</h3>

                  <p>
                    Active subscriptions: {data.activeSubscriptions}
                  </p>

                  <p>
                    Overdue invoices: {data.overdueInvoices}
                  </p>

                  <p>
                    Total revenue: ₹{data.totalRevenue}
                  </p>
                </div>
              )}
            </>
          )}

          {/* PRODUCTS */}
          {activePage === "Products" && (
            <>
              <div className="page-heading">
                <div>
                  <h3>Product Management</h3>
                  <p>Manage your products and services.</p>
                </div>

                <button
                  className="add-btn"
                  onClick={() => setShowForm(true)}
                >
                  <Plus size={18} />
                  Add Product
                </button>
              </div>

              {showForm && (
                <form
                  className="product-form"
                  onSubmit={handleAddProduct}
                >
                  <div className="form-heading">
                    <h3>Add New Product</h3>

                    <X
                      size={22}
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowForm(false)}
                    />
                  </div>

                  <label>Product Name</label>

                  <input
                    value={product.name}
                    onChange={e =>
                      setProduct({
                        ...product,
                        name: e.target.value
                      })
                    }
                    placeholder="Product name"
                    required
                  />

                  <label>Product Type</label>

                  <select
                    value={product.type}
                    onChange={e =>
                      setProduct({
                        ...product,
                        type: e.target.value
                      })
                    }
                  >
                    <option value="service">Service</option>
                    <option value="goods">Goods</option>
                  </select>

                  <label>Sales Price (₹)</label>

                  <input
                    type="number"
                    min="0"
                    value={product.salesPrice}
                    onChange={e =>
                      setProduct({
                        ...product,
                        salesPrice: e.target.value
                      })
                    }
                    required
                  />

                  <label>Cost Price (₹)</label>

                  <input
                    type="number"
                    min="0"
                    value={product.costPrice}
                    onChange={e =>
                      setProduct({
                        ...product,
                        costPrice: e.target.value
                      })
                    }
                  />

                  <label>Notes</label>

                  <textarea
                    value={product.notes}
                    onChange={e =>
                      setProduct({
                        ...product,
                        notes: e.target.value
                      })
                    }
                  />

                  <button
                    className="add-btn"
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Product"}
                  </button>
                </form>
              )}

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Type</th>
                      <th>Sales Price</th>
                      <th>Cost Price</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map(item => (
                      <tr key={item._id}>
                        <td>{item.name}</td>
                        <td>{item.type}</td>
                        <td>₹{item.salesPrice}</td>
                        <td>₹{item.costPrice || 0}</td>

                        <td>
                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDeleteProduct(item._id)
                            }
                          >
                            <Trash2 size={17} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {products.length === 0 && (
                      <tr>
                        <td colSpan="5">
                          No products found. Add your first product.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* PLANS */}
          {activePage === "Plans" && (
            <>
              <div className="page-heading">
                <div>
                  <h3>Subscription Plans</h3>
                  <p>
                    Create and manage recurring subscription plans.
                  </p>
                </div>

                <button
                  className="add-btn"
                  onClick={() => setShowPlanForm(true)}
                >
                  <Plus size={18} />
                  Create Plan
                </button>
              </div>

              {showPlanForm && (
                <form
                  className="product-form"
                  onSubmit={handleAddPlan}
                >
                  <div className="form-heading">
                    <h3>Create New Plan</h3>

                    <X
                      size={22}
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowPlanForm(false)}
                    />
                  </div>

                  <label>Plan Name</label>

                  <input
                    placeholder="Example: Premium Monthly"
                    value={plan.name}
                    onChange={e =>
                      setPlan({
                        ...plan,
                        name: e.target.value
                      })
                    }
                    required
                  />

                  <label>Plan Price (₹)</label>

                  <input
                    type="number"
                    min="0"
                    placeholder="Enter plan price"
                    value={plan.price}
                    onChange={e =>
                      setPlan({
                        ...plan,
                        price: e.target.value
                      })
                    }
                    required
                  />

                  <label>Billing Frequency</label>

                  <select
                    value={plan.frequency}
                    onChange={e =>
                      setPlan({
                        ...plan,
                        frequency: e.target.value
                      })
                    }
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>

                  <label>Minimum Quantity</label>

                  <input
                    type="number"
                    min="1"
                    value={plan.minimumQuantity}
                    onChange={e =>
                      setPlan({
                        ...plan,
                        minimumQuantity: e.target.value
                      })
                    }
                    required
                  />

                  <label className="check-label">
                    <input
                      type="checkbox"
                      checked={plan.allowPause}
                      onChange={e =>
                        setPlan({
                          ...plan,
                          allowPause: e.target.checked
                        })
                      }
                    />
                    Allow Pause
                  </label>

                  <label className="check-label">
                    <input
                      type="checkbox"
                      checked={plan.allowRenew}
                      onChange={e =>
                        setPlan({
                          ...plan,
                          allowRenew: e.target.checked
                        })
                      }
                    />
                    Allow Renewal
                  </label>

                  <button
                    className="add-btn"
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Plan"}
                  </button>
                </form>
              )}

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Plan Name</th>
                      <th>Price</th>
                      <th>Frequency</th>
                      <th>Min Quantity</th>
                      <th>Pause</th>
                      <th>Renew</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {plans.map(item => (
                      <tr key={item._id}>
                        <td>{item.name}</td>
                        <td>₹{item.price}</td>
                        <td>{item.frequency}</td>
                        <td>{item.minimumQuantity}</td>
                        <td>{item.allowPause ? "Yes" : "No"}</td>
                        <td>{item.allowRenew ? "Yes" : "No"}</td>

                        <td>
                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDeletePlan(item._id)
                            }
                          >
                            <Trash2 size={17} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {plans.length === 0 && (
                      <tr>
                        <td colSpan="7">
                          No plans found. Create your first plan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* SUBSCRIPTIONS */}
          {activePage === "Subscriptions" && (
            <SubscriptionPage />
          )}

          {/* INVOICES */}
          {activePage === "Invoices" && (
            <InvoicePage />
          )}

          {/* PAYMENTS */}
          {activePage === "Payments" && (
            <PaymentPage />
          )}

          {/* CUSTOMERS */}
          {activePage === "Customers" && (
            <div className="report">
              <h3>Customers</h3>
              <p>Customer management module.</p>
            </div>
          )}

        </section>
      </main>
    </div>
  );
}

export default App;
