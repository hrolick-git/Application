import React, { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../api/api";
import { useStore } from "../store/useStore";
import { getEventTheme, type EventThemeId } from "../constants/eventThemes";

interface JoinButtonProps {
  event: any;
  onRefresh: () => void;
  className?: string; // for additional styling if needed
  shareToken?: string;
}

export function JoinButton({
  event,
  onRefresh,
  className = "",
  shareToken,
}: JoinButtonProps) {
  const user = useStore((s) => s.user);
  const [isLoading, setIsLoading] = useState(false);
  const theme = getEventTheme(event.colorTheme);

  const themeJoinClasses: Record<EventThemeId, string> = {
    violet:
      "bg-purple-700 text-white hover:bg-purple-800 shadow-purple-200 hover:-translate-y-1 shadow-xl",
    mint:
      "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200 hover:-translate-y-1 shadow-xl",
    sky:
      "bg-sky-600 text-white hover:bg-sky-700 shadow-sky-200 hover:-translate-y-1 shadow-xl",
    sunset:
      "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-200 hover:-translate-y-1 shadow-xl",
    blossom:
      "bg-pink-500 text-white hover:bg-pink-600 shadow-pink-200 hover:-translate-y-1 shadow-xl",
  };

  const isPrivate = event.visibility === "PRIVATE";
  const isJoined =
    !!user &&
    (event.joined ||
      event.participants?.some((p: any) =>
        typeof p === "string" ? p === user?.id : p.user?.email === user?.email,
      ));
  const isFull = event.capacity
    ? event.participants?.length >= event.capacity
    : false;
  const isArchived =
    !!event.isArchived ||
    (event.endsAt
      ? new Date(event.endsAt) < new Date()
      : new Date(event.startsAt) < new Date());

  const isDisabled = isArchived || (isFull && !isJoined) || isLoading;

  const baseClasses =
    "w-full py-4 rounded-[1.25rem] font-black text-sm transition-all duration-300 transform active:scale-95";

  const stateClasses = isArchived
    ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none" // Archived is always gray
    : isJoined
      ? "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 shadow-none"
      : isFull
        ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
        : theme
          ? themeJoinClasses[theme]
          : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 hover:-translate-y-1 shadow-xl";

  const label = isLoading
    ? "Processing..."
    : isArchived
      ? "Archived"
      : isJoined
        ? "Leave Event"
        : isFull
          ? "Event Full"
          : isPrivate
            ? "Private Join"
            : "Join Event";

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // if this button is inside a Link, prevent navigation

    const token = localStorage.getItem("token");
    if (!token) return toast.error("You must be logged in to join an event");

    try {
      setIsLoading(true);
      if (isJoined) {
        await api.post(`/events/${event.id}/leave`);
      } else if (isPrivate && shareToken) {
        await api.post(`/events/shared/${shareToken}/join`);
      } else {
        await api.post(`/events/${event.id}/join`);
      }
      onRefresh(); // call to refresh data in the parent component
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      disabled={isDisabled}
      onClick={handleToggle}
      className={`${baseClasses} ${stateClasses} ${className}`}
    >
      {label}
    </button>
  );
}
