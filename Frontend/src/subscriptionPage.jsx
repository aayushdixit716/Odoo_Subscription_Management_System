
import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, RefreshCw, X } from "lucide-react";

const API = "http://localhost:5000/api";

export default function SubscriptionPage() {
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    customerId: "",
    planId: "",
    startDate: new Date().toISOString().split("T")[0],
    quantity: 1
  });

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  // Load customers, plans and subscriptions
  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [customerRes, planRes, subscriptionRes] =
        await Promise.all([
          axios.get(`${API}/customers`, config),
          axios.get(`${API}/plans`, config),
          axios.get(`${API}/subscriptions`, config)
        ]);

      // Customers response
      const customerList = Array.isArray(customerRes.data)
        ? customerRes.data
        : customerRes.data.customers || [];

      // Plans response
      const planList = Array.isArray(planRes.data)
        ? planRes.data
        : planRes.data.plans || [];

      // Subscriptions response
      const subscriptionList = Array.isArray(subscriptionRes.data)
        ? subscriptionRes.data
        : subscriptionRes.data.subscriptions || [];

      setCustomers(customerList);
      setPlans(planList);
      setSubscriptions(subscriptionList);

      console.log("Customers:", customerList);
      console.log("Plans:", planList);
      console.log("Subscriptions:", subscriptionList);

    } catch (err) {
      console.error("Loading error:", err.response?.data || err);
      setError(
        err.response?.data?.message ||
        "Data load nahi hua. Please login again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Create subscription
  const handleAddSubscription = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      await axios.post(
        `${API}/subscriptions`,
        {
          customerId: form.customerId,
          planId: form.planId,
          startDate: form.startDate,
          quantity: Number(form.quantity)
        },
        config
      );

      setShowForm(false);

      setForm({
        customerId: "",
        planId: "",
        startDate: new Date().toISOString().split("T")[0],
        quantity: 1
      });

      await loadData();

    } catch (err) {
      console.error("Subscription error:", err.response?.data || err);
      setError(
        err.response?.data?.message ||
        "Subscription create nahi hua."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "10px" }}>

      {/* Header */}
      <div className="page-heading">
        <div>
          <h3>Subscription Management</h3>
          <p>Create and manage customer subscriptions.</p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="add-btn"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw size={17} />
            {loading ? "Loading..." : "Refresh"}
          </button>

          <button
            className="add-btn"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={18} />
            Create Subscription
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="error">{error}</p>
      )}

      {/* Create Subscription Form */}
      {showForm && (
        <form
          className="product-form"
          onSubmit={handleAddSubscription}
        >
          <div className="form-heading">
            <h3>New Subscription</h3>

            <X
              size={22}
              style={{ cursor: "pointer" }}
              onClick={() => setShowForm(false)}
            />
          </div>

          {/* Customer */}
          <label>Select Customer</label>

          <select
            value={form.customerId}
            onChange={e =>
              setForm({
                ...form,
                customerId: e.target.value
              })
            }
            required
          >
            <option value="">Choose Customer</option>

            {customers.map(customer => (
              <option
                key={customer._id}
                value={customer._id}
              >
                {customer.name} ({customer.email})
              </option>
            ))}
          </select>

          {customers.length === 0 && (
            <small>No customers found. Register a customer first.</small>
          )}

          {/* Plan */}
          <label>Select Plan</label>

          <select
            value={form.planId}
            onChange={e =>
              setForm({
                ...form,
                planId: e.target.value
              })
            }
            required
          >
            <option value="">Choose Plan</option>

            {plans.map(item => (
              <option
                key={item._id}
                value={item._id}
              >
                {item.name} - ₹{item.price}/{item.frequency}
              </option>
            ))}
          </select>

          {plans.length === 0 && (
            <small>
              No plans found. Please create a plan first.
            </small>
          )}

          {/* Start Date */}
          <label>Start Date</label>

          <input
            type="date"
            value={form.startDate}
            onChange={e =>
              setForm({
                ...form,
                startDate: e.target.value
              })
            }
            required
          />

          {/* Quantity */}
          <label>Quantity</label>

          <input
            type="number"
            min="1"
            value={form.quantity}
            onChange={e =>
              setForm({
                ...form,
                quantity: e.target.value
              })
            }
            required
          />

          {/* Submit */}
          <button
            className="add-btn"
            type="submit"
            disabled={saving || customers.length === 0 || plans.length === 0}
          >
            {saving ? "Creating..." : "Create Subscription"}
          </button>
        </form>
      )}

      {/* Subscription Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Subscription ID</th>
              <th>Customer</th>
              <th>Plan</th>
              <th>Start Date</th>
              <th>Expiry Date</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {subscriptions.map(item => (
              <tr key={item._id}>
                <td>{item.subscriptionNumber}</td>

                <td>
                  {item.customer?.name || "N/A"}
                </td>

                <td>
                  {item.plan?.name || "N/A"}
                </td>

                <td>
                  {new Date(item.startDate).toLocaleDateString()}
                </td>

                <td>
                  {new Date(item.expiryDate).toLocaleDateString()}
                </td>

                <td>{item.quantity}</td>

                <td>₹{item.totalAmount}</td>

                <td>{item.status}</td>
              </tr>
            ))}

            {subscriptions.length === 0 && (
              <tr>
                <td colSpan="8">
                  {loading
                    ? "Loading subscriptions..."
                    : "No subscriptions found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
