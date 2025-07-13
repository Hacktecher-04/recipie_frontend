"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IoReturnUpBack } from "react-icons/io5";
import axios from "@/utils/axios";
import { useRouter } from "next/navigation";

function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null); // null = no message yet
  const [showMessage, setShowMessage] = useState(false); // for fade animation
  const [isLoading, setIsLoading] = useState(false);

  // Track if we checked localStorage
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      router.replace("/auth/home");
    } else {
      setCheckingAuth(false); // no user, show login form
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const showTimedMessage = (msg, success = false, duration = 3000) => {
    setMessage(msg);
    setIsSuccess(success);
    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
    }, duration);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    showTimedMessage("Processing...", true, 10000);

    try {
      const response = await axios.post("/api/auth/login", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        showTimedMessage("Login successful! Redirecting...", true);

        setFormData({ email: "", password: "" });

        setTimeout(() => {
          router.push("/auth/home");
        }, 1500);
      } else {
        showTimedMessage("Login failed! Please try again.", false);
      }
    } catch (error) {
      if (error.response) {
        showTimedMessage(error.response.data.message || "Login failed!", false);
      } else if (error.request) {
        showTimedMessage("Network error: Could not reach server.", false);
      } else {
        showTimedMessage("An unexpected error occurred.", false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // While checking localStorage, render nothing or loader
  if (checkingAuth) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-rose-500 via-slate-100 to-pink-500">
        <p className="text-white text-xl animate-pulse">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="w-full relative h-screen flex justify-center items-center bg-gradient-to-br from-rose-500 via-slate-100 to-pink-500 p-10">
      <span className="absolute top-5 flex gap-4 left-10 ">
        <Link href="/" className="hover:scale-[1.1] transition-transform">
          <IoReturnUpBack size={45} color="#F5EEEE" />
        </Link>
        <span>
          <img
            src="/logo.png"
            alt="logo"
            className="h-[50px] shadow-xl/30 rounded-full"
          />
        </span>
      </span>
      <div className="border relative flex flex-col justify-center items-center rounded-lg p-10 min-w-[400px] shadow-lg bg-white/90 backdrop-blur-md">
        <h1 className="text-slate-600 font-bold text-3xl mb-6">Login</h1>

        <form
          className="w-full max-w-sm z-10"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="mb-4">
            <label className="block text-slate-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              placeholder="Enter Your Email"
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-slate-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              placeholder="Enter Your Password"
              required
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-2 rounded text-white transition ${
              isLoading
                ? "bg-pink-300 cursor-not-allowed"
                : "bg-pink-500 hover:bg-pink-600"
            }`}
          >
            {isLoading ? "Logging in..." : "Submit"}
          </button>
        </form>

        <div
          className={`mt-4 text-center transition-opacity duration-500 ${
            showMessage ? "opacity-100" : "opacity-0"
          }`}
          aria-live="polite"
        >
          {message && (
            <p
              className={
                isSuccess ? "text-green-600 font-semibold" : "text-red-600 font-semibold"
              }
            >
              {message}
            </p>
          )}
        </div>
      </div>

      <img
        src="/dada.png"
        alt="decor"
        className="absolute h-50 right-[30%] top-[65%] pointer-events-none select-none"
      />
      <img
        src="/thali.png"
        alt="decor"
        className="absolute h-30 left-[35%] bottom-[10%] -translate-x-[50%] pointer-events-none select-none"
      />
    </div>
  );
}

export default LoginPage;
