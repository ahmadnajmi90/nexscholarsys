import React from 'react';

const ClicksByType = ({ clicksByType }) => {
    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Clicks by Type</h2>

            {/* Group by entity type */}
            {["grant", "event", "project"].map((type) => {
                const filteredClicks = clicksByType.filter((click) => click.entity_type === type);

                if (filteredClicks.length === 0) return null; // Skip if no clicks for this type

                return (
                    <div key={type} className="mb-4">
                        {/* Entity Type Title */}
                        <h3 className="text-md font-bold text-gray-800 capitalize">
                            {type === "grant" ? "Grant" : type === "event" ? "Event" : "Project"}
                        </h3>
                        <ul className="mt-2">
                            {filteredClicks.map((click, index) => (
                                <li key={index} className="text-gray-600">
                                    <span className="font-semibold">{click.entity_name}</span> -{" "}
                                    <span className="text-blue-500">{click.total_clicks} clicks</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
};

export default ClicksByType;