import{W as x,j as e}from"./app-DEz1GiSY.js";import{M as u}from"./MainLayout-B4TFnIW4.js";import{R as g}from"./quill.snow-DyTacJnY.js";import h from"./NationalityForm-N79QIFbC.js";import{u as p}from"./useRoles-DxDeXZwp.js";import"./index-DK5oFF98.js";function N({postEvent:l,auth:d}){p();const{data:a,setData:n,post:o,processing:m,errors:s}=x({event_name:l.event_name||"",description:l.description||"",event_type:l.event_type||"",event_mode:l.event_mode||"",start_date:l.start_date||"",end_date:l.end_date||"",start_time:l.start_time||"",end_time:l.end_time||"",image:l.image||null,event_theme:l.event_theme||"",registration_url:l.registration_url||"",registration_deadline:l.registration_deadline||"",contact_email:l.contact_email||"",venue:l.venue||"",city:l.city||"",country:l.country||"",event_status:l.event_status||"published"}),c=async t=>{t&&t.preventDefault();const i=new FormData;Object.keys(a).forEach(r=>{a[r]instanceof File,i.append(r,a[r])}),console.log("Form Data Contents:");for(let r of i.entries())console.log(r[0]+": "+r[1]);o(route("post-events.update",l.id),{data:i,headers:{"Content-Type":"multipart/form-data"},onSuccess:()=>{alert("Event updated successfully!")},onError:r=>{console.error("Error updating event:",r),alert("Failed to update the event. Please try again.")}})};return e.jsx(u,{title:"",children:e.jsx("div",{className:"p-4",children:e.jsxs("form",{onSubmit:c,className:"bg-white p-6 rounded-lg max-w-7xl mx-auto space-y-6",children:[e.jsx("h1",{className:"text-xl font-bold text-gray-700 text-center",children:"Edit Event"}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-gray-700 font-medium",children:["Event Name ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("input",{type:"text",value:a.event_name,onChange:t=>n("event_name",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter Event Name"}),s.event_name&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:s.event_name})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-gray-700 font-medium",children:["Event Description ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("div",{className:"mt-1 w-full rounded-lg border border-gray-200 overflow-auto",style:{height:"300px",overflowY:"auto"},children:e.jsx(g,{theme:"snow",value:a.description,onChange:t=>n("description",t),style:{height:"300px",maxHeight:"300px"},className:"text-sm",placeholder:"Enter description"})}),s.description&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:s.description})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Event Type"}),e.jsxs("select",{id:"event_type",name:"event_type",value:a.event_type,onChange:t=>n("event_type",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select Event Type"}),e.jsx("option",{value:"Competition",children:"Competition"}),e.jsx("option",{value:"Conference",children:"Conference"}),e.jsx("option",{value:"Workshop",children:"Workshop"}),e.jsx("option",{value:"Seminar",children:"Seminar"}),e.jsx("option",{value:"Webinar",children:"Webinar"})]}),s.event_type&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:s.event_type})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Event Mode"}),e.jsxs("select",{id:"event_mode",name:"event_mode",value:a.event_mode,onChange:t=>n("event_mode",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select Event Mode"}),e.jsx("option",{value:"Physical",children:"Physical"}),e.jsx("option",{value:"Online",children:"Online"}),e.jsx("option",{value:"Hybrid",children:"Hybrid"})]}),s.event_mode&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:s.event_mode})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Start Date"}),e.jsx("input",{type:"date",value:a.start_date,onChange:t=>n("start_date",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"End Date"}),e.jsx("input",{type:"date",value:a.end_date,min:a.start_date||"",onChange:t=>n("end_date",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Start Time"}),e.jsx("input",{type:"time",value:a.start_time,onChange:t=>n("start_time",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"End Time"}),e.jsx("input",{type:"time",value:a.end_time,onChange:t=>n("end_time",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Upload Image"}),e.jsx("input",{type:"file",accept:"image/*",onChange:t=>n("image",t.target.files[0]),className:"mt-1 w-full rounded-lg border-gray-200 p-2 text-sm"}),l.image&&e.jsxs("p",{className:"text-gray-600 text-sm mt-2",children:["Current Image:"," ",e.jsx("a",{href:`/storage/${l.image}`,target:"_blank",rel:"noopener noreferrer",className:"text-blue-500 underline",children:"View Image"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Event Theme"}),e.jsxs("select",{id:"event_theme",name:"event_theme",value:a.event_theme,onChange:t=>n("event_theme",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select Event Theme"}),e.jsx("option",{value:"Science and Technology",children:"Science and Technology"}),e.jsx("option",{value:"Social Science",children:"Social Science"})]}),s.event_theme&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:s.event_theme})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Registration URL"}),e.jsx("input",{type:"url",value:a.registration_url,onChange:t=>n("registration_url",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter registration URL"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Registration Deadline"}),e.jsx("input",{type:"date",value:a.registration_deadline,onChange:t=>n("registration_deadline",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"})]})]}),e.jsxs("div",{className:"grid grid-cols-3 gap-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Venue"}),e.jsx("input",{type:"text",value:a.venue,onChange:t=>n("venue",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter venue"}),s.venue&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:s.venue})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"City"}),e.jsx("input",{type:"text",value:a.city,onChange:t=>n("city",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter city"}),s.city&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:s.city})]}),e.jsx("div",{children:e.jsx(h,{title:"Country",value:a.country,onChange:t=>n("country",t)})})]}),e.jsx("div",{className:"grid grid-cols-2 gap-8",children:e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Contact Email"}),e.jsx("input",{type:"email",value:a.contact_email,onChange:t=>n("contact_email",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter contact email"}),e.jsxs("div",{className:"mt-2 flex items-center",children:[e.jsx("input",{type:"checkbox",id:"usePersonalEmail",checked:a.contact_email===d.email,onChange:t=>{t.target.checked?n("contact_email",d.email):n("contact_email","")},className:"form-checkbox h-5 w-5 text-blue-600"}),e.jsxs("label",{htmlFor:"usePersonalEmail",className:"ml-2 text-gray-700",children:["Use personal email (",d.email,")"]})]})]})}),e.jsx("div",{className:"flex space-x-4",children:e.jsx("button",{type:"button",onClick:()=>{c()},disabled:m,className:"inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600",children:"Publish"})})]})})})}export{N as default};
