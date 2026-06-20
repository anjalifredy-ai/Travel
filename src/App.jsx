import { useState, useEffect } from "react";

const ORANGE = "#FF6B00";
const CITIES = ["Delhi","Mumbai","Bangalore","Hyderabad","Chennai","Kolkata","Pune","Ahmedabad","Jaipur","Goa","Lucknow","Chandigarh","Surat","Kochi","Indore","Bhopal","Nagpur","Patna","Bhubaneswar","Visakhapatnam"];

const BUSES = [
  { op:"Raj Express Travels", type:"Volvo AC Sleeper", dep:"21:00", arr:"05:00+1", dur:"8h", price:850, seats:14, tags:["AC","Sleeper","USB Charging","Water Bottle"], rating:4.3 },
  { op:"ShubhYatra Tours", type:"Multi-Axle AC Sleeper", dep:"22:30", arr:"06:30+1", dur:"8h", price:1100, seats:6, tags:["AC","Sleeper","WiFi","Blanket","USB"], rating:4.6 },
  { op:"NightRider Pvt.", type:"Semi-Sleeper AC", dep:"20:00", arr:"04:30+1", dur:"8.5h", price:750, seats:22, tags:["AC","Semi-Sleeper","USB"], rating:4.1 },
  { op:"IntrCity SmartBus", type:"Volvo AC Seater", dep:"07:00", arr:"13:30", dur:"6.5h", price:650, seats:30, tags:["AC","Seater","WiFi","Live Track"], rating:4.5 },
  { op:"GreenLine EV Bus", type:"Electric Sleeper", dep:"23:00", arr:"07:00+1", dur:"8h", price:999, seats:18, tags:["AC","EV Bus","USB","Water"], rating:4.4 },
  { op:"SRS Travels", type:"Non-AC Sleeper", dep:"19:30", arr:"03:30+1", dur:"8h", price:450, seats:35, tags:["Non-AC","Sleeper"], rating:3.8 },
];
const FLIGHTS = [
  { al:"IndiGo", code:"6E-101", dep:"06:00", arr:"08:10", dur:"2h 10m", price:1299, stops:"Non-stop", baggage:"15kg" },
  { al:"Air India", code:"AI-202", dep:"09:30", arr:"11:55", dur:"2h 25m", price:1899, stops:"Non-stop", baggage:"25kg" },
  { al:"Akasa Air", code:"QP-305", dep:"14:00", arr:"16:05", dur:"2h 05m", price:1149, stops:"Non-stop", baggage:"15kg" },
  { al:"SpiceJet", code:"SG-411", dep:"18:45", arr:"21:00", dur:"2h 15m", price:999, stops:"Non-stop", baggage:"15kg" },
  { al:"Air India Express", code:"IX-507", dep:"11:00", arr:"13:20", dur:"2h 20m", price:1049, stops:"Non-stop", baggage:"20kg" },
];
const TRAINS = [
  { name:"Rajdhani Express", num:"12301", dep:"16:55", arr:"10:25+1", dur:"17h 30m", price:945, classes:["SL","3A","2A","1A"], avail:"Available" },
  { name:"Shatabdi Express", num:"12002", dep:"06:00", arr:"11:30", dur:"5h 30m", price:755, classes:["CC","EC"], avail:"Available" },
  { name:"Duronto Express", num:"12213", dep:"23:15", arr:"15:45+1", dur:"16h 30m", price:1205, classes:["SL","3A","2A"], avail:"WL 4" },
  { name:"Gatimaan Express", num:"12049", dep:"08:10", arr:"10:00", dur:"1h 50m", price:680, classes:["CC","EC"], avail:"Available" },
];
const HOTELS = [
  { name:"The Grand Palace Hotel", stars:5, price:4999, rating:4.8, reviews:2341, tags:["Free Breakfast","Pool","Spa","Free Cancellation"] },
  { name:"Comfort Suites Inn", stars:4, price:2499, rating:4.5, reviews:1203, tags:["Free WiFi","AC","Free Cancellation"] },
  { name:"Budget Stay Express", stars:3, price:999, rating:4.1, reviews:876, tags:["Free WiFi","AC","Parking"] },
  { name:"Royal Heritage Resort", stars:5, price:7999, rating:4.9, reviews:543, tags:["Heritage","Pool","Free Breakfast","Spa"] },
];
const OFFERS = [
  { emoji:"🎉", bg:"linear-gradient(135deg,#FF6B00,#FF8C00)", title:"Flat ₹500 Off – First Booking", code:"SETU500" },
  { emoji:"✈️", bg:"linear-gradient(135deg,#1565C0,#1976D2)", title:"Flights from ₹999 – IndiGo", code:"FLY999" },
  { emoji:"🏨", bg:"linear-gradient(135deg,#00897B,#00ACC1)", title:"Hotels up to 60% OFF", code:"HOTEL60" },
  { emoji:"📱", bg:"linear-gradient(135deg,#6A1B9A,#8E24AA)", title:"25% Off on App Booking", code:"GETAPP" },
  { emoji:"💳", bg:"linear-gradient(135deg,#B71C1C,#D32F2F)", title:"₹300 Off – HDFC Card", code:"HDFCFLY" },
  { emoji:"🚌", bg:"linear-gradient(135deg,#33691E,#558B2F)", title:"15% Off – Bus Booking", code:"BUS15" },
];
const ROUTES = [
  { from:"Delhi", to:"Mumbai", price:"₹1,299", icon:"✈️", type:"flight" },
  { from:"Mumbai", to:"Goa", price:"₹999", icon:"✈️", type:"flight" },
  { from:"Delhi", to:"Bangalore", price:"₹1,599", icon:"✈️", type:"flight" },
  { from:"Bangalore", to:"Hyderabad", price:"₹1,149", icon:"✈️", type:"flight" },
  { from:"Chennai", to:"Delhi", price:"₹2,099", icon:"✈️", type:"flight" },
  { from:"Kolkata", to:"Mumbai", price:"₹1,799", icon:"✈️", type:"flight" },
];

