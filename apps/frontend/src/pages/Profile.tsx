import { useStore } from "../store/useStore";
import { UserCircleIcon, CalendarDaysIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";

export function Profile() {
const events = useStore((s) => s.events);
const user = useStore((s) => s.user);

const organizedCount = events.filter(e => e.organizerId === user?.id).length;
const joinedCount = events.filter(e => e.organizerId !== user?.id).length;

  // Статистика (поки що захардкоджено, потім підтягнемо з бекенду)
  const stats = [
    { label: 'Events Organized', value: organizedCount, icon: RocketLaunchIcon, color: 'text-violet-600', bg: 'bg-violet-100' },
    { label: 'Events Joined', value: joinedCount, icon: CalendarDaysIcon, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 mb-8 flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-lg">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 border-4 border-white w-8 h-8 rounded-full shadow-sm" title="Online status"></div>
        </div>
        
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-black text-slate-900">{user?.name || 'User Name'}</h1>
          <p className="text-slate-500 font-medium">{user?.email || 'user@example.com'}</p>
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
            <span className="px-4 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">
              Community Member
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/40 flex items-center gap-6">
            <div className={`p-4 ${stat.bg} rounded-2xl`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-tight">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}