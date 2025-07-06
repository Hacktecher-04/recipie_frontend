"use client";
import React, { useState } from "react";
import { AiOutlineSend, AiOutlinePlus } from "react-icons/ai";
import { ImSpinner2 } from "react-icons/im";

const MainForm = ({ fetchRecipes }) => {
  const [ingredient, setIngredient] = useState("");
  const [amount, setAmount] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (ingredient.trim() === "" || amount.trim() === "") {
      alert("Please enter both ingredient and amount.");
      return;
    }

    const newEntry = `${ingredient.trim()} - ${amount.trim()}`;
    setIngredientsList([...ingredientsList, newEntry]);

    setIngredient("");
    setAmount("");
  };

  const handleSubmitRecipes = async () => {
    if (ingredientsList.length === 0) {
      alert("Please add at least one ingredient.");
      return;
    }

    setLoading(true);
    await fetchRecipes(ingredientsList);
    setLoading(false);
    setIngredientsList([]);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-6 mt-6 rounded-2xl shadow-md space-y-6">
      {/* Input Form */}
      <form
        onSubmit={handleAddIngredient}
        className="flex flex-col sm:flex-row items-center gap-3"
      >
        <input
          type="text"
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          placeholder="Ingredient"
          className="flex-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="w-[120px] border border-gray-300 rounded-lg px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
        <button
          type="submit"
          className="bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-gray-900 transition duration-150 shadow flex items-center justify-center"
        >
          <AiOutlinePlus size={18} />
        </button>
      </form>

      {/* Ingredients List */}
      {ingredientsList.length > 0 && (
        <div>
          <h3 className="text-gray-700 font-semibold mb-2 text-sm">
            Ingredients Added:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
            {ingredientsList.map((item, index) => (
              <li key={index} className="ml-2">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommend Button */}
      <div className="text-center">
        <button
          onClick={handleSubmitRecipes}
          disabled={loading}
          className={`inline-flex items-center gap-2 bg-[#f572af] text-white px-6 py-2 rounded-lg font-medium transition duration-150 ${
            loading ? "opacity-60 cursor-not-allowed" : "hover:bg-pink-600"
          }`}
        >
          {loading ? (
            <>
              <ImSpinner2 className="animate-spin" size={18} />
              Recommending...
            </>
          ) : (
            <>
              <AiOutlineSend size={18} />
              Recommend Recipes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MainForm;


