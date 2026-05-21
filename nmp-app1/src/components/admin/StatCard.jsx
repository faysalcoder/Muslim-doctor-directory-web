import React from 'react';

export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e1e3e4] shadow-sm p-5">
      <p className="text-sm text-[#3f4945]">{title}</p>
      <div className="text-3xl font-extrabold text-[#00342b] mt-2">{value}</div>
      {subtitle ? <p className="text-xs text-[#707975] mt-1">{subtitle}</p> : null}
    </div>
  );
}
