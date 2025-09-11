

import React, { useState, useEffect, useRef } from "react";
import { getGenres, getLanguages } from "../api/tmdb";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

const FilterBar = ({ onFilterChange }) => {
  const [open, setOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selected, setSelected] = useState({ genre: null, language: null });
  const dropdownRef = useRef();

  useEffect(() => {
    getGenres().then((res) => setGenres(res.data.genres));
    getLanguages().then((res) => setLanguages(res.data));
  }, []);

  // Close dropdown if clicked outside
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
    setSelected((prev) => ({
      ...prev,
      [type]: prev[type] === value ? null : value, // toggle
    }));
    onFilterChange({ type, value });
  };

  return (
    <div className="relative w-full max-w-xs mx-auto mb-4" ref={dropdownRef}>
      {/* Filter Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Filter
        <ChevronDownIcon
          className={`w-5 h-5 transform transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Rating */}
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                Rating
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {[5, 7, 8].map((r) => (
                  <button
                    key={r}
                    onClick={() => applyFilter("rating", r)}
                    className="bg-yellow-400 text-gray-900 px-2 py-1 rounded hover:bg-yellow-500 transition text-sm"
                  >
                    ≥ {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Genre */}
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                Genre
              </span>
              <div className="flex flex-wrap gap-2 mt-2 max-h-40 overflow-y-auto">
                {genres.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => applyFilter("genre", g.id)}
                    className={`px-2 py-1 rounded text-sm transition ${
                      selected.genre === g.id
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 dark:bg-gray-700 text-blue-800 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                Language
              </span>
              <div className="flex flex-wrap gap-2 mt-2 max-h-40 overflow-y-auto">
                {languages.map((l) => (
                  <button
                    key={l.iso_639_1}
                    onClick={() => applyFilter("language", l.iso_639_1)}
                    className={`px-2 py-1 rounded text-sm transition ${
                      selected.language === l.iso_639_1
                        ? "bg-green-600 text-white"
                        : "bg-green-100 dark:bg-gray-700 text-green-800 dark:text-gray-200 hover:bg-green-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {l.english_name}
                  </button>
                ))}
              </div>
            </div>

            {/* Release Date */}
            <div className="px-4 py-2">
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                Release Date
              </span>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => applyFilter("sort", "release_date.desc")}
                  className="bg-purple-100 dark:bg-gray-700 text-purple-800 dark:text-gray-200 px-2 py-1 rounded hover:bg-purple-200 dark:hover:bg-gray-600 transition text-sm"
                >
                  ↓
                </button>
                <button
                  onClick={() => applyFilter("sort", "release_date.asc")}
                  className="bg-purple-100 dark:bg-gray-700 text-purple-800 dark:text-gray-200 px-2 py-1 rounded hover:bg-purple-200 dark:hover:bg-gray-600 transition text-sm"
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


