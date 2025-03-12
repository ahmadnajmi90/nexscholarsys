import{q as u,W as p,j as e}from"./app-ChsSQ4Ga.js";import{M as v}from"./MainLayout-ClqbEpvH.js";import{R as g}from"./quill.snow-D0BadhkQ.js";import _ from"./NationalityForm-Bz6xobyL.js";import{u as j}from"./useRoles-BrZDxiq8.js";import{I as l}from"./InputLabel-wUoq7AK8.js";import{S as f}from"./react-select.esm-BSyqdgGn.js";import"./index-CziZd4Rt.js";function $(){var m;const{auth:i,researchOptions:c}=u().props;j();const{data:s,setData:r,post:h,processing:x,errors:a}=p({event_name:"",description:"",event_type:"",event_mode:"",start_date:"",end_date:"",start_time:"",end_time:"",image:null,event_theme:"",field_of_research:[],registration_url:"",registration_deadline:"",contact_email:"",venue:"",city:"",country:"",event_status:"published"});function o(t){t&&t.preventDefault();const d=new FormData;console.log("Data: ",s),Object.keys(s).forEach(n=>{d.append(n,s[n])}),console.log("Form Data Contents:");for(let n of d.entries())console.log(n[0]+": "+n[1]);h(route("post-events.store"),{data:d,headers:{"Content-Type":"multipart/form-data"},onSuccess:()=>{alert("Event posted successfully.")},onError:n=>{console.error("Error updating event:",n),alert("Failed to post the Event. Please try again.")}})}return e.jsx(v,{title:"",children:e.jsx("div",{className:"p-4",children:e.jsxs("form",{onSubmit:o,className:"bg-white p-6 rounded-lg max-w-7xl mx-auto space-y-6",children:[e.jsx("h1",{className:"text-xl font-bold text-gray-700 text-center",children:"Add New Event"}),e.jsxs("div",{children:[e.jsxs(l,{children:["Event Name ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("input",{type:"text",value:s.event_name,onChange:t=>r("event_name",t.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",placeholder:"Enter Event Name"}),a.event_name&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:a.event_name})]}),e.jsxs("div",{children:[e.jsxs(l,{children:["Event Description ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("div",{className:"mt-1 w-full rounded-lg border border-gray-200",style:{height:"300px",overflowY:"auto"},children:e.jsx(g,{theme:"snow",value:s.description,onChange:t=>r("description",t),placeholder:"Enter description",style:{height:"300px",maxHeight:"300px"}})}),a.description&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:a.description})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx(l,{children:"Event Type"}),e.jsxs("select",{id:"event_type",name:"event_type",value:s.event_type,onChange:t=>r("event_type",t.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select Event Type"}),e.jsx("option",{value:"Competition",children:"Competition"}),e.jsx("option",{value:"Conference",children:"Conference"}),e.jsx("option",{value:"Workshop",children:"Workshop"}),e.jsx("option",{value:"Seminar",children:"Seminar"}),e.jsx("option",{value:"Webinar",children:"Webinar"})]}),a.event_type&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:a.event_type})]}),e.jsxs("div",{children:[e.jsx(l,{children:"Event Mode"}),e.jsxs("select",{id:"event_mode",name:"event_mode",value:s.event_mode,onChange:t=>r("event_mode",t.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select Event Mode"}),e.jsx("option",{value:"Physical",children:"Physical"}),e.jsx("option",{value:"Online",children:"Online"}),e.jsx("option",{value:"Hybrid",children:"Hybrid"})]}),a.event_mode&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:a.event_mode})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx(l,{children:"Start Date"}),e.jsx("input",{type:"date",value:s.start_date,onChange:t=>r("start_date",t.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm"}),a.start_date&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:a.start_date})]}),e.jsxs("div",{children:[e.jsx(l,{children:"End Date"}),e.jsx("input",{type:"date",value:s.end_date,min:s.start_date||"",onChange:t=>r("end_date",t.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm"}),a.end_date&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:a.end_date})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx(l,{children:"Start Time"}),e.jsx("input",{type:"time",value:s.start_time,onChange:t=>r("start_time",t.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm"}),a.start_time&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:a.start_time})]}),e.jsxs("div",{children:[e.jsx(l,{children:"End Time"}),e.jsx("input",{type:"time",value:s.end_time,onChange:t=>r("end_time",t.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm"}),a.end_time&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:a.end_time})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx(l,{children:"Event Theme"}),e.jsxs("select",{id:"event_theme",name:"event_theme",value:s.event_theme,onChange:t=>r("event_theme",t.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select Event Theme"}),e.jsx("option",{value:"Science and Technology",children:"Science and Technology"}),e.jsx("option",{value:"Social Science",children:"Social Science"})]}),a.event_theme&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:a.event_theme})]}),e.jsxs("div",{children:[e.jsx(l,{children:"Field of Research"}),e.jsx(f,{id:"field_of_research",isMulti:!0,options:c.map(t=>({value:`${t.field_of_research_id}-${t.research_area_id}-${t.niche_domain_id}`,label:`${t.field_of_research_name} - ${t.research_area_name} - ${t.niche_domain_name}`})),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",classNamePrefix:"select",value:(m=s.field_of_research)==null?void 0:m.map(t=>{const d=c.find(n=>`${n.field_of_research_id}-${n.research_area_id}-${n.niche_domain_id}`===t);return{value:t,label:d?`${d.field_of_research_name} - ${d.research_area_name} - ${d.niche_domain_name}`:t}}),onChange:t=>{const d=t.map(n=>n.value);r("field_of_research",d)},placeholder:"Search and select fields of research..."}),a.field_of_research&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:a.field_of_research})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx(l,{children:"Registration URL"}),e.jsx("input",{type:"url",value:s.registration_url,onChange:t=>r("registration_url",t.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",placeholder:"Enter registration URL"}),a.registration_url&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:a.registration_url})]}),e.jsxs("div",{children:[e.jsx(l,{children:"Registration Deadline"}),e.jsx("input",{type:"date",value:s.registration_deadline,onChange:t=>r("registration_deadline",t.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm"}),a.registration_deadline&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:a.registration_deadline})]})]}),e.jsxs("div",{className:"grid grid-cols-3 gap-6",children:[e.jsxs("div",{children:[e.jsx(l,{children:"Venue"}),e.jsx("input",{type:"text",value:s.venue,onChange:t=>r("venue",t.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",placeholder:"Enter venue"}),a.venue&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:a.venue})]}),e.jsxs("div",{children:[e.jsx(l,{children:"City"}),e.jsx("input",{type:"text",value:s.city,onChange:t=>r("city",t.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",placeholder:"Enter city"}),a.city&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:a.city})]}),e.jsxs("div",{children:[e.jsx(_,{title:"Country",value:s.country,onChange:t=>r("country",t)}),a.country&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:a.country})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx(l,{children:"Contact Email"}),e.jsx("input",{type:"email",value:s.contact_email,onChange:t=>r("contact_email",t.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",placeholder:"Enter contact email"}),a.contact_email&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:a.contact_email}),e.jsxs("div",{className:"mt-2 flex items-center",children:[e.jsx("input",{type:"checkbox",id:"usePersonalEmail",checked:s.contact_email===i.email,onChange:t=>{t.target.checked?r("contact_email",i.email):r("contact_email","")},className:"form-checkbox h-5 w-5 text-blue-600"}),e.jsxs(l,{htmlFor:"usePersonalEmail",className:"ml-2 text-gray-700",children:["Use personal email (",i.email,")"]})]})]}),e.jsxs("div",{children:[e.jsx(l,{children:"Upload Image"}),e.jsx("input",{type:"file",accept:"image/*",onChange:t=>r("image",t.target.files[0]),className:"mt-1 block w-full border-gray-300 rounded-md py-2"}),a.image&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:a.image})]})]}),e.jsx("div",{className:"flex space-x-4",children:e.jsx("button",{type:"button",onClick:()=>o(),disabled:x,className:"inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600",children:"Publish"})})]})})})}export{$ as default};
