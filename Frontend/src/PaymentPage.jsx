
import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, RefreshCw } from "lucide-react";

const API = "http://localhost:5000/api";

export default function PaymentPage() {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    invoiceId: "",
    amount: "",
    paymentMethod: "upi",
    transactionId: ""
  });

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  };

  const loadData = async () => {
    try {
      setError("");

      const [p, i] = await Promise.all([
        axios.get(`${API}/payments`, config),
        axios.get(`${API}/invoices`, config)
      ]);

      setPayments(
        Array.isArray(p.data) ? p.data : p.data.payments || []
      );

      setInvoices(
        Array.isArray(i.data) ? i.data : i.data.invoices || []
      );
    } catch (err) {
      setError(err.response?.data?.message || "Payment data load failed.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInvoiceChange = (id) => {
    const selected = invoices.find(i => i._id === id);

    setForm({
      ...form,
      invoiceId: id,
      amount: selected ? selected.totalAmount : ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await axios.post(
        `${API}/payments`,
        {
          invoiceId: form.invoiceId,
          amount: Number(form.amount),
          paymentMethod: form.paymentMethod,
          transactionId: form.transactionId
        },
        config
      );

      setShowForm(false);
      setForm({
        invoiceId: "",
        amount: "",
        paymentMethod: "upi",
        transactionId: ""
      });

      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Payment creation failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      <div className="page-heading">
        <div>
          <h3>Payment Management</h3>
          <p>Record and track customer payments.</p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="add-btn" onClick={loadData}>
            <RefreshCw size={17} /> Refresh
          </button>

          <button className="add-btn" onClick={() => setShowForm(!showForm)}>
            <Plus size={18} /> Record Payment
          </button>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      {showForm && (
        <form className="product-form" onSubmit={handleSubmit}>
          <h3>Record New Payment</h3>

          <label>Select Invoice</label>
          <select
            required
            value={form.invoiceId}
            onChange={e => handleInvoiceChange(e.target.value)}
          >
            <option value="">Choose Invoice</option>

            {invoices
              .filter(i => !["paid", "cancelled"].includes(i.status))
              .map(i => (
                <option key={i._id} value={i._id}>
                  {i.invoiceNumber} - ₹{i.totalAmount} - {i.status}
                </option>
              ))}
          </select>

          <label>Amount (₹)</label>
          <input
            type="number"
            min="0"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
            required
          />

          <label>Payment Method</label>
          <select
            value={form.paymentMethod}
            onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
          >
            <option value="upi">UPI</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>

          <label>Transaction ID (optional)</label>
          <input
            value={form.transactionId}
            onChange={e => setForm({ ...form, transactionId: e.target.value })}
            placeholder="Enter transaction ID"
          />

          <button className="add-btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Submit Payment"}
          </button>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Transaction ID</th>
              <th>Status</th>
              <th>Payment Date</th>
            </tr>
          </thead>

          <tbody>
            {payments.map(p => (
              <tr key={p._id}>
                <td>{p.invoice?.invoiceNumber || "N/A"}</td>
                <td>{p.customer?.name || "N/A"}</td>
                <td>₹{p.amount}</td>
                <td>{p.paymentMethod}</td>
                <td>{p.transactionId || "N/A"}</td>
                <td>{p.status}</td>
                <td>
                  {p.paymentDate
                    ? new Date(p.paymentDate).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}

            {payments.length === 0 && (
              <tr>
                <td colSpan="7">No payments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
