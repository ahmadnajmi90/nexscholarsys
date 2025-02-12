import{q as i,r as x,j as e,a as s}from"./app-DJ9s8MLZ.js";import{M as h}from"./MainLayout-DETdi-Di.js";import{u as m}from"./useRoles-B7XX5FYG.js";import"./index-CpRu6ZXN.js";const g=()=>{const{createPosts:l,search:c}=i().props;m();const[d,o]=x.useState(c||"");let r;const n=t=>{const a=t.target.value;o(a),r&&clearTimeout(r),r=setTimeout(()=>{document.getElementById("search-form").submit()},300)};return e.jsxs(h,{title:"",children:[e.jsxs("div",{className:"flex justify-between items-center mb-4",children:[e.jsx("h1",{className:"text-2xl font-semibold",children:"Your Posts"}),e.jsx(s,{href:route("create-posts.create"),className:"px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600",children:"Add New Post"})]}),e.jsx("div",{className:"mb-4",children:e.jsx("form",{id:"search-form",method:"GET",action:route("create-posts.index"),children:e.jsx("input",{type:"text",name:"search",value:d,onChange:n,placeholder:"Search post...",className:"border rounded-lg px-4 py-2 w-full"})})}),e.jsx("div",{className:"overflow-x-auto bg-white rounded-lg shadow-md p-4",children:e.jsxs("table",{className:"min-w-full bg-white border",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"py-2 px-4 border-b",children:"Title"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"Category"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"Tags"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"Action"})]})}),e.jsx("tbody",{children:l.data.map(t=>e.jsxs("tr",{className:"border-b",children:[e.jsx("td",{className:"py-2 px-4 font-semibold text-center",children:t.title}),e.jsx("td",{className:"py-2 px-4 text-center",children:t.category}),e.jsx("td",{className:"py-2 px-4 text-center",children:t.tags&&Array.isArray(t.tags)?t.tags.join(", "):t.tags}),e.jsxs("td",{className:"py-2 px-4 text-center",children:[e.jsx(s,{href:route("create-posts.edit",t.id),className:"text-blue-500 hover:underline mr-2",children:"Edit"}),e.jsx(s,{href:route("create-posts.destroy",t.id),method:"delete",as:"button",className:"text-red-500 hover:underline",children:"Delete"})]})]},t.id))})]})}),e.jsx("div",{className:"mt-4 flex justify-center",children:l.links.map((t,a)=>e.jsx(s,{href:t.url,className:`mx-1 px-4 py-2 rounded ${t.active?"bg-blue-500 text-white":"bg-gray-200 text-gray-700 hover:bg-gray-300"}`,dangerouslySetInnerHTML:{__html:t.label}},a))})]})};export{g as default};
