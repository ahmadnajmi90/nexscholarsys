import{r as c,j as t,U as b}from"./app-DJ9s8MLZ.js";import{F as u}from"./FilterDropdown-GYuQMrMk.js";const p=({posts:d})=>{const[a,x]=c.useState([]),[r,i]=c.useState(1),o=9,m=[...new Set(d.map(e=>e.category))].filter(Boolean),n=d.filter(e=>a.length===0||a.includes(e.category)),l=Math.ceil(n.length/o),h=n.slice((r-1)*o,r*o);return t.jsxs("div",{className:"min-h-screen flex",children:[t.jsxs("div",{className:"w-full lg:w-1/4 p-4 bg-gray-100 border-r",children:[t.jsx("h2",{className:"text-lg font-semibold mb-4",children:"Filters"}),t.jsx(u,{label:"Category",options:m,selectedValues:a,setSelectedValues:x})]}),t.jsxs("div",{className:"flex-1 px-4",children:[t.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",children:h.map((e,s)=>t.jsxs("div",{className:"bg-white rounded-lg shadow-md overflow-hidden text-center pb-8",children:[t.jsx("img",{src:e.featured_image?`/storage/${e.featured_image}`:"/storage/default.jpg",alt:e.title,className:"w-full h-48 object-cover"}),t.jsxs("div",{className:"p-6",children:[t.jsx("h2",{className:"text-xl font-semibold text-gray-800 truncate",title:e.title,children:e.title}),t.jsx("p",{className:"text-gray-600 mt-4 text-center font-extralight",style:{maxWidth:"100%",overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"},dangerouslySetInnerHTML:{__html:e.content||"No content available."}})]}),t.jsx("div",{className:"px-4",children:t.jsx("a",{href:route("posts.show",e.url),className:"inline-block rounded-full border border-gray-300 px-7 py-2 text-base font-medium text-body-color transition hover:border-primary hover:bg-primary hover:text-dark",children:"View Details"})})]},s))}),t.jsxs("div",{className:"flex justify-center mt-6 space-x-2 items-center",children:[t.jsx("button",{onClick:()=>i(e=>Math.max(e-1,1)),disabled:r===1,className:"px-4 py-2 border rounded bg-white text-gray-700 hover:bg-gray-200 disabled:opacity-50",children:"◄"}),Array.from({length:l},(e,s)=>s+1).filter(e=>e===1||e===l||Math.abs(e-r)<=1).map((e,s,g)=>t.jsxs(b.Fragment,{children:[s>0&&e-g[s-1]>1&&t.jsx("span",{className:"px-2",children:"..."}),t.jsx("button",{onClick:()=>i(e),className:`px-4 py-2 border rounded ${r===e?"bg-blue-500 text-white":"bg-white text-gray-700"}`,children:e})]},e)),t.jsx("button",{onClick:()=>i(e=>Math.min(e+1,l)),disabled:r===l,className:"px-4 py-2 border rounded bg-white text-gray-700 hover:bg-gray-200 disabled:opacity-50",children:"►"})]})]})]})};export{p as default};
