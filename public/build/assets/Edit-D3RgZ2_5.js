import{W as y,r as o,j as e}from"./app-BEVphSO4.js";import{M as b}from"./MainLayout-CFyEXUvR.js";import p from"./NationalityForm-sU_mzofG.js";import{S as _}from"./react-select.esm-PnHdN2Ys.js";import{R as N}from"./quill.snow-afGKBrfi.js";import"./index-BSUdVQrZ.js";function P({postGrant:l,auth:d,isPostgraduate:h,researchOptions:c,universities:x}){var u;const{data:t,setData:s,post:g,processing:v,errors:n}=y({title:l.title||"",description:l.description||"",start_date:l.start_date||"",end_date:l.end_date||"",application_deadline:l.application_deadline||"",duration:l.duration||"",sponsored_by:l.sponsored_by||"",category:l.category||"",field_of_research:l.field_of_research||[],supervisor_category:l.supervisor_category||"",supervisor_name:l.supervisor_name||"",university:l.university||"",email:l.email||"",origin_country:l.origin_country||"",purpose:l.purpose||"",student_nationality:l.student_nationality||"",student_level:l.student_level||"",appointment_type:l.appointment_type||"",purpose_of_collaboration:l.purpose_of_collaboration||"",image:l.image||"",attachment:l.attachment||"",amount:l.amount||"",application_url:l.application_url||"",status:l.status||"draft"}),[j,f]=o.useState(t.university);o.useState(!1),o.useState("");const m=async a=>{a&&a.preventDefault();const i=new FormData;Object.keys(t).forEach(r=>{r==="image"||r==="attachment"?(t[r]instanceof File||typeof t[r]=="string")&&i.append(r,t[r]):Array.isArray(t[r])||Array.isArray(t[r])?i.append(r,JSON.stringify(t[r])):i.append(r,t[r])}),console.log("Form Data Contents:");for(let r of i.entries())console.log(r[0]+": "+r[1]);g(route("post-grants.update",l.id),{data:i,headers:{"Content-Type":"multipart/form-data"},onSuccess:()=>{alert("Grant updated successfully!")},onError:r=>{console.error("Error updating grant:",r),alert("Failed to update the grant. Please try again.")}})};return e.jsx(b,{title:"",isPostgraduate:h,children:e.jsx("div",{className:"p-4",children:e.jsxs("form",{onSubmit:m,className:"bg-white p-6 rounded-lg max-w-7xl mx-auto space-y-6",children:[e.jsx("h1",{className:"text-xl font-bold text-gray-700 text-center",children:"Edit Grant"}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-gray-700 font-medium",children:["Grant Name ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("input",{type:"text",value:t.title,onChange:a=>s("title",a.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter grant title"}),n.title&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:n.title})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-gray-700 font-medium",children:["Grant  Description ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("div",{className:"mt-1 w-full rounded-lg border border-gray-200 overflow-auto",style:{height:"300px",overflowY:"auto"},children:e.jsx(N,{theme:"snow",value:t.description,onChange:a=>s("description",a),style:{height:"300px",maxHeight:"300px"},className:"text-sm",placeholder:"Enter description"})}),n.description&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:n.description})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Start Date"}),e.jsx("input",{type:"date",value:t.start_date,onChange:a=>{s("start_date",a.target.value)},className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"End Date"}),e.jsx("input",{type:"date",value:t.end_date,min:t.start_date||"",onChange:a=>{s("end_date",a.target.value)},className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"mt-1 block text-gray-700 font-medium",children:"Application Deadline"}),e.jsx("input",{type:"date",value:t.application_deadline,onChange:a=>s("application_deadline",a.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"mt-1 block text-gray-700 font-medium",children:"Duration (in months)"}),e.jsx("input",{type:"number",value:t.duration,onChange:a=>s("duration",a.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter grant duration"})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Sponsored By"}),e.jsx("input",{type:"text",value:t.sponsored_by,onChange:a=>s("sponsored_by",a.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter sponsor"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"category",className:"block text-gray-700 font-medium",children:"Category"}),e.jsxs("select",{id:"category",name:"category",value:t.category,onChange:a=>s("category",a.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select a Category"}),e.jsx("option",{value:"Fundamental Research",children:"Fundamental Research"}),e.jsx("option",{value:"Applied Research",children:"Applied Research"}),e.jsx("option",{value:"Fundamental + Applied",children:"Fundamental + Applied"}),e.jsx("option",{value:"Knowledge Transfer Program (KTP)",children:"Knowledge Transfer Program (KTP)"}),e.jsx("option",{value:"CSR (Corporate Social Responsibility)",children:"CSR (Corporate Social Responsibility)"})]}),n.category&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:n.category})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[(t.category==="Fundamental Research"||t.category==="Applied Research"||t.category==="Fundamental + Applied")&&e.jsxs("div",{className:"w-full",children:[e.jsx("label",{htmlFor:"field_of_research",className:"block text-sm font-medium text-gray-700",children:"Field of Research (Multiple Selection) Structure : Field of Research - Research Area - Niche Domain"}),e.jsx(_,{id:"field_of_research",isMulti:!0,options:c.map(a=>({value:`${a.field_of_research_id}-${a.research_area_id}-${a.niche_domain_id}`,label:`${a.field_of_research_name} - ${a.research_area_name} - ${a.niche_domain_name}`})),className:"mt-1",classNamePrefix:"select",value:(u=t.field_of_research)==null?void 0:u.map(a=>{const i=c.find(r=>`${r.field_of_research_id}-${r.research_area_id}-${r.niche_domain_id}`===a);return{value:a,label:i?`${i.field_of_research_name} - ${i.research_area_name} - ${i.niche_domain_name}`:a}}),onChange:a=>{const i=a.map(r=>r.value);s("field_of_research",i)},placeholder:"Search and select fields of research..."})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Grant Supervisor / Project Learder"}),e.jsxs("select",{value:t.supervisor_category,onChange:a=>s("supervisor_category",a.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",children:[e.jsx("option",{value:"Own Name",children:"Own Name"}),e.jsx("option",{value:"On Behalf",children:"On Behalf"})]})]})]}),t.supervisor_category==="On Behalf"&&e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"mt-1 block text-gray-700 font-medium",children:"Grant Supervisor / Project Leader Name"}),e.jsx("input",{type:"text",value:t.supervisor_name,onChange:a=>s("supervisor_name",a.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"mt-1 block text-gray-700 font-medium",children:"University"}),e.jsxs("select",{id:"university",className:"mt-1 block w-full border rounded-md p-2",value:j||"",onChange:a=>{const i=a.target.value;f(i),s("university",i)},children:[e.jsx("option",{value:"",hidden:!0,children:"Select your University"}),x.map(a=>e.jsx("option",{value:a.id,children:a.full_name},a.id))]})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Email"}),e.jsx("input",{type:"email",value:t.email,onChange:a=>s("email",a.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter email"}),e.jsxs("div",{className:"mt-2 flex items-center",children:[e.jsx("input",{type:"checkbox",id:"usePersonalEmail",checked:t.email===d.email,onChange:a=>{a.target.checked?s("email",d.email):s("email","")},className:"form-checkbox h-5 w-5 text-blue-600"}),e.jsxs("label",{htmlFor:"usePersonalEmail",className:"ml-2 text-gray-700",children:["Use personal email (",d.email,")"]})]})]}),e.jsx("div",{children:e.jsx(p,{title:"Grant Origin Country",value:t.origin_country,onChange:a=>s("origin_country",a)})})]}),e.jsx("div",{className:"grid grid-cols-2 gap-8",children:e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Grant Purpose"}),e.jsxs("select",{value:t.purpose,onChange:a=>s("purpose",a.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select Grant Purpose"}),e.jsx("option",{value:"find_pgstudent",children:"Find Postgraduate Student"}),e.jsx("option",{value:"find_academic_collaboration",children:"Find Academic Collaboration"}),e.jsx("option",{value:"find_industry_collaboration",children:"Find Industry Collaboration - Matching Grant"})]})]})}),t.purpose==="find_pgstudent"?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsx("div",{children:e.jsx(p,{title:"Student Nationality",value:t.student_nationality,onChange:a=>s("student_nationality",a)})}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Level of Study"}),e.jsxs("select",{value:t.student_level,onChange:a=>s("student_level",a.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select Level of Study"}),e.jsx("option",{value:"Master",children:"Master"}),e.jsx("option",{value:"Ph.D.",children:"Ph.D."})]})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Appointment Type"}),e.jsxs("select",{value:t.appointment_type,onChange:a=>s("appointment_type",a.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select Appointment Type"}),e.jsx("option",{value:"Research Assistant (RA)",children:"Research Assistant (RA)"}),e.jsx("option",{value:"Graduate Assistant (GA)",children:"Graduate Assistant (GA)"}),e.jsx("option",{value:"Teaching Assistant (TA)",children:"Teaching Assistant (TA)"}),e.jsx("option",{value:"Research Fellow (RF)",children:"Research Fellow (RF)"}),e.jsx("option",{value:"Project Assistant (PA)",children:"Project Assistant (PA)"}),e.jsx("option",{value:"Technical Assistant (TA)",children:"Technical Assistant (TA)"}),e.jsx("option",{value:"Graduate Research Assistant (GRA)",children:"Graduate Research Assistant (GRA)"}),e.jsx("option",{value:"Scholarship Recipient",children:"Scholarship Recipient"}),e.jsx("option",{value:"Intern",children:"Intern"})]})]})]}):e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Purpose of Collaboration"}),e.jsx("textarea",{value:t.purpose_of_collaboration,onChange:a=>s("purpose_of_collaboration",a.target.value||""),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter Purpose of Collaboration"}),n.purpose_of_collaboration&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:n.purpose_of_collaboration})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Upload Image"}),e.jsx("input",{type:"file",accept:"image/*",onChange:a=>s("image",a.target.files[0]),className:"w-full rounded-lg border-gray-200 p-2 text-sm"}),l.image&&e.jsxs("p",{className:"text-gray-600 text-sm mt-2",children:["Current Image:"," ",e.jsx("a",{href:`/storage/${l.image}`,target:"_blank",rel:"noopener noreferrer",className:"text-blue-500 underline",children:"View Image"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Upload Attachment"}),e.jsx("input",{type:"file",onChange:a=>s("attachment",a.target.files[0]),className:"w-full rounded-lg border-gray-200 p-2 text-sm"}),l.attachment&&e.jsxs("p",{className:"text-gray-600 text-sm mt-2",children:["Current Attachment:"," ",e.jsx("a",{href:`/storage/${l.attachment}`,target:"_blank",rel:"noopener noreferrer",className:"text-blue-500 underline",children:"View Attachment"})]})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[t.purpose!=="find_pgstudent"&&e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Approved Grant Amount"}),e.jsx("input",{type:"number",value:t.amount,onChange:a=>s("amount",a.target.value),className:"w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter amount (e.g., 5000.00)"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Application URL"}),e.jsx("input",{type:"url",value:t.application_url,onChange:a=>s("application_url",a.target.value),className:"w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter application URL"}),n.application_url&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:n.application_url})]})]}),e.jsx("div",{className:"flex space-x-4",children:e.jsx("button",{type:"button",onClick:()=>{m()},disabled:v,className:"inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600",children:"Publish"})})]})})})}export{P as default};
