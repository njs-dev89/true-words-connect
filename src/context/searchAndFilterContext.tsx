import { createContext, useContext } from "react";
import useSearchAndFilter from "../customHooks/useSearchAndFilter";

const searchAndFilterContext = createContext(null);

export function SearchProvider({ children }) {
  const search = useSearchAndFilter();
  return (
    <searchAndFilterContext.Provider value={search}>
      {" "}
      {children}
    </searchAndFilterContext.Provider>
  );
}
// custom hook to use the authUserContext and access authUser and loading
export const useSearch = () => useContext(searchAndFilterContext);
