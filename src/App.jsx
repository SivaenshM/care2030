import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";

// ─── CONTEXT & STATE ───────────────────────────────────────────────
const AppContext = createContext();
const useApp = () => useContext(AppContext);

// ─── MOCK DATA ─────────────────────────────────────────────────────
const CITIES = ["Kanyakumari", "Tirunelveli", "Thoothukudi", "Madurai"];
const TAMIL = {
  "Care 2030": "கேர் 2030",
  "Trusted hospital visit assistance": "நம்பகமான மருத்துவமனை வருகை உதவி",
  "Book Assistance": "உதவி முன்பதிவு",
  "Elder Care": "முதியோர் பராமரிப்பு",
  "Pregnancy Care": "கர்ப்பகால பராமரிப்பு",
  "Services": "சேவைகள்",
  "Home": "முகப்பு",
  "Hospitals": "மருத்துவமனைகள்",
  "Book Now": "இப்போது முன்பதிவு",
  "Login": "உள்நுழைய",
  "Sign Up": "பதிவு செய்ய",
  "How It Works": "எப்படி செயல்படுகிறது",
};

const PROVIDERS = [
  { id: "p1", name: "KK Multi Speciality Hospital", city: "Kanyakumari", type: "hospital", area: "Nagercoil", hours: "24/7", phone: "+91 4652 234567", rating: 4.5, img: "🏥" },
  { id: "p2", name: "Rani Hospital", city: "Kanyakumari", type: "hospital", area: "Marthandam", hours: "8AM–10PM", phone: "+91 4652 345678", rating: 4.2, img: "🏥" },
  { id: "p3", name: "Tirunelveli Medical College", city: "Tirunelveli", type: "hospital", area: "High Ground", hours: "24/7", phone: "+91 462 2572622", rating: 4.6, img: "🏥" },
  { id: "p4", name: "Gem Hospital", city: "Tirunelveli", type: "hospital", area: "Vannarpettai", hours: "24/7", phone: "+91 462 2332211", rating: 4.4, img: "🏥" },
  { id: "p5", name: "Thoothukudi GH", city: "Thoothukudi", type: "hospital", area: "Collectorate", hours: "24/7", phone: "+91 461 2320456", rating: 4.1, img: "🏥" },
  { id: "p6", name: "Agnes Clinic", city: "Thoothukudi", type: "clinic", area: "Bryant Nagar", hours: "9AM–8PM", phone: "+91 461 2345678", rating: 4.3, img: "🏨" },
  { id: "p7", name: "Meenakshi Mission Hospital", city: "Madurai", type: "hospital", area: "Lake Area", hours: "24/7", phone: "+91 452 4588888", rating: 4.7, img: "🏥" },
  { id: "p8", name: "Apollo Hospitals", city: "Madurai", type: "hospital", area: "KK Nagar", hours: "24/7", phone: "+91 452 4244444", rating: 4.5, img: "🏥" },
  { id: "p9", name: "Aravind Eye Hospital", city: "Madurai", type: "hospital", area: "Anna Nagar", hours: "8AM–6PM", phone: "+91 452 4356100", rating: 4.8, img: "🏥" },
  { id: "p10", name: "SRL Diagnostics", city: "Tirunelveli", type: "lab", area: "Palayamkottai", hours: "7AM–8PM", phone: "+91 462 2511234", rating: 4.0, img: "🔬" },
  { id: "p11", name: "Thyrocare Lab", city: "Madurai", type: "lab", area: "Tallakulam", hours: "7AM–7PM", phone: "+91 452 2345612", rating: 4.1, img: "🔬" },
  { id: "p12", name: "City Clinic", city: "Kanyakumari", type: "clinic", area: "Nagercoil Main Rd", hours: "9AM–9PM", phone: "+91 4652 567890", rating: 4.0, img: "🏨" },
];

const DOCTORS = [
  { id: "d1", providerId: "p1", name: "Dr. S. Ramesh", speciality: "General Medicine", slots: ["9:00 AM","10:00 AM","11:00 AM","2:00 PM","3:00 PM"] },
  { id: "d2", providerId: "p1", name: "Dr. Lakshmi Priya", speciality: "Obstetrics & Gynecology", slots: ["9:30 AM","10:30 AM","11:30 AM","4:00 PM"] },
  { id: "d3", providerId: "p3", name: "Dr. K. Murugan", speciality: "Cardiology", slots: ["10:00 AM","11:00 AM","2:00 PM"] },
  { id: "d4", providerId: "p3", name: "Dr. Priya Devi", speciality: "Obstetrics & Gynecology", slots: ["9:00 AM","10:00 AM","3:00 PM","4:00 PM"] },
  { id: "d5", providerId: "p4", name: "Dr. A. Senthil", speciality: "Orthopedics", slots: ["10:00 AM","11:00 AM","2:00 PM","3:00 PM"] },
  { id: "d6", providerId: "p7", name: "Dr. Meena Kumari", speciality: "General Medicine", slots: ["9:00 AM","10:00 AM","11:00 AM","2:00 PM","3:00 PM","4:00 PM"] },
  { id: "d7", providerId: "p7", name: "Dr. R. Venkatesh", speciality: "Neurology", slots: ["10:00 AM","11:00 AM","3:00 PM"] },
  { id: "d8", providerId: "p8", name: "Dr. S. Kavitha", speciality: "Obstetrics & Gynecology", slots: ["9:00 AM","10:00 AM","2:00 PM","3:00 PM"] },
  { id: "d9", providerId: "p9", name: "Dr. P. Aravind", speciality: "Ophthalmology", slots: ["8:30 AM","9:30 AM","10:30 AM","2:00 PM","3:00 PM"] },
  { id: "d10", providerId: "p5", name: "Dr. M. Selvi", speciality: "Pediatrics", slots: ["9:00 AM","10:00 AM","11:00 AM","4:00 PM"] },
  { id: "d11", providerId: "p2", name: "Dr. J. Kamal", speciality: "ENT", slots: ["10:00 AM","11:00 AM","3:00 PM","4:00 PM"] },
  { id: "d12", providerId: "p6", name: "Dr. Agnes Mary", speciality: "Dermatology", slots: ["9:00 AM","11:00 AM","2:00 PM"] },
];

const PACKAGES = [
  { id: "transport", name: "Transport Only", desc: "We book a cab for your hospital visit", price: 199, icon: "🚗" },
  { id: "assistant", name: "Assistant Only", desc: "A trained caretaker accompanies you", price: 499, icon: "🤝" },
  { id: "full", name: "Full Support", desc: "Appointment + Transport + Assistant — end to end care", price: 799, icon: "⭐" },
];

const ADDONS = [
  { id: "wheelchair", name: "Wheelchair Support", price: 150, icon: "♿" },
  { id: "multi-attend", name: "Additional Attendant", price: 300, icon: "👥" },
  { id: "pharmacy", name: "Pharmacy Pickup", price: 100, icon: "💊" },
  { id: "lab-pickup", name: "Lab Sample Pickup", price: 200, icon: "🧪" },
];

const TESTIMONIALS = [
  { name: "Lakshmi A.", city: "Kanyakumari", text: "My mother needed regular hospital visits. Care 2030's assistant was like family — patient, caring, and always on time.", rating: 5 },
  { name: "Priya S.", city: "Madurai", text: "During my pregnancy, getting to scans was stressful. Care 2030 made every visit smooth and worry-free. Thank you!", rating: 5 },
  { name: "Rajesh K.", city: "Tirunelveli", text: "My father's dialysis trips are now handled completely by Care 2030. I can focus on work knowing he's in safe hands.", rating: 5 },
  { name: "Meena R.", city: "Thoothukudi", text: "The assistants are well-trained and speak Tamil fluently. My grandmother felt completely comfortable.", rating: 4 },
];

// ─── STYLES ────────────────────────────────────────────────────────
const colors = {
  bg: "#FFFBF5", bgAlt: "#F5F0E8", primary: "#0B6E6E", primaryLight: "#E0F2F1",
  primaryDark: "#064E4E", accent: "#E07A5F", accentLight: "#FDEAE4", warm: "#D4A373",
  text: "#1C2B33", textMid: "#4A5E6A", textLight: "#7B8F9A", white: "#FFFFFF",
  border: "#E8E0D4", success: "#2E7D4F", card: "#FFFFFF", shadow: "rgba(12,60,60,0.08)",
};

