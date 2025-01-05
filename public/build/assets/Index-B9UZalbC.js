import{q as x,r as i,j as e,a as t}from"./app-DEz1GiSY.js";import{M as h}from"./MainLayout-B4TFnIW4.js";import{u as m}from"./useRoles-DxDeXZwp.js";import"./index-DK5oFF98.js";const N=()=>{const{postProjects:r,search:d}=x().props;m();const[c,o]=i.useState(d||"");console.log(r);let a;const n=s=>{const l=s.target.value;o(l),a&&clearTimeout(a),a=setTimeout(()=>{document.getElementById("search-form").submit()},300)};return e.jsxs(h,{title:"",children:[e.jsxs("div",{className:"flex justify-between items-center mb-4",children:[e.jsx("h1",{className:"text-2xl font-semibold",children:"Your Projects"}),e.jsx(t,{href:route("post-projects.create"),className:"px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600",children:"Add New Project"})]}),e.jsx("div",{className:"mb-4",children:e.jsx("form",{id:"search-form",method:"GET",action:route("post-projects.index"),children:e.jsx("input",{type:"text",name:"search",value:c,onChange:n,placeholder:"Search projects...",className:"border rounded-lg px-4 py-2 w-full"})})}),e.jsx("div",{className:"overflow-x-auto bg-white rounded-lg shadow-md p-4",children:e.jsxs("table",{className:"min-w-full bg-white border",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"py-2 px-4 border-b",children:"Title"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"Purpose"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"Category"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"Sponsored By"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"Start Date"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"End Date"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"Status"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"Actions"})]})}),e.jsx("tbody",{children:r.data.map(s=>e.jsxs("tr",{className:"border-b",children:[e.jsx("td",{className:"py-2 px-4 font-semibold text-center",children:s.title}),e.jsx("td",{className:"py-2 px-4 text-center",children:Array.isArray(s.purpose)?s.purpose.join(", "):"No Purpose Specified"}),e.jsx("td",{className:"py-2 px-4 text-center",children:s.category}),e.jsx("td",{className:"py-2 px-4 text-center",children:s.sponsored_by}),e.jsx("td",{className:"py-2 px-4 text-center",children:s.start_date}),e.jsx("td",{className:"py-2 px-4 text-center",children:s.end_date}),e.jsx("td",{className:"py-2 px-4 text-center",children:s.project_status}),e.jsxs("td",{className:"py-2 px-4 text-center",children:[e.jsx(t,{href:route("post-projects.edit",s.id),className:"text-blue-500 hover:underline mr-2",children:"Edit"}),e.jsx(t,{href:route("post-projects.destroy",s.id),method:"delete",as:"button",className:"text-red-500 hover:underline",children:"Delete"})]})]},s.id))})]})}),e.jsx("div",{className:"mt-4 flex justify-center",children:r.links.map((s,l)=>e.jsx(t,{href:s.url,className:`mx-1 px-4 py-2 rounded ${s.active?"bg-blue-500 text-white":"bg-gray-200 text-gray-700 hover:bg-gray-300"}`,dangerouslySetInnerHTML:{__html:s.label}},l))})]})};export{N as default};
