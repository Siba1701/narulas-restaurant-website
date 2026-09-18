"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays, Check, ChevronRight, Clock3, Heart, Home, MapPin,
  Minus, Phone, Plus, ShoppingCart, Sparkles, Star, UserRound, UtensilsCrossed, Users, X
} from "lucide-react";

const food = [
  { id: 1, name: "Paneer Butter Masala", price: 280, category: "North Indian", menuCategory: "Main Course", tag: "Bestseller", image: "/menu/dish-1-1.jpg" },
  { id: 2, name: "Chicken Biryani", price: 320, category: "Rice & Biryani", menuCategory: "Rice & Biryani", tag: "Popular", image: "/menu/dish-1-2.jpg" },
  { id: 3, name: "Margherita Pizza", price: 260, category: "Italian", menuCategory: "Main Course", tag: "Classic", image: "/menu/dish-1-3.jpg" },
  { id: 4, name: "Butter Naan", price: 60, category: "Breads", menuCategory: "Breads", tag: "Fresh", image: "/menu/dish-1-4.jpg" },
  { id: 5, name: "Grilled Chicken", price: 290, category: "Chef Special", menuCategory: "Main Course", tag: "Chef Pick", image: "/menu/dish-1-5.jpg" },
  { id: 6, name: "Chocolate Lava Cake", price: 180, category: "Desserts", menuCategory: "Desserts", tag: "Sweet", image: "/menu/dish-1-6.jpg" },
  { id: 7, name: "Butter Chicken", price: 320, category: "North Indian", menuCategory: "Main Course", tag: "Bestseller", image: "/menu/dish-2-1.jpg" },
  { id: 8, name: "Pasta Alfredo", price: 270, category: "Italian", menuCategory: "Main Course", tag: "Popular", image: "/menu/dish-2-2.jpg" },
  { id: 9, name: "Chilli Paneer", price: 240, category: "Indo-Chinese", menuCategory: "Starters", tag: "Spicy", image: "/menu/dish-2-3.jpg" },
  { id: 10, name: "Dal Makhani", price: 220, category: "North Indian", menuCategory: "Main Course", tag: "Classic", image: "/menu/dish-2-4.jpg" },
  { id: 11, name: "Veg Hakka Noodles", price: 200, category: "Indo-Chinese", menuCategory: "Main Course", tag: "Popular", image: "/menu/dish-2-5.jpg" },
  { id: 12, name: "Garlic Bread", price: 150, category: "Italian", menuCategory: "Sides", tag: "Sides", image: "/menu/dish-2-6.jpg" },
  { id: 13, name: "Veg Burger", price: 180, category: "Continental", menuCategory: "Main Course", tag: "New", image: "/menu/dish-3-1.jpg" },
  { id: 14, name: "Chicken Tikka", price: 310, category: "Tandoor", menuCategory: "Starters", tag: "Popular", image: "/menu/dish-3-2.jpg" },
  { id: 15, name: "Paneer Tikka", price: 280, category: "Tandoor", menuCategory: "Starters", tag: "Chef Pick", image: "/menu/dish-3-3.jpg" },
  { id: 16, name: "Caesar Salad", price: 220, category: "Salads", menuCategory: "Sides", tag: "Healthy", image: "/menu/dish-3-4.jpg" },
  { id: 17, name: "Gulab Jamun", price: 140, category: "Desserts", menuCategory: "Desserts", tag: "Classic", image: "/menu/dish-3-5.jpg" },
  { id: 18, name: "Masala Fries", price: 160, category: "Sides", menuCategory: "Sides", tag: "Popular", image: "/menu/dish-3-6.jpg" },
];