// ─── ICONS (SVG components) ────────────────────────────────────────
const Icon = ({ type, size = 20, color = "currentColor" }) => {
  const s = { width: size, height: size, display: "inline-block", verticalAlign: "middle" };
  const paths = {
    calendar: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    car: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M5 17h14M5 17a2 2 0 01-2-2V8a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v7a2 2 0 01-2 2M7 17a2 2 0 100 4 2 2 0 000-4zM17 17a2 2 0 100 4 2 2 0 000-4z"/></svg>,
    hospital: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
    user: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    heart: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    shield: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
    phone: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
    search: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    star: <svg style={s} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    check: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    arrow: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    back: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    menu: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    close: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    whatsapp: <svg style={s} viewBox="0 0 24 24" fill={color}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
    globe: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
    map: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    clock: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    plus: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    edit: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
    baby: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 10-16 0"/><circle cx="10" cy="7" r="1" fill={color}/><circle cx="14" cy="7" r="1" fill={color}/><path d="M10 10c.5.5 1.5 1 2 1s1.5-.5 2-1"/></svg>,
    elderly: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="5" r="3"/><path d="M12 8v5l-2 7M12 13l2 7M8 13h8M17 21l2-8"/></svg>,
  };
  return paths[type] || null;
};

// ─── UTILITY ───────────────────────────────────────────────────────
const t = (text, lang) => (lang === "ta" && TAMIL[text]) ? TAMIL[text] : text;
const genId = () => "BK" + Date.now().toString(36).toUpperCase();
const formatPrice = (p) => `₹${p.toLocaleString("en-IN")}`;

// ─── REUSABLE COMPONENTS ───────────────────────────────────────────
const btnBase = {
  display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px",
  borderRadius: 12, fontWeight: 600, fontSize: 15, cursor: "pointer",
  transition: "all 0.2s", border: "none", fontFamily: "inherit",
};

const Btn = ({ children, variant = "primary", onClick, style, disabled, full }) => {
  const variants = {
    primary: { background: colors.primary, color: colors.white, boxShadow: `0 2px 12px ${colors.shadow}` },
    accent: { background: colors.accent, color: colors.white },
    outline: { background: "transparent", color: colors.primary, border: `2px solid ${colors.primary}` },
    ghost: { background: "transparent", color: colors.textMid, padding: "8px 16px" },
    whatsapp: { background: "#25D366", color: colors.white },
  };
  return (
    <button
      onClick={onClick} disabled={disabled}
      style={{
        ...btnBase, ...variants[variant], ...(full ? { width: "100%", justifyContent: "center" } : {}),
        ...(disabled ? { opacity: 0.5, cursor: "not-allowed" } : {}), ...style,
      }}
      onMouseEnter={e => { if (!disabled) e.target.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.target.style.transform = "translateY(0)"; }}
    >{children}</button>
  );
};

const Card = ({ children, style, onClick, hover }) => (
  <div
    onClick={onClick}
    style={{
      background: colors.card, borderRadius: 16, padding: 24,
      boxShadow: `0 1px 8px ${colors.shadow}`, border: `1px solid ${colors.border}`,
      transition: "all 0.25s", cursor: onClick ? "pointer" : "default", ...style,
    }}
    onMouseEnter={e => { if (hover || onClick) { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 6px 24px ${colors.shadow}`; }}}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 1px 8px ${colors.shadow}`; }}
  >{children}</div>
);

const Badge = ({ children, color: bg = colors.primaryLight, textColor = colors.primary }) => (
  <span style={{
    display: "inline-block", padding: "4px 12px", borderRadius: 20,
    fontSize: 12, fontWeight: 600, background: bg, color: textColor,
  }}>{children}</span>
);

const Input = ({ label, error, ...props }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 6 }}>{label}</label>}
    <input
      {...props}
      style={{
        width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${error ? colors.accent : colors.border}`,
        fontSize: 15, fontFamily: "inherit", background: colors.white, color: colors.text,
        outline: "none", transition: "border 0.2s", boxSizing: "border-box",
        ...props.style,
      }}
      onFocus={e => { e.target.style.borderColor = colors.primary; }}
      onBlur={e => { e.target.style.borderColor = error ? colors.accent : colors.border; }}
    />
    {error && <span style={{ fontSize: 12, color: colors.accent, marginTop: 4, display: "block" }}>{error}</span>}
  </div>
);

const Select = ({ label, options, value, onChange, error }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 6 }}>{label}</label>}
    <select
      value={value} onChange={e => onChange(e.target.value)}
      style={{
        width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${error ? colors.accent : colors.border}`,
        fontSize: 15, fontFamily: "inherit", background: colors.white, color: colors.text,
        outline: "none", cursor: "pointer", boxSizing: "border-box", appearance: "auto",
      }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Stars = ({ rating, size = 14 }) => (
  <span style={{ display: "inline-flex", gap: 2 }}>
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{ color: i <= rating ? "#F4B942" : colors.border, fontSize: size }}>★</span>
    ))}
  </span>
);

const Section = ({ children, style, bg }) => (
  <section style={{ padding: "60px 20px", background: bg || "transparent", ...style }}>
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>{children}</div>
  </section>
);

const SectionTitle = ({ children, sub }) => (
  <div style={{ textAlign: "center", marginBottom: 40 }}>
    <h2 style={{ fontSize: 28, fontWeight: 700, color: colors.text, margin: 0, fontFamily: "'Fraunces', serif" }}>{children}</h2>
    {sub && <p style={{ color: colors.textMid, marginTop: 8, fontSize: 16 }}>{sub}</p>}
  </div>
);

const StepIndicator = ({ steps, current }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 32, flexWrap: "wrap", padding: "0 10px" }}>
    {steps.map((s, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 60 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            background: i <= current ? colors.primary : colors.border, color: i <= current ? colors.white : colors.textLight,
            fontSize: 14, fontWeight: 700, transition: "all 0.3s",
          }}>{i < current ? "✓" : i + 1}</div>
          <span style={{ fontSize: 11, color: i <= current ? colors.primary : colors.textLight, fontWeight: i === current ? 700 : 400, textAlign: "center" }}>{s}</span>
        </div>
        {i < steps.length - 1 && <div style={{ width: 30, height: 2, background: i < current ? colors.primary : colors.border, margin: "0 4px", marginBottom: 18, transition: "all 0.3s" }} />}
      </div>
    ))}
  </div>
);

