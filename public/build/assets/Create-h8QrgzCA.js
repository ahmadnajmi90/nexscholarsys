import{q as u,W as h,r as c,j as e}from"./app-DUIkrJzi.js";import{M as g}from"./MainLayout-DafhsQ08.js";import{R as j}from"./quill.snow-fGHeBbt0.js";import"./index-mFJ7OjdE.js";function N(){const{auth:i,isPostgraduate:m}=u().props,{data:a,setData:l,post:p,processing:x,errors:r}=h({title:"",description:"",project_type:"",purpose:"",start_date:"",end_date:"",image:null,attachment:null,email:"",location:"",project_status:"published"});c.useState(!1),c.useState("");function n(t){t&&t.preventDefault();const o=new FormData;Object.keys(a).forEach(s=>{a[s]instanceof File,o.append(s,a[s])});for(let[s,d]of o.entries())console.log(`${s}: ${d}`),console.log(`${s}: ${typeof d}`);p(route("post-projects.store"),{data:o,headers:{"Content-Type":"multipart/form-data"},onSuccess:()=>{alert("Project posted successfully.")},onError:s=>{console.error("Error updating Project:",s),alert("Failed to post the Project. Please try again.")}})}return e.jsx(g,{title:"",isPostgraduate:m,children:e.jsx("div",{className:"p-4",children:e.jsxs("form",{onSubmit:n,className:"bg-white p-6 rounded-lg max-w-7xl mx-auto space-y-6",children:[e.jsx("h1",{className:"text-xl font-bold text-gray-700 text-center",children:"Add New Project"}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-gray-700 font-medium",children:["Project Name ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("input",{type:"text",value:a.title,onChange:t=>l("title",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter Project Name"}),r.title&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.title})]}),e.jsx("div",{children:e.jsxs("div",{children:[e.jsxs("label",{className:"block text-gray-700 font-medium",children:["Project Description ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("div",{className:"mt-1 w-full rounded-lg border border-gray-200",style:{height:"300px",overflowY:"auto"},children:e.jsx(j,{theme:"snow",value:a.description,onChange:t=>l("description",t),placeholder:"Enter description",style:{height:"300px",maxHeight:"300px"}})}),r.description&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.description})]})}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Project Type"}),e.jsxs("select",{id:"project_type",name:"project_type",value:a.project_type,onChange:t=>l("project_type",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select a Project Type"}),e.jsx("option",{value:"Fundamental Research",children:"Fundamental Research"}),e.jsx("option",{value:"Applied Research",children:"Applied Research"}),e.jsx("option",{value:"Fundamental + Applied",children:"Fundamental + Applied"}),e.jsx("option",{value:"Knowledge Transfer Program (KTP)",children:"Knowledge Transfer Program (KTP)"}),e.jsx("option",{value:"CSR (Corporate Social Responsibility)",children:"CSR (Corporate Social Responsibility)"})]}),r.project_type&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.project_type})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Purpose"}),e.jsxs("select",{value:a.purpose,onChange:t=>l("purpose",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:" Select a Purpose"}),e.jsx("option",{value:"find_accollaboration",children:"Find Academician Collaboration"}),e.jsx("option",{value:"find_incollaboration",children:"Find Industry Collaboration"}),e.jsx("option",{value:"find_sponsorship",children:"Find Sponsorship"}),e.jsx("option",{value:"showcase",children:"Showcase"})]})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Start Date"}),e.jsx("input",{type:"date",value:a.start_date,onChange:t=>l("start_date",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"End Date"}),e.jsx("input",{type:"date",value:a.end_date,min:a.start_date||"",onChange:t=>l("end_date",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Upload Image"}),e.jsx("input",{type:"file",accept:"image/*",onChange:t=>l("image",t.target.files[0]),className:"mt-1 w-full rounded-lg border-gray-200 p-2 text-sm"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Upload Attachment"}),e.jsx("input",{type:"file",onChange:t=>l("attachment",t.target.files[0]),className:"mt-1 w-full rounded-lg border-gray-200 p-2 text-sm"})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Contact Email"}),e.jsx("input",{type:"email",value:a.email,onChange:t=>l("email",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter email"}),e.jsxs("div",{className:"mt-2 flex items-center",children:[e.jsx("input",{type:"checkbox",id:"usePersonalEmail",checked:a.email===i.email,onChange:t=>{t.target.checked?l("email",i.email):l("email","")},className:"form-checkbox h-5 w-5 text-blue-600"}),e.jsxs("label",{htmlFor:"usePersonalEmail",className:"ml-2 text-gray-700",children:["Use personal email (",i.email,")"]})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Location"}),e.jsx("input",{type:"text",value:a.location,onChange:t=>l("location",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter location"}),r.location&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.location})]})]}),e.jsx("div",{className:"flex space-x-4",children:e.jsx("button",{type:"button",onClick:()=>{n()},disabled:x,className:"inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600",children:"Publish"})})]})})})}export{N as default};
