import{q as g,j as e,a as r}from"./app-Z0SdsPrn.js";import{M as u}from"./MainLayout-BDF2aQz6.js";import{a as j}from"./index-DuZY369W.js";import{u as f}from"./useRoles-DSG0Uccd.js";function v(){const{post:s,previous:l,next:d,academicians:i,postgraduates:o,undergraduates:m}=g().props,{isAcademician:c,isPostgraduate:x,isUndergraduate:h}=f(),t=c&&i&&i.find(a=>a.academician_id===s.author_id)||x&&o&&o.find(a=>a.postgraduate_id===s.author_id)||h&&m&&m.find(a=>a.undergraduate_id===s.author_id)||null;return e.jsxs(u,{children:[e.jsx("div",{className:"absolute top-[1.8rem] left-2 md:top-[5.5rem] md:left-[19.5rem] z-50",children:e.jsx(r,{href:route("posts.index"),className:"flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600",children:e.jsx(j,{className:"text-lg md:text-xl"})})}),e.jsxs("div",{className:"px-10 md:px-16",children:[e.jsxs("div",{className:"max-w-8xl mx-auto py-6",children:[e.jsx("h1",{className:"text-2xl md:text-3xl font-bold mb-4 text-left",children:s.title}),t?e.jsxs("div",{className:"flex items-center gap-4 mb-4",children:[e.jsx("img",{src:`/storage/${t.profile_picture}`,alt:t.full_name,className:"w-12 h-12 rounded-full object-cover shadow-md bg-gray-200 border-2 border-white"}),e.jsxs("div",{children:[e.jsx("div",{className:"text-lg font-semibold",children:t.full_name}),e.jsx("div",{className:"text-gray-500",children:new Date(s.created_at).toLocaleDateString()})]})]}):e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx("img",{src:"/storage/Admin.jpg",alt:"Admin",className:"w-12 h-12 rounded-full object-cover shadow-md border-2 border-white"}),e.jsxs("div",{children:[e.jsx("div",{className:"text-lg font-semibold",children:"Admin"}),e.jsx("div",{className:"text-gray-500",children:new Date(s.created_at).toLocaleDateString()})]})]}),s.featured_image&&e.jsx("img",{src:`/storage/${s.featured_image}`,alt:"Banner",className:"w-full h-auto md:h-64 object-cover mb-4"}),e.jsx("div",{className:"mb-4 text-gray-700 prose w-full text-justify max-w-none",dangerouslySetInnerHTML:{__html:s.content}}),e.jsxs("p",{className:"mb-2",children:[e.jsx("span",{className:"font-semibold",children:"Category:"})," ",s.category]}),e.jsxs("p",{className:"mb-2",children:[e.jsx("span",{className:"font-semibold",children:"Tags:"})," ",Array.isArray(s.tags)?s.tags.join(", "):s.tags]}),s.attachment&&e.jsxs("p",{className:"mb-2",children:[e.jsx("span",{className:"font-semibold",children:"Attachment:"}),e.jsx("a",{href:`/storage/${s.attachment}`,target:"_blank",rel:"noopener noreferrer",className:"ml-2 text-blue-500 underline",children:"View Attachment"})]}),s.images&&e.jsxs("div",{className:"mt-4",children:[e.jsx("h2",{className:"text-xl font-bold mb-2",children:"Gallery"}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4",children:JSON.parse(s.images).map((a,n)=>e.jsx("div",{className:"bg-white rounded-lg shadow-md overflow-hidden",children:e.jsx("img",{src:`/storage/${a}`,alt:`Gallery image ${n+1}`,className:"w-full h-auto md:h-32 object-cover"})},n))})]})]}),e.jsxs("div",{className:"max-w-3xl mx-auto py-6 flex justify-between",children:[l?e.jsx(r,{href:route("posts.show",l.url),className:"px-4 py-2 bg-gray-200 rounded hover:bg-gray-300",children:"Previous"}):e.jsx("span",{}),d?e.jsx(r,{href:route("posts.show",d.url),className:"px-4 py-2 bg-gray-200 rounded hover:bg-gray-300",children:"Next"}):e.jsx("span",{})]})]})]})}export{v as default};
