import{W as P,r as m,j as e}from"./app-DobSmQqa.js";import{M as I}from"./MainLayout-CaEcUIQW.js";import"./index-BrQZcsRr.js";function Q({postEvent:n,auth:o,isPostgraduate:S}){var b,j,f,N,v,y,_,k,C,w,A;const{data:a,setData:r,post:T,processing:D,errors:c}=P({event_name:n.event_name||"",description:n.description||"",image:n.image||null,event_type:n.event_type||"conference",theme:n.theme?JSON.parse(n.theme):[],location:n.location||"",start_date_time:n.start_date_time||"",end_date_time:n.end_date_time||"",organized_by:n.organized_by||"",target_audience:n.target_audience?JSON.parse(n.target_audience):[],registration_url:n.registration_url||"",registration_deadline:n.registration_deadline||"",fees:n.fees||"",contact_email:n.contact_email||"",contact_number:n.contact_number||"",agenda:n.agenda||"",speakers:n.speakers||"",sponsors:n.sponsors||"",attachment:n.attachment||null,event_status:n.event_status||"draft",is_featured:n.is_featured||!1}),[u,R]=m.useState(!1),[x,F]=m.useState(!1),[d,h]=m.useState(""),[i,g]=m.useState(""),p=()=>{var t,l;d.trim()!==""&&!((t=a.theme)!=null&&t.includes(d))?(r("theme",[...a.theme||[],d]),h("")):i.trim()!==""&&!((l=a.target_audience)!=null&&l.includes(i))&&(r("target_audience",[...a.target_audience||[],i]),g(""))},O=t=>{var l;r("theme",(l=a.theme)==null?void 0:l.filter(s=>s!==t))},z=t=>{var l;r("target_audience",(l=a.target_audience)==null?void 0:l.filter(s=>s!==t))},U=async t=>{t.preventDefault();const l=new FormData;Object.keys(a).forEach(s=>{s==="theme"||s==="target_audience"?l.append(s,JSON.stringify(a[s])):(a[s]instanceof File,l.append(s,a[s]))}),console.log("Form Data Contents:");for(let s of l.entries())console.log(s[0]+": "+s[1]);T(route("post-events.update",n.id),{data:l,headers:{"Content-Type":"multipart/form-data"},onSuccess:()=>{alert("Event updated successfully!")},onError:s=>{console.error("Error updating event:",s),alert("Failed to update the event. Please try again.")}})};return e.jsx(I,{title:"",isPostgraduate:S,children:e.jsx("div",{className:"p-4",children:e.jsxs("form",{onSubmit:U,className:"bg-white p-6 rounded-lg max-w-7xl mx-auto space-y-6",children:[e.jsx("h1",{className:"text-xl font-bold text-gray-700 text-center",children:"Edit Event"}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-gray-700 font-medium",children:["Event Name ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("input",{type:"text",value:a.event_name,onChange:t=>r("event_name",t.target.value),className:"w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter Event Name"}),c.event_name&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:c.event_name})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-gray-700 font-medium",children:["Description ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("textarea",{value:a.description,onChange:t=>r("description",t.target.value),className:"w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter description"}),c.description&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:c.description})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Event Type"}),e.jsxs("select",{id:"event_type",name:"event_type",value:a.event_type,onChange:t=>r("event_type",t.target.value),className:"w-full rounded-lg border-gray-200 p-4 text-sm",children:[e.jsx("option",{value:"competition",children:"Competition"}),e.jsx("option",{value:"conference",children:"Conference"}),e.jsx("option",{value:"workshop",children:"Workshop"}),e.jsx("option",{value:"seminar",children:"Seminar"}),e.jsx("option",{value:"webinar",children:"Webinar"})]}),c.event_type&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:c.event_type})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Location"}),e.jsx("input",{type:"text",value:a.location,onChange:t=>r("location",t.target.value),className:"w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter location"}),c.location&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:c.location})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Start Date Time"}),e.jsx("input",{type:"datetime-local",value:a.start_date_time,onChange:t=>r("start_date_time",t.target.value),className:"w-full rounded-lg border-gray-200 p-4 text-sm"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"End Date Time"}),e.jsx("input",{type:"datetime-local",value:a.end_date_time,onChange:t=>r("end_date_time",t.target.value),className:"w-full rounded-lg border-gray-200 p-4 text-sm"})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Organized By"}),e.jsx("input",{type:"text",value:a.organized_by,onChange:t=>r("organized_by",t.target.value),className:"w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter organizer"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Contact Number"}),e.jsx("input",{type:"text",value:a.contact_number,onChange:t=>r("contact_number",t.target.value),className:"w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter contact number"})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsx("div",{children:e.jsxs("div",{className:"relative",children:[e.jsx("label",{htmlFor:"theme",className:"block text-gray-700 font-medium",children:"Theme"}),e.jsx("button",{type:"button",className:"w-full text-left border rounded-lg p-4 mt-1 text-sm bg-white",onClick:()=>R(!u),children:"Select or Add Theme"}),u&&e.jsxs("div",{className:"absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg",children:[e.jsxs("div",{className:"flex flex-col p-2 max-h-40 overflow-y-auto",children:[e.jsxs("label",{className:"inline-flex items-center py-1",children:[e.jsx("input",{type:"checkbox",name:"theme",value:"Artificial Intelligence",checked:(b=a.theme)==null?void 0:b.includes("Artificial Intelligence"),onChange:t=>{const l=t.target.value;r("theme",t.target.checked?[...a.theme||[],l]:a.theme.filter(s=>s!==l))},className:"form-checkbox rounded text-blue-500"}),e.jsx("span",{className:"ml-2",children:"Artificial Intelligence"})]}),e.jsxs("label",{className:"inline-flex items-center py-1",children:[e.jsx("input",{type:"checkbox",name:"theme",value:"Quantum Computing",checked:(j=a.theme)==null?void 0:j.includes("Quantum Computing"),onChange:t=>{const l=t.target.value;r("theme",t.target.checked?[...a.theme||[],l]:a.theme.filter(s=>s!==l))},className:"form-checkbox rounded text-blue-500"}),e.jsx("span",{className:"ml-2",children:"Quantum Computing"})]}),e.jsxs("label",{className:"inline-flex items-center py-1",children:[e.jsx("input",{type:"checkbox",name:"theme",value:"Climate Change",checked:(f=a.theme)==null?void 0:f.includes("Climate Change"),onChange:t=>{const l=t.target.value;r("theme",t.target.checked?[...a.theme||[],l]:a.theme.filter(s=>s!==l))},className:"form-checkbox rounded text-blue-500"}),e.jsx("span",{className:"ml-2",children:"Climate Change"})]}),e.jsxs("label",{className:"inline-flex items-center py-1",children:[e.jsx("input",{type:"checkbox",name:"theme",value:"Clean Energy",checked:(N=a.theme)==null?void 0:N.includes("Clean Energy"),onChange:t=>{const l=t.target.value;r("theme",t.target.checked?[...a.theme||[],l]:a.theme.filter(s=>s!==l))},className:"form-checkbox rounded text-blue-500"}),e.jsx("span",{className:"ml-2",children:"Clean Energy"})]}),e.jsxs("label",{className:"inline-flex items-center py-1",children:[e.jsx("input",{type:"checkbox",name:"theme",value:"Robotics",checked:(v=a.theme)==null?void 0:v.includes("Robotics"),onChange:t=>{const l=t.target.value;r("theme",t.target.checked?[...a.theme||[],l]:a.theme.filter(s=>s!==l))},className:"form-checkbox rounded text-blue-500"}),e.jsx("span",{className:"ml-2",children:"Robotics"})]})]}),e.jsxs("div",{className:"border-t border-gray-200 p-2 mt-2",children:[e.jsx("input",{type:"text",value:d,onChange:t=>h(t.target.value),placeholder:"Add custom theme",className:"w-full p-2 border rounded-md text-sm"}),e.jsx("button",{type:"button",onClick:p,className:"mt-2 w-full bg-blue-500 text-white p-2 rounded-md text-sm hover:bg-blue-600",children:"Add Theme"})]})]}),e.jsx("div",{className:"mt-3 flex flex-wrap gap-2",children:(y=a.theme)==null?void 0:y.map(t=>e.jsxs("div",{className:"bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2",children:[t,e.jsx("button",{type:"button",onClick:()=>O(t),className:"text-red-500 hover:text-red-700",children:"×"})]},t))}),c.theme&&e.jsx("p",{className:"text-red-500 text-xs mt-2",children:c.theme})]})}),e.jsx("div",{children:e.jsxs("div",{className:"relative",children:[e.jsx("label",{htmlFor:"target_audience",className:"block text-gray-700 font-medium",children:"Target Audience"}),e.jsx("button",{type:"button",className:"w-full text-left border rounded-lg p-4 mt-1 text-sm bg-white",onClick:()=>F(!x),children:"Select or Add Target Audience"}),x&&e.jsxs("div",{className:"absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg",children:[e.jsxs("div",{className:"flex flex-col p-2 max-h-40 overflow-y-auto",children:[e.jsxs("label",{className:"inline-flex items-center py-1",children:[e.jsx("input",{type:"checkbox",name:"target_audience",value:"Undergraduates",checked:(_=a.target_audience)==null?void 0:_.includes("Undergraduates"),onChange:t=>{const l=t.target.value;r("target_audience",t.target.checked?[...a.target_audience||[],l]:a.target_audience.filter(s=>s!==l))},className:"form-checkbox rounded text-blue-500"}),e.jsx("span",{className:"ml-2",children:"Undergraduates"})]}),e.jsxs("label",{className:"inline-flex items-center py-1",children:[e.jsx("input",{type:"checkbox",name:"target_audience",value:"Postgraduates",checked:(k=a.target_audience)==null?void 0:k.includes("Postgraduates"),onChange:t=>{const l=t.target.value;r("target_audience",t.target.checked?[...a.target_audience||[],l]:a.target_audience.filter(s=>s!==l))},className:"form-checkbox rounded text-blue-500"}),e.jsx("span",{className:"ml-2",children:"Postgraduates"})]}),e.jsxs("label",{className:"inline-flex items-center py-1",children:[e.jsx("input",{type:"checkbox",name:"target_audience",value:"Researchers",checked:(C=a.target_audience)==null?void 0:C.includes("Researchers"),onChange:t=>{const l=t.target.value;r("target_audience",t.target.checked?[...a.target_audience||[],l]:a.target_audience.filter(s=>s!==ttarget_audienceag))},className:"form-checkbox rounded text-blue-500"}),e.jsx("span",{className:"ml-2",children:"Researchers"})]}),e.jsxs("label",{className:"inline-flex items-center py-1",children:[e.jsx("input",{type:"checkbox",name:"target_audience",value:"Academicians",checked:(w=a.target_audience)==null?void 0:w.includes("Academicians"),onChange:t=>{const l=t.target.value;r("target_audience",t.target.checked?[...a.target_audience||[],l]:a.target_audience.filter(s=>s!==l))},className:"form-checkbox rounded text-blue-500"}),e.jsx("span",{className:"ml-2",children:"Academicians"})]})]}),e.jsxs("div",{className:"border-t border-gray-200 p-2 mt-2",children:[e.jsx("input",{type:"text",value:i,onChange:t=>g(t.target.value),placeholder:"Add custom target audience",className:"w-full p-2 border rounded-md text-sm"}),e.jsx("button",{type:"button",onClick:p,className:"mt-2 w-full bg-blue-500 text-white p-2 rounded-md text-sm hover:bg-blue-600",children:"Add Tag"})]})]}),e.jsx("div",{className:"mt-3 flex flex-wrap gap-2",children:(A=a.target_audience)==null?void 0:A.map(t=>e.jsxs("div",{className:"bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2",children:[t,e.jsx("button",{type:"button",onClick:()=>z(t),className:"text-red-500 hover:text-red-700",children:"×"})]},t))}),c.target_audience&&e.jsx("p",{className:"text-red-500 text-xs mt-2",children:c.target_audience})]})})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Upload Image"}),e.jsx("input",{type:"file",accept:"image/*",onChange:t=>r("image",t.target.files[0]),className:"w-full rounded-lg border-gray-200 p-2 text-sm"}),n.image&&e.jsxs("p",{className:"text-gray-600 text-sm mt-2",children:["Current Image:"," ",e.jsx("a",{href:`/storage/${n.image}`,target:"_blank",rel:"noopener noreferrer",className:"text-blue-500 underline",children:"View Image"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Upload Attachment"}),e.jsx("input",{type:"file",onChange:t=>r("attachment",t.target.files[0]),className:"w-full rounded-lg border-gray-200 p-2 text-sm"}),n.attachment&&e.jsxs("p",{className:"text-gray-600 text-sm mt-2",children:["Current Attachment:"," ",e.jsx("a",{href:`/storage/${n.attachment}`,target:"_blank",rel:"noopener noreferrer",className:"text-blue-500 underline",children:"View Attachment"})]})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Registration URL"}),e.jsx("input",{type:"url",value:a.registration_url,onChange:t=>r("registration_url",t.target.value),className:"w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter registration URL"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Registration Deadline"}),e.jsx("input",{type:"date",value:a.registration_deadline,onChange:t=>r("registration_deadline",t.target.value),className:"w-full rounded-lg border-gray-200 p-4 text-sm"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Agenda"}),e.jsx("textarea",{value:a.agenda,onChange:t=>r("agenda",t.target.value),className:"w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter agenda"}),c.agenda&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:c.agenda})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Speakers"}),e.jsx("textarea",{value:a.speakers,onChange:t=>r("speakers",t.target.value),className:"w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter speakers"}),c.speakers&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:c.speakers})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Sponsors"}),e.jsx("textarea",{value:a.sponsors,onChange:t=>r("sponsors",t.target.value),className:"w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter sponsors"}),c.sponsors&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:c.sponsors})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Fees"}),e.jsx("input",{type:"number",value:a.fees,onChange:t=>r("fees",t.target.value),className:"w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter fees (e.g., 5000.00)"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Contact Email"}),e.jsx("input",{type:"email",value:a.contact_email,onChange:t=>r("contact_email",t.target.value),className:"w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter contact email"}),e.jsxs("div",{className:"mt-2 flex items-center",children:[e.jsx("input",{type:"checkbox",id:"usePersonalEmail",checked:a.contact_email===o.email,onChange:t=>{t.target.checked?r("contact_email",o.email):r("contact_email","")},className:"form-checkbox h-5 w-5 text-blue-600"}),e.jsxs("label",{htmlFor:"usePersonalEmail",className:"ml-2 text-gray-700",children:["Use personal email (",o.email,")"]})]})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Event Status"}),e.jsxs("select",{value:a.event_status,onChange:t=>r("event_status",t.target.value),className:"w-full rounded-lg border-gray-200 p-4 text-sm",children:[e.jsx("option",{value:"draft",children:"Draft"}),e.jsx("option",{value:"published",children:"Published"}),e.jsx("option",{value:"cancelled",children:"Cancelled"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Featured Event"}),e.jsxs("div",{className:"flex items-center space-x-4 mt-2",children:[e.jsxs("label",{className:"flex items-center",children:[e.jsx("input",{type:"radio",name:"is_featured",value:"true",checked:a.is_featured===1,onChange:()=>r("is_featured",1),className:"form-radio h-5 w-5 text-blue-600"}),e.jsx("span",{className:"ml-2 text-gray-700",children:"Yes"})]}),e.jsxs("label",{className:"flex items-center",children:[e.jsx("input",{type:"radio",name:"is_featured",value:"false",checked:a.is_featured===0,onChange:()=>r("is_featured",0),className:"form-radio h-5 w-5 text-blue-600"}),e.jsx("span",{className:"ml-2 text-gray-700",children:"No"})]})]})]})]}),e.jsxs("div",{className:"flex space-x-4",children:[e.jsx("button",{type:"button",onClick:()=>window.history.back(),className:"inline-block rounded-lg bg-gray-200 px-5 py-3 text-sm font-medium text-gray-700",children:"Cancel"}),e.jsx("button",{type:"submit",disabled:D,className:"inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600",children:"Save"})]})]})})})}export{Q as default};