// ── AutoComplete Input ──
function AutoInput({ id, placeholder, value, onChange, icon }) {
  const [show, setShow] = useState(false);
  const filtered = CITIES.filter(c => c.toLowerCase().includes(value.toLowerCase()) && value.length > 0);
  return (
    <div style={{ position:"relative", flex:1, minWidth:130 }}>
      <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", fontSize:"1rem", zIndex:1, pointerEvents:"none" }}>{icon}</span>
      <input
        value={value}
        onChange={e => { onChange(e.target.value); setShow(true); }}
        onFocus={() => setShow(true)}
        onBlur={() => setTimeout(() => setShow(false), 150)}
        placeholder={placeholder}
        style={{ width:"100%", padding:"11px 12px 11px 34px", border:"1.5px solid #E5E7EB", borderRadius:10, fontFamily:"inherit", fontSize:"0.88rem", outline:"none", background:"#FAFBFF", transition:"border .2s" }}
        onMouseOver={e => e.target.style.borderColor = ORANGE}
        onMouseOut={e => e.target.style.borderColor = "#E5E7EB"}
      />
      {show && filtered.length > 0 && (
        <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, background:"#fff", border:"1px solid #E5E7EB", borderRadius:10, boxShadow:"0 8px 24px rgba(0,0,0,.12)", zIndex:999, maxHeight:200, overflowY:"auto" }}>
          {filtered.map(c => (
            <div key={c} onClick={() => { onChange(c); setShow(false); }}
              style={{ padding:"9px 14px", cursor:"pointer", fontSize:"0.85rem", fontWeight:600, display:"flex", alignItems:"center", gap:8 }}
              onMouseOver={e => e.currentTarget.style.background = "#FFF2E7"}
              onMouseOut={e => e.currentTarget.style.background = "#fff"}
            >
              📍 {c}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Star Rating ──
function Stars({ n }) {
  return <span style={{ color:"#FF6B00", fontSize:"0.75rem" }}>{"★".repeat(Math.floor(n))}{"☆".repeat(5 - Math.floor(n))}</span>;
}

// ── Modal ──
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:"#fff", borderRadius:18, padding:"28px 24px", maxWidth:400, width:"100%", position:"relative", maxHeight:"90vh", overflowY:"auto" }}>
        <button onClick={onClose} style={{ position:"absolute", top:14, right:16, background:"none", border:"none", fontSize:"1.4rem", cursor:"pointer", color:"#6B7280" }}>✕</button>
        {children}
      </div>
    </div>
  );
}

// ── Results Sheet ──
function ResultsSheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:900, display:"flex", alignItems:"flex-end" }}>
      <div onClick={e => e.stopPropagation()} style={{ background:"#F8F9FA", borderRadius:"24px 24px 0 0", width:"100%", maxHeight:"88vh", overflowY:"auto", padding:"20px 16px 100px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ fontSize:"1rem", fontWeight:800 }}>{title}</div>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:"1.4rem", cursor:"pointer", color:"#6B7280" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Section Header ──
function SH({ title, em, action }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
      <div style={{ fontSize:"1.05rem", fontWeight:800, color:"#1A1A2E" }}>{title} <span style={{ color:ORANGE }}>{em}</span></div>
      {action && <span onClick={action.fn} style={{ fontSize:"0.8rem", fontWeight:700, color:ORANGE, cursor:"pointer" }}>{action.label}</span>}
    </div>
  );
}

// ── Chip ──
function Chip({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding:"5px 13px", borderRadius:20, border:`1.5px solid ${active ? ORANGE : "#E5E7EB"}`,
      background: active ? "#FFF2E7" : "#fff", color: active ? ORANGE : "#6B7280",
      fontSize:"0.75rem", fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"inherit"
    }}>{label}</button>
  );
}

