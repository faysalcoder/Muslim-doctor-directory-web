import React from 'react';

export default function ConfirmDeleteModal({ open, onClose, onConfirm, title = 'Delete this doctor?' }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-[#00342b]">Confirm delete</h3>
        <p className="text-sm text-[#3f4945] mt-2">{title}</p>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-[#bfc9c4] text-[#3f4945]">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-xl bg-[#ba1a1a] text-white font-semibold">Delete</button>
        </div>
      </div>
    </div>
  );
}
