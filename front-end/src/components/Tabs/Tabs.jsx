import { useState } from "react";

function Tabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  if (!Boolean(tabs)) {
    return null;
  }

  return (
    <>
      <div className="h-16 border-t-[1px] border-zinc-400 flex flex-row justify-between items-center-safe gap-2">
        {tabs.map((tab) => {
          return (
            <button
              key={tab.id}
              className={`w-full !border-none hover:!shadow-none hover:!transform-none ${activeTab.id === tab.id ? "!bg-gray-700 !text-white" : "hover:!bg-gray-400"}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {activeTab.children}
    </>
  );
}

export default Tabs;
