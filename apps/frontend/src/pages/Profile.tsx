import { useStore } from "../store/useStore";
import {
  CalendarDaysIcon,
  RocketLaunchIcon,
  CircleStackIcon,
  GiftIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../api/api";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" as const } 
  }
};

export function Profile() {
  // 2. Get events and user from the store (we will use events to calculate statistics)
  const events = useStore((s) => s.events);
  const user = useStore((s) => s.user);
  const fetchEvents = useStore((s) => s.fetchEvents);
  const setUser = useStore((s) => s.setUser);
  const [couponCode, setCouponCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  
  useEffect(() => {
    fetchEvents();
  }, []);

  // 3. Calculate statistics
  const organizedCount = events.filter(e => e.organizerId === user?.id).length;
  const joinedCount = events.filter(e => {
      if (e.joined !== undefined) return e.joined;
      return e.participants?.some((p: any) => p.userId === user?.id);
    }).length;

  const stats = [
    {
      label: "Vibecoins",
      value: user?.vibecoins ?? 0,
      icon: CircleStackIcon,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    { 
      label: 'Events Organized', 
      value: organizedCount, 
      icon: RocketLaunchIcon, 
      color: 'text-violet-600', 
      bg: 'bg-violet-100' 
    },
    { 
      label: 'Events Joined', 
      value: joinedCount, 
      icon: CalendarDaysIcon, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-100' 
    },
  ];

  const redeemCoupon = async () => {
    const code = couponCode.trim();
    if (!code) {
      toast.error("Введи код сертифікату або купона");
      return;
    }

    try {
      setIsRedeeming(true);
      const res = await api.post("/users/me/redeem-code", { code });
      setUser(res.data.user);
      setCouponCode("");
      toast.success(`Успіх: +${res.data.added} vibecoins`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Не вдалося застосувати код");
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    // Main container with fade-in effect
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="py-6 md:p-10 max-w-5xl mx-auto"
    >
      
      {/* Profile Header */}
      <motion.div 
        variants={item}
        className="bg-white rounded-[2.5rem] p-5 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 mb-8 flex flex-col md:flex-row items-center gap-5 md:gap-8"
      >
        <div className="relative">
          {/* Avatar with gradient */}
          <div className="w-32 h-32 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-lg">
            {user?.name?.charAt(0) || 'U'}
          </div>
          {/* Green dot "Online" */}
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 border-4 border-white w-8 h-8 rounded-full shadow-sm"></div>
        </div>
        
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-black text-slate-900">{user?.name || 'User Name'}</h1>
          <p className="text-slate-500 font-medium">{user?.email || 'user@example.com'}</p>
          <div className="mt-4">
            <span className="px-4 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-full">
              Community Member
            </span>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <motion.div 
            key={stat.label} 
            variants={item}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white p-4 md:p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/40 flex items-center gap-4 md:gap-6"
          >
            <div className={`p-4 ${stat.bg} rounded-2xl`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                {stat.label}
              </p>
              <p className="text-3xl md:text-4xl font-black text-slate-900 leading-none mt-1">
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={item}
        className="bg-white rounded-[2.5rem] p-5 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Vibecoins Wallet</h2>
            <p className="text-slate-500">Поповнення через оплату ще в розробці, але купон уже працює.</p>
          </div>

          <button
            type="button"
            disabled
            className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black uppercase tracking-wider text-slate-400 cursor-not-allowed"
          >
            Поповнити (скоро)
          </button>
        </div>

        <div className="rounded-3xl border border-amber-100 bg-amber-50/50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <GiftIcon className="h-5 w-5 text-amber-600" />
            <p className="text-sm font-black uppercase tracking-widest text-amber-700">Сертифікат / Купон</p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Введи код (наприклад, VIBE10)"
              className="w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-amber-400"
            />
            <button
              type="button"
              onClick={redeemCoupon}
              disabled={isRedeeming}
              className="rounded-2xl bg-amber-500 px-5 py-3 text-sm font-black uppercase tracking-wider text-white hover:bg-amber-600 disabled:opacity-50"
            >
              {isRedeeming ? "Застосування..." : "Застосувати код"}
            </button>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}