import{W as u,j as e}from"./app-UEXgTzw_.js";import{M as g}from"./MainLayout-CjgIh0x8.js";import"./index-F4p-aueL.js";function v({postEvent:a,auth:d,isPostgraduate:o}){const{data:l,setData:n,post:m,processing:x,errors:r}=u({event_name:a.event_name||"",description:a.description||"",event_type:a.event_type||"",event_mode:a.event_mode||"",start_date:a.start_date||"",end_date:a.end_date||"",start_time:a.start_time||"",end_time:a.end_time||"",image:a.image||null,attachment:a.attachment||null,registration_url:a.registration_url||"",registration_deadline:a.registration_deadline||"",contact_email:a.contact_email||"",location:a.location||"",event_status:a.event_status||"published"}),c=async t=>{t&&t.preventDefault();const i=new FormData;Object.keys(l).forEach(s=>{l[s]instanceof File,i.append(s,l[s])}),console.log("Form Data Contents:");for(let s of i.entries())console.log(s[0]+": "+s[1]);m(route("post-events.update",a.id),{data:i,headers:{"Content-Type":"multipart/form-data"},onSuccess:()=>{alert("Event updated successfully!")},onError:s=>{console.error("Error updating event:",s),alert("Failed to update the event. Please try again.")}})};return e.jsx(g,{title:"",isPostgraduate:o,children:e.jsx("div",{className:"p-4",children:e.jsxs("form",{onSubmit:c,className:"bg-white p-6 rounded-lg max-w-7xl mx-auto space-y-6",children:[e.jsx("h1",{className:"text-xl font-bold text-gray-700 text-center",children:"Edit Event"}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-gray-700 font-medium",children:["Event Name ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("input",{type:"text",value:l.event_name,onChange:t=>n("event_name",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter Event Name"}),r.event_name&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.event_name})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-gray-700 font-medium",children:["Event Description ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("textarea",{value:l.description,onChange:t=>n("description",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter description"}),r.description&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.description})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Event Type"}),e.jsxs("select",{id:"event_type",name:"event_type",value:l.event_type,onChange:t=>n("event_type",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select Event Type"}),e.jsx("option",{value:"Competition",children:"Competition"}),e.jsx("option",{value:"Conference",children:"Conference"}),e.jsx("option",{value:"Workshop",children:"Workshop"}),e.jsx("option",{value:"Seminar",children:"Seminar"}),e.jsx("option",{value:"Webinar",children:"Webinar"})]}),r.event_type&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.event_type})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Event Mode"}),e.jsxs("select",{id:"event_mode",name:"event_mode",value:l.event_mode,onChange:t=>n("event_mode",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select Event Mode"}),e.jsx("option",{value:"Physical",children:"Physical"}),e.jsx("option",{value:"Online",children:"Online"}),e.jsx("option",{value:"Hybrid",children:"Hybrid"})]}),r.event_mode&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.event_mode})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Start Date"}),e.jsx("input",{type:"date",value:l.start_date,onChange:t=>n("start_date",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"End Date"}),e.jsx("input",{type:"date",value:l.end_date,min:l.start_date||"",onChange:t=>n("end_date",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Start Time"}),e.jsx("input",{type:"time",value:l.start_time,onChange:t=>n("start_time",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"End Time"}),e.jsx("input",{type:"time",value:l.end_time,onChange:t=>n("end_time",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Upload Image"}),e.jsx("input",{type:"file",accept:"image/*",onChange:t=>n("image",t.target.files[0]),className:"mt-1 w-full rounded-lg border-gray-200 p-2 text-sm"}),a.image&&e.jsxs("p",{className:"text-gray-600 text-sm mt-2",children:["Current Image:"," ",e.jsx("a",{href:`/storage/${a.image}`,target:"_blank",rel:"noopener noreferrer",className:"text-blue-500 underline",children:"View Image"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Upload Attachment"}),e.jsx("input",{type:"file",onChange:t=>n("attachment",t.target.files[0]),className:"mt-1 w-full rounded-lg border-gray-200 p-2 text-sm"}),a.attachment&&e.jsxs("p",{className:"text-gray-600 text-sm mt-2",children:["Current Attachment:"," ",e.jsx("a",{href:`/storage/${a.attachment}`,target:"_blank",rel:"noopener noreferrer",className:"text-blue-500 underline",children:"View Attachment"})]})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Registration URL"}),e.jsx("input",{type:"url",value:l.registration_url,onChange:t=>n("registration_url",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter registration URL"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Registration Deadline"}),e.jsx("input",{type:"date",value:l.registration_deadline,min:l.start_date||"",max:l.end_date||"",onChange:t=>n("registration_deadline",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm"})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Contact Email"}),e.jsx("input",{type:"email",value:l.contact_email,onChange:t=>n("contact_email",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter contact email"}),e.jsxs("div",{className:"mt-2 flex items-center",children:[e.jsx("input",{type:"checkbox",id:"usePersonalEmail",checked:l.contact_email===d.email,onChange:t=>{t.target.checked?n("contact_email",d.email):n("contact_email","")},className:"form-checkbox h-5 w-5 text-blue-600"}),e.jsxs("label",{htmlFor:"usePersonalEmail",className:"ml-2 text-gray-700",children:["Use personal email (",d.email,")"]})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Location"}),e.jsx("input",{type:"text",value:l.location,onChange:t=>n("location",t.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter location"}),r.location&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:r.location})]})]}),e.jsx("div",{className:"flex space-x-4",children:e.jsx("button",{type:"button",onClick:()=>{c()},disabled:x,className:"inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600",children:"Publish"})})]})})})}export{v as default};
