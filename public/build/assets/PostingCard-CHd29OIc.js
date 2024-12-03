import{r as c,j as e,c as $}from"./app-BeyZeKeU.js";const S=({data:x,title:r,isProject:n,isEvent:l,isGrant:i})=>{const[b,h]=c.useState(!1),[s,N]=c.useState(null),[o,f]=c.useState(""),[d,g]=c.useState(1),y=a=>{N(a),h(!0)},j=()=>{h(!1),N(null)};function v(a,t,A){$.post("/click-tracking",{entity_type:a,entity_id:t,action:A}).then(p=>{console.log("Click tracked successfully:",p.data)}).catch(p=>{console.error("Error tracking click:",p)})}const _=[...new Set(x.map(a=>n?a.project_type:l?a.event_type:i?a.category:null))].filter(Boolean),u=x.filter(a=>o===""?!0:n?a.project_type===o:l?a.event_type===o:i?a.category===o:!0),m=8,k=Math.ceil(u.length/m),C=u.slice((d-1)*m,d*m),w=a=>{g(a)};return e.jsxs("div",{className:"container mx-auto px-4",children:[e.jsx("div",{className:"mb-6 flex justify-center",children:e.jsxs("select",{className:"p-2 border border-gray-300 rounded w-full sm:w-1/6",value:o,onChange:a=>{f(a.target.value),g(1)},children:[e.jsx("option",{value:"",children:n?"All Project Types":l?"All Event Types":"All Categories"}),_.map((a,t)=>e.jsx("option",{value:a,children:a},t))]})}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",children:C.map((a,t)=>e.jsxs("div",{className:"bg-white rounded-lg shadow-md overflow-hidden text-center pb-8",children:[e.jsx("img",{src:a.image!==null?`/storage/${a.image}`:"/storage/default.jpg",alt:a[r],className:"w-full h-48 object-cover"}),e.jsxs("div",{className:"p-8",children:[e.jsx("h2",{className:"text-xl font-semibold text-gray-800 text-center truncate",style:{maxWidth:"100%"},title:a[r],children:a[r]}),e.jsx("p",{className:"text-gray-600 mt-4 text-center truncate",style:{maxWidth:"100%"},children:a.description})]}),e.jsx("button",{onClick:()=>{y(a),v(n?"project":l?"event":"grant",a.id,"view_details")},className:"inline-block rounded-full border border-gray-300 px-7 py-2 text-base font-medium text-body-color transition hover:border-primary hover:bg-primary hover:text-dark dark:border-dark-300 dark:text-dark-600",children:"View Details"})]},t))}),e.jsx("div",{className:"flex justify-center mt-6 space-x-2",children:Array.from({length:k},(a,t)=>e.jsx("button",{onClick:()=>w(t+1),className:`px-4 py-2 border rounded ${d===t+1?"bg-blue-500 text-white":"bg-white text-gray-700"}`,children:t+1},t))}),b&&s&&e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto",onClick:j,children:e.jsxs("div",{className:"bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl relative overflow-y-auto max-h-[90vh]",onClick:a=>a.stopPropagation(),children:[s.image&&e.jsx("img",{src:s.image!==null?`/storage/${s.image}`:"/storage/default.jpg",alt:s[r],className:"w-full h-48 object-cover rounded-t-lg mb-4"}),e.jsx("h3",{className:"text-xl font-bold mb-4 text-gray-800 text-center",children:s[r]}),e.jsxs("div",{className:"space-y-4",children:[n&&e.jsxs(e.Fragment,{children:[e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Description:"})," ",s.description||"No description available."]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Category:"})," ",s.project_type||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Project Duration:"})," ",s.start_date?`${s.start_date} - ${s.end_date}`:"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Purpose:"})," ",s.purpose==="find_accollaboration"&&"Find Academician Collaboration",s.purpose==="find_incollaboration"&&"Find Industry Collaboration",s.purpose==="find_sponsorship"&&"Find Sponsorship"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Contact Email:"})," ",s.email||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Contact No.:"})," ",s.contact_number||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Location:"})," ",s.location||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Budget:"})," ",s.budget||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Attachment:"})," ",s.attachment?e.jsx("a",{href:`/storage/${s.attachment}`,target:"_blank",rel:"noopener noreferrer",className:"text-blue-500 underline",children:"View Attachment"}):"No attachment available."]})]}),l&&e.jsxs(e.Fragment,{children:[e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Description:"})," ",s.description||"No description available."]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Event type:"})," ",(()=>{switch(s.event_type){case"competition":return"Competition";case"conference":return"Conference";case"workshop":return"Workshop";case"seminar":return"Seminar";case"webinar":return"Webinar";default:return"Not provided"}})()]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Event Duration:"})," ",s.start_date_time?`${s.start_date_time} - ${s.end_date_time}`:"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Target Audience:"})," ",(()=>{try{const a=JSON.parse(s.target_audience);return Array.isArray(a)?a.join(", "):"Invalid format"}catch{return s.target_audience||"Not provided"}})()]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Organized by:"})," ",s.organized_by||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Registration Link:"})," ",s.registration_url?e.jsx("a",{href:s.registration_url,target:"_blank",rel:"noopener noreferrer",className:"text-blue-500 underline",children:"Click Here"}):"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Registration Deadline:"})," ",s.registration_deadline||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Contact Email:"})," ",s.contact_email||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Contact No.:"})," ",s.contact_number||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Location:"})," ",s.location||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Fees:"})," ",s.fees||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Attachment:"})," ",s.attachment?e.jsx("a",{href:`/storage/${s.attachment}`,target:"_blank",rel:"noopener noreferrer",className:"text-blue-500 underline",children:"View Attachment"}):"No attachment available."]})]}),i&&e.jsxs(e.Fragment,{children:[e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Description:"})," ",s.description||"No description available."]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Category:"})," ",s.category||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Purpose:"})," ",s.purpose==="find_pgstudent"&&"Find Postgraduate Student",s.purpose==="find_collaboration"&&"Find Collaboration"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Grant Duration:"})," ",s.start_date?`${s.start_date} - ${s.end_date}`:"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Sponsored by:"})," ",s.sponsored_by||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Application Link:"})," ",s.application_url||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Contact Email:"})," ",s.email||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Contact No.:"})," ",s.contact_number||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Location:"})," ",s.location||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Budget:"})," ",s.budget||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Attachment:"})," ",s.attachment?e.jsx("a",{href:`/storage/${s.attachment}`,target:"_blank",rel:"noopener noreferrer",className:"text-blue-500 underline",children:"View Attachment"}):"No attachment available."]})]})]}),e.jsx("div",{className:"mt-6 text-center",children:e.jsx("button",{onClick:j,className:"px-6 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition duration-200",children:"Close"})})]})})]})};export{S as P};