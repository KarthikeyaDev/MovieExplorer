import React, { useState, useEffect, useRef } from "react";
import { getGenres, getLanguages } from "../api/tmdb";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

const FilterBar = ({ onFilterChange }) => {
  const [open, setOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selected, setSelected] = useState({ genre: null, language: null, rating: null, sort: null });
  const dropdownRef = useRef();

  useEffect(() => {
    getGenres().then((res) => setGenres(res.data.genres || []));
    getLanguages().then((res) => setLanguages(res.data || []));
  }, []);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const applyFilter = (type, value) => {
    const newValue = selected[type] === value ? null : value; 
    setSelected((prev) => ({ ...prev, [type]: newValue }));
    onFilterChange({ type, value: newValue });
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow-lg hover:scale-105 transition"
      >
        Filter
        <ChevronDownIcon
          className={`w-5 h-5 transform transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full md:w-64 bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="font-semibold text-gray-700 dark:text-gray-200">Rating</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {[5, 7, 8].map((r) => (
                  <button
                    key={r}
                    onClick={() => applyFilter("rating", r)}
                    className={`px-2 py-1 rounded text-sm transition font-medium ${
                      selected.rating === r
                        ? "bg-yellow-400 text-gray-900"
                        : "bg-yellow-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-yellow-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    ≥ {r}
                  </button>
                ))}
              </div>
            </div>

            
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 max-h-40 overflow-y-auto">
              <span className="font-semibold text-gray-700 dark:text-gray-200">Genre</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {genres.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => applyFilter("genre", g.id)}
                    className={`px-2 py-1 rounded text-sm font-medium transition ${
                      selected.genre === g.id
                        ? "bg-indigo-500 text-white"
                        : "bg-indigo-100 dark:bg-gray-700 text-indigo-800 dark:text-gray-200 hover:bg-indigo-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>

            
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 max-h-40 overflow-y-auto">
              <span className="font-semibold text-gray-700 dark:text-gray-200">Language</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {languages.map((l) => (
                  <button
                    key={l.iso_639_1}
                    onClick={() => applyFilter("language", l.iso_639_1)}
                    className={`px-2 py-1 rounded text-sm font-medium transition ${
                      selected.language === l.iso_639_1
                        ? "bg-green-500 text-white"
                        : "bg-green-100 dark:bg-gray-700 text-green-800 dark:text-gray-200 hover:bg-green-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {l.english_name}
                  </button>
                ))}
              </div>
            </div>

            
            <div className="px-4 py-2">
              <span className="font-semibold text-gray-700 dark:text-gray-200">Release Date</span>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => applyFilter("sort", "release_date.desc")}
                  className={`px-2 py-1 rounded text-sm font-medium transition ${
                    selected.sort === "release_date.desc"
                      ? "bg-purple-500 text-white"
                      : "bg-purple-100 dark:bg-gray-700 text-purple-800 dark:text-gray-200 hover:bg-purple-200 dark:hover:bg-gray-600"
                  }`}
                >
                  ↓
                </button>
                <button
                  onClick={() => applyFilter("sort", "release_date.asc")}
                  className={`px-2 py-1 rounded text-sm font-medium transition ${
                    selected.sort === "release_date.asc"
                      ? "bg-purple-500 text-white"
                      : "bg-purple-100 dark:bg-gray-700 text-purple-800 dark:text-gray-200 hover:bg-purple-200 dark:hover:bg-gray-600"
                  }`}
                >
                  ↑
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;




