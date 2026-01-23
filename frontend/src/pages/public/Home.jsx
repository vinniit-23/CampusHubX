import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/constants";
import { HiAcademicCap, HiBriefcase, HiBuildingLibrary } from "react-icons/hi2";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans overflow-hidden relative">
      {/* BACKGROUND GRADIENT: Complex multi-layer glow to match the image */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        {/* Top Left: Cyan/Sky Blue glow */}
        <div className="absolute -top-[30%] -left-[10%] w-[70rem] h-[70rem] rounded-full bg-gradient-to-r from-cyan-200/50 to-sky-300/50 blur-[130px] opacity-70"></div>

        {/* Top Right: Purple/Indigo glow */}
        <div className="absolute -top-[40%] -right-[20%] w-[80rem] h-[80rem] rounded-full bg-gradient-to-l from-purple-200/40 to-indigo-300/50 blur-[150px] opacity-60"></div>

        {/* Bottom Left: Deep Blue glow */}
        <div className="absolute -bottom-[40%] -left-[20%] w-[80rem] h-[80rem] rounded-full bg-gradient-to-tr from-blue-400/40 to-sky-300/40 blur-[160px] opacity-50"></div>

        {/* Bottom Center/Right: Violet/Blue glow */}
        <div className="absolute -bottom-[30%] right-[10%] w-[60rem] h-[60rem] rounded-full bg-gradient-to-tl from-violet-300/40 to-blue-200/40 blur-[140px] opacity-50"></div>
      </div>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* LEFT SECTION: Hero Text */}
          <div className="text-center lg:text-left">
            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-8">
              Welcome to <br />
              <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent">
                CampusHubX
              </span>
            </h1>

            <p className="mt-8 text-xl sm:text-2xl text-slate-700 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Connect students, colleges, and recruiters in one powerful
              platform. Streamline your placement journey today.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <Link to={ROUTES.LOGIN}>
                <button className="w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-full shadow-lg shadow-blue-600/30 transition-all transform hover:scale-105">
                  Sign In
                </button>
              </Link>

              <Link to={ROUTES.REGISTER}>
                <button className="w-full sm:w-auto px-10 py-5 bg-transparent hover:bg-blue-50/50 text-blue-600 border-2 border-blue-600 text-lg font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-blue-400/30">
                  Get Started
                </button>
              </Link>
            </div>
          </div>

          {/* RIGHT SECTION: Bento Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* CARD 1: STUDENTS */}
            <div className="sm:col-span-2 relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-[2.5rem] p-10 min-h-[240px] shadow-xl shadow-blue-900/10 group hover:shadow-2xl transition-all duration-300 flex flex-col justify-center">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <svg
                  width="200"
                  height="200"
                  viewBox="0 0 100 100"
                  fill="white"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="80" cy="20" r="10" fill="white" />
                </svg>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 relative z-10">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-lg  shadow-blue-300/30 flex-shrink-0">
                  <HiAcademicCap className="w-12 h-12 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-3">For Students:</h3>
                  <p className="text-blue-50 text-xl leading-relaxed max-w-lg">
                    Track your skills, showcase projects, and discover
                    opportunities matched to your profile.
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 2: COLLEGES */}
            {/* Added backdrop-blur-md so the background gradient shines through subtly */}
            <div className="relative overflow-hidden bg-white/80 backdrop-blur-md text-slate-800 rounded-[2.5rem] p-10 min-h-[340px] shadow-xl shadow-slate-300/50 border border-white/50 group hover:border-blue-100 transition-all duration-300 flex flex-col justify-center">
              <svg
                className="absolute bottom-0 left-0 w-full h-32 opacity-5 text-blue-600"
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
              >
                <path
                  fill="currentColor"
                  d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>
              </svg>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-md text-white">
                <HiBuildingLibrary className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold  text-slate-900 mb-4">
                For Colleges:
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Verify student achievements, track progress, and connect
                directly with recruiters.
              </p>
            </div>

            {/* CARD 3: RECRUITERS */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 to-slate-800 text-white rounded-[2.5rem] p-10 min-h-[340px] shadow-xl shadow-blue-900/20 flex flex-col justify-center">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(#ffffff 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              ></div>
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-lg text-blue-800 relative z-10">
                <HiBriefcase className="w-10 h-10" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">For Recruiters:</h3>
                <p className="text-blue-100  text-lg leading-relaxed">
                  Find the best talent with AI-powered matching and verified
                  student profiles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
