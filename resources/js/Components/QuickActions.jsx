import React from "react";

const QuickActions = () => {


  return (
    <div className="col-span-1 grid grid-cols-2 gap-4">
    {[{ label: "Give Feedback", icon: "🗑️" },
      { label: "Request Features", icon: "🚀" },
      { label: "Find Academician", icon: "🔗" },
      { label: "Find Postgraduate", icon: "📚" },
      { label: "Scispace", icon: "🗑️" },
      { label: "ChatGPT", icon: "🚀" },
    ].map((item, index) => (
      <button
        key={index}
        className="p-4 bg-white shadow-md rounded-lg flex flex-col items-center justify-center hover:bg-gray-100 transition"
      >
        <div className="text-2xl mb-2">{item.icon}</div>
        <p className="text-sm font-medium text-gray-700">{item.label}</p>
      </button>
    ))}
  </div>
  );
};

export default QuickActions;
