import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Y = "#FEFF86";
const LB = "#B0DAFF";

const STYLE = `
.field-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #E0E0E0;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  color: #1A1A1A;
  background: #FFFFFF;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.field-input:focus {
  border-color: ${Y};
  box-shadow: 0 0 0 3px rgba(254,255,134,0.3);
}
.field-input::placeholder {
  color: #BBBBBB;
}

.field-label {
  font-size: 0.75rem;
  font-weight: 800;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
  display: block;
}
`;

export default function AddressPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { book, quantity } = location.state || {};

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});

  if (!book) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: 16 }}>🛒</div>
        <h2 style={{ fontFamily: "Playfair Display,serif", fontWeight: 900, marginBottom: 12 }}>No item selected</h2>
        <button
          onClick={() => navigate("/books")}
          style={{
            padding: "12px 28px",
            borderRadius: 10,
            background: Y,
            border: "2px solid #E0E000",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Browse Books
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = "Invalid phone number";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    if (!/^[0-9]{6}$/.test(formData.pincode)) newErrors.pincode = "Invalid pincode";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      navigate("/payment", { state: { book, quantity, address: formData } });
    }
  };

  const totalPrice = book.price * quantity;

  return (
    <>
      <style>{STYLE}</style>

      <div style={{ background: "#FAFEFF", minHeight: "100vh", paddingTop: 40, paddingBottom: 60 }}>
        <div className="container-fluid px-4 px-lg-5">
          {/* Progress Bar */}
          <div style={{ maxWidth: 800, margin: "0 auto 40px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
              {/* Line */}
              <div style={{ position: "absolute", top: 20, left: 0, right: 0, height: 3, background: "#E0E0E0", zIndex: 0 }}>
                <div style={{ height: "100%", width: "33%", background: Y, transition: "width 0.4s" }} />
              </div>

              {[
                { num: 1, label: "Cart", active: true },
                { num: 2, label: "Address", active: true },
                { num: 3, label: "Payment", active: false },
              ].map((step) => (
                <div key={step.num} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      background: step.active ? Y : "#FFF",
                      border: `3px solid ${step.active ? "#E0E000" : "#E0E0E0"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      color: "#1A1A1A",
                      margin: "0 auto 8px",
                    }}
                  >
                    {step.active ? "✓" : step.num}
                  </div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: step.active ? "#1A1A1A" : "#999" }}>
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="row g-4">
            {/* Left: Form */}
            <div className="col-lg-8">
              <div style={{ background: "#FFF", borderRadius: 16, padding: 32, border: "2px solid #EEE" }}>
                <h2 style={{ fontFamily: "Playfair Display,serif", fontSize: "1.8rem", fontWeight: 900, marginBottom: 8 }}>
                  Delivery Address
                </h2>
                <p style={{ fontSize: "0.9rem", color: "#888", marginBottom: 32 }}>
                  Enter your address where you want this book delivered
                </p>

                <form onSubmit={handleSubmit}>
                  {/* Full Name */}
                  <div style={{ marginBottom: 20 }}>
                    <label className="field-label">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      className="field-input"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                    {errors.fullName && <div style={{ fontSize: "0.75rem", color: "#EF4444", marginTop: 4 }}>{errors.fullName}</div>}
                  </div>

                  {/* Phone & Email */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="field-label">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        className="field-input"
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                      {errors.phone && <div style={{ fontSize: "0.75rem", color: "#EF4444", marginTop: 4 }}>{errors.phone}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="field-label">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        className="field-input"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && <div style={{ fontSize: "0.75rem", color: "#EF4444", marginTop: 4 }}>{errors.email}</div>}
                    </div>
                  </div>

                  {/* Address Line 1 */}
                  <div style={{ marginBottom: 20 }}>
                    <label className="field-label">Address Line 1 *</label>
                    <input
                      type="text"
                      name="addressLine1"
                      className="field-input"
                      placeholder="House no., Building name"
                      value={formData.addressLine1}
                      onChange={handleChange}
                    />
                    {errors.addressLine1 && <div style={{ fontSize: "0.75rem", color: "#EF4444", marginTop: 4 }}>{errors.addressLine1}</div>}
                  </div>

                  {/* Address Line 2 */}
                  <div style={{ marginBottom: 20 }}>
                    <label className="field-label">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      name="addressLine2"
                      className="field-input"
                      placeholder="Street name, Area"
                      value={formData.addressLine2}
                      onChange={handleChange}
                    />
                  </div>

                  {/* City, State, Pincode */}
                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <label className="field-label">City *</label>
                      <input
                        type="text"
                        name="city"
                        className="field-input"
                        placeholder="Mumbai"
                        value={formData.city}
                        onChange={handleChange}
                      />
                      {errors.city && <div style={{ fontSize: "0.75rem", color: "#EF4444", marginTop: 4 }}>{errors.city}</div>}
                    </div>
                    <div className="col-md-4">
                      <label className="field-label">State *</label>
                      <input
                        type="text"
                        name="state"
                        className="field-input"
                        placeholder="Maharashtra"
                        value={formData.state}
                        onChange={handleChange}
                      />
                      {errors.state && <div style={{ fontSize: "0.75rem", color: "#EF4444", marginTop: 4 }}>{errors.state}</div>}
                    </div>
                    <div className="col-md-4">
                      <label className="field-label">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        className="field-input"
                        placeholder="400001"
                        value={formData.pincode}
                        onChange={handleChange}
                      />
                      {errors.pincode && <div style={{ fontSize: "0.75rem", color: "#EF4444", marginTop: 4 }}>{errors.pincode}</div>}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      style={{
                        padding: "14px 28px",
                        borderRadius: 10,
                        background: "#FFF",
                        border: "2px solid #E0E0E0",
                        fontWeight: 800,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        padding: "14px",
                        borderRadius: 10,
                        background: Y,
                        border: "2px solid #E0E000",
                        color: "#1A1A1A",
                        fontWeight: 800,
                        fontSize: "1rem",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      Continue to Payment →
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="col-lg-4">
              <div style={{ position: "sticky", top: 100 }}>
                <div style={{ background: "#FFF", borderRadius: 16, padding: 24, border: "2px solid #EEE" }}>
                  <h3 style={{ fontWeight: 900, fontSize: "1.2rem", marginBottom: 20, color: "#1A1A1A" }}>Order Summary</h3>

                  {/* Book */}
                  <div style={{ display: "flex", gap: 12, marginBottom: 20, paddingBottom: 20, borderBottom: "2px solid #F5F5F5" }}>
                    <div style={{ width: 60, height: 80, borderRadius: 8, background: book.bg || LB, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 4 }}>{book.title}</div>
                      <div style={{ fontSize: "0.8rem", color: "#888", marginBottom: 8 }}>{book.author}</div>
                      <div style={{ fontSize: "0.85rem", color: "#666" }}>Qty: {quantity}</div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div style={{ marginBottom: 20 }}>
                    {[
                      { label: "Subtotal", value: `₹${totalPrice}` },
                      { label: "Delivery", value: "FREE" },
                    ].map((item) => (
                      <div key={item.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: "0.9rem" }}>
                        <span style={{ color: "#888" }}>{item.label}</span>
                        <span style={{ fontWeight: 700, color: "#1A1A1A" }}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div style={{ paddingTop: 20, borderTop: "2px solid #F5F5F5" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>Total</span>
                      <span style={{ fontFamily: "Playfair Display,serif", fontSize: "1.8rem", fontWeight: 900, color: "#1A1A1A" }}>
                        ₹{totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}