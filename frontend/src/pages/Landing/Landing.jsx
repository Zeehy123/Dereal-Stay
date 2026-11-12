import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiCreditCard,
  FiHome,
  FiMapPin,
  FiPhone,
  FiMail,
  FiUsers,
  FiWifi,
  FiWind,
  FiTv,
  FiCoffee,
} from "react-icons/fi";
import { BRAND_NAME, BRAND_TAGLINE } from "../../config";
import { useAuth } from "../../context/AuthContext";

const FEATURES = [
  { icon: FiCalendar, title: "Reservations", text: "Book, confirm, check in and check out guests without double-booking a room." },
  { icon: FiHome, title: "Rooms & rates", text: "Keep every room's type, price and live status — available, occupied or in maintenance." },
  { icon: FiUsers, title: "Guest records", text: "A searchable guest book with contact details, ID and stay history." },
  { icon: FiCreditCard, title: "Payments in ₦", text: "Record cash, transfer and POS payments, track balances and issue receipts." },
];

const ROOM_TYPES = [
  { name: "Standard", blurb: "Comfortable and quiet, ideal for solo travellers and short stays.", perks: [FiWifi, FiTv, FiWind] },
  { name: "Deluxe", blurb: "More space, a work desk and a mini bar for longer visits.", perks: [FiWifi, FiTv, FiWind, FiCoffee] },
  { name: "Executive", blurb: "Our premium floor with a lounge corner and priority service.", perks: [FiWifi, FiTv, FiWind, FiCoffee] },
];

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const cta = isAuthenticated ? { to: "/dashboard", label: "Open dashboard" } : { to: "/login", label: "Staff login" };

  return (
    <div className="bg-[#F5F2ED] text-[#1b1816] min-h-screen">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-20 bg-[#F5F2ED]/90 backdrop-blur border-b border-gray-300/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <a href="#top" className="text-xl font-semibold text-[#C76A12]">{BRAND_NAME}</a>
          <nav className="hidden md:flex gap-8 text-sm">
            <a href="#features" className="hover:text-[#C76A12]">Features</a>
            <a href="#rooms" className="hover:text-[#C76A12]">Rooms</a>
            <a href="#contact" className="hover:text-[#C76A12]">Contact</a>
          </nav>
          <Link to={cta.to} className="bg-[#C76A12] text-white text-sm px-5 py-2.5 rounded-xl">
            {cta.label}
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="pt-16">
        <div className="relative bg-gradient-to-br from-[#1b1816] via-[#2c2118] to-[#C76A12] text-white">
          <div className="max-w-6xl mx-auto px-6 py-28 md:py-40">
            <p className="uppercase tracking-[0.3em] text-sm text-white/70">{BRAND_TAGLINE}</p>
            <h1 className="text-5xl md:text-7xl font-serif mt-4 max-w-3xl leading-tight">
              A calm stay, run with clarity.
            </h1>
            <p className="mt-6 text-lg text-white/80 max-w-xl">
              {BRAND_NAME} brings reservations, rooms, guests and payments into one
              simple system, so your team spends less time on paperwork and more time with guests.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to={cta.to} className="bg-[#C76A12] px-7 py-3.5 rounded-xl font-medium">
                {cta.label}
              </Link>
              <a href="#features" className="px-7 py-3.5 rounded-xl border border-white/40">
                See what it does
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-serif">Everything the front desk needs</h2>
        <p className="text-gray-600 mt-3 max-w-2xl">Built around how a guest house actually runs day to day.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#C76A12] flex items-center justify-center">
                <Icon size={22} />
              </div>
              <h3 className="font-semibold text-lg mt-5">{title}</h3>
              <p className="text-sm text-gray-600 mt-2">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Rooms */}
      <section id="rooms" className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <h2 className="text-4xl font-serif">Rooms for every stay</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {ROOM_TYPES.map(({ name, blurb, perks }) => (
              <div key={name} className="rounded-3xl border border-gray-200 p-7 bg-[#F8F6F2]">
                <h3 className="text-2xl font-serif">{name}</h3>
                <p className="text-sm text-gray-600 mt-2">{blurb}</p>
                <div className="flex gap-3 mt-5 text-[#C76A12]">
                  {perks.map((Perk, i) => <Perk key={i} size={18} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + contact */}
      <section id="contact" className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-4xl font-serif">Get in touch</h2>
          <p className="text-gray-600 mt-3">Questions about a booking or the system? We&apos;d love to hear from you.</p>
          <ul className="mt-8 space-y-4 text-gray-700">
            <li className="flex items-center gap-3"><FiMapPin className="text-[#C76A12]" /> Lagos, Nigeria</li>
            <li className="flex items-center gap-3"><FiPhone className="text-[#C76A12]" /> +234 000 000 0000</li>
            <li className="flex items-center gap-3"><FiMail className="text-[#C76A12]" /> hello@example.com</li>
          </ul>
        </div>
        <div className="bg-[#1b1816] text-white rounded-3xl p-10 self-start">
          <h3 className="text-2xl font-serif">Staff? Sign in to start your shift.</h3>
          <Link to={cta.to} className="inline-block mt-6 bg-[#C76A12] px-6 py-3 rounded-xl">
            {cta.label}
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-300 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
