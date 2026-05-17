import React, { useState, useEffect } from "react";
import axiosInstance from "../library/axios";
import Loading from "../components/Loading";
import { dateFormat } from "../library/dateFormat";

/* ══════════════════════════════════════
   GLOBAL STYLES  (injected once)
══════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .pay-modal-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,0.85);
    backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    animation: overlayIn .2s ease;
  }
  @keyframes overlayIn { from{opacity:0} to{opacity:1} }

  .pay-modal {
    width: 100%; max-width: 420px;
    background: #0e0709;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(220,38,38,0.08);
    animation: modalSlide .3s cubic-bezier(.34,1.36,.64,1);
  }
  @keyframes modalSlide {
    from { opacity:0; transform:translateY(24px) scale(.97); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }

  .method-card {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 16px;
    border-radius: 14px;
    border: 1.5px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.02);
    cursor: pointer;
    transition: all .18s ease;
  }
  .method-card:hover {
    border-color: rgba(220,38,38,0.5);
    background: rgba(220,38,38,0.06);
    transform: translateX(3px);
  }

  .pay-input {
    width: 100%; background: rgba(255,255,255,0.04);
    border: 1.5px solid rgba(255,255,255,0.08);
    border-radius: 10px; color: #fff;
    padding: 12px 14px; font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    outline: none; transition: border .2s; box-sizing: border-box;
  }
  .pay-input:focus { border-color: rgba(220,38,38,0.6); }
  .pay-input::placeholder { color: #444; }

  .pay-btn {
    width: 100%; padding: 14px;
    background: #dc2626; color: #fff;
    border: none; border-radius: 12px;
    font-family: 'Syne', sans-serif;
    font-weight: 700; font-size: 14px;
    letter-spacing: .5px; cursor: pointer;
    transition: background .2s, transform .15s;
  }
  .pay-btn:hover:not(:disabled) { background: #b91c1c; transform: translateY(-1px); }
  .pay-btn:disabled { background: #2a1010; color: #555; cursor: not-allowed; }

  .scan-line {
    position: absolute; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #dc2626 40%, #ff6b6b 50%, #dc2626 60%, transparent);
    box-shadow: 0 0 12px #dc2626;
    animation: scanMove 1.6s ease-in-out infinite;
  }
  @keyframes scanMove {
    0%   { top: 0%;   opacity: 1; }
    45%  { top: 94%;  opacity: 1; }
    50%  { top: 94%;  opacity: 0; }
    55%  { top: 0%;   opacity: 0; }
    60%  { top: 0%;   opacity: 1; }
    100% { top: 0%;   opacity: 1; }
  }

  .tick-circle {
    width: 72px; height: 72px; border-radius: 50%;
    background: rgba(34,197,94,0.1);
    border: 2px solid #22c55e;
    display: flex; align-items: center; justify-content: center;
    animation: popIn .4s cubic-bezier(.34,1.56,.64,1);
  }
  @keyframes popIn {
    from { opacity:0; transform:scale(.4); }
    to   { opacity:1; transform:scale(1); }
  }

  .step-fade { animation: stepFadeIn .25s ease; }
  @keyframes stepFadeIn {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .ticket-perforated {
    border-top: 2px dashed rgba(255,255,255,0.08);
    position: relative;
  }
  .ticket-perforated::before,
  .ticket-perforated::after {
    content: ''; position: absolute; top: -12px;
    width: 22px; height: 22px; border-radius: 50%;
    background: #050505;
  }
  .ticket-perforated::before { left: -12px; }
  .ticket-perforated::after  { right: -12px; }

  @keyframes spinLoader { to { transform: rotate(360deg); } }
  .spin { animation: spinLoader .7s linear infinite; }
`;

/* ══════════════════════════════════════
   QR CODE  (deterministic SVG grid)
══════════════════════════════════════ */
const QRCode = ({ seed = 99 }) => {
  const SIZE = 13, CELL = 11;
  let s = seed;
  const rng = () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };

  const finder = new Set();
  const addFinder = (ro, co) => {
    for (let r = ro; r < ro + 7; r++)
      for (let c = co; c < co + 7; c++) {
        const inBorder = r===ro || r===ro+6 || c===co || c===co+6;
        const inInner  = r>=ro+2 && r<=ro+4 && c>=co+2 && c<=co+4;
        finder.add(`${r},${c}${inBorder||inInner ? "" : "_0"}`);
      }
  };
  addFinder(0,0); addFinder(0,SIZE-7); addFinder(SIZE-7,0);

  const cells = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      const k = `${r},${c}`;
      if (finder.has(k))           cells.push({ r, c });
      else if (!finder.has(k+"_0") && rng() > 0.48) cells.push({ r, c });
    }

  return (
    <svg viewBox={`0 0 ${SIZE*CELL} ${SIZE*CELL}`} width="143" height="143" style={{ display:"block" }}>
      <rect width={SIZE*CELL} height={SIZE*CELL} fill="#fff" rx="6"/>
      {cells.map(({r,c},i) => (
        <rect key={i} x={c*CELL+1} y={r*CELL+1} width={CELL-1} height={CELL-1} fill="#111" rx="1"/>
      ))}
    </svg>
  );
};

