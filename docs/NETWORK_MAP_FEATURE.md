# Network Map Feature Documentation

## Overview

The Network Map feature provides an interactive visualization of Malaysia's research ecosystem, showing universities, community projects, and industry partnerships across the country.

## Access

Navigate to the Network Map via:
- **URL**: `/network-map`
- **Sidebar**: Features → Network Map (Map icon 🗺️)

## Features

### 1. Two Main Views

#### Overview Tab
- **Interactive Map** showing all entities across Malaysia
- **Statistics Bar** with live counts and insights
- **University Rankings Table** (sortable)
- **Map Markers**:
  - 🎓 Blue = Universities
  - 📋 Purple = Community Projects
  - 🏢 Orange = Industry Partners

#### Network Tab
- Focus on researcher collaboration networks
- Simplified filters for network analysis
- Toggle between Paper Collaboration and Project Collaboration
- Limit collaborators display (5-50)
- Malaysia-only scope option

### 2. Interactive Filtering

**Overview Tab Filters:**
- Map Layers (toggle visibility)
- Search by name
- Filter by:
  - University
  - State
  - Project Type
  - Industry Sector
  - Partnership Type
  - Department
  - Collaboration Type

**Network Tab Filters:**
- Select University (required)
- Department (dependent on university)
- Search Researcher by Name
- Network Type checkboxes
- Collaborator Limit slider
- Malaysia-only toggle

### 3. Detailed Popups

Click on any marker to view detailed information:

#### University Popup
- University name and location
- Researcher count
- Active projects
- Publications
- Industry citations
- Top research area
- Departments list
- "View Full Details" button

#### Project Popup
- Project name and type
- Location and status (Active/Planning/Completed)
- Description
- Timeline (start/end dates)
- Budget
- Lead researcher
- University partner
- Collaboration type
- "View Full Project Details" button

#### Industry Partner Popup
- Company name and type
- Location and sector
- Description
- Number of university partners
- Active collaborations
- Funding provided
- Specialization
- Partnership tags
- List of partner universities
- "View Company Profile" button

### 4. University Rankings Table

- Sortable columns (click headers)
- Columns:
  - Rank (🥇 🥈 🥉 for top 3)
  - University
  - State
  - Researchers
  - Projects
  - Publications
  - Citations
- Responsive design
- Hover effects

### 5. Statistics Bar

Real-time statistics showing:
- Universities Tracked
- Researchers in View
- Projects in View
- Top Research Area
- Most Active State

## Technical Implementation

### Components

1. **Index.jsx** - Main page component with state management
2. **MapView.jsx** - Leaflet map integration
3. **FilterSidebar.jsx** - Dynamic filtering controls
4. **StatisticsBar.jsx** - Statistics display
5. **RankingsTable.jsx** - Sortable table
6. **UniversityPopup.jsx** - University details modal
7. **ProjectPopup.jsx** - Project details modal
8. **IndustryPopup.jsx** - Industry partner details modal

### Data

All data is stored in:
- `resources/js/Data/networkMapData.js`

Contains realistic dummy data for:
- 13 Malaysian universities
- 18 community projects
- 15 industry partners

### Key Technologies

- **Leaflet** - Interactive mapping library
- **React + Inertia.js** - Frontend framework
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Shadcn UI** - Form components

## Demo Data Highlights

### Universities
All major Malaysian universities including:
- UTM (Johor) - 342 researchers, AI & IoT Systems
- UM (KL) - 456 researchers, Medical Research
- UPM (Selangor) - 298 researchers, Agriculture & Food Tech
- USM (Penang) - 312 researchers, Materials Science
- And 9 more...

### Community Projects
Diverse projects across Malaysia:
- Watershed Management (Kelantan)
- Urban Farming Initiative (KL)
- Digital Literacy Program (Sabah)
- Renewable Energy Village (Perak)
- Marine Conservation Hub (Terengganu)
- And 13 more...

### Industry Partners
Various sectors represented:
- EdTech - Digital Education Hub
- Green Tech - GreenTech Solutions
- Healthcare - MedTech Innovations
- Agriculture - AgroTech Malaysia
- AI - AI Research Consortium
- And 10 more...

## Usage Tips

1. **Start with Overview Tab** to see the big picture
2. **Use Map Layers** to toggle visibility of different entity types
3. **Filter by State** to focus on specific regions
4. **Click Markers** to see detailed information
5. **Sort Rankings Table** to compare universities
6. **Switch to Network Tab** for collaboration insights
7. **Use Reset Filters** to start fresh

## Future Enhancements (Phase 2)

- Network collaboration lines visualization
- Real-time data integration
- Advanced network analytics
- Export data functionality
- More detailed filtering options
- Integration with existing AI Matching system

## Notes for Demo

- All data is realistic dummy data for demonstration purposes
- Coordinates are accurate for Malaysian locations
- Data includes realistic statistics and relationships
- All filters are functional
- UI is fully responsive
- Dark mode supported
- Animations included for better UX

## Troubleshooting

If the map doesn't load:
1. Check that Leaflet CSS is imported
2. Verify internet connection (for map tiles)
3. Check browser console for errors
4. Ensure `npm run build` was successful

## Related Files

- **Route**: `routes/web.php` (line 357-359)
- **Sidebar**: `resources/js/Components/Sidebar.jsx` (line 131-136)
- **Components**: `resources/js/Pages/NetworkMap/`
- **Data**: `resources/js/Data/networkMapData.js`