// ─── NAVBAR ────────────────────────────────────────────────────────
const Navbar = () => {
  const { page, setPage, city, setCity, lang, setLang, user, setUser } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { label: t("Home", lang), page: "/" },
    { label: t("Services", lang), page: "/services" },
    { label: t("Hospitals", lang), page: "/providers" },
    { label: t("Book Now", lang), page: "/book" },
  ];
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100, background: "rgba(255,251,245,0.95)",
      backdropFilter: "blur(10px)", borderBottom: `1px solid ${colors.border}`,
      padding: "0 20px",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setPage("/")}>
          <span style={{ fontSize: 24, fontWeight: 800, color: colors.primary, fontFamily: "'Fraunces', serif" }}>Care</span>
          <span style={{
            background: colors.accent, color: colors.white, borderRadius: 8,
            padding: "2px 8px", fontSize: 16, fontWeight: 800, fontFamily: "'Fraunces', serif",
          }}>2030</span>
        </div>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }} className="desktop-nav">
          {links.map(l => (
            <button key={l.page} onClick={() => setPage(l.page)} style={{
              background: page === l.page || (page.startsWith(l.page) && l.page !== "/") ? colors.primaryLight : "transparent",
              color: page === l.page || (page.startsWith(l.page) && l.page !== "/") ? colors.primary : colors.textMid,
              border: "none", padding: "8px 14px", borderRadius: 8, fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
            }}>{l.label}</button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <select value={city} onChange={e => setCity(e.target.value)} style={{
            border: `1.5px solid ${colors.border}`, borderRadius: 8, padding: "6px 10px",
            fontSize: 13, background: colors.white, color: colors.text, fontFamily: "inherit",
            cursor: "pointer", maxWidth: 120,
          }}>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <button onClick={() => setLang(lang === "en" ? "ta" : "en")} style={{
            border: `1.5px solid ${colors.border}`, borderRadius: 8, padding: "6px 10px",
            fontSize: 13, background: colors.white, cursor: "pointer", fontFamily: "inherit",
            color: colors.text, fontWeight: 600, display: "flex", alignItems: "center", gap: 4,
          }}>
            <Icon type="globe" size={14} />{lang === "en" ? "தமிழ்" : "EN"}
          </button>

          {user ? (
            <button onClick={() => setPage("/account")} style={{
              background: colors.primary, color: colors.white, border: "none", borderRadius: 8,
              padding: "6px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>{user.name?.charAt(0) || "U"}</button>
          ) : (
            <Btn variant="primary" onClick={() => setPage("/login")} style={{ padding: "8px 16px", fontSize: 13 }}>
              {t("Login", lang)}
            </Btn>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu" style={{
            display: "none", border: "none", background: "none", cursor: "pointer", color: colors.text,
          }}><Icon type={menuOpen ? "close" : "menu"} size={24} /></button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: "absolute", top: 64, left: 0, right: 0, background: colors.bg,
          borderBottom: `1px solid ${colors.border}`, padding: 20, display: "flex", flexDirection: "column", gap: 8,
        }}>
          {links.map(l => (
            <button key={l.page} onClick={() => { setPage(l.page); setMenuOpen(false); }} style={{
              background: "none", border: "none", textAlign: "left", padding: "12px 16px",
              borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: "pointer",
              color: page === l.page ? colors.primary : colors.text, fontFamily: "inherit",
              background: page === l.page ? colors.primaryLight : "transparent",
            }}>{l.label}</button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

// ─── FOOTER ────────────────────────────────────────────────────────
const Footer = () => {
  const { setPage } = useApp();
  return (
    <footer style={{ background: colors.text, color: "rgba(255,255,255,0.8)", padding: "48px 20px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: colors.white, fontFamily: "'Fraunces', serif" }}>Care</span>
              <span style={{ background: colors.accent, color: colors.white, borderRadius: 6, padding: "2px 6px", fontSize: 14, fontWeight: 800, fontFamily: "'Fraunces', serif" }}>2030</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.8 }}>Trusted hospital visit assistance for elderly care and pregnancy support across South Tamil Nadu.</p>
          </div>
          <div>
            <h4 style={{ color: colors.white, fontSize: 14, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Quick Links</h4>
            {[["Home","/"],["Services","/services"],["Hospitals","/providers"],["Book Now","/book"]].map(([l,p]) => (
              <div key={p}><a onClick={() => setPage(p)} style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, cursor: "pointer", lineHeight: 2.2, textDecoration: "none" }}>{l}</a></div>
            ))}
          </div>
          <div>
            <h4 style={{ color: colors.white, fontSize: 14, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Service Areas</h4>
            {CITIES.map(c => <div key={c} style={{ fontSize: 14, lineHeight: 2.2, opacity: 0.7 }}>{c}</div>)}
          </div>
          <div>
            <h4 style={{ color: colors.white, fontSize: 14, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Contact</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="tel:+919876543210" style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 14 }}>
                <Icon type="phone" size={16} color="rgba(255,255,255,0.6)" /> +91 98765 43210
              </a>
              <a href="https://wa.me/919876543210" style={{ display: "flex", alignItems: "center", gap: 8, color: "#25D366", textDecoration: "none", fontSize: 14 }}>
                <Icon type="whatsapp" size={16} color="#25D366" /> WhatsApp Support
              </a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 13, opacity: 0.6 }}>© 2025 Care 2030. All rights reserved.</span>
          <span style={{ fontSize: 13, opacity: 0.6 }}>Privacy Policy · Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

// ─── PAGE: HOME ────────────────────────────────────────────────────
const HomePage = () => {
  const { setPage, city, lang } = useApp();
  return (
    <div>
      {/* Hero */}
      <section style={{
        background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primary} 50%, #0D8080 100%)`,
        color: colors.white, padding: "80px 20px 60px", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
        }} />
        <div style={{
          position: "absolute", bottom: -60, left: -60, width: 250, height: 250, borderRadius: "50%",
          background: "rgba(255,255,255,0.03)",
        }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Badge color="rgba(255,255,255,0.2)" textColor={colors.white}>📍 Serving {city}</Badge>
          <h1 style={{
            fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 800, marginTop: 16, marginBottom: 16,
            lineHeight: 1.15, fontFamily: "'Fraunces', serif", maxWidth: 650,
          }}>
            {t("Trusted hospital visit assistance", lang)}
          </h1>
          <p style={{ fontSize: 18, opacity: 0.9, maxWidth: 520, lineHeight: 1.6, marginBottom: 32 }}>
            Caring assistance for elderly parents and expectant mothers — from appointment to homecoming.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Btn variant="accent" onClick={() => setPage("/book")} style={{ padding: "14px 28px", fontSize: 16 }}>
              {t("Book Assistance", lang)} <Icon type="arrow" size={18} color={colors.white} />
            </Btn>
            <Btn variant="whatsapp" style={{ padding: "14px 28px", fontSize: 16 }}>
              <Icon type="whatsapp" size={18} color={colors.white} /> WhatsApp Us
            </Btn>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <Section style={{ padding: "32px 20px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
          {[
            { icon: "shield", text: "Verified Assistants" },
            { icon: "hospital", text: "Partner Hospitals" },
            { icon: "heart", text: "Safety & Privacy" },
            { icon: "star", text: "4.8★ Rated Service" },
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, color: colors.textMid, fontSize: 14, fontWeight: 600 }}>
              <Icon type={t.icon} size={18} color={colors.primary} /> {t.text}
            </div>
          ))}
        </div>
      </Section>

      {/* Services */}
      <Section bg={colors.bgAlt}>
        <SectionTitle sub="Choose the care you need">Our Services</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {[
            { icon: "elderly", title: t("Elder Care", lang), desc: "Trusted companions for your parents' hospital visits", color: "#E8F5E9", accent: "#2E7D4F" },
            { icon: "baby", title: t("Pregnancy Care", lang), desc: "Support through every scan, test, and doctor visit", color: "#FCE4EC", accent: "#C2185B" },
            { icon: "calendar", title: "Appointment Booking", desc: "We book doctor visits, scans, and lab tests for you", color: "#E3F2FD", accent: "#1565C0" },
            { icon: "car", title: "Transport + Assistant", desc: "Door-to-door cab with a trained caretaker", color: "#FFF3E0", accent: "#E65100" },
          ].map((s, i) => (
            <Card key={i} onClick={() => setPage("/services")} style={{ textAlign: "center", padding: 28 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, background: s.color, display: "flex",
                alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
              }}>
                <Icon type={s.icon} size={26} color={s.accent} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: colors.text, margin: "0 0 8px", fontFamily: "'Fraunces', serif" }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: colors.textMid, lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* How it Works */}
      <Section>
        <SectionTitle sub="It's as easy as 1-2-3">{t("How It Works", lang)}</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {[
            { step: "1", title: "Tell Us What You Need", desc: "Select your city, service type, and preferred hospital or clinic." },
            { step: "2", title: "We Handle Everything", desc: "We book the appointment, arrange transport, and assign a trained assistant." },
            { step: "3", title: "Relax, We're With You", desc: "Our assistant accompanies the patient end-to-end, from door to door." },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                color: colors.white, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, fontWeight: 800, flexShrink: 0, fontFamily: "'Fraunces', serif",
              }}>{s.step}</div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: colors.text, margin: "0 0 6px" }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: colors.textMid, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Partner Hospitals */}
      <Section bg={colors.bgAlt}>
        <SectionTitle sub={`Trusted providers in ${city}`}>Partner Hospitals</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {PROVIDERS.filter(p => p.city === city).slice(0, 4).map(p => (
            <Card key={p.id} onClick={() => setPage(`/providers/${p.id}`)} style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 32 }}>{p.img}</span>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: colors.text, margin: 0 }}>{p.name}</h4>
                  <span style={{ fontSize: 13, color: colors.textMid }}>{p.area}</span>
                  <div style={{ marginTop: 4 }}><Stars rating={p.rating} /></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Btn variant="outline" onClick={() => setPage("/providers")}>View All Providers <Icon type="arrow" size={16} /></Btn>
        </div>
      </Section>

      {/* Testimonials */}
      <Section>
        <SectionTitle sub="Real stories from real families">What Families Say</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <Card key={i} style={{ padding: 24 }}>
              <Stars rating={t.rating} />
              <p style={{ fontSize: 14, color: colors.textMid, lineHeight: 1.7, margin: "12px 0", fontStyle: "italic" }}>"{t.text}"</p>
              <div style={{ fontWeight: 700, fontSize: 14, color: colors.text }}>{t.name}</div>
              <div style={{ fontSize: 13, color: colors.textLight }}>{t.city}</div>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section style={{
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
        padding: "60px 20px", textAlign: "center", color: colors.white,
      }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, fontFamily: "'Fraunces', serif" }}>
          Need help with a hospital visit?
        </h2>
        <p style={{ fontSize: 16, opacity: 0.9, marginBottom: 28 }}>Book trusted assistance in under 2 minutes.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn variant="accent" onClick={() => setPage("/book")} style={{ padding: "14px 32px", fontSize: 16 }}>
            {t("Book Assistance", lang)} <Icon type="arrow" size={18} color={colors.white} />
          </Btn>
          <Btn variant="whatsapp" style={{ padding: "14px 32px", fontSize: 16 }}>
            <Icon type="phone" size={18} color={colors.white} /> Call Support
          </Btn>
        </div>
      </section>
    </div>
  );
};

// ─── PAGE: SERVICES ────────────────────────────────────────────────
const ServicesPage = () => {
  const { setPage, lang } = useApp();
  return (
    <div>
      <Section>
        <SectionTitle sub="Transparent pricing. No hidden charges.">Our Service Packages</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {PACKAGES.map((pkg, i) => (
            <Card key={pkg.id} style={{
              padding: 32, textAlign: "center", position: "relative",
              border: i === 2 ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
            }}>
              {i === 2 && <Badge color={colors.accent} textColor={colors.white} style={{ position: "absolute", top: -12 }}>Most Popular</Badge>}
              <span style={{ fontSize: 40, display: "block", marginBottom: 12 }}>{pkg.icon}</span>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: colors.text, margin: "0 0 8px", fontFamily: "'Fraunces', serif" }}>{pkg.name}</h3>
              <p style={{ fontSize: 14, color: colors.textMid, lineHeight: 1.5, marginBottom: 16 }}>{pkg.desc}</p>
              <div style={{ fontSize: 32, fontWeight: 800, color: colors.primary, marginBottom: 4, fontFamily: "'Fraunces', serif" }}>
                {formatPrice(pkg.price)}
              </div>
              <span style={{ fontSize: 13, color: colors.textLight }}>starting from · per visit</span>
              <div style={{ marginTop: 20 }}>
                <Btn variant={i === 2 ? "primary" : "outline"} onClick={() => setPage("/book")} full>
                  {t("Book Now", lang)} <Icon type="arrow" size={16} />
                </Btn>
              </div>
              <div style={{ marginTop: 16, textAlign: "left" }}>
                {(i === 0 ? ["Cab booking via Uber/Ola", "Real-time tracking", "Pick-up & drop-off"] :
                  i === 1 ? ["Trained assistant", "Tamil & English speaking", "End-to-end accompaniment", "Report & prescription handling"] :
                  ["Everything in Transport + Assistant", "Appointment booking", "Doctor coordination", "Priority scheduling"]).map((f, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", fontSize: 13, color: colors.textMid }}>
                    <Icon type="check" size={14} color={colors.success} /> {f}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section bg={colors.bgAlt}>
        <SectionTitle sub="Customize your care">Add-Ons</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {ADDONS.map(a => (
            <Card key={a.id} style={{ padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 28 }}>{a.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: colors.text }}>{a.name}</div>
                <div style={{ color: colors.primary, fontWeight: 700, fontSize: 14 }}>+ {formatPrice(a.price)}</div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <section style={{
        background: `linear-gradient(135deg, ${colors.accent} 0%, #C2544A 100%)`,
        padding: "48px 20px", textAlign: "center", color: colors.white,
      }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12, fontFamily: "'Fraunces', serif" }}>Ready to book?</h2>
        <p style={{ opacity: 0.9, marginBottom: 24 }}>Our team is standing by to assist your family.</p>
        <Btn variant="primary" onClick={() => setPage("/book")} style={{ background: colors.white, color: colors.accent }}>
          Start Booking <Icon type="arrow" size={16} color={colors.accent} />
        </Btn>
      </section>
    </div>
  );
};

// ─── PAGE: PROVIDERS ───────────────────────────────────────────────
const ProvidersPage = () => {
  const { city, setPage } = useApp();
  const [filterCity, setFilterCity] = useState(city);
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = PROVIDERS.filter(p =>
    (filterCity === "all" || p.city === filterCity) &&
    (filterType === "all" || p.type === filterType) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.area.toLowerCase().includes(search.toLowerCase()))
  );

  const doctors = search ? DOCTORS.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) || d.speciality.toLowerCase().includes(search.toLowerCase())
  ) : [];

  return (
    <Section>
      <SectionTitle sub="Find hospitals, clinics, and labs near you">Hospitals & Clinics</SectionTitle>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24, alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <Icon type="search" size={18} color={colors.textLight} />
          <input
            placeholder="Search doctor, hospital, or speciality..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "12px 16px 12px 36px", borderRadius: 10, border: `1.5px solid ${colors.border}`,
              fontSize: 14, fontFamily: "inherit", background: colors.white, boxSizing: "border-box",
              outline: "none",
            }}
          />
        </div>
        <select value={filterCity} onChange={e => setFilterCity(e.target.value)} style={{
          padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${colors.border}`,
          fontSize: 14, fontFamily: "inherit", background: colors.white, cursor: "pointer",
        }}>
          <option value="all">All Cities</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{
          padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${colors.border}`,
          fontSize: 14, fontFamily: "inherit", background: colors.white, cursor: "pointer",
        }}>
          <option value="all">All Types</option>
          <option value="hospital">Hospitals</option>
          <option value="clinic">Clinics</option>
          <option value="lab">Labs</option>
        </select>
      </div>

      {doctors.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.text, marginBottom: 12 }}>Doctors matching "{search}"</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
            {doctors.map(d => {
              const prov = PROVIDERS.find(p => p.id === d.providerId);
              return (
                <Card key={d.id} onClick={() => setPage(`/providers/${d.providerId}`)} style={{ padding: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: colors.text }}>{d.name}</div>
                  <div style={{ fontSize: 13, color: colors.primary, fontWeight: 600 }}>{d.speciality}</div>
                  <div style={{ fontSize: 13, color: colors.textMid, marginTop: 4 }}>{prov?.name}</div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
        {filtered.map(p => (
          <Card key={p.id} onClick={() => setPage(`/providers/${p.id}`)} style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ fontSize: 36 }}>{p.img}</span>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.text, margin: "0 0 4px" }}>{p.name}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: colors.textMid }}>
                    <Icon type="map" size={13} /> {p.area}, {p.city}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: colors.textMid, marginTop: 2 }}>
                    <Icon type="clock" size={13} /> {p.hours}
                  </div>
                  <div style={{ marginTop: 6 }}><Stars rating={p.rating} /> <span style={{ fontSize: 12, color: colors.textLight }}>{p.rating}</span></div>
                </div>
              </div>
              <Badge>{p.type}</Badge>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <Btn variant="primary" onClick={e => { e.stopPropagation(); setPage("/book"); }} style={{ padding: "8px 16px", fontSize: 13, flex: 1 }}>
                Book with this provider
              </Btn>
              <Btn variant="ghost" style={{ padding: "8px 12px", fontSize: 13 }}>
                <Icon type="phone" size={14} />
              </Btn>
            </div>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: colors.textMid }}>
          No providers found. Try adjusting your filters.
        </div>
      )}
    </Section>
  );
};

