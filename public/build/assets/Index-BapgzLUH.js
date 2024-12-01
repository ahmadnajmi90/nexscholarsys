import{q as x,r as h,j as e,a as s}from"./app-TDCK3Dw0.js";import{M as m}from"./MainLayout-CUyFbL4l.js";import"./index-BCI782Or.js";const y=()=>{const{postEvents:c,isPostgraduate:n,search:d}=x().props,[l,o]=h.useState(d||"");let r;const i=t=>{const a=t.target.value;o(a),r&&clearTimeout(r),r=setTimeout(()=>{document.getElementById("search-form").submit()},300)};return e.jsxs(m,{title:"",isPostgraduate:n,children:[e.jsxs("div",{className:"flex justify-between items-center mb-4",children:[e.jsx("h1",{className:"text-2xl font-semibold",children:"Your Events"}),e.jsx(s,{href:route("post-events.create"),className:"px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600",children:"Add New Event"})]}),e.jsx("div",{className:"mb-4",children:e.jsx("form",{id:"search-form",method:"GET",action:route("post-events.index"),children:e.jsx("input",{type:"text",name:"search",value:l,onChange:i,placeholder:"Search events...",className:"border rounded-lg px-4 py-2 w-full"})})}),e.jsx("div",{className:"overflow-x-auto bg-white rounded-lg shadow-md p-4",children:e.jsxs("table",{className:"min-w-full bg-white border",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"py-2 px-4 border-b",children:"Event Name"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"Event Type"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"Theme"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"Location"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"Start Date"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"End Date"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"Organized By"}),e.jsx("th",{className:"py-2 px-4 border-b",children:"Actions"})]})}),e.jsx("tbody",{children:c.data.map(t=>e.jsxs("tr",{className:"border-b",children:[e.jsx("td",{className:"py-2 px-4 font-semibold text-center",children:t.event_name}),e.jsx("td",{className:"py-2 px-4 text-center",children:(()=>{switch(t.event_type){case"competition":return"Competition";case"conference":return"Conference";case"workshop":return"Workshop";case"seminar":return"Seminar";case"webinar":return"Webinar";default:return"Other"}})()}),e.jsx("td",{className:"py-2 px-4 text-center",children:t.theme?JSON.parse(t.theme).join(", "):"N/A"}),e.jsx("td",{className:"py-2 px-4 text-center",children:t.location}),e.jsx("td",{className:"py-2 px-4 text-center",children:t.start_date_time}),e.jsx("td",{className:"py-2 px-4 text-center",children:t.end_date_time}),e.jsx("td",{className:"py-2 px-4 text-center",children:t.organized_by}),e.jsxs("td",{className:"py-2 px-4 text-center",children:[e.jsx(s,{href:route("post-events.edit",t.id),className:"text-blue-500 hover:underline mr-2",children:"Edit"}),e.jsx(s,{href:route("post-events.destroy",t.id),method:"delete",as:"button",className:"text-red-500 hover:underline",children:"Delete"})]})]},t.id))})]})}),e.jsx("div",{className:"mt-4 flex justify-center",children:c.links.map((t,a)=>e.jsx(s,{href:t.url,className:`mx-1 px-4 py-2 rounded ${t.active?"bg-blue-500 text-white":"bg-gray-200 text-gray-700 hover:bg-gray-300"}`,dangerouslySetInnerHTML:{__html:t.label}},a))})]})};export{y as default};
