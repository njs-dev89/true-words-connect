import React, { useState } from "react";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

function TableRowCollapse({ rowItems, children }) {
  const [showCollapse, setShowCollapse] = useState(false);
  return (
    <>
      <div
        className={`grid grid-cols-${
          rowItems.length + 1
        } border-2 rounded-lg mt-3`}
      >
        {rowItems.map((rowItem, idx) => {
          return (
            <div key={idx} className="py-4 text-center">
              {rowItem}
            </div>
          );
        })}
        <div
          onClick={() => setShowCollapse(!showCollapse)}
          className="py-4 text-center"
        >
          <button className="text-green flex items-end">
            {showCollapse ? (
              <>
                Hide
                <TiArrowSortedUp className="ml-2 text-xl" />
              </>
            ) : (
              <>
                View
                <TiArrowSortedDown className="ml-2 text-xl" />
              </>
            )}
          </button>
        </div>
        {showCollapse && (
          <div className={`col-span-${rowItems.length + 1} py-4 text-center`}>
            <div className="">{children}</div>
          </div>
        )}
      </div>
    </>
  );
}

export default TableRowCollapse;
