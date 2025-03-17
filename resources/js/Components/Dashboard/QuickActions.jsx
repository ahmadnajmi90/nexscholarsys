import React from "react";

const QuickLinks = () => {
  const quickLinksData = [
    {
      label: "Give Feedback",
      icon: (
        <img
          src="/images/feedback.png"
          alt="Feedback"
          style={{ width: "30px", height: "30px" }}
        />
      ),
      link: "https://forms.gle/CQnJJxd8tfSrL2RE7",
    },
    {
      label: "Find Academician",
      icon: (
        <img
          src="/images/academician.png"
          alt="Academician"
          style={{ width: "30px", height: "30px" }}
        />
      ),
      link: "/academicians",
    },
    {
      label: "Find Postgraduate",
      icon: (
        <img
          src="/images/postgraduate.png"
          alt="Postgraduate"
          style={{ width: "30px", height: "30px" }}
        />
      ),
      link: "/postgraduates",
    },
    {
      label: "ChatGPT",
      icon: (
        <img
          src="/images/chatgpt.png"
          alt="ChatGPT"
          style={{ width: "30px", height: "30px" }}
        />
      ),
      link: "https://chatgpt.com/",
    },
    {
      label: "Scispaces",
      icon: (
        <img
          src="/images/scispaces.png"
          alt="Scispaces"
          style={{ width: "30px", height: "30px" }}
        />
      ),
      link: "https://typeset.io/",
    },
    {
      label: "Canva",
      icon: (
        <img
          src="/images/canva.png"
          alt="Canva"
          style={{ width: "30px", height: "30px" }}
        />
      ),
      link: "https://www.canva.com/",
    },
    {
      label: "Mendeley",
      icon: (
        <img
          src="/images/mendeley.png"
          alt="Mendeley"
          style={{ width: "30px", height: "30px" }}
        />
      ),
      link: "https://www.mendeley.com/",
    },
    {
      label: "Zotero",
      icon: (
        <img
          src="/images/zotero.png"
          alt="Zotero"
          style={{ width: "30px", height: "30px" }}
        />
      ),
      link: "https://www.zotero.org/",
    },
    {
      label: "Scimago",
      icon: (
        <img
          src="/images/scimago.png"
          alt="Scimago"
          style={{ width: "30px", height: "30px" }}
        />
      ),
      link: "https://www.scimagojr.com/",
    },
    {
      label: "Scopus",
      icon: (
        <img
          src="/images/scopus.png"
          alt="Scopus"
          style={{ width: "30px", height: "30px" }}
        />
      ),
      link: "https://www.scopus.com/sources.uri?zone=TopNavBar&origin=searchbasic",
    },
  ];

  return (
    <div className="md:mx-0 md:auto">
      <h2 className="text-2xl font-semibold mb-4 mt-4">QuickLinks</h2>
      {/* Use grid with 3 columns */}
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-9 gap-4">
        {quickLinksData.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center bg-white shadow-md rounded-lg hover:bg-gray-100 transition p-4"
            style={{ width: "100%", height: "137px" }}
          >
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center"
              >
                <div className="mb-2">{item.icon}</div>
                <p className="text-sm font-medium text-gray-700 text-center">
                  {item.label}
                </p>
              </a>
            ) : (
              <button className="flex flex-col items-center">
                <div className="mb-2">{item.icon}</div>
                <p className="text-sm font-medium text-gray-700 text-center">
                  {item.label}
                </p>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;
