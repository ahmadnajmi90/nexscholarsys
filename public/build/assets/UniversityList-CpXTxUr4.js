import{r as s,j as t}from"./app-ChsSQ4Ga.js";import{M as S}from"./MainLayout-ClqbEpvH.js";import{F as _,k,l as C,m as F,n as U}from"./index-CziZd4Rt.js";import{F as d}from"./FilterDropdown-B6bAlgjm.js";import{u as V}from"./useRoles-BrZDxiq8.js";import"./react-select.esm-BSyqdgGn.js";const q=({universities:l})=>{V();const[a,u]=s.useState([]),[o,h]=s.useState([]),[i,p]=s.useState([]),[n,f]=s.useState(1),[m,g]=s.useState(!1),c=9,b=[...new Set(l.map(e=>e.country))].filter(Boolean).map(e=>({value:e,label:e})),y=[...new Set(l.map(e=>e.university_type))].filter(Boolean).map(e=>({value:e,label:e})),j=[...new Set(l.map(e=>e.university_category))].filter(Boolean).map(e=>({value:e,label:e})),x=l.filter(e=>(a.length===0||a.includes(e.country))&&(o.length===0||o.includes(e.university_type))&&(i.length===0||i.includes(e.university_category))),v=Math.ceil(x.length/c),w=x.slice((n-1)*c,n*c),N=e=>{f(e)};return t.jsx(S,{title:"List of Universities",children:t.jsxs("div",{className:"min-h-screen flex",children:[t.jsx("button",{onClick:()=>g(!m),className:"fixed top-20 right-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow-lg lg:hidden",children:t.jsx(_,{className:"text-xl"})}),t.jsxs("div",{className:`fixed lg:relative top-0 left-0 lg:block lg:w-1/4 w-3/4 h-full bg-gray-100 border-r p-4 rounded-lg transition-transform duration-300 z-50 ${m?"translate-x-0":"-translate-x-full"} lg:translate-x-0`,children:[t.jsxs("h2",{className:"text-lg font-semibold mb-4 flex justify-between items-center",children:["Filters",t.jsx("button",{onClick:()=>g(!1),className:"text-gray-600 lg:hidden",children:"✕"})]}),t.jsx(d,{label:"Country",options:b,selectedValues:a,setSelectedValues:u}),t.jsx(d,{label:"University Type",options:y,selectedValues:o,setSelectedValues:h}),t.jsx(d,{label:"University Category",options:j,selectedValues:i,setSelectedValues:p})]}),t.jsxs("div",{className:"flex-1 py-6 sm:py-4 lg:py-0 px-4",children:[t.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6",children:w.map(e=>t.jsxs("div",{className:"bg-white shadow-md rounded-lg overflow-hidden relative",children:[t.jsx("div",{className:"h-32",children:t.jsx("img",{src:e.background_image?`/storage/${e.background_image}`:"/storage/university_background_images/default.jpg",alt:"University Banner",className:"object-cover w-full h-full"})}),t.jsx("div",{className:"flex justify-center -mt-12",children:t.jsx("div",{className:"relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg",children:t.jsx("img",{src:e.profile_picture?`/storage/${e.profile_picture}`:"/storage/university_profile_pictures/default.png",alt:"University Logo",className:"w-full h-full object-cover"})})}),t.jsxs("div",{className:"text-center mt-4",children:[t.jsx("h2",{className:"text-lg font-semibold mb-2 overflow-hidden truncate px-4",children:e.full_name}),t.jsx("p",{className:"text-gray-500 text-sm",children:e.country}),t.jsx("button",{onClick:()=>window.location.href=route("universities.faculties",{university:e.id}),className:"mt-2 bg-blue-500 text-white text-[10px] px-2 font-semibold py-1 rounded-full hover:bg-blue-600",children:"View"})]}),t.jsxs("div",{className:"flex justify-around items-center mt-6 py-4 border-t px-10",children:[t.jsx(k,{className:"text-gray-500 text-sm cursor-pointer hover:text-blue-700",title:"Copy Email"}),t.jsx("a",{href:e.google_scholar,target:"_blank",rel:"noopener noreferrer",className:"text-gray-500 text-sm hover:text-red-700",title:"Google Scholar",children:t.jsx(C,{})}),t.jsx("a",{href:e.website,target:"_blank",rel:"noopener noreferrer",className:"text-gray-500 text-sm hover:text-green-700",title:"Website",children:t.jsx(F,{})}),t.jsx("a",{href:e.linkedin,target:"_blank",rel:"noopener noreferrer",className:"text-gray-500 text-sm hover:text-blue-800",title:"LinkedIn",children:t.jsx(U,{})})]})]},e.id))}),t.jsx("div",{className:"flex justify-center mt-6 space-x-2",children:Array.from({length:v},(e,r)=>t.jsx("button",{onClick:()=>N(r+1),className:`px-4 py-2 border rounded ${n===r+1?"bg-blue-500 text-white":"bg-white text-gray-700"}`,children:r+1},r))})]})]})})};export{q as default};
