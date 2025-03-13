import{q as u,r as N,j as e,a}from"./app-BhS0diZf.js";import{M as f}from"./MainLayout-DRMHEAPw.js";import{u as p}from"./useRoles-ByLpIaUs.js";import{F as n,a as x,b as m}from"./index-Cj-RAQUO.js";import{F as h,a as o}from"./TrashIcon-DXfhtUL5.js";const j=r=>{const t=new Date(r);if(isNaN(t))return"";const c=String(t.getDate()).padStart(2,"0"),d=String(t.getMonth()+1).padStart(2,"0"),l=t.getFullYear();return`${c}/${d}/${l}`},F=()=>{const{createPosts:r,search:t}=u().props;p();const[c,d]=N.useState(t||"");let l;const b=s=>{const i=s.target.value;d(i),l&&clearTimeout(l),l=setTimeout(()=>{document.getElementById("search-form").submit()},300)};return e.jsx(f,{title:"",children:e.jsxs("div",{className:"max-w-7xl mx-auto px-4",children:[e.jsxs("div",{className:"flex justify-between items-center mb-4",children:[e.jsx("h1",{className:"text-2xl font-semibold",children:"Your Posts"}),e.jsx(a,{href:route("create-posts.create"),className:"px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600",children:"Add New Post"})]}),e.jsx("div",{className:"mb-4",children:e.jsx("form",{id:"search-form",method:"GET",action:route("create-posts.index"),children:e.jsx("input",{type:"text",name:"search",value:c,onChange:b,placeholder:"Search post...",className:"border rounded-lg px-4 py-2 w-full"})})}),e.jsx("div",{className:"hidden md:block overflow-x-auto bg-white rounded-lg shadow-md p-4",children:e.jsxs("table",{className:"min-w-full bg-white border",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"py-2 px-4 border-b",children:"Title"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"Category"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"Date of Published"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"Statistics"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"Actions"})]})}),e.jsx("tbody",{children:r.data.map(s=>e.jsxs("tr",{className:"border-b",children:[e.jsx("td",{className:"py-2 px-4 font-semibold text-center",children:s.title}),e.jsx("td",{className:"py-2 px-4 text-center",children:s.category}),e.jsx("td",{className:"py-2 px-4 text-center",children:j(s.created_at)}),e.jsx("td",{className:"py-2 px-4 text-center",children:e.jsxs("div",{className:"flex justify-center space-x-2 items-center",children:[e.jsxs("div",{className:"flex items-center",children:[e.jsx(n,{className:"w-5 h-5 text-gray-600"}),e.jsx("span",{className:"ml-1",children:s.total_views})]}),e.jsxs("div",{className:"flex items-center",children:[e.jsx(x,{className:"w-5 h-5 text-red-600"}),e.jsx("span",{className:"ml-1",children:s.total_likes})]}),e.jsxs("div",{className:"flex items-center",children:[e.jsx(m,{className:"w-5 h-5 text-blue-600"}),e.jsx("span",{className:"ml-1",children:s.total_shares})]})]})}),e.jsxs("td",{className:"py-2 px-4 text-center",children:[e.jsx(a,{href:route("create-posts.edit",s.id),title:"Edit",className:"inline-block mr-2",children:e.jsx("div",{className:"w-8 h-8 bg-blue-100 text-blue-500 hover:bg-blue-200 flex items-center justify-center rounded",children:e.jsx(h,{className:"w-5 h-5"})})}),e.jsx(a,{href:route("create-posts.destroy",s.id),method:"delete",as:"button",title:"Delete",className:"inline-block",children:e.jsx("div",{className:"w-8 h-8 bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center rounded",children:e.jsx(o,{className:"w-5 h-5"})})})]})]},s.id))})]})}),e.jsx("div",{className:"md:hidden",children:r.data.map(s=>e.jsxs("div",{className:"bg-white rounded-lg shadow-md p-4 mb-4",children:[e.jsx("h2",{className:"text-lg font-semibold mb-2",children:s.title}),e.jsxs("p",{className:"text-sm text-gray-500",children:["Category: ",s.category]}),e.jsxs("p",{className:"text-sm text-gray-500",children:["Published: ",j(s.created_at)]}),e.jsxs("p",{className:"text-sm text-gray-500 flex items-center space-x-2",children:[e.jsx("span",{children:"Statistics:"}),e.jsxs("span",{className:"flex items-center",children:[e.jsx(n,{className:"w-4 h-4 mr-1"})," ",s.total_views]}),e.jsxs("span",{className:"flex items-center",children:[e.jsx(x,{className:"w-4 h-4 mr-1 text-red-600"})," ",s.total_likes]}),e.jsxs("span",{className:"flex items-center",children:[e.jsx(m,{className:"w-4 h-4 mr-1"})," ",s.total_shares]})]}),e.jsxs("div",{className:"mt-2 flex space-x-4",children:[e.jsx(a,{href:route("create-posts.edit",s.id),title:"Edit",className:"inline-block",children:e.jsx("div",{className:"w-8 h-8 bg-blue-100 text-blue-500 hover:bg-blue-200 flex items-center justify-center rounded",children:e.jsx(h,{className:"w-5 h-5"})})}),e.jsx(a,{href:route("create-posts.destroy",s.id),method:"delete",as:"button",title:"Delete",className:"inline-block",children:e.jsx("div",{className:"w-8 h-8 bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center rounded",children:e.jsx(o,{className:"w-5 h-5"})})})]})]},s.id))}),e.jsx("div",{className:"mt-4 flex justify-center",children:r.links.map((s,i)=>e.jsx(a,{href:s.url,className:`mx-1 px-4 py-2 rounded ${s.active?"bg-blue-500 text-white":"bg-gray-200 text-gray-700 hover:bg-gray-300"}`,dangerouslySetInnerHTML:{__html:s.label}},i))})]})})};export{F as default};
