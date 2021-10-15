import React from "react";

function Tab({ openTab, setOpenTab, text, tabNo }): JSX.Element {
  return (
    <li className="-mb-px mr-2 last:mr-0 text-center">
      <a
        className={
          " font-bold px-4 py-3 " +
          (openTab === tabNo
            ? "text-yellow-300 border-b-2 border-yellow-300"
            : "text-black-600 bg-white")
        }
        onClick={(e) => {
          e.preventDefault();
          setOpenTab(tabNo);
        }}
        data-toggle="tab"
        href="#link1"
        role="tablist"
      >
        {text}
      </a>
    </li>
  );
}

export default Tab;
