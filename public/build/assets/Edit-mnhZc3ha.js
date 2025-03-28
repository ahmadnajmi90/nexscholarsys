import{W as N,r as c,j as e}from"./app-Bwu-bara.js";import{M as S}from"./MainLayout-WwMCgBYJ.js";import v from"./NationalityForm-C0x3IFn-.js";import{S as C}from"./react-select.esm-DUV37WqO.js";import{R as k}from"./quill.snow-B-KDMglX.js";import{u as A}from"./useRoles-cSkxEsk_.js";import{I as i}from"./InputLabel-CPhsP2rA.js";import"./index-DRKyvpEV.js";import"./analytics-18rYXD_U.js";function O({postProject:t,auth:u,researchOptions:h,universities:f}){var j;A();const{data:s,setData:l,post:_,processing:y,errors:r}=N({title:t.title||"",description:t.description||"",project_type:t.project_type||"",project_theme:t.project_theme||"",purpose:t.purpose||[],start_date:t.start_date||"",end_date:t.end_date||"",application_deadline:t.application_deadline||"",duration:t.duration||"",sponsored_by:t.sponsored_by||"",category:t.category||"",field_of_research:t.field_of_research||[],supervisor_category:t.supervisor_category||"",supervisor_name:t.supervisor_name||"",university:t.university||"",email:t.email||"",origin_country:t.origin_country||"",student_nationality:t.student_nationality||"",student_level:t.student_level||"",appointment_type:t.appointment_type||"",purpose_of_collaboration:t.purpose_of_collaboration||"",image:t.image||"",attachment:t.attachment||"",amount:t.amount||"",application_url:t.application_url||"",project_status:t.project_status||"draft"}),[b,w]=c.useState(s.university),[p,x]=c.useState(!1),m=c.useRef(null);c.useEffect(()=>{const a=o=>{m.current&&!m.current.contains(o.target)&&x(!1)};return document.addEventListener("mousedown",a),()=>{document.removeEventListener("mousedown",a)}},[]);const d=a=>{if(a==="For Showcase")s.purpose.includes("For Showcase")?l("purpose",[]):l("purpose",["For Showcase"]);else{const o=s.purpose.includes(a)?s.purpose.filter(n=>n!==a):[...s.purpose.filter(n=>n!=="For Showcase"),a];l("purpose",o)}};c.useState("");const g=async a=>{a&&a.preventDefault();const o=new FormData;Object.keys(s).forEach(n=>{n==="image"||n==="attachment"?(s[n]instanceof File||typeof s[n]=="string")&&o.append(n,s[n]):Array.isArray(s[n])?o.append(n,JSON.stringify(s[n])):o.append(n,s[n])}),console.log("Form Data Contents:");for(let n of o.entries())console.log(n[0]+": "+n[1]);_(route("post-projects.update",t.id),{data:o,headers:{"Content-Type":"multipart/form-data"},onSuccess:()=>{alert("Project updated successfully!")},onError:n=>{console.error("Error updating Project:",n),alert("Failed to update the Project. Please try again.")}})};return e.jsx(S,{title:"",children:e.jsxs("div",{className:"p-4",children:[e.jsx("button",{onClick:()=>window.history.back(),className:"absolute top-4 left-4 text-gray-700 hover:text-gray-900",children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:"2",stroke:"currentColor",className:"w-6 h-6",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M15 19l-7-7 7-7"})})}),e.jsxs("form",{onSubmit:g,className:"bg-white p-4 sm:p-6 rounded-lg max-w-7xl mx-auto space-y-4 sm:space-y-6",children:[e.jsx("h1",{className:"text-xl font-bold text-gray-700 text-center",children:"Add New Project"}),e.jsxs("div",{children:[e.jsxs(i,{children:["Project Name ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("input",{type:"text",value:s.title,onChange:a=>l("title",a.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",placeholder:"Enter Project Name"}),r.title&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.title})]}),e.jsxs("div",{children:[e.jsxs(i,{children:["Project Description ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("div",{className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",style:{height:"300px",overflowY:"auto"},children:e.jsx(k,{theme:"snow",value:s.description,onChange:a=>l("description",a),placeholder:"Enter description",style:{height:"300px",maxHeight:"300px"}})}),r.description&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.description})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8",children:[e.jsxs("div",{children:[e.jsx(i,{children:"Project Theme"}),e.jsxs("select",{value:s.project_theme,onChange:a=>l("project_theme",a.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select a Project Theme"}),e.jsx("option",{value:"Science & Technology",children:"Science & Technology"}),e.jsx("option",{value:"Social Science",children:"Social Science"})]}),r.project_theme&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.project_theme})]}),e.jsxs("div",{ref:m,children:[e.jsx(i,{children:"Purpose (Multiselect)"}),e.jsx("div",{className:`relative mt-1 w-full rounded-lg border border-gray-200 p-2 px-2.5 cursor-pointer bg-white ${p?"shadow-lg":""}`,onClick:()=>x(!p),children:s.purpose&&s.purpose.length>0?s.purpose.join(", "):"Select Purposes"}),p&&e.jsx("div",{className:"absolute z-10 mt-2 bg-white border border-gray-200 rounded shadow-lg w-full",children:e.jsxs("div",{className:"p-2 space-y-2",children:[e.jsxs(i,{className:`flex items-center ${s.purpose.includes("For Showcase")?"opacity-50 cursor-not-allowed":""}`,children:[e.jsx("input",{type:"checkbox",value:"Seek for Postgraduate",checked:s.purpose.includes("Seek for Postgraduate"),onChange:a=>d(a.target.value),disabled:s.purpose.includes("For Showcase"),className:"mr-2"}),"Seek for Postgraduate"]}),e.jsxs(i,{className:`flex items-center ${s.purpose.includes("For Showcase")?"opacity-50 cursor-not-allowed":""}`,children:[e.jsx("input",{type:"checkbox",value:"Seek for Undergraduate",checked:s.purpose.includes("Seek for Undergraduate"),onChange:a=>d(a.target.value),disabled:s.purpose.includes("For Showcase"),className:"mr-2"}),"Seek for Undergraduate"]}),e.jsxs(i,{className:`flex items-center ${s.purpose.includes("For Showcase")?"opacity-50 cursor-not-allowed":""}`,children:[e.jsx("input",{type:"checkbox",value:"Seek for Academician Collaboration",checked:s.purpose.includes("Seek for Academician Collaboration"),onChange:a=>d(a.target.value),disabled:s.purpose.includes("For Showcase"),className:"mr-2"}),"Seek for Academician Collaboration"]}),e.jsxs(i,{className:`flex items-center ${s.purpose.includes("For Showcase")?"opacity-50 cursor-not-allowed":""}`,children:[e.jsx("input",{type:"checkbox",value:"Seek for Industrial Collaboration",checked:s.purpose.includes("Seek for Industrial Collaboration"),onChange:a=>d(a.target.value),disabled:s.purpose.includes("For Showcase"),className:"mr-2"}),"Seek for Industrial Collaboration"]}),e.jsxs(i,{className:`flex items-center ${s.purpose.some(a=>a==="Seek for Postgraduate"||a==="Seek for Undergraduate"||a==="Seek for Academician Collaboration"||a==="Seek for Industrial Collaboration")?"opacity-50 cursor-not-allowed":""}`,children:[e.jsx("input",{type:"checkbox",value:"For Showcase",checked:s.purpose.includes("For Showcase"),onChange:a=>d(a.target.value),disabled:s.purpose.some(a=>a==="Seek for Postgraduate"||a==="Seek for Undergraduate"||a==="Seek for Academician Collaboration"||a==="Seek for Industrial Collaboration"),className:"mr-2"}),"For Showcase"]})]})}),r.purpose&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.purpose})]})]}),!s.purpose.includes("For Showcase")&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8",children:[e.jsxs("div",{children:[e.jsx(i,{children:"Start Date"}),e.jsx("input",{type:"date",value:s.start_date,onChange:a=>l("start_date",a.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm"}),r.start_date&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.start_date})]}),e.jsxs("div",{children:[e.jsx(i,{children:"End Date"}),e.jsx("input",{type:"date",value:s.end_date,min:s.start_date||"",onChange:a=>l("end_date",a.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm"}),r.end_date&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.end_date})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8",children:[e.jsxs("div",{children:[e.jsx(i,{children:"Application Deadline"}),e.jsx("input",{type:"date",value:s.application_deadline,onChange:a=>l("application_deadline",a.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm"}),r.application_deadline&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.application_deadline})]}),e.jsxs("div",{children:[e.jsx(i,{children:"Duration (in months)"}),e.jsx("input",{type:"number",value:s.duration,onChange:a=>l("duration",a.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",placeholder:"Enter grant duration"}),r.duration&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.duration})]})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8",children:[e.jsxs("div",{children:[e.jsx(i,{children:"Sponsored By"}),e.jsx("input",{type:"text",value:s.sponsored_by,onChange:a=>l("sponsored_by",a.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",placeholder:"Enter sponsor"}),r.sponsored_by&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.sponsored_by})]}),e.jsxs("div",{children:[e.jsx(i,{children:"Category"}),e.jsxs("select",{id:"category",name:"category",value:s.category,onChange:a=>l("category",a.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select a Category"}),e.jsx("option",{value:"Fundamental Research",children:"Fundamental Research"}),e.jsx("option",{value:"Applied Research",children:"Applied Research"}),e.jsx("option",{value:"Fundamental + Applied",children:"Fundamental + Applied"}),e.jsx("option",{value:"Knowledge Transfer Program (KTP)",children:"Knowledge Transfer Program (KTP)"}),e.jsx("option",{value:"CSR (Corporate Social Responsibility)",children:"CSR (Corporate Social Responsibility)"})]}),r.category&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.category})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8",children:[(s.category==="Fundamental Research"||s.category==="Applied Research"||s.category==="Fundamental + Applied")&&e.jsxs("div",{className:"w-full",children:[e.jsx(i,{children:"Field of Research Structure : Field of Research - Research Area - Niche Domain"}),e.jsx(C,{id:"field_of_research",isMulti:!0,options:h.map(a=>({value:`${a.field_of_research_id}-${a.research_area_id}-${a.niche_domain_id}`,label:`${a.field_of_research_name} - ${a.research_area_name} - ${a.niche_domain_name}`})),className:"mt-1",classNamePrefix:"select",value:(j=s.field_of_research)==null?void 0:j.map(a=>{const o=h.find(n=>`${n.field_of_research_id}-${n.research_area_id}-${n.niche_domain_id}`===a);return{value:a,label:o?`${o.field_of_research_name} - ${o.research_area_name} - ${o.niche_domain_name}`:a}}),onChange:a=>{const o=a.map(n=>n.value);l("field_of_research",o)},placeholder:"Search and select fields of research..."}),r.field_of_research&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.field_of_research})]}),e.jsxs("div",{children:[e.jsx(i,{children:"Project Supervisor / Project Leader"}),e.jsxs("select",{value:s.supervisor_category,onChange:a=>l("supervisor_category",a.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",children:[e.jsx("option",{value:"Own Name",children:"Own Name"}),e.jsx("option",{value:"On Behalf",children:"On Behalf"})]}),r.supervisor_category&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.supervisor_category})]})]}),s.supervisor_category==="On Behalf"&&e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8",children:[e.jsxs("div",{children:[e.jsx(i,{children:"Supervisor / Project Leader Name"}),e.jsx("input",{type:"text",value:s.supervisor_name,onChange:a=>l("supervisor_name",a.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm"}),r.supervisor_name&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.supervisor_name})]}),e.jsxs("div",{children:[e.jsx(i,{children:"University"}),e.jsxs("select",{id:"university",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:b||"",onChange:a=>{const o=a.target.value;w(o),l("university",o)},children:[e.jsx("option",{value:"",hidden:!0,children:"Select your University"}),f.map(a=>e.jsx("option",{value:a.id,children:a.full_name},a.id))]}),r.university&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.university})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8",children:[e.jsxs("div",{children:[e.jsx(i,{children:"Email"}),e.jsx("input",{type:"email",value:s.email,onChange:a=>l("email",a.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",placeholder:"Enter email"}),r.email&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.email}),e.jsxs("div",{className:"mt-2 flex items-center",children:[e.jsx("input",{type:"checkbox",id:"usePersonalEmail",checked:s.email===u.email,onChange:a=>{a.target.checked?l("email",u.email):l("email","")},className:"form-checkbox h-5 w-5 text-blue-600"}),e.jsxs(i,{htmlFor:"usePersonalEmail",className:"ml-2",children:["Use personal email (",u.email,")"]})]})]}),e.jsxs("div",{children:[e.jsx(v,{title:"Project Origin Country",value:s.origin_country,onChange:a=>l("origin_country",a)}),r.origin_country&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.origin_country})]})]}),s.purpose.includes("Seek for Postgraduate")&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8",children:[e.jsxs("div",{children:[e.jsx(v,{title:"Student Nationality",value:s.student_nationality,isNotSpecify:!0,onChange:a=>l("student_nationality",a)}),r.student_nationality&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.student_nationality})]}),e.jsxs("div",{children:[e.jsx(i,{children:"Level of Study"}),e.jsxs("select",{value:s.student_level,onChange:a=>l("student_level",a.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select Level of Study"}),e.jsx("option",{value:"Master",children:"Master"}),e.jsx("option",{value:"Ph.D.",children:"Ph.D."})]}),r.student_level&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.student_level})]})]}),e.jsxs("div",{children:[e.jsx(i,{children:"Appointment Type"}),e.jsxs("select",{value:s.appointment_type,onChange:a=>l("appointment_type",a.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select Appointment Type"}),e.jsx("option",{value:"Research Assistant (RA)",children:"Research Assistant (RA)"}),e.jsx("option",{value:"Graduate Assistant (GA)",children:"Graduate Assistant (GA)"}),e.jsx("option",{value:"Teaching Assistant (TA)",children:"Teaching Assistant (TA)"}),e.jsx("option",{value:"Research Fellow (RF)",children:"Research Fellow (RF)"}),e.jsx("option",{value:"Project Assistant (PA)",children:"Project Assistant (PA)"}),e.jsx("option",{value:"Technical Assistant (TA)",children:"Technical Assistant (TA)"}),e.jsx("option",{value:"Graduate Research Assistant (GRA)",children:"Graduate Research Assistant (GRA)"}),e.jsx("option",{value:"Scholarship Recipient",children:"Scholarship Recipient"}),e.jsx("option",{value:"Intern",children:"Intern"})]}),r.appointment_type&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.appointment_type})]})]}),s.purpose.includes("Seek for Academician Collaboration")&&s.purpose.includes("Seek for Industrial Collaboration")&&e.jsxs("div",{children:[e.jsx(i,{children:"Purpose of Collaboration"}),e.jsx("textarea",{value:s.purpose_of_collaboration,onChange:a=>l("purpose_of_collaboration",a.target.value||""),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",placeholder:"Enter Purpose of Collaboration"}),r.purpose_of_collaboration&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.purpose_of_collaboration})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8",children:[e.jsxs("div",{children:[e.jsx(i,{children:"Upload Image"}),e.jsx("input",{type:"file",accept:"image/*",onChange:a=>l("image",a.target.files[0]),className:"w-full rounded-lg border-gray-200 py-2 text-sm"}),t.image&&e.jsxs("p",{className:"text-gray-600 text-sm mt-2",children:["Current Image:"," ",e.jsx("a",{href:`/storage/${t.image}`,target:"_blank",rel:"noopener noreferrer",className:"text-blue-500 underline",children:"View Image"})]}),r.image&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.image})]}),e.jsxs("div",{children:[e.jsx(i,{children:"Upload Attachment"}),e.jsx("input",{type:"file",onChange:a=>l("attachment",a.target.files[0]),className:"w-full rounded-lg border-gray-200 py-2 text-sm"}),t.attachment&&e.jsxs("p",{className:"text-gray-600 text-sm mt-2",children:["Current Attachment:"," ",e.jsx("a",{href:`/storage/${t.attachment}`,target:"_blank",rel:"noopener noreferrer",className:"text-blue-500 underline",children:"View Attachment"})]}),r.attachment&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.attachment})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8",children:[s.purpose!=="Seek for Postgraduate"&&e.jsxs("div",{children:[e.jsx(i,{children:"Approved Project Amount"}),e.jsx("input",{type:"number",value:s.amount,onChange:a=>l("amount",a.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",placeholder:"Enter amount (e.g., 5000.00)"}),r.amount&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.amount})]}),!s.purpose.includes("For Showcase")&&e.jsxs("div",{children:[e.jsx(i,{className:"block text-gray-700 font-medium",children:"Application URL"}),e.jsx("input",{type:"url",value:s.application_url,onChange:a=>l("application_url",a.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",placeholder:"Enter application URL"}),r.application_url&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.application_url})]})]}),e.jsx("div",{className:"flex space-x-4",children:e.jsx("button",{type:"button",onClick:()=>g(),disabled:y,className:"w-full sm:w-auto inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600",children:"Publish"})})]})]})})}export{O as default};