// ─── PAGE: PROVIDER DETAIL ─────────────────────────────────────────
const ProviderDetailPage = ({ id }) => {
  const { setPage } = useApp();
  const provider = PROVIDERS.find(p => p.id === id);
  const provDoctors = DOCTORS.filter(d => d.providerId === id);

  if (!provider) return <Section><p>Provider not found.</p></Section>;

  return (
    <Section>
      <button onClick={() => setPage("/providers")} style={{
        display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
        color: colors.primary, fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 24, fontFamily: "inherit",
      }}><Icon type="back" size={18} /> Back to all providers</button>

      <Card style={{ padding: 32, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 48 }}>{provider.img}</span>
          <div style={{ flex: 1 }}>
            <Badge>{provider.type}</Badge>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: colors.text, margin: "8px 0 4px", fontFamily: "'Fraunces', serif" }}>{provider.name}</h1>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 14, color: colors.textMid }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon type="map" size={14} /> {provider.area}, {provider.city}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon type="clock" size={14} /> {provider.hours}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon type="phone" size={14} /> {provider.phone}</span>
            </div>
            <div style={{ marginTop: 8 }}><Stars rating={provider.rating} size={16} /> <span style={{ fontSize: 14, fontWeight: 600 }}>{provider.rating}</span></div>
          </div>
          <Btn variant="primary" onClick={() => setPage("/book")}>Book with this provider</Btn>
        </div>
      </Card>

      {/* Map placeholder */}
      <Card style={{ padding: 0, marginBottom: 24, overflow: "hidden", height: 180, background: colors.bgAlt, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: colors.textLight }}>
          <Icon type="map" size={32} color={colors.textLight} />
          <div style={{ fontSize: 14, marginTop: 8 }}>Map integration coming soon</div>
        </div>
      </Card>

      <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.text, marginBottom: 16, fontFamily: "'Fraunces', serif" }}>
        Doctors ({provDoctors.length})
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        {provDoctors.map(d => (
          <Card key={d.id} style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%", background: colors.primaryLight,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon type="user" size={22} color={colors.primary} />
              </div>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: colors.text, margin: 0 }}>{d.name}</h4>
                <Badge>{d.speciality}</Badge>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: colors.textMid, marginBottom: 8 }}>Available Slots</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {d.slots.map(s => (
                  <span key={s} style={{
                    padding: "4px 10px", borderRadius: 6, background: colors.primaryLight,
                    color: colors.primary, fontSize: 12, fontWeight: 600,
                  }}>{s}</span>
                ))}
              </div>
            </div>
            <Btn variant="outline" onClick={() => setPage("/book")} full style={{ marginTop: 14, padding: "8px 16px", fontSize: 13 }}>
              Book Appointment
            </Btn>
          </Card>
        ))}
        {provDoctors.length === 0 && <p style={{ color: colors.textMid }}>No doctors listed yet for this provider.</p>}
      </div>
    </Section>
  );
};

