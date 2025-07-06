"use client"
import React, { useState } from "react";
import Link from "next/link";
import { IoReturnUpBack } from "react-icons/io5";
import axios from "@/utils/axios"; // Adjust the import path as necessary
import { useRouter } from "next/navigation";
const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Processing...");

    try {
      const response = await axios.post(`/api/auth/register`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setFormData({ userName: "", email: "", password: "" });
      setMessage(response.data.message || "Registration successful!");

      // Redirect after short delay (optional)
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500); // 1.5 seconds delay

    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="w-full relative h-screen flex justify-center items-center bg-gradient-to-bl from-rose-500 via-slate-100 to-pink-500 p-10">
      <span className="absolute top-5 flex gap-4 left-10 ">
        <Link href="/" className="hover:scale-[1.1]">
          <IoReturnUpBack size={45} />
        </Link>
        <span>
          <img src="/logo.png" className="h-[50px] shadow-xl/30 rounded-full" />
        </span>
      </span>

      <div className="border flex flex-col justify-center items-center rounded-lg p-10 min-w-[400px] shadow-lg">
        <h1 className="text-slate-600 font-bold text-3xl mb-6">Registration</h1>

        <form className="w-full max-w-sm z-10" onSubmit={handleSubmit}>
          {/* Username Field */}
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
            />
          </div>

          {/* Email Field */}
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
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-slate-700 font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Enter Your Password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition cursor-pointer"
          >
            Submit
          </button>
        </form>

        {/* Display message */}
        {message && <p className="mt-4 text-slate-600">{message}</p>}

      </div>
      <img src="/chef2.png" className="absolute h-50 right-[28%] top-[2%] pointer-events-none" />
      <img src="/graphic_chef.png" className="absolute w-50 left-[22%] bottom-[5%] pointer-events-none z-9" />
    </div>
  );
};

export default RegisterPage;
