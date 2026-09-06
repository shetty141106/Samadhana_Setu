import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * JharkhandAppShell
 * -----------------------------------------------------------------------
 * Implements the flow from the auth-sequence + role-navigation diagrams:
 *   Login → Role? → JWT stored / AuthContext updated → AppShell
 *     (Topbar + Sidebar + Content, sidebar contents keyed by role)
 *
 * Design language: "Sal Forest & Red Soil" — Jharkhand's landscape
 * (dense sal forests, terracotta earth, tribal art motifs) translated
 * into a civic-tech interface. One deliberate motion moment on login
 * (a circular forest-green "wash" the sidebar rises out of); everything
 * else is quiet, functional hover/focus feedback.
 *
 * Drop into a Vite/CRA project alongside tailwind.config.js (provided
 * separately). Needs two Google Fonts in index.html:
 *   Plus Jakarta Sans (400,500,600,700,800) and Cormorant Garamond (500,600 italic)
 * -----------------------------------------------------------------------
 */

/* ----------------------------- Icon set --------------------------------
   Hand-rolled 20x20 stroke icons — zero extra dependency, matches the
   line weight used throughout the UI. */
const Icon = ({ path, className = "w-5 h-5", ...p }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
       strokeLinecap="round" strokeLinejoin="round" className={className} {...p}>
    {path}
  </svg>
);
const icons = {
  home: <><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v9a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-9" /><path d="M9.5 20v-6h5v6" /></>,
  report: <><path d="M8 3h8l3 4v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" /><path d="M9 12h6M9 16h6M9 8h2" /></>,
  list: <><path d="M8 6h13M8 12h13M8 18h13" /><circle cx="3.5" cy="6" r="1.4" /><circle cx="3.5" cy="12" r="1.4" /><circle cx="3.5" cy="18" r="1.4" /></>,
  map: <><path d="M9 4 3 6.5v13L9 17l6 3 6-2.5v-13L15 7 9 4Z" /><path d="M9 4v13M15 7v13" /></>,
  user: <><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20.5c1.5-4 4-6 7.5-6s6 2 7.5 6" /></>,
  queue: <><rect x="3.5" y="4.5" width="17" height="4" rx="1" /><rect x="3.5" y="10" width="17" height="4" rx="1" /><rect x="3.5" y="15.5" width="10" height="4" rx="1" /></>,
  heat: <><path d="M12 3c2.5 3 4 5.4 4 8a4 4 0 1 1-8 0c0-1 .3-1.9.8-2.7" /><path d="M12 12.5c1 1 1.6 1.9 1.6 3a1.6 1.6 0 1 1-3.2 0c0-.6.2-1 .5-1.5" /></>,
  assign: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 12h6M12 9v6" /></>,
  project: <><rect x="4" y="5" width="16" height="14" rx="2" /><path d="M4 9.5h16M9 5v4" /></>,
  kanban: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 4v16M15 4v9" /></>,
  task: <><rect x="4.5" y="4.5" width="15" height="15" rx="2.5" /><path d="M8.5 12.5 11 15l5-6" /></>,
  team: <><circle cx="9" cy="9" r="3" /><circle cx="16.5" cy="10.5" r="2.5" /><path d="M3.5 19c.7-3 3-4.7 5.5-4.7s4.8 1.7 5.5 4.7M15 19c.4-2 1.7-3.3 3.4-3.6" /></>,
  mentor: <><path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" /><path d="M6.5 10v4.5c0 1.3 2.5 2.5 5.5 2.5s5.5-1.2 5.5-2.5V10" /></>,
  milestone: <><path d="M6 4v16" /><path d="M6 5h11l-3 3.5L17 12H6" /></>,
  browse: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m20 20-4.7-4.7" /></>,
  spons: <><path d="M12 20s-7-4.3-7-9.8A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7 3.2C19 15.7 12 20 12 20Z" /></>,
  chart: <><path d="M4 20V10M11 20V4M18 20v-7" /><path d="M2.5 20h19" /></>,
  users: <><circle cx="8" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M2.5 19c.6-3.3 2.7-5 5.5-5s5 1.8 5.5 5" /><path d="M14.5 15.2c2.3.3 3.7 1.8 4.2 3.8" /></>,
  overview: <><rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5" /><rect x="13" y="3.5" width="7.5" height="7.5" rx="1.5" /><rect x="3.5" y="13" width="7.5" height="7.5" rx="1.5" /><rect x="13" y="13" width="7.5" height="7.5" rx="1.5" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.4-2-3.4-2.3.8a7.7 7.7 0 0 0-2.6-1.5L14 2.5h-4l-.5 2.5a7.7 7.7 0 0 0-2.6 1.5l-2.3-.8-2 3.4 2 1.4a7.6 7.6 0 0 0 0 3l-2 1.4 2 3.4 2.3-.8c.8.7 1.7 1.2 2.6 1.5l.5 2.5h4l.5-2.5a7.7 7.7 0 0 0 2.6-1.5l2.3.8 2-3.4-2-1.4Z" /></>,
  bell: <><path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9Z" /><path d="M10 18a2 2 0 0 0 4 0" /></>,
  logout: <><path d="M9 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H9" /><path d="M14 16.5 19 12l-5-4.5M19 12H9" /></>,
  chevron: <path d="m9 6 6 6-6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  leaf: <path d="M4 20C4 9 12 4 20 4c0 8-5 16-16 16Zm0 0c3-3 6-6.5 8-11" />,
};
const I = (name, className) => <Icon path={icons[name]} className={className} />;

