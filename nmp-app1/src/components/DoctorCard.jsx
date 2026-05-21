import { Link } from "react-router-dom";

const PlaceholderAvatar = ({ name }) => (
  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
    <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
        clipRule="evenodd"
      />
    </svg>
  </div>
);

export function DoctorCardHome({ doctor }) {
  return (
    <div className="bg-gray-50 p-4 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col hover:-translate-y-1 transition-transform duration-300">
      <div
        style={{
          borderTopLeftRadius: "0.5rem",
          borderTopRightRadius: "50%",
          borderBottomLeftRadius: "0.5rem",
          borderBottomRightRadius: "20%",
          overflow: "hidden",
        }}
        className="bg-gray-300 h-70 mb-4"
      >
        {doctor.image ? (
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <PlaceholderAvatar name={doctor.name} />
        )}
      </div>
      <h3 className="text-xl font-bold mb-1">{doctor.name}</h3>
      <p className="text-gray-500 mb-4 flex items-center text-sm">
        <svg
          className="w-4 h-4 mr-1 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
          <path
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
        {doctor.location}
      </p>
      <Link
        to={`/doctor/${doctor.id}`}
        className="w-full bg-[#00342b] text-white py-3 rounded-xl font-bold hover:bg-[#004d40] transition text-center block"
      >
        View Profile
      </Link>
    </div>
  );
}

export function DoctorCardSearch({ doctor }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex flex-col group hover:-translate-y-1 transition-transform duration-300">
      <div className="relative pt-[100%] bg-gray-100">
        {doctor.image ? (
          <img
            src={doctor.image}
            alt={doctor.name}
            className="absolute inset-0 w-full h-full object-cover rounded-t-xl"
            style={{
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black 70%, transparent 100%)",
              maskImage:
                "radial-gradient(ellipse at center, black 70%, transparent 100%)",
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col items-center text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">
          {doctor.name}
        </h3>
        <p className="text-sm text-gray-500 mb-1">{doctor.specialty}</p>
        <div className="flex items-center gap-1 text-gray-500 mb-6">
          <svg
            className="w-4 h-4 text-[#00342b]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          <span className="text-sm">{doctor.location}</span>
        </div>
        <Link
          to={`/doctor/${doctor.id}`}
          className="w-full bg-[#00342b] text-white font-bold py-3 rounded-lg hover:bg-[#004d40] transition text-center block text-sm"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}

export function DoctorCardMini({ doctor }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
      <div className="p-4 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-teal-500 p-0.5 bg-gray-100">
          {doctor.image ? (
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
              <svg
                className="w-10 h-10"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
        <h3 className="font-bold text-gray-800 text-sm">{doctor.name}</h3>
        <p className="text-xs text-gray-500 mb-3 flex items-center gap-0.5">
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          {doctor.location}
        </p>
        <Link
          to={`/doctor/${doctor.id}`}
          className="w-full bg-[#064e3b] text-white py-2 rounded-lg text-xs font-medium hover:bg-opacity-90 transition text-center block"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
