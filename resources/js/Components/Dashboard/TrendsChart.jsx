import React, { useState } from "react";
import ReactECharts from "echarts-for-react";

const ResearchTrendsChart = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrend, setSelectedTrend] = useState(null);

  const trendsData = [
    {
      name: "Artificial Intelligence",
      value: "+120%",
      detail: "Growth in AI-powered tools and machine learning applications.",
    },
    {
      name: "Quantum Networking",
      value: "+85%",
      detail: "Advances in quantum cryptography and secure communications.",
    },
    {
      name: "Space-Based Internet",
      value: "+95%",
      detail: "Emergence of low Earth orbit satellite constellations.",
    },
    {
      name: "Mental Health Tech",
      value: "+150%",
      detail: "Second wave of innovation in mental health technologies.",
    },
    {
      name: "6G Networks",
      value: "+110%",
      detail: "Advancements in ultra-low latency and high-speed connectivity.",
    },
  ];

  const trendsOptions = {
    title: {
      text: "Research Trends Overview",
      left: "center",
      textStyle: { fontSize: 16, fontWeight: "bold" },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    },
    yAxis: { type: "value" },
    series: [
      {
        data: [80, 120, 150, 200, 180, 240, 300, 350, 400],
        type: "line",
        areaStyle: {},
        smooth: true,
        lineStyle: { color: "#2563eb", width: 2 },
        itemStyle: { color: "#2563eb" },
      },
    ],
    grid: { left: "3%", right: "3%", bottom: "10%", containLabel: true },
  };

  const handleTrendClick = (trend) => {
    setSelectedTrend(trend);
    setIsModalOpen(true);
  };

  return (
    <div className="col-span-2 md:col-span-1 bg-white shadow-md rounded-lg p-6">
    <h2 className="text-lg font-bold mb-4">Research Trends</h2>
    {/* Responsive Container for Graph */}
    <div className="overflow-x-auto">
      <ReactECharts
        option={trendsOptions}
        style={{ height: "300px", width: "100%" }}
      />
    </div>
    <ul className="mt-6">
      {trendsData.map((trend, index) => (
        <li key={index} className="flex justify-between items-center mb-2">
          <div>
            <p
              className="text-sm font-medium cursor-pointer text-blue-600 hover:underline"
              onClick={() => handleTrendClick(trend)}
            >
              {trend.name}
            </p>
          </div>
          <p className="text-sm font-bold text-gray-700">{trend.value}</p>
        </li>
      ))}
    </ul>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h3 className="text-lg font-bold mb-4">{selectedTrend.name}</h3>
            <p className="text-sm text-gray-700">{selectedTrend.detail}</p>
            <p className="text-sm text-gray-500 mt-2">
              Growth rate: <span className="font-bold">{selectedTrend.value}</span>
            </p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchTrendsChart;