/* --------------------------- Role definitions --------------------------- */
const ROLES = [
  {
    id: "citizen", label: "Citizen", seed: "sal-village-road",
    blurb: "Report a civic issue and track it to resolution.",
    dash: "Citizen Dashboard",
    hero: "Your street, your voice",
    sub: "3 open reports · 1 resolved this month",
    nav: [
      { icon: "home", label: "Dashboard" },
      { icon: "report", label: "Report Issue" },
      { icon: "list", label: "My Issues" },
      { icon: "map", label: "Nearby Map" },
      { icon: "user", label: "Profile" },
    ],
  },
  {
    id: "nodal", label: "Nodal Officer", seed: "forest-office",
    blurb: "Verify, assign, and track issues in your jurisdiction.",
    dash: "Nodal Dashboard",
    hero: "Ward 14 — Pending Verification",
    sub: "12 in queue · 4 flagged urgent",
    nav: [
      { icon: "home", label: "Dashboard" },
      { icon: "queue", label: "Pending Verification" },
      { icon: "heat", label: "Area Map / Heatmap" },
      { icon: "assign", label: "Assigned Issues" },
      { icon: "user", label: "Profile" },
    ],
  },
  {
    id: "student", label: "Student", seed: "student-lab",
    blurb: "Run your R&D project from idea to milestone review.",
    dash: "Student R&D Workspace",
    hero: "Project Mahua — Sprint 4",
    sub: "6 tasks in progress · milestone due Fri",
    nav: [
      { icon: "home", label: "Dashboard" },
      { icon: "project", label: "My Projects" },
      { icon: "kanban", label: "Kanban Board" },
      { icon: "task", label: "My Tasks" },
      { icon: "team", label: "Team" },
      { icon: "user", label: "Profile" },
    ],
  },
  {
    id: "faculty", label: "Faculty", seed: "faculty-desk",
    blurb: "Mentor projects and approve milestone gates.",
    dash: "Faculty Workspace",
    hero: "5 projects under mentorship",
    sub: "2 milestones awaiting approval",
    nav: [
      { icon: "home", label: "Dashboard" },
      { icon: "mentor", label: "Mentored Projects" },
      { icon: "milestone", label: "Milestone Approvals" },
      { icon: "user", label: "Profile" },
    ],
  },
  {
    id: "industry", label: "Industry", seed: "industry-csr",
    blurb: "Sponsor projects and track your CSR impact.",
    dash: "Industry / CSR Portal",
    hero: "Impact across 9 sponsored projects",
    sub: "₹18.4L committed this quarter",
    nav: [
      { icon: "home", label: "Dashboard" },
      { icon: "browse", label: "Browse Projects" },
      { icon: "spons", label: "My Sponsorships" },
      { icon: "user", label: "Profile" },
    ],
  },
  {
    id: "admin", label: "Admin", seed: "state-overview",
    blurb: "Oversee the whole platform — issues, projects, people.",
    dash: "System Admin Dashboard",
    hero: "State-wide overview",
    sub: "24 districts reporting · 99.2% uptime",
    nav: [
      { icon: "home", label: "Dashboard" },
      { icon: "chart", label: "Analytics & Heatmaps" },
      { icon: "users", label: "User Management" },
      { icon: "overview", label: "Issues Overview" },
      { icon: "overview", label: "Projects Overview" },
      { icon: "settings", label: "Settings" },
    ],
  },
];

const img = (seed, w = 1600, h = 900) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

