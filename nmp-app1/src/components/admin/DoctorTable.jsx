import React from 'react';

export default function DoctorTable({ doctors, onView, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e1e3e4] shadow-sm overflow-x-auto">
      <table className="w-full min-w-[760px] text-left">
        <thead className="bg-[#f3f4f5] text-[#3f4945] text-sm">
          <tr>
            <th className="px-5 py-4 font-bold">Physician</th>
            <th className="px-5 py-4 font-bold">Specialty</th>
            <th className="px-5 py-4 font-bold">Status</th>
            <th className="px-5 py-4 font-bold text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e1e3e4]">
          {doctors.map((doctor) => (
            <tr key={doctor.id} className="hover:bg-[#f8f9fa]">
              <td className="px-5 py-4">
                <div className="font-semibold text-[#00342b]">{doctor.name}</div>
                <div className="text-xs text-[#707975]">{doctor.doctor_id || `ID: ${doctor.id}`}</div>
              </td>
              <td className="px-5 py-4 text-[#3f4945]">{doctor.specialty}</td>
              <td className="px-5 py-4 capitalize text-[#3f4945]">{doctor.status || 'pending'}</td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-center gap-2">
                  <button onClick={() => onView(doctor)} className="px-3 py-2 rounded-xl border border-[#bfc9c4] text-sm">View</button>
                  <button onClick={() => onEdit(doctor)} className="px-3 py-2 rounded-xl border border-[#bfc9c4] text-sm">Edit</button>
                  <button onClick={() => onDelete(doctor)} className="px-3 py-2 rounded-xl bg-[#ba1a1a] text-white text-sm">Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {!doctors.length ? (
            <tr>
              <td colSpan="4" className="px-5 py-10 text-center text-[#707975]">No doctors found.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