// ─── PAGE: BOOKING FLOW ────────────────────────────────────────────
const BookingFlow = () => {
  const { city, setPage, user, addBooking } = useApp();
  const [step, setStep] = useState(0);
  const steps = ["Service", "Patient", "Provider", "Assistant", "Confirm"];

  const [booking, setBooking] = useState({
    city: city, package: "", addons: [],
    patientName: "", patientPhone: "", patientAge: "", category: "elderly", notes: "",
    providerId: "", doctorId: "", date: "", time: "", testType: "",
    assistants: 1, genderPref: "any", langPref: "tamil", wheelchair: false, pickupLocation: "",
    transport: false,
  });

  const update = (fields) => setBooking(prev => ({ ...prev, ...fields }));
  const cityProviders = PROVIDERS.filter(p => p.city === booking.city);
  const selectedProvider = PROVIDERS.find(p => p.id === booking.providerId);
  const providerDoctors = DOCTORS.filter(d => d.providerId === booking.providerId);
  const selectedDoctor = DOCTORS.find(d => d.id === booking.doctorId);
  const selectedPkg = PACKAGES.find(p => p.id === booking.package);

  const calcTotal = () => {
    let total = selectedPkg?.price || 0;
    booking.addons.forEach(a => { total += ADDONS.find(x => x.id === a)?.price || 0; });
    if (booking.assistants > 1) total += (booking.assistants - 1) * 300;
    if (booking.transport) total += 150;
    return total;
  };

  const canNext = () => {
    if (step === 0) return booking.city && booking.package;
    if (step === 1) return booking.patientName && booking.patientPhone && booking.category;
    if (step === 2) return booking.providerId && booking.date;
    if (step === 3) return booking.pickupLocation;
    return true;
  };

  const handleConfirm = () => {
    const id = genId();
    const record = { ...booking, id, total: calcTotal(), status: "confirmed", createdAt: new Date().toISOString() };
    addBooking(record);
    setPage("/book/success?id=" + id);
  };

  return (
    <Section>
      <SectionTitle>Book Your Assistance</SectionTitle>
      <StepIndicator steps={steps} current={step} />

      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {step === 0 && (
          <Card style={{ padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: colors.text, marginBottom: 20 }}>Choose City & Service</h3>
            <Select label="Select City" value={booking.city} onChange={v => update({ city: v })}
              options={CITIES.map(c => ({ value: c, label: c }))} />
            <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 12 }}>Select Package</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {PACKAGES.map(pkg => (
                <div key={pkg.id} onClick={() => update({ package: pkg.id })} style={{
                  padding: 16, borderRadius: 12, border: `2px solid ${booking.package === pkg.id ? colors.primary : colors.border}`,
                  background: booking.package === pkg.id ? colors.primaryLight : colors.white, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 14, transition: "all 0.2s",
                }}>
                  <span style={{ fontSize: 28 }}>{pkg.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: colors.text }}>{pkg.name}</div>
                    <div style={{ fontSize: 13, color: colors.textMid }}>{pkg.desc}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: colors.primary, fontFamily: "'Fraunces', serif" }}>{formatPrice(pkg.price)}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 12 }}>Add-Ons (Optional)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {ADDONS.map(a => (
                <div key={a.id} onClick={() => {
                  const has = booking.addons.includes(a.id);
                  update({ addons: has ? booking.addons.filter(x => x !== a.id) : [...booking.addons, a.id] });
                }} style={{
                  padding: 12, borderRadius: 10, border: `2px solid ${booking.addons.includes(a.id) ? colors.primary : colors.border}`,
                  background: booking.addons.includes(a.id) ? colors.primaryLight : colors.white, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s", fontSize: 13,
                }}>
                  <span style={{ fontSize: 18 }}>{a.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{a.name}</div>
                    <div style={{ color: colors.primary, fontWeight: 700 }}>+{formatPrice(a.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {step === 1 && (
          <Card style={{ padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: colors.text, marginBottom: 20 }}>Patient Details</h3>
            <Input label="Patient Name *" value={booking.patientName} onChange={e => update({ patientName: e.target.value })} placeholder="Full name" />
            <Input label="Phone Number *" value={booking.patientPhone} onChange={e => update({ patientPhone: e.target.value })} placeholder="+91 98765 43210" type="tel" />
            <Input label="Age" value={booking.patientAge} onChange={e => update({ patientAge: e.target.value })} placeholder="Age" type="number" />
            <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 10 }}>Category *</div>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              {[["elderly", "👴 Elderly"], ["pregnancy", "🤰 Pregnancy"], ["other", "👤 Other"]].map(([val, lbl]) => (
                <div key={val} onClick={() => update({ category: val })} style={{
                  flex: 1, padding: "14px 12px", borderRadius: 10, textAlign: "center",
                  border: `2px solid ${booking.category === val ? colors.primary : colors.border}`,
                  background: booking.category === val ? colors.primaryLight : colors.white,
                  cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all 0.2s",
                }}>{lbl}</div>
              ))}
            </div>
            <Input label="Special Notes" value={booking.notes} onChange={e => update({ notes: e.target.value })} placeholder="Any special requirements..." />
          </Card>
        )}

        {step === 2 && (
          <Card style={{ padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: colors.text, marginBottom: 20 }}>Choose Provider & Appointment</h3>
            <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 10 }}>Select Hospital / Clinic</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20, maxHeight: 240, overflowY: "auto" }}>
              {cityProviders.map(p => (
                <div key={p.id} onClick={() => update({ providerId: p.id, doctorId: "" })} style={{
                  padding: 12, borderRadius: 10, border: `2px solid ${booking.providerId === p.id ? colors.primary : colors.border}`,
                  background: booking.providerId === p.id ? colors.primaryLight : colors.white,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s",
                }}>
                  <span style={{ fontSize: 24 }}>{p.img}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: colors.textMid }}>{p.area} · {p.hours}</div>
                  </div>
                  <div style={{ marginLeft: "auto" }}><Stars rating={p.rating} size={12} /></div>
                </div>
              ))}
            </div>

            {booking.providerId && providerDoctors.length > 0 && (
              <>
                <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 10 }}>Select Doctor (Optional)</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  {providerDoctors.map(d => (
                    <div key={d.id} onClick={() => update({ doctorId: d.id })} style={{
                      padding: 10, borderRadius: 8, border: `2px solid ${booking.doctorId === d.id ? colors.primary : colors.border}`,
                      background: booking.doctorId === d.id ? colors.primaryLight : colors.white,
                      cursor: "pointer", fontSize: 14, transition: "all 0.2s",
                    }}>
                      <span style={{ fontWeight: 700 }}>{d.name}</span> · <span style={{ color: colors.primary, fontSize: 13 }}>{d.speciality}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Preferred Date *" type="date" value={booking.date} onChange={e => update({ date: e.target.value })} />
              {selectedDoctor ? (
                <Select label="Time Slot" value={booking.time} onChange={v => update({ time: v })}
                  options={[{ value: "", label: "Select time" }, ...selectedDoctor.slots.map(s => ({ value: s, label: s }))]} />
              ) : (
                <Input label="Preferred Time" value={booking.time} onChange={e => update({ time: e.target.value })} placeholder="e.g. 10:00 AM" />
              )}
            </div>
            <Select label="Test Type (if applicable)" value={booking.testType} onChange={v => update({ testType: v })}
              options={[{ value: "", label: "None" }, { value: "blood", label: "Blood Test" }, { value: "scan", label: "Scan / Ultrasound" }, { value: "xray", label: "X-Ray" }, { value: "ecg", label: "ECG" }, { value: "other", label: "Other" }]} />
          </Card>
        )}

        {step === 3 && (
          <Card style={{ padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: colors.text, marginBottom: 20 }}>Assistant & Transport</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Select label="Number of Assistants" value={booking.assistants} onChange={v => update({ assistants: parseInt(v) })}
                options={[1,2,3].map(n => ({ value: n, label: `${n} Assistant${n > 1 ? "s" : ""}` }))} />
              <Select label="Gender Preference" value={booking.genderPref} onChange={v => update({ genderPref: v })}
                options={[{ value: "any", label: "No Preference" }, { value: "female", label: "Female" }, { value: "male", label: "Male" }]} />
            </div>
            <Select label="Language Preference" value={booking.langPref} onChange={v => update({ langPref: v })}
              options={[{ value: "tamil", label: "Tamil" }, { value: "english", label: "English" }, { value: "both", label: "Tamil & English" }]} />

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${colors.border}`, background: booking.wheelchair ? colors.primaryLight : colors.white }}>
                <input type="checkbox" checked={booking.wheelchair} onChange={e => update({ wheelchair: e.target.checked })} style={{ width: 18, height: 18, accentColor: colors.primary }} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>♿ Wheelchair Support Needed</span>
              </label>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${colors.border}`, background: booking.transport ? colors.primaryLight : colors.white }}>
                <input type="checkbox" checked={booking.transport} onChange={e => update({ transport: e.target.checked })} style={{ width: 18, height: 18, accentColor: colors.primary }} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>🚗 Transport Required (Uber/Ola)</span>
              </label>
            </div>

            <Input label="Pickup Location *" value={booking.pickupLocation} onChange={e => update({ pickupLocation: e.target.value })} placeholder="Full address for pickup" />
          </Card>
        )}

        {step === 4 && (
          <Card style={{ padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: colors.text, marginBottom: 20 }}>Confirm Your Booking</h3>

            <div style={{ background: colors.bgAlt, borderRadius: 12, padding: 20, marginBottom: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 14 }}>
                {[
                  ["City", booking.city],
                  ["Package", selectedPkg?.name],
                  ["Patient", booking.patientName],
                  ["Phone", booking.patientPhone],
                  ["Category", booking.category],
                  ["Provider", selectedProvider?.name],
                  ["Doctor", selectedDoctor?.name || "Any available"],
                  ["Date", booking.date],
                  ["Time", booking.time || "Any available"],
                  ["Assistants", booking.assistants],
                  ["Language", booking.langPref],
                  ["Pickup", booking.pickupLocation],
                ].map(([l, v], i) => (
                  <div key={i}>
                    <div style={{ color: colors.textLight, fontSize: 12, fontWeight: 600 }}>{l}</div>
                    <div style={{ color: colors.text, fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
              {booking.notes && <div style={{ marginTop: 12, fontSize: 13, color: colors.textMid }}><strong>Notes:</strong> {booking.notes}</div>}
            </div>

            <div style={{ background: colors.primaryLight, borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: colors.text, marginBottom: 12 }}>Price Breakdown</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}>
                <span>{selectedPkg?.name}</span>
                <span style={{ fontWeight: 700 }}>{formatPrice(selectedPkg?.price || 0)}</span>
              </div>
              {booking.addons.map(a => {
                const addon = ADDONS.find(x => x.id === a);
                return (
                  <div key={a} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6, color: colors.textMid }}>
                    <span>{addon?.name}</span><span>{formatPrice(addon?.price || 0)}</span>
                  </div>
                );
              })}
              {booking.assistants > 1 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6, color: colors.textMid }}>
                  <span>Additional Assistants (×{booking.assistants - 1})</span><span>{formatPrice((booking.assistants - 1) * 300)}</span>
                </div>
              )}
              {booking.transport && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6, color: colors.textMid }}>
                  <span>Transport</span><span>{formatPrice(150)}</span>
                </div>
              )}
              <div style={{ borderTop: `2px solid ${colors.primary}`, marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 800, color: colors.primary }}>
                <span>Total</span><span style={{ fontFamily: "'Fraunces', serif" }}>{formatPrice(calcTotal())}</span>
              </div>
            </div>
          </Card>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, gap: 12 }}>
          {step > 0 ? (
            <Btn variant="outline" onClick={() => setStep(s => s - 1)}>
              <Icon type="back" size={16} /> Back
            </Btn>
          ) : <div />}
          {step < 4 ? (
            <Btn variant="primary" onClick={() => setStep(s => s + 1)} disabled={!canNext()}>
              Next <Icon type="arrow" size={16} color={colors.white} />
            </Btn>
          ) : (
            <Btn variant="accent" onClick={handleConfirm} style={{ padding: "14px 32px" }}>
              <Icon type="check" size={18} color={colors.white} /> Confirm Booking
            </Btn>
          )}
        </div>
      </div>
    </Section>
  );
};

