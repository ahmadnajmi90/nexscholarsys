import{q as x,r as i,j as e,a as s}from"./app-DEz1GiSY.js";import{M as h}from"./MainLayout-B4TFnIW4.js";import{u as m}from"./useRoles-DxDeXZwp.js";import"./index-DK5oFF98.js";const N=()=>{const{postEvents:d,search:l}=x().props;m();const[c,n]=i.useState(l||"");let r;const o=t=>{const a=t.target.value;n(a),r&&clearTimeout(r),r=setTimeout(()=>{document.getElementById("search-form").submit()},300)};return e.jsxs(h,{title:"",children:[e.jsxs("div",{className:"flex justify-between items-center mb-4",children:[e.jsx("h1",{className:"text-2xl font-semibold",children:"Your Events"}),e.jsx(s,{href:route("post-events.create"),className:"px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600",children:"Add New Event"})]}),e.jsx("div",{className:"mb-4",children:e.jsx("form",{id:"search-form",method:"GET",action:route("post-events.index"),children:e.jsx("input",{type:"text",name:"search",value:c,onChange:o,placeholder:"Search events...",className:"border rounded-lg px-4 py-2 w-full"})})}),e.jsx("div",{className:"overflow-x-auto bg-white rounded-lg shadow-md p-4",children:e.jsxs("table",{className:"min-w-full bg-white border",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"py-2 px-4 border-b",children:"Event Name"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"Event Type"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"Event Mode"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"Location"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"Start Date"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"End Date"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"Actions"})]})}),e.jsx("tbody",{children:d.data.map(t=>e.jsxs("tr",{className:"border-b",children:[e.jsx("td",{className:"py-2 px-4 font-semibold text-center",children:t.event_name}),e.jsx("td",{className:"py-2 px-4 text-center",children:t.event_type}),e.jsx("td",{className:"py-2 px-4 text-center",children:t.event_mode}),e.jsxs("td",{className:"py-2 px-4 text-center",children:[t.venue,", ",t.city,", ",t.country]}),e.jsx("td",{className:"py-2 px-4 text-center",children:t.start_date}),e.jsx("td",{className:"py-2 px-4 text-center",children:t.end_date}),e.jsxs("td",{className:"py-2 px-4 text-center",children:[e.jsx(s,{href:route("post-events.edit",t.id),className:"text-blue-500 hover:underline mr-2",children:"Edit"}),e.jsx(s,{href:route("post-events.destroy",t.id),method:"delete",as:"button",className:"text-red-500 hover:underline",children:"Delete"})]})]},t.id))})]})}),e.jsx("div",{className:"mt-4 flex justify-center",children:d.links.map((t,a)=>e.jsx(s,{href:t.url,className:`mx-1 px-4 py-2 rounded ${t.active?"bg-blue-500 text-white":"bg-gray-200 text-gray-700 hover:bg-gray-300"}`,dangerouslySetInnerHTML:{__html:t.label}},a))})]})};export{N as default};
