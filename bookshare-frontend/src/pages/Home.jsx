import { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
/* ── palette ── */
const Y  = "#FEFF86";   /* yellow  */
const LB = "#B0DAFF";   /* light blue */
const SB = "#B9E9FC";   /* sky blue */
const MB = "#DAF5FF";   /* mint blue */

const BOOKS = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    price: "₹250",
    city: "Pune",
    type: "sell",
    image: "https://m.media-amazon.com/images/I/81wgcld4wxL.jpg"
  },
  {
    title: "Ikigai",
    author: "Héctor García",
    price: "Free",
    city: "Mumbai",
    type: "borrow",
    image: "https://m.media-amazon.com/images/I/71tbalAHYCL.jpg"
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    price: "₹150",
    city: "Nagpur",
    type: "sell",
    image: "https://m.media-amazon.com/images/I/71g2ednj0JL.jpg"
  }
];

const BTN_LABEL = {
  borrow:"Request",
  exchange:"Swap",
  sell:"Buy"
};


const TYPE_BADGE = {
  borrow:   { label:"Borrow",   bg:"#1A1A1A", color:Y   },
  exchange: { label:"Exchange", bg:"#1A1A1A", color:LB  },
  sell:     { label:"Buy",      bg:"#1A1A1A", color:Y   },
};

const FEATURES = [
  { icon:"🔍", title:"Smart Search & Filters",   desc:"Filter by author, category, city, price range, and listing type.", bg:Y  },
  { icon:"👤", title:"Personal Dashboard",       desc:"Track all your borrowed, exchanged, listed, and sold books.", bg:LB },
  { icon:"📍", title:"Location-Based Discovery", desc:"See books in your city first. Less shipping, more local joy.", bg:SB },
  { icon:"⭐", title:"Ratings & Reviews",         desc:"Community-driven trust system for both books and readers.", bg:MB },
];

const TESTIMONIALS = [
  { stars:5, text:"Borrowed 6 books in a month without spending a rupee. BookCycle is a dream for students!", name:"Priya Sharma",   loc:"Pune, Maharashtra",   avatar:"👩‍🎓", bg:Y  },
  { stars:5, text:"Sold 12 old engineering books. Made ₹1,400 and cleared shelf space. Amazing platform!",   name:"Rahul Deshmukh", loc:"Mumbai, Maharashtra", avatar:"👨‍💻", bg:LB },
  { stars:4, text:"Exchange system is brilliant. Gave away mystery novels and discovered amazing classics.",  name:"Sneha Patil",    loc:"Nagpur, Maharashtra", avatar:"👩‍🏫", bg:SB },
];

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

