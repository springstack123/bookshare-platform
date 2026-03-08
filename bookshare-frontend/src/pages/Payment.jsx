import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Y = "#FEFF86";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { book, quantity, address } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("");
  const [processing, setProcessing] = useState(false);

  if (!book || !address) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <h2>Invalid order details</h2>
        <button onClick={() => navigate("/books")} style={{ padding: "12px 28px", background: Y, border: "2px solid #E0E000", borderRadius: 10, fontWeight: 800 }}>
          Browse Books
        </button>
      </div>
    );
  }

  const totalPrice = book.price * quantity;

  const handlePayment = () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      const orderId = `BC${Date.now()}`;
      navigate("/order-confirmation", {
        state: { book, quantity, address, paymentMethod, totalPrice, orderId },
      });
    }, 2000);
  };

  return (
    <div style={{ background: "#FAFEFF", minHeight: "100vh", paddingTop: 40, paddingBottom: 60 }}>
      <div className="container-fluid px-4 px-lg-5">
        {/* Progress Bar */}
        <div style={{ maxWidth: 800, margin: "0 auto 40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
            <div style={{ position: "absolute", top: 20, left: 0, right: 0, height: 3, background: "#E0E0E0", zIndex: 0 }}>
              <div style={{ height: "100%", width: "100%", background: Y, transition: "width 0.4s" }} />
            </div>

            {[
              { num: 1, label: "Cart", active: true },
              { num: 2, label: "Address", active: true },
              { num: 3, label: "Payment", active: true },
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
                  ✓
                </div>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1A1A1A" }}>{step.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="row g-4">
          {/* Left: Payment Methods */}
          <div className="col-lg-8">
            <div style={{ background: "#FFF", borderRadius: 16, padding: 32, border: "2px solid #EEE" }}>
              <h2 style={{ fontFamily: "Playfair Display,serif", fontSize: "1.8rem", fontWeight: 900, marginBottom: 8 }}>
                Payment Method
              </h2>
              <p style={{ fontSize: "0.9rem", color: "#888", marginBottom: 32 }}>Choose how you want to pay</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* COD */}
                <div
                  onClick={() => setPaymentMethod("cod")}
                  style={{
                    padding: 20,
                    borderRadius: 12,
                    border: `2px solid ${paymentMethod === "cod" ? Y : "#E0E0E0"}`,
                    background: paymentMethod === "cod" ? Y + "22" : "#FFF",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", border: `3px solid ${paymentMethod === "cod" ? "#1A1A1A" : "#E0E0E0"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {paymentMethod === "cod" && <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#1A1A1A" }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: "1.5rem" }}>💵</span>
                        <span style={{ fontWeight: 900, fontSize: "1.1rem" }}>Cash on Delivery</span>
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#888" }}>Pay when you receive the book</div>
                    </div>
                  </div>
                </div>

                {/* Online Payment */}
                <div
                  onClick={() => setPaymentMethod("online")}
                  style={{
                    padding: 20,
                    borderRadius: 12,
                    border: `2px solid ${paymentMethod === "online" ? Y : "#E0E0E0"}`,
                    background: paymentMethod === "online" ? Y + "22" : "#FFF",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", border: `3px solid ${paymentMethod === "online" ? "#1A1A1A" : "#E0E0E0"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {paymentMethod === "online" && <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#1A1A1A" }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: "1.5rem" }}>💳</span>
                        <span style={{ fontWeight: 900, fontSize: "1.1rem" }}>Pay Online</span>
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#888" }}>UPI, Cards, Net Banking, Wallets</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
                <button
                  onClick={() => navigate(-1)}
                  style={{
                    padding: "14px 28px",
                    borderRadius: 10,
                    background: "#FFF",
                    border: "2px solid #E0E0E0",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  style={{
                    flex: 1,
                    padding: "14px",
                    borderRadius: 10,
                    background: processing ? "#CCC" : Y,
                    border: `2px solid ${processing ? "#AAA" : "#E0E000"}`,
                    color: "#1A1A1A",
                    fontWeight: 800,
                    fontSize: "1rem",
                    cursor: processing ? "not-allowed" : "pointer",
                  }}
                >
                  {processing ? "Processing..." : "Place Order →"}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="col-lg-4">
            <div style={{ position: "sticky", top: 100 }}>
              <div style={{ background: "#FFF", borderRadius: 16, padding: 24, border: "2px solid #EEE", marginBottom: 20 }}>
                <h3 style={{ fontWeight: 900, fontSize: "1.2rem", marginBottom: 20 }}>Order Summary</h3>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ color: "#888" }}>Subtotal</span>
                    <span style={{ fontWeight: 700 }}>₹{totalPrice}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ color: "#888" }}>Delivery</span>
                    <span style={{ fontWeight: 700, color: "#22C55E" }}>FREE</span>
                  </div>
                </div>
                <div style={{ paddingTop: 20, borderTop: "2px solid #F5F5F5" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>Total</span>
                    <span style={{ fontFamily: "Playfair Display,serif", fontSize: "1.8rem", fontWeight: 900 }}>₹{totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div style={{ background: "#FFF", borderRadius: 16, padding: 20, border: "2px solid #EEE" }}>
                <h4 style={{ fontWeight: 900, fontSize: "1rem", marginBottom: 12 }}>Delivery Address</h4>
                <div style={{ fontSize: "0.85rem", color: "#666", lineHeight: 1.7 }}>
                  <div style={{ fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>{address.fullName}</div>
                  <div>{address.addressLine1}</div>
                  {address.addressLine2 && <div>{address.addressLine2}</div>}
                  <div>
                    {address.city}, {address.state} - {address.pincode}
                  </div>
                  <div style={{ marginTop: 8 }}>📞 {address.phone}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}