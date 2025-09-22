import React, { createContext, useContext, useState } from "react";

const SearchToggleContext = createContext();

export const SearchToggleProvider = ({ children }) => {
  const [showSearch, setShowSearch] = useState(false);

  const toggleSearch = () => setShowSearch((prev) => !prev);

  return (
    <SearchToggleContext.Provider value={{ showSearch, toggleSearch }}>
      {children}
    </SearchToggleContext.Provider>
  );
};

export const useSearchToggle = () => useContext(SearchToggleContext);
