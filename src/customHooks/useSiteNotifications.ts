import * as React from "react";

export default function useSiteNotifications() {
  const [siteErrors, setSiteErrors] = React.useState("");
  const [siteInfo, setSiteInfo] = React.useState("");
  const [siteWarning, setSiteWarning] = React.useState("");

  return {
    siteErrors,
    setSiteErrors,
    siteInfo,
    setSiteInfo,
    siteWarning,
    setSiteWarning,
  };
}
