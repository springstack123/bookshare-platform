import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/* ── Palette ── */
const Y  = "#FEFF86";
const LB = "#B0DAFF";
const SB = "#B9E9FC";
const MB = "#DAF5FF";

const API = "http://localhost:8080/api";

/* ── Type config ── */
const TYPE_CFG = {
  BORROW:   { label:"📥 Borrow",   bg:"#1A1A1A", color:Y,  btn:"Request" },
  EXCHANGE: { label:"📤 Exchange", bg:"#1A1A1A", color:LB, btn:"Swap"    },
  SELL:     { label:"💰 Buy",      bg:"#1A1A1A", color:Y,  btn:"Buy"     },
};
const TYPE_BG = { BORROW:Y, EXCHANGE:LB, SELL:SB };
const SORTS   = ["Newest","Oldest","Price: Low","Price: High"];
const SORT_MAP = { "Newest":"newest","Oldest":"oldest","Price: Low":"price_asc","Price: High":"price_desc" };
const CATEGORIES = ["Self-Help","Fiction","Productivity","Finance","Lifestyle","Biography","Business","Science","History"];

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;}
body{font-family:'DM Sans',sans-serif;background:#FAFEFF;margin:0;}

.search-wrap{position:relative;}
.search-input{width:100%;padding:13px 18px 13px 48px;border:2px solid #E0E0E0;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:.92rem;background:#FFFFFF;color:#1A1A1A;outline:none;transition:border-color .22s,box-shadow .22s;}
.search-input:focus{border-color:#1A1A1A;box-shadow:0 0 0 3px rgba(254,255,134,.35);}
.search-icon{position:absolute;left:15px;top:50%;transform:translateY(-50%);font-size:1.1rem;pointer-events:none;}

.chip{padding:7px 18px;border-radius:100px;font-size:.78rem;font-weight:700;cursor:pointer;border:2px solid #E0E0E0;background:#FFFFFF;color:#555;font-family:'DM Sans',sans-serif;transition:all .18s;white-space:nowrap;}
.chip:hover{border-color:#1A1A1A;color:#1A1A1A;}
.chip.active{background:#1A1A1A;color:#FEFF86;border-color:#1A1A1A;}

.bk-card{background:#FFFFFF;border-radius:16px;overflow:hidden;border:2px solid #EEEEEE;transition:all .28s;cursor:pointer;display:flex;flex-direction:column;height:100%;}
.bk-card:hover{transform:translateY(-6px);box-shadow:0 16px 40px rgba(0,0,0,.1);border-color:#1A1A1A;}

.bk-list-card{background:#FFFFFF;border-radius:14px;border:2px solid #EEEEEE;overflow:hidden;transition:all .25s;cursor:pointer;display:flex;align-items:stretch;}
.bk-list-card:hover{box-shadow:0 10px 28px rgba(0,0,0,.09);border-color:#1A1A1A;transform:translateX(4px);}

.act-btn{padding:8px 16px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:.78rem;font-weight:800;border:none;cursor:pointer;background:#FEFF86;color:#1A1A1A;transition:all .2s;}
.act-btn:hover{background:#F5F500;transform:translateY(-1px);box-shadow:0 4px 12px rgba(254,255,134,.5);}

.save-btn{width:34px;height:34px;border-radius:8px;border:2px solid #EEEEEE;background:#F9F9F9;cursor:pointer;font-size:.85rem;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0;}
.save-btn:hover{border-color:#1A1A1A;background:#FEFF86;}
.save-btn.saved{background:#FEFF86;border-color:#E0E000;}

.modal-overlay{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .2s ease;}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
.modal-box{background:#FFFFFF;border-radius:24px;width:100%;max-width:720px;max-height:90vh;overflow-y:auto;position:relative;animation:slideUp .3s cubic-bezier(.25,.8,.25,1) both;border:2px solid #EEEEEE;}
@keyframes slideUp{from{transform:translateY(40px);opacity:0;}to{transform:translateY(0);opacity:1;}}

@keyframes shimmer{0%{background-position:-400px 0;}100%{background-position:400px 0;}}
.skeleton{background:linear-gradient(90deg,#F0F0F0 25%,#E8E8E8 37%,#F0F0F0 63%);background-size:400px 100%;animation:shimmer 1.4s ease infinite;}

.view-btn{width:36px;height:36px;border-radius:8px;border:2px solid #E0E0E0;background:#FFFFFF;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.9rem;transition:all .2s;}
.view-btn.active{background:#1A1A1A;border-color:#1A1A1A;color:#FEFF86;}
.view-btn:not(.active):hover{border-color:#1A1A1A;}

.sort-select{padding:9px 14px;border-radius:10px;border:2px solid #E0E0E0;background:#FFFFFF;font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:600;color:#444;cursor:pointer;outline:none;}
.sort-select:focus{border-color:#1A1A1A;}

.sidebar-title{font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:#888;margin-bottom:12px;}

.star-on{color:#FFB700;}
.star-off{color:#DDDDDD;}

.pg-btn{width:36px;height:36px;border-radius:9px;border:2px solid #E0E0E0;background:#FFFFFF;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:700;color:#555;display:flex;align-items:center;justify-content:center;transition:all .2s;}
.pg-btn:hover:not(:disabled){border-color:#1A1A1A;color:#1A1A1A;}
.pg-btn.current{background:#1A1A1A;color:#FEFF86;border-color:#1A1A1A;}
.pg-btn:disabled{opacity:.35;cursor:default;}

::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:#FAFEFF;}
::-webkit-scrollbar-thumb{background:#FEFF86;border-radius:3px;}
`;

/* ─── helpers ─── */
function Stars({ rating, size=".82rem" }) {
  const r = Math.round(Number(rating)||0);
  return <span style={{fontSize:size}}>{[1,2,3,4,5].map(i=><span key={i} className={i<=r?"star-on":"star-off"}>★</span>)}</span>;
}

function BookCover({ book, height=180 }) {
  const [err, setErr] = useState(false);
  const bg  = TYPE_BG[book.listingType] || Y;
  const url = book.coverImageUrl || (book.isbn ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg` : null);
  if (!url || err) return (
    <div style={{width:"100%",height,background:bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{fontSize:"2.5rem",marginBottom:8}}>📖</div>
      <div style={{fontFamily:"Playfair Display,serif",fontSize:".85rem",fontWeight:900,color:"#1A1A1A",textAlign:"center",lineHeight:1.2}}>{book.title}</div>
      <div style={{fontSize:".65rem",color:"#555",marginTop:4}}>{book.author}</div>
    </div>
  );
  return (
    <div style={{width:"100%",height,background:bg,overflow:"hidden"}}>
      <img src={url} alt={book.title} onError={()=>setErr(true)} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{background:"#FFFFFF",borderRadius:16,overflow:"hidden",border:"2px solid #EEEEEE"}}>
      <div className="skeleton" style={{height:180,width:"100%"}}/>
      <div style={{padding:"14px 16px"}}>
        <div className="skeleton" style={{height:12,width:"60%",borderRadius:6,marginBottom:8}}/>
        <div className="skeleton" style={{height:16,width:"85%",borderRadius:6,marginBottom:6}}/>
        <div className="skeleton" style={{height:12,width:"50%",borderRadius:6,marginBottom:14}}/>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <div className="skeleton" style={{height:14,width:"30%",borderRadius:6}}/>
          <div className="skeleton" style={{height:32,width:"28%",borderRadius:8}}/>
        </div>
      </div>
    </div>
  );
}

/* ─── Book Detail Modal ─── */
function BookModal({ book, onClose, saved, onSave }) {
  const tc = TYPE_CFG[book.listingType] || TYPE_CFG.BORROW;
  const bg = TYPE_BG[book.listingType] || Y;
  const displayPrice = book.listingType==="SELL" ? (book.price?`₹${book.price}`:"—") : "Free";
  
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-box">
        <button onClick={onClose} style={{position:"absolute",top:16,right:16,zIndex:10,width:36,height:36,borderRadius:"50%",border:"2px solid #EEE",background:"#FFF",cursor:"pointer",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        <div style={{height:5,background:`linear-gradient(90deg,${Y},${LB},${SB})`,borderRadius:"24px 24px 0 0"}}/>
        <div style={{display:"flex",flexWrap:"wrap"}}>
          <div style={{width:"100%",maxWidth:220,flexShrink:0}}><BookCover book={book} height={280}/></div>
          <div style={{flex:1,minWidth:260,padding:"24px 28px 24px"}}>
            <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
              <span style={{padding:"4px 12px",borderRadius:100,fontSize:".62rem",fontWeight:800,background:tc.bg,color:tc.color}}>{tc.label}</span>
              {book.category && <span style={{fontSize:".72rem",color:"#AAA",fontWeight:600,alignSelf:"center"}}>{book.category}</span>}
              {book.publishedYear && <span style={{fontSize:".72rem",color:"#AAA",alignSelf:"center"}}>{book.publishedYear}</span>}
            </div>
            <h2 style={{fontFamily:"Playfair Display,serif",fontSize:"1.5rem",fontWeight:900,color:"#1A1A1A",lineHeight:1.2,marginBottom:4}}>{book.title}</h2>
            <div style={{fontSize:".85rem",color:"#888",marginBottom:12}}>by <span style={{color:"#1A1A1A",fontWeight:700}}>{book.author}</span></div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
              <Stars rating={book.avgRating} size="1rem"/>
              <span style={{fontWeight:800,fontSize:".9rem"}}>{Number(book.avgRating||0).toFixed(1)}</span>
              <span style={{fontSize:".75rem",color:"#BBB"}}>({book.reviewCount||0} reviews)</span>
            </div>
            {book.description && <p style={{fontSize:".87rem",color:"#555",lineHeight:1.7,marginBottom:16}}>{book.description}</p>}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
              {[{label:"Pages",value:book.pages||"—",icon:"📄"},{label:"City",value:book.city||"—",icon:"📍"},{label:"Price",value:displayPrice,icon:"💰"}].map(m=>(
                <div key={m.label} style={{background:"#F7F7F7",borderRadius:10,padding:"10px 12px",border:"1.5px solid #EEE"}}>
                  <div style={{fontSize:".6rem",color:"#AAA",textTransform:"uppercase",letterSpacing:".1em",fontWeight:700}}>{m.icon} {m.label}</div>
                  <div style={{fontSize:".88rem",fontWeight:800,color:"#1A1A1A",marginTop:2}}>{m.value}</div>
                </div>
              ))}
            </div>
            {book.owner && (
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:12,background:bg+"55",border:`1.5px solid ${bg}`,marginBottom:20}}>
                <div style={{width:38,height:38,borderRadius:"50%",background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:".9rem",color:"#1A1A1A",flexShrink:0,border:"2px solid rgba(0,0,0,.08)"}}>
                  {book.owner.name?.charAt(0)||"?"}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:".6rem",color:"#888",textTransform:"uppercase",letterSpacing:".1em",fontWeight:700}}>Listed by</div>
                  <div style={{fontSize:".88rem",fontWeight:800,color:"#1A1A1A"}}>{book.owner.name}</div>
                  <div style={{fontSize:".7rem",color:"#888"}}>📍 {book.owner.city}</div>
                </div>
                {book.owner.verified && <span style={{padding:"3px 10px",borderRadius:100,background:"#1A1A1A",color:Y,fontSize:".6rem",fontWeight:800}}>✓ Verified</span>}
              </div>
            )}
            <div style={{display:"flex",gap:10}}>
              <button className="act-btn" style={{flex:1,padding:"12px 0",fontSize:".9rem"}}>{tc.btn}</button>
              <button className={`save-btn ${saved?"saved":""}`} style={{width:44,height:44}} onClick={onSave}>{saved?"🔖":"🏷️"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Grid Card ─── */
function GridCard({ book, onOpen, saved, onSave, onBuy }) {
  const tc = TYPE_CFG[book.listingType] || TYPE_CFG.BORROW;
  const displayPrice = book.listingType==="SELL" ? (book.price?`₹${book.price}`:"—") : "Free";
  return (
    <div className="bk-card" onClick={()=>onOpen(book)}>
      <div style={{position:"relative"}}>
        <BookCover book={book} height={180}/>
        <span style={{position:"absolute",top:10,left:10,padding:"3px 10px",borderRadius:100,fontSize:".6rem",fontWeight:800,background:tc.bg,color:tc.color}}>{tc.label}</span>
        <button className={`save-btn ${saved?"saved":""}`} style={{position:"absolute",top:8,right:8}} onClick={e=>{e.stopPropagation();onSave(book.id);}}>
          {saved?"🔖":"🏷️"}
        </button>
      </div>
      <div style={{padding:"14px 16px 16px",flex:1,display:"flex",flexDirection:"column"}}>
        <div style={{fontSize:".65rem",color:"#AAA",fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",marginBottom:4}}>{book.category||"Book"}</div>
        <div style={{fontFamily:"Playfair Display,serif",fontSize:".95rem",fontWeight:900,color:"#1A1A1A",lineHeight:1.2,marginBottom:3,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{book.title}</div>
        <div style={{fontSize:".75rem",color:"#888",marginBottom:8}}>{book.author}</div>
        <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:10}}>
          <Stars rating={book.avgRating}/>
          <span style={{fontSize:".72rem",fontWeight:700,color:"#1A1A1A"}}>{Number(book.avgRating||0).toFixed(1)}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"auto"}}>
          <div>
            <div style={{fontFamily:"Playfair Display,serif",fontSize:"1rem",fontWeight:900,color:"#1A1A1A"}}>{displayPrice}</div>
            <div style={{fontSize:".65rem",color:"#AAA"}}>📍 {book.city}</div>
          </div>
          <button className="act-btn" onClick={e=>{e.stopPropagation();onBuy(book);}}>{tc.btn}</button>
        </div>
      </div>
    </div>
  );
}

/* ─── List Card ─── */
function ListCard({ book, onOpen, saved, onSave, onBuy }) {
  const tc = TYPE_CFG[book.listingType] || TYPE_CFG.BORROW;
  const displayPrice = book.listingType==="SELL" ? (book.price?`₹${book.price}`:"—") : "Free";
  return (
    <div className="bk-list-card" onClick={()=>onOpen(book)}>
      <div style={{width:110,flexShrink:0}}><BookCover book={book} height={110}/></div>
      <div style={{flex:1,padding:"14px 18px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
            <span style={{padding:"2px 10px",borderRadius:100,fontSize:".6rem",fontWeight:800,background:tc.bg,color:tc.color}}>{tc.label}</span>
            {book.category && <span style={{fontSize:".7rem",color:"#AAA"}}>{book.category}</span>}
          </div>
          <div style={{fontFamily:"Playfair Display,serif",fontSize:"1.02rem",fontWeight:900,color:"#1A1A1A",lineHeight:1.2,marginBottom:3}}>{book.title}</div>
          <div style={{fontSize:".77rem",color:"#888",marginBottom:6}}>by {book.author}</div>
          {book.description && <p style={{fontSize:".81rem",color:"#666",lineHeight:1.55,margin:0,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{book.description}</p>}
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:10,flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <Stars rating={book.avgRating}/>
            <span style={{fontSize:".72rem",color:"#AAA"}}>📍 {book.city}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontFamily:"Playfair Display,serif",fontSize:"1rem",fontWeight:900,color:"#1A1A1A"}}>{displayPrice}</span>
            <button className="act-btn" onClick={e=>{e.stopPropagation();onBuy(book);}}>{tc.btn}</button>
            <button className={`save-btn ${saved?"saved":""}`} onClick={e=>{e.stopPropagation();onSave(book.id);}}>
              {saved?"🔖":"🏷️"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════
   MAIN COMPONENT
══════════════════════════════ */
export default function Books() {
  const navigate = useNavigate();
  
  /* filter state */
  const [searchInput, setSearchInput] = useState("");
  const [search,      setSearch]      = useState("");
  const [category,    setCategory]    = useState("");
  const [type,        setType]        = useState("");
  const [city,        setCity]        = useState("");
  const [sort,        setSort]        = useState("Newest");
  const [page,        setPage]        = useState(0);
  const [viewMode,    setViewMode]    = useState("grid");

  /* data state */
  const [books,      setBooks]      = useState([]);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [cities,     setCities]     = useState([]);
  const [stats,      setStats]      = useState(null);

  /* ui state */
  const [selected, setSelected] = useState(null);
  const [saved,    setSaved]    = useState(new Set());

  const PAGE_SIZE = 12;

  /* ── fetch books from API ── */
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const p = new URLSearchParams({ page, size:PAGE_SIZE, sort:SORT_MAP[sort]||"newest" });
      if (search)   p.set("search",   search);
      if (category) p.set("category", category);
      if (type)     p.set("type",     type);
      if (city)     p.set("city",     city);

      const res  = await fetch(`${API}/books?${p}`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const json = await res.json();
      const data = json.data;

      setBooks(data.content || []);
      setTotal(data.totalElements || 0);
      setTotalPages(data.totalPages || 0);
    } catch (e) {
      setError(e.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [page, sort, search, category, type, city]);

  /* ── fetch cities (sidebar) ── */
  useEffect(() => {
    fetch(`${API}/books/cities`)
      .then(r=>r.json()).then(j=>setCities(j.data||[])).catch(()=>{});
  }, []);

  /* ── fetch platform stats (header strip) ── */
  useEffect(() => {
    fetch(`${API}/stats`)
      .then(r=>r.json()).then(j=>setStats(j.data||null)).catch(()=>{});
  }, []);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  /* ── search debounce ── */
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(0); }, 450);
    return () => clearTimeout(t);
  }, [searchInput]);

  function resetFilters() {
    setSearchInput(""); setSearch("");
    setCategory(""); setType(""); setCity("");
    setSort("Newest"); setPage(0);
  }

  function toggleSave(id) {
    setSaved(prev => { const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
  }

  function handleBuy(book) {
    navigate("/address", { state: { book, quantity: 1 } });
  }

  /* ── page number array ── */
  function pageNums() {
    const arr=[]; const s=Math.max(0,page-2); const e=Math.min(totalPages-1,page+2);
    for(let i=s;i<=e;i++) arr.push(i); return arr;
  }

  const SideBtn = ({ active, onClick, children, style={} }) => (
    <button onClick={onClick}
      style={{padding:"9px 14px",borderRadius:9,border:"none",background:active?"#1A1A1A":"transparent",color:active?Y:"#444",fontFamily:"DM Sans,sans-serif",fontSize:".85rem",fontWeight:active?700:500,cursor:"pointer",textAlign:"left",transition:"all .18s",...style}}
      onMouseEnter={e=>{if(!active)e.currentTarget.style.background="#F5F5F5";}}
      onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent";}}>
      {children}
    </button>
  );

  return (
    <>
      <style>{STYLE}</style>

      {/* ══ HEADER ══ */}
      <div style={{background:`linear-gradient(135deg,${Y} 0%,${LB} 60%,${SB} 100%)`,padding:"52px 0 0",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",overflow:"hidden",pointerEvents:"none"}}>
          <div style={{fontFamily:"Playfair Display,serif",fontSize:"12rem",fontWeight:900,color:"#1A1A1A",opacity:.04,whiteSpace:"nowrap",letterSpacing:"-.04em",lineHeight:1}}>BOOKS BOOKS</div>
        </div>
        <div className="container-fluid px-4 px-lg-5" style={{position:"relative",zIndex:1}}>
          <div style={{display:"inline-block",padding:"4px 16px",borderRadius:100,background:"#1A1A1A",color:Y,fontSize:".65rem",fontWeight:800,letterSpacing:".16em",textTransform:"uppercase",marginBottom:12}}>Browse Collection</div>
          <h1 style={{fontFamily:"Playfair Display,serif",fontSize:"clamp(2.2rem,5vw,3.8rem)",fontWeight:900,color:"#1A1A1A",lineHeight:1.05,letterSpacing:"-.02em",marginBottom:8}}>
            Find Your Next<br/><em style={{borderBottom:"5px solid #1A1A1A"}}>Great Read</em>
          </h1>
          <p style={{fontSize:"1rem",color:"rgba(26,26,26,.6)",lineHeight:1.6,maxWidth:480,marginBottom:28}}>
            {stats
              ? `Browse ${stats.availableBooks} books across ${stats.cities?.length||0} cities.`
              : "Browse books available across Maharashtra."}
          </p>
          <div className="search-wrap" style={{maxWidth:600,marginBottom:0}}>
            <span className="search-icon">🔍</span>
            <input className="search-input" type="text" placeholder="Search by title or author..."
              value={searchInput} onChange={e=>setSearchInput(e.target.value)}/>
          </div>

          {/* Stats strip */}
          <div style={{display:"flex",marginTop:28,borderTop:"2px solid rgba(0,0,0,.08)"}}>
            {[
              {label:"Free Borrow",count:stats?.borrowBooks||0,   bg:Y,  key:"BORROW"  },
              {label:"Exchange",   count:stats?.exchangeBooks||0, bg:LB, key:"EXCHANGE"},
              {label:"For Sale",   count:stats?.sellBooks||0,     bg:SB, key:"SELL"    },
              {label:"Total",      count:stats?.totalBooks||0,    bg:MB, key:""        },
            ].map((s,i)=>(
              <div key={s.label} style={{flex:1,padding:"16px 20px",background:s.bg,borderRight:i<3?"2px solid rgba(0,0,0,.07)":"none",cursor:"pointer"}}
                onClick={()=>{setType(s.key);setPage(0);}}>
                <div style={{fontSize:".7rem",fontWeight:800,textTransform:"uppercase",letterSpacing:".1em",color:"rgba(26,26,26,.5)",marginBottom:4}}>{s.label}</div>
                <div style={{fontFamily:"Playfair Display,serif",fontSize:"1.6rem",fontWeight:900,color:"#1A1A1A",lineHeight:1}}>{s.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ CONTENT ══ */}
      <div className="container-fluid px-4 px-lg-5 py-5">
        <div className="row g-4">

          {/* ─ SIDEBAR ─ */}
          <div className="col-lg-3 d-none d-lg-block">
            <div style={{position:"sticky",top:88}}>

              <div style={{marginBottom:24}}>
                <div className="sidebar-title">Category</div>
                <div style={{display:"flex",flexDirection:"column",gap:3}}>
                  <SideBtn active={category===""} onClick={()=>{setCategory("");setPage(0);}}>All Categories</SideBtn>
                  {CATEGORIES.map(c=>(
                    <SideBtn key={c} active={category===c} onClick={()=>{setCategory(c);setPage(0);}}>{c}</SideBtn>
                  ))}
                </div>
              </div>

              <div style={{height:1,background:"#EEE",marginBottom:22}}/>

              <div style={{marginBottom:24}}>
                <div className="sidebar-title">Listing Type</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {[{k:"",label:"All Types",bg:"#EEE",color:"#444"},{k:"BORROW",label:"📥 Borrow",bg:Y,color:"#1A1A1A"},{k:"EXCHANGE",label:"📤 Exchange",bg:LB,color:"#1A1A1A"},{k:"SELL",label:"💰 Buy",bg:SB,color:"#1A1A1A"}].map(t=>(
                    <button key={t.k} onClick={()=>{setType(t.k);setPage(0);}}
                      style={{padding:"9px 14px",borderRadius:9,border:`2px solid ${type===t.k?"#1A1A1A":"#EEE"}`,background:type===t.k?t.bg:"#FFF",color:type===t.k?t.color:"#555",fontFamily:"DM Sans,sans-serif",fontSize:".84rem",fontWeight:700,cursor:"pointer",textAlign:"left",transition:"all .18s"}}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{height:1,background:"#EEE",marginBottom:22}}/>

              <div style={{marginBottom:24}}>
                <div className="sidebar-title">City</div>
                <div style={{display:"flex",flexDirection:"column",gap:3}}>
                  <SideBtn active={city===""} onClick={()=>{setCity("");setPage(0);}}>📍 All Cities</SideBtn>
                  {cities.map(c=>(
                    <SideBtn key={c} active={city===c} onClick={()=>{setCity(c);setPage(0);}}>📍 {c}</SideBtn>
                  ))}
                  {cities.length===0 && <div style={{fontSize:".78rem",color:"#CCC",padding:"8px 14px"}}>Loading cities…</div>}
                </div>
              </div>

              <div style={{height:1,background:"#EEE",marginBottom:22}}/>

              <button onClick={resetFilters}
                style={{width:"100%",padding:"10px",borderRadius:10,border:"2px solid #1A1A1A",background:"transparent",color:"#1A1A1A",fontFamily:"DM Sans,sans-serif",fontSize:".84rem",fontWeight:700,cursor:"pointer",transition:"all .2s"}}
                onMouseEnter={e=>{e.currentTarget.style.background="#1A1A1A";e.currentTarget.style.color=Y;}}
                onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#1A1A1A";}}>
                ↺ Reset Filters
              </button>
            </div>
          </div>

          {/* ─ BOOKS AREA ─ */}
          <div className="col-lg-9">

            {/* Toolbar */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
              <div className="d-lg-none" style={{display:"flex",gap:8,flexWrap:"wrap",width:"100%"}}>
                {["","BORROW","EXCHANGE","SELL"].map(t=>(
                  <button key={t} className={`chip ${type===t?"active":""}`} onClick={()=>{setType(t);setPage(0);}}>
                    {t||"All"}
                  </button>
                ))}
              </div>
              <div style={{fontSize:".88rem",color:"#888",fontWeight:600}}>
                {loading ? <span style={{opacity:.5}}>Loading…</span>
                  : <><span style={{fontWeight:900,color:"#1A1A1A",fontFamily:"Playfair Display,serif",fontSize:"1.1rem"}}>{total}</span> books found</>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <select className="sort-select" value={sort} onChange={e=>{setSort(e.target.value);setPage(0);}}>
                  {SORTS.map(s=><option key={s}>{s}</option>)}
                </select>
                <div style={{display:"flex",gap:4}}>
                  <button className={`view-btn ${viewMode==="grid"?"active":""}`} onClick={()=>setViewMode("grid")}>⊞</button>
                  <button className={`view-btn ${viewMode==="list"?"active":""}`} onClick={()=>setViewMode("list")}>☰</button>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{background:"#FFF0F0",border:"2px solid #FFCCCC",borderRadius:14,padding:"28px",textAlign:"center",marginBottom:20}}>
                <div style={{fontSize:"2.5rem",marginBottom:10}}>⚠️</div>
                <div style={{fontFamily:"Playfair Display,serif",fontWeight:900,color:"#1A1A1A",fontSize:"1.1rem",marginBottom:6}}>Could not connect to server</div>
                <div style={{fontSize:".84rem",color:"#888",marginBottom:16}}>Make sure Spring Boot is running at <code style={{background:"#F5F5F5",padding:"2px 8px",borderRadius:5}}>localhost:8080</code></div>
                <button onClick={fetchBooks} style={{padding:"9px 24px",borderRadius:9,background:Y,border:"2px solid #E0E000",fontWeight:800,cursor:"pointer",fontFamily:"DM Sans,sans-serif"}}>↺ Try Again</button>
              </div>
            )}

            {/* Skeletons */}
            {loading && (
              <div className="row g-3">
                {Array.from({length:6}).map((_,i)=>(
                  <div key={i} className="col-6 col-md-4"><SkeletonCard/></div>
                ))}
              </div>
            )}

            {/* Empty */}
            {!loading && !error && books.length===0 && (
              <div style={{textAlign:"center",padding:"80px 20px"}}>
                <div style={{fontSize:"4rem",marginBottom:16}}>📭</div>
                <div style={{fontFamily:"Playfair Display,serif",fontSize:"1.3rem",fontWeight:900,color:"#1A1A1A",marginBottom:8}}>No books found</div>
                <div style={{fontSize:".88rem",color:"#888",marginBottom:20}}>Try adjusting your filters or search terms</div>
                <button onClick={resetFilters} style={{padding:"10px 28px",borderRadius:10,background:Y,color:"#1A1A1A",border:"2px solid #E0E000",fontWeight:800,cursor:"pointer",fontFamily:"DM Sans,sans-serif"}}>Clear Filters</button>
              </div>
            )}

            {/* Grid */}
            {!loading && !error && books.length>0 && viewMode==="grid" && (
              <div className="row g-3">
                {books.map(book=>(
                  <div key={book.id} className="col-6 col-md-4">
                    <GridCard book={book} onOpen={setSelected} saved={saved.has(book.id)} onSave={toggleSave} onBuy={handleBuy}/>
                  </div>
                ))}
              </div>
            )}

            {/* List */}
            {!loading && !error && books.length>0 && viewMode==="list" && (
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {books.map(book=>(
                  <ListCard key={book.id} book={book} onOpen={setSelected} saved={saved.has(book.id)} onSave={toggleSave} onBuy={handleBuy}/>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages>1 && (
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:36,flexWrap:"wrap"}}>
                <button className="pg-btn" disabled={page===0} onClick={()=>setPage(p=>p-1)}>‹</button>
                {pageNums().map(p=>(
                  <button key={p} className={`pg-btn ${p===page?"current":""}`} onClick={()=>setPage(p)}>{p+1}</button>
                ))}
                <button className="pg-btn" disabled={page>=totalPages-1} onClick={()=>setPage(p=>p+1)}>›</button>
                <span style={{fontSize:".75rem",color:"#AAA",marginLeft:8}}>Page {page+1} of {totalPages}</span>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <BookModal book={selected} onClose={()=>setSelected(null)}
          saved={saved.has(selected.id)} onSave={()=>toggleSave(selected.id)}/>
      )}
    </>
  );
}