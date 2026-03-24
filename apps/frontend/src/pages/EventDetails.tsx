import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useStore } from "../store/useStore";
import { Loader } from "../components/Loader";
import { JoinButton } from "../components/JoinButton";
import {
  MapPinIcon,
  CalendarDaysIcon,
  UsersIcon,
  ArrowLeftIcon,
  TrashIcon,
  PencilSquareIcon,
  LockClosedIcon,
  LinkIcon,
  CpuChipIcon,
  PaintBrushIcon,
  BriefcaseIcon,
  MusicalNoteIcon,
  TrophyIcon,
  CakeIcon,
  PuzzlePieceIcon,
  SparklesIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import {
  EVENT_THEME_IDS,
  EVENT_THEME_META,
  getEventTheme,
  type EventThemeId,
} from "../constants/eventThemes";
import {
  ICON_PATTERN_IDS,
  ICON_PATTERN_META,
  getIconPattern,
  type IconPatternId,
} from "../constants/iconPatterns";

type ThemeSelection = EventThemeId | "default";

interface Tag {
  id: string;
  name: string;
}

interface Event {
  id: string;
  title: string;
  description?: string;
  startsAt: string;
  endsAt?: string;
  location: string;
  capacity?: number;
  visibility: "PUBLIC" | "PRIVATE";
  shareToken?: string;
  colorTheme?: string;
  participants: { user: { email: string } }[] | undefined;
  organizerId: string;
  joined?: boolean;
  full?: boolean;
  tags?: Tag[];
  iconPattern?: string;
}

const TAG_COLORS: Record<string, string> = {
  Tech: "bg-blue-100 text-blue-700",
  Art: "bg-pink-100 text-pink-700",
  Business: "bg-amber-100 text-amber-700",
  Music: "bg-purple-100 text-purple-700",
  Sport: "bg-green-100 text-green-700",
  Food: "bg-orange-100 text-orange-700",
  Game: "bg-red-100 text-red-700",
  Other: "bg-slate-100 text-slate-600",
};

const PATTERN_ICON_MAP = {
  tech: CpuChipIcon,
  art: PaintBrushIcon,
  business: BriefcaseIcon,
  music: MusicalNoteIcon,
  sport: TrophyIcon,
  food: CakeIcon,
  game: PuzzlePieceIcon,
  other: SparklesIcon,
} as const;

export function EventDetails() {
  const { id, shareToken } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewTheme, setPreviewTheme] = useState<ThemeSelection | null>(null);
  const [isApplyingTheme, setIsApplyingTheme] = useState(false);
  const [previewPattern, setPreviewPattern] = useState<IconPatternId | "none" | null>(null);
  const [isApplyingPattern, setIsApplyingPattern] = useState(false);
  const [isThemeStudioOpen, setIsThemeStudioOpen] = useState(false);
  const navigate = useNavigate();
  const user = useStore((s) => s.user);

  const fetch = async () => {
    try {
      setLoading(true);
      if (shareToken) {
        const res = await api.get(`/events/shared/${shareToken}`);
        setEvent(res.data);
        return;
      }

      const token = localStorage.getItem("token");
      const res = await api.get(
        token ? `/events/${id}` : `/events/public/${id}`,
      );
      setEvent(res.data);
    } catch (err: any) {
      console.error("Fetch error:", err);
      if (!shareToken && err.response?.status === 401) {
        const publicRes = await api.get(`/events/public/${id}`);
        setEvent(publicRes.data);
      } else {
        navigate("/events");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [id, shareToken]);

  useEffect(() => {
    setPreviewTheme(null);
    setPreviewPattern(null);
  }, [event?.id, event?.colorTheme, event?.iconPattern]);

  const copyShareLink = async () => {
    if (typeof window === "undefined") return;

    try {
      let token = shareToken || event?.shareToken;
      if (!token && event?.id && event.visibility === "PRIVATE") {
        const res = await api.post(`/events/${event.id}/share-link`);
        token = res.data?.shareToken;
      }
      if (!token) throw new Error("No share token returned");

      await navigator.clipboard.writeText(
        `${window.location.origin}/events/shared/${token}`,
      );
      toast.success("Shared link copied");
    } catch {
      toast.error("Failed to copy shared link");
    }
  };

  const del = async () => {
    if (!event) return;
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/events/${id}`);
        navigate("/events");
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Error deleting event");
      }
    }
  };

  if (loading) return <Loader />;
  if (!event) return null;

  const isOrganizer = event.organizerId === user?.id;
  const isPrivate = event.visibility === "PRIVATE";
  const savedTheme = getEventTheme(event.colorTheme);
  const savedSelection: ThemeSelection = savedTheme ?? "default";
  const savedPattern = getIconPattern(event.iconPattern);
  const savedPatternSelection: IconPatternId | "none" = savedPattern ?? "none";
  const activePatternSelection: IconPatternId | "none" = previewPattern ?? savedPatternSelection;
  const activeIconPattern: IconPatternId | null = activePatternSelection === "none" ? null : activePatternSelection;
  const hasUnsavedPatternPreview = isOrganizer && previewPattern !== null && previewPattern !== savedPatternSelection;
  const activeSelection: ThemeSelection = previewTheme ?? savedSelection;
  const activeTheme = activeSelection === "default" ? null : activeSelection;
  const hasActiveTheme = !!activeTheme;
  const themeMeta = activeTheme ? EVENT_THEME_META[activeTheme] : null;
  const patternIconTone = themeMeta ? themeMeta.infoIcon : "text-slate-400";
  const participantsList = event.participants || [];
  const tags = event.tags || [];
  const hasUnsavedPreview =
    isOrganizer && previewTheme !== null && previewTheme !== savedSelection;

  const applyIconPattern = async () => {
    if (!event || !isOrganizer) return;
    if (previewPattern === null || previewPattern === savedPatternSelection) return;

    const nextPattern = previewPattern === "none" ? null : previewPattern;

    try {
      setIsApplyingPattern(true);
      const res = await api.post(`/events/${event.id}/icon-pattern`, { pattern: nextPattern });
      setEvent(res.data.event);

      if (user) {
        useStore.getState().setUser({ ...user, vibecoins: res.data.vibecoins });
      }

      if (res.data.spent === 1) {
        toast.success("Icon pattern set: -1 vibecoin");
      } else if (nextPattern === null) {
        toast.success("Icon pattern removed");
      } else {
        toast.success("Icon pattern already set");
      }
      setPreviewPattern(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update icon pattern");
    } finally {
      setIsApplyingPattern(false);
    }
  };

  const applyTheme = async () => {
    if (!event || !isOrganizer) return;
    if (previewTheme === null || previewTheme === savedSelection) return;

    const nextTheme = previewTheme === "default" ? null : previewTheme;

    try {
      setIsApplyingTheme(true);
      const res = await api.post(`/events/${event.id}/theme`, { theme: nextTheme });
      setEvent(res.data.event);

      if (user) {
        useStore.getState().setUser({
          ...user,
          vibecoins: res.data.vibecoins,
        });
      }

      if (res.data.spent === 1) {
        toast.success("Theme updated: -1 vibecoin");
      } else if (nextTheme === null) {
        toast.success("Default free theme applied");
      } else {
        toast.success("Theme already selected");
      }
      setPreviewTheme(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update theme");
    } finally {
      setIsApplyingTheme(false);
    }
  };

  return (
    <div className="bg-slate-50/30 py-4 md:p-10">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-medium text-sm group"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to events
        </button>

        <div
          className={`rounded-[2.5rem] shadow-xl overflow-hidden border ${
            hasActiveTheme && themeMeta
              ? themeMeta.detailsSurface
              : "bg-white border-slate-100"
          }`}
        >
          {/* Header Section */}
          <div className="relative p-6 md:p-12 border-b border-slate-50 overflow-hidden">
            {/* Icon pattern overlay */}
            {activeIconPattern && ICON_PATTERN_META[activeIconPattern] && (
              <div
                className="absolute inset-0 pointer-events-none select-none overflow-hidden"
                style={{
                  maskImage: "linear-gradient(to right, transparent 18%, rgba(0,0,0,0.12) 64%, rgba(0,0,0,0.2) 100%)",
                  WebkitMaskImage: "linear-gradient(to right, transparent 18%, rgba(0,0,0,0.12) 64%, rgba(0,0,0,0.2) 100%)",
                }}
              >
                <div className="absolute right-0 -top-2 -bottom-8 w-[58%] grid grid-cols-9 gap-x-3 p-3">
                  {Array.from({ length: 9 }).map((_, colIdx) => {
                    const PatternIcon = PATTERN_ICON_MAP[activeIconPattern];
                    const isShiftedColumn = colIdx % 2 === 1;
                    const rightColNumber = 9 - colIdx;
                    return (
                      <div
                        key={colIdx}
                        className={`flex flex-col gap-y-3 ${isShiftedColumn ? "translate-y-2" : ""}`}
                      >
                        {Array.from({ length: 16 }).map((__, rowIdx) => {
                          const rowNumber = rowIdx + 1;
                          const isPriorityIcon =
                            (rightColNumber === 1 && [2, 4, 6].includes(rowNumber)) ||
                            (rightColNumber === 2 && [1, 3, 5].includes(rowNumber)) ||
                            (rightColNumber === 3 && [2, 4].includes(rowNumber));
                          const isBigSpecialIcon = rightColNumber === 2 && rowNumber === 3;
                          const isFirstColumnSecondIcon = rightColNumber === 1 && rowNumber === 2;
                          const isThirdColumnFourthIcon = rightColNumber === 3 && rowNumber === 4;
                          const iconSize = isBigSpecialIcon
                            ? "1.65rem"
                            : isFirstColumnSecondIcon
                              ? "1.1rem"
                              : isThirdColumnFourthIcon
                                ? "1rem"
                                : "1.25rem";

                          return (
                            <PatternIcon
                              key={`${colIdx}-${rowIdx}`}
                              className={`${patternIconTone}`}
                              style={{
                                opacity: isPriorityIcon ? 1 : 0.35,
                                width: iconSize,
                                height: iconSize,
                              }}
                            />
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1">
                {isPrivate && (
                  <div className={`inline-flex items-center mb-4 px-3 py-1 rounded-full text-white shadow-lg ${themeMeta ? themeMeta.badge : "bg-slate-700"}`}>
                    <LockClosedIcon className="w-3 h-3 mr-1.5" />
                    <span className="text-[10px] uppercase tracking-widest font-black">
                      Private Event
                    </span>
                  </div>
                )}
                <h1
                  className={`text-3xl md:text-5xl font-black leading-tight mb-3 ${
                    hasActiveTheme && themeMeta ? themeMeta.title : "text-slate-900"
                  }`}
                >
                  {event.title}
                </h1>

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag) => (
                      <span
                        key={tag.id}
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${TAG_COLORS[tag.name] || TAG_COLORS["Other"]}`}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-lg text-slate-500 leading-relaxed italic">
                  "{event.description || "No description provided."}"
                </p>
              </div>

              {/* Organizer Actions */}
              {isOrganizer && (
                <div className="flex gap-2 shrink-0">
                  {isPrivate && (
                    <button
                      type="button"
                      onClick={copyShareLink}
                      className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-colors"
                      title="Copy shared link"
                    >
                      <LinkIcon className="w-6 h-6" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => navigate(`/events/${id}/edit`)}
                    className="p-3 bg-amber-50 text-amber-600 rounded-2xl hover:bg-amber-100 transition-colors"
                    title="Edit"
                  >
                    <PencilSquareIcon className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={del}
                    className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-colors"
                    title="Delete"
                  >
                    <TrashIcon className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-4 md:p-12 grid md:grid-cols-2 gap-4 md:gap-10">
            <div className="space-y-3 md:space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
                Event Info
              </h3>

              <div className="space-y-2 md:space-y-4">
                <div className="flex items-center p-3 md:p-4 bg-slate-50 rounded-2xl md:rounded-[1.5rem] border border-slate-100">
                  <div
                    className={`p-2 md:p-3 rounded-xl mr-3 ${hasActiveTheme && themeMeta ? themeMeta.icon : "bg-indigo-100 text-indigo-600"}`}
                  >
                    <CalendarDaysIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">
                      Date & Time
                    </p>
                    <p className="font-bold text-slate-700">
                      {new Date(event.startsAt).toLocaleString("en-US", {
                        dateStyle: "long",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 md:p-4 bg-slate-50 rounded-2xl md:rounded-[1.5rem] border border-slate-100">
                  <div className="p-2 md:p-3 rounded-xl mr-3 bg-rose-100 text-rose-600">
                    <MapPinIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">
                      Location
                    </p>
                    <p className="font-bold text-slate-700">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 md:p-4 bg-slate-50 rounded-2xl md:rounded-[1.5rem] border border-slate-100">
                  <div className="p-2 md:p-3 rounded-xl mr-3 bg-emerald-100 text-emerald-600">
                    <UsersIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">
                      Capacity
                    </p>
                    <p className="font-bold text-slate-700">
                      {participantsList.length} / {event.capacity ?? "∞"}{" "}
                      participants
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Participants List */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">
                Who's Coming
              </h3>

              <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100">
                {participantsList.length > 0 ? (
                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {participantsList.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {p.user.email[0].toUpperCase()}
                        </div>
                        <span className="text-sm text-slate-600 truncate font-medium">
                          {p.user.email}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">
                    No participants yet. Be the first!
                  </p>
                )}
              </div>

              <div className="mt-4 md:mt-8">
                {hasUnsavedPreview && (
                  <div className="mb-2 inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-indigo-700">
                    Preview
                  </div>
                )}
                <JoinButton
                  event={{ ...event, colorTheme: activeTheme ?? undefined }}
                  onRefresh={fetch}
                  shareToken={shareToken}
                  className="py-5 text-lg"
                />
              </div>
            </div>
          </div>

          {isOrganizer && (
            <div className="border-t border-slate-50 p-4 md:p-12">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-black uppercase tracking-widest text-slate-500">
                    Theme Studio
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsThemeStudioOpen((prev) => !prev)}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-600 hover:bg-slate-50"
                  >
                    {isThemeStudioOpen ? "Hide" : "Show"}
                    {isThemeStudioOpen ? (
                      <ChevronUpIcon className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDownIcon className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-sm font-bold text-slate-700">
                  Balance: {(user?.vibecoins ?? 0)} vibecoins
                </p>
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isThemeStudioOpen ? "mt-4 max-h-[1600px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-slate-100 bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                      Color Theme Shop
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">1 coin each</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewTheme("default")}
                      className={`rounded-2xl border p-2 transition-all ${
                        activeSelection === "default"
                          ? "border-indigo-500 ring-2 ring-indigo-100 bg-indigo-50/40"
                          : "border-slate-200 hover:border-indigo-300"
                      }`}
                    >
                      <div className="h-7 rounded-xl border border-dashed border-slate-300 bg-slate-100" />
                      <p className="mt-2 text-[11px] font-semibold text-slate-700 leading-tight">Default</p>
                      <p className="text-[10px] text-slate-400">
                        {savedSelection === "default" ? "Current" : "Free"}
                      </p>
                    </button>

                    {EVENT_THEME_IDS.map((id) => {
                      const meta = EVENT_THEME_META[id];
                      const selected = activeSelection === id;
                      const saved = savedTheme === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setPreviewTheme(id)}
                          className={`rounded-2xl border p-2 transition-all ${
                            selected
                              ? "border-indigo-500 ring-2 ring-indigo-100 bg-indigo-50/40"
                              : "border-slate-200 hover:border-indigo-300"
                          }`}
                        >
                          <div className={`h-7 rounded-xl bg-gradient-to-r ${meta.preview}`} />
                          <p className="mt-2 text-[11px] font-semibold text-slate-700 leading-tight">{meta.label}</p>
                          <p className="text-[10px] text-slate-400">{saved ? "Current" : "1 coin"}</p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    {hasUnsavedPreview && (
                      <>
                        <button
                          type="button"
                          onClick={applyTheme}
                          disabled={
                            isApplyingTheme ||
                            (previewTheme !== "default" && (user?.vibecoins ?? 0) < 1)
                          }
                          className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50"
                        >
                          {isApplyingTheme
                            ? "Applying..."
                            : previewTheme === "default"
                              ? "Apply for free"
                              : "Apply for 1 vibecoin"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewTheme(null)}
                          disabled={isApplyingTheme}
                          className="rounded-xl border border-indigo-100 bg-indigo-50/40 px-3 py-2 text-xs font-bold uppercase tracking-wider text-indigo-700 hover:bg-indigo-50"
                        >
                          Cancel Preview
                        </button>
                      </>
                    )}

                    {!hasUnsavedPreview && (
                      <p className="text-xs text-slate-500">
                        Pick a theme to preview. Coins are charged only when you apply.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-slate-100 bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                      Icon Pattern
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">1 coin each</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewPattern("none")}
                      className={`rounded-2xl border p-2 transition-all ${
                        activePatternSelection === "none"
                          ? "border-indigo-500 ring-2 ring-indigo-100 bg-indigo-50/40"
                          : "border-slate-200 hover:border-indigo-300"
                      }`}
                    >
                      <div className="h-7 rounded-xl border border-dashed border-slate-300 bg-slate-100" />
                      <p className="mt-2 text-[11px] font-semibold text-slate-700 leading-tight">None</p>
                      <p className="text-[10px] text-slate-400">
                        {savedPatternSelection === "none" ? "Current" : "Free"}
                      </p>
                    </button>

                    {ICON_PATTERN_IDS.map((pid) => {
                      const meta = ICON_PATTERN_META[pid];
                      const selected = activePatternSelection === pid;
                      const saved = savedPattern === pid;
                      const PatternIcon = PATTERN_ICON_MAP[pid];
                      return (
                        <button
                          key={pid}
                          type="button"
                          onClick={() => setPreviewPattern(pid)}
                          className={`rounded-2xl border p-2 transition-all ${
                            selected
                              ? "border-indigo-500 ring-2 ring-indigo-100 bg-indigo-50/40"
                              : "border-slate-200 hover:border-indigo-300"
                          }`}
                        >
                          <div
                            className="h-8 rounded-xl bg-slate-50 overflow-hidden relative"
                            style={{
                              maskImage: "linear-gradient(to right, transparent 14%, rgba(0,0,0,0.25) 100%)",
                              WebkitMaskImage: "linear-gradient(to right, transparent 14%, rgba(0,0,0,0.25) 100%)",
                            }}
                          >
                            <span className={`absolute inset-0 grid grid-cols-5 content-start gap-x-2 gap-y-1.5 p-1 ${patternIconTone}`}>
                              {Array.from({ length: 10 }).map((_, i) => (
                                <PatternIcon
                                  key={i}
                                  className={`w-4 h-4 ${i % 2 === 1 ? "translate-y-0.5" : ""} opacity-80`}
                                />
                              ))}
                            </span>
                          </div>
                          <p className="mt-2 text-[11px] font-semibold text-slate-700 leading-tight">{meta.label}</p>
                          <p className="text-[10px] text-slate-400">{saved ? "Current" : "1 coin"}</p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    {hasUnsavedPatternPreview && (
                      <>
                        <button
                          type="button"
                          onClick={applyIconPattern}
                          disabled={
                            isApplyingPattern ||
                            (previewPattern !== "none" && (user?.vibecoins ?? 0) < 1)
                          }
                          className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50"
                        >
                          {isApplyingPattern
                            ? "Applying..."
                            : previewPattern === "none"
                              ? "Remove for free"
                              : "Apply for 1 vibecoin"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewPattern(null)}
                          disabled={isApplyingPattern}
                          className="rounded-xl border border-indigo-100 bg-indigo-50/40 px-3 py-2 text-xs font-bold uppercase tracking-wider text-indigo-700 hover:bg-indigo-50"
                        >
                          Cancel Preview
                        </button>
                      </>
                    )}
                    {!hasUnsavedPatternPreview && (
                      <p className="text-xs text-slate-500">
                        Pick an icon pattern to preview.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
