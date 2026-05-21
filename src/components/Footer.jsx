import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-[1500px] mx-auto px-4 md:px-12 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-[#00342b] text-white w-10 h-10 flex items-center justify-center font-bold text-xl rounded">
                N
              </div>
              <span className="font-bold text-[#00342b] text-lg">NMP</span>
            </div>
            <p className="text-sm text-gray-500 max-w-xs text-center md:text-left">
              Connecting patients with trusted Muslim healthcare professionals.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-gray-600 font-medium">
            <Link to="/" className="hover:text-[#00342b] transition-colors">Home</Link>
            <a href="#" className="hover:text-[#00342b] transition-colors">About Us</a>
            <a href="#" className="hover:text-[#00342b] transition-colors">FAQs</a>
            <a href="#" className="hover:text-[#00342b] transition-colors">Terms &amp; Service</a>
            <Link to="/contact" className="hover:text-[#00342b] transition-colors">Contact</Link>
          </div>

          {/* Socials */}
          <div className="flex gap-4">
            {/* Facebook */}
            <a href="#" className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-100 hover:bg-[#00342b] hover:text-white transition-all duration-300 text-blue-700">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-100 hover:bg-[#00342b] hover:text-white transition-all duration-300 text-pink-600">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.012 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.012 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.012-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06zm0 3.678c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162S15.403 5.838 12 5.838zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            {/* WhatsApp */}
            <a href="#" className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-100 hover:bg-[#00342b] hover:text-white transition-all duration-300 text-green-500">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19.05 4.91c-2.15-2.15-5.02-3.34-8.07-3.34C4.99 1.57.11 6.45.11 12.44c0 1.92.49 3.78 1.44 5.44L0 23.93l6.23-1.63c1.58.86 3.37 1.32 5.18 1.32 6.01 0 10.89-4.88 10.89-10.87 0-2.91-1.13-5.64-3.25-7.84zM10.99 21.64c-1.63 0-3.22-.44-4.61-1.26l-.33-.2-3.42.9.91-3.33-.22-.35c-.9-1.43-1.37-3.1-1.37-4.81 0-4.91 4-8.91 8.92-8.91 2.38 0 4.61.93 6.3 2.62 1.68 1.68 2.61 3.92 2.61 6.3.01 4.9-3.99 8.9-8.8 8.9zm4.88-6.66c-.27-.14-1.58-.78-1.83-.87-.25-.09-.43-.14-.61.14-.18.27-.7.87-.85 1.05-.16.18-.32.21-.59.07-.27-.14-1.15-.42-2.19-1.35-.81-.72-1.35-1.61-1.51-1.88-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.83-2.02-.21-.52-.43-.45-.61-.46h-.52c-.18 0-.47.07-.72.34-.25.27-.96.94-.96 2.3s.98 2.66 1.12 2.84c.14.18 1.93 2.94 4.67 4.12.65.28 1.16.45 1.56.57.65.21 1.25.18 1.72.11.52-.08 1.58-.65 1.81-1.27.22-.62.22-1.15.16-1.27-.06-.13-.23-.21-.5-.35z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-500">© 2024 Network of Muslim Physicians. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