/* ══════════════════════════════════════
   PAYMENT METHODS CONFIG
══════════════════════════════════════ */
const METHODS = [
  {
    id: "gpay",
    label: "Google Pay",
    sub: "Pay via your GPay UPI ID",
    icon: (
      <svg viewBox="0 0 48 20" width="46" height="18">
        <text x="0"  y="17" fontSize="19" fontWeight="900" fill="#4285F4" fontFamily="sans-serif">G</text>
        <text x="13" y="17" fontSize="19" fontWeight="900" fill="#EA4335" fontFamily="sans-serif">P</text>
        <text x="26" y="17" fontSize="19" fontWeight="900" fill="#FBBC05" fontFamily="sans-serif">a</text>
        <text x="37" y="17" fontSize="19" fontWeight="900" fill="#34A853" fontFamily="sans-serif">y</text>
      </svg>
    ),
    fields: [{ name:"upi", placeholder:"GPay UPI ID  (eg. name@okaxis)", type:"text" }],
  },
  {
    id: "upi",
    label: "UPI / PhonePe / Paytm",
    sub: "Any UPI app",
    icon: (
      <svg viewBox="0 0 44 22" width="44" height="22">
        <rect width="44" height="22" rx="5" fill="#5f259f"/>
        <text x="5" y="16" fontSize="12" fontWeight="800" fill="#fff" fontFamily="sans-serif">UPI</text>
      </svg>
    ),
    fields: [{ name:"upi", placeholder:"UPI ID  (eg. 9999999999@upi)", type:"text" }],
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    sub: "Visa, Mastercard, RuPay",
    icon: (
      <svg viewBox="0 0 28 20" width="28" height="20" fill="none" stroke="#aaa" strokeWidth="1.5">
        <rect x="1" y="1" width="26" height="18" rx="3"/>
        <path d="M1 7h26"/>
        <rect x="4" y="11" width="6" height="3" rx="1" fill="#aaa" stroke="none"/>
      </svg>
    ),
    fields: [
      { name:"number", placeholder:"Card Number",   type:"text",     maxLength:19 },
      { name:"name",   placeholder:"Name on Card",  type:"text" },
      { name:"expiry", placeholder:"MM / YY",       type:"text",     maxLength:7  },
      { name:"cvv",    placeholder:"CVV",           type:"password", maxLength:3  },
    ],
  },
  {
    id: "wallet",
    label: "Mobile Wallet",
    sub: "Paytm, Amazon Pay, Mobikwik",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#aaa" strokeWidth="1.6">
        <path d="M20 7H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
        <path d="M16 3H8l-2 4h12l-2-4z"/>
        <circle cx="17" cy="13" r="1.5" fill="#aaa" stroke="none"/>
      </svg>
    ),
    fields: [{ name:"phone", placeholder:"Mobile number linked to wallet", type:"tel" }],
  },
  {
    id: "netbanking",
    label: "Net Banking",
    sub: "All major banks supported",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#aaa" strokeWidth="1.6">
        <path d="M3 9l9-7 9 7H3z"/>
        <rect x="5" y="9" width="3" height="8"/>
        <rect x="10.5" y="9" width="3" height="8"/>
        <rect x="16" y="9" width="3" height="8"/>
        <path d="M2 17h20"/>
      </svg>
    ),
    fields: [
      { name:"bank",   placeholder:"Bank name  (eg. SBI, HDFC…)",  type:"text" },
      { name:"userid", placeholder:"Net Banking User ID",          type:"text" },
    ],
  },
];

