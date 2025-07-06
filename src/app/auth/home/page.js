"use client";

import React, { useState, useEffect } from "react";
import axios from "@/utils/axios";
import Navbar from "@/components/Navbar";
import MainForm from "@/components/MainForm";
import RecipeCard from "@/components/RecipeCard";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const HomePage = () => {
  const [recipeData, setRecipeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedSteps, setSelectedSteps] = useState([]);
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuthenticated(true);
    else router.push("/auth/login");
  }, []);

  const fetchRecipes = async (ingredients) => {
    setLoading(true);
    setOriginalPrompt(ingredients.join(", ")); // Store for later saving
    try {
      const userId = user?.id;
      const response = await axios.post(`/api/recipe/generate-recipes`, { ingredients, userId });
      setRecipeData(response.data.recipes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecipe = async (recipe) => {
    try {
      setLoading(true);

      // 1. Send recipe to save and get full steps
      const response = await axios.post(`/api/recipe/save-recipe`, {
        recipe,
        userId: user.id,
        prompt: originalPrompt,
      });

      const { steps } = response.data.saved;

      setSelectedRecipe(recipe);
      setSelectedSteps(steps);
    } catch (err) {
      console.error("Error saving recipe:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-col items-center w-full px-4">
        <div className="w-full flex flex-wrap justify-center gap-4 min-h-[400px] py-6">
          {loading ? (
            <Loader />
          ) : selectedRecipe ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              <RecipeCard recipe={selectedRecipe} steps={selectedSteps} selected />
            </motion.div>
          ) : (
            <AnimatePresence>
              {recipeData.map((recipe, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                >
                  <RecipeCard recipe={recipe} onSelect={handleSelectRecipe} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="w-full max-w-xl mt-6">
          <MainForm fetchRecipes={fetchRecipes} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
