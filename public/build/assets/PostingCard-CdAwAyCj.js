import{r as i,j as e,d as A}from"./app-CwtFbiEg.js";const F=({data:x,title:l,isProject:r,isEvent:n,isGrant:c})=>{const[b,h]=i.useState(!1),[s,g]=i.useState(null),[o,y]=i.useState(""),[d,N]=i.useState(1),f=t=>{g(t),h(!0)},j=()=>{h(!1),g(null)};function v(t,a,$){A.post("/click-tracking",{entity_type:t,entity_id:a,action:$}).then(p=>{console.log("Click tracked successfully:",p.data)}).catch(p=>{console.error("Error tracking click:",p)})}const _=[...new Set(x.map(t=>r?t.project_type:n?t.event_type:c?t.category:null))].filter(Boolean),u=x.filter(t=>o===""?!0:r?t.project_type===o:n?t.event_type===o:c?t.category===o:!0),m=8,k=Math.ceil(u.length/m),w=u.slice((d-1)*m,d*m),C=t=>{N(t)};return e.jsxs("div",{className:"container mx-auto px-4",children:[e.jsx("div",{className:"mb-6 flex justify-center",children:e.jsxs("select",{className:"p-2 border border-gray-300 rounded w-full sm:w-1/6",value:o,onChange:t=>{y(t.target.value),N(1)},children:[e.jsx("option",{value:"",children:r?"All Project Types":n?"All Event Types":"All Categories"}),_.map((t,a)=>e.jsx("option",{value:t,children:t},a))]})}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",children:w.map((t,a)=>e.jsxs("div",{className:"bg-white rounded-lg shadow-md overflow-hidden text-center pb-8",children:[e.jsx("img",{src:t.image!==null?`/storage/${t.image}`:"/storage/default.jpg",alt:t[l],className:"w-full h-48 object-cover"}),e.jsxs("div",{className:"p-8",children:[e.jsx("h2",{className:"text-xl font-semibold text-gray-800 text-center truncate",style:{maxWidth:"100%"},title:t[l],children:t[l]}),e.jsx("p",{className:"text-gray-600 mt-4 text-center",style:{maxWidth:"100%",overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"},dangerouslySetInnerHTML:{__html:t.description||"No description available."}})]}),e.jsx("button",{onClick:()=>{f(t),v(r?"project":n?"event":"grant",t.id,"view_details")},className:"inline-block rounded-full border border-gray-300 px-7 py-2 text-base font-medium text-body-color transition hover:border-primary hover:bg-primary hover:text-dark dark:border-dark-300 dark:text-dark-600",children:"View Details"})]},a))}),e.jsx("div",{className:"flex justify-center mt-6 space-x-2",children:Array.from({length:k},(t,a)=>e.jsx("button",{onClick:()=>C(a+1),className:`px-4 py-2 border rounded ${d===a+1?"bg-blue-500 text-white":"bg-white text-gray-700"}`,children:a+1},a))}),b&&s&&e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto",onClick:j,children:e.jsxs("div",{className:"bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl relative overflow-y-auto max-h-[90vh]",onClick:t=>t.stopPropagation(),children:[s.image&&e.jsx("img",{src:s.image!==null?`/storage/${s.image}`:"/storage/default.jpg",alt:s[l],className:"w-full h-48 object-cover rounded-t-lg mb-4"}),e.jsx("h3",{className:"text-xl font-bold mb-4 text-gray-800 text-center",children:s[l]}),e.jsxs("div",{className:"space-y-4",children:[r&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Description:"}),s.description?e.jsx("div",{className:"mt-2 text-sm",dangerouslySetInnerHTML:{__html:s.description}}):e.jsx("p",{className:"mt-2 text-sm text-gray-500",children:"No description available."})]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Category:"})," ",s.project_type||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Project Duration:"})," ",s.start_date?`${s.start_date} - ${s.end_date}`:"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Purpose:"})," ",s.purpose==="find_accollaboration"&&"Find Academician Collaboration",s.purpose==="find_incollaboration"&&"Find Industry Collaboration",s.purpose==="find_sponsorship"&&"Find Sponsorship",s.purpose==="showcase"&&"Showcase"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Contact Email:"})," ",s.email||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Location:"})," ",s.location||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Budget:"})," ",s.budget||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Attachment:"})," ",s.attachment?e.jsx("a",{href:`/storage/${s.attachment}`,target:"_blank",rel:"noopener noreferrer",className:"text-blue-500 underline",children:"View Attachment"}):"No attachment available."]})]}),n&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Description:"}),s.description?e.jsx("div",{className:"mt-2 text-sm",dangerouslySetInnerHTML:{__html:s.description}}):e.jsx("p",{className:"mt-2 text-sm text-gray-500",children:"No description available."})]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Event type:"})," ",s.event_type||"Not provided."]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Event Duration:"})," ",s.start_date?`${s.start_date} - ${s.end_date}`:"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Registration Link:"})," ",s.registration_url?e.jsx("a",{href:s.registration_url,target:"_blank",rel:"noopener noreferrer",className:"text-blue-500 underline",children:"Click Here"}):"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Registration Deadline:"})," ",s.registration_deadline||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Contact Email:"})," ",s.contact_email||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Location:"})," ",`${s.venue}, ${s.city}, ${s.country}`||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Attachment:"})," ",s.attachment?e.jsx("a",{href:`/storage/${s.attachment}`,target:"_blank",rel:"noopener noreferrer",className:"text-blue-500 underline",children:"View Attachment"}):"No attachment available."]})]}),c&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Description:"}),s.description?e.jsx("div",{className:"mt-2 text-sm",dangerouslySetInnerHTML:{__html:s.description}}):e.jsx("p",{className:"mt-2 text-sm text-gray-500",children:"No description available."})]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Category:"})," ",s.category||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Purpose:"})," ",s.purpose==="find_pgstudent"&&"Find Postgraduate Student",s.purpose==="find_academic_collaboration"&&"Find Academician Collaboration",s.purpose==="find_industry_collaboration"&&"Find Industry Collaboration - Matching Grant"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Grant Duration:"})," ",s.start_date?`${s.start_date} - ${s.end_date}`:"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Sponsored by:"})," ",s.sponsored_by||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Application Link:"})," ",s.application_url||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Contact Email:"})," ",s.email||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Amount:"})," ",s.amount||"Not provided"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Attachment:"})," ",s.attachment?e.jsx("a",{href:`/storage/${s.attachment}`,target:"_blank",rel:"noopener noreferrer",className:"text-blue-500 underline",children:"View Attachment"}):"No attachment available."]})]})]}),e.jsx("div",{className:"mt-6 text-center",children:e.jsx("button",{onClick:j,className:"px-6 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition duration-200",children:"Close"})})]})})]})};export{F as P};