/* ------------------------------ Login screen ---------------------------- */
function LoginScreen({ onEnter }) {
  const [roleId, setRoleId] = useState(null);
  const [phase, setPhase] = useState("idle"); // idle | authenticating
  const btnRef = useRef(null);

  const role = ROLES.find(r => r.id === roleId);

  const submit = (e) => {
    e.preventDefault();
    if (!roleId) return;
    setPhase("authenticating");
    // simulate: Login → Backend API → JWT + User Data → Store Token & Role
    const rect = btnRef.current?.getBoundingClientRect();
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    setTimeout(() => onEnter(roleId, origin), 900);
  };

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-[1.1fr_1fr] bg-jh-earth-50 font-sans">
      {/* Left hero — the "world" of the product */}
      <div className="relative hidden lg:block overflow-hidden">
        <img
          src={img("sal-forest-canopy", 1600, 1600)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-forest-overlay" />

        {/* three drifting leaves — the one non-user-triggered motion moment */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[{l:"12%",d:"0s",s:0.9},{l:"48%",d:"2.3s",s:1.3},{l:"78%",d:"4.1s",s:0.7}].map((c,i)=>(
            <span key={i}
              className="absolute -top-10 text-jh-gold-400/70 animate-leaf-fall"
              style={{ left: c.l, animationDelay: c.d, transform:`scale(${c.s})` }}>
              {I("leaf","w-7 h-7")}
            </span>
          ))}
        </div>

        <div className="relative z-10 flex h-full flex-col justify-between p-12 xl:p-16">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-jh-gold-500/90 text-jh-green-900 font-heading font-bold">JH</div>
            <span className="text-jh-earth-50 font-heading font-semibold tracking-tight">Jharkhand Digital Commons</span>
          </div>

          <div className="max-w-md">
            <p className="text-jh-gold-400 font-heading text-sm font-medium mb-3">Civic reporting · Student R&amp;D · Public–industry partnership</p>
            <h1 className="font-serif italic text-jh-earth-50 text-4xl xl:text-5xl leading-[1.15]">
              One state platform, rooted like the sal forest,
              <span className="not-italic font-sans font-semibold text-jh-terracotta-300"> branching to every role.</span>
            </h1>
          </div>

          <p className="text-jh-earth-200/80 text-sm max-w-sm">
            Six roles, one AppShell — the sidebar and workspace change under you, the ground stays the same.
          </p>
        </div>
      </div>

      {/* Right — role picker / login card */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <form onSubmit={submit} className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-jh-green-900 text-jh-gold-400 font-heading font-bold text-sm">JH</div>
            <span className="text-jh-green-900 font-heading font-semibold">Jharkhand Digital Commons</span>
          </div>

          <h2 className="font-heading text-2xl font-semibold text-jh-green-900">Sign in to continue</h2>
          <p className="text-jh-earth-600 text-sm mt-1.5 mb-6">Choose the role your account was registered under.</p>

          <div className="grid grid-cols-2 gap-2.5">
            {ROLES.map(r => {
              const active = r.id === roleId;
              return (
                <button
                  type="button" key={r.id} onClick={() => setRoleId(r.id)}
                  className={[
                    "group text-left rounded-xl border px-3.5 py-3 transition-all duration-200",
                    active
                      ? "border-jh-green-700 bg-jh-green-900 text-jh-earth-50 shadow-jh-glow"
                      : "border-jh-earth-200 bg-white text-jh-earth-800 hover:border-jh-green-300 hover:bg-jh-green-50",
                  ].join(" ")}
                >
                  <span className={active ? "text-jh-gold-400" : "text-jh-green-700"}>
                    {I(r.nav[0].icon, "w-5 h-5")}
                  </span>
                  <div className="mt-2 font-heading text-sm font-semibold">{r.label}</div>
                  <div className={"text-[11px] mt-0.5 leading-snug " + (active ? "text-jh-earth-200/80" : "text-jh-earth-500")}>
                    {r.blurb}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-jh-earth-600 mb-1.5">Username</label>
              <input defaultValue={role ? `${role.id}.demo` : ""} className="w-full rounded-lg border border-jh-earth-200 px-3 py-2 text-sm text-jh-earth-800 outline-none focus:border-jh-green-600 focus:ring-2 focus:ring-jh-green-100" />
            </div>
            <div>
              <label className="block text-xs font-medium text-jh-earth-600 mb-1.5">Password</label>
              <input type="password" defaultValue="••••••••" className="w-full rounded-lg border border-jh-earth-200 px-3 py-2 text-sm text-jh-earth-800 outline-none focus:border-jh-green-600 focus:ring-2 focus:ring-jh-green-100" />
            </div>
          </div>

          <button
            ref={btnRef} type="submit" disabled={!roleId || phase === "authenticating"}
            className="mt-6 w-full rounded-lg bg-green-gradient text-jh-earth-50 font-heading font-semibold text-sm py-3 shadow-jh-card transition-transform duration-150 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {phase === "authenticating" ? (
              <>
                <span className="h-3.5 w-3.5 rounded-full border-2 border-jh-earth-50/40 border-t-jh-earth-50 animate-spin" />
                Verifying credentials…
              </>
            ) : (
              <>Continue as {role ? role.label : "…"} {I("chevron","w-4 h-4")}</>
            )}
          </button>
          <p className="text-center text-[11px] text-jh-earth-400 mt-3">JWT is issued, stored, and AuthContext updated on success.</p>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------- Topbar --------------------------------- */
function Topbar({ role, onMenu, onLogout }) {
  const [profileOpen, setProfileOpen] = useState(false);
  return (
    <header className="animate-drop-in sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-jh-earth-50/90 backdrop-blur border-b border-jh-earth-200">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="lg:hidden grid h-9 w-9 place-items-center rounded-lg text-jh-green-800 hover:bg-jh-green-50">
          {I("menu","w-5 h-5")}
        </button>
        <div className="hidden sm:flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-jh-green-900 text-jh-gold-400 font-heading font-bold text-xs">JH</div>
          <span className="font-heading text-sm font-semibold text-jh-green-900">{role.dash}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3">
        <button className="relative grid h-9 w-9 place-items-center rounded-lg text-jh-earth-600 hover:bg-jh-earth-200/60 transition-colors">
          {I("bell","w-5 h-5")}
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-jh-terracotta-500" />
        </button>

        <div className="relative">
          <button onClick={() => setProfileOpen(o => !o)} className="flex items-center gap-2 rounded-lg pl-1 pr-2 py-1 hover:bg-jh-earth-200/60 transition-colors">
            <img src={img(role.id + "-avatar", 80, 80)} alt="" className="h-8 w-8 rounded-full object-cover ring-2 ring-jh-gold-400/60" />
            <span className="hidden sm:block text-sm font-medium text-jh-earth-800">{role.label} Demo</span>
            {I("chevron","w-4 h-4 hidden sm:block rotate-90 text-jh-earth-400")}
          </button>
          {profileOpen && (
            <div className="animate-rise-in absolute right-0 mt-2 w-48 rounded-xl border border-jh-earth-200 bg-white p-1.5 shadow-jh-card">
              <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-jh-earth-700 hover:bg-jh-earth-100">Profile settings</button>
              <button onClick={onLogout} className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-sm text-jh-terracotta-700 hover:bg-jh-terracotta-50">
                {I("logout","w-4 h-4")} Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* -------------------------------- Sidebar --------------------------------- */
function Sidebar({ role, mobileOpen, onClose }) {
  const [active, setActive] = useState(0);

  const content = (
    <div className="flex h-full flex-col bg-green-gradient text-jh-earth-100">
      <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
        <span className="font-heading text-sm font-semibold text-jh-earth-50">{role.label} Menu</span>
        <button onClick={onClose} className="lg:hidden text-jh-earth-200 hover:text-white">{I("x","w-5 h-5")}</button>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {role.nav.map((item, i) => {
          const isActive = i === active;
          return (
            <button
              key={item.label} onClick={() => setActive(i)}
              className={[
                "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150",
                isActive
                  ? "bg-jh-earth-50 text-jh-green-900 font-semibold shadow-jh-soft"
                  : "text-jh-earth-100/85 hover:bg-white/10",
              ].join(" ")}
            >
              <span className={isActive ? "text-jh-terracotta-600" : "text-jh-gold-400/90"}>{I(item.icon,"w-[18px] h-[18px]")}</span>
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="p-4 mx-3 mb-4 rounded-xl bg-white/10 text-xs text-jh-earth-100/85">
        <p className="font-heading font-semibold text-jh-gold-400 mb-1">Rooted in every district</p>
        <p>Same AppShell, same sidebar pattern — only the branches change.</p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="animate-slide-in-left hidden lg:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
        {content}
      </aside>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-jh-charcoal/60 backdrop-blur-sm" onClick={onClose} />
          <div className="absolute inset-y-0 left-0 w-72 animate-slide-in-left">{content}</div>
        </div>
      )}
    </>
  );
}

/* --------------------------------- Content -------------------------------- */
function StatChip({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-jh-earth-200 bg-white px-4 py-3.5">
      <p className="text-[11px] font-medium text-jh-earth-500">{label}</p>
      <p className={"mt-1 font-heading text-xl font-bold " + accent}>{value}</p>
    </div>
  );
}

function Dashboard({ role }) {
  return (
    <div className="animate-rise-in max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Hero banner — contextual, not a generic card */}
      <div className="relative overflow-hidden rounded-2xl h-44 sm:h-56">
        <img src={img(role.seed)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-forest-overlay-light" />
        <div className="relative z-10 h-full flex flex-col justify-end p-5 sm:p-7">
          <p className="text-jh-gold-400 text-xs font-heading font-semibold tracking-wide">{role.label.toUpperCase()} · LIVE</p>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-jh-earth-50 mt-1">{role.hero}</h1>
          <p className="text-jh-earth-100/85 text-sm mt-1">{role.sub}</p>
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
        <StatChip label="Open" value="12" accent="text-jh-terracotta-600" />
        <StatChip label="In progress" value="7" accent="text-jh-green-700" />
        <StatChip label="Resolved" value="34" accent="text-jh-green-700" />
        <StatChip label="Avg. response" value="1.8d" accent="text-jh-indigo" />
      </div>

      {/* Two unequal panels — deliberately not a repeated card grid */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4 mt-4">
        <div className="rounded-2xl border border-jh-earth-200 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-jh-earth-800">Recent activity</h2>
            <button className="text-xs font-medium text-jh-green-700 hover:text-jh-green-900">View all</button>
          </div>
          <ul className="space-y-3">
            {["Pothole near Sadar Hospital verified", "Milestone 2 approved for Project Mahua", "New sponsorship confirmed — ₹2.4L"].map((t, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-jh-terracotta-500 shrink-0" />
                <span className="text-jh-earth-700">{t}</span>
                <span className="ml-auto text-xs text-jh-earth-400 shrink-0">{i + 1}h ago</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-terracotta-gradient p-5 text-jh-earth-50 flex flex-col justify-between overflow-hidden relative">
          <div className="absolute -right-6 -bottom-6 opacity-20">{I("leaf","w-32 h-32")}</div>
          <div className="relative z-10">
            <h2 className="font-heading font-semibold">Quick action</h2>
            <p className="text-sm text-jh-earth-50/90 mt-1.5">
              {role.id === "citizen" && "Spotted something in your area? File it in under two minutes."}
              {role.id === "nodal" && "4 issues are past SLA — clear the queue today."}
              {role.id === "student" && "Your next milestone review opens Friday."}
              {role.id === "faculty" && "2 milestone submissions are awaiting your review."}
              {role.id === "industry" && "3 new projects match your CSR focus areas."}
              {role.id === "admin" && "Weekly state digest is ready to export."}
            </p>
          </div>
          <button className="relative z-10 mt-5 self-start rounded-lg bg-jh-earth-50 text-jh-terracotta-700 text-sm font-heading font-semibold px-4 py-2 hover:bg-jh-earth-100 transition-colors">
            {role.nav[1]?.label ?? "Open"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Root app -------------------------------- */
export default function JharkhandAppShell() {
  const [roleId, setRoleId] = useState(null);
  const [wash, setWash] = useState(null); // {x,y} origin for the reveal
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = useMemo(() => ROLES.find(r => r.id === roleId), [roleId]);

  const handleEnter = (id, origin) => {
    setWash(origin);
    setRoleId(id);
  };

  const handleLogout = () => { setRoleId(null); setWash(null); };

  useEffect(() => {
    if (wash) {
      document.documentElement.style.setProperty("--origin-x", `${wash.x}px`);
      document.documentElement.style.setProperty("--origin-y", `${wash.y}px`);
    }
  }, [wash]);

  if (!role) return <LoginScreen onEnter={handleEnter} />;

  return (
    <div className="min-h-screen bg-jh-earth-100 font-sans" style={{ "--origin-x": `${wash?.x ?? 0}px`, "--origin-y": `${wash?.y ?? 0}px` }}>
      <div className="animate-wash-in">
        <Topbar role={role} onMenu={() => setMobileOpen(true)} onLogout={handleLogout} />
        <div className="flex">
          <Sidebar role={role} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
          <main className="flex-1 min-w-0">
            <Dashboard role={role} />
          </main>
        </div>
      </div>
    </div>
  );
}