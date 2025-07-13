"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IoReturnUpBack } from "react-icons/io5";
import axios from "@/utils/axios";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // If user is already logged in, redirect
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      router.replace("/auth/home");
    } else {
      setCheckingAuth(false);
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
    if (!formData.userName || !formData.email || !formData.password) {
      showTimedMessage("All fields are required!", false);
      return;
    }

    setIsLoading(true);
    showTimedMessage("Processing...", true, 10000);

    try {
      const response = await axios.post(`/api/auth/register`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setFormData({ userName: "", email: "", password: "" });
      showTimedMessage(response.data.message || "Registration successful!", true);

      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (error) {
      showTimedMessage(error.response?.data?.message || "Registration failed!", false);
    } finally {
      setIsLoading(false);
    }
  };

  // While checking auth, don't render form
  if (checkingAuth) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-rose-500 via-slate-100 to-pink-500">
        <p className="text-white text-xl animate-pulse">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="w-full relative h-screen flex justify-center items-center bg-gradient-to-bl from-rose-500 via-slate-100 to-pink-500 p-10">
      <span className="absolute top-5 flex gap-4 left-10">
        <Link href="/" className="hover:scale-[1.1] transition-transform">
          <IoReturnUpBack size={45} color="#F5EEEE" />
        </Link>
        <span>
          <img src="/logo.png" className="h-[50px] shadow-xl/30 rounded-full" />
        </span>
      </span>

      <div className="border flex flex-col justify-center items-center rounded-lg p-10 min-w-[400px] shadow-lg bg-white/90 backdrop-blur-md">
        <h1 className="text-slate-600 font-bold text-3xl mb-6">Registration</h1>

        <form className="w-full max-w-sm z-10" onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-slate-700 font-medium mb-1">User Name</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Enter Your Name"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-slate-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Enter Your Email"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-slate-700 font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Enter Your Password"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-2 rounded text-white transition ${
              isLoading ? "bg-pink-300 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"
            }`}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {/* Animated Message */}
        <div
          className={`mt-4 text-center transition-opacity duration-500 ${
            showMessage ? "opacity-100" : "opacity-0"
          }`}
          aria-live="polite"
        >
          {message && (
            <p className={isSuccess ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Decorative Images */}
      <img src="/chef2.png" className="absolute h-50 right-[28%] top-[2%] pointer-events-none" />
      <img src="/graphic_chef.png" className="absolute w-50 left-[22%] bottom-[5%] pointer-events-none z-9" />
    </div>
  );
};

export default RegisterPage;
