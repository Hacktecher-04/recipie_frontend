"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoReturnUpBack } from "react-icons/io5";
import axios from "@/utils/axios";
import { useRouter } from "next/navigation";


function LoginPage() {



  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Processing...");
    console.log("form data", formData);


    try {
      const response = await axios.post(
        `/api/auth/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.token) {
        setMessage("Login successful!");
        setIsSuccess(true);
        setFormData({ email: "", password: "" });
        // Save token to localStorage or cookies if needed
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Redirect to home page
        setTimeout(() => {
          router.push("/auth/home");
        }, 1000);
      } else {
        setMessage("Login failed! Token not received.");
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed!");
      setIsSuccess(false);
    }



  };

  return (
    <div className="w-full relative h-screen relative flex justify-center items-center bg-gradient-to-br from-rose-500 via-slate-100 to-pink-500 p-10">
      <span className="absolute top-5 flex gap-4 left-10 ">
        <Link href="/" className="hover:scale-[1.1]">
          <IoReturnUpBack size={45} color="#F5EEEE" />
        </Link>
        <span>
          <img src="/logo.png" className="h-[50px] shadow-xl/30 rounded-full" />
        </span>
      </span>
      <div className="border relative flex flex-col justify-center items-center rounded-lg p-10 min-w-[400px] shadow-lg">
        <h1 className="text-slate-600 font-bold text-3xl mb-6">Login</h1>

        <form className="w-full  max-w-sm z-10" onSubmit={handleSubmit}>
          {/* Username Field */}

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-slate-700 font-medium mb-1">
              Email
            </label>
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
            <label className="block text-slate-700 font-medium mb-1">
              Password
            </label>
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
            className="w-full px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
          >
            Submit
          </button>
          {/* <img src="/potatoe.png" className="absolute h-50 left-[50%] -top-[45%] -translate-x-[50%] pointer-events-none" /> */}
        </form>

        {/* Display message */}
        {message && <p className={`mt-4 ${isSuccess ? "text-green-500" : "text-red-500"}`}>{message}{
          isSuccess && <span className=" w-full text-center mt-4 text-green-500">
            <br />
            redirecting....
          </span>
        }</p>}
      </div>
      <img src="/dada.png" className="absolute h-50 right-[30%] top-[65%] pointer-events-none" />
      <img src="/thali.png" className="absolute h-30 left-[35%] bottom-[10%] -translate-x-[50%] pointer-events-none" />

    </div>
  );
}

export default LoginPage;
