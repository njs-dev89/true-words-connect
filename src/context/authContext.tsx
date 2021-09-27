import { createContext, useContext } from "react";
import useAuth from "../customHooks/useAuth";

const authUserContext = createContext(null);

export function AuthUserProvider({ children }) {
  const auth = useAuth();
  return (
    <authUserContext.Provider value={auth}>
      {" "}
      {children}
    </authUserContext.Provider>
  );
}
// custom hook to use the authUserContext and access authUser and loading
export const useFirebaseAuth = () => useContext(authUserContext);
