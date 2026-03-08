import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const Y = "#FEFF86";
const LB = "#B0DAFF";
const SB = "#B9E9FC";
const MB = "#DAF5FF";

const BOOKS = [
  { id: 1, isbn: "9780735224292", title: "Atomic Habits", author: "James Clear", price: 250, originalPrice: 399, discount: 37, description: "Transform your life with tiny changes that deliver remarkable results. James Clear presents a proven framework for improving every day with practical strategies.", type: "sell", city: "Mumbai", seller: "Rahul D.", rating: 4.8, reviews: 142, stock: 3, condition: "Like New", language: "English", pages: 320, publishYear: 2018, bg: Y },
  { id: 2, isbn: "9780062315007", title: "The Alchemist", author: "Paulo Coelho", price: 150, originalPrice: 299, discount: 50, description: "A magical tale about following your dreams. Santiago, a shepherd boy, travels from Spain to Egypt in search of treasure and discovers the true meaning of life.", type: "sell", city: "Pune", seller: "Priya S.", rating: 4.9, reviews: 218, stock: 5, condition: "Like New", language: "English", pages: 208, publishYear: 1988, bg: LB },
  { id: 3, isbn: "9781455586691", title: "Deep Work", author: "Cal Newport", price: 180, originalPrice: 350, discount: 49, description: "Learn to focus without distraction on cognitively demanding tasks. Newport shows how to cultivate deep work in a distracted world.", type: "sell", city: "Mumbai", seller: "Amit K.", rating: 4.7, reviews: 89, stock: 2, condition: "Good", language: "English", pages: 296, publishYear: 2016, bg: SB },
  { id: 4, isbn: "9781612680194", title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", price: 120, originalPrice: 250, discount: 52, description: "What the rich teach their kids about money that the poor and middle class do not. A personal finance classic that challenges conventional wisdom.", type: "sell", city: "Delhi", seller: "Sneha M.", rating: 4.6, reviews: 156, stock: 4, condition: "Like New", language: "English", pages: 336, publishYear: 1997, bg: MB },
  { id: 5, isbn: "9780525559474", title: "Ikigai", author: "Héctor García", price: 200, originalPrice: 399, discount: 50, description: "Discover the Japanese secret to a long and happy life. Learn from the wisdom of centenarians in Okinawa about finding purpose and joy.", type: "borrow", city: "Bangalore", seller: "Ravi P.", rating: 4.8, reviews: 203, stock: 1, condition: "Excellent", language: "English", pages: 194, publishYear: 2016, bg: Y },
  { id: 6, isbn: "9780307951526", title: "The Lean Startup", author: "Eric Ries", price: 220, originalPrice: 450, discount: 51, description: "How today's entrepreneurs use continuous innovation to create radically successful businesses. A must-read for startup founders.", type: "sell", city: "Hyderabad", seller: "Neha T.", rating: 4.5, reviews: 95, stock: 3, condition: "Good", language: "English", pages: 336, publishYear: 2011, bg: LB },
];

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap');

* { font-family: 'DM Sans', sans-serif; }

.sticky-purchase-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  border-top: 2px solid #E0E0E0;
  padding: 16px 0;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  box-shadow: 0 -4px 24px rgba(0,0,0,0.08);
}

.sticky-purchase-bar.visible {
  transform: translateY(0);
}

.review-card {
  background: #F8F8F8;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.review-card:hover {
  border-color: ${Y};
  background: #FFF;
}

.detail-badge {
  padding: 12px 16px;
  border-radius: 10px;
  background: #F8F8F8;
  border: 2px solid #EEEEEE;
  transition: all 0.2s;
}

.detail-badge:hover {
  background: ${Y};
  border-color: #E0E000;
  transform: translateY(-2px);
}

