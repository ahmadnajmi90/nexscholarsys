import React from "react";

const QuickActions = () => {
  return (
    <div className="col-span-1 grid grid-cols-2 gap-4">
      {[
        { label: "Give Feedback", icon: "📝", link: "https://forms.gle/CQnJJxd8tfSrL2RE7" }, // Feedback Icon
        { label: "Find Academician", icon: "👩‍🏫", link: "/academicians" }, // Lecturer Icon
        { label: "Find Postgraduate", icon: "🎓", link: "/postgraduates" }, // Graduation Icon
        { label: "ChatGPT", icon: <img src="/images/chatgpt.png" alt="" style={{ width: "30px", height: "30px" }} />, link: "https://chatgpt.com/" }, // Robot Icon
        { label: "Scispaces", icon: <img src="/images/scispaces.png" alt="" style={{ width: "30px", height: "30px" }} />, link: "https://typeset.io/" }, // Data/Analytics Icon
        { label: "Canva", icon: <img src="/images/canva.png" alt="" style={{ width: "30px", height: "30px" }} />, link: "https://www.canva.com/" }, // Art Icon
        { label: "Mendeley", icon: <img src="/images/mendeley.png" alt="" style={{ width: "30px", height: "30px" }} />, link: "https://www.mendeley.com/" }, // Book Icon
        { label: "Zotero", icon: <img src="/images/zotero.png" alt="" style={{ width: "30px", height: "30px" }} />, link: "https://www.zotero.org/" }, // Puzzle Icon
        { label: "Scimago", icon: <img src="/images/scimago.png" alt="" style={{ width: "30px", height: "30px" }} />, link: "https://www.scimagojr.com/" }, // Globe Icon
        { label: "Scopus", icon: <img src="/images/scopus.png" alt="" style={{ width: "30px", height: "30px" }} />, link: "https://www.scopus.com/sources.uri?zone=TopNavBar&origin=searchbasic" }, // Search Icon
      ].map((item, index) => (
        <React.Fragment key={index}>
          {item.link ? (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-white shadow-md rounded-lg flex flex-col items-center justify-center hover:bg-gray-100 transition"
            >
              <div className="text-4xl mb-1">{item.icon}</div>
              <p className="text-sm font-medium text-gray-700">{item.label}</p>
            </a>
          ) : (
            <button
              className="p-4 bg-white shadow-md rounded-lg flex flex-col items-center justify-center hover:bg-gray-100 transition"
            >
              <div className="text-4xl mb-1">{item.icon}</div>
              <p className="text-sm font-medium text-gray-700">{item.label}</p>
            </button>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default QuickActions;
