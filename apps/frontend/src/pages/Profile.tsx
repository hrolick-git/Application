import { useStore } from "../store/useStore";
import { CalendarDaysIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

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

  // 3. Calculate statistics
  const organizedCount = events.filter(e => e.organizerId === user?.id).length;
  const joinedCount = events.filter(e => e.organizerId !== user?.id).length;

  const stats = [
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

  return (
    // Main container with fade-in effect
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="p-6 md:p-10 max-w-5xl mx-auto"
    >
      
      {/* Profile Header */}
      <motion.div 
        variants={item}
        className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 mb-8 flex flex-col md:flex-row items-center gap-8"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {stats.map((stat) => (
          <motion.div 
            key={stat.label} 
            variants={item}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/40 flex items-center gap-6"
          >
            <div className={`p-4 ${stat.bg} rounded-2xl`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                {stat.label}
              </p>
              <p className="text-4xl font-black text-slate-900 leading-none mt-1">
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

    </motion.div>
  );
}