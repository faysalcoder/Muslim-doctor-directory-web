import React, { useState } from "react";
import AddDoctorModal from "./AddDoctorModal";

const STORAGE_KEY = "nmp_welcome_popup_dismissed";

/**
 * WelcomePopup — shown on the HomePage when the user first lands.
 * After closing it is never shown again (localStorage flag).
 *
 * Usage:
 *   const [show, setShow] = useState(
 *     () => !localStorage.getItem("nmp_welcome_popup_dismissed")
 *   );
 *   {show && <ComingSoonModal onClose={() => setShow(false)} />}
 */
export default function ComingSoonModal({ onClose }) {
  const [showApply, setShowApply] = useState(false);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    if (onClose) onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={handleClose}
      >
        {/* Card — stop click bubbling so clicking inside doesn't close */}
        <div
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ✕ Close button */}
          <button
            onClick={handleClose}
            aria-label="Close popup"
            className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 active:scale-95 transition-all text-white shadow"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Banner image */}
          <div
            className="relative w-full bg-[#00342b]"
            style={{ height: "525px" }}
          >
            <img
              src={`${process.env.PUBLIC_URL}/assets/doctor-banner-1.jpg`}
              alt="Network of Muslim Physicians"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Bottom section */}
          <div className="px-8 py-7 flex flex-col items-center text-center gap-4 bg-white">
            {/* CTA Button */}
            <button
              onClick={() => setShowApply(true)}
              className="w-full bg-[#00342b] hover:bg-[#00493c] active:scale-95 transition-all text-white font-bold py-4 px-6 rounded-2xl text-base shadow-lg flex items-center justify-center gap-3"
            >
              <svg
                className="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Click here to join
            </button>

            {/* Footer note */}
            <p className="text-xs text-gray-400">
              Your join request will be reviewed.
            </p>
          </div>
        </div>
      </div>

      {/* Add Doctor Modal */}
      <AddDoctorModal open={showApply} onClose={() => setShowApply(false)} />
    </>
  );
}
