import{W as u,r as c,j as e}from"./app-UEXgTzw_.js";import{M as h}from"./MainLayout-CjgIh0x8.js";import"./index-F4p-aueL.js";function f({postProject:s,auth:d,isPostgraduate:m}){const{data:a,setData:r,post:p,processing:x,errors:n}=u({title:s.title||"",description:s.description||"",project_type:s.project_type||"",purpose:s.purpose||"",start_date:s.start_date||"",end_date:s.end_date||"",image:s.image||null,attachment:s.attachment||null,email:s.email||d.email||"",location:s.location||"",project_status:s.project_status||"published"});c.useState(!1),c.useState("");const o=async t=>{t&&t.preventDefault();const i=new FormData;Object.keys(a).forEach(l=>{l==="image"||l==="attachment"?(a[l]instanceof File||typeof a[l]=="string")&&i.append(l,a[l]):Array.isArray(a[l])?i.append(l,JSON.stringify(a[l])):i.append(l,a[l])}),console.log("Form Data Contents:");for(let l of i.entries())console.log(l[0]+": "+l[1]);p(route("post-projects.update",s.id),{data:i,headers:{"Content-Type":"multipart/form-data"},onSuccess:()=>{alert("Project updated successfully!")},onError:l=>{console.error("Error updating project:",l),alert("Failed to update the project. Please try again.")}})};return e.jsx(h,{title:"",isPostgraduate:m,children:e.jsx("div",{className:"p-4",children:e.jsxs("form",{onSubmit:o,className:"bg-white p-6 rounded-lg max-w-7xl mx-auto space-y-6",children:[e.jsx("h1",{className:"text-xl font-bold text-gray-700 text-center",children:"Edit Project"}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-gray-700 font-medium",children:["Project Name ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("input",{type:"text",value:a.title,onChange:t=>r("title",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter Project Name"}),n.title&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:n.title})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-gray-700 font-medium",children:["Project Description ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("textarea",{value:a.description,onChange:t=>r("description",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter project description"}),n.description&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:n.description})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Project Type"}),e.jsxs("select",{id:"project_type",name:"project_type",value:a.project_type,onChange:t=>r("project_type",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select a Project Type"}),e.jsx("option",{value:"Fundamental Research",children:"Fundamental Research"}),e.jsx("option",{value:"Applied Research",children:"Applied Research"}),e.jsx("option",{value:"Fundamental + Applied",children:"Fundamental + Applied"}),e.jsx("option",{value:"Knowledge Transfer Program (KTP)",children:"Knowledge Transfer Program (KTP)"}),e.jsx("option",{value:"CSR (Corporate Social Responsibility)",children:"CSR (Corporate Social Responsibility)"})]}),n.project_type&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:n.project_type})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Purpose"}),e.jsxs("select",{value:a.purpose,onChange:t=>r("purpose",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:" Select a Purpose"}),e.jsx("option",{value:"find_accollaboration",children:"Find Academician Collaboration"}),e.jsx("option",{value:"find_incollaboration",children:"Find Industry Collaboration"}),e.jsx("option",{value:"find_sponsorship",children:"Find Sponsorship"}),e.jsx("option",{value:"showcase",children:"Showcase"})]})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Start Date"}),e.jsx("input",{type:"date",value:a.start_date,onChange:t=>r("start_date",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"End Date"}),e.jsx("input",{type:"date",value:a.end_date,min:a.start_date||"",onChange:t=>r("end_date",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Upload Image"}),e.jsx("input",{type:"file",accept:"image/*",onChange:t=>r("image",t.target.files[0]),className:"mt-1 w-full rounded-lg border-gray-200 p-2 text-sm"}),s.image&&e.jsxs("p",{className:"text-gray-600 text-sm mt-2",children:["Current Image:"," ",e.jsx("a",{href:`/storage/${s.image}`,target:"_blank",rel:"noopener noreferrer",className:"text-blue-500 underline",children:"View Image"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Upload Attachment"}),e.jsx("input",{type:"file",onChange:t=>r("attachment",t.target.files[0]),className:"mt-1 w-full rounded-lg border-gray-200 p-2 text-sm"}),s.attachment&&e.jsxs("p",{className:"text-gray-600 text-sm mt-2",children:["Current Attachment:"," ",e.jsx("a",{href:`/storage/${s.attachment}`,target:"_blank",rel:"noopener noreferrer",className:"text-blue-500 underline",children:"View Attachment"})]})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Contact Email"}),e.jsx("input",{type:"email",value:a.email,onChange:t=>r("email",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter email"}),e.jsxs("div",{className:"mt-2 flex items-center",children:[e.jsx("input",{type:"checkbox",id:"usePersonalEmail",checked:a.email===d.email,onChange:t=>{t.target.checked?r("email",d.email):r("email","")},className:"form-checkbox h-5 w-5 text-blue-600"}),e.jsxs("label",{htmlFor:"usePersonalEmail",className:"ml-2 text-gray-700",children:["Use personal email (",d.email,")"]})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Location"}),e.jsx("input",{type:"text",value:a.location,onChange:t=>r("location",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter location"}),n.location&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:n.location})]})]}),e.jsx("div",{className:"flex space-x-4",children:e.jsx("button",{type:"button",onClick:()=>{o()},disabled:x,className:"inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600",children:"Publish"})})]})})})}export{f as default};