body { font-family:'DM Sans',sans-serif; background:#FAFEFF; }

.section-label {
  display:inline-block;
  padding:4px 16px; border-radius:100px;
  font-size:0.67rem; font-weight:800;
  letter-spacing:0.18em; text-transform:uppercase;
  color:#1A1A1A; margin-bottom:12px;
}

.how-card {
  background:#FFFFFF; border-radius:18px;
  padding:32px 28px; border:2px solid #EEEEEE;
  transition:all 0.25s; cursor:default; height:100%;
  position:relative; overflow:hidden;
}
.how-card:hover { transform:translateY(-6px); box-shadow:0 16px 40px rgba(0,0,0,0.08); }

.book-card-grid {
  background:#FFFFFF; border-radius:14px;
  overflow:hidden; border:1.5px solid #EEEEEE;
  transition:all 0.25s; cursor:pointer; height:100%;
}
.book-card-grid:hover { transform:translateY(-5px); box-shadow:0 14px 36px rgba(0,0,0,0.1); border-color:#1A1A1A; }

.filter-btn {
  padding:8px 20px; border-radius:100px;
  font-size:0.82rem; font-weight:700;
  cursor:pointer; border:2px solid #E0E0E0;
  background:#FFFFFF; color:#555;
  font-family:'DM Sans',sans-serif;
  transition:all 0.2s;
}
.filter-btn.active, .filter-btn:hover {
  background:#1A1A1A; color:#FEFF86; border-color:#1A1A1A;
}

.feature-item {
  display:flex; gap:16px; align-items:flex-start;
  padding:20px; border-radius:14px;
  border:2px solid #EEEEEE; background:#FFFFFF;
  transition:all 0.22s; cursor:default;
}
.feature-item:hover { border-color:#1A1A1A; box-shadow:0 8px 24px rgba(0,0,0,0.07); }

.test-card {
  background:#FFFFFF; border-radius:18px;
  padding:28px; border:2px solid #EEEEEE;
  transition:all 0.25s; height:100%;
}
.test-card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(0,0,0,0.08); }

.stat-box {
  border-radius:14px; padding:20px;
  border:2px solid rgba(0,0,0,0.06);
}

.cta-btn-main {
  padding:14px 40px; border-radius:10px;
  background:#1A1A1A; color:#FEFF86;
  font-family:'DM Sans',sans-serif;
  font-size:0.95rem; font-weight:800;
  border:none; cursor:pointer;
  text-decoration:none; display:inline-block;
  transition:all 0.2s; letter-spacing:0.02em;
}
.cta-btn-main:hover { background:#333; transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.2); color:#FEFF86; }

.cta-btn-outline {
  padding:13px 32px; border-radius:10px;
  background:transparent; color:#1A1A1A;
  font-family:'DM Sans',sans-serif;
  font-size:0.95rem; font-weight:700;
  border:2px solid #1A1A1A; cursor:pointer;
  text-decoration:none; display:inline-block;
  transition:all 0.2s;
}
.cta-btn-outline:hover { background:#1A1A1A; color:#FEFF86; }
`;

function SectionLabel({ text, bg }) {
  return <div className="section-label" style={{ background: bg || Y }}>{text}</div>;
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("all");
  const filtered = activeFilter === "all" ? BOOKS : BOOKS.filter(b => b.type === activeFilter);
const [selectedBook,setSelectedBook] = useState(null);
const navigate = useNavigate();
  const [showAddressForm,setShowAddressForm] = useState(false);
  return (
    <>
      <style>{STYLE}</style>

      {/* ════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════ */}
      <section style={{ background: "#e4ebec", padding: "88px 0" }}>
        <div className="container-fluid px-4 px-lg-5">
          <div className="text-center mb-5">
            <SectionLabel text="How It Works" bg={Y} />
            <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:"clamp(1.9rem,4vw,2.9rem)", fontWeight:900, color:"#1A1A1A", letterSpacing:"-0.02em", marginBottom:8 }}>
              Three Ways to Share Books
            </h2>
            <p style={{ color:"#666", lineHeight:1.7, maxWidth:500, margin:"0 auto" }}>
              Whether you want to borrow, exchange, or sell — BookCycle connects readers in your city.
            </p>
          </div>

          <div className="row g-4">
            {[
              { num:"01", icon:"bi bi-bag-heart", title:"Take a Book",  desc:"Browse books near you, request to borrow and return after reading. Knowledge is free to share.", tag:"Free Borrow", bg:Y,  tagBg:"#1A1A1A", tagColor:Y  },
              { num:"02", icon:"bi bi-arrow-repeat", title:"Leave a Book", desc:"Done reading? Upload your book for others. Exchange it for something you haven't read yet.",  tag:"Exchange",    bg:LB, tagBg:"#1A1A1A", tagColor:LB },
              { num:"03", icon:"bi bi-cash-coin", title:"Sell a Book",  desc:"Turn your old books into cash. Set your price, find a buyer nearby, and transact safely.",    tag:"Earn Money",  bg:SB, tagBg:"#1A1A1A", tagColor:SB },
            ].map(c => (
              <div key={c.num} className="col-md-4">
                <div className="how-card">
                  {/* bg number */}
                  <div style={{ position:"absolute", top:-14, right:16, fontFamily:"Playfair Display,serif", fontSize:"5.5rem", fontWeight:900, color:"#1A1A1A", opacity:0.04, lineHeight:1 }}>{c.num}</div>
                  {/* icon */}
                 <div style={{ fontSize:"2.2rem", marginBottom:18 }}>
  <i className={c.icon}></i>
</div>
                  <h5 style={{ fontFamily:"Playfair Display,serif", fontSize:"1.1rem", fontWeight:900, color:"#1A1A1A", marginBottom:8 }}>{c.title}</h5>
                  <p style={{ fontSize:"0.87rem", color:"#666", lineHeight:1.65, marginBottom:18 }}>{c.desc}</p>
                  <span style={{ padding:"5px 16px", borderRadius:100, fontSize:"0.7rem", fontWeight:800, background:c.tagBg, color:c.tagColor, letterSpacing:"0.06em" }}>{c.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

     {/* ================= BROWSE BOOKS ================= */}

<section style={{background:"#ffffff",padding:"70px 0"}}>

<div className="container">

<div className="text-center mb-5">
<h2 className="fw-bold">Browse Books</h2>
<p>Discover books shared by readers near you</p>
</div>

<div className="row g-4">

{BOOKS.map((book,i)=>(
<div key={i} className="col-6 col-md-4 col-lg-3">

<div className="card h-100 shadow-sm border-0">

<img
src={book.image}
alt={book.title}
className="card-img-top"
style={{height:"220px",objectFit:"cover"}}
/>

<div className="card-body">

<h6 className="fw-bold">{book.title}</h6>

<small className="text-muted">
{book.author}
</small>

<div className="mt-2 fw-semibold">
{book.price}
</div>

<small className="text-muted d-block">
📍 {book.city}
</small>

<button
className="btn btn-sm mt-3 w-100"
style={{background:Y,fontWeight:"600"}}
onClick={() => navigate("/book/1")}
>
{BTN_LABEL[book.type]}
</button>

</div>
</div>

</div>
))}

</div>

</div>
</section>


{/* ================= BOOK DETAILS MODAL ================= */}

{selectedBook && (

<div
onClick={()=>setSelectedBook(null)}
style={{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"rgba(0,0,0,0.5)",
display:"flex",
alignItems:"center",
justifyContent:"center",
zIndex:999
}}
>

<div
onClick={(e)=>e.stopPropagation()}
style={{
background:"#fff",
width:"90%",
maxWidth:"600px",
borderRadius:"10px",
padding:"30px",
position:"relative"
}}
>

<button
onClick={()=>setSelectedBook(null)}
style={{
position:"absolute",
top:"10px",
right:"15px",
border:"none",
background:"none",
fontSize:"20px",
cursor:"pointer"
}}
>
✖
</button>

<img
src={selectedBook.image}
alt={selectedBook.title}
style={{
width:"100%",
height:"250px",
objectFit:"cover",
borderRadius:"8px"
}}
/>

<h3 className="mt-3">{selectedBook.title}</h3>

<p className="text-muted">
by {selectedBook.author}
</p>

<p><strong>Price:</strong> {selectedBook.price}</p>

<p><strong>City:</strong> {selectedBook.city}</p>

<button
className="btn w-100 mt-3"
style={{background:Y,fontWeight:"600"}}
onClick={()=>{
setShowAddressForm(true)
}}
>
Buy Now
</button>

</div>

</div>

)}


{/* ================= ADDRESS FORM ================= */}

{showAddressForm && (

<div
onClick={()=>setShowAddressForm(false)}
style={{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"rgba(0,0,0,0.5)",
display:"flex",
alignItems:"center",
justifyContent:"center",
zIndex:999
}}
>

<div
onClick={(e)=>e.stopPropagation()}
style={{
background:"#fff",
width:"90%",
maxWidth:"500px",
borderRadius:"10px",
padding:"30px"
}}
>

<h4 className="mb-4">Shipping Address</h4>

<form>

<input
type="text"
placeholder="Full Name"
className="form-control mb-3"
/>

<input
type="text"
placeholder="Phone Number"
className="form-control mb-3"
/>

<input
type="text"
placeholder="City"
className="form-control mb-3"
/>

<input
type="text"
placeholder="State"
className="form-control mb-3"
/>

<textarea
placeholder="Full Address"
className="form-control mb-3"
/>

<button
type="submit"
className="btn w-100"
style={{background:Y,fontWeight:"600"}}
>
Place Order
</button>

</form>

</div>

</div>

)}
      <section id="about" style={{ background: "#f5f5f5", padding: "80px 0" }}>
      <div className="container">
        <div className="row align-items-center">

          {/* LEFT CONTENT */}
          <div className="col-lg-6">

            <h1
              style={{
                color: "#2da44e",
                fontWeight: "700",
                fontSize: "44px",
                lineHeight: "1.2"
              }}
            >
              Uncover the Stories, <br />
              Embrace the Journeys.
            </h1>

            <p
              style={{
                marginTop: "20px",
                color: "#555",
                fontSize: "16px",
                lineHeight: "1.7"
              }}
            >
              Welcome to Simplysellbooks and UsedBookr, where the pages of the
              past become the stories of the present. At Usedbookr and
              Simplysellbooks, we believe in the magic of every book and the
              countless adventures they hold. Our platform is not just about
              buying and selling books; it's about connecting readers,
              celebrating diversity in literature, and fostering stories that
              stand the test of time.
            </p>

            <p style={{ color: "#555", marginTop: "10px" }}>
              To sell now click below, or to check out our APP, scroll to the
              bottom.
            </p>

            {/* BUTTONS */}
            <div className="mt-4 d-flex gap-3">

              <button
                className="btn"
                style={{
                  background: "#f4c430",
                  color: "#000",
                  fontWeight: "600",
                  padding: "10px 24px",
                  borderRadius: "30px"
                }}
              >
                SELL NOW
              </button>

              <button
                className="btn"
                style={{
                  background: "#0d47a1",
                  color: "#fff",
                  fontWeight: "600",
                  padding: "10px 24px",
                  borderRadius: "30px"
                }}
              >
                BUY BOOKS
              </button>

            </div>

          </div>

          {/* RIGHT IMAGE */}
          <div className="col-lg-6 text-center">

            <img
              src="https://simplysellbooks.in/assets/images/journey.png"
              alt="Books Journey"
              className="img-fluid"
              style={{ maxWidth: "90%" }}
            />

          </div>

        </div>
      </div>
    </section>
      {/* ════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════ */}
      <section style={{ background:"#FFFFFF", padding:"88px 0", borderTop:"1.5px solid #EEE", borderBottom:"1.5px solid #EEE" }}>
        <div className="container-fluid px-4 px-lg-5">
          <div className="text-center mb-5">
            <SectionLabel text="Community" bg={MB} />
            <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:"clamp(1.9rem,4vw,2.9rem)", fontWeight:900, color:"#1A1A1A", letterSpacing:"-0.02em", marginBottom:8 }}>
              What Readers Say
            </h2>
            <p style={{ color:"#666", lineHeight:1.7, maxWidth:460, margin:"0 auto" }}>
              Join thousands of book lovers across India already using BookCycle.
            </p>
          </div>

          <div className="row g-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="col-md-4">
                <div className="test-card">
                  {/* Colored top strip */}
                  <div style={{ height:5, background:t.bg, borderRadius:"100px 100px 0 0", margin:"-28px -28px 20px" }} />
                  <div style={{ color:"#FFB700", fontSize:"0.95rem", letterSpacing:2, marginBottom:12 }}>
                    {"★".repeat(t.stars)}<span style={{ color:"#E0E0E0" }}>{"★".repeat(5-t.stars)}</span>
                  </div>
                  <p style={{ fontFamily:"Playfair Display,serif", fontStyle:"italic", fontSize:"0.97rem", lineHeight:1.7, color:"#444", marginBottom:20 }}>
                    "{t.text}"
                  </p>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ width:44, height:44, borderRadius:"50%", background:t.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.4rem", flexShrink:0, border:"2px solid rgba(0,0,0,0.07)" }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight:800, fontSize:"0.88rem", color:"#1A1A1A" }}>{t.name}</div>
                      <div style={{ fontSize:"0.72rem", color:"#AAAAAA" }}>{t.loc}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          CTA BANNER
      ════════════════════════════════ */}
      <section style={{ background:`linear-gradient(135deg, ${Y} 0%, ${LB} 50%, ${SB} 100%)`, padding:"90px 5%", textAlign:"center" }}>
        <div className="container">
          <div style={{ fontSize:"0.68rem", fontWeight:800, letterSpacing:"0.2em", textTransform:"uppercase", color:"#555", marginBottom:12 }}>
            Join the Community
          </div>
          <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:"clamp(2rem,4.5vw,3.2rem)", fontWeight:900, color:"#1A1A1A", lineHeight:1.1, letterSpacing:"-0.02em", marginBottom:14 }}>
            Ready to Start Your<br />
            <em style={{ borderBottom:"4px solid #1A1A1A" }}>Reading Journey?</em>
          </h2>
          <p style={{ color:"#444", lineHeight:1.65, maxWidth:460, margin:"0 auto 36px", fontSize:"1rem" }}>
            Join 1,800+ readers across India. List your first book in under 2 minutes — completely free.
          </p>
          <div className="d-flex justify-content-center flex-wrap gap-3">
            <a href="/auth" className="cta-btn-main">Create Free Account</a>
            <a href="#browse" className="cta-btn-outline">Browse Books First</a>
          </div>
        </div>
      </section>
    </>
  );
}