/* ══════════════════════════════════════
   TICKET MODAL  (after payment success)
══════════════════════════════════════ */
const TicketModal = ({ booking, currency, onClose }) => {
  const [phase, setPhase] = useState("scanning");

  useEffect(() => {
    const t = setTimeout(() => setPhase("done"), 2600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="pay-modal-overlay" onClick={onClose}>
      <div
        className="pay-modal"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth:380, background:"linear-gradient(160deg,#150810 0%,#0a0a0a 100%)" }}
      >
        {/* Header */}
        <div style={{ background:"#b91c1c", padding:"18px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <p style={{ fontSize:10, letterSpacing:3, color:"rgba(255,255,255,0.65)", textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif" }}>Autoaid Cinema</p>
            <p style={{ fontSize:18, fontWeight:800, color:"#fff", fontFamily:"'Syne',sans-serif", marginTop:2 }}>E‑Ticket</p>
          </div>
          <button
            onClick={onClose}
            style={{ background:"rgba(0,0,0,0.25)", border:"none", borderRadius:"50%", width:34, height:34, color:"rgba(255,255,255,0.7)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Movie info */}
        <div style={{ padding:"20px 24px 16px" }}>
          <p style={{ fontSize:18, fontWeight:800, color:"#fff", fontFamily:"'Syne',sans-serif", marginBottom:14 }}>
            {booking.show.movie.title}
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 0" }}>
            {[
              ["Date",   dateFormat(booking.date)],
              ["Time",   booking.time],
              ["Seats",  booking.seats.join(", ")],
              ["Amount", `${currency}${booking.amount}`],
            ].map(([l,v]) => (
              <div key={l}>
                <p style={{ fontSize:9, letterSpacing:2, color:"#555", textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif" }}>{l}</p>
                <p style={{ fontSize:13, fontWeight:600, color:"#ccc", marginTop:3, fontFamily:"'DM Sans',sans-serif" }}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Perforated tear */}
        <div className="ticket-perforated" style={{ margin:"0 24px" }}/>

        {/* QR / success */}
        <div style={{ padding:"24px", display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
          {phase === "scanning" ? (
            <>
              <div style={{ position:"relative", borderRadius:10, overflow:"hidden", border:"1.5px solid rgba(220,38,38,0.35)" }}>
                <QRCode seed={booking.seats.length * 17 + 3}/>
                <div className="scan-line"/>
                {/* corner brackets */}
                {[
                  { top:0,    left:0,  borderTop:"2.5px solid #dc2626", borderLeft:"2.5px solid #dc2626" },
                  { top:0,    right:0, borderTop:"2.5px solid #dc2626", borderRight:"2.5px solid #dc2626" },
                  { bottom:0, left:0,  borderBottom:"2.5px solid #dc2626", borderLeft:"2.5px solid #dc2626" },
                  { bottom:0, right:0, borderBottom:"2.5px solid #dc2626", borderRight:"2.5px solid #dc2626" },
                ].map((s,i) => (
                  <div key={i} style={{ position:"absolute", width:18, height:18, ...s }}/>
                ))}
              </div>
              <p style={{ fontSize:11, color:"#555", letterSpacing:1.5, fontFamily:"'DM Sans',sans-serif", textTransform:"uppercase" }}>
                Verifying ticket…
              </p>
            </>
          ) : (
            <div className="step-fade" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
              <div className="tick-circle">
                <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#22c55e" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p style={{ fontSize:16, fontWeight:700, color:"#22c55e", fontFamily:"'Syne',sans-serif" }}>Ticket Verified!</p>
              <p style={{ fontSize:12, color:"#555", fontFamily:"'DM Sans',sans-serif", textAlign:"center", maxWidth:200 }}>
                Enjoy the show. Please show this at the entrance.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   PAYMENT MODAL
══════════════════════════════════════ */
const PaymentModal = ({ booking, currency, onClose, onSuccess }) => {
  const [step, setStep]         = useState("methods"); // methods | details | processing | done
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({});

  const method = METHODS.find(m => m.id === selected);

  const handleSelect = (id) => {
    setSelected(id);
    setFormData({});
    setStep("details");
  };

  const handlePay = () => {
    setStep("processing");
    setTimeout(() => {
      setStep("done");
      setTimeout(onSuccess, 1200);
    }, 2000);
  };

  const handleChange = (name, rawValue) => {
    let v = rawValue;
    if (selected === "card" && name === "number") {
      v = rawValue.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
    }
    if (selected === "card" && name === "expiry") {
      v = rawValue.replace(/\D/g,"").slice(0,4);
      if (v.length > 2) v = v.slice(0,2) + " / " + v.slice(2);
    }
    setFormData(p => ({ ...p, [name]: v }));
  };

  const allFilled = method?.fields.every(f => formData[f.name]?.trim());

  // shared header styles
  const labelStyle = { fontSize:10, letterSpacing:3, color:"#555", textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif" };
  const titleStyle = { fontSize:20, fontWeight:800, color:"#fff", fontFamily:"'Syne',sans-serif", marginTop:2 };

  return (
    <div className="pay-modal-overlay" onClick={onClose}>
      <div className="pay-modal" onClick={e => e.stopPropagation()}>

        {/* ─── Header ─── */}
        <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid rgba(255,255,255,0.05)", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            {step === "details" && (
              <button
                onClick={() => setStep("methods")}
                style={{ background:"none", border:"none", color:"#666", cursor:"pointer", fontSize:12, fontFamily:"'DM Sans',sans-serif", padding:0, marginBottom:6, display:"flex", alignItems:"center", gap:4 }}
              >
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round"/></svg>
                Back
              </button>
            )}
            <p style={labelStyle}>
              { step==="methods" ? "Choose Payment" : step==="details" ? method?.label : step==="processing" ? "Processing" : "All Done" }
            </p>
            <p style={titleStyle}>{currency}{booking.amount}</p>
          </div>

          {step !== "processing" && (
            <button
              onClick={onClose}
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"50%", width:34, height:34, color:"#666", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
            </button>
          )}
        </div>

        {/* ─── Movie pill ─── */}
        <div style={{ padding:"10px 24px", background:"rgba(255,255,255,0.02)", borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#dc2626", flexShrink:0 }}/>
          <p style={{ fontSize:12, color:"#888", fontFamily:"'DM Sans',sans-serif" }}>
            <span style={{ color:"#ccc", fontWeight:500 }}>{booking.show.movie.title}</span>
            {" · "}{booking.seats.length} seat{booking.seats.length > 1 ? "s" : ""}
            {" · "}{booking.seats.join(", ")}
          </p>
        </div>

        {/* ─── STEP: Methods ─── */}
        {step === "methods" && (
          <div className="step-fade" style={{ padding:"20px 20px 24px", display:"flex", flexDirection:"column", gap:8 }}>
            {METHODS.map(m => (
              <div key={m.id} className="method-card" onClick={() => handleSelect(m.id)}>
                <div style={{ width:46, display:"flex", justifyContent:"center", flexShrink:0 }}>{m.icon}</div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:13, fontWeight:600, color:"#e0e0e0", fontFamily:"'Syne',sans-serif" }}>{m.label}</p>
                  <p style={{ fontSize:11, color:"#555", marginTop:2, fontFamily:"'DM Sans',sans-serif" }}>{m.sub}</p>
                </div>
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#444" strokeWidth="2"><path d="M9 6l6 6-6 6" strokeLinecap="round"/></svg>
              </div>
            ))}
          </div>
        )}

        {/* ─── STEP: Details ─── */}
        {step === "details" && method && (
          <div className="step-fade" style={{ padding:"20px 24px 24px", display:"flex", flexDirection:"column", gap:12 }}>
            {method.fields.map(f => (
              <input
                key={f.name}
                className="pay-input"
                type={f.type}
                placeholder={f.placeholder}
                maxLength={f.maxLength}
                value={formData[f.name] || ""}
                onChange={e => handleChange(f.name, e.target.value)}
              />
            ))}

            <button
              className="pay-btn"
              style={{ marginTop:8 }}
              onClick={handlePay}
              disabled={!allFilled}
            >
              Pay {currency}{booking.amount}
            </button>

            <p style={{ textAlign:"center", fontSize:10, color:"#2e2e2e", fontFamily:"'DM Sans',sans-serif", letterSpacing:1 }}>
              🔒 SECURED · 256-BIT SSL · DEMO ONLY
            </p>
          </div>
        )}

        {/* ─── STEP: Processing ─── */}
        {step === "processing" && (
          <div className="step-fade" style={{ padding:"52px 24px", display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>
            <svg className="spin" viewBox="0 0 24 24" width="48" height="48" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(220,38,38,0.15)" strokeWidth="3"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="#dc2626" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <p style={{ fontSize:14, color:"#666", fontFamily:"'DM Sans',sans-serif" }}>Processing payment…</p>
          </div>
        )}

        {/* ─── STEP: Done ─── */}
        {step === "done" && (
          <div className="step-fade" style={{ padding:"44px 24px", display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
            <div className="tick-circle">
              <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#22c55e" strokeWidth="2.5">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={{ fontSize:16, fontWeight:700, color:"#22c55e", fontFamily:"'Syne',sans-serif" }}>Payment Successful!</p>
            <p style={{ fontSize:12, color:"#555", fontFamily:"'DM Sans',sans-serif" }}>Opening your ticket…</p>
          </div>
        )}

      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════ */
const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";

  const [bookings, setBookings]         = useState([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [payTarget, setPayTarget]       = useState(null);
  const [ticketTarget, setTicketTarget] = useState(null);
  const [localPaidIds, setLocalPaidIds] = useState(new Set()); // track payments made this session

const getMyBookings = async () => {
  try {
    const res = await axiosInstance.get("/api/bookings/my");
    if (res.data.success) setBookings(res.data.bookings);
  } catch (err) {
    console.log(err);
  } finally {
    setIsLoading(false);
  }
};
  useEffect(() => { getMyBookings(); }, []);

  if (isLoading) return <Loading />;

  return (
    <>
      <style>{STYLES}</style>

      <div
        style={{ fontFamily:"'DM Sans', sans-serif" }}
        className="relative px-6 md:px-16 lg:px-40 pt-32 md:pt-40 min-h-screen bg-[#050505] text-white pb-20"
      >
        <h1 style={{ fontFamily:"'Syne',sans-serif" }} className="text-xl font-bold mb-8 tracking-wide">
          My Bookings
        </h1>

        <div className="flex flex-col gap-6">
          {bookings.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row justify-between bg-[#120b0e] border border-white/5 rounded-2xl p-3 md:p-4 max-w-4xl"
              style={{ transition:"box-shadow .2s" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow="0 0 0 1px rgba(220,38,38,0.15)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow="none"}
            >
              {/* LEFT */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative overflow-hidden rounded-xl w-full md:w-48 lg:w-56 aspect-video">
                  <img
                    src={
                      item.show.movie.posterUrl?.startsWith("http")
                        ? item.show.movie.posterUrl
                        : `${import.meta.env.VITE_BACKEND_URL}${item.show.movie.posterUrl}`
                    }
                    alt={item.show.movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col justify-center py-2">
                  <p style={{ fontFamily:"'Syne',sans-serif" }} className="text-lg font-bold">
                    {item.show.movie.title}
                  </p>
                  <p className="text-gray-400 text-sm mt-3">
                    {dateFormat(item.date)} | {item.time}
                  </p>

                  {/* Show Paid badge if paid on server OR just paid this session */}
                  {(item.isPaid || localPaidIds.has(item._id)) && (
                    <span style={{ display:"inline-flex", alignItems:"center", gap:5, marginTop:10, fontSize:10, letterSpacing:1.5, color:"#22c55e", textTransform:"uppercase", fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>
                      <span style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", display:"inline-block" }}/>
                      Paid
                    </span>
                  )}
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex flex-col md:items-end justify-between mt-4 md:mt-0">
                <div className="flex items-center gap-4">
                  <p style={{ fontFamily:"'Syne',sans-serif" }} className="text-2xl font-black">
                    {currency}{item.amount}
                  </p>

                  {/* Show Pay Now only if NOT paid (server or local) */}
                  {!item.isPaid && !localPaidIds.has(item._id) && (
                    <button
                      onClick={() => setPayTarget(item)}
                      style={{
                        background:"linear-gradient(135deg,#dc2626,#991b1b)",
                        border:"none", borderRadius:8,
                        color:"#fff", padding:"7px 18px",
                        fontSize:11, fontWeight:700,
                        fontFamily:"'Syne',sans-serif",
                        letterSpacing:.5, cursor:"pointer",
                        transition:"transform .15s, box-shadow .15s",
                        boxShadow:"0 4px 14px rgba(220,38,38,0.35)",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 6px 20px rgba(220,38,38,0.5)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 14px rgba(220,38,38,0.35)"; }}
                    >
                      Pay Now
                    </button>
                  )}

                  {/* Show View Ticket once paid (server or local session) */}
                  {(item.isPaid || localPaidIds.has(item._id)) && (
                    <button
                      onClick={() => setTicketTarget(item)}
                      style={{
                        background:"rgba(34,197,94,0.08)",
                        border:"1px solid rgba(34,197,94,0.3)",
                        borderRadius:8, color:"#22c55e",
                        padding:"7px 16px", fontSize:11,
                        fontWeight:700, fontFamily:"'Syne',sans-serif",
                        letterSpacing:.5, cursor:"pointer",
                        transition:"background .15s",
                        animation: localPaidIds.has(item._id) ? "popIn .4s cubic-bezier(.34,1.56,.64,1)" : "none",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background="rgba(34,197,94,0.16)"}
                      onMouseLeave={e => e.currentTarget.style.background="rgba(34,197,94,0.08)"}
                    >
                      View Ticket
                    </button>
                  )}
                </div>

                <div className="text-sm mt-3">
                  <p>Total Tickets: <span className="font-bold">{item.seats.length}</span></p>
                  <p>Seats: <span style={{ color:"#f87171", fontWeight:700 }}>{item.seats.join(", ")}</span></p>
                </div>
              </div>
            </div>
          ))}

          {bookings.length === 0 && (
            <div className="py-20 text-center text-gray-500">No bookings found.</div>
          )}
        </div>
      </div>

      {/* ── Payment Modal ── */}
      {payTarget && (
        <PaymentModal
          booking={payTarget}
          currency={currency}
          onClose={() => setPayTarget(null)}
          onSuccess={() => {
            const paid = payTarget;
            // Mark as paid locally so button flips immediately
            setLocalPaidIds(prev => new Set([...prev, paid._id]));
            setPayTarget(null);
            // Auto-open ticket scanner right after
            setTimeout(() => setTicketTarget(paid), 350);
          }}
        />
      )}

      {/* ── Ticket Scanner Modal ── */}
      {ticketTarget && (
        <TicketModal
          booking={ticketTarget}
          currency={currency}
          onClose={() => setTicketTarget(null)}
        />
      )}
    </>
  );
};

export default MyBookings;