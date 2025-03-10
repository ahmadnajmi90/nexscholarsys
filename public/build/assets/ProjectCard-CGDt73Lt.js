import{r,j as t,a as F,R as P}from"./app-OyJITDQ0.js";import{F as x}from"./FilterDropdown-AM7PdNq8.js";import"./react-select.esm-DJemSLts.js";const _=({projects:a})=>{const[o,y]=r.useState([]),[n,f]=r.useState([]),[d,w]=r.useState([]),[l,c]=r.useState(1),[p,g]=r.useState(!1),h=9,v=[...new Set(a.flatMap(e=>Array.isArray(e.purpose)?e.purpose:[e.purpose]))].filter(Boolean).map(e=>({value:e,label:e})),j=[...new Set(a.map(e=>e.origin_country))].filter(Boolean).map(e=>({value:e,label:e})),N=[...new Set(a.flatMap(e=>e.project_theme||[]))].filter(Boolean).map(e=>({value:e,label:e})),b=a.filter(e=>{const s=Array.isArray(e.purpose)?e.purpose:[e.purpose],u=o.length===0||o.some(m=>s.includes(m)),C=n.length===0||n.includes(e.origin_country),S=d.length===0||e.project_theme&&e.project_theme.some(m=>d.includes(m));return u&&C&&S}),i=Math.ceil(b.length/h),k=b.slice((l-1)*h,l*h);return t.jsxs("div",{className:"min-h-screen flex",children:[t.jsx("button",{onClick:()=>g(!p),className:"fixed top-20 right-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow-lg lg:hidden",children:t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-6 w-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 14.414V19a1 1 0 01-1 1h-2a1 1 0 01-1-1v-4.586L3.293 6.707A1 1 0 013 6V4z"})})}),t.jsxs("div",{className:`fixed lg:relative top-0 left-0 lg:block lg:w-1/4 w-3/4 h-full bg-gray-100 border-r rounded-lg p-4 transition-transform duration-300 z-50 ${p?"translate-x-0":"-translate-x-full"} lg:translate-x-0`,children:[t.jsxs("h2",{className:"text-lg font-semibold mb-4 flex justify-between items-center",children:["Filters",t.jsx("button",{onClick:()=>g(!1),className:"text-gray-600 lg:hidden",children:"✕"})]}),t.jsx(x,{label:"Purpose",options:v,selectedValues:o,setSelectedValues:y}),t.jsx(x,{label:"Country",options:j,selectedValues:n,setSelectedValues:f}),t.jsx(x,{label:"Project Theme",options:N,selectedValues:d,setSelectedValues:w})]}),t.jsxs("div",{className:"flex-1 py-6 sm:py-4 lg:py-0 px-4",children:[t.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",children:k.map((e,s)=>t.jsxs("div",{className:"bg-white rounded-lg shadow-md overflow-hidden text-center pb-8",children:[t.jsx("img",{src:e.image?`/storage/${e.image}`:"/storage/default.jpg",alt:e.title,className:"w-full h-auto md:h-48 object-cover"}),t.jsxs("div",{className:"p-8",children:[t.jsx("h2",{className:"text-xl font-semibold text-gray-800 text-center truncate",style:{maxWidth:"100%"},title:e.title,children:e.title}),t.jsx("p",{className:"text-gray-600 mt-4 text-center font-extralight",style:{maxWidth:"100%",overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"},dangerouslySetInnerHTML:{__html:e.description||"No description available."}})]}),t.jsx(F,{href:route("projects.show",e.url),className:"inline-block rounded-full border border-gray-300 px-7 py-2 text-base font-medium text-body-color transition hover:border-primary hover:bg-primary hover:text-dark",children:"View Details"})]},s))}),t.jsxs("div",{className:"flex justify-center mt-6 space-x-2 items-center",children:[t.jsx("button",{onClick:()=>c(e=>Math.max(e-1,1)),disabled:l===1,className:"px-4 py-2 border rounded bg-white text-gray-700 hover:bg-gray-200 disabled:opacity-50",children:"◄"}),Array.from({length:i},(e,s)=>s+1).filter(e=>e===1||e===i||Math.abs(e-l)<=1).map((e,s,u)=>t.jsxs(P.Fragment,{children:[s>0&&e-u[s-1]>1&&t.jsx("span",{className:"px-2",children:"..."}),t.jsx("button",{onClick:()=>c(e),className:`px-4 py-2 border rounded ${l===e?"bg-blue-500 text-white":"bg-white text-gray-700"}`,children:e})]},e)),t.jsx("button",{onClick:()=>c(e=>Math.min(e+1,i)),disabled:l===i,className:"px-4 py-2 border rounded bg-white text-gray-700 hover:bg-gray-200 disabled:opacity-50",children:"►"})]})]})]})};export{_ as default};
