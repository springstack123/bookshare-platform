import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Y  = "#FEFF86";
const LB = "#B0DAFF";
const SB = "#B9E9FC";
const MB = "#DAF5FF";

/* ─── Mock Data with localStorage support ─── */
const DEFAULT_USER = {
  name: "Rahul Deshmukh", 
  username: "@rahul.reads",
  email: "rahul.d@gmail.com", 
  phone: "+91 98765 43210",
  city: "Mumbai, Maharashtra", 
  joined: "January 2023",
  bio: "Avid reader & book lover. Sharing books since 2023. Loves self-help, tech & fiction.",
  avatar: "👨‍💻", 
  verified: true,
  stats: { listed:12, borrowed:8, sold:6, exchanged:4, rating:4.8, reviews:18 },
  badges: [
    { icon:"🏆", label:"Top Lister",     bg: Y  },
    { icon:"🤝", label:"Trusted Trader", bg: LB },
    { icon:"⭐", label:"5-Star Reader",   bg: SB },
    { icon:"♻️", label:"Book Champion",  bg: MB },
  ],
};

const MY_BOOKS = [
  { id:1, isbn:"9780735224292", title:"Atomic Habits",     author:"James Clear",   type:"borrow",   price:"Free", status:"available", views:142, requests:3, bg:Y  },
  { id:2, isbn:"9780062315007", title:"The Alchemist",     author:"Paulo Coelho",  type:"sell",     price:"₹150", status:"available", views:98,  requests:1, bg:LB },
  { id:3, isbn:"9781455586691", title:"Deep Work",         author:"Cal Newport",   type:"exchange", price:"Swap", status:"pending",   views:76,  requests:2, bg:SB },
  { id:4, isbn:"9781612680194", title:"Rich Dad Poor Dad", author:"R. Kiyosaki",   type:"sell",     price:"₹80",  status:"sold",      views:210, requests:0, bg:MB },
];

const ORDERS = [
  { id:"#BC1042", book:"Ikigai",        author:"Héctor García",    type:"borrow",   status:"active",    date:"12 Feb 2025", price:"Free",  bg:Y  },
  { id:"#BC0981", book:"Zero to One",   author:"Peter Thiel",      type:"sell",     status:"completed", date:"28 Jan 2025", price:"₹120",  bg:LB },
  { id:"#BC0875", book:"Sapiens",       author:"Y. N. Harari",     type:"exchange", status:"completed", date:"05 Jan 2025", price:"Swap",  bg:SB },
  { id:"#BC0764", book:"Wings of Fire", author:"A.P.J.Abdul Kalam",type:"borrow",   status:"returned",  date:"18 Dec 2024", price:"Free",  bg:MB },
];

const WISHLIST = [
  { isbn:"9780525559474", title:"Ikigai",           author:"Héctor García", type:"borrow",  price:"Free",  city:"Pimpri",  bg:Y  },
  { isbn:"9780307951526", title:"The Lean Startup", author:"Eric Ries",     type:"sell",    price:"₹110",  city:"Pune",    bg:LB },
  { isbn:"9780062457714", title:"Sapiens",          author:"Y.N. Harari",   type:"exchange",price:"Swap",  city:"Mumbai",  bg:SB },
];

const STATUS = {
  available: { label:"Available", dot:"#22C55E", bg:"#DCFCE7", color:"#15803D" },
  pending:   { label:"Pending",   dot:"#EAB308", bg:"#FEF9C3", color:"#A16207" },
  sold:      { label:"Sold",      dot:"#9CA3AF", bg:"#F3F4F6", color:"#4B5563" },
  active:    { label:"Active",    dot:"#38BDF8", bg:"#E0F7FF", color:"#0369A1" },
  completed: { label:"Completed", dot:"#22C55E", bg:"#DCFCE7", color:"#15803D" },
  returned:  { label:"Returned",  dot:"#818CF8", bg:"#EEF2FF", color:"#4338CA" },
};
const TYPE_CFG = {
  borrow:   { label:"📥 Borrow",   bg:"#1A1A1A", color:Y  },
  exchange: { label:"📤 Exchange", bg:"#1A1A1A", color:LB },
  sell:     { label:"💰 Buy",      bg:"#1A1A1A", color:Y  },
};

