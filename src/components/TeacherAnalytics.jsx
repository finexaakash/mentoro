import { useState } from "react";

const RESOURCE_TYPES = ["notes", "books", "videos", "links"];

const dayKey = (date) => date.toLocaleDateString("en-CA");

const TeacherAnalytics = ({ analytics, events }) => {
  const [hoveredDay, setHoveredDay] = useState(null);
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return date;
  });

  const daily = days.map((date) => {
    const key = dayKey(date);
    const dayEvents = events.filter((event) => dayKey(new Date(event.$createdAt)) === key);
    return {
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
      profileViews: dayEvents.filter((event) => event.eventType === "profile_view").length,
      resourceOpens: dayEvents.filter((event) => event.eventType === "resource_open").length,
    };
  });

  const byType = RESOURCE_TYPES.map((type) => ({
    type,
    value: analytics[type] || 0,
  }));
  const maximumDaily = Math.max(...daily.flatMap((day) => [day.profileViews, day.resourceOpens]), 1);
  const maximumType = Math.max(...byType.map((item) => item.value), 1);
  const width = 620;
  const height = 240;
  const padding = { top: 18, right: 18, bottom: 34, left: 34 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const point = (value, index) => ({
    x: padding.left + (plotWidth / (daily.length - 1)) * index,
    y: padding.top + plotHeight - (value / maximumDaily) * plotHeight,
  });
  const profileLine = daily.map((day, index) => point(day.profileViews, index)).map((item) => `${item.x},${item.y}`).join(" ");
  const resourceLine = daily.map((day, index) => point(day.resourceOpens, index)).map((item) => `${item.x},${item.y}`).join(" ");
  const mostOpened = byType.reduce((top, item) => item.value > top.value ? item : top, byType[0]);
  const activeDay = hoveredDay === null ? null : daily[hoveredDay];
  const activePoint = activeDay ? point(activeDay.profileViews, hoveredDay) : null;
  const tooltipWidth = 158;
  const tooltipHeight = 52;
  const tooltipX = activePoint
    ? Math.min(Math.max(activePoint.x - tooltipWidth / 2, padding.left), width - padding.right - tooltipWidth)
    : 0;
  const tooltipY = activePoint ? Math.max(padding.top, activePoint.y - tooltipHeight - 12) : 0;
  const hoverAreaWidth = plotWidth / (daily.length - 1 || 1);

  return (
    <section className="mt-8 border-t border-white/10 pt-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold">My analytics</h3>
          <p className="mt-1 text-sm text-gray-400">Student activity on your public teacher profile and resources</p>
        </div>
        <p className="text-xs text-gray-500">Last 7 days</p>
      </div>

      <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Profile views", value: analytics.profileViews },
          { label: "Resource opens", value: analytics.totalOpens },
          { label: "Notes opens", value: analytics.notes },
          { label: "Most opened", value: mostOpened.value ? mostOpened.type : "—" },
        ].map((metric) => (
          <div key={metric.label} className="rounded-xl border border-white/10 bg-slate-950/30 p-4">
            <p className="text-2xl font-bold text-indigo-300 capitalize">{metric.value}</p>
            <p className="mt-1 text-xs text-gray-400">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-medium">Student activity</h4>
            <div className="flex gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-indigo-400" /> Profile views</span>
              <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-purple-400" /> Resource opens</span>
            </div>
          </div>
          <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="Seven-day line graph of profile views and resource opens. Hover a day to see exact values." onMouseLeave={() => setHoveredDay(null)}>
            {[0, 0.5, 1].map((ratio) => {
              const y = padding.top + plotHeight - ratio * plotHeight;
              return <g key={ratio}><line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="rgba(255,255,255,0.14)" strokeWidth="1" /><text x="4" y={y + 4} fill="rgba(255,255,255,0.5)" fontSize="10">{Math.round(maximumDaily * ratio)}</text></g>;
            })}
            {daily.map((day, index) => <text key={day.label} x={point(0, index).x} y={height - 10} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="10">{day.label}</text>)}
            <polyline fill="none" stroke="#818cf8" strokeWidth="3" points={profileLine} />
            <polyline fill="none" stroke="#c084fc" strokeWidth="3" points={resourceLine} />
            {daily.map((day, index) => <g key={`${day.label}-points`}><circle cx={point(day.profileViews, index).x} cy={point(day.profileViews, index).y} r={hoveredDay === index ? "5" : "3"} fill="#818cf8" /><circle cx={point(day.resourceOpens, index).x} cy={point(day.resourceOpens, index).y} r={hoveredDay === index ? "5" : "3"} fill="#c084fc" /></g>)}
            {daily.map((day, index) => {
              const dayPoint = point(0, index);
              const areaStart = Math.max(padding.left, dayPoint.x - hoverAreaWidth / 2);
              const areaEnd = Math.min(width - padding.right, dayPoint.x + hoverAreaWidth / 2);
              return <rect key={`${day.label}-hover`} x={areaStart} y={padding.top} width={areaEnd - areaStart} height={plotHeight} fill="transparent" onMouseEnter={() => setHoveredDay(index)} />;
            })}
            {activeDay && activePoint && <g pointerEvents="none">
              <line x1={activePoint.x} x2={activePoint.x} y1={padding.top} y2={padding.top + plotHeight} stroke="rgba(255,255,255,0.38)" strokeDasharray="4 4" />
              <rect x={tooltipX} y={tooltipY} width={tooltipWidth} height={tooltipHeight} rx="8" fill="#020617" stroke="rgba(255,255,255,0.28)" />
              <text x={tooltipX + 10} y={tooltipY + 18} fill="#e2e8f0" fontSize="11" fontWeight="600">{activeDay.label}</text>
              <text x={tooltipX + 10} y={tooltipY + 34} fill="#a5b4fc" fontSize="10">Profile views: {activeDay.profileViews}</text>
              <text x={tooltipX + 10} y={tooltipY + 47} fill="#d8b4fe" fontSize="10">Resource opens: {activeDay.resourceOpens}</text>
            </g>}
          </svg>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <h4 className="mb-5 font-medium">Resource opens by type</h4>
          <div className="space-y-5" role="img" aria-label="Bar graph of resource opens by type">
            {byType.map((item) => (
              <div key={item.type} className="grid grid-cols-[4rem_1fr_2rem] items-center gap-3 text-sm">
                <span className="capitalize text-gray-300">{item.type}</span>
                <div className="h-4 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${(item.value / maximumType) * 100}%` }} />
                </div>
                <span className="text-right font-medium text-indigo-200">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeacherAnalytics;
