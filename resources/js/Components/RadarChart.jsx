import React, { useState } from "react";
import ReactECharts from "echarts-for-react";

const ResearchTrendScatterWithLines = () => {
  // Realistic trends for 30 research areas (2024–2028)
  const researchData = {
    "Artificial Intelligence (Generative AI)": [9, 9.3, 9.5, 9.8, 10],
    "Quantum Computing": [8.8, 9, 9.2, 9.4, 9.3],
    "Clean Energy Technologies (Green Hydrogen)": [8.5, 8.8, 9, 9.2, 9.1],
    "Synthetic Biology": [7.5, 7.8, 8, 8.1, 7.9],
    "Climate Change Mitigation (Carbon Capture)": [9, 9.2, 9.4, 9.7, 9.5],
    "Advanced Robotics": [8.2, 8.5, 8.8, 9, 9.1],
    "Natural Language Processing": [8, 8.2, 8.5, 8.6, 8.4],
    "Autonomous Vehicles": [7.8, 8, 8.3, 8.5, 8.6],
    "Space Exploration Technologies": [9.2, 9.3, 9.5, 9.8, 10],
    "Edge Computing": [8.9, 9.1, 9.2, 9.3, 9.2],
    "Cybersecurity Enhancements": [8.7, 9, 9.3, 9.5, 9.4],
    "Blockchain for Finance": [7.8, 8, 8.1, 8, 7.9],
    "Decentralized Healthcare Solutions": [7.5, 7.8, 8.1, 8.3, 8.2],
    "Agricultural Biotechnology": [8.2, 8.4, 8.6, 8.7, 8.8],
    "Urban Smart Cities": [8, 8.2, 8.4, 8.5, 8.3],
    "Renewable Energy Innovations": [9.3, 9.5, 9.7, 9.9, 10],
    "Human-Machine Interaction": [8.4, 8.6, 8.8, 9, 9.1],
    "Drones in Logistics": [8.7, 9, 9.3, 9.5, 9.2],
    "Digital Learning Platforms": [8, 8.3, 8.5, 8.6, 8.4],
    "Environmental Monitoring Systems": [8.6, 8.8, 9, 9.2, 9.3],
    "Biomedical Engineering Innovations": [8.4, 8.6, 8.8, 8.9, 8.7],
    "Telemedicine & Remote Healthcare": [8.2, 8.4, 8.6, 8.8, 8.7],
    "Energy Storage Systems (Solid-State Batteries)": [8.7, 8.9, 9.2, 9.4, 9.3],
    "Sustainable Manufacturing Processes": [8.3, 8.5, 8.7, 8.9, 8.8],
    "Renewable Ocean Energy (Tidal Power)": [8, 8.2, 8.4, 8.5, 8.4],
    "Advanced Materials (Nanotechnology)": [9, 9.2, 9.3, 9.5, 9.4],
    "Space-Based Internet Technologies": [8.5, 8.7, 8.9, 9.2, 9.1],
    "Food Security Solutions": [7.8, 8, 8.3, 8.5, 8.6],
    "Water Purification Innovations": [8.3, 8.5, 8.7, 8.8, 8.7],
    "Circular Economy (Recycling Technologies)": [8.5, 8.7, 9, 9.2, 9.1],
  };

  // State for focus areas
  const [focusAreas, setFocusAreas] = useState(
    Object.keys(researchData).reduce((acc, area) => {
      acc[area] = true; // Set all to true by default
      return acc;
    }, {})
  );

  // Handle toggle for focus areas
  const handleToggle = (area) => {
    setFocusAreas((prevState) => ({
      ...prevState,
      [area]: !prevState[area],
    }));
  };

  // Function to determine the impact category
  const determineImpactCategory = (impact) => {
    if (impact >= 8.5) return "High Impact";
    if (impact >= 7.5) return "Medium Impact";
    return "Low Impact";
  };

  // Generate scatter and line data based on active focus areas
  const generateSeries = () => {
    const years = [2024, 2025, 2026, 2027, 2028];
    return Object.keys(focusAreas)
      .filter((area) => focusAreas[area]) // Include only active focus areas
      .map((area) => ({
        name: area,
        type: "line",
        data: researchData[area].map((impact, index) => [years[index], impact]),
        symbolSize: 10,
        lineStyle: {
          width: 2,
        },
        itemStyle: {
          opacity: 0.8,
        },
      }));
  };

  const options = {
    title: {
      text: "Predicted Research Trends Over 5 Years",
      left: "center",
      textStyle: {
        fontSize: 20,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: (params) => {
        const impactCategory = determineImpactCategory(params.data[1]);
        return `
          <strong>Research Area:</strong> ${params.seriesName}<br/>
          <strong>Year:</strong> ${params.data[0]}<br/>
          <strong>Impact:</strong> ${params.data[1].toFixed(2)}<br/>
          <strong>Category:</strong> ${impactCategory}
        `;
      },
    },
    xAxis: {
      name: "Year",
      type: "value",
      min: 2024,
      max: 2028,
    },
    yAxis: {
      name: "Impact",
      type: "value",
      min: 7,
      max: 10,
      splitLine: {
        lineStyle: {
          type: "dashed",
        },
      },
    },
    series: generateSeries(),
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-50">
      <div className="flex flex-row w-full max-w-6xl gap-4">
        {/* Filter Section */}
        <div
          className="w-1/3 p-4 bg-white shadow-md rounded"
          style={{ maxHeight: "500px", overflowY: "auto" }}
        >
          <h2 className="text-xl font-bold mb-4">Trends Filter</h2>
          <p className="text-sm text-gray-500 mb-6">
            Use the toggles below to filter visible trends.
          </p>
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Focus Areas</h3>
            <div className="mt-4 space-y-4">
              {Object.keys(focusAreas).map((area) => (
                <div
                  key={area}
                  className="flex items-center justify-between py-2 border-b"
                >
                  <span className="text-gray-700">{area}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={focusAreas[area]}
                      onChange={() => handleToggle(area)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600"></div>
                    <span className="absolute w-4 h-4 bg-white border rounded-full peer-checked:translate-x-5 peer-checked:border-white transition-transform"></span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="w-2/3">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Research Trends Scatter & Line Chart
          </h1>
          <ReactECharts
            option={options}
            style={{ height: "500px" }}
            key={JSON.stringify(focusAreas)} // Force re-render on filter change
          />
        </div>
      </div>
    </div>
  );
};

export default ResearchTrendScatterWithLines;
