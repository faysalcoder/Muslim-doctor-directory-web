import React from 'react';

const statusStyles = {
  verified: 'bg-green-100 text-green-700',
  pending:  'bg-amber-100 text-amber-700',
  inactive: 'bg-gray-100 text-gray-500',
};

function EyeIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
    </svg>
  );
}

export default function DoctorTable({ doctors, onView, onEdit, onDelete, onToggleStatus }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e1e3e4] shadow-sm overflow-x-auto">
      <table className="w-full min-w-[1000px] text-left">
        <thead className="bg-[#f3f4f5] text-[#3f4945] text-xs uppercase tracking-wider">
          <tr>
            <th className="px-5 py-4 font-bold">Physician</th>
            <th className="px-4 py-4 font-bold">Specialty</th>
            <th className="px-4 py-4 font-bold">Contact</th>
            <th className="px-4 py-4 font-bold">Location</th>
            <th className="px-4 py-4 font-bold">Status</th>
            <th className="px-4 py-4 font-bold text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e1e3e4]">
          {doctors.map((doctor) => (
            <tr key={doctor.id} className="hover:bg-[#f8f9fa] transition-colors">
              {/* Physician column */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-[#e1e3e4]">
                    {doctor.profile_image || doctor.image ? (
                      <img src={doctor.profile_image || doctor.image} alt={doctor.name}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-[#00342b] text-sm">{doctor.name}</div>
                    <div className="text-xs text-[#707975] font-mono">{doctor.doctor_id || `#${doctor.id}`}</div>
                    {doctor.title && <div className="text-xs text-[#a0aba5] mt-0.5">{doctor.title}</div>}
                    {(doctor.academic_title || doctor.graduation_degree || doctor.degree) && (
                      <div className="text-xs text-[#707975] mt-0.5 line-clamp-2">
                        {[doctor.academic_title, doctor.graduation_degree || doctor.degree]
                          .filter(Boolean)
                          .join(' · ')}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              {/* Specialty */}
              <td className="px-4 py-4">
                <div className="text-sm text-[#3f4945]">{doctor.specialty}</div>
                {doctor.subspecialty && (
                  <div className="text-xs text-[#707975] mt-0.5">{doctor.subspecialty}</div>
                )}
              </td>
              {/* Contact */}
              <td className="px-4 py-4">
                {doctor.email && (
                  <div className="text-xs text-[#3f4945] flex items-center gap-1">
                    <svg className="w-3 h-3 text-[#707975] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                    </svg>
                    <span className="truncate max-w-[140px]">{doctor.email}</span>
                  </div>
                )}
                {doctor.phone && (
                  <div className="text-xs text-[#3f4945] flex items-center gap-1 mt-1">
                    <svg className="w-3 h-3 text-[#707975] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                    </svg>
                    {doctor.phone}
                  </div>
                )}
                {!doctor.email && !doctor.phone && <span className="text-xs text-[#707975]">—</span>}
              </td>
              {/* Location */}
              <td className="px-4 py-4">
                <div className="text-sm text-[#3f4945] max-w-[150px] truncate">{doctor.location || '—'}</div>
                {doctor.practice && (
                  <div className="text-xs text-[#707975] max-w-[150px] truncate mt-0.5">{doctor.practice}</div>
                )}
              </td>
              {/* Status */}
              <td className="px-4 py-4">
                <div className="space-y-1">
                  <button onClick={() => onToggleStatus && onToggleStatus(doctor)}
                    title="Click to toggle status"
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize cursor-pointer hover:opacity-80 transition ${statusStyles[doctor.status] || statusStyles.pending}`}>
                    {doctor.status || 'pending'}
                  </button>
                  {(doctor.accepting_patients === 1 || doctor.accepting_patients === '1' || doctor.acceptingPatients) && (
                    <div className="text-xs text-blue-600 font-medium">✓ Accepting</div>
                  )}
                </div>
              </td>
              {/* Actions */}
              <td className="px-4 py-4">
                <div className="flex items-center justify-center gap-1.5">
                  {/* Eye / View button */}
                  <button
                    onClick={() => onView(doctor)}
                    title="View all doctor info"
                    className="p-2 rounded-lg border border-[#bfc9c4] text-[#3f4945] hover:bg-gray-50 hover:text-[#00342b] transition"
                  >
                    <EyeIcon />
                  </button>
                  <button onClick={() => onEdit(doctor)}
                    className="px-2.5 py-1.5 rounded-lg border border-[#00342b] text-[#00342b] text-xs font-medium hover:bg-emerald-50 transition whitespace-nowrap">
                    Edit
                  </button>
                  <button onClick={() => onDelete(doctor)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#ba1a1a] text-white text-xs font-medium hover:bg-red-700 transition whitespace-nowrap">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {!doctors.length && (
            <tr>
              <td colSpan="6" className="px-5 py-14 text-center text-[#707975]">
                <svg className="w-10 h-10 mx-auto mb-3 text-[#bfc9c4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
                </svg>
                No doctors found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