// ─── PAGE: BOOKING SUCCESS ─────────────────────────────────────────
const BookingSuccess = ({ bookingId }) => {
  const { setPage, bookings } = useApp();
  const bk = bookings.find(b => b.id === bookingId);
  return (
    <Section>
      <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%", background: "#E8F5E9",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
          animation: "popIn 0.5s ease",
        }}>
          <Icon type="check" size={40} color={colors.success} />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: colors.text, margin: "0 0 8px", fontFamily: "'Fraunces', serif" }}>Booking Confirmed!</h1>
        <p style={{ color: colors.textMid, marginBottom: 24 }}>Your care assistant will be in touch shortly.</p>

        <Card style={{ padding: 24, textAlign: "left", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: colors.textLight }}>Booking ID</span>
            <span style={{ fontWeight: 800, color: colors.primary, fontFamily: "monospace", fontSize: 16 }}>{bookingId}</span>
          </div>
          {bk && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 14 }}>
              <div><span style={{ color: colors.textLight, fontSize: 12 }}>Patient</span><div style={{ fontWeight: 600 }}>{bk.patientName}</div></div>
              <div><span style={{ color: colors.textLight, fontSize: 12 }}>Date</span><div style={{ fontWeight: 600 }}>{bk.date}</div></div>
              <div><span style={{ color: colors.textLight, fontSize: 12 }}>Provider</span><div style={{ fontWeight: 600 }}>{PROVIDERS.find(p => p.id === bk.providerId)?.name}</div></div>
              <div><span style={{ color: colors.textLight, fontSize: 12 }}>Total</span><div style={{ fontWeight: 800, color: colors.primary, fontFamily: "'Fraunces', serif" }}>{formatPrice(bk.total)}</div></div>
            </div>
          )}
        </Card>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn variant="whatsapp"><Icon type="whatsapp" size={18} color={colors.white} /> WhatsApp Support</Btn>
          <Btn variant="outline" onClick={() => setPage("/")}><Icon type="back" size={16} /> Back to Home</Btn>
        </div>
      </div>
      <style>{`@keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }`}</style>
    </Section>
  );
};

