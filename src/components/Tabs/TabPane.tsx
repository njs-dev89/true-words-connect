import * as React from "react";

function TabPane({ openTab, tabNo, children }) {
  return (
    <div className={openTab === tabNo ? "block" : "hidden"} id="link2">
      {children}
    </div>
  );
}

export default TabPane;