const categories = [
  { name: "Breakfast", image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=700&q=85" },
  { name: "Lunch", image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=85" },
  { name: "Dinner", image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=85" },
  { name: "Drinks", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=700&q=85" },
  { name: "Desserts", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=700&q=85" },
];

const tables = [
  ...Array.from({ length: 5 }, (_, i) => ({ number: i + 1, capacity: 2 })),
  ...Array.from({ length: 10 }, (_, i) => ({ number: i + 6, capacity: 5 })),
];

function makeSlots() {
  const out: string[] = [];
  for (let h = 11; h <= 23; h++) for (const m of [0, 30]) {
    if (h === 23 && m === 30) continue;
    out.push(`${String(h).padStart(2, "0")}:${m ? "30" : "00"}`);
  }
  return out;
}
const timeSlots = makeSlots();

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;
  return `${hour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function formatDate(date: string) {
  if (!date) return "Select date";
  const [year, month, day] = date.split("-").map(Number);
  const value = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long", day: "2-digit", month: "short", year: "numeric", timeZone: "UTC"
  }).format(value);
}


function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function CalendarPicker({
  value,
  minDate,
  onChange,
}: {
  value: string;
  minDate: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => {
  const source = value || minDate;

  if (source) {
    return source.slice(0, 7);
  }

  const today = new Date();

  return `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;
});

  useEffect(() => {
    const close = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".calendarPicker")) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const selected = value ? new Date(`${value}T12:00:00`) : null;
  const minimum = minDate ? new Date(`${minDate}T12:00:00`) : null;
  const monthDate = new Date(`${month}-01T12:00:00`);
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, index) => {
    const day = index - firstDay + 1;
    if (day < 1) return null;
    return new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
  });
  while (cells.length % 7) cells.push(null);

  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(monthDate);
  const todayKey = minDate;
  const minMonth = minimum ? `${minimum.getFullYear()}-${String(minimum.getMonth() + 1).padStart(2, "0")}` : "";
  const previousMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1);
  const previousKey = `${previousMonth.getFullYear()}-${String(previousMonth.getMonth() + 1).padStart(2, "0")}`;
  const canGoPrevious = !minMonth || previousKey >= minMonth;

  const selectDate = (day: Date) => {
    const key = toDateKey(day);
    if (minDate && key < minDate) return;
    onChange(key);
    setMonth(key.slice(0, 7));
    setOpen(false);
  };

  const selectToday = () => {
  const today = new Date();

  const todayKey =
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  onChange(todayKey);

  setMonth(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
  );

  setOpen(false);
};

  return (
    <div className="calendarPicker">
      <button type="button" className="calendarTrigger" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        <span><CalendarDays size={16}/> Date</span>
        <strong>{value ? value.split("-").reverse().join("-") : "Select Date"}</strong>
        <CalendarDays size={15}/>
      </button>
      {open && <div className="calendarPopover">
        <div className="calendarHeader">
          <button type="button" disabled={!canGoPrevious} onClick={() => canGoPrevious && setMonth(previousKey)} aria-label="Previous month">‹</button>
          <strong>{monthLabel}</strong>
          <button type="button" onClick={() => { const next = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1); setMonth(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`); }} aria-label="Next month">›</button>
        </div>
        <div className="calendarWeekdays">{["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => <span key={day}>{day}</span>)}</div>
        <div className="calendarGrid">
          {cells.map((day, index) => day ? (
            <button
              key={index}
              type="button"
              className={`${selected && toDateKey(selected) === toDateKey(day) ? "selected" : ""} ${todayKey === toDateKey(day) ? "today" : ""} ${minimum && toDateKey(day) < minDate ? "disabled" : ""}`}
              disabled={!!minimum && toDateKey(day) < minDate}
              onClick={() => selectDate(day)}
              aria-label={toDateKey(day)}
            >
              {day.getDate()}
            </button>
          ) : <span key={index} />)}
        </div>
        <div className="calendarFooter">
<button
  type="button"
  onClick={() => {
    onChange("");

    const today = new Date();

    setMonth(
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
    );

    setOpen(false);
  }}
>
  Clear
</button>          <button type="button" onClick={selectToday} disabled={!todayKey}>Today</button>
        </div>
      </div>}
    </div>
  );
}

export default function RestaurantHome({ view = "home" }: { view?: string }) {
  const [date, setDate] = useState("");
  const [todayDate, setTodayDate] = useState("");
  const [time, setTime] = useState("19:00");
  const [guests, setGuests] = useState(2);
  const [booked, setBooked] = useState<number[]>([]);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [cart, setCart] = useState<Record<number, number>>(() => {
    if (typeof window === "undefined") return {};
    try { return JSON.parse(localStorage.getItem("narulas-cart") || "{}"); } catch { return {}; }
  });
  const [showBooking, setShowBooking] = useState(false);
  const [status, setStatus] = useState("");
  const [bookingCode, setBookingCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [menuCategory, setMenuCategory] = useState("Popular Dishes");
  const [menuSearch, setMenuSearch] = useState("");
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", request: "" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryDate = params.get("date");
    const queryTime = params.get("time");
    const queryGuests = Number(params.get("guests"));

    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    const today = d.toISOString().slice(0, 10);

    setTodayDate(today);
    setDate(queryDate && queryDate >= today ? queryDate : today);
    if (queryTime && timeSlots.includes(queryTime)) setTime(queryTime);
    if (queryGuests >= 1 && queryGuests <= 5) setGuests(queryGuests);
  }, []);

  useEffect(() => {
    try { localStorage.setItem("narulas-cart", JSON.stringify(cart)); } catch {}
  }, [cart]);

  useEffect(() => {
    if (!date || !time) return;
    fetch(`/api/bookings?date=${date}&time=${time}`)
      .then(async (r) => {
        const text = await r.text();
        let data: any = {};
        try { data = text ? JSON.parse(text) : {}; } catch { return; }
        if (r.ok) {
          setBooked(data.booked || []);
          if (selectedTable && data.booked?.includes(selectedTable)) setSelectedTable(null);
        }
      })
      .catch(() => undefined);
  }, [date, time, selectedTable]);

  const eligibleTables = useMemo(() => tables.filter((t) => t.capacity >= guests), [guests]);
  const cartItems = food.filter((item) => cart[item.id]).map((item) => ({ ...item, qty: cart[item.id] }));
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const menuCategories = ["Popular Dishes", "Starters", "Main Course", "Breads", "Rice & Biryani", "Desserts", "Beverages", "Sides"];
  const menuItems = food.filter((item) => {
    const matchesCategory = menuCategory === "Popular Dishes" || item.menuCategory === menuCategory;
    const q = menuSearch.trim().toLowerCase();
    return matchesCategory && (!q || `${item.name} ${item.category}`.toLowerCase().includes(q));
  });

  const setQty = (id: number, delta: number) => setCart((current) => {
    const next = Math.max(0, (current[id] || 0) + delta);
    const copy = { ...current };
    if (next === 0) delete copy[id]; else copy[id] = next;
    return copy;
  });

  async function submitBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTable) return setStatus("Please select an available table.");
    setLoading(true); setStatus("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customer.name, customerEmail: customer.email, customerPhone: customer.phone,
          specialRequest: customer.request, date, time, guests, tableNumber: selectedTable,
          foodOrder: cartItems.map((item) => ({ name: item.name, qty: item.qty, price: item.price })),
        }),
      });
      const text = await res.text();
      let data: any = {};
      try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }
      if (!res.ok) return setStatus(data.error || "Unable to complete booking.");
      setBookingCode(data.bookingCode || "CONFIRMED");
      setStatus(data.emailSent ? "Booking confirmed. A notification has been sent to the restaurant." : "Booking confirmed. Restaurant email notification is not configured yet.");
      setBooked((current) => [...current, selectedTable]);
      setSelectedTable(null);
      setCart({});
    } catch {
      setStatus("Unable to reach the booking server. Please try again.");
    } finally { setLoading(false); }
  }

  return (
    <main className={view === "home" ? "homePage" : ""}>
      <aside className={`sideNav ${mobileNav ? "open" : ""}`}>
        <div className="sideBrand"><span className="brandMark">N</span><div><strong>Narula's</strong><small>RESTAURANT</small></div></div>
        <nav>
          <a className={view === "home" ? "active" : ""} href="/"><Home size={18}/> Home</a>
          <a className={view === "menu" ? "active" : ""} href="/menu"><UtensilsCrossed size={18}/> Menu</a>
          <a className={view === "reserve" ? "active" : ""} href="/table-booking"><CalendarDays size={18}/> Table Booking</a>
                    <a className={view === "offers" ? "active" : ""} href="/offers"><Sparkles size={18}/> Offers</a>
          <a className={view === "experience" ? "active" : ""} href="/experience"><Heart size={18}/> Experience</a>
          <a className={view === "about" ? "active" : ""} href="/about"><Star size={18}/> About</a>
          <a className={view === "contact" ? "active" : ""} href="/contact"><Phone size={18}/> Contact</a>
        </nav>
        <div className="sideNote"><b>Good food.<br/>Good mood.</b><span>Freshly prepared, served warm.</span></div>
      </aside>

      <div className="siteShell">
        <header className="topbar" id="home">
          <button className="mobileMenu" onClick={() => setMobileNav(!mobileNav)}>☰</button>
          <div className="search"><span>⌕</span><input placeholder="Search dishes, cuisines, restaurants..." /></div>
          <div className="topActions"><span className="location"><MapPin size={15}/> Bhubaneswar</span><button aria-label="Favorites"><Heart size={18}/></button><button aria-label="Account"><UserRound size={18}/></button><button className="cartButton" onClick={() => { window.location.href = "/pre-order"; }}><ShoppingCart size={18}/>{cartCount > 0 && <b>{cartCount}</b>}</button></div>
        </header>

        {view === "home" && <section className="homeHero">
          <div className="heroVisual"><img src="/restaurant-hero.png" alt="Warmly lit Narula's restaurant dining room"/><div className="heroShade"/></div>
          <div className="heroContent"><p className="miniLabel">GOOD FOOD • GREAT COMPANY</p><h1>Dine your way at <span>Narula's.</span></h1><p>Reserve your table in advance and enjoy a seamless dining experience with great food, warm hospitality and a perfect ambiance.</p><div className="heroCtas"><button className="orangeButton" onClick={() => { window.location.href = "/table-booking"; }}><CalendarDays size={18}/> Book a Table & Order Food <ChevronRight size={17}/></button><button className="lightButton" onClick={() => { window.location.href = "/menu"; }}><UtensilsCrossed size={18}/> Explore Menu</button></div><div className="trustRow"><span>✓ Fresh ingredients</span><span>✓ Authentic flavours</span><span>✓ Family friendly</span></div></div>
          <div className="quickBook"><div className="quickBookHeader"><div><span className="quickEyebrow">TABLE BOOKING</span><h2>Book Your Table</h2><p>Reserve your table in a few clicks and get ready for a great dining experience at Narula's.</p></div><div className="quickBookIcon"><CalendarDays size={26}/></div></div><div className="quickFields bookingHomeFields"><div className="dateField"><CalendarPicker value={date} minDate={todayDate} onChange={(next) => { setDate(next); setSelectedTable(null); }}/></div><label><span><Clock3 size={16}/> Time</span><select value={time} onChange={(e) => { setTime(e.target.value); setSelectedTable(null); }}>{timeSlots.map((t) => <option key={t} value={t}>{formatTime(t)}</option>)}</select></label><label className="guestsField"><span><Users size={16}/> Guests</span><select value={guests} onChange={(e) => { setGuests(Number(e.target.value)); setSelectedTable(null); }}>{[1,2,3,4,5].map((n) => <option key={n} value={n}>{n} {n === 1 ? "Person" : "People"}</option>)}</select></label></div><button className="findTable" onClick={() => { const params = new URLSearchParams({ date, time, guests: String(guests) }); window.location.href = `/table-booking?${params.toString()}`; }}>Check Availability <ChevronRight size={18}/></button><div className="quickBenefits"><div><span><Check size={16}/></span><p><b>Instant</b>Confirmation</p></div><div><span><CalendarDays size={16}/></span><p><b>Real-time</b>Availability</p></div><div><span><Check size={16}/></span><p><b>Safe &amp; Secure</b>Booking</p></div></div></div>
        </section>}

        {view === "menu" && <section className="fullMenuSection">
          <div className="menuPageHeader"><div><span>PRE-ORDER FOR YOUR TABLE</span><h1>Popular dishes</h1><p>Add your favourites here and they will be attached to your table booking.</p></div><div className="menuSearch"><span>⌕</span><input value={menuSearch} onChange={(e) => setMenuSearch(e.target.value)} placeholder="Search dishes..."/></div></div>
          <div className="menuCategoryTabs">{menuCategories.map((category) => <button key={category} className={menuCategory === category ? "active" : ""} onClick={() => setMenuCategory(category)}>{category}</button>)}</div>
          <div className="fullMenuGrid">{menuItems.map((item) => <article className="fullMenuCard" key={item.id}><div className="fullMenuImage"><img src={item.image} alt={item.name}/><span>{item.tag}</span></div><div className="fullMenuInfo"><small>{item.category}</small><h3>{item.name}</h3><div><b>₹{item.price}</b><button onClick={() => setQty(item.id, 1)} aria-label={`Add ${item.name}`}>{cart[item.id] ? <><Plus size={15}/> {cart[item.id]}</> : <Plus size={18}/>}</button></div></div></article>)}</div>
          {menuItems.length === 0 && <div className="emptyMenu">No dishes found. Try another search or category.</div>}
          {cartCount > 0 && <div className="menuCartBar"><div><ShoppingCart size={18}/><strong>{cartCount} item{cartCount === 1 ? "" : "s"}</strong><span>₹{total}</span></div><button className="orangeButton" onClick={() => { window.location.href = "/table-booking"; }}>Add to Table Booking <ChevronRight size={16}/></button></div>}
        </section>}

        {false && <section className="categorySection" id="menu"><div className="sectionTitle"><div><span>EXPLORE</span><h2>Our Menu</h2></div><a href="/menu">View all <ChevronRight size={16}/></a></div><div className="categoryGrid">{categories.map((category) => <a className="categoryCard" href="/menu" key={category.name}><img src={category.image} alt={category.name}/><div><b>{category.name}</b><span>Explore dishes <ChevronRight size={14}/></span></div></a>)}</div></section>}

        {false && <section className="popularSection" id="preorder"><div className="sectionTitle"><div><span>PRE-ORDER FOR YOUR TABLE</span><h2>Popular dishes</h2></div><p>Add food now and we'll attach it to your reservation.</p></div><div className="popularGrid">{food.slice(0,6).map((item) => <article className="dishCard" key={item.id}><div className="dishImage"><img src={item.image} alt={item.name}/><span>{item.tag}</span></div><div className="dishInfo"><small>{item.category}</small><h3>{item.name}</h3><div><b>₹{item.price}</b><button onClick={() => setQty(item.id, 1)} aria-label={`Add ${item.name}`}><Plus size={17}/></button></div></div></article>)}</div></section>}

        {(view === "offers") && <section className="offerBanner" id="offers"><div><span>SPECIAL DINING OFFER</span><h2>Book a Table &<br/>Pre-order Food</h2><p>Plan ahead and save time when you arrive.</p><button className="orangeButton" onClick={() => { window.location.href = "/table-booking"; }}>Book Now <ChevronRight size={16}/></button></div><div className="offerImage"><img src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85" alt="Fresh Indian meal"/></div></section>}

        {view === "reserve" && <section className="combinedBookingSection">
          <div className="combinedHeader">
            <div><span>DINING EXPERIENCE</span><h1>Reserve Your Table</h1><p>Book your table and pre-order your favourite dishes for a seamless dining experience.</p></div>
            <div className="bookingBenefits"><div><CalendarDays size={20}/><b>Quick & Easy</b><small>Confirm in minutes</small></div><div><UtensilsCrossed size={20}/><b>Pre-order Food</b><small>Save time at the restaurant</small></div><div><Clock3 size={20}/><b>Seamless Experience</b><small>Dine without waiting</small></div></div>
          </div>
          <div className="combinedBookingGrid">
            <div className="bookingMainCard">
              <div className="bookingStep"><span>1</span><div><h3>Select Date, Time & Guests</h3><small>Choose your preferred dining details</small></div></div>
              <div className="bookingFields combinedFields">
                <div className="dateField"><CalendarPicker value={date} minDate={todayDate} onChange={(next) => { setDate(next); setSelectedTable(null); }}/></div>
                <label><span>Time</span><select value={time} onChange={(e) => { setTime(e.target.value); setSelectedTable(null); }}>{timeSlots.map((t) => <option key={t} value={t}>{formatTime(t)}</option>)}</select></label>
                <label><span>Guests</span><select value={guests} onChange={(e) => { setGuests(Number(e.target.value)); setSelectedTable(null); }}>{[1,2,3,4,5].map((n) => <option key={n} value={n}>{n} {n === 1 ? "Person" : "People"}</option>)}</select></label>
              </div>

              <div className="bookingStep tableStep"><span>2</span><div><h3>Choose Your Table</h3><small>Select a table that suits your group size</small></div><div className="mapLegend inlineLegend"><span><i className="dot available"/>Available</span><span><i className="dot selected"/>Selected</span><span><i className="dot booked"/>Booked</span></div></div>
              <div className="restaurantMap compactMap"><div className="mapHeader">KITCHEN / SERVICE</div><div className="mapTables">{tables.map((table) => { const isBooked = booked.includes(table.number); const eligible = eligibleTables.some((t) => t.number === table.number); const disabled = isBooked || !eligible; return <button key={table.number} disabled={disabled} className={`mapTable ${isBooked ? "booked" : ""} ${!eligible && !isBooked ? "smallOnly" : ""} ${selectedTable === table.number ? "chosen" : ""}`} onClick={() => setSelectedTable(table.number)}><strong>{table.number}</strong><small>{table.capacity === 2 ? "2 seats" : "4–5 seats"}</small>{isBooked && <Check size={14}/>}</button>; })}</div></div>

              <div className="bookingStep foodStep"><span>3</span><div><h3>Pre-order Your Food <em>(Optional)</em></h3><small>Select dishes in advance and we'll have them ready for you.</small></div><div className="saveBadge">🍴 Save time · No waiting · Freshly prepared</div></div>
              <div className="foodCategories">{menuCategories.map((category) => <button key={category} className={menuCategory === category ? "active" : ""} onClick={() => setMenuCategory(category)}>{category}</button>)}</div>
              <div className="combinedFoodGrid">{food.filter((item) => menuCategory === "Popular Dishes" || item.menuCategory === menuCategory).map((item) => <article className="combinedDishCard" key={item.id}><div className="combinedDishImage"><img src={item.image} alt={item.name}/><span>{item.tag}</span></div><div><h4>{item.name}</h4><b>₹{item.price}</b><button onClick={() => setQty(item.id, 1)} aria-label={`Add ${item.name}`}>{cart[item.id] ? <><Plus size={14}/> {cart[item.id]}</> : <Plus size={16}/>}</button></div></article>)}</div>
              <div className="selectionBar combinedSelection"><span><ShoppingCart size={15}/> {cartCount} food item{cartCount === 1 ? "" : "s"} selected • ₹{total}</span><button type="button" onClick={() => setCart({})}>Clear food</button></div>
              <button className="orangeButton continue combinedContinue" disabled={!selectedTable} onClick={() => setShowBooking(true)}>Continue to Guest Details <ChevronRight size={17}/></button>
            </div>

            <aside className="bookingSummaryCard">
              <div className="summaryImage"><img src="/restaurant-hero.png" alt="Narula's dining room"/><div>“Good food brings people together.”<small>— Narula's Restaurant</small></div></div>
              <div className="summaryBody"><div className="summaryTitle"><h2>Your Booking</h2><button onClick={() => { setSelectedTable(null); setCart({}); }}><X size={14}/> Clear All</button></div>
                <div className="summaryRows"><p><CalendarDays size={16}/><span>Date</span><b>{formatDate(date)}</b></p><p><Clock3 size={16}/><span>Time</span><b>{formatTime(time)}</b></p><p><Users size={16}/><span>Guests</span><b>{guests} {guests === 1 ? "Person" : "People"}</b></p><p><CalendarDays size={16}/><span>Table</span><b>{selectedTable ? `Table ${selectedTable} (${tables.find(t => t.number === selectedTable)?.capacity} seats)` : "Not selected"}</b></p></div>
                <div className="summaryFood"><div><UtensilsCrossed size={16}/><b>Pre-ordered Food</b><small>{cartItems.length ? `${cartCount} item${cartCount === 1 ? "" : "s"}` : "No items selected"}</small><button onClick={() => document.querySelector('.foodStep')?.scrollIntoView({ behavior: 'smooth' })}>Edit</button></div>{cartItems.map(item => <p key={item.id}><span>{item.name} × {item.qty}</span><b>₹{item.price * item.qty}</b></p>)}{cartItems.length > 0 && <strong className="foodTotal">Total Food <b>₹{total}</b></strong>}</div>
                <div className="specialRequest"><Sparkles size={17}/><div><b>Special Request <small>(Optional)</small></b><span>Add seating preference, dietary requirements, occasion, etc. in the next step.</span></div><ChevronRight size={17}/></div>
                <button className="orangeButton full summaryConfirm" disabled={!selectedTable} onClick={() => setShowBooking(true)}>Confirm Booking <ChevronRight size={17}/></button>
                <p className="summaryNote">You can review your details before the reservation is confirmed.</p>
              </div>
            </aside>
          </div>
        </section>}


        {(view === "experience") && <section className="experience" id="experience"><div><span>THE NARULA'S EXPERIENCE</span><h2>Food tastes better<br/><i>when shared.</i></h2><p>From casual lunches to family celebrations, every reservation is designed around good food, comfortable tables and a little more time together.</p><button className="lightButton dark" onClick={() => { window.location.href = "/table-booking"; }}>Reserve your table <ChevronRight size={16}/></button></div><img src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85" alt="Restaurant dining experience"/></section>}

        {(view === "about") && <section className="aboutSection" id="about"><div><span>ABOUT NARULA'S</span><h2>A neighbourhood table with a little something <i>extra.</i></h2></div><p>Freshly prepared food, warm service and a simple promise: make every visit worth remembering. Located in Ashok Nagar, Bhubaneswar, Narula's welcomes families, friends and celebrations every day from 11 AM to 11 PM.</p></section>}

        {(view === "contact") && <footer id="contact"><div className="footerBrand"><div className="sideBrand"><span className="brandMark">N</span><div><strong>Narula's</strong><small>RESTAURANT</small></div></div><p>Good food. Better moments.</p></div><div><b>Visit</b><p>Ashok Nagar, Bhubaneswar</p><p>Open daily • 11 AM – 11 PM</p></div><div><b>Contact</b><p><Phone size={14}/> +91 00000 00000</p><p>ascreater401@gmail.com</p></div><div><b>Explore</b><p><a href="/menu">Menu</a> · <a href="/table-booking">Reservations</a></p><p><a href="/about">About</a> · <a href="/experience">Experience</a></p></div></footer>}
      </div>

      {showBooking && <div className="modalBack" onClick={() => setShowBooking(false)}><div className="modal" onClick={(e) => e.stopPropagation()}><button className="close" onClick={() => setShowBooking(false)}><X size={20}/></button>{bookingCode ? <div className="success"><div className="successIcon"><Check/></div><span>RESERVATION CONFIRMED</span><h2>See you at<br/><i>Narula's.</i></h2><p>Your booking code is <b>{bookingCode}</b>.</p><p className="muted">{status}</p><button className="orangeButton full" onClick={() => { setShowBooking(false); setBookingCode(""); setStatus(""); }}>Done</button></div> : <form onSubmit={submitBooking}><span>FINAL STEP</span><h2>Your details</h2><p className="muted">Table {selectedTable} • {date} • {formatTime(time)} • {guests} guest{guests > 1 ? "s" : ""}</p><div className="formGrid"><input required placeholder="Full name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })}/><input required type="email" placeholder="Email address" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })}/><input required placeholder="Phone number" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}/><textarea placeholder="Special request (optional)" value={customer.request} onChange={(e) => setCustomer({ ...customer, request: e.target.value })}/></div><div className="orderSummary"><b>Pre-order for this table</b>{cartItems.length ? cartItems.map((item) => <span key={item.id}>{item.name} × {item.qty} · ₹{item.price * item.qty}</span>) : <span>No food pre-ordered — you can still book the table.</span>}<strong>Total food: ₹{total}</strong></div>{status && <p className="error">{status}</p>}<button className="orangeButton full" disabled={loading}>{loading ? "Confirming reservation…" : "Confirm reservation"}</button></form>}</div></div>}
    </main>
  );
}
