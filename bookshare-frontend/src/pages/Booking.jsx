import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Y = "#FEFF86";
const LB = "#B0DAFF";
const SB = "#B9E9FC";
const MB = "#DAF5FF";

const BOOKS = [
  { id: 1, isbn: "9780735224292", title: "Atomic Habits", author: "James Clear", price: 250, originalPrice: 399, discount: 37, type: "sell", city: "Mumbai", seller: "Rahul D.", rating: 4.8, reviews: 142, stock: 3, bg: Y },
  { id: 2, isbn: "9780062315007", title: "The Alchemist", author: "Paulo Coelho", price: 150, originalPrice: 299, discount: 50, type: "sell", city: "Pune", seller: "Priya S.", rating: 4.9, reviews: 218, stock: 5, bg: LB },
  { id: 3, isbn: "9781455586691", title: "Deep Work", author: "Cal Newport", price: 180, originalPrice: 350, discount: 49, type: "sell", city: "Mumbai", seller: "Amit K.", rating: 4.7, reviews: 89, stock: 2, bg: SB },
  { id: 4, isbn: "9781612680194", title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", price: 120, originalPrice: 250, discount: 52, type: "sell", city: "Delhi", seller: "Sneha M.", rating: 4.6, reviews: 156, stock: 4, bg: MB },
  { id: 5, isbn: "9780525559474", title: "Ikigai", author: "Héctor García", price: 200, originalPrice: 399, discount: 50, type: "borrow", city: "Bangalore", seller: "Ravi P.", rating: 4.8, reviews: 203, stock: 1, bg: Y },
  { id: 6, isbn: "9780307951526", title: "The Lean Startup", author: "Eric Ries", price: 220, originalPrice: 450, discount: 51, type: "sell", city: "Hyderabad", seller: "Neha T.", rating: 4.5, reviews: 95, stock: 3, bg: LB },
];

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

.book-card {
  background: #FFFFFF;
  border-radius: 14px;
  border: 2px solid #EEEEEE;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
}
.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.12);
  border-color: #1A1A1A;
}

.filter-btn {
  padding: 8px 18px;
  border-radius: 8px;
  border: 2px solid #E0E0E0;
  background: #FFF;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-btn:hover, .filter-btn.active {
  background: #1A1A1A;
  color: ${Y};
  border-color: #1A1A1A;
}

.search-input {
  width: 100%;
  padding: 14px 20px 14px 48px;
  border: 2px solid #E0E0E0;
  border-radius: 12px;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s;
}
.search-input:focus {
  border-color: ${Y};
  box-shadow: 0 0 0 3px rgba(254,255,134,0.3);
}
`;

function BookCover({ isbn, bg }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>
        📖
      </div>
    );
  }
  return (
    <img
      src={`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`}
      alt=""
      onError={() => setErr(true)}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
}

export default function BooksPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("popular");

  let filtered = BOOKS;

  // Filter by type
  if (filter !== "all") {
    filtered = filtered.filter(b => b.type === filter);
  }

  // Search
  if (search) {
    filtered = filtered.filter(b =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Sort
  if (sort === "price-low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "price-high") filtered.sort((a, b) => b.price - a.price);
  if (sort === "popular") filtered.sort((a, b) => b.reviews - a.reviews);

  return (
    <>
      <style>{STYLE}</style>

      {/* Hero Banner */}
      <div style={{ background: `linear-gradient(135deg, ${Y} 0%, ${LB} 50%, ${SB} 100%)`, padding: "60px 0 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="container-fluid px-4 px-lg-5" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h1 style={{ fontFamily: "Playfair Display,serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#1A1A1A", marginBottom: 12 }}>
              Browse Our Collection
            </h1>
            <p style={{ fontSize: "1rem", color: "rgba(26,26,26,0.65)", maxWidth: 600, margin: "0 auto" }}>
              Buy, borrow, or exchange books from readers in your city. Every book finds its reader.
            </p>
          </div>

          {/* Search Bar */}
          <div style={{ maxWidth: 700, margin: "0 auto", position: "relative" }}>
            <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", fontSize: "1.2rem" }}>🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by title, author, or ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 px-lg-5 py-5">
        {/* Filters */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { key: "all", label: "All Books" },
              { key: "sell", label: "For Sale" },
              { key: "borrow", label: "For Borrow" },
              { key: "exchange", label: "For Exchange" }
            ].map(f => (
              <button
                key={f.key}
                className={`filter-btn ${filter === f.key ? "active" : ""}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{ padding: "8px 18px", borderRadius: 8, border: "2px solid #E0E0E0", fontSize: "0.85rem", fontWeight: 700, outline: "none", cursor: "pointer" }}
          >
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Results Count */}
        <div style={{ fontSize: "0.9rem", color: "#888", marginBottom: 20, fontWeight: 600 }}>
          Showing {filtered.length} {filtered.length === 1 ? "book" : "books"}
        </div>

        {/* Books Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "4rem", marginBottom: 16 }}>📚</div>
            <h3 style={{ fontFamily: "Playfair Display,serif", fontWeight: 900, color: "#1A1A1A", marginBottom: 8 }}>No books found</h3>
            <p style={{ color: "#888" }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map(book => (
              <div key={book.id} className="col-lg-3 col-md-4 col-sm-6">
                <div className="book-card" onClick={() => navigate(`/book/${book.id}`)}>
                  {/* Cover */}
                  <div style={{ height: 280, background: book.bg, position: "relative", overflow: "hidden" }}>
                    <BookCover isbn={book.isbn} bg={book.bg} />

                    {/* Discount Badge */}
                    {book.discount > 0 && (
                      <span style={{ position: "absolute", top: 12, left: 12, padding: "4px 12px", borderRadius: 6, background: "#EF4444", color: "#FFF", fontSize: "0.7rem", fontWeight: 800 }}>
                        {book.discount}% OFF
                      </span>
                    )}

                    {/* Stock Badge */}
                    {book.stock <= 2 && (
                      <span style={{ position: "absolute", top: 12, right: 12, padding: "4px 12px", borderRadius: 6, background: "#FFA500", color: "#FFF", fontSize: "0.7rem", fontWeight: 800 }}>
                        Only {book.stock} left
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: 16 }}>
                    <div style={{ fontFamily: "Playfair Display,serif", fontWeight: 900, fontSize: "1rem", color: "#1A1A1A", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {book.title}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#888", marginBottom: 8 }}>
                      by {book.author}
                    </div>

                    {/* Rating */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <span style={{ color: "#FFA500", fontSize: "0.85rem" }}>★</span>
                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1A1A1A" }}>{book.rating}</span>
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "#BBB" }}>({book.reviews})</span>
                    </div>

                    {/* Price */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <span style={{ fontFamily: "Playfair Display,serif", fontSize: "1.4rem", fontWeight: 900, color: "#1A1A1A" }}>
                        ₹{book.price}
                      </span>
                      {book.originalPrice && (
                        <span style={{ fontSize: "0.85rem", color: "#999", textDecoration: "line-through" }}>
                          ₹{book.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Location & Seller */}
                    <div style={{ fontSize: "0.75rem", color: "#888", marginBottom: 14 }}>
                      📍 {book.city} · by {book.seller}
                    </div>

                    {/* Buy Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/book/${book.id}`);
                      }}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: 8,
                        background: Y,
                        border: "2px solid #E0E000",
                        color: "#1A1A1A",
                        fontWeight: 800,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => (e.target.style.background = "#F5F500")}
                      onMouseLeave={(e) => (e.target.style.background = Y)}
                    >
                      {book.type === "borrow" ? "Borrow Now" : "Buy Now"} →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}