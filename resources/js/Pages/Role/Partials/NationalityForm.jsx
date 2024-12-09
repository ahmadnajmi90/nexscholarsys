import { useState } from "react";

// List of nationalities (example; use a comprehensive list for production)
const nationalities  = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "United States",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Barbuda",
    "Botswana",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Brazil",
    "United Kingdom",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Myanmar (Burma)",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cape Verde",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Netherlands",
    "East Timor",
    "Ecuador",
    "Egypt",
    "United Arab Emirates",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Ethiopia",
    "Fiji",
    "Philippines",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea-Bissau",
    "Guinea",
    "Guyana",
    "Haiti",
    "Bosnia and Herzegovina",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Ivory Coast",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Saint Kitts and Nevis",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "North Macedonia",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Morocco",
    "Lesotho",
    "Botswana",
    "Mozambique",
    "Namibia",
    "Nauru",
    "Nepal",
    "New Zealand",
    "Vanuatu",
    "Nicaragua",
    "Nigeria",
    "Niger",
    "North Korea",
    "Northern Ireland",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Lucia",
    "El Salvador",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Scotland",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Eswatini",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "Uruguay",
    "Uzbekistan",
    "Venezuela",
    "Vietnam",
    "Wales",
    "Yemen",
    "Zambia",
    "Zimbabwe",
];


export default function NationalityForm({ value, onChange, title }) {
    const [search, setSearch] = useState("");

    const filteredNationalities = nationalities.filter((nat) =>
        nat.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div >
            <label htmlFor="nationality" className="block font-medium text-gray-700">
                {title}
            </label>

            {/* Nationality Dropdown */}
            <select
                id="nationality"
                className="mt-1 block w-full border-gray-200 rounded-lg p-4 text-sm"
                value={value}
                onChange={(e) => onChange(e.target.value)} // Pass the selected value
            >
                <option value="" hidden>
                    Select {title}
                </option>
                {filteredNationalities.map((nat) => (
                    <option key={nat} value={nat}>
                        {nat}
                    </option>
                ))}
            </select>
        </div>
    );
}
