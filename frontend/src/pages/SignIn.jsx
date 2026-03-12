import React, { useState } from "react";
import logo from "../assets/logo2.png";
import logo1 from "../assets/logo.png";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function SignIn() {
  const [inputClicked, setInputClicked] = useState({
    userName: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    setLoading(true);
    setErr("");

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { userName, password },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
      setLoading(false);
    } catch (error) {
      setErr(error.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <>
      {/* FLOATING BALLS CSS */}
      <style>
        {`
          .floating-ball {
            position: absolute;
            border-radius: 50%;
            opacity: 0.35;
            animation: floatUp 10s linear infinite;
          }
          @keyframes floatUp {
            0% { transform: translateY(100vh) scale(0.8); }
            100% { transform: translateY(-10vh) scale(1.2); }
          }
        `}
      </style>

      <div className="w-full h-screen bg-gradient-to-br from-[#0d0d0d] via-[#111827] to-black flex flex-col justify-center items-center relative overflow-hidden">

        {/* BACKGROUND FLOATING BALLS */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="floating-ball"
              style={{
                width: 20 + Math.random() * 60,
                height: 20 + Math.random() * 60,
                background: "rgba(59,130,246,0.25)",
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * -10}s`,
              }}
            />
          ))}
        </div>

        {/* MAIN CARD */}
        <div className="w-[90%] lg:max-w-[60%] h-[600px] bg-[#f7f7f7] rounded-3xl flex justify-center items-center overflow-hidden border border-gray-300 shadow-xl shadow-black/40">

          {/* LEFT SIDE */}
          <div className="w-full lg:w-[50%] h-full bg-white flex flex-col items-center justify-center p-[10px] gap-[20px]">

            <div className="flex gap-[10px] items-center text-[22px] font-semibold mt-[40px] text-gray-800">
              <span>Sign In to</span>
              <img src={logo} alt="" className="w-[75px]" />
            </div>

            {/* Username */}
            <div
              className="relative flex items-center w-[90%] h-[55px] mt-[20px] rounded-2xl border-2 border-gray-400 hover:border-[#3b82f6] transition-all"
              onClick={() => setInputClicked({ ...inputClicked, userName: true })}
            >
              <label
                htmlFor="userName"
                className={`absolute left-[20px] bg-white px-[5px] text-[15px] text-gray-700 transition-all 
                ${inputClicked.userName ? "top-[-12px] text-[#3b82f6]" : "top-[13px]"}`}
              >
                Enter Username
              </label>

              <input
                type="text"
                id="userName"
                className="w-full h-full rounded-2xl pl-[20px] outline-none bg-transparent"
                onChange={(e) => setUserName(e.target.value)}
                value={userName}
              />
            </div>

            {/* Password */}
            <div
              className="relative flex items-center w-[90%] h-[55px] rounded-2xl border-2 border-gray-400 hover:border-[#3b82f6] transition-all"
              onClick={() => setInputClicked({ ...inputClicked, password: true })}
            >
              <label
                htmlFor="password"
                className={`absolute left-[20px] bg-white px-[5px] text-[15px] text-gray-700 transition-all 
                ${inputClicked.password ? "top-[-12px] text-[#3b82f6]" : "top-[13px]"}`}
              >
                Enter Password
              </label>

              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full h-full rounded-2xl pl-[20px] outline-none bg-transparent"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />

              {showPassword ? (
                <IoIosEyeOff
                  className="absolute right-[20px] w-[25px] h-[25px] text-gray-600 cursor-pointer hover:text-black transition"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <IoIosEye
                  className="absolute right-[20px] w-[25px] h-[25px] text-gray-600 cursor-pointer hover:text-black transition"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>

            <div
              className="w-[90%] text-[#2563eb] px-[20px] cursor-pointer hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </div>

            {/* Error */}
            {err && <p className="text-red-500 text-[14px]">{err}</p>}

            {/* Button */}
            <button
              className="w-[70%] bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold h-[50px] rounded-2xl mt-[20px] shadow-lg shadow-[#3b82f6]/30 transition-all"
              onClick={handleSignIn}
              disabled={loading}
            >
              {loading ? <ClipLoader size={30} color="white" /> : "Sign In"}
            </button>

            <p
              className="cursor-pointer text-gray-800 mt-[10px]"
              onClick={() => navigate("/signup")}
            >
              Want To Create An Account?{" "}
              <span className="text-[#2563eb] border-b-2 border-[#2563eb] pb-[2px]">
                Sign Up
              </span>
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="md:w-[50%] h-full hidden lg:flex justify-center items-center bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] flex-col gap-[10px] text-white text-[18px] font-semibold shadow-2xl shadow-black/50">
            <img src={logo1} alt="" className="w-[40%] drop-shadow-xl" />
            <p>Not Just A Platform, It's A VYBE</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;