// ── Main App ──
export default function App() {
  const [activeTab, setActiveTab] = useState("flights");
  const [loginOpen, setLoginOpen] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [resultsTitle, setResultsTitle] = useState("");
  const [resultsType, setResultsType] = useState("");
  const [tripType, setTripType] = useState("oneway");
  const [specialFare, setSpecialFare] = useState("");
  const [filterBus, setFilterBus] = useState("All");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [copiedCode, setCopiedCode] = useState("");

  // Flight fields
  const [fFrom, setFFrom] = useState("Delhi");
  const [fTo, setFTo] = useState("Mumbai");
  const [fDate, setFDate] = useState("");
  const [fClass, setFClass] = useState("Economy");

  // Bus fields
  const [bFrom, setBFrom] = useState("Delhi");
  const [bTo, setBTo] = useState("Jaipur");
  const [bDate, setBDate] = useState("");

  // Train fields
  const [tFrom, setTFrom] = useState("New Delhi");
  const [tTo, setTTo] = useState("Mumbai CST");
  const [tDate, setTDate] = useState("");
  const [tClass, setTClass] = useState("All");

  // Hotel fields
  const [hCity, setHCity] = useState("Mumbai");
  const [hIn, setHIn] = useState("");
  const [hOut, setHOut] = useState("");

  // Date strip
  const [selDate, setSelDate] = useState(0);
  const dates = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return { d, label: d.getDate(), day: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()] };
  });

  useEffect(() => {
    const t = new Date();
    const fmt = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    setFDate(fmt(t));
    setBDate(fmt(t));
    setTDate(fmt(t));
    const t2 = new Date(t); t2.setDate(t.getDate()+1);
    setHIn(fmt(t)); setHOut(fmt(t2));
  }, []);

  function doSearch() {
    if (activeTab === "flights") {
      if (!fFrom || !fTo) return alert("Please enter From and To city!");
      setResultsTitle(`✈️ ${fFrom} → ${fTo}`);
      setResultsType("flight");
    } else if (activeTab === "buses") {
      if (!bFrom || !bTo) return alert("Please enter From and To city!");
      setResultsTitle(`🚌 ${bFrom} → ${bTo}`);
      setResultsType("bus");
    } else if (activeTab === "trains") {
      if (!tFrom || !tTo) return alert("Please enter From and To station!");
      setResultsTitle(`🚆 ${tFrom} → ${tTo}`);
      setResultsType("train");
    } else if (activeTab === "hotels") {
      if (!hCity) return alert("Please enter city!");
      setResultsTitle(`🏨 Hotels in ${hCity}`);
      setResultsType("hotel");
    }
    setResultsOpen(true);
  }

  function copyCode(code) {
    navigator.clipboard?.writeText(code).catch(()=>{});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  }

  const busFiltered = filterBus === "All" ? BUSES :
    filterBus === "AC" ? BUSES.filter(b => b.tags.includes("AC")) :
    filterBus === "Non-AC" ? BUSES.filter(b => b.tags.includes("Non-AC")) :
    filterBus === "Sleeper" ? BUSES.filter(b => b.tags.includes("Sleeper")) :
    filterBus === "WiFi" ? BUSES.filter(b => b.tags.includes("WiFi")) :
    [...BUSES].sort((a,b) => a.price - b.price);

  const tabs = [
    { id:"flights", icon:"✈️", label:"Flights" },
    { id:"hotels", icon:"🏨", label:"Hotels" },
    { id:"trains", icon:"🚆", label:"Trains" },
    { id:"buses", icon:"🚌", label:"Buses" },
  ];

  const iBtn = { background:ORANGE, color:"#fff", border:"none", padding:"11px 26px", borderRadius:10, fontFamily:"inherit", fontSize:"0.9rem", fontWeight:800, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 };
  const iSelect = { width:"100%", padding:"11px 12px 11px 34px", border:"1.5px solid #E5E7EB", borderRadius:10, fontFamily:"inherit", fontSize:"0.85rem", outline:"none", background:"#FAFBFF", cursor:"pointer" };
  const iInput = { width:"100%", padding:"11px 12px", border:"1.5px solid #E5E7EB", borderRadius:10, fontFamily:"inherit", fontSize:"0.88rem", outline:"none", background:"#FAFBFF" };
  const iLabel = { display:"block", fontSize:"0.67rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", color:"#6B7280", marginBottom:5 };

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", background:"#F8F9FA", minHeight:"100vh", color:"#2C2C2C" }}>

      {/* TOPBAR */}
      <div style={{ background:"#1A1A2E", color:"rgba(255,255,255,.8)", fontSize:"0.75rem", textAlign:"center", padding:"5px 12px" }}>
        ✈️ App pe book karo — Code: <b style={{ color:"#FFD54F" }}>GETAPP</b> se milega 25% extra OFF &nbsp;|&nbsp; India's fastest travel booking 🇮🇳
      </div>

      {/* NAVBAR */}
      <nav style={{ background:"#fff", borderBottom:"1px solid #E5E7EB", height:58, display:"flex", alignItems:"center", padding:"0 20px", gap:16, position:"sticky", top:0, zIndex:200, boxShadow:"0 1px 6px rgba(0,0,0,.06)" }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:9, flexShrink:0, cursor:"pointer" }}>
          <div style={{ width:36, height:36, borderRadius:10, background:`linear-gradient(135deg,${ORANGE},#FF8C00)`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:"#fff", fontSize:"1rem" }}>Y</div>
          <span style={{ fontSize:"1.2rem", fontWeight:900, color:"#1A1A2E", letterSpacing:"-0.5px" }}>Yatra<span style={{ color:ORANGE }}>Setu</span></span>
        </div>

        {/* Nav pills */}
        <div style={{ display:"flex", gap:2, flex:1, justifyContent:"center", overflow:"auto" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              display:"flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:8, border:"none",
              background: activeTab === t.id ? "#FFF2E7" : "none",
              color: activeTab === t.id ? ORANGE : "#6B7280",
              fontFamily:"inherit", fontSize:"0.82rem", fontWeight:700, cursor:"pointer"
            }}><span>{t.icon}</span>{t.label}</button>
          ))}
        </div>

        {/* Right */}
        <div style={{ display:"flex", gap:8, alignItems:"center", flexShrink:0 }}>
          <span style={{ fontSize:"0.8rem", color:"#6B7280", cursor:"pointer", fontWeight:500 }}>Offers</span>
          <span style={{ fontSize:"0.8rem", color:"#6B7280", cursor:"pointer", fontWeight:500 }}>Help</span>
          <button onClick={() => setLoginOpen(true)} style={{ background:ORANGE, color:"#fff", border:"none", padding:"7px 16px", borderRadius:8, fontFamily:"inherit", fontSize:"0.82rem", fontWeight:700, cursor:"pointer" }}>
            Login / Sign Up
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background:"linear-gradient(160deg,#1A1A2E 0%,#2D1B00 55%,#4A2800 100%)", padding:"36px 20px 0", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:360, height:360, background:`radial-gradient(circle,rgba(255,107,0,.18) 0%,transparent 70%)`, borderRadius:"50%" }} />
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:48, background:"#F8F9FA", borderRadius:"24px 24px 0 0" }} />

        <div style={{ maxWidth:960, margin:"0 auto", position:"relative", zIndex:1 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(255,107,0,.18)", border:"1px solid rgba(255,107,0,.4)", color:"#FFB74D", fontSize:"0.73rem", fontWeight:700, padding:"4px 12px", borderRadius:20, marginBottom:14 }}>
            🇮🇳 India's Fastest Growing Travel Platform
          </div>
          <div style={{ color:"#fff", fontSize:"clamp(1.3rem,3.5vw,2rem)", fontWeight:900, lineHeight:1.2, marginBottom:6 }}>
            Book <span style={{ color:ORANGE }}>Flights, Trains,</span><br />Buses & Hotels — Sab Ek Jagah
          </div>
          <div style={{ color:"rgba(255,255,255,.6)", fontSize:"0.87rem", marginBottom:24 }}>
            Lowest fares · Instant confirmation · 24/7 support · Free cancellation
          </div>

          {/* SEARCH CARD */}
          <div style={{ background:"#fff", borderRadius:18, boxShadow:"0 12px 48px rgba(0,0,0,.22)", overflow:"hidden" }}>
            {/* Tabs inside card */}
            <div style={{ display:"flex", borderBottom:"1px solid #E5E7EB", overflowX:"auto" }}>
              {[...tabs, { id:"holidays", icon:"🌴", label:"Holidays" }].map(t => (
                <button key={t.id} onClick={() => { setActiveTab(t.id === "holidays" ? "holidays" : t.id); }} style={{
                  flexShrink:0, padding:"13px 18px", border:"none", borderBottom:`2px solid ${activeTab===t.id ? ORANGE : "transparent"}`,
                  background:"none", fontFamily:"inherit", fontSize:"0.81rem", fontWeight:700,
                  color: activeTab===t.id ? ORANGE : "#6B7280", cursor:"pointer", display:"flex", alignItems:"center", gap:6
                }}>{t.icon} {t.label}</button>
              ))}
            </div>

            <div style={{ padding:"22px 20px 20px" }}>

              {/* FLIGHTS */}
              {activeTab === "flights" && (
                <div>
                  <div style={{ display:"flex", gap:16, marginBottom:16, flexWrap:"wrap" }}>
                    {[["oneway","One Way"],["roundtrip","Round Trip"],["multicity","Multi-City"]].map(([v,l]) => (
                      <label key={v} style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.82rem", fontWeight:700, cursor:"pointer" }}>
                        <input type="radio" name="ft" checked={tripType===v} onChange={() => setTripType(v)} style={{ accentColor:ORANGE }} /> {l}
                      </label>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"flex-end" }}>
                    <div style={{ flex:1, minWidth:130 }}>
                      <label style={iLabel}>From</label>
                      <AutoInput icon="🛫" placeholder="Delhi (DEL)" value={fFrom} onChange={setFFrom} />
                    </div>
                    <button onClick={() => { const t=fFrom; setFFrom(fTo); setFTo(t); }} style={{ width:34, height:34, borderRadius:"50%", border:`1.5px solid #FFE0C2`, background:"#FFF2E7", color:ORANGE, cursor:"pointer", fontSize:"0.9rem", flexShrink:0, marginBottom:2 }}>⇄</button>
                    <div style={{ flex:1, minWidth:130 }}>
                      <label style={iLabel}>To</label>
                      <AutoInput icon="🛬" placeholder="Mumbai (BOM)" value={fTo} onChange={setFTo} />
                    </div>
                    <div style={{ minWidth:140, flex:1 }}>
                      <label style={iLabel}>Depart</label>
                      <input type="date" value={fDate} onChange={e => setFDate(e.target.value)} style={iInput} />
                    </div>
                    {tripType === "roundtrip" && (
                      <div style={{ minWidth:140, flex:1 }}>
                        <label style={iLabel}>Return</label>
                        <input type="date" style={iInput} />
                      </div>
                    )}
 
