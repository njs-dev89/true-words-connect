import { createContext, useContext } from "react";
import useSiteNotifications from "../customHooks/useSiteNotifications";

const siteNotificationContext = createContext(null);

export function SiteNotificationProvider({ children }) {
  const siteNotifications = useSiteNotifications();
  return (
    <siteNotificationContext.Provider value={siteNotifications}>
      {" "}
      {children}
    </siteNotificationContext.Provider>
  );
}
// custom hook to use the authUserContext and access authUser and loading
export const useSiteNotificationContext = () =>
  useContext(siteNotificationContext);