// ─── PAGE: AUTH ────────────────────────────────────────────────────
const LoginPage = () => {
  const { setPage, setUser, lang } = useApp();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const handleLogin = () => {
    if (email && pass) { setUser({ email, name: email.split("@")[0] }); setPage("/account"); }
  };
  return (
    <Section>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <Card style={{ padding: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: colors.text, textAlign: "center", margin: "0 0 24px", fontFamily: "'Fraunces', serif" }}>
            {t("Login", lang)}
          </h2>
          <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" type="email" />
          <Input label="Password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" type="password" />
          <Btn variant="primary" onClick={handleLogin} full disabled={!email || !pass} style={{ marginTop: 8 }}>
            Sign In <Icon type="arrow" size={16} color={colors.white} />
          </Btn>
          <p style={{ textAlign: "center", fontSize: 14, color: colors.textMid, marginTop: 16 }}>
            Don't have an account? <a onClick={() => setPage("/signup")} style={{ color: colors.primary, fontWeight: 700, cursor: "pointer" }}>{t("Sign Up", lang)}</a>
          </p>
        </Card>
      </div>
    </Section>
  );
};

const SignupPage = () => {
  const { setPage, setUser, lang } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const handleSignup = () => {
    if (name && email && pass) { setUser({ name, email, phone }); setPage("/account"); }
  };
  return (
    <Section>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <Card style={{ padding: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: colors.text, textAlign: "center", margin: "0 0 24px", fontFamily: "'Fraunces', serif" }}>
            {t("Sign Up", lang)}
          </h2>
          <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
          <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" type="email" />
          <Input label="Phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" type="tel" />
          <Input label="Password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Choose a password" type="password" />
          <Btn variant="primary" onClick={handleSignup} full disabled={!name || !email || !pass} style={{ marginTop: 8 }}>
            Create Account <Icon type="arrow" size={16} color={colors.white} />
          </Btn>
          <p style={{ textAlign: "center", fontSize: 14, color: colors.textMid, marginTop: 16 }}>
            Already have an account? <a onClick={() => setPage("/login")} style={{ color: colors.primary, fontWeight: 700, cursor: "pointer" }}>{t("Login", lang)}</a>
          </p>
        </Card>
      </div>
    </Section>
  );
};