.section-divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, #E0E0E0, transparent);
  margin: 40px 0;
}
`;

export default function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [imgErr, setImgErr] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const purchaseRef = useRef(null);

  // Fetch book data from API
  useEffect(() => {
    async function fetchBookData() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch book details
        const bookData = await api.getBookById(id);
        setBook(bookData);
        
        // Fetch reviews
        try {
          const reviewsData = await api.getBookReviews(id);
          setReviews(reviewsData || []);
        } catch (revErr) {
          // Reviews are optional, don't fail if they're not available
          console.log("No reviews available");
        }
      } catch (err) {
        setError(err.message || "Failed to load book details");
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      fetchBookData();
    }
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (purchaseRef.current) {
        const rect = purchaseRef.current.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div style={{ padding: "100px 20px", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: 20 }}>📚</div>
        <div style={{ fontFamily: "Playfair Display,serif", fontWeight: 900, fontSize: "1.5rem", marginBottom: 12 }}>Loading...</div>
        <div style={{ color: "#888" }}>Fetching book details from server</div>
      </div>
    );
  }

  // Show error state
  if (error || !book) {
    return (
      <div style={{ padding: "100px 20px", textAlign: "center" }}>
        <div style={{ fontSize: "5rem", marginBottom: 20 }}>⚠️</div>
        <h2 style={{ fontFamily: "Playfair Display,serif", fontWeight: 900, fontSize: "2rem", marginBottom: 12 }}>Book not found</h2>
        <p style={{ color: "#888", marginBottom: 24 }}>{error || "The book you're looking for doesn't exist"}</p>
        <button
          onClick={() => navigate("/books")}
          style={{
            padding: "14px 32px",
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

  // Helper function to get background color based on listing type
  const getBg = () => {
    if (book.listingType === "BORROW") return Y;
    if (book.listingType === "EXCHANGE") return LB;
    if (book.listingType === "SELL") return SB;
    return Y;
  };

  // Format price
  const displayPrice = book.listingType === "SELL" ? (book.price ? `₹${book.price}` : "—") : "Free";
  const bookType = book.listingType === "BORROW" ? "borrow" : book.listingType === "EXCHANGE" ? "exchange" : "sell";
  const bookCondition = book.condition || "Good";
  
  // Use API fields with fallbacks
  const bookRating = book.avgRating || 0;
  const reviewCount = book.reviewCount || 0;
  const sellerName = book.owner?.name || "Unknown";
  const bookCity = book.city || "N/A";

  return (
    <>
      <style>{STYLE}</style>

      <div style={{ background: "#FAFEFF", minHeight: "100vh", paddingTop: 40, paddingBottom: 100 }}>
        <div className="container-fluid px-4 px-lg-5">
          {/* Breadcrumb */}
          <div style={{ fontSize: "0.85rem", color: "#888", marginBottom: 32, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ cursor: "pointer", transition: "color 0.2s" }} onClick={() => navigate("/books")} onMouseEnter={(e) => e.target.style.color = "#1A1A1A"} onMouseLeave={(e) => e.target.style.color = "#888"}>Books</span>
            <span>›</span>
            <span style={{ color: "#1A1A1A" }}>{book.title}</span>
          </div>

          <div className="row g-4">
            {/* Left: Image */}
            <div className="col-lg-5">
              <div style={{ position: "sticky", top: 100 }}>
                <div style={{ background: getBg(), borderRadius: 20, overflow: "hidden", aspectRatio: "3/4", maxWidth: 480, margin: "0 auto", border: "3px solid #EEE", boxShadow: "0 12px 48px rgba(0,0,0,0.12)" }}>
                  {!imgErr && book.isbn ? (
                    <img
                      src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`}
                      alt={book.title}
                      onError={() => setImgErr(true)}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "6rem" }}>📖</div>
                  )}
                </div>

                {/* Quick Stats */}
                <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                  {[
                    { icon: "⭐", label: bookRating.toFixed(1), sub: "Rating" },
                    { icon: "💬", label: reviewCount, sub: "Reviews" },
                    { icon: "📦", label: book.status === "AVAILABLE" ? "Available" : "Unavailable", sub: "Status" }
                  ].map((stat, i) => (
                    <div key={i} style={{ background: "#FFF", padding: 16, borderRadius: 12, textAlign: "center", border: "2px solid #EEE" }}>
                      <div style={{ fontSize: "1.5rem", marginBottom: 4 }}>{stat.icon}</div>
                      <div style={{ fontWeight: 900, fontSize: "1.1rem", color: "#1A1A1A", marginBottom: 2 }}>{stat.label}</div>
                      <div style={{ fontSize: "0.7rem", color: "#888", fontWeight: 600, textTransform: "uppercase" }}>{stat.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Details */}
            <div className="col-lg-7">
              <div style={{ background: "#FFF", borderRadius: 20, padding: "40px", border: "3px solid #EEE", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
                {/* Title */}
                <h1 style={{ fontFamily: "Playfair Display,serif", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 900, color: "#1A1A1A", marginBottom: 10, lineHeight: 1.2 }}>
                  {book.title}
                </h1>
                <div style={{ fontSize: "1.1rem", color: "#666", marginBottom: 20 }}>
                  by <strong style={{ color: "#1A1A1A" }}>{book.author}</strong>
                </div>

                {/* Rating */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, paddingBottom: 28, borderBottom: "3px solid #F5F5F5" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <span key={i} style={{ color: i <= Math.round(bookRating) ? "#FFA500" : "#E0E0E0", fontSize: "1.3rem" }}>★</span>
                    ))}
                  </div>
                  <span style={{ fontWeight: 800, color: "#1A1A1A", fontSize: "1.1rem" }}>{bookRating.toFixed(1)}</span>
                  <span style={{ color: "#888", fontWeight: 600 }}>({reviewCount} reviews)</span>
                </div>

                {/* Price */}
                <div style={{ marginBottom: 28 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 10, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "Playfair Display,serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#1A1A1A", lineHeight: 1 }}>
                      {displayPrice}
                    </span>
                  </div>
                  {book.listingType === "BORROW" && (
                    <div style={{ fontSize: "0.9rem", color: "#22C55E", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                      <span>✓</span> Free borrowing • Return when done
                    </div>
                  )}
                  {book.listingType === "EXCHANGE" && (
                    <div style={{ fontSize: "0.9rem", color: "#22C55E", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                      <span>✓</span> Open for exchange
                    </div>
                  )}
                  {book.listingType === "SELL" && (
                    <div style={{ fontSize: "0.9rem", color: "#22C55E", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                      <span>✓</span> Inclusive of all taxes
                    </div>
                  )}
                </div>

                {/* Stock/Status Alert */}
                <div style={{ padding: 16, borderRadius: 12, background: book.status === "AVAILABLE" ? "#E8F5E9" : "#FFF3E0", border: `2px solid ${book.status === "AVAILABLE" ? "#C8E6C9" : "#FFE0B2"}`, marginBottom: 28 }}>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: book.status === "AVAILABLE" ? "#2E7D32" : "#F57C00", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "1.2rem" }}>{book.status === "AVAILABLE" ? "✓" : "⚠️"}</span>
                    {book.status === "AVAILABLE" ? "Available for " + (bookType === "borrow" ? "Borrow" : bookType === "exchange" ? "Exchange" : "Purchase") : "Currently Unavailable"}
                  </div>
                </div>

                {/* Quantity & Purchase */}
                {book.listingType !== "BORROW" && book.listingType !== "EXCHANGE" && (
                  <div ref={purchaseRef} style={{ marginBottom: 32 }}>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
                      Quantity
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity === 1}
                        style={{ width: 44, height: 44, borderRadius: 10, border: "2px solid #E0E0E0", background: quantity === 1 ? "#F5F5F5" : "#FFF", cursor: quantity === 1 ? "not-allowed" : "pointer", fontSize: "1.2rem", fontWeight: 800, transition: "all 0.2s" }}
                      >
                        −
                      </button>
                      <span style={{ fontSize: "1.3rem", fontWeight: 900, minWidth: 50, textAlign: "center", color: "#1A1A1A" }}>{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        style={{ width: 44, height: 44, borderRadius: 10, border: "2px solid #E0E0E0", background: "#FFF", cursor: "pointer", fontSize: "1.2rem", fontWeight: 800, transition: "all 0.2s" }}
                      >
                        +
                      </button>
                      <div style={{ flex: 1, textAlign: "right", fontSize: "0.9rem", color: "#666", fontWeight: 600 }}>
                        Total: <span style={{ fontWeight: 900, color: "#1A1A1A", fontSize: "1.1rem" }}>₹{(book.price || 0) * quantity}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={() => navigate("/address", { state: { book, quantity } })}
                    style={{
                      flex: 1,
                      padding: "18px",
                      borderRadius: 12,
                      background: Y,
                      border: "3px solid #E0E000",
                      color: "#1A1A1A",
                      fontWeight: 900,
                      fontSize: "1.05rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow: "0 6px 24px rgba(254,255,134,0.5)"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#F5F500";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 8px 32px rgba(254,255,134,0.6)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = Y;
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 6px 24px rgba(254,255,134,0.5)";
                    }}
                  >
                    {bookType === "borrow" ? "Borrow Now →" : bookType === "exchange" ? "Request Exchange →" : "Buy Now →"}
                  </button>
                  <button
                    style={{
                      padding: "18px 32px",
                      borderRadius: 12,
                      background: "#FFF",
                      border: "3px solid #1A1A1A",
                      color: "#1A1A1A",
                      fontWeight: 900,
                      fontSize: "1.05rem",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#1A1A1A";
                      e.target.style.color = Y;
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#FFF";
                      e.target.style.color = "#1A1A1A";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    🔖
                  </button>
                </div>

                <div className="section-divider" />

                {/* Seller Info */}
                <div style={{ padding: 20, borderRadius: 14, background: "linear-gradient(135deg, #F8F8F8 0%, #FAFAFA 100%)", border: "2px solid #EEEEEE", marginBottom: 32 }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#888", textTransform: "uppercase", marginBottom: 12, letterSpacing: "0.05em" }}>Listed By</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 50, height: 50, borderRadius: "50%", background: getBg(), display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", border: "3px solid #FFF", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                      {sellerName.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 900, color: "#1A1A1A", fontSize: "1.05rem", marginBottom: 4 }}>{sellerName}</div>
                      <div style={{ fontSize: "0.85rem", color: "#666", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                        <span>📍</span> {bookCity}
                      </div>
                    </div>
                    <button style={{ padding: "10px 20px", borderRadius: 8, background: "#FFF", border: "2px solid #E0E0E0", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
                      Chat
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: 32 }}>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#1A1A1A", marginBottom: 14, fontFamily: "Playfair Display,serif" }}>About This Book</h3>
                  <p style={{ fontSize: "1rem", color: "#555", lineHeight: 1.8 }}>
                    {book.description || "No description available."}
                  </p>
                </div>

                <div className="section-divider" />

                {/* Book Details Grid */}
                <div style={{ marginBottom: 32 }}>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#1A1A1A", marginBottom: 20, fontFamily: "Playfair Display,serif" }}>Book Details</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14 }}>
                    {[
                      { label: "Condition", value: bookCondition, icon: "✨" },
                      { label: "Language", value: book.language || "English", icon: "🌐" },
                      { label: "Pages", value: book.pages || "—", icon: "📄" },
                      { label: "Published", value: book.publishedYear || "—", icon: "📅" }
                    ].map(item => (
                      <div key={item.label} className="detail-badge">
                        <div style={{ fontSize: "1.2rem", marginBottom: 6 }}>{item.icon}</div>
                        <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#888", textTransform: "uppercase", marginBottom: 6, letterSpacing: "0.05em" }}>{item.label}</div>
                        <div style={{ fontWeight: 900, color: "#1A1A1A", fontSize: "0.95rem" }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="section-divider" />

                {/* Reviews */}
                <div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#1A1A1A", marginBottom: 20, fontFamily: "Playfair Display,serif" }}>Customer Reviews</h3>
                  {reviews.length > 0 ? (
                    reviews.map((review, i) => (
                      <div key={i} className="review-card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 10 }}>
                          <div>
                            <div style={{ fontWeight: 800, color: "#1A1A1A", marginBottom: 4 }}>{review.reviewerName || "Anonymous"}</div>
                            <div style={{ display: "flex", gap: 2 }}>
                              {[1, 2, 3, 4, 5].map(j => (
                                <span key={j} style={{ color: j <= (review.rating || 0) ? "#FFA500" : "#E0E0E0", fontSize: "0.9rem" }}>★</span>
                              ))}
                            </div>
                          </div>
                          <span style={{ fontSize: "0.75rem", color: "#888", fontWeight: 600 }}>{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}</span>
                        </div>
                        <p style={{ fontSize: "0.9rem", color: "#666", lineHeight: 1.6, margin: 0 }}>{review.comment || review.text || "No comment"}</p>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: "center", padding: "40px 20px", color: "#888" }}>
                      <div style={{ fontSize: "2rem", marginBottom: 10 }}>💬</div>
                      <p>No reviews yet. Be the first to review!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Purchase Bar */}
      <div className={`sticky-purchase-bar ${showStickyBar ? "visible" : ""}`}>
        <div className="container-fluid px-4 px-lg-5">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 50, height: 70, borderRadius: 8, background: getBg(), flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 900, fontSize: "1.05rem", color: "#1A1A1A", marginBottom: 4 }}>{book.title}</div>
                <div style={{ fontFamily: "Playfair Display,serif", fontSize: "1.4rem", fontWeight: 900, color: "#1A1A1A" }}>
                  {displayPrice}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {book.listingType !== "BORROW" && book.listingType !== "EXCHANGE" && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", background: "#F5F5F5", borderRadius: 10 }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ width: 32, height: 32, borderRadius: 6, border: "none", background: "#FFF", cursor: "pointer", fontWeight: 900 }}
                  >
                    −
                  </button>
                  <span style={{ fontWeight: 900, minWidth: 30, textAlign: "center" }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ width: 32, height: 32, borderRadius: 6, border: "none", background: "#FFF", cursor: "pointer", fontWeight: 900 }}
                  >
                    +
                  </button>
                </div>
              )}
              <button
                onClick={() => navigate("/address", { state: { book, quantity } })}
                style={{
                  padding: "14px 32px",
                  borderRadius: 10,
                  background: Y,
                  border: "2px solid #E0E000",
                  color: "#1A1A1A",
                  fontWeight: 900,
                  fontSize: "1rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                {bookType === "borrow" ? "Borrow Now →" : bookType === "exchange" ? "Exchange →" : "Buy Now →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
