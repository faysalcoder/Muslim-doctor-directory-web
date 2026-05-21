import React, { useState } from "react";
import AddDoctorModal from "./AddDoctorModal";

export default function ComingSoonModal() {
  const [showApply, setShowApply] = useState(false);

  return (
    <>
      {/* Full-screen dark overlay — blocks everything underneath */}
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        {/* Card */}
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Top image */}
          <div
            className="relative w-full bg-[#00342b]"
            style={{ height: "650px" }}
          >
            <img
              src={`${process.env.PUBLIC_URL}/assets/doctor-banner-1.jpg`}
              alt="Network of Muslim Physicians"
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay on image */}
            {/* <div className="absolute inset-0 bg-gradient-to-b from-[#00342b]/40 to-[#00342b]/80" /> */}
          </div>

          {/* Bottom section */}
          <div className="px-8 py-7 flex flex-col items-center text-center gap-4 bg-white">
            {/* Description */}

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
              List Myself as a Doctor
            </button>

            {/* Footer note */}
            <p className="text-xs text-gray-400">
              Your listing will be reviewed .
            </p>
          </div>
        </div>
      </div>

      {/* Add Doctor Modal */}
      <AddDoctorModal open={showApply} onClose={() => setShowApply(false)} />
    </>
  );
}
