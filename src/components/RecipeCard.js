import React from "react";
import { motion } from "framer-motion";

const RecipeCard = ({ recipe, onSelect, steps = [], selected = false }) => {
  const isEmpty = !recipe || !recipe.title;

  return (
    <motion.div
      onClick={() => !selected && onSelect && onSelect(recipe)}
      className={`max-w-md mx-auto bg-white rounded-2xl shadow-md overflow-hidden transition-transform duration-300 ${
        selected ? "border-2 border-pink-500 scale-[1.01]" : "hover:scale-[1.02] hover:shadow-xl"
      } mt-6 cursor-pointer`}
    >
      <div className="p-6">
        {isEmpty ? (
          <div className="text-center text-gray-600 text-sm italic">
            💡 <span className="font-medium">Tip:</span> Enter ingredients below to get your personalized recipe recommendation!
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-pink-600 mb-3">
              {recipe.title}
            </h2>

            <div className="mb-3">
              <h3 className="font-semibold text-gray-800">Ingredients:</h3>
              <p className="text-gray-600 text-sm">{recipe.ingredients}</p>
            </div>

            <div className="mb-3">
              <h3 className="font-semibold text-gray-800">Instructions:</h3>
              <p className="text-gray-600 text-sm">{recipe.instructions}</p>
            </div>

            <div className="flex justify-between text-sm text-gray-700 mt-4">
              <div>
                <span className="font-medium text-gray-800">Cooking Time:</span>{" "}
                {recipe.cookingTime} mins
              </div>
              <div>
                <span className="font-medium text-gray-800">Health Score:</span>{" "}
                {recipe.healthScore}
              </div>
            </div>

            {selected && steps.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Step-by-step Instructions:
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {steps.map((step, index) => (
                    <li key={index}>{step.replace(/^\d+[\).]\s*/, "")}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default RecipeCard;