// ─── PAGE: ACCOUNT ─────────────────────────────────────────────────
const AccountPage = () => {
  const { user, setUser, setPage, bookings } = useApp();
  if (!user) { setPage("/login"); return null; }
  return (
    <Section>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: colors.text, margin: 0, fontFamily: "'Fraunces', serif" }}>Hi, {user.name}!</h2>
            <p style={{ color: colors.textMid, fontSize: 14, margin: "4px 0 0" }}>{user.email}</p>
          </div>
          <Btn variant="ghost" onClick={() => { setUser(null); setPage("/"); }} style={{ color: colors.accent }}>Sign Out</Btn>
        </div>

        <h3 style={{ fontSize: 18, fontWeight: 700, color: colors.text, marginBottom: 12 }}>Your Bookings</h3>
        {bookings.length === 0 ? (
          <Card style={{ padding: 32, textAlign: "center" }}>
            <p style={{ color: colors.textMid }}>No bookings yet.</p>
            <Btn variant="primary" onClick={() => setPage("/book")} style={{ marginTop: 12 }}>Book Your First Visit</Btn>
          </Card>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {bookings.map(b => (
              <Card key={b.id} style={{ padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, color: colors.primary, fontSize: 14 }}>{b.id}</span>
                    <div style={{ fontWeight: 700, fontSize: 15, marginTop: 4 }}>{b.patientName}</div>
                    <div style={{ fontSize: 13, color: colors.textMid }}>
                      {PROVIDERS.find(p => p.id === b.providerId)?.name} · {b.date}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <Badge color="#E8F5E9" textColor={colors.success}>{b.status}</Badge>
                    <div style={{ fontWeight: 800, color: colors.primary, marginTop: 4, fontFamily: "'Fraunces', serif" }}>{formatPrice(b.total)}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
};

// ─── PAGE: ADMIN ───────────────────────────────────────────────────
const AdminPage = () => {
  const { bookings } = useApp();
  const [tab, setTab] = useState("providers");
  const [providers, setProviders] = useState([...PROVIDERS]);
  const [doctors, setDoctors] = useState([...DOCTORS]);
  const [editingProvider, setEditingProvider] = useState(null);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [newProv, setNewProv] = useState({ name: "", city: CITIES[0], type: "hospital", area: "", hours: "", phone: "" });
  const [newDoc, setNewDoc] = useState({ name: "", speciality: "", providerId: PROVIDERS[0].id, slots: "" });

  const tabs = [
    { id: "providers", label: "Providers", icon: "hospital" },
    { id: "doctors", label: "Doctors", icon: "user" },
    { id: "bookings", label: "Bookings", icon: "calendar" },
    { id: "pricing", label: "Pricing", icon: "star" },
  ];

  return (
    <Section>
      <SectionTitle sub="Manage providers, doctors, and bookings">Admin Dashboard</SectionTitle>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10,
            background: tab === t.id ? colors.primary : colors.white, color: tab === t.id ? colors.white : colors.textMid,
            border: `1.5px solid ${tab === t.id ? colors.primary : colors.border}`, cursor: "pointer",
            fontSize: 14, fontWeight: 600, fontFamily: "inherit", transition: "all 0.2s",
          }}><Icon type={t.icon} size={16} color={tab === t.id ? colors.white : colors.textMid} /> {t.label}</button>
        ))}
      </div>

      {tab === "providers" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Providers ({providers.length})</h3>
            <Btn variant="primary" onClick={() => setShowAddProvider(true)} style={{ padding: "8px 16px", fontSize: 13 }}>
              <Icon type="plus" size={16} color={colors.white} /> Add Provider
            </Btn>
          </div>
          {showAddProvider && (
            <Card style={{ padding: 20, marginBottom: 16, border: `2px solid ${colors.primary}` }}>
              <h4 style={{ margin: "0 0 12px" }}>Add New Provider</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Input label="Name" value={newProv.name} onChange={e => setNewProv({...newProv, name: e.target.value})} placeholder="Hospital name" />
                <Select label="City" value={newProv.city} onChange={v => setNewProv({...newProv, city: v})} options={CITIES.map(c => ({value:c,label:c}))} />
                <Select label="Type" value={newProv.type} onChange={v => setNewProv({...newProv, type: v})} options={[{value:"hospital",label:"Hospital"},{value:"clinic",label:"Clinic"},{value:"lab",label:"Lab"}]} />
                <Input label="Area" value={newProv.area} onChange={e => setNewProv({...newProv, area: e.target.value})} placeholder="Area" />
                <Input label="Hours" value={newProv.hours} onChange={e => setNewProv({...newProv, hours: e.target.value})} placeholder="e.g. 24/7" />
                <Input label="Phone" value={newProv.phone} onChange={e => setNewProv({...newProv, phone: e.target.value})} placeholder="+91..." />
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <Btn variant="primary" onClick={() => {
                  setProviders([...providers, { ...newProv, id: "p" + Date.now(), rating: 4.0, img: newProv.type === "lab" ? "🔬" : newProv.type === "clinic" ? "🏨" : "🏥" }]);
                  setShowAddProvider(false); setNewProv({ name: "", city: CITIES[0], type: "hospital", area: "", hours: "", phone: "" });
                }} style={{ padding: "8px 20px", fontSize: 13 }}>Save</Btn>
                <Btn variant="ghost" onClick={() => setShowAddProvider(false)} style={{ fontSize: 13 }}>Cancel</Btn>
              </div>
            </Card>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {providers.map(p => (
              <Card key={p.id} style={{ padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 24 }}>{p.img}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: colors.textMid }}>{p.area}, {p.city} · {p.type}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setEditingProvider(editingProvider === p.id ? null : p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: colors.primary }}>
                      <Icon type="edit" size={16} />
                    </button>
                    <button onClick={() => setProviders(providers.filter(x => x.id !== p.id))} style={{ background: "none", border: "none", cursor: "pointer", color: colors.accent }}>
                      <Icon type="trash" size={16} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "doctors" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Doctors ({doctors.length})</h3>
            <Btn variant="primary" onClick={() => setShowAddDoctor(true)} style={{ padding: "8px 16px", fontSize: 13 }}>
              <Icon type="plus" size={16} color={colors.white} /> Add Doctor
            </Btn>
          </div>
          {showAddDoctor && (
            <Card style={{ padding: 20, marginBottom: 16, border: `2px solid ${colors.primary}` }}>
              <h4 style={{ margin: "0 0 12px" }}>Add New Doctor</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Input label="Name" value={newDoc.name} onChange={e => setNewDoc({...newDoc, name: e.target.value})} placeholder="Dr. Name" />
                <Input label="Speciality" value={newDoc.speciality} onChange={e => setNewDoc({...newDoc, speciality: e.target.value})} placeholder="e.g. Cardiology" />
                <Select label="Provider" value={newDoc.providerId} onChange={v => setNewDoc({...newDoc, providerId: v})} options={providers.map(p => ({value:p.id,label:p.name}))} />
                <Input label="Slots (comma sep)" value={newDoc.slots} onChange={e => setNewDoc({...newDoc, slots: e.target.value})} placeholder="9:00 AM, 10:00 AM" />
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <Btn variant="primary" onClick={() => {
                  setDoctors([...doctors, { ...newDoc, id: "d" + Date.now(), slots: newDoc.slots.split(",").map(s => s.trim()).filter(Boolean) }]);
                  setShowAddDoctor(false); setNewDoc({ name: "", speciality: "", providerId: providers[0]?.id, slots: "" });
                }} style={{ padding: "8px 20px", fontSize: 13 }}>Save</Btn>
                <Btn variant="ghost" onClick={() => setShowAddDoctor(false)} style={{ fontSize: 13 }}>Cancel</Btn>
              </div>
            </Card>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {doctors.map(d => {
              const prov = providers.find(p => p.id === d.providerId);
              return (
                <Card key={d.id} style={{ padding: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{d.name}</div>
                      <div style={{ fontSize: 12, color: colors.textMid }}>{d.speciality} · {prov?.name || "Unknown"}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => setDoctors(doctors.filter(x => x.id !== d.id))} style={{ background: "none", border: "none", cursor: "pointer", color: colors.accent }}>
                        <Icon type="trash" size={16} />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {tab === "bookings" && (
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 16px" }}>Bookings ({bookings.length})</h3>
          {bookings.length === 0 ? (
            <Card style={{ padding: 32, textAlign: "center", color: colors.textMid }}>No bookings yet.</Card>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: colors.bgAlt }}>
                    {["ID","Patient","City","Provider","Date","Package","Total","Status"].map(h => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: colors.text, borderBottom: `2px solid ${colors.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <td style={{ padding: "10px 12px", fontFamily: "monospace", fontWeight: 700, color: colors.primary }}>{b.id}</td>
                      <td style={{ padding: "10px 12px" }}>{b.patientName}</td>
                      <td style={{ padding: "10px 12px" }}>{b.city}</td>
                      <td style={{ padding: "10px 12px" }}>{PROVIDERS.find(p => p.id === b.providerId)?.name?.substring(0, 20)}</td>
                      <td style={{ padding: "10px 12px" }}>{b.date}</td>
                      <td style={{ padding: "10px 12px" }}>{PACKAGES.find(p => p.id === b.package)?.name}</td>
                      <td style={{ padding: "10px 12px", fontWeight: 700 }}>{formatPrice(b.total)}</td>
                      <td style={{ padding: "10px 12px" }}><Badge color="#E8F5E9" textColor={colors.success}>{b.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "pricing" && (
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 16px" }}>Pricing Configuration</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {PACKAGES.map(pkg => (
              <Card key={pkg.id} style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 24 }}>{pkg.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{pkg.name}</div>
                      <div style={{ fontSize: 13, color: colors.textMid }}>{pkg.desc}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 800, color: colors.primary, fontSize: 18, fontFamily: "'Fraunces', serif" }}>{formatPrice(pkg.price)}</span>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: colors.primary }}><Icon type="edit" size={16} /></button>
                  </div>
                </div>
              </Card>
            ))}
            <h4 style={{ fontSize: 16, fontWeight: 700, marginTop: 16 }}>Add-Ons</h4>
            {ADDONS.map(a => (
              <Card key={a.id} style={{ padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{a.icon}</span>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{a.name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700, color: colors.primary }}>{formatPrice(a.price)}</span>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: colors.primary }}><Icon type="edit" size={16} /></button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
};

// ─── ROUTER ────────────────────────────────────────────────────────
const Router = ({ page }) => {
  if (page === "/") return <HomePage />;
  if (page === "/services") return <ServicesPage />;
  if (page === "/providers") return <ProvidersPage />;
  if (page.startsWith("/providers/")) return <ProviderDetailPage id={page.split("/providers/")[1]} />;
  if (page === "/book") return <BookingFlow />;
  if (page.startsWith("/book/success")) {
    const id = page.split("?id=")[1];
    return <BookingSuccess bookingId={id} />;
  }
  if (page === "/login") return <LoginPage />;
  if (page === "/signup") return <SignupPage />;
  if (page === "/account") return <AccountPage />;
  if (page === "/admin") return <AdminPage />;
  return <HomePage />;
};

// ─── MAIN APP ──────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("/");
  const [city, setCity] = useState("Kanyakumari");
  const [lang, setLang] = useState("en");
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  const addBooking = useCallback((b) => setBookings(prev => [...prev, b]), []);

  const handleSetPage = useCallback((p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <AppContext.Provider value={{ page, setPage: handleSetPage, city, setCity, lang, setLang, user, setUser, bookings, addBooking }}>
      <div style={{
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: colors.bg, color: colors.text,
        minHeight: "100vh", display: "flex", flexDirection: "column",
      }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:wght@600;700;800&display=swap" rel="stylesheet" />
        <Navbar />
        <main style={{ flex: 1 }}>
          <Router page={page} />
        </main>
        <Footer />

        {/* Floating WhatsApp */}
        <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{
          position: "fixed", bottom: 24, right: 24, width: 56, height: 56, borderRadius: "50%",
          background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)", zIndex: 99, transition: "transform 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          <Icon type="whatsapp" size={28} color={colors.white} />
        </a>

        {/* Admin link (bottom left for dev) */}
        <button onClick={() => handleSetPage("/admin")} style={{
          position: "fixed", bottom: 24, left: 24, padding: "8px 14px", borderRadius: 8,
          background: colors.text, color: colors.white, fontSize: 11, fontWeight: 700,
          border: "none", cursor: "pointer", opacity: 0.6, zIndex: 99, fontFamily: "inherit",
        }}>⚙ Admin</button>
      </div>
    </AppContext.Provider>
  );
}
