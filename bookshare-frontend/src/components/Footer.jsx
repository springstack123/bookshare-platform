const Y  = "#FEFF86";
const LB = "#B0DAFF";
const SB = "#B9E9FC";
const MB = "#DAF5FF";

const cols = [
  { title:"Platform", links:["Browse Books","Add a Book","How It Works","Pricing","Cities"],    color:Y  },
  { title:"Account",  links:["Register","Login","Dashboard","My Books","My Orders"],            color:LB },
  { title:"Support",  links:["Help Center","Contact Us","Privacy Policy","Terms","Sitemap"],    color:SB },
];

export default function Footer() {
  return (
    <footer style={{ background:"#1A1A1A" }}>
      <div className="container-fluid px-4 px-lg-5 py-5">

        {/* Top */}
        <div className="row g-5 pb-5" style={{ borderBottom:"1px solid rgba(255,255,255,0.08)" }}>

          {/* Brand */}
          <div className="col-lg-4 col-md-6">
            <a href="#" className="d-flex align-items-center gap-2 text-decoration-none mb-3">
              
              <div style={{ fontFamily:"Playfair Display,Georgia,serif", fontSize:"1.4rem", fontWeight:900, color:"#FFFFFF" }}>
                Book<span style={{ color:Y }}>Cycle</span>
              </div>
            </a>
            <p style={{ fontSize:"0.85rem", fontWeight:300, lineHeight:1.7, color:"rgba(255,255,255,0.45)", maxWidth:270, marginBottom:24 }}>
              India's community platform for borrowing, exchanging, and selling books. Give every book a second life.
            </p>

            {/* Socials */}
            <div className="d-flex gap-2">
              {[
                { s:"𝕏", bg:Y  },
                { s:"in", bg:LB },
                { s:"📸", bg:SB },
                { s:"▶",  bg:MB },
              ].map(({ s, bg }) => (
                <a key={s} href="#"
                  className="d-flex align-items-center justify-content-center rounded-2 text-decoration-none fw-bold"
                  style={{ width:38, height:38, background:"rgba(255,255,255,0.07)", border:"1.5px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.6)", fontSize:"0.85rem", transition:"all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = bg; e.currentTarget.style.color = "#1A1A1A"; e.currentTarget.style.borderColor = bg; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}>
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {cols.map(col => (
            <div key={col.title} className="col-lg-2 col-md-3 col-6">
              <div style={{ fontSize:"0.68rem", fontWeight:800, letterSpacing:"0.16em", textTransform:"uppercase", color:col.color, marginBottom:16 }}>
                {col.title}
              </div>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-decoration-none"
                      style={{ fontSize:"0.87rem", color:"rgba(255,255,255,0.45)", transition:"color 0.2s" }}
                      onMouseEnter={e => e.target.style.color = col.color}
                      onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.45)"}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="col-lg-2 col-md-6">
            <div style={{ fontSize:"0.68rem", fontWeight:800, letterSpacing:"0.16em", textTransform:"uppercase", color:MB, marginBottom:16 }}>
              Stay Updated
            </div>
            <p style={{ fontSize:"0.82rem", color:"rgba(255,255,255,0.38)", lineHeight:1.55, marginBottom:14 }}>
              Get notified when new books arrive near you.
            </p>
            <input type="email" placeholder="Your email"
              style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:"1.5px solid rgba(254,255,134,0.25)", background:"rgba(254,255,134,0.07)", color:"#FFFFFF", fontSize:"0.82rem", outline:"none", marginBottom:8, fontFamily:"DM Sans,sans-serif" }} />
            <button style={{ width:"100%", padding:"9px 0", borderRadius:8, background:Y, color:"#1A1A1A", border:"none", fontWeight:800, fontSize:"0.82rem", cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-4">
          <div style={{ fontSize:"0.76rem", color:"rgba(255,255,255,0.25)" }}>© 2025 BookCycle. All rights reserved.</div>
          <div style={{ fontSize:"0.76rem", color:"rgba(255,255,255,0.25)" }}>
            Built with <span style={{ color:Y }}>♥</span> for book lovers across India
          </div>
        </div>

      </div>
    </footer>
  );
}