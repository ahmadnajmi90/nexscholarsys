import{r as g,j as e,a as d,R as v}from"./app-D8rD0SG2.js";import{k as y,C as w,D as _,E as k,G as C,H as A}from"./index-D0UMKqBr.js";const E=({academician:a,university:i,faculty:m,user:F,publications:n,scholarProfile:l,researchOptions:P})=>{const[r,o]=g.useState(1),[b,p]=g.useState({}),h=10,x=Math.ceil(n.length/h),N=n.slice((r-1)*h,r*h),u=n.reduce((s,t)=>{const c=t.year||"Unknown";return s[c]=(s[c]||0)+1,s},{}),j=Object.entries(u).sort(([s],[t])=>s==="Unknown"?1:t==="Unknown"?-1:parseInt(t)-parseInt(s)),f=s=>{p(t=>({...t,[s]:!t[s]}))};return e.jsxs("div",{className:"max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8",children:[e.jsx("div",{className:"absolute top-[2rem] left-6 md:top-[3rem] md:left-[20.2rem] z-10",children:e.jsx(d,{onClick:()=>window.history.back(),className:"flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors",children:e.jsx(y,{className:"text-xl"})})}),e.jsxs("div",{className:"bg-white shadow overflow-hidden sm:rounded-lg mb-4 sm:mb-6",children:[e.jsxs("div",{className:"relative h-48 sm:h-64",children:[e.jsx("img",{src:a.background_image?`/storage/${a.background_image}`:"/storage/profile_background_images/default.jpg",alt:"Background",className:"w-full h-full object-cover"}),e.jsx("div",{className:"absolute -bottom-16 left-4 sm:left-8",children:e.jsx("img",{src:a.profile_picture?`/storage/${a.profile_picture}`:"/images/default-avatar.jpg",alt:a.full_name,className:"w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover"})})]}),e.jsxs("div",{className:"px-4 sm:px-8 pt-20 pb-4 sm:pb-6",children:[e.jsx("h1",{className:"text-2xl sm:text-3xl font-bold text-gray-900",children:a.full_name}),a.current_position&&e.jsx("p",{className:"text-base sm:text-lg text-gray-600 mt-1",children:a.current_position}),e.jsx("div",{className:"mt-2 flex flex-wrap items-center text-gray-500",children:e.jsxs("p",{className:"text-sm sm:text-base",children:[i==null?void 0:i.full_name," - ",m==null?void 0:m.name]})})]})]}),e.jsx("div",{className:"border-b border-gray-300 mb-6",children:e.jsxs("div",{className:"flex md:space-x-12 space-x-4 px-4 sm:px-8",children:[e.jsx(d,{href:route("academicians.show",a.url),className:"md:text-lg text-base font-semibold text-gray-600 hover:text-blue-600 pb-2",children:"Profile"}),e.jsx(d,{href:route("academicians.publications",a.url),className:"md:text-lg text-base font-semibold text-blue-600 hover:text-blue-800 border-b-2 border-blue-600 pb-2",children:"Publications"}),e.jsx(d,{href:route("academicians.projects",a.url),className:"md:text-lg text-base font-semibold text-gray-600 hover:text-blue-600 pb-2",children:"Projects"}),e.jsx(d,{href:"#",className:"md:text-lg text-base font-semibold text-gray-600 hover:text-blue-600 pb-2",children:"Supervisors"})]})}),e.jsx("div",{className:"min-h-screen",children:e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-4 gap-6",children:[e.jsxs("div",{className:"lg:col-span-1",children:[e.jsxs("div",{className:"bg-white shadow rounded-lg p-4 mb-6",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Overview"}),l?e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium text-gray-500",children:"Total Citations"}),e.jsx("p",{className:"text-xl font-semibold",children:l.total_citations})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium text-gray-500",children:"h-index"}),e.jsx("p",{className:"text-xl font-semibold",children:l.h_index})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium text-gray-500",children:"i10-index"}),e.jsx("p",{className:"text-xl font-semibold",children:l.i10_index})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium text-gray-500",children:"Last Updated"}),e.jsx("p",{className:"text-sm text-gray-700",children:l.last_scraped_at?new Date(l.last_scraped_at).toLocaleDateString():"Not available"})]})]}):e.jsx("p",{className:"text-gray-500",children:"Scholar profile information not available"})]}),e.jsxs("div",{className:"bg-white shadow rounded-lg p-4",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Publications by Year"}),j.length>0?e.jsx("div",{className:"space-y-2",children:j.map(([s,t])=>e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-gray-700",children:s}),e.jsx("span",{className:"bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium",children:t})]},s))}):e.jsx("p",{className:"text-gray-500",children:"No publication data available"})]})]}),e.jsx("div",{className:"lg:col-span-3",children:e.jsxs("div",{className:"bg-white shadow rounded-lg p-6",children:[e.jsxs("div",{className:"flex justify-between items-center mb-6",children:[e.jsx("h2",{className:"text-xl font-semibold",children:"Publications"}),a.google_scholar&&e.jsxs("a",{href:a.google_scholar,target:"_blank",rel:"noopener noreferrer",className:"flex items-center text-blue-600 hover:text-blue-800 text-sm",children:[e.jsx("span",{className:"mr-2",children:"View on Google Scholar"}),e.jsx(w,{})]})]}),n.length===0?e.jsxs("div",{className:"text-center py-10",children:[e.jsx("h3",{className:"text-xl font-medium text-gray-700 mb-2",children:"No Publications Found"}),e.jsx("p",{className:"text-gray-500",children:"This academician has no recorded publications yet."})]}):e.jsx("div",{className:"space-y-8",children:N.map((s,t)=>e.jsxs("div",{className:"border-b pb-6 last:border-0 last:pb-0",children:[e.jsx("h3",{className:"text-lg font-semibold text-blue-800 hover:text-blue-600 mb-2",children:s.url?e.jsx("a",{href:s.url,target:"_blank",rel:"noopener noreferrer",className:"hover:underline",children:s.title}):s.title}),e.jsx("div",{className:"text-sm text-gray-600 mb-2",children:s.authors}),e.jsxs("div",{className:"flex items-center text-sm text-gray-700 mb-3",children:[e.jsx("span",{className:"font-medium",children:s.venue}),s.year&&e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"mx-2",children:"•"}),e.jsx("span",{children:s.year})]})]}),e.jsxs("div",{className:"flex items-center space-x-4 text-sm",children:[s.citations>0&&e.jsxs("div",{className:"flex items-center text-gray-600",children:[e.jsx(_,{className:"mr-2 text-xs"}),e.jsxs("span",{children:["Cited by ",s.citations]})]}),s.abstract&&e.jsxs("button",{onClick:()=>f(s.id),className:"flex items-center text-gray-600 hover:text-blue-600",children:[e.jsx(k,{className:"mr-2 text-xs"}),e.jsx("span",{children:"Abstract"}),b[s.id]?e.jsx(C,{className:"ml-1 text-xs"}):e.jsx(A,{className:"ml-1 text-xs"})]})]}),s.abstract&&b[s.id]&&e.jsxs("div",{className:"mt-3 p-3 bg-gray-50 rounded-md text-sm text-gray-700",children:[e.jsx("h4",{className:"font-semibold mb-2",children:"Abstract"}),e.jsx("p",{children:s.abstract})]})]},t))}),x>1&&e.jsxs("div",{className:"flex justify-center mt-8 space-x-2 items-center",children:[e.jsx("button",{onClick:()=>o(s=>Math.max(s-1,1)),disabled:r===1,className:"px-4 py-2 border rounded bg-white text-gray-700 hover:bg-gray-200 disabled:opacity-50",children:"◄"}),Array.from({length:x},(s,t)=>t+1).filter(s=>s===1||s===x||Math.abs(s-r)<=1).map((s,t,c)=>e.jsxs(v.Fragment,{children:[t>0&&s-c[t-1]>1&&e.jsx("span",{className:"px-2",children:"..."}),e.jsx("button",{onClick:()=>o(s),className:`px-4 py-2 border rounded ${r===s?"bg-blue-500 text-white":"bg-white text-gray-700"}`,children:s})]},s)),e.jsx("button",{onClick:()=>o(s=>Math.min(s+1,x)),disabled:r===x,className:"px-4 py-2 border rounded bg-white text-gray-700 hover:bg-gray-200 disabled:opacity-50",children:"►"})]})]})})]})})]})};export{E as default};
