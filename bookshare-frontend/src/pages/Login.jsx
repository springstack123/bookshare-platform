import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Y  = "#FEFF86";
const LB = "#B0DAFF";
const SB = "#B9E9FC";
const MB = "#DAF5FF";

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{height:100%;font-family:'DM Sans',sans-serif;overflow-x:hidden;}

/* floating particles */
@keyframes floatUp{
  0%{transform:translateY(0) rotate(0deg);opacity:.1;}
  50%{opacity:.2;}
  100%{transform:translateY(-110vh) rotate(18deg);opacity:0;}
}
.particle{position:fixed;bottom:-60px;font-size:1.3rem;animation:floatUp linear infinite;pointer-events:none;z-index:0;}

/* slide */
@keyframes slideInLeft{from{transform:translateX(-50px);opacity:0;}to{transform:translateX(0);opacity:1;}}
@keyframes slideInRight{from{transform:translateX(50px);opacity:0;}to{transform:translateX(0);opacity:1;}}
.slide-left{animation:slideInLeft .42s cubic-bezier(.25,.8,.25,1) both;}
.slide-right{animation:slideInRight .42s cubic-bezier(.25,.8,.25,1) both;}

/* input */
.auth-input{
  background:#FFFFFF!important;
  border:2px solid #E0E0E0!important;
  color:#1A1A1A!important;
  border-radius:10px!important;
  font-family:'DM Sans',sans-serif!important;
  font-size:.9rem!important;
  padding:12px 16px!important;
  transition:border-color .22s,box-shadow .22s!important;
  outline:none!important;width:100%;display:block;
}
.auth-input::placeholder{color:#BBBBBB!important;}
.auth-input:focus{border-color:${Y}!important;box-shadow:0 0 0 3px rgba(254,255,134,.3)!important;}

/* left panel gradient shift */
@keyframes bgShift{
  0%{background-position:0% 50%;}
  50%{background-position:100% 50%;}
  100%{background-position:0% 50%;}
}
.deco-panel{
  background:linear-gradient(135deg,${Y},${LB},${SB},${MB},${Y});
  background-size:350% 350%;
  animation:bgShift 8s ease infinite;
}

/* spine float */
@keyframes spineFloat{
  0%,100%{transform:translateY(0) rotate(var(--rot));}
  50%{transform:translateY(-9px) rotate(var(--rot));}
}
.spine{animation:spineFloat 3.2s ease-in-out infinite;}

/* tab underline */
.tab-underline{height:3px;border-radius:2px;background:#1A1A1A;transition:all .35s cubic-bezier(.25,.8,.25,1);}

/* strength bar */
.strength-bar{height:4px;border-radius:4px;transition:width .4s,background .4s;}

/* social btn */
.social-btn{
  flex:1;padding:10px;border-radius:10px;
  border:2px solid #E0E0E0;background:#F8F8F8;
  color:#444;font-family:'DM Sans',sans-serif;
  font-size:.85rem;font-weight:600;cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:8px;
  transition:all .2s;
}
.social-btn:hover{background:${Y};border-color:#E0E000;color:#1A1A1A;transform:translateY(-1px);}

.auth-check{accent-color:#1A1A1A;width:15px;height:15px;cursor:pointer;}

/* submit btn */
.submit-btn{
  width:100%;padding:13px;border-radius:10px;
  background:${Y};color:#1A1A1A;border:2px solid #E0E000;
  font-family:'DM Sans',sans-serif;font-size:.95rem;font-weight:800;
  cursor:pointer;letter-spacing:.02em;
  transition:all .2s;box-shadow:0 4px 16px rgba(254,255,134,.4);
}
.submit-btn:hover{background:#F5F500;transform:translateY(-1px);box-shadow:0 8px 24px rgba(254,255,134,.5);}

::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:#FAFEFF;}
::-webkit-scrollbar-thumb{background:${Y};border-radius:3px;}

@keyframes dotPulse{0%,100%{transform:scale(1);}50%{transform:scale(1.6);}}
.dot-pulse{animation:dotPulse 2s ease infinite;}
`;

const PARTICLES = [
  { left:"4%",  delay:"0s",   dur:"13s" },
  { left:"14%", delay:"2.5s", dur:"9s"  },
  { left:"27%", delay:"5s",   dur:"14s" },
  { left:"40%", delay:"1s",   dur:"11s" },
  { left:"56%", delay:"3.5s", dur:"10s" },
  { left:"69%", delay:"7s",   dur:"12s" },
  { left:"82%", delay:"4s",   dur:"8s"  },
  { left:"93%", delay:"6.5s", dur:"15s" },
];

const SPINES = [
  { h:165, w:44, bg:Y,  rot:"-8deg",  delay:"0s",   left:"10%", top:"18%", textColor:"#1A1A1A" },
  { h:145, w:40, bg:LB, rot:"5deg",   delay:"0.7s", left:"22%", top:"28%", textColor:"#1A1A1A" },
  { h:185, w:48, bg:SB, rot:"-3deg",  delay:"1.3s", left:"34%", top:"14%", textColor:"#1A1A1A" },
  { h:125, w:36, bg:MB, rot:"10deg",  delay:"0.4s", left:"18%", top:"55%", textColor:"#1A1A1A" },
  { h:158, w:42, bg:Y,  rot:"-6deg",  delay:"1s",   left:"29%", top:"62%", textColor:"#1A1A1A" },
];

function getStrength(pw) {
  if (!pw) return { pct:0, color:"transparent", label:"" };
  let s = 0;
  if (pw.length>=8)          s++;
  if (/[A-Z]/.test(pw))      s++;
  if (/[0-9]/.test(pw))      s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const m = [
    { pct:25,  color:"#EF4444", label:"Weak"     },
    { pct:50,  color:"#FB923C", label:"Fair"     },
    { pct:75,  color:"#EAB308", label:"Good"     },
    { pct:100, color:"#22C55E", label:"Strong ✓" },
  ];
  return m[s-1] || { pct:10, color:"#EF4444", label:"Too short" };
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode,     setMode]     = useState("login");
  const [animDir,  setAnimDir]  = useState("right");
  const [showPw,   setShowPw]   = useState(false);
  const [showPw2,  setShowPw2]  = useState(false);
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState("");
  const [email,    setEmail]    = useState("");
  const [name,     setName]     = useState("");
  const [city,     setCity]     = useState("");
  const [agree,    setAgree]    = useState(false);

  const strength = getStrength(password);
  const isLogin  = mode === "login";

  function switchMode(next) {
    if (next===mode) return;
    setAnimDir(next==="register"?"right":"left");
    setMode(next); setSuccess(false); setError("");
    setPassword(""); setConfirm(""); setShowPw(false); setShowPw2(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Login API call
        await api.login(email, password);
      } else {
        // Validation
        if (password !== confirm) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }
        // Register API call
        await api.register({ name, email, password, city, phone: "" });
      }
      
      // Success - redirect to home or profile
      setSuccess(true);
      // Dispatch custom event to notify Navbar of auth change
      window.dispatchEvent(new Event("auth-change"));
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const slideClass = animDir==="right"?"slide-right":"slide-left";

  const labelStyle = {
    fontSize:"0.72rem", fontWeight:700, color:"#888",
    letterSpacing:"0.07em", textTransform:"uppercase",
    marginBottom:6, display:"block",
  };
  const iconStyle = {
    position:"absolute", left:14, top:"50%",
    transform:"translateY(-50%)", fontSize:"1rem", pointerEvents:"none",
  };
  const eyeStyle = {
    position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
    background:"none", border:"none", cursor:"pointer",
    fontSize:"1rem", color:"#AAAAAA", padding:0, lineHeight:1,
  };

  return (
    <>
      <style>{STYLE}</style>

      {/* Floating particles */}
      

      <div style={{ display:"flex", minHeight:"100vh", position:"relative", zIndex:1 }}>

        {/* ══════════════════════════════
            LEFT — Animated pastel panel
        ══════════════════════════════ */}
        <div className="deco-panel d-none d-lg-flex flex-column align-items-center justify-content-center"
          style={{ width:"42%", minHeight:"100vh", padding:"60px 48px", position:"relative", overflow:"hidden" }}>

          {/* Grid overlay */}
          <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(0,0,0,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.05) 1px,transparent 1px)", backgroundSize:"40px 40px", pointerEvents:"none" }} />

          {/* Book spines */}
         

          {/* Tagline */}
          <div style={{ textAlign:"center", position:"relative" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:14 }}>
              <span className="dot-pulse" style={{ width:7, height:7, borderRadius:"50%", background:"#1A1A1A", display:"inline-block" }} />
              <span style={{ fontSize:"0.65rem", fontWeight:800, letterSpacing:"0.2em", textTransform:"uppercase", color:"#1A1A1A" }}>
                Take • Leave • Sell
              </span>
            </div>
            <h2 style={{ fontFamily:"Playfair Display,Georgia,serif", fontSize:"2.3rem", fontWeight:900, color:"#1A1A1A", lineHeight:1.12, marginBottom:16 }}>
              Every Book<br />
              <em style={{ borderBottom:"4px solid #1A1A1A" }}>Finds Its</em><br />
              Reader
            </h2>
            <p style={{ fontSize:"0.87rem", fontWeight:400, color:"rgba(26,26,26,0.55)", lineHeight:1.72, maxWidth:285, margin:"0 auto" }}>
              Join 1,800+ readers across India. Borrow, exchange, or sell your books with people in your city.
            </p>
          </div>

          {/* Stats */}
          
        </div>

        {/* ══════════════════════════════
            RIGHT — White form panel
        ══════════════════════════════ */}
        <div style={{ flex:1, background:"#FFFFFF", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 20px", overflowY:"auto", minHeight:"100vh" }}>

          {/* Mobile logo */}
          <a href="/" className="d-flex d-lg-none align-items-center gap-2 text-decoration-none mb-4">
            <div style={{ width:36, height:36, borderRadius:8, background:Y, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem", border:"2px solid #E0E000" }}>📚</div>
            <div style={{ fontFamily:"Playfair Display,serif", fontSize:"1.3rem", fontWeight:900, color:"#1A1A1A" }}>
              Book<span style={{ borderBottom:`3px solid ${Y}` }}>Cycle</span>
            </div>
          </a>

          <div style={{ width:"100%", maxWidth:448 }}>

            {/* Tabs */}
            <div style={{ display:"flex", position:"relative", borderBottom:"2px solid #F0F0F0", marginBottom:2 }}>
              {["login","register"].map(tab => (
                <button key={tab} onClick={() => switchMode(tab)}
                  style={{ flex:1, background:"none", border:"none", padding:"13px 0", fontFamily:"DM Sans,sans-serif", fontSize:"0.9rem", fontWeight:700, color:mode===tab?"#1A1A1A":"#AAAAAA", cursor:"pointer", transition:"color .22s" }}>
                  {tab==="login"?"Sign In":"Create Account"}
                </button>
              ))}
              <div className="tab-underline" style={{ position:"absolute", bottom:-2, left:isLogin?"0%":"50%", width:"50%" }} />
            </div>

            {/* Heading */}
            <div className={`${slideClass} mt-4 mb-4`} key={mode+"-head"}>
              <h1 style={{ fontFamily:"Playfair Display,serif", fontSize:"1.9rem", fontWeight:900, color:"#1A1A1A", marginBottom:5, letterSpacing:"-0.02em" }}>
                {isLogin?"Welcome back":"Join BookCycle"}
                <span style={{ color:"#1A1A1A", marginLeft:2, display:"inline-block", width:10, height:10, borderRadius:"50%", background:Y, verticalAlign:"middle", border:"2px solid #E0E000" }} />
              </h1>
              <p style={{ fontSize:"0.84rem", color:"#888", lineHeight:1.62 }}>
                {isLogin
                  ? "Sign in to borrow, exchange or sell books near you."
                  : "Create your free account and start your reading journey."}
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div style={{ background: "#FFF3E0", border: "2px solid #FFCDD2", borderRadius: 10, padding: "12px 16px", marginBottom: 20, textAlign: "center" }}>
                <span style={{ color: "#C62828", fontSize: "0.85rem", fontWeight: 600 }}>{error}</span>
              </div>
            )}

            {/* Success */}
            {success ? (
              <div className={`${slideClass} text-center py-4`} key="success">
                <div style={{ fontSize:"3rem", marginBottom:14 }}>🎉</div>
                <div style={{ fontFamily:"Playfair Display,serif", fontSize:"1.4rem", fontWeight:900, color:"#1A1A1A", marginBottom:8 }}>
                  {isLogin?"You're in!":"Account Created!"}
                </div>
                <p style={{ fontSize:"0.85rem", color:"#888" }}>
                  {isLogin?"Redirecting to your dashboard...":"Welcome to the BookCycle community!"}
                </p>
                <div style={{ marginTop:16, display:"flex", justifyContent:"center" }}>
                  <div style={{ width:28, height:28, border:"3px solid #E0E0E0", borderTopColor:Y, borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
                </div>
                <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
              </div>
            ) : (
              <form onSubmit={handleSubmit} key={mode+"-form"} className={slideClass}>

                {/* Social */}
                <div style={{ display:"flex", gap:10, marginBottom:20 }}>
                  {[{icon:"G",label:"Google"},{icon:"f",label:"Facebook"}].map(s => (
                    <button key={s.label} type="button" className="social-btn">
                      <span style={{ fontWeight:800, fontSize:"1rem" }}>{s.icon}</span>{s.label}
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                  <div style={{ flex:1, height:1, background:"#EEEEEE" }} />
                  <span style={{ fontSize:"0.7rem", color:"#BBBBBB", fontWeight:700, letterSpacing:"0.1em" }}>OR</span>
                  <div style={{ flex:1, height:1, background:"#EEEEEE" }} />
                </div>

                {/* Name + City (register) */}
                {!isLogin && (
                  <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:12, marginBottom:14 }}>
                    <div>
                      <label style={labelStyle}>Full Name</label>
                      <input type="text" className="auth-input" placeholder="Rahul Sharma" value={name} onChange={e=>setName(e.target.value)} required />
                    </div>
                    <div>
                      <label style={labelStyle}>City</label>
                      <input type="text" className="auth-input" placeholder="Pune" value={city} onChange={e=>setCity(e.target.value)} required />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div style={{ marginBottom:14 }}>
                  <label style={labelStyle}>Email Address</label>
                  <div style={{ position:"relative" }}>
                    <input type="email" className="auth-input" style={{ paddingLeft:44 }} placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required />
                    <span style={iconStyle}></span>
                  </div>
                </div>

                {/* Password */}
                <div style={{ marginBottom:4 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                    <label style={{ ...labelStyle, marginBottom:0 }}>Password</label>
                    {isLogin && <a href="#" style={{ fontSize:"0.72rem", color:"#1A1A1A", fontWeight:700, textDecoration:"underline" }}>Forgot?</a>}
                  </div>
                  <div style={{ position:"relative" }}>
                    <input type={showPw?"text":"password"} className="auth-input" style={{ paddingLeft:44, paddingRight:44 }}
                      placeholder={isLogin?"Enter your password":"Create a strong password"}
                      value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} />
                    <span style={iconStyle}></span>
                    <button type="button" onClick={()=>setShowPw(!showPw)} style={eyeStyle}>{showPw?"🙈":"👁️"}</button>
                  </div>
                </div>

                {/* Strength */}
                {!isLogin && password.length>0 && (
                  <div style={{ marginBottom:14, marginTop:8 }}>
                    <div style={{ background:"#F0F0F0", borderRadius:4, height:4, overflow:"hidden" }}>
                      <div className="strength-bar" style={{ width:`${strength.pct}%`, background:strength.color }} />
                    </div>
                    <div style={{ fontSize:"0.67rem", color:strength.color, marginTop:4, fontWeight:700 }}>{strength.label}</div>
                  </div>
                )}

                {/* Confirm */}
                {!isLogin && (
                  <div style={{ marginBottom:14, marginTop:4 }}>
                    <label style={labelStyle}>Confirm Password</label>
                    <div style={{ position:"relative" }}>
                      <input type={showPw2?"text":"password"} className="auth-input" style={{ paddingLeft:44, paddingRight:44 }}
                        placeholder="Repeat your password"
                        value={confirm} onChange={e=>setConfirm(e.target.value)} required />
                      <span style={iconStyle}>{confirm && confirm===password?"✅":""}</span>
                      <button type="button" onClick={()=>setShowPw2(!showPw2)} style={eyeStyle}>{showPw2?"🙈":"👁️"}</button>
                    </div>
                    {confirm && confirm!==password && (
                      <div style={{ fontSize:"0.68rem", color:"#EF4444", marginTop:4, fontWeight:600 }}>Passwords do not match</div>
                    )}
                  </div>
                )}

                {/* Remember / Terms */}
                <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:22, marginTop:12 }}>
                  <input type="checkbox" className="auth-check" style={{ marginTop:2 }}
                    checked={isLogin?true:agree} onChange={e=>!isLogin&&setAgree(e.target.checked)} required={!isLogin} />
                  <span style={{ fontSize:"0.78rem", color:"#888", lineHeight:1.5 }}>
                    {isLogin ? "Remember me on this device"
                      : <>I agree to the{" "}
                          <a href="#" style={{ color:"#1A1A1A", fontWeight:700, textDecoration:"underline" }}>Terms of Use</a>
                          {" "}and{" "}
                          <a href="#" style={{ color:"#1A1A1A", fontWeight:700, textDecoration:"underline" }}>Privacy Policy</a>
                        </>}
                  </span>
                </div>

                {/* Submit */}
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                      <span style={{ width:16, height:16, border:"2.5px solid #1A1A1A", borderTopColor:"transparent", borderRadius:"50%", display:"inline-block", animation:"spin 0.7s linear infinite" }} />
                      {isLogin?"Signing in...":"Creating account..."}
                    </span>
                  ) : (
                    isLogin?"Sign In →":"Create Free Account →"
                  )}
                </button>

                {/* Switch */}
                <p style={{ textAlign:"center", marginTop:20, marginBottom:0, fontSize:"0.82rem", color:"#AAAAAA" }}>
                  {isLogin?"Don't have an account? ":"Already have an account? "}
                  <button type="button" onClick={()=>switchMode(isLogin?"register":"login")}
                    style={{ background:"none", border:"none", color:"#1A1A1A", fontWeight:800, cursor:"pointer", fontSize:"0.82rem", textDecoration:"underline", fontFamily:"DM Sans,sans-serif", padding:0 }}>
                    {isLogin?"Create one free":"Sign in"}
                  </button>
                </p>

              </form>
            )}

            <div style={{ textAlign:"center", marginTop:20 }}>
              <a href="/" style={{ fontSize:"0.73rem", color:"#CCCCCC", textDecoration:"none", transition:"color .2s" }}
                onMouseEnter={e=>e.target.style.color="#1A1A1A"}
                onMouseLeave={e=>e.target.style.color="#CCCCCC"}>
                ← Back to BookCycle
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}