import{r as c,j as e}from"./app-Be_m1FO6.js";import{F as L,a as R,b as B,c as I}from"./index-kUNJRumZ.js";import{S as O}from"./react-select.esm-APXKErMp.js";const z=({profilesData:v,supervisorAvailabilityKey:d,universitiesList:b,isPostgraduateList:w,users:$,researchOptions:o})=>{var y;const[m,S]=c.useState([]),[x,k]=c.useState(""),[u,A]=c.useState(""),[_,h]=c.useState(1),f=8,[C,p]=c.useState(!1),[t,P]=c.useState(null),U=s=>{P(s),p(!0)},j=[...new Set(v.flatMap(s=>s.field_of_research||s.research_expertise||[]))].map(s=>{const r=o.find(a=>`${a.field_of_research_id}-${a.research_area_id}-${a.niche_domain_id}`===s);return{value:s,label:r?`${r.field_of_research_name} - ${r.research_area_name} - ${r.niche_domain_name}`:"Unknown Research Area"}}),N=v.filter(s=>{var i;const r=m.length===0||(s.field_of_research||s.research_expertise||[]).some(n=>m.includes(n)),a=x===""||s.university===parseInt(x),l=u===""||((i=s[d])==null?void 0:i.toString())===u;return r&&a&&l}),F=Math.ceil(N.length/f),E=N.slice((_-1)*f,_*f),M=s=>{h(s)},g=s=>{const r=b.find(a=>a.id===s);return r?r.short_name:"Unknown University"};return e.jsxs("div",{className:"min-h-screen p-4 sm:p-6",children:[e.jsxs("div",{className:"flex flex-wrap justify-center gap-4 mb-6",children:[e.jsx(O,{id:"research-area-filter",isMulti:!0,options:j,className:"",classNamePrefix:"select",value:m.map(s=>j.find(a=>a.value===s)||{value:s,label:s}),onChange:s=>{const r=s?s.map(a=>a.value):[];S(r),h(1)},placeholder:"Search and select research areas..."}),e.jsxs("select",{className:"p-2 border border-gray-300 rounded w-full sm:w-auto",value:x,onChange:s=>{k(s.target.value),h(1)},children:[e.jsx("option",{value:"",children:"All Universities"}),b.map(s=>e.jsx("option",{value:s.id,children:s.short_name},s.id))]}),e.jsxs("select",{className:"p-2 border border-gray-300 rounded w-full sm:w-auto",value:u,onChange:s=>{A(s.target.value),h(1)},children:[e.jsx("option",{value:"",children:"All Supervisor Availability"}),d==="availability_as_supervisor"?e.jsxs(e.Fragment,{children:[e.jsx("option",{value:"1",children:"Available as Supervisor"}),e.jsx("option",{value:"0",children:"Not Available as Supervisor"})]}):e.jsxs(e.Fragment,{children:[e.jsx("option",{value:"1",children:"Looking for a Supervisor"}),e.jsx("option",{value:"0",children:"Not Looking for a Supervisor"})]})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6",children:[E.map(s=>e.jsxs("div",{className:"bg-white shadow-md rounded-lg overflow-hidden relative",children:[e.jsx("div",{className:"absolute top-2 left-2 bg-blue-500 text-white text-[10px]  font-semibold px-2.5 py-0.5  rounded-full",children:g(s.university)}),!w&&e.jsxs("div",{className:"relative group",children:[s.verified===1&&e.jsx("span",{className:"absolute top-2 right-2 whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] text-purple-700 cursor-pointer",children:"Verified"}),s.verified!==1&&e.jsx("span",{className:"absolute top-2 right-2 whitespace-nowrap rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] text-red-700 cursor-pointer",children:"Not Verified"}),e.jsx("div",{className:"absolute top-8 right-0 hidden group-hover:flex items-center bg-gray-800 text-white text-xs rounded px-3 py-2 shadow-lg z-10",children:s.verified===1?`This account is verified by ${g(s.university)}`:"This account is not verified"})]}),e.jsx("div",{className:"h-32",children:e.jsx("img",{src:`https://picsum.photos/seed/${s.id}/500/150`,alt:"Banner",className:"object-cover w-full h-full"})}),e.jsx("div",{className:"flex justify-center -mt-12",children:e.jsx("div",{className:"relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg",children:e.jsx("img",{src:s.profile_picture!==null?`/storage/${s.profile_picture}`:"/storage/profile_pictures/default.jpg",alt:"Profile",className:"w-full h-full object-cover"})})}),e.jsxs("div",{className:"text-center mt-4",children:[e.jsx("h2",{className:"text-lg font-semibold",children:s.full_name}),e.jsx("p",{className:"text-gray-500 text-sm",children:Array.isArray(s.field_of_research)&&s.field_of_research.length>0?(()=>{const r=s.field_of_research[0],a=o.find(l=>`${l.field_of_research_id}-${l.research_area_id}-${l.niche_domain_id}`===r);return a?`${a.field_of_research_name} - ${a.research_area_name} - ${a.niche_domain_name}`:"Unknown"})():Array.isArray(s.research_expertise)&&s.research_expertise.length>0?(()=>{const r=s.research_expertise[0],a=o.find(l=>`${l.field_of_research_id}-${l.research_area_id}-${l.niche_domain_id}`===r);return a?`${a.field_of_research_name} - ${a.research_area_name} - ${a.niche_domain_name}`:"Unknown"})():"No Field of Research or Expertise"}),e.jsx("p",{className:"text-gray-500 text-sm",children:s.current_position}),e.jsx("button",{onClick:()=>U(s),className:"mt-2 bg-blue-500 text-white text-[10px] px-2 font-semibold py-1 rounded-full hover:bg-blue-600",children:"Quick Info"})]}),e.jsxs("div",{className:"flex justify-around items-center mt-6 py-4 border-t px-10",children:[e.jsx(L,{className:"text-gray-500 text-sm cursor-pointer hover:text-blue-700",title:"Copy Email",onClick:()=>handleCopyEmail(s.email)}),e.jsx("a",{href:s.google_scholar,target:"_blank",rel:"noopener noreferrer",className:"text-gray-500 text-sm hover:text-red-700",title:"Google Scholar",children:e.jsx(R,{})}),e.jsx("a",{href:s.website,target:"_blank",rel:"noopener noreferrer",className:"text-gray-500 text-sm hover:text-green-700",title:"Website",children:e.jsx(B,{})}),e.jsx("a",{href:s.linkedin,target:"_blank",rel:"noopener noreferrer",className:"text-gray-500 text-sm hover:text-blue-800",title:"LinkedIn",children:e.jsx(I,{})})]})]},s.id)),C&&t&&e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50",children:e.jsxs("div",{className:"bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg relative",children:[e.jsx("button",{onClick:()=>p(!1),className:"absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none","aria-label":"Close",children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",className:"w-6 h-6",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})}),e.jsx("h3",{className:"text-xl font-bold mb-4 text-gray-800 text-center",children:t.full_name}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"University:"})," ",g(t.university)]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Bio:"})," ",t.bio||"No bio available."]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Fields of Research:"})," ",(()=>{const s=Array.isArray(t.field_of_research)&&t.field_of_research.length>0?t.field_of_research.map(l=>{const i=o.find(n=>`${n.field_of_research_id}-${n.research_area_id}-${n.niche_domain_id}`===l);return i?`${i.field_of_research_name} - ${i.research_area_name} - ${i.niche_domain_name}`:null}).filter(Boolean):[],r=Array.isArray(t.research_expertise)&&t.research_expertise.length>0?t.research_expertise.map(l=>{const i=o.find(n=>`${n.field_of_research_id}-${n.research_area_id}-${n.niche_domain_id}`===l);return i?`${i.field_of_research_name} - ${i.research_area_name} - ${i.niche_domain_name}`:null}).filter(Boolean):[],a=[...s,...r];return a.length>0?a.join(", "):"No fields of study or expertise"})()]}),e.jsxs("p",{className:"text-gray-600",children:[d=="availability_as_supervisor"?e.jsx("span",{className:"font-semibold",children:"Available as supervisor:"}):e.jsx("span",{className:"font-semibold",children:"Looking for a supervisor:"}),t[d]===1?" Yes":" No"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Email:"})," ",((y=$.find(s=>s.unique_id===(t.academician_id||t.postgraduate_id)))==null?void 0:y.email)||"No email provided"]})]}),e.jsx("div",{className:"mt-6 text-center",children:e.jsx("button",{onClick:()=>p(!1),className:"px-6 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition duration-200",children:"Close"})})]})})]}),e.jsx("div",{className:"flex justify-center mt-6 space-x-2",children:Array.from({length:F},(s,r)=>e.jsx("button",{onClick:()=>M(r+1),className:`px-4 py-2 border rounded ${_===r+1?"bg-blue-500 text-white":"bg-white text-gray-700"}`,children:r+1},r))})]})};export{z as P};