import{q as N,W as w,r as d,j as e}from"./app-Bwu-bara.js";import{M as k}from"./MainLayout-WwMCgBYJ.js";import j from"./NationalityForm-C0x3IFn-.js";import{S}from"./react-select.esm-DUV37WqO.js";import{R as C}from"./quill.snow-B-KDMglX.js";import{u as A}from"./useRoles-cSkxEsk_.js";import{I as l}from"./InputLabel-CPhsP2rA.js";import"./index-DRKyvpEV.js";import"./analytics-18rYXD_U.js";function I(){var g;const{auth:c,researchOptions:p,universities:f}=N().props;A();const{data:a,setData:r,post:v,processing:y,errors:t}=w({title:"",description:"",project_type:"",project_theme:"",purpose:[],start_date:"",end_date:"",application_deadline:"",duration:"",sponsored_by:"",category:"",field_of_research:[],supervisor_category:"",supervisor_name:"",university:"",email:"",origin_country:"",student_nationality:"",student_level:"",appointment_type:"",purpose_of_collaboration:"",image:null,attachment:null,amount:"",application_url:"",project_status:"published"}),[b,_]=d.useState(a.university),[m,h]=d.useState(!1),u=d.useRef(null);d.useEffect(()=>{const s=n=>{u.current&&!u.current.contains(n.target)&&h(!1)};return document.addEventListener("mousedown",s),()=>document.removeEventListener("mousedown",s)},[]);const i=s=>{if(s==="For Showcase")a.purpose.includes("For Showcase")?r("purpose",[]):r("purpose",["For Showcase"]);else{const n=a.purpose.includes(s)?a.purpose.filter(o=>o!==s):[...a.purpose.filter(o=>o!=="For Showcase"),s];r("purpose",n)}};d.useState("");function x(s){s&&s.preventDefault();const n=new FormData;Object.keys(a).forEach(o=>{a[o]instanceof File?n.append(o,a[o]):Array.isArray(a[o])?n.append(o,JSON.stringify(a[o])):n.append(o,a[o])}),v(route("post-projects.store"),{data:n,headers:{"Content-Type":"multipart/form-data"},onSuccess:()=>alert("Project posted successfully."),onError:o=>{console.error("Error updating Project:",o),alert("Failed to post the Project. Please try again.")}})}return e.jsx(k,{title:"",children:e.jsxs("div",{className:"p-4",children:[e.jsx("button",{onClick:()=>window.history.back(),className:"absolute top-4 left-4 text-gray-700 hover:text-gray-900",children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:"2",stroke:"currentColor",className:"w-6 h-6",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M15 19l-7-7 7-7"})})}),e.jsxs("form",{onSubmit:x,className:"bg-white p-4 sm:p-6 rounded-lg max-w-7xl mx-auto space-y-4 sm:space-y-6",children:[e.jsx("h1",{className:"text-xl font-bold text-gray-700 text-center",children:"Add New Project"}),e.jsxs("div",{children:[e.jsxs(l,{className:"block text-gray-700 font-medium",children:["Project Name ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("input",{type:"text",value:a.title,onChange:s=>r("title",s.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",placeholder:"Enter Project Name"}),t.title&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.title})]}),e.jsxs("div",{children:[e.jsxs(l,{className:"block text-gray-700 font-medium",children:["Project Description ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("div",{className:"mt-1 w-full rounded-lg border border-gray-200",style:{height:"300px",overflowY:"auto"},children:e.jsx(C,{theme:"snow",value:a.description,onChange:s=>r("description",s),placeholder:"Enter description",style:{height:"300px",maxHeight:"300px"}})}),t.description&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.description})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8",children:[e.jsxs("div",{children:[e.jsx(l,{className:"block text-gray-700 font-medium",children:"Project Theme"}),e.jsxs("select",{value:a.project_theme,onChange:s=>r("project_theme",s.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select a Project Theme"}),e.jsx("option",{value:"Science & Technology",children:"Science & Technology"}),e.jsx("option",{value:"Social Science",children:"Social Science"})]}),t.project_theme&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.project_theme})]}),e.jsxs("div",{ref:u,children:[e.jsx(l,{className:"block text-gray-700 font-medium",children:"Purpose (Multiselect)"}),e.jsx("div",{className:`relative mt-1 w-full rounded-lg border border-gray-200 p-2 px-2.5 cursor-pointer bg-white ${m?"shadow-lg":""}`,onClick:()=>h(!m),children:a.purpose&&a.purpose.length>0?a.purpose.join(", "):"Select Purposes"}),m&&e.jsx("div",{className:"absolute z-10 mt-2 bg-white border border-gray-200 rounded shadow-lg w-[37.5rem]",children:e.jsxs("div",{className:"p-2 space-y-2",children:[e.jsxs(l,{className:`flex items-center ${a.purpose.includes("For Showcase")?"opacity-50 cursor-not-allowed":""}`,children:[e.jsx("input",{type:"checkbox",value:"Seek for Postgraduate",checked:a.purpose.includes("Seek for Postgraduate"),onChange:s=>i(s.target.value),disabled:a.purpose.includes("For Showcase"),className:"mr-2"}),"Seek for Postgraduate"]}),e.jsxs(l,{className:`flex items-center ${a.purpose.includes("For Showcase")?"opacity-50 cursor-not-allowed":""}`,children:[e.jsx("input",{type:"checkbox",value:"Seek for Undergraduate",checked:a.purpose.includes("Seek for Undergraduate"),onChange:s=>i(s.target.value),disabled:a.purpose.includes("For Showcase"),className:"mr-2"}),"Seek for Undergraduate"]}),e.jsxs(l,{className:`flex items-center ${a.purpose.includes("For Showcase")?"opacity-50 cursor-not-allowed":""}`,children:[e.jsx("input",{type:"checkbox",value:"Seek for Academician Collaboration",checked:a.purpose.includes("Seek for Academician Collaboration"),onChange:s=>i(s.target.value),disabled:a.purpose.includes("For Showcase"),className:"mr-2"}),"Seek for Academician Collaboration"]}),e.jsxs(l,{className:`flex items-center ${a.purpose.includes("For Showcase")?"opacity-50 cursor-not-allowed":""}`,children:[e.jsx("input",{type:"checkbox",value:"Seek for Industrial Collaboration",checked:a.purpose.includes("Seek for Industrial Collaboration"),onChange:s=>i(s.target.value),disabled:a.purpose.includes("For Showcase"),className:"mr-2"}),"Seek for Industrial Collaboration"]}),e.jsxs(l,{className:`flex items-center ${a.purpose.some(s=>s==="Seek for Postgraduate"||s==="Seek for Undergraduate"||s==="Seek for Academician Collaboration"||s==="Seek for Industrial Collaboration")?"opacity-50 cursor-not-allowed":""}`,children:[e.jsx("input",{type:"checkbox",value:"For Showcase",checked:a.purpose.includes("For Showcase"),onChange:s=>i(s.target.value),disabled:a.purpose.some(s=>s==="Seek for Postgraduate"||s==="Seek for Undergraduate"||s==="Seek for Academician Collaboration"||s==="Seek for Industrial Collaboration"),className:"mr-2"}),"For Showcase"]})]})}),t.purpose&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.purpose})]})]}),!a.purpose.includes("For Showcase")&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8",children:[e.jsxs("div",{children:[e.jsx(l,{className:"block text-gray-700 font-medium",children:"Start Date"}),e.jsx("input",{type:"date",value:a.start_date,onChange:s=>r("start_date",s.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm"}),t.start_date&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.start_date})]}),e.jsxs("div",{children:[e.jsx(l,{className:"block text-gray-700 font-medium",children:"End Date"}),e.jsx("input",{type:"date",value:a.end_date,min:a.start_date||"",onChange:s=>r("end_date",s.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm"}),t.end_date&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.end_date})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8",children:[e.jsxs("div",{children:[e.jsx(l,{className:"mt-1 block text-gray-700 font-medium",children:"Application Deadline"}),e.jsx("input",{type:"date",value:a.application_deadline,onChange:s=>r("application_deadline",s.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm"}),t.application_deadline&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.application_deadline})]}),e.jsxs("div",{children:[e.jsx(l,{className:"mt-1 block text-gray-700 font-medium",children:"Duration (in months)"}),e.jsx("input",{type:"number",value:a.duration,onChange:s=>r("duration",s.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",placeholder:"Enter grant duration"}),t.duration&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.duration})]})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8",children:[e.jsxs("div",{children:[e.jsx(l,{className:"block text-gray-700 font-medium",children:"Sponsored By"}),e.jsx("input",{type:"text",value:a.sponsored_by,onChange:s=>r("sponsored_by",s.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",placeholder:"Enter sponsor"}),t.sponsored_by&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.sponsored_by})]}),e.jsxs("div",{children:[e.jsx(l,{htmlFor:"category",className:"block text-gray-700 font-medium",children:"Category"}),e.jsxs("select",{id:"category",name:"category",value:a.category,onChange:s=>r("category",s.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select a Category"}),e.jsx("option",{value:"Fundamental Research",children:"Fundamental Research"}),e.jsx("option",{value:"Applied Research",children:"Applied Research"}),e.jsx("option",{value:"Fundamental + Applied",children:"Fundamental + Applied"}),e.jsx("option",{value:"Knowledge Transfer Program (KTP)",children:"Knowledge Transfer Program (KTP)"}),e.jsx("option",{value:"CSR (Corporate Social Responsibility)",children:"CSR (Corporate Social Responsibility)"})]}),t.category&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.category})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8",children:[(a.category==="Fundamental Research"||a.category==="Applied Research"||a.category==="Fundamental + Applied")&&e.jsxs("div",{className:"w-full",children:[e.jsx(l,{htmlFor:"field_of_research",className:"block text-sm font-medium text-gray-700",children:"Field of Research Structure: Field of Research - Research Area - Niche Domain"}),e.jsx(S,{id:"field_of_research",isMulti:!0,options:p.map(s=>({value:`${s.field_of_research_id}-${s.research_area_id}-${s.niche_domain_id}`,label:`${s.field_of_research_name} - ${s.research_area_name} - ${s.niche_domain_name}`})),className:"mt-1",classNamePrefix:"select",value:(g=a.field_of_research)==null?void 0:g.map(s=>{const n=p.find(o=>`${o.field_of_research_id}-${o.research_area_id}-${o.niche_domain_id}`===s);return{value:s,label:n?`${n.field_of_research_name} - ${n.research_area_name} - ${n.niche_domain_name}`:s}}),onChange:s=>{const n=s.map(o=>o.value);r("field_of_research",n)},placeholder:"Search and select fields of research..."}),t.field_of_research&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.field_of_research})]}),e.jsxs("div",{children:[e.jsx(l,{className:"block text-gray-700 font-medium",children:"Project Supervisor / Project Leader"}),e.jsxs("select",{value:a.supervisor_category,onChange:s=>r("supervisor_category",s.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",children:[e.jsx("option",{value:"Own Name",children:"Own Name"}),e.jsx("option",{value:"On Behalf",children:"On Behalf"})]}),t.supervisor_category&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.supervisor_category})]})]}),a.supervisor_category==="On Behalf"&&e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8",children:[e.jsxs("div",{children:[e.jsx(l,{className:"mt-1 block text-gray-700 font-medium",children:"Supervisor / Project Leader Name"}),e.jsx("input",{type:"text",value:a.supervisor_name,onChange:s=>r("supervisor_name",s.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm"}),t.supervisor_name&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.supervisor_name})]}),e.jsxs("div",{children:[e.jsx(l,{className:"mt-1 block text-gray-700 font-medium",children:"University"}),e.jsxs("select",{id:"university",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:b||"",onChange:s=>{const n=s.target.value;_(n),r("university",n)},children:[e.jsx("option",{value:"",hidden:!0,children:"Select your University"}),f.map(s=>e.jsx("option",{value:s.id,children:s.full_name},s.id))]}),t.university&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.university})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8",children:[e.jsxs("div",{children:[e.jsx(l,{className:"block text-gray-700 font-medium",children:"Email"}),e.jsx("input",{type:"email",value:a.email,onChange:s=>r("email",s.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",placeholder:"Enter email"}),e.jsxs("div",{className:"mt-2 flex items-center",children:[e.jsx("input",{type:"checkbox",id:"usePersonalEmail",checked:a.email===c.email,onChange:s=>{s.target.checked?r("email",c.email):r("email","")},className:"form-checkbox h-5 w-5 text-blue-600"}),e.jsxs(l,{htmlFor:"usePersonalEmail",className:"ml-2 text-gray-700",children:["Use personal email (",c.email,")"]})]}),t.email&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.email})]}),e.jsxs("div",{children:[e.jsx(j,{title:"Project Origin Country",value:a.origin_country,onChange:s=>r("origin_country",s)}),t.origin_country&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.origin_country})]})]}),a.purpose.includes("Seek for Postgraduate")&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8",children:[e.jsxs("div",{children:[e.jsx(j,{title:"Student Nationality",value:a.student_nationality,isNotSpecify:!0,onChange:s=>r("student_nationality",s)}),t.student_nationality&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.student_nationality})]}),e.jsxs("div",{children:[e.jsx(l,{className:"block text-gray-700 font-medium",children:"Level of Study"}),e.jsxs("select",{value:a.student_level,onChange:s=>r("student_level",s.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select Level of Study"}),e.jsx("option",{value:"Master",children:"Master"}),e.jsx("option",{value:"Ph.D.",children:"Ph.D."})]}),t.student_level&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.student_level})]})]}),e.jsxs("div",{children:[e.jsx(l,{className:"block text-gray-700 font-medium",children:"Appointment Type"}),e.jsxs("select",{value:a.appointment_type,onChange:s=>r("appointment_type",s.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select Appointment Type"}),e.jsx("option",{value:"Research Assistant (RA)",children:"Research Assistant (RA)"}),e.jsx("option",{value:"Graduate Assistant (GA)",children:"Graduate Assistant (GA)"}),e.jsx("option",{value:"Teaching Assistant (TA)",children:"Teaching Assistant (TA)"}),e.jsx("option",{value:"Research Fellow (RF)",children:"Research Fellow (RF)"}),e.jsx("option",{value:"Project Assistant (PA)",children:"Project Assistant (PA)"}),e.jsx("option",{value:"Technical Assistant (TA)",children:"Technical Assistant (TA)"}),e.jsx("option",{value:"Graduate Research Assistant (GRA)",children:"Graduate Research Assistant (GRA)"}),e.jsx("option",{value:"Scholarship Recipient",children:"Scholarship Recipient"}),e.jsx("option",{value:"Intern",children:"Intern"})]}),t.appointment_type&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.appointment_type})]})]}),a.purpose.includes("Seek for Academician Collaboration")&&a.purpose.includes("Seek for Industrial Collaboration")&&e.jsxs("div",{children:[e.jsx(l,{className:"block text-gray-700 font-medium",children:"Purpose of Collaboration"}),e.jsx("textarea",{value:a.purpose_of_collaboration,onChange:s=>r("purpose_of_collaboration",s.target.value||""),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",placeholder:"Enter Purpose of Collaboration"}),t.purpose_of_collaboration&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.purpose_of_collaboration})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8",children:[e.jsxs("div",{children:[e.jsx(l,{className:"block text-gray-700 font-medium",children:"Upload Image"}),e.jsx("input",{type:"file",accept:"image/*",onChange:s=>r("image",s.target.files[0]),className:"w-full rounded-lg border-gray-200 py-2 text-sm"}),t.image&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.image})]}),e.jsxs("div",{children:[e.jsx(l,{className:"block text-gray-700 font-medium",children:"Upload Attachment"}),e.jsx("input",{type:"file",onChange:s=>r("attachment",s.target.files[0]),className:"w-full rounded-lg border-gray-200 py-2 text-sm"}),t.attachment&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.attachment})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8",children:[a.purpose!=="Seek for Postgraduate"&&e.jsxs("div",{children:[e.jsx(l,{className:"block text-gray-700 font-medium",children:"Approved Project Amount"}),e.jsx("input",{type:"number",value:a.amount,onChange:s=>r("amount",s.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",placeholder:"Enter amount (e.g., 5000.00)"}),t.amount&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.amount})]}),!a.purpose.includes("For Showcase")&&e.jsxs("div",{children:[e.jsx(l,{className:"block text-gray-700 font-medium",children:"Application URL"}),e.jsx("input",{type:"url",value:a.application_url,onChange:s=>r("application_url",s.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",placeholder:"Enter application URL"}),t.application_url&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.application_url})]})]}),e.jsx("div",{className:"flex space-x-4",children:e.jsx("button",{type:"button",onClick:()=>{x()},disabled:y,className:"w-full sm:w-auto inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600",children:"Publish"})})]})]})})}export{I as default};
