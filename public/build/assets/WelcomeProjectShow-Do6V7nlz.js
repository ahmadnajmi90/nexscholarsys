import{q as j,j as e,a as i}from"./app-ChsSQ4Ga.js";import{a as f}from"./index-CziZd4Rt.js";function y(){const{project:s,previous:b,next:g,academicians:o,researchOptions:h,universities:p,auth:c}=j().props,x=new Date().getFullYear(),n=o&&o.find(a=>a.academician_id===s.author_id)||null,d=()=>{if(!s.field_of_research)return null;const r=(Array.isArray(s.field_of_research)?s.field_of_research:[s.field_of_research]).map(u=>{const t=h.find(l=>`${l.field_of_research_id}-${l.research_area_id}-${l.niche_domain_id}`===u);return t?`${t.field_of_research_name} - ${t.research_area_name} - ${t.niche_domain_name}`:null}).filter(Boolean);return r.length?r.join(", "):null},m=()=>{if(!s.university)return null;const a=p.find(r=>String(r.id)===String(s.university));return a?a.full_name:null};return e.jsxs("div",{children:[e.jsx("header",{className:"w-full bg-white shadow-md",children:e.jsxs("div",{className:"container mx-auto flex justify-between items-center py-4 px-6",children:[e.jsx("div",{className:"text-blue-600 text-lg font-bold",children:"Nexscholar"}),e.jsx("div",{className:"flex items-center space-x-4",children:c&&c.user?e.jsx(i,{href:route("dashboard"),className:"rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-blue-500",children:"Dashboard"}):e.jsxs(e.Fragment,{children:[e.jsx(i,{href:route("login"),className:"rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-blue-500",children:"Log in"}),e.jsx(i,{href:route("register"),className:"rounded-md px-3 py-2 bg-blue-600 text-white transition hover:bg-blue-700 focus:outline-none focus:ring focus-visible:ring-blue-500",children:"Register"})]})})]})}),e.jsx("div",{className:"absolute top-[6.2rem] left-2 md:top-[6.5rem] md:left-[3.5rem] z-50",children:e.jsx(i,{href:route("welcome"),className:"flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600",children:e.jsx(f,{className:"text-lg md:text-xl"})})}),e.jsx("div",{className:"px-10 md:px-28 md:py-2",children:e.jsxs("div",{className:"max-w-8xl mx-auto py-6",children:[s.title&&e.jsx("h1",{className:"text-2xl md:text-3xl font-bold mb-4 text-left",children:s.title}),n?e.jsxs("div",{className:"flex items-center gap-4 mb-4",children:[e.jsx("img",{src:`/storage/${n.profile_picture}`,alt:n.full_name,className:"w-12 h-12 rounded-full object-cover shadow-md bg-gray-200 border-2 border-white"}),e.jsxs("div",{children:[e.jsx("div",{className:"text-lg font-semibold",children:n.full_name}),s.created_at&&e.jsx("div",{className:"text-gray-500",children:new Date(s.created_at).toLocaleDateString()})]})]}):e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx("img",{src:"/storage/Admin.jpg",alt:"Admin",className:"w-12 h-12 rounded-full object-cover shadow-md border-2 border-white"}),e.jsxs("div",{children:[e.jsx("div",{className:"text-lg font-semibold",children:"Admin"}),s.created_at&&e.jsx("div",{className:"text-gray-500",children:new Date(s.created_at).toLocaleDateString()})]})]}),s.image&&e.jsx("img",{src:`/storage/${s.image}`,alt:"Banner",className:"w-full h-auto md:h-64 object-cover mb-4"}),s.description&&e.jsxs("div",{className:"mb-4",children:[e.jsx("h2",{className:"text-xl font-bold mb-2",children:"Description"}),e.jsx("div",{className:"text-gray-700 prose",dangerouslySetInnerHTML:{__html:s.description}})]}),e.jsxs("div",{className:"mb-4 space-y-2",children:[s.project_theme&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Project Theme:"})," ",s.project_theme]}),s.purpose&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Purpose:"})," ",Array.isArray(s.purpose)?s.purpose.join(", "):s.purpose]}),s.start_date&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Start Date:"})," ",new Date(s.start_date).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})]}),s.end_date&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"End Date:"})," ",new Date(s.end_date).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})]}),s.application_deadline&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Application Deadline:"})," ",new Date(s.application_deadline).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})]}),s.duration&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Duration:"})," ",s.duration," ",e.jsx("span",{children:"(months)"})]}),s.sponsored_by&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Sponsored By:"})," ",s.sponsored_by]}),s.category&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Category:"})," ",s.category]}),s.field_of_research&&d()&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Field of Research:"})," ",d()]}),s.supervisor_category&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Supervisor Category:"})," ",s.supervisor_category]}),s.supervisor_name&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Supervisor Name:"})," ",s.supervisor_name]}),s.university&&m()&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"University:"})," ",m()]}),s.email&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Email:"})," ",s.email]}),s.origin_country&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Origin Country:"})," ",s.origin_country]}),s.student_nationality&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Student Nationality:"})," ",s.student_nationality]}),s.student_level&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Student Level:"})," ",s.student_level]}),s.appointment_type&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Appointment Type:"})," ",s.appointment_type]}),s.purpose_of_collaboration&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Purpose of Collaboration:"})," ",s.purpose_of_collaboration]}),s.amount&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Amount:"})," ",s.amount]}),s.application_url&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Application:"}),e.jsx("a",{href:s.application_url,target:"_blank",rel:"noopener noreferrer",className:"ml-2 text-blue-500 underline",children:"Apply"})]})]}),s.attachment&&e.jsx("div",{className:"mb-2",children:e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Attachment:"})," ",e.jsx("a",{href:`/storage/${s.attachment}`,target:"_blank",rel:"noopener noreferrer",className:"text-blue-500 underline",children:"View Attachment"})]})})]})}),e.jsx("footer",{className:"bg-gray-100 text-center py-4 mt-6",children:e.jsxs("p",{className:"text-sm text-gray-700",children:["NexScholar © ",x,". All Rights Reserved."]})})]})}export{y as default};
