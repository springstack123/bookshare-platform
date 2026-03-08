import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Y = "#FEFF86";

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { book, quantity, address, paymentMethod, totalPrice, orderId } = location.state || {};

  useEffect(() => {
    if (!orderId) {
      navigate("/books");
    }
  }, [orderId, navigate]);

  if (!orderId) return null;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  return (
    <div style={{ background: "#FAFEFF", minHeight: "100vh", paddingTop: 60, paddingBottom: 80 }}>
      <div className="container-fluid px-4 px-lg-5">
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          {/* Success Icon */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: Y,
                border: "4px solid #E0E000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                fontSize: "3rem",
                animation: "bounce 0.6s ease",
              }}
            >
              ✓
            </div>
          </div>

          <h1 style={{ fontFamily: "Playfair Display,serif", fontSize: "2.5rem", fontWeight: 900, color: "#1A1A1A", marginBottom: 12 }}>
            Order Placed Successfully!
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#888", marginBottom: 32 }}>Thank you for your order. We'll send you a confirmation email shortly.</p>

          {/* Order ID */}
          <div style={{ background: "#FFF", borderRadius: 16, padding: 24, border: "2px solid #EEE", marginBottom: 24 }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
              Order ID
            </div>
            <div style={{ fontFamily: "Playfair Display,serif", fontSize: "1.8rem", fontWeight: 900, color: "#1A1A1A" }}>{orderId}</div>
          </div>

          {/* Order Details */}
          <div style={{ background: "#FFF", borderRadius: 16, padding: 28, border: "2px solid #EEE", marginBottom: 24, textAlign: "left" }}>
            <h3 style={{ fontWeight: 900, fontSize: "1.2rem", marginBottom: 20 }}>Order Details</h3>

            {/* Book */}
            <div style={{ display: "flex", gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: "2px solid #F5F5F5" }}>
              <div style={{ width: 80, height: 100, borderRadius: 10, background: book.bg, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Playfair Display,serif", fontWeight: 900, fontSize: "1.1rem", marginBottom: 4 }}>{book.title}</div>
                <div style={{ fontSize: "0.9rem", color: "#888", marginBottom: 8 }}>by {book.author}</div>
                <div style={{ fontSize: "0.9rem", color: "#666" }}>Quantity: {quantity}</div>
                <div style={{ fontWeight: 900, fontSize: "1.2rem", color: "#1A1A1A", marginTop: 8 }}>₹{totalPrice}</div>
              </div>
            </div>

            {/* Delivery Address */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontWeight: 900, fontSize: "1rem", marginBottom: 12 }}>📍 Delivery Address</h4>
              <div style={{ fontSize: "0.9rem", color: "#666", lineHeight: 1.7, paddingLeft: 28 }}>
                <div style={{ fontWeight: 700, color: "#1A1A1A" }}>{address.fullName}</div>
                <div>{address.addressLine1}</div>
                {address.addressLine2 && <div>{address.addressLine2}</div>}
                <div>
                  {address.city}, {address.state} - {address.pincode}
                </div>
                <div style={{ marginTop: 4 }}>📞 {address.phone}</div>
              </div>
            </div>

            {/* Payment Method */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontWeight: 900, fontSize: "1rem", marginBottom: 12 }}>💳 Payment Method</h4>
              <div style={{ fontSize: "0.9rem", color: "#666", paddingLeft: 28 }}>
                {paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
              </div>
            </div>

            {/* Expected Delivery */}
            <div style={{ padding: 16, borderRadius: 12, background: "#E8F5E9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "1.5rem" }}>📦</span>
                <div>
                  <div style={{ fontWeight: 700, color: "#2E7D32", fontSize: "0.9rem" }}>Expected Delivery</div>
                  <div style={{ color: "#666", fontSize: "0.85rem" }}>{deliveryDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/profile")}
              style={{
                padding: "14px 32px",
                borderRadius: 10,
                background: Y,
                border: "2px solid #E0E000",
                color: "#1A1A1A",
                fontWeight: 800,
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              View My Orders
            </button>
            <button
              onClick={() => navigate("/books")}
              style={{
                padding: "14px 32px",
                borderRadius: 10,
                background: "#FFF",
                border: "2px solid #1A1A1A",
                color: "#1A1A1A",
                fontWeight: 800,
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}