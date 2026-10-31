
import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, RefreshCw } from "lucide-react";

const API = "http://localhost:5000/api";

export default function InvoicePage() {
  const [invoices, setInvoices] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    subscriptionId: "",
    dueDate: ""
  });

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  };

  const loadData = async () => {
    try {
      setError("");

      const [i, s] = await Promise.all([
        axios.get(`${API}/invoices`, config),
        axios.get(`${API}/subscriptions`, config)
      ]);

      setInvoices(
        Array.isArray(i.data)
          ? i.data
          : i.data.invoices || []
      );

      setSubscriptions(
        Array.isArray(s.data)
          ? s.data
          : s.data.subscriptions || []
      );

    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Data loading failed");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createInvoice = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await axios.post(
        `${API}/invoices`,
        {
          subscriptionId: form.subscriptionId,
          dueDate: form.dueDate
        },
        config
      );

      setShowForm(false);
      setForm({ subscriptionId: "", dueDate: "" });
      await loadData();

    } catch (err) {
      setError(err.response?.data?.message || "Invoice creation failed");
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `${API}/invoices/${id}/status`,
        { status },
        config
      );

      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Status update failed");
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      <div className="page-heading">
        <div>
          <h3>Invoice Management</h3>
          <p>Create and manage customer invoices.</p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="add-btn" onClick={loadData}>
            <RefreshCw size={17} /> Refresh
          </button>

          <button
            className="add-btn"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={18} /> Create Invoice
          </button>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      {showForm && (
        <form className="product-form" onSubmit={createInvoice}>
          <h3>New Invoice</h3>

          <label>Select Subscription</label>
          <select
            required
            value={form.subscriptionId}
            onChange={e =>
              setForm({ ...form, subscriptionId: e.target.value })
            }
          >
            <option value="">Choose Subscription</option>

            {subscriptions.map(s => (
              <option key={s._id} value={s._id}>
                {s.subscriptionNumber} - {s.customer?.name || "Customer"} - ₹{s.totalAmount}
              </option>
            ))}
          </select>

          <label>Due Date</label>
          <input
            type="date"
            required
            value={form.dueDate}
            onChange={e =>
              setForm({ ...form, dueDate: e.target.value })
            }
          />

          <button className="add-btn" disabled={saving}>
            {saving ? "Creating..." : "Create Invoice"}
          </button>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Customer</th>
              <th>Subscription</th>
              <th>Amount</th>
              <th>Tax</th>
              <th>Total</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map(inv => (
              <tr key={inv._id}>
                <td>{inv.invoiceNumber}</td>
                <td>{inv.customer?.name || "N/A"}</td>
                <td>{inv.subscription?.subscriptionNumber || "N/A"}</td>
                <td>₹{inv.amount}</td>
                <td>₹{inv.tax}</td>
                <td>₹{inv.totalAmount}</td>
                <td>
                  {inv.dueDate
                    ? new Date(inv.dueDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{inv.status}</td>
                <td>
                  <select
                    value={inv.status}
                    onChange={e => updateStatus(inv._id, e.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}

            {invoices.length === 0 && (
              <tr>
                <td colSpan="9">No invoices found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