/* ─── Styles ─── */
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;}
body{font-family:'DM Sans',sans-serif;background:#FAFEFF;margin:0;}

@keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
.fu{animation:fadeUp .4s ease both;}
.fu2{animation:fadeUp .4s .08s ease both;}
.fu3{animation:fadeUp .4s .16s ease both;}
.fu4{animation:fadeUp .4s .24s ease both;}

@keyframes shimmer{0%{background-position:-1000px 0;}100%{background-position:1000px 0;}}
.skeleton{background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:1000px 100%;animation:shimmer 2s infinite;}

.prof-tab{
  display:flex;align-items:center;gap:8px;
  padding:11px 20px;border-radius:10px;
  font-family:'DM Sans',sans-serif;font-size:.86rem;font-weight:700;
  border:2px solid transparent;background:transparent;color:#666;
  cursor:pointer;transition:all .2s;white-space:nowrap;
}
.prof-tab:hover{background:#F0F0F0;color:#1A1A1A;}
.prof-tab.on{background:#1A1A1A;color:#FEFF86;border-color:#1A1A1A;}

.row-card{background:#FFFFFF;border-radius:14px;border:2px solid #EEEEEE;overflow:hidden;transition:all .22s;}
.row-card:hover{border-color:#1A1A1A;box-shadow:0 8px 24px rgba(0,0,0,.08);}

.wish-card{background:#FFFFFF;border-radius:14px;border:2px solid #EEEEEE;overflow:hidden;transition:all .25s;cursor:pointer;}
.wish-card:hover{transform:translateY(-5px);box-shadow:0 14px 36px rgba(0,0,0,.1);border-color:#1A1A1A;}

.btn-y{padding:9px 22px;border-radius:9px;background:#FEFF86;color:#1A1A1A;border:2px solid #E0E000;font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:800;cursor:pointer;transition:all .2s;}
.btn-y:hover{background:#F5F500;transform:translateY(-1px);box-shadow:0 4px 12px rgba(254,255,134,.5);}

.btn-dk{padding:9px 22px;border-radius:9px;background:#1A1A1A;color:#FEFF86;border:2px solid #1A1A1A;font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:800;cursor:pointer;transition:all .2s;}
.btn-dk:hover{background:#333;transform:translateY(-1px);}

.btn-ol{padding:8px 18px;border-radius:9px;background:transparent;color:#1A1A1A;border:2px solid #DDDDDD;font-family:'DM Sans',sans-serif;font-size:.8rem;font-weight:700;cursor:pointer;transition:all .2s;}
.btn-ol:hover{border-color:#1A1A1A;}

.btn-danger{padding:9px 22px;border-radius:9px;background:#EF4444;color:#FFF;border:2px solid #DC2626;font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:800;cursor:pointer;transition:all .2s;}
.btn-danger:hover{background:#DC2626;transform:translateY(-1px);}

.field-label{font-size:.7rem;font-weight:800;color:#888;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;display:block;}
.field-input{width:100%;padding:12px 14px;border:2px solid #E0E0E0;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:.9rem;color:#1A1A1A;background:#FFFFFF;outline:none;transition:border-color .2s,box-shadow .2s;}
.field-input:focus{border-color:#1A1A1A;box-shadow:0 0 0 3px rgba(254,255,134,.35);}
.field-input::placeholder{color:#BBBBBB;}

::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:#FAFEFF;}
::-webkit-scrollbar-thumb{background:#FEFF86;border-radius:3px;}

.avatar-upload{position:relative;cursor:pointer;group;}
.avatar-upload:hover .avatar-overlay{opacity:1;}
.avatar-overlay{position:absolute;inset:0;background:rgba(0,0,0,.6);border-radius:24px;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s;color:#FFF;font-size:.75rem;font-weight:700;}
`;

/* ─── Tiny book cover ─── */
function Cover({ isbn, bg, w = 72, h = 96 }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{ width:w, height:h, flexShrink:0, background:bg, borderRadius:8, overflow:"hidden" }}>
      {!err && <img src={`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`} alt=""
        onError={() => setErr(true)} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />}
      {err && <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.6rem" }}>📖</div>}
    </div>
  );
}

/* ─── Status badge ─── */
function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.available;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 11px", borderRadius:100, fontSize:".62rem", fontWeight:800, background:s.bg, color:s.color }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:s.dot, display:"inline-block" }} />
      {s.label}
    </span>
  );
}

/* ─── Type badge ─── */
function TypeBadge({ type }) {
  const t = TYPE_CFG[type];
  return <span style={{ padding:"3px 10px", borderRadius:100, fontSize:".6rem", fontWeight:800, background:t.bg, color:t.color }}>{t.label}</span>;
}

/* ════════════════════════════════
   TAB 1 — My Books
════════════════════════════════ */
function BooksTab() {
  const [f, setF] = useState("all");
  const shown = f === "all" ? MY_BOOKS : MY_BOOKS.filter(b => b.status === f);

  return (
    <div className="fu">
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {["all","available","pending","sold"].map(k => (
          <button key={k} className={f===k ? "btn-dk":"btn-ol"} style={{ padding:"7px 16px", fontSize:".78rem" }} onClick={() => setF(k)}>
            {k==="all"?"All":k.charAt(0).toUpperCase()+k.slice(1)}
          </button>
        ))}
        <button className="btn-y" style={{ marginLeft:"auto" }}>+ Add Book</button>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {shown.length === 0 && (
          <div style={{ textAlign:"center", padding:"48px 0" }}>
            <div style={{ fontSize:"3rem", marginBottom:10 }}>📭</div>
            <div style={{ fontFamily:"Playfair Display,serif", fontWeight:900, color:"#1A1A1A" }}>No books here</div>
          </div>
        )}
        {shown.map(b => (
          <div key={b.id} className="row-card" style={{ display:"flex", alignItems:"stretch" }}>
            <Cover isbn={b.isbn} bg={b.bg} w={72} h={96} />
            <div style={{ flex:1, padding:"14px 18px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, flexWrap:"wrap" }}>
                <div>
                  <div style={{ fontFamily:"Playfair Display,serif", fontWeight:900, fontSize:".98rem", color:"#1A1A1A", marginBottom:2 }}>{b.title}</div>
                  <div style={{ fontSize:".74rem", color:"#888" }}>{b.author}</div>
                </div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  <TypeBadge type={b.type} />
                  <StatusBadge status={b.status} />
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginTop:10, flexWrap:"wrap" }}>
                <span style={{ fontFamily:"Playfair Display,serif", fontWeight:900, fontSize:".95rem", color:"#1A1A1A" }}>{b.price}</span>
                <span style={{ fontSize:".72rem", color:"#AAA" }}>👁 {b.views} views</span>
                <span style={{ fontSize:".72rem", color:"#AAA" }}>📩 {b.requests} requests</span>
                <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
                  <button className="btn-ol" style={{ padding:"6px 14px", fontSize:".75rem" }}>✏️ Edit</button>
                  {b.status !== "sold" && <button className="btn-y" style={{ padding:"6px 14px", fontSize:".75rem" }}>Manage</button>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════
   TAB 2 — Orders
════════════════════════════════ */
function OrdersTab() {
  return (
    <div className="fu" style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {ORDERS.map(o => (
        <div key={o.id} className="row-card" style={{ padding:"16px 20px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
            <div style={{ width:46, height:46, borderRadius:12, background:o.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem", flexShrink:0, border:"1.5px solid rgba(0,0,0,.07)" }}>
              📦
            </div>
            <div style={{ flex:1, minWidth:180 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3, flexWrap:"wrap" }}>
                <span style={{ fontFamily:"Playfair Display,serif", fontWeight:900, fontSize:".97rem", color:"#1A1A1A" }}>{o.book}</span>
                <span style={{ fontSize:".68rem", color:"#BBB", fontWeight:600 }}>{o.id}</span>
              </div>
              <div style={{ fontSize:".74rem", color:"#888" }}>{o.author} · {o.date}</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
              <TypeBadge type={o.type} />
              <StatusBadge status={o.status} />
              <span style={{ fontFamily:"Playfair Display,serif", fontWeight:900, fontSize:".95rem", color:"#1A1A1A", minWidth:48, textAlign:"right" }}>{o.price}</span>
              <button className="btn-ol" style={{ padding:"6px 14px", fontSize:".75rem" }}>View</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════
   TAB 3 — Wishlist
════════════════════════════════ */
function WishlistTab() {
  const [list, setList] = useState(WISHLIST);

  if (list.length === 0)
    return (
      <div className="fu" style={{ textAlign:"center", padding:"64px 0" }}>
        <div style={{ fontSize:"3.5rem", marginBottom:14 }}>🔖</div>
        <div style={{ fontFamily:"Playfair Display,serif", fontWeight:900, fontSize:"1.2rem", color:"#1A1A1A", marginBottom:8 }}>Your wishlist is empty</div>
        <a href="/books" style={{ display:"inline-block", padding:"10px 28px", borderRadius:10, background:Y, color:"#1A1A1A", border:"2px solid #E0E000", fontWeight:800, textDecoration:"none", fontSize:".86rem" }}>Browse Books →</a>
      </div>
    );

  return (
    <div className="fu">
      <div className="row g-3">
        {list.map((b, i) => (
          <div key={i} className="col-md-4 col-sm-6">
            <div className="wish-card">
                {/* Cover */}
              <div style={{ height:170, background:b.bg, position:"relative", overflow:"hidden" }}>
                <WCover isbn={b.isbn} bg={b.bg} />
                <button onClick={() => setList(l => l.filter((_,j)=>j!==i))}
                  style={{ position:"absolute", top:10, right:10, width:28, height:28, borderRadius:7, border:"none", background:"rgba(255,255,255,.9)", cursor:"pointer", fontSize:".75rem", fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                <span style={{ position:"absolute", bottom:10, left:10 }}><TypeBadge type={b.type} /></span>
              </div>
              <div style={{ padding:"14px 16px" }}>
                <div style={{ fontFamily:"Playfair Display,serif", fontWeight:900, fontSize:".95rem", color:"#1A1A1A", marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{b.title}</div>
                <div style={{ fontSize:".73rem", color:"#888", marginBottom:12 }}>{b.author}</div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div>
                    <div style={{ fontFamily:"Playfair Display,serif", fontWeight:900, fontSize:".95rem", color:"#1A1A1A" }}>{b.price}</div>
                    <div style={{ fontSize:".65rem", color:"#AAA" }}>📍 {b.city}</div>
                  </div>
                  <button className="btn-y" style={{ padding:"7px 14px", fontSize:".75rem" }}>Request</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WCover({ isbn, bg }) {
  const [err, setErr] = useState(false);
  if (err) return <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2.5rem" }}>📖</div>;
  return <img src={`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`} alt="" onError={() => setErr(true)}
    style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />;
}

/* ════════════════════════════════
   TAB 4 — Edit Profile
════════════════════════════════ */
function EditTab({ user, onUpdate }) {
  const [form, setForm] = useState({ 
    name: user.name, 
    email: user.email, 
    phone: user.phone, 
    city: user.city, 
    bio: user.bio,
    avatar: user.avatar
  });
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function save(e) { 
    e.preventDefault(); 
    onUpdate(form);
    setSaved(true); 
    setTimeout(()=>setSaved(false),2500); 
  }
  
  const up = (k,v) => setForm(p=>({...p,[k]:v}));

  const handleAvatarChange = () => {
    const emojis = ["👨‍💻","👩‍💻","🧑‍🎓","👨‍🎓","👩‍🎓","🧑‍💼","👨‍💼","👩‍💼","😊","🤓","😎","🥸","🤩","🧐","🤗"];
    const current = form.avatar;
    let newAvatar = current;
    while (newAvatar === current) {
      newAvatar = emojis[Math.floor(Math.random() * emojis.length)];
    }
    up("avatar", newAvatar);
  };

  return (
    <form className="fu" onSubmit={save}>

      {/* Avatar Selection */}
      <div style={{ background:"#FFFFFF", borderRadius:18, border:"2px solid #EEEEEE", overflow:"hidden", marginBottom:20 }}>
        <div style={{ padding:"18px 24px", borderBottom:"1.5px solid #F0F0F0", background:Y+"44" }}>
          <div style={{ fontFamily:"Playfair Display,serif", fontWeight:900, fontSize:"1rem", color:"#1A1A1A" }}>Profile Picture</div>
          <div style={{ fontSize:".74rem", color:"#888" }}>Click to change your avatar</div>
        </div>
        <div style={{ padding:"24px", display:"flex", alignItems:"center", gap:20 }}>
          <div className="avatar-upload" onClick={handleAvatarChange}>
            <div style={{ width:100, height:100, borderRadius:24, background:Y, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"3rem", border:"3px solid #E0E000", cursor:"pointer" }}>
              {form.avatar}
            </div>
            <div className="avatar-overlay">
              📷 Change
            </div>
          </div>
          <div>
            <div style={{ fontWeight:700, color:"#1A1A1A", marginBottom:4 }}>Choose your avatar</div>
            <div style={{ fontSize:".8rem", color:"#888" }}>Click on the emoji to cycle through options</div>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div style={{ background:"#FFFFFF", borderRadius:18, border:"2px solid #EEEEEE", overflow:"hidden", marginBottom:20 }}>
        <div style={{ padding:"18px 24px", borderBottom:"1.5px solid #F0F0F0", background:LB+"44" }}>
          <div style={{ fontFamily:"Playfair Display,serif", fontWeight:900, fontSize:"1rem", color:"#1A1A1A" }}>Personal Information</div>
          <div style={{ fontSize:".74rem", color:"#888" }}>Update your profile details</div>
        </div>
        <div style={{ padding:"24px" }}>
          <div className="row g-3">
            {[
              {k:"name",  label:"Full Name",     type:"text",  ph:"Your name", required:true },
              {k:"email", label:"Email Address", type:"email", ph:"email@example.com", required:true },
              {k:"phone", label:"Phone Number",  type:"tel",   ph:"+91 XXXXX XXXXX", required:true },
              {k:"city",  label:"City",          type:"text",  ph:"City, State", required:true },
            ].map(f=>(
              <div key={f.k} className="col-md-6">
                <label className="field-label">{f.label}</label>
                <input type={f.type} className="field-input" placeholder={f.ph} value={form[f.k]} onChange={e=>up(f.k,e.target.value)} required={f.required} />
              </div>
            ))}
            <div className="col-12">
              <label className="field-label">Bio</label>
              <textarea className="field-input" rows={3} placeholder="Tell readers about yourself..." value={form.bio} onChange={e=>up("bio",e.target.value)} style={{ resize:"vertical", minHeight:88 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Password */}
      <div style={{ background:"#FFFFFF", borderRadius:18, border:"2px solid #EEEEEE", overflow:"hidden", marginBottom:20 }}>
        <div style={{ padding:"18px 24px", borderBottom:"1.5px solid #F0F0F0", background:SB+"44" }}>
          <div style={{ fontFamily:"Playfair Display,serif", fontWeight:900, fontSize:"1rem", color:"#1A1A1A" }}>Change Password</div>
          <div style={{ fontSize:".74rem", color:"#888" }}>Leave blank to keep current password</div>
        </div>
        <div style={{ padding:"24px" }}>
          <div className="row g-3">
            {["Current Password","New Password","Confirm Password"].map(l=>(
              <div key={l} className="col-md-4">
                <label className="field-label">{l}</label>
                <input type="password" className="field-input" placeholder="••••••••" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div style={{ background:"#FFFFFF", borderRadius:18, border:"2px solid #EEEEEE", overflow:"hidden", marginBottom:20 }}>
        <div style={{ padding:"18px 24px", borderBottom:"1.5px solid #F0F0F0", background:MB+"44" }}>
          <div style={{ fontFamily:"Playfair Display,serif", fontWeight:900, fontSize:"1rem", color:"#1A1A1A" }}>Notifications</div>
        </div>
        <div style={{ padding:"8px 24px 16px" }}>
          {[
            { label:"Book request alerts",        sub:"When someone requests your book",       on:true  },
            { label:"New books in your city",      sub:"Fresh listings near you",              on:true  },
            { label:"Promotional updates",         sub:"News, tips & special offers",          on:false },
          ].map((n,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0", borderBottom:i<2?"1px solid #F5F5F5":"none" }}>
              <div>
                <div style={{ fontSize:".87rem", fontWeight:700, color:"#1A1A1A" }}>{n.label}</div>
                <div style={{ fontSize:".73rem", color:"#888", marginTop:1 }}>{n.sub}</div>
              </div>
              <div style={{ position:"relative", width:44, height:24, cursor:"pointer", flexShrink:0 }}>
                <input type="checkbox" defaultChecked={n.on} style={{ opacity:0, width:0, height:0 }} />
                <div style={{ position:"absolute", inset:0, background:n.on?"#1A1A1A":"#DDD", borderRadius:24, transition:".3s" }}>
                  <div style={{ position:"absolute", width:18, height:18, borderRadius:"50%", background:"#FFF", top:3, left:n.on?23:3, transition:".3s" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Actions */}
      <div style={{ background:"#FFFFFF", borderRadius:18, border:"2px solid #FFEBEE", overflow:"hidden", marginBottom:28 }}>
        <div style={{ padding:"18px 24px", borderBottom:"1.5px solid #FFCDD2", background:"#FFEBEE" }}>
          <div style={{ fontFamily:"Playfair Display,serif", fontWeight:900, fontSize:"1rem", color:"#C62828" }}>Danger Zone</div>
          <div style={{ fontSize:".74rem", color:"#E53935" }}>Irreversible actions</div>
        </div>
        <div style={{ padding:"24px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ fontWeight:700, color:"#1A1A1A", marginBottom:2 }}>Delete Account</div>
              <div style={{ fontSize:".8rem", color:"#888" }}>Permanently delete your account and all data</div>
            </div>
            <button type="button" className="btn-danger" onClick={() => setShowDeleteConfirm(true)}>
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
        <button type="submit" className="btn-dk" style={{ padding:"12px 36px", fontSize:".9rem" }}>
          {saved ? "✓ Saved!" : "Save Changes"}
        </button>
        <button type="button" className="btn-ol" style={{ padding:"11px 24px", fontSize:".9rem" }} onClick={() => window.location.reload()}>Cancel</button>
        {saved && <span style={{ fontSize:".82rem", color:"#22C55E", fontWeight:700 }}>Profile updated successfully!</span>}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <>
          <div onClick={() => setShowDeleteConfirm(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:999, backdropFilter:"blur(4px)" }} />
          <div style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%, -50%)", background:"#FFF", borderRadius:16, maxWidth:420, width:"90%", zIndex:1000, boxShadow:"0 24px 64px rgba(0,0,0,0.3)" }}>
            <div style={{ padding:"24px", textAlign:"center" }}>
              <div style={{ fontSize:"3rem", marginBottom:12 }}>⚠️</div>
              <h3 style={{ fontFamily:"Playfair Display,serif", fontWeight:900, fontSize:"1.3rem", color:"#1A1A1A", marginBottom:8 }}>Delete Account?</h3>
              <p style={{ fontSize:".85rem", color:"#888", marginBottom:24 }}>This action cannot be undone. All your books, orders, and data will be permanently deleted.</p>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={() => setShowDeleteConfirm(false)} className="btn-ol" style={{ flex:1 }}>Cancel</button>
                <button onClick={() => { localStorage.removeItem("bookcycle_user"); window.location.href = "/login"; }} className="btn-danger" style={{ flex:1 }}>Delete Forever</button>
              </div>
            </div>
          </div>
        </>
      )}
    </form>
  );
}

/* ════════════════════════════════
   MAIN EXPORT
════════════════════════════════ */
const TABS = [
  { key:"books",    icon:"📚", label:"My Books",     count:MY_BOOKS.length  },
  { key:"orders",   icon:"📦", label:"Orders",       count:ORDERS.length    },
  { key:"wishlist", icon:"🔖", label:"Wishlist",     count:WISHLIST.length  },
  { key:"edit",     icon:"⚙️", label:"Edit Profile", count:null             },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("books");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data from API on mount
  useEffect(() => {
    async function fetchUserData() {
      try {
        // Check if user is authenticated
        if (!api.isAuthenticated()) {
          // Try to use stored user as fallback
          const storedUser = localStorage.getItem("bookshare_user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            // Redirect to login if not authenticated
            navigate("/login");
            return;
          }
          setLoading(false);
          return;
        }
        
        // Fetch user profile from API
        const profileData = await api.getMyProfile();
        setUser({
          ...profileData,
          avatar: "👤",
          verified: profileData.verified || false,
          stats: {
            listed: profileData.booksListed || 0,
            borrowed: profileData.borrowedBooks || 0,
            sold: profileData.soldBooks || 0,
            exchanged: profileData.exchangedBooks || 0,
            rating: profileData.avgRating || 0,
            reviews: profileData.totalReviews || 0,
          },
          badges: [
            { icon:"🏆", label:"Top Lister", bg: Y },
            { icon:"🤝", label:"Trusted Trader", bg: LB },
            { icon:"⭐", label:"5-Star Reader", bg: SB },
            { icon:"♻️", label:"Book Champion", bg: MB },
          ],
        });
        
        // Also save to localStorage as backup
        localStorage.setItem("bookshare_user", JSON.stringify(profileData));
      } catch (err) {
        console.error("Failed to fetch user:", err);
        // Try to use stored user as fallback
        const storedUser = localStorage.getItem("bookshare_user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setError(err.message || "Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, [navigate]);

  // Update user data
  const handleUpdateUser = async (updatedFields) => {
    try {
      // Update via API
      await api.updateProfile(updatedFields);
      const updatedUser = { ...user, ...updatedFields };
      setUser(updatedUser);
      localStorage.setItem("bookshare_user", JSON.stringify(updatedUser));
    } catch (err) {
      // Fallback to local update
      const updatedUser = { ...user, ...updatedFields };
      setUser(updatedUser);
      localStorage.setItem("bookshare_user", JSON.stringify(updatedUser));
    }
  };

  if (loading) {
    return (
      <>
        <style>{STYLE}</style>
        <div style={{ padding:"60px 20px", textAlign:"center" }}>
          <div className="skeleton" style={{ width:100, height:100, borderRadius:24, margin:"0 auto 20px" }} />
          <div className="skeleton" style={{ width:200, height:30, borderRadius:8, margin:"0 auto 10px" }} />
          <div className="skeleton" style={{ width:300, height:20, borderRadius:8, margin:"0 auto" }} />
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <style>{STYLE}</style>
        <div style={{ padding:"60px 20px", textAlign:"center" }}>
          <div style={{ fontSize:"3rem", marginBottom:16 }}>🔒</div>
          <h2 style={{ fontFamily:"Playfair Display,serif", fontWeight:900, fontSize:"1.5rem", color:"#1A1A1A", marginBottom:12 }}>Please Login</h2>
          <a href="/login" className="btn-y">Go to Login</a>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{STYLE}</style>

      {/* ══════════════════════════════════
          HERO BANNER
      ══════════════════════════════════ */}
      <div style={{ background:`linear-gradient(135deg,${Y} 0%,${LB} 55%,${SB} 100%)`, paddingTop:52, overflow:"hidden", position:"relative" }}>

        {/* watermark */}
        <div style={{ position:"absolute", top:-10, right:-20, fontFamily:"Playfair Display,serif", fontSize:"14rem", fontWeight:900, color:"#1A1A1A", opacity:.035, lineHeight:1, pointerEvents:"none", userSelect:"none", letterSpacing:"-.04em" }}>PROFILE</div>

        <div className="container-fluid px-4 px-lg-5" style={{ position:"relative", zIndex:1 }}>

          {/* Top row: avatar + info + badges */}
          <div style={{ display:"flex", alignItems:"flex-end", gap:24, flexWrap:"wrap", paddingBottom:0 }}>

            {/* Avatar */}
            <div className="fu" style={{ position:"relative" }}>
              <div style={{ width:100, height:100, borderRadius:24, background:"#FFFFFF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"3rem", boxShadow:"0 8px 28px rgba(0,0,0,.15)", border:"4px solid #FFFFFF" }}>
                {user.avatar}
              </div>
              {user.verified && (
                <div style={{ position:"absolute", bottom:-4, right:-4, width:28, height:28, borderRadius:"50%", background:Y, border:"3px solid #FFFFFF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:".8rem", fontWeight:900 }}>✓</div>
              )}
            </div>

            {/* Name block */}
            <div className="fu2" style={{ flex:1, minWidth:200, paddingBottom:28 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:4 }}>
                <h1 style={{ fontFamily:"Playfair Display,serif", fontSize:"clamp(1.5rem,3vw,2.2rem)", fontWeight:900, color:"#1A1A1A", margin:0, lineHeight:1 }}>{user.name}</h1>
                {user.verified && (
                  <span style={{ padding:"3px 11px", borderRadius:100, background:"#1A1A1A", color:Y, fontSize:".6rem", fontWeight:800, letterSpacing:".1em" }}>✓ VERIFIED</span>
                )}
              </div>
              <div style={{ fontSize:".84rem", color:"rgba(26,26,26,.6)", fontWeight:600, marginBottom:6 }}>{user.username} · {user.city}</div>
              <p style={{ fontSize:".86rem", color:"rgba(26,26,26,.65)", lineHeight:1.55, margin:0, maxWidth:460 }}>{user.bio}</p>
              <div style={{ marginTop:8, fontSize:".75rem", color:"rgba(26,26,26,.5)", fontWeight:600 }}>Member since {user.joined}</div>
            </div>

            {/* Badges */}
            <div className="fu3 d-none d-md-flex" style={{ gap:8, paddingBottom:28, flexWrap:"wrap" }}>
              {user.badges.map(b=>(
                <div key={b.label} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 14px", borderRadius:100, background:b.bg, border:"1.5px solid rgba(0,0,0,.08)", fontSize:".72rem", fontWeight:800, color:"#1A1A1A" }}>
                  {b.icon} {b.label}
                </div>
              ))}
            </div>
          </div>

          {/* Stats strip */}
          <div className="fu4" style={{ display:"flex", borderTop:"2px solid rgba(0,0,0,.08)", overflowX:"auto" }}>
            {[
              { n:user.stats.listed,    l:"Listed",    bg:Y  },
              { n:user.stats.borrowed,  l:"Borrowed",  bg:LB },
              { n:user.stats.sold,      l:"Sold",      bg:SB },
              { n:user.stats.exchanged, l:"Exchanged", bg:MB },
              { n:user.stats.rating,    l:"Rating",    bg:Y  },
              { n:user.stats.reviews,   l:"Reviews",   bg:LB },
            ].map((s,i)=>(
              <div key={s.l} style={{ flex:"0 0 auto", minWidth:88, padding:"14px 18px", background:s.bg, borderRight:"2px solid rgba(0,0,0,.07)", textAlign:"center" }}>
                <div style={{ fontFamily:"Playfair Display,serif", fontSize:"1.5rem", fontWeight:900, color:"#1A1A1A", lineHeight:1 }}>{s.n}</div>
                <div style={{ fontSize:".6rem", textTransform:"uppercase", letterSpacing:".1em", color:"rgba(26,26,26,.5)", marginTop:3, fontWeight:700 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          TABS + CONTENT
      ══════════════════════════════════ */}
      <div className="container-fluid px-4 px-lg-5 py-5">

        {/* Tab bar */}
        <div style={{ display:"flex", gap:6, marginBottom:32, overflowX:"auto", paddingBottom:2, borderBottom:"2px solid #EEEEEE" }}>
          {TABS.map(t=>(
            <button key={t.key} className={`prof-tab ${tab===t.key?"on":""}`} onClick={()=>setTab(t.key)}>
              <span>{t.icon}</span>
              {t.label}
              {t.count!==null && (
                <span style={{ padding:"1px 8px", borderRadius:100, fontSize:".65rem", fontWeight:800, background:tab===t.key?Y:"#EEEEEE", color:"#1A1A1A", marginLeft:2 }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab==="books"    && <BooksTab />}
        {tab==="orders"   && <OrdersTab />}
        {tab==="wishlist" && <WishlistTab />}
        {tab==="edit"     && <EditTab user={user} onUpdate={handleUpdateUser} />}
      </div>
    </>
  );
}