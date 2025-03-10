import{j as e,a}from"./app-OyJITDQ0.js";import{M as t}from"./MainLayout-CISuWve_.js";import{l as o,m as i,n as d,o as c}from"./index-BDflseub.js";import{u as n}from"./useRoles-CSvMmOe-.js";const f=({faculties:s,university:l})=>(n(),e.jsxs(t,{children:[e.jsxs("div",{className:"relative bg-gray-200",children:[e.jsx("div",{className:"w-full h-64 overflow-hidden",children:e.jsx("img",{src:l.background_image?`/storage/${l.background_image}`:"/storage/university_background_images/default.jpg",alt:"University Banner",className:"w-full h-full object-cover"})}),e.jsxs("div",{className:"absolute top-40 left-1/2 transform -translate-x-1/2 w-full max-w-4xl text-center",children:[e.jsx("div",{className:"inline-block w-32 h-32 rounded-full overflow-hidden border-4 border-white",children:e.jsx("img",{src:l.profile_picture?`/storage/${l.profile_picture}`:"/storage/university_profile_pictures/default.png",alt:"University Logo",className:"w-full h-full object-cover"})}),e.jsx("h1",{className:"mt-8 text-3xl font-bold text-gray-800",children:l.full_name})]})]}),e.jsx("div",{className:"mt-40 border-b border-gray-300",children:e.jsx("div",{className:"flex space-x-16 ml-8",children:e.jsx(a,{href:"#",className:"text-lg font-semibold text-blue-600 hover:text-blue-800 border-b-2 border-blue-600 pb-2",children:"Faculty"})})}),e.jsx("div",{className:"flex-1 px-8 mt-10",children:e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6",children:s.map(r=>e.jsxs("div",{className:"bg-white shadow-md rounded-lg overflow-hidden relative",children:[e.jsx("div",{className:"h-32",children:e.jsx("img",{src:`/storage/${l.background_image}`,alt:"Faculty Banner",className:"object-cover w-full h-full"})}),e.jsx("div",{className:"flex justify-center -mt-12",children:e.jsx("div",{className:"relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg",children:e.jsx("img",{src:`/storage/${l.profile_picture}`,alt:"Faculty Logo",className:"w-full h-full object-cover"})})}),e.jsxs("div",{className:"text-center mt-4",children:[e.jsx("h2",{className:"text-lg font-semibold px-4 mb-2 overflow-hidden truncate",children:r.name}),e.jsx("p",{className:"text-gray-500 text-sm mb-2",children:l.full_name}),e.jsx("button",{onClick:()=>window.location.href=route("faculties.academicians",{faculty:r.id}),className:"mt-2 bg-blue-500 text-white text-[10px] px-2 font-semibold py-1 rounded-full hover:bg-blue-600",children:"View"})]}),e.jsxs("div",{className:"flex justify-around items-center mt-6 py-4 border-t px-10",children:[e.jsx(o,{className:"text-gray-500 text-sm cursor-pointer hover:text-blue-700",title:"Copy Email"}),e.jsx("a",{href:r.google_scholar,target:"_blank",rel:"noopener noreferrer",className:"text-gray-500 text-sm hover:text-red-700",title:"Google Scholar",children:e.jsx(i,{})}),e.jsx("a",{href:r.website,target:"_blank",rel:"noopener noreferrer",className:"text-gray-500 text-sm hover:text-green-700",title:"Website",children:e.jsx(d,{})}),e.jsx("a",{href:r.linkedin,target:"_blank",rel:"noopener noreferrer",className:"text-gray-500 text-sm hover:text-blue-800",title:"LinkedIn",children:e.jsx(c,{})})]})]},r.id))})})]}));export{f as default};
