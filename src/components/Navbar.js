"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaRegUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "@/utils/axios";
import { Dialog } from "@headlessui/react";

const HistoryCard = ({ recipe }) => {
  const formattedDate = new Date(recipe.createdAt).toLocaleString();

  // Extract steps as an array (assuming recipe.steps is a string or array)
  let stepsArray = [];
  if (Array.isArray(recipe.steps)) {
    stepsArray = recipe.steps;
  } else if (typeof recipe.steps === "string") {
    // Try splitting by newlines or periods
    stepsArray = recipe.steps.split(/\r?\n|\./).map(s => s.trim()).filter(Boolean);
  }

  return (
    <div className="relative border p-4 rounded-lg shadow-md bg-white">
      {/* Time in top-right corner */}
      <div className="absolute top-2 right-4 text-xs text-gray-500">
        {formattedDate}
      </div>
      <h2 className="font-semibold text-lg text-pink-700">{recipe.prompt}</h2>
      <h2 className="font-semibold text-lg text-pink-700">{recipe.title}</h2>
      <p className="text-sm mt-1">⏱️ Cooking Time: {recipe.time} mins</p>
      <p className="text-sm mt-1">🩺 Health Score: {recipe.healthScore}</p>
      <p className="text-sm mt-2">📋 Instructions: {recipe.instructions}</p>
      <p className="text-sm mt-2">🛒 Ingredients: {recipe.ingredients}</p>
      <div className="text-sm mt-2">
        <span className="font-semibold">📝 Steps:</span>
        <ol className="list-decimal ml-5">
          {stepsArray.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();



  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await axios.get(
        "/api/auth/logout",
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      alert("Logged out successfully!");
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      alert("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

const fetchHistory = async () => {
  setHistoryLoading(true);
  try {
    const res = await axios.get(
      `/api/recipe/history/${user?.id}`,
      {
        withCredentials: true,
      }
    );
    // Sort by latest first
    const sortedData = res.data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setHistory(sortedData);
  } catch (error) {
    console.error("Failed to fetch history:", error);
  } finally {
    setHistoryLoading(false);
  }
};


  const handleHistoryClick = () => {
    setIsDialogOpen(true);
    fetchHistory();
  };

  return (
    <>
      <div className="w-full flex justify-between items-center py-3 px-5 bg-[#f572af] relative">
        <h1 className="font-bold text-2xl text-white">Foodies' Paradise</h1>
        <div className="relative" ref={dropdownRef}>
          <div
            className="p-2 rounded-full border-2 border-white cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <FaRegUser color="#ffffff" />
          </div>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-10">
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                 {user?.name}
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={handleHistoryClick}
                >
                  History
                </li>
                <li
                  className={`px-4 py-2 hover:bg-gray-200 cursor-pointer ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={!loading ? handleLogout : undefined}
                >
                  {loading ? "Logging out..." : "Logout"}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg bg-white rounded-lg shadow-xl p-6">
            <Dialog.Title className="text-lg font-bold mb-4 text-center text-pink-600">
              Your Recipe History
            </Dialog.Title>

            {historyLoading ? (
              <p className="text-center text-sm">Loading history...</p>
            ) : history.length === 0 ? (
              <p className="text-center text-sm text-gray-600">
                No history found.
              </p>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {history.map((recipe, index) => (
                  <HistoryCard key={index} recipe={recipe} />
                ))}
              </div>
            )}

            <div className="text-center mt-4">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-1 bg-pink-500 hover:bg-pink-600 text-white rounded"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default Navbar;

