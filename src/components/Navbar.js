"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaRegUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "@/utils/axios";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";

const HistoryCard = ({ recipe, isSelected, toggleSelect, selectionMode }) => {
  const formattedDate = new Date(recipe.createdAt).toLocaleString();

  let stepsArray = [];
  if (Array.isArray(recipe.steps)) {
    stepsArray = recipe.steps;
  } else if (typeof recipe.steps === "string") {
    stepsArray = recipe.steps
      .split(/\r?\n|\./)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return (
    <div className="relative border p-4 rounded-lg shadow-md bg-white flex gap-4 items-start">
      {selectionMode && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleSelect(recipe._id)}
          className="mt-2"
          aria-label={`Select recipe ${recipe.title}`}
        />
      )}

      <div className="flex-1">
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
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedRecipes, setSelectedRecipes] = useState(new Set());
  const [selectionMode, setSelectionMode] = useState(false); // New selection mode state
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
    await axios.get("/api/auth/logout", { withCredentials: true });

    // Clear user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // clear token too if stored

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
      const res = await axios.get(`/api/recipe/history`, {
        withCredentials: true,
      });
      const sortedData = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setHistory(sortedData);
      setSelectedRecipes(new Set());
      setSelectionMode(false); // reset selection mode on fetch
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

  const toggleSelect = (id) => {
    setSelectedRecipes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedRecipes.size === history.length) {
      // Deselect all
      setSelectedRecipes(new Set());
    } else {
      // Select all
      setSelectedRecipes(new Set(history.map((r) => r._id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRecipes.size === 0) return;

    setHistoryLoading(true);

    try {
      await axios.post(
        "/api/recipe/delete",
        { recipeIds: Array.from(selectedRecipes) },
        { withCredentials: true }
      );

      // Remove deleted from history locally for instant feedback
      setHistory((prev) =>
        prev.filter((r) => !selectedRecipes.has(r._id))
      );
      setSelectedRecipes(new Set());
      setSelectionMode(false);
    } catch (error) {
      console.error("Failed to delete recipes:", error);
      alert(
        error.response?.data?.message ||
          "Failed to delete recipes. Please try again."
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  const cancelSelection = () => {
    setSelectedRecipes(new Set());
    setSelectionMode(false);
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
        onClose={() => {
          setIsDialogOpen(false);
          cancelSelection();
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex flex-col items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg bg-white rounded-lg shadow-xl p-4 max-h-[80vh] overflow-auto flex flex-col">
            <Dialog.Title className="text-lg font-bold mb-4 text-center text-pink-600">
              Your Recipe History
            </Dialog.Title>

            {/* Top bar for Delete/Cancel/Select All/Delete Selected */}
            <div className="flex justify-between items-center mb-4 px-2">
              {!selectionMode ? (
                <button
                  onClick={() => setSelectionMode(true)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-semibold transition"
                >
                  Delete
                </button>
              ) : (
                <>
                  <button
                    onClick={cancelSelection}
                    className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded font-semibold transition"
                    disabled={historyLoading}
                  >
                    Cancel
                  </button>

                  <div className="flex gap-2 items-center">
                    <button
                      onClick={toggleSelectAll}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-semibold transition"
                      disabled={historyLoading}
                    >
                      {selectedRecipes.size === history.length
                        ? "Deselect All"
                        : "Select All"}
                    </button>

                    <button
                      onClick={handleDeleteSelected}
                      className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed`}
                      disabled={selectedRecipes.size === 0 || historyLoading}
                    >
                      {historyLoading ? "Deleting..." : "Delete Selected"}
                    </button>
                  </div>
                </>
              )}
            </div>

            {historyLoading ? (
              <p className="text-center text-sm">Loading history...</p>
            ) : history.length === 0 ? (
              <p className="text-center text-sm text-gray-600">No history found.</p>
            ) : (
              <div className="space-y-4 flex-1 overflow-y-auto">
                <AnimatePresence>
                  {history.map((recipe) => (
                    <motion.div
                      key={recipe._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      layout
                    >
                      <HistoryCard
                        recipe={recipe}
                        isSelected={selectedRecipes.has(recipe._id)}
                        toggleSelect={toggleSelect}
                        selectionMode={selectionMode}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            <div className="text-center mt-4">
              <button
                onClick={() => {
                  setIsDialogOpen(false);
                  cancelSelection();
                }}
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
