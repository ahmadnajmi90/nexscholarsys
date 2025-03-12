import{q as v,W as y,r as o,j as e}from"./app-ChsSQ4Ga.js";import{M as b}from"./MainLayout-ClqbEpvH.js";import f from"./NationalityForm-Bz6xobyL.js";import{R as w}from"./quill.snow-D0BadhkQ.js";import{u as N}from"./useRoles-BrZDxiq8.js";import{I as s}from"./InputLabel-wUoq7AK8.js";import"./index-CziZd4Rt.js";import"./react-select.esm-BSyqdgGn.js";function D(){const{auth:c}=v().props;N();const{data:a,setData:n,post:g,processing:j,errors:l}=y({title:"",description:"",start_date:"",end_date:"",application_deadline:"",grant_type:"",grant_theme:[],cycle:"",sponsored_by:"",email:"",website:"",country:"",image:null,attachment:null,status:"published"});o.useState(a.university);const[d,h]=o.useState(!1),m=o.useRef(null);o.useEffect(()=>{const t=i=>{m.current&&!m.current.contains(i.target)&&h(!1)};return document.addEventListener("mousedown",t),()=>{document.removeEventListener("mousedown",t)}},[d]);const p=t=>{a.grant_theme.includes(t)?n("grant_theme",a.grant_theme.filter(i=>i!==t)):n("grant_theme",[...a.grant_theme,t])};o.useState("");function x(t){t&&t.preventDefault();const i=new FormData;Object.keys(a).forEach(r=>{a[r]instanceof File?i.append(r,a[r]):Array.isArray(a[r])?i.append(r,JSON.stringify(a[r])):i.append(r,a[r])});for(let[r,u]of i.entries())console.log(`${r}: ${u}`),console.log(`${r}: ${typeof u}`);g(route("post-grants.store"),{data:i,headers:{"Content-Type":"multipart/form-data"},onSuccess:()=>{alert("Grant posted successfully.")},onError:r=>{console.error("Error updating profile:",r),alert("Failed to post the grant. Please try again.")}})}return e.jsx(b,{title:"",children:e.jsxs("div",{className:"p-4",children:[e.jsx("button",{onClick:()=>window.history.back(),className:"absolute top-4 left-4 text-gray-700 hover:text-gray-900",children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:"2",stroke:"currentColor",className:"w-6 h-6",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M15 19l-7-7 7-7"})})}),e.jsxs("form",{onSubmit:x,className:"bg-white p-6 rounded-lg max-w-7xl mx-auto space-y-6",children:[e.jsx("h1",{className:"text-xl font-bold text-gray-700 text-center",children:"Add New Grant"}),e.jsxs("div",{children:[e.jsx(s,{htmlFor:"title",value:"Grant Name",required:!0}),e.jsx("input",{id:"title",type:"text",value:a.title,onChange:t=>n("title",t.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",placeholder:"Enter grant title"}),l.title&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:l.title})]}),e.jsxs("div",{children:[e.jsx(s,{htmlFor:"description",value:"Grant Description",required:!0}),e.jsx("div",{className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",style:{height:"300px",overflowY:"auto"},children:e.jsx(w,{theme:"snow",value:a.description,onChange:t=>n("description",t),placeholder:"Enter description",style:{height:"300px",maxHeight:"300px"}})}),l.description&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:l.description})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx(s,{htmlFor:"start_date",value:"Start Date (Grant)"}),e.jsx("input",{id:"start_date",type:"date",value:a.start_date,onChange:t=>n("start_date",t.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm"}),l.start_date&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:l.start_date})]}),e.jsxs("div",{children:[e.jsx(s,{htmlFor:"end_date",value:"End Date (Grant)"}),e.jsx("input",{id:"end_date",type:"date",value:a.end_date,min:a.start_date||"",onChange:t=>n("end_date",t.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm"}),l.end_date&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:l.end_date})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx(s,{htmlFor:"application_deadline",value:"Application Deadline"}),e.jsx("input",{id:"application_deadline",type:"date",value:a.application_deadline,onChange:t=>n("application_deadline",t.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm"}),l.application_deadline&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:l.application_deadline})]}),e.jsxs("div",{children:[e.jsx(s,{htmlFor:"grant_type",value:"Grant Type"}),e.jsxs("select",{id:"grant_type",value:a.grant_type,onChange:t=>n("grant_type",t.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select a Grant Type"}),e.jsx("option",{value:"Matching Grant",children:"Matching Grant"}),e.jsx("option",{value:"Seed Grant",children:"Seed Grant"}),e.jsx("option",{value:"Research Grant",children:"Research Grant"}),e.jsx("option",{value:"Travel Grant",children:"Travel Grant"}),e.jsx("option",{value:"Innovation Grant",children:"Innovation Grant"}),e.jsx("option",{value:"Collaboration Grant",children:"Collaboration Grant"}),e.jsx("option",{value:"Training Grant",children:"Training Grant"}),e.jsx("option",{value:"Capacity-Building Grant",children:"Capacity-Building Grant"}),e.jsx("option",{value:"Community Grant",children:"Community Grant"}),e.jsx("option",{value:"Development Grant",children:"Development Grant"}),e.jsx("option",{value:"Pilot Grant",children:"Pilot Grant"}),e.jsx("option",{value:"Commercialization Grant",children:"Commercialization Grant"}),e.jsx("option",{value:"Technology Grant",children:"Technology Grant"}),e.jsx("option",{value:"Sponsorship Grant",children:"Sponsorship Grant"}),e.jsx("option",{value:"Social Impact Grant",children:"Social Impact Grant"}),e.jsx("option",{value:"Emergency or Relief Grant",children:"Emergency or Relief Grant"}),e.jsx("option",{value:"International Grant",children:"International Grant"}),e.jsx("option",{value:"Equipment Grant",children:"Equipment Grant"}),e.jsx("option",{value:"Small Business Grant",children:"Small Business Grant"})]}),l.grant_type&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:l.grant_type})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{ref:m,children:[e.jsx(s,{value:"Grant Theme (Multiselect)"}),e.jsx("div",{className:`relative mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 px-2.5 cursor-pointer bg-white ${d?"shadow-lg":""}`,onClick:()=>h(!d),children:a.grant_theme&&a.grant_theme.length>0?a.grant_theme.join(", "):"Select Grant Themes"}),d&&e.jsx("div",{className:"absolute z-10 mt-2 bg-white border border-gray-300 rounded shadow-lg w-[37.5rem]",children:e.jsxs("div",{className:"p-2 space-y-2",children:[e.jsxs("label",{className:"flex items-center",children:[e.jsx("input",{type:"checkbox",value:"Science & Technology",checked:a.grant_theme.includes("Science & Technology"),onChange:t=>p(t.target.value),className:"mr-2"}),e.jsx("span",{children:"Science & Technology"})]}),e.jsxs("label",{className:"flex items-center",children:[e.jsx("input",{type:"checkbox",value:"Social Science",checked:a.grant_theme.includes("Social Science"),onChange:t=>p(t.target.value),className:"mr-2"}),e.jsx("span",{children:"Social Science"})]})]})}),l.grant_theme&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:l.grant_theme})]}),e.jsxs("div",{children:[e.jsx(s,{htmlFor:"cycle",value:"Cycle"}),e.jsxs("select",{id:"cycle",value:a.cycle,onChange:t=>n("cycle",t.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select Cycle"}),e.jsx("option",{value:"No Cycle",children:"No Cycle"}),e.jsx("option",{value:"Cycle 1",children:"Cycle 1"}),e.jsx("option",{value:"Cycle 2",children:"Cycle 2"}),e.jsx("option",{value:"Cycle 3",children:"Cycle 3"})]}),l.cycle&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:l.cycle})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx(s,{htmlFor:"sponsored_by",value:"Sponsored By"}),e.jsx("input",{id:"sponsored_by",type:"text",value:a.sponsored_by,onChange:t=>n("sponsored_by",t.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",placeholder:"Enter sponsor"}),l.sponsored_by&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:l.sponsored_by})]}),e.jsxs("div",{children:[e.jsx(s,{htmlFor:"email",value:"Contact Email"}),e.jsx("input",{id:"email",type:"email",value:a.email,onChange:t=>n("email",t.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",placeholder:"Enter email"}),l.email&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:l.email}),e.jsxs("div",{className:"mt-2 flex items-center",children:[e.jsx("input",{type:"checkbox",id:"usePersonalEmail",checked:a.email===c.email,onChange:t=>{t.target.checked?n("email",c.email):n("email","")},className:"form-checkbox h-5 w-5 text-blue-600"}),e.jsxs("label",{htmlFor:"usePersonalEmail",className:"ml-2 text-gray-700",children:["Use personal email (",c.email,")"]})]})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx(s,{htmlFor:"website",value:"Website / Link"}),e.jsx("input",{id:"website",type:"url",value:a.website,onChange:t=>n("website",t.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",placeholder:"Enter Website / Link"}),l.website&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:l.website})]}),e.jsxs("div",{children:[e.jsx(f,{title:"Country",value:a.country,isNotSpecify:!0,onChange:t=>n("country",t)}),l.country&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:l.country})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx(s,{htmlFor:"image",value:"Upload Image"}),e.jsx("input",{id:"image",type:"file",accept:"image/*",onChange:t=>n("image",t.target.files[0]),className:"mt-1 block w-full border-gray-300 rounded-md py-2 text-sm"}),l.image&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:l.image})]}),e.jsxs("div",{children:[e.jsx(s,{htmlFor:"attachment",value:"Upload Attachment"}),e.jsx("input",{id:"attachment",type:"file",onChange:t=>n("attachment",t.target.files[0]),className:"mt-1 block w-full border-gray-300 rounded-md py-2 text-sm"}),l.attachment&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:l.attachment})]})]}),e.jsx("div",{className:"flex space-x-4",children:e.jsx("button",{type:"button",onClick:()=>{x()},disabled:j,className:"inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600",children:"Publish"})})]})]})})}export{D as default};
