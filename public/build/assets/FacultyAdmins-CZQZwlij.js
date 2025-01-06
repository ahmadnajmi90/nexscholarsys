import{W as p,r as y,j as e}from"./app-ShVm9Cha.js";import{M as j}from"./MainLayout-JQZNHxtV.js";import{T as m,I as i}from"./TextInput-BxvWnrDm.js";import{I as o}from"./InputLabel-C-2vVwRz.js";import"./index-c-ksJXLf.js";import"./useRoles-DyacMrNt.js";const F=({universities:n,faculties:d})=>{const{data:a,setData:r,post:c,errors:s}=p({email:"",worker_id:"",university:"",faculty:""}),[u,x]=y.useState(a.university),v=d.filter(t=>t.university_id===parseInt(u)),h=t=>{t.preventDefault(),c(route("faculty-admins.store"),{onSuccess:()=>{alert("Create faculty admin successfully.")},onError:l=>{console.error("Error create faculty admin:",l),alert("Failed to create faculty admin. Please try again.")}})};return e.jsx(j,{title:"",children:e.jsxs("div",{className:"px-2 bg-white",children:[e.jsx("h1",{className:"text-2xl font-bold mb-4",children:"Create Faculty Admin"}),e.jsxs("form",{onSubmit:h,children:[e.jsxs("div",{className:"mt-4",children:[e.jsx(o,{htmlFor:"email",value:"Email"}),e.jsx(m,{id:"email",name:"email",value:a.email,className:"mt-1 block w-full",autoComplete:"email",isFocused:!0,onChange:t=>r("email",t.target.value),required:!0}),e.jsx(i,{message:s.email,className:"mt-2"})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx(o,{htmlFor:"worker_id",value:"Worker ID"}),e.jsx(m,{id:"worker_id",name:"worker_id",value:a.worker_id,className:"mt-1 block w-full",autoComplete:"worker_id",isFocused:!0,onChange:t=>r("worker_id",t.target.value),required:!0}),e.jsx(i,{message:s.worker_id,className:"mt-2"})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx(o,{htmlFor:"university",value:"University",required:!0}),e.jsxs("select",{id:"university",className:"mt-1 block w-full border rounded-md p-2",value:u||"",onChange:t=>{const l=t.target.value;x(l),r("university",l)},children:[e.jsx("option",{value:"",hidden:!0,children:"Select your University"}),n.map(t=>e.jsx("option",{value:t.id,children:t.full_name},t.id))]}),e.jsx(i,{className:"mt-2",message:s.university})]}),u&&e.jsxs("div",{className:"mt-4",children:[e.jsx(o,{htmlFor:"faculty",value:"Faculty",required:!0}),e.jsxs("select",{id:"faculty",className:"mt-1 block w-full border rounded-md p-2",value:a.faculty||"",onChange:t=>r("faculty",t.target.value),children:[e.jsx("option",{value:"",hidden:!0,children:"Select your Faculty"}),v.map(t=>e.jsx("option",{value:t.id,children:t.name},t.id))]}),e.jsx(i,{className:"mt-2",message:s.faculty})]}),e.jsx("button",{type:"submit",className:"bg-blue-500 text-white px-4 py-2 rounded mt-4",children:"Create"})]})]})})};export{F as default};