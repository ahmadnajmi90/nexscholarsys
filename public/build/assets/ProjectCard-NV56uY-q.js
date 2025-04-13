import{r as c,j as t,a as F,R as P}from"./app-DtwGMIw6.js";import{F as f}from"./FilterDropdown-wg4oi9tF.js";import"./purify.es-B2xYLbnv.js";import"./react-select.esm-DgFzKhvI.js";const T=({html:l,maxLength:i=100,className:u})=>{if(!l)return t.jsx("p",{className:u,children:"No content available"});const o=l.replace(/<[^>]*>/g,""),h=o.length>i?o.substring(0,i)+"...":o;return t.jsx("p",{className:u,children:h})},L=({projects:l})=>{const[i,u]=c.useState([]),[o,h]=c.useState([]),[m,j]=c.useState([]),[n,p]=c.useState(1),[y,w]=c.useState(!1),b=9,k=[...new Set(l.flatMap(e=>Array.isArray(e.purpose)?e.purpose:[e.purpose]))].filter(Boolean).map(e=>({value:e,label:e})),N=[...new Set(l.map(e=>e.origin_country))].filter(Boolean).map(e=>({value:e,label:e})),C=[...new Set(l.flatMap(e=>e.project_theme||[]))].filter(Boolean).map(e=>({value:e,label:e})),v=l.filter(e=>{const r=Array.isArray(e.purpose)?e.purpose:[e.purpose],d=i.length===0||i.some(a=>r.includes(a)),g=o.length===0||o.includes(e.origin_country),s=m.length===0||m.includes(e.project_theme);return d&&g&&s}),x=Math.ceil(v.length/b),S=v.slice((n-1)*b,n*b);return t.jsxs("div",{className:"min-h-screen flex",children:[t.jsx("button",{onClick:()=>w(!y),className:"fixed top-20 right-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow-lg lg:hidden",children:t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-6 w-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 14.414V19a1 1 0 01-1 1h-2a1 1 0 01-1-1v-4.586L3.293 6.707A1 1 0 013 6V4z"})})}),t.jsxs("div",{className:`fixed lg:relative top-0 left-0 lg:block lg:w-1/4 w-3/4 h-full bg-gray-100 border-r rounded-lg p-4 transition-transform duration-300 z-50 ${y?"translate-x-0":"-translate-x-full"} lg:translate-x-0`,children:[t.jsxs("h2",{className:"text-lg font-semibold mb-4 flex justify-between items-center",children:["Filters",t.jsx("button",{onClick:()=>w(!1),className:"text-gray-600 lg:hidden",children:"✕"})]}),t.jsx(f,{label:"Purpose",options:k,selectedValues:i,setSelectedValues:u}),t.jsx(f,{label:"Country",options:N,selectedValues:o,setSelectedValues:h}),t.jsx(f,{label:"Project Theme",options:C,selectedValues:m,setSelectedValues:j})]}),t.jsxs("div",{className:"flex-1 py-6 sm:py-4 lg:py-0 px-4",children:[t.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",children:S.map((e,r)=>t.jsxs("div",{className:"bg-white rounded-lg shadow-md overflow-hidden text-center pb-8 relative",children:[t.jsx("img",{src:e.image?`/storage/${e.image}`:"/storage/default.jpg",alt:e.title,className:"w-full h-48 object-cover"}),t.jsx("div",{className:"absolute top-2 left-2 flex flex-wrap gap-2",children:Array.isArray(e.purpose)?e.purpose.map((d,g)=>{let s="",a="bg-blue-500";switch(d){case"For Showcase":s="Showcase",a="bg-purple-500";break;case"Seek for Postgraduate":s="Grant for Postgraduate",a="bg-green-500";break;case"Seek for Undergraduate":s="Grant for Undergraduate",a="bg-yellow-500";break;case"Seek for Academician Collaboration":s="Academician Collaboration",a="bg-indigo-500";break;case"Seek for Industrial Collaboration":s="Industry Collaboration",a="bg-orange-500";break;default:s=d}return t.jsx("span",{className:`${a} text-white text-xs font-semibold px-2 py-1 rounded`,children:s},g)}):t.jsx("span",{className:"bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded",children:e.purpose})}),t.jsxs("div",{className:"p-8",children:[t.jsx("h2",{className:"text-lg font-semibold text-gray-800 text-center truncate",style:{maxWidth:"100%"},title:e.title,children:e.title}),t.jsx("p",{className:"text-gray-600 h-12 mt-4 text-center font-extralight",style:{maxWidth:"100%",overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"},children:t.jsx(T,{html:e.description||"No description available.",maxLength:100})})]}),t.jsx(F,{href:route("projects.show",e.url),className:"inline-block rounded-full border border-gray-300 px-7 py-2 text-base font-medium text-body-color transition hover:border-primary hover:bg-primary hover:text-dark",children:"View Details"})]},r))}),t.jsxs("div",{className:"flex justify-center mt-6 space-x-2 items-center",children:[t.jsx("button",{onClick:()=>p(e=>Math.max(e-1,1)),disabled:n===1,className:"px-4 py-2 border rounded bg-white text-gray-700 hover:bg-gray-200 disabled:opacity-50",children:"◄"}),Array.from({length:x},(e,r)=>r+1).filter(e=>e===1||e===x||Math.abs(e-n)<=1).map((e,r,d)=>t.jsxs(P.Fragment,{children:[r>0&&e-d[r-1]>1&&t.jsx("span",{className:"px-2",children:"..."}),t.jsx("button",{onClick:()=>p(e),className:`px-4 py-2 border rounded ${n===e?"bg-blue-500 text-white":"bg-white text-gray-700"}`,children:e})]},e)),t.jsx("button",{onClick:()=>p(e=>Math.min(e+1,x)),disabled:n===x,className:"px-4 py-2 border rounded bg-white text-gray-700 hover:bg-gray-200 disabled:opacity-50",children:"►"})]})]})]})};export{L as default};
