import{j as e,a as t}from"./app-OyJITDQ0.js";import{P as u}from"./ProfileCard-BRbwPFyb.js";import{M as c}from"./MainLayout-CISuWve_.js";import{u as m}from"./useRoles-CSvMmOe-.js";import"./FilterDropdown-AM7PdNq8.js";import"./react-select.esm-DJemSLts.js";import"./index-BDflseub.js";const j=({undergraduates:s,faculties:l,researchOptions:i,universities:o,faculty:r,university:a,users:d})=>(m(),e.jsxs(c,{title:"Undergraduate List",children:[e.jsxs("div",{className:"relative bg-gray-200",children:[e.jsx("div",{className:"w-full h-64 overflow-hidden",children:e.jsx("img",{src:`/storage/${a.background_image}`,alt:"Faculty Banner",className:"w-full h-full object-cover"})}),e.jsxs("div",{className:"absolute top-40 left-1/2 transform -translate-x-1/2 w-full max-w-4xl text-center",children:[e.jsx("div",{className:"inline-block w-32 h-32 rounded-full overflow-hidden border-4 border-white",children:e.jsx("img",{src:`/storage/${a.profile_picture}`,alt:"Faculty Logo",className:"w-full h-full object-cover"})}),e.jsx("h1",{className:"mt-8 text-3xl font-bold text-gray-800",children:r.name})]})]}),e.jsx("div",{className:"mt-40 border-b border-gray-300 mb-10",children:e.jsxs("div",{className:"flex space-x-16 ml-8",children:[e.jsx(t,{href:route("faculties.academicians",r.id),className:"text-lg font-semibold text-gray-600 hover:text-blue-600 pb-2",children:"Academician"}),e.jsx(t,{href:route("faculties.postgraduates",r.id),className:"text-lg font-semibold text-gray-600 hover:text-blue-600 pb-2",children:"Postgraduate"}),e.jsx(t,{href:route("faculties.undergraduates",r.id),className:"text-lg font-semibold text-blue-600 hover:text-blue-800 border-b-2 border-blue-600 pb-2",children:"Undergraduate"})]})}),e.jsx(u,{profilesData:s,supervisorAvailabilityKey:"supervisorAvailability",universitiesList:o,isFacultyAdminDashboard:!0,faculties:l,isPostgraduateList:!0,isUndergraduateList:!0,users:d,researchOptions:i})]}));export{j as default};
