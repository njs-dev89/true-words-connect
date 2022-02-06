import * as React from "react";

function TabsPaneContainer({ children }) {
  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6">
      <div className="px-4 py-5 flex-auto">
        <div className="tab-content tab-space">{children}</div>
      </div>
    </div>
  );
}

export default TabsPaneContainer;
