import{q as ae,r as l,j as s,a as U}from"./app-CeHy2xKW.js";import{F as A}from"./FilterDropdown-Cs5OH7lN.js";import{a as le,r as ne,s as ie,q as I}from"./index-CCTedgy2.js";import{R as ce}from"./RecommendationModal-D4iXsSGb.js";import{B as oe}from"./BookmarkButton-DRlcRQOn.js";const M=d=>typeof d!="string"?"":d.replace(/\w\S*/g,m=>m.charAt(0).toUpperCase()+m.substr(1).toLowerCase()),ye=({profilesData:d,supervisorAvailabilityKey:m,universitiesList:g,faculties:de,isPostgraduateList:h,isUndergraduateList:i,isFacultyAdminDashboard:z,users:B,researchOptions:x})=>{const{skills:f}=ae().props,q=new Set(d.flatMap(e=>Array.isArray(e.skills)?e.skills:[])),O=(Array.isArray(f)?f:[]).filter(e=>q.has(e.id)).map(e=>({value:e.id,label:M(e.name)})),[b,E]=l.useState([]),[y,V]=l.useState([]),[p,W]=l.useState(""),[_,Q]=l.useState([]),[j,P]=l.useState(1),[u,v]=l.useState(!1),[T,N]=l.useState(!1),[c,D]=l.useState(null),w=9,[G,$]=l.useState(!1),[C,he]=l.useState(null),[H,F]=l.useState(!1),k=l.useRef(null);l.useEffect(()=>{function e(r){k.current&&!k.current.contains(r.target)&&u&&v(!1)}return u&&document.addEventListener("mousedown",e),()=>{document.removeEventListener("mousedown",e)}},[u]);const Y=e=>{F(!0),D(e),N(!0),F(!1)},J=Array.from(new Set(d.flatMap(e=>{const r=Array.isArray(e.field_of_research)?e.field_of_research:[],t=Array.isArray(e.research_expertise)?e.research_expertise:[],a=Array.isArray(e.research_preference)?e.research_preference:[];return[...r,...t,...a]}))).map(e=>{const r=x.find(t=>`${t.field_of_research_id}-${t.research_area_id}-${t.niche_domain_id}`===e);return{value:e,label:r?`${r.field_of_research_name} - ${r.research_area_name} - ${r.niche_domain_name}`:"Unknown Research Area"}}),X=Array.from(new Set(d.map(e=>e.university))).map(e=>{const r=g.find(t=>t.id===e);return{value:e?e.toString():"",label:r?r.short_name:"Unknown University"}}),Z=e=>e===null?"0":e===!0||e==="1"||e===1?"1":e===!1||e==="0"||e===0?"0":"",R=d.filter(e=>{const r=e.university?e.university.toString():"",t=b.length===0||(e.field_of_research||e.research_expertise||e.research_preference||[]).some(S=>b.includes(S)),a=y.length===0||y.includes(r),n=Z(e[m]),o=p===""||n===p,te=_.length===0||e.skills&&e.skills.some(S=>_.includes(S));return t&&a&&o&&te}),K=Math.ceil(R.length/w),L=R.slice((j-1)*w,j*w),ee=e=>{P(e)},se=e=>{const r=g.find(t=>t.id===e);return r?r.full_name:"Unknown University"},re=()=>{$(!1)};return s.jsxs("div",{className:"min-h-screen flex",children:[s.jsx("div",{className:"fixed top-20 right-4 z-50 flex items-center space-x-4 lg:hidden",children:s.jsx("button",{onClick:()=>v(!u),className:"bg-blue-600 text-white p-2 rounded-full shadow-lg",children:s.jsx(le,{className:"text-xl"})})}),s.jsxs("div",{ref:k,className:`fixed lg:relative top-0 left-0 lg:block lg:w-1/4 w-3/4 h-full bg-gray-100 border-r rounded-lg p-4 transition-transform duration-300 z-50 ${u?"translate-x-0":"-translate-x-full"} lg:translate-x-0`,children:[s.jsxs("h2",{className:"text-lg font-semibold mb-4 flex justify-between items-center",children:["Filters",s.jsx("button",{onClick:()=>v(!1),className:"text-gray-600 lg:hidden",children:"✕"})]}),s.jsxs("div",{className:"space-y-4",children:[s.jsx(A,{label:i?"Preferred Research Area":"Field of Research",options:J,selectedValues:b,setSelectedValues:E}),(h||i)&&s.jsx(A,{label:"Skills",options:O,selectedValues:_,setSelectedValues:Q}),!z&&s.jsx(A,{label:"University",options:X,selectedValues:y,setSelectedValues:V}),!i&&s.jsxs("div",{children:[m==="availability_as_supervisor"?s.jsx("label",{className:"block text-gray-700 font-medium mb-2",children:"Available As Supervisor"}):s.jsx("label",{className:"block text-gray-700 font-medium mb-2",children:"Looking for a supervisor"}),s.jsxs("select",{className:"p-2 border border-gray-300 rounded w-full pl-4",value:p,onChange:e=>{W(e.target.value),P(1)},children:[s.jsx("option",{value:"",children:"All"}),s.jsx("option",{value:"1",children:"Yes"}),s.jsx("option",{value:"0",children:"No"})]})]})]})]}),s.jsxs("div",{className:"flex-1 py-6 sm:py-4 lg:py-0 px-4",children:[s.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6",children:[L.map(e=>{var r,t;return s.jsxs("div",{className:"bg-white shadow-md rounded-lg overflow-hidden relative",children:[s.jsx("div",{className:"absolute top-2 left-2 bg-blue-500 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full",children:((r=g.find(a=>a.id===e.university))==null?void 0:r.short_name)||"Unknown University"}),!i&&s.jsx("div",{className:"relative"}),s.jsx("div",{className:"h-32",children:s.jsx("img",{src:e.background_image!==null?`/storage/${e.background_image}`:"/storage/profile_background_images/default.jpg",alt:"Banner",className:"object-cover w-full h-full"})}),s.jsx("div",{className:"flex justify-center -mt-12",children:s.jsxs("div",{className:"relative w-24 h-24",children:[s.jsx("div",{className:"w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg",children:s.jsx("img",{src:e.profile_picture!==null?`/storage/${e.profile_picture}`:"/storage/profile_pictures/default.jpg",alt:"Profile",className:"w-full h-full object-cover"})}),e.verified===1&&s.jsxs("div",{className:"absolute bottom-0 right-0 p-1 rounded-full group cursor-pointer",children:[s.jsx("div",{className:"flex items-center justify-center w-7 h-7 bg-blue-500 rounded-full",children:s.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-4 w-4 text-white",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:3,children:s.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M5 13l4 4L19 7"})})}),s.jsxs("div",{className:"absolute bottom-8 right-0 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-3 py-2 shadow-lg z-10 w-48",children:["This account is verified by ",se(e.university)]})]})]})}),s.jsxs("div",{className:"text-center mt-4",children:[s.jsx("h2",{className:"text-lg font-semibold truncate px-6",children:e.full_name}),s.jsx("p",{className:"text-gray-500 text-sm px-6",style:{display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden",minHeight:"2.5rem"},children:Array.isArray(e.field_of_research)&&e.field_of_research.length>0?(()=>{const a=e.field_of_research[0],n=x.find(o=>`${o.field_of_research_id}-${o.research_area_id}-${o.niche_domain_id}`===a);return n?`${n.field_of_research_name} - ${n.research_area_name} - ${n.niche_domain_name}`:"Unknown"})():Array.isArray(e.research_preference)&&e.research_preference.length>0?(()=>{const a=e.research_preference[0],n=x.find(o=>`${o.field_of_research_id}-${o.research_area_id}-${o.niche_domain_id}`===a);return n?`${n.field_of_research_name} - ${n.research_area_name} - ${n.niche_domain_name}`:"Unknown"})():"No Field of Research or Preference"}),s.jsxs("div",{className:"mt-2 flex justify-center gap-2",children:[s.jsx("button",{onClick:()=>Y(e),className:"bg-blue-500 text-white text-[10px] px-2 font-semibold py-1 rounded-full hover:bg-blue-600",children:"Quick Info"}),s.jsx(U,{href:h&&!i?route("postgraduates.show",e.url):route("undergraduates.show",e.url),className:"bg-green-500 text-white text-[10px] px-2 font-semibold py-1 rounded-full hover:bg-green-600",children:"Full Profile"})]})]}),s.jsxs("div",{className:"flex justify-around items-center mt-6 py-4 border-t px-10",children:[s.jsx("a",{href:"#",className:"text-gray-500 text-lg cursor-pointer hover:text-blue-700",title:"Add Friend",children:s.jsx(ne,{className:"text-lg"})}),s.jsx(U,{href:route("email.compose",{to:(t=B.find(a=>a.unique_id===(e.postgraduate_id||e.undergraduate_id)))==null?void 0:t.email}),className:"text-gray-500 text-lg cursor-pointer hover:text-blue-700",title:"Send Email",children:s.jsx(ie,{className:"text-lg"})}),s.jsx("a",{href:e.linkedin||"#",target:"_blank",rel:"noopener noreferrer",className:"text-gray-500 text-lg hover:text-blue-800",title:"LinkedIn",children:s.jsx(I,{className:"text-lg"})}),s.jsx(oe,{bookmarkableType:i?"undergraduate":h?"postgraduate":"academician",bookmarkableId:e.id,category:i?"Undergraduates":h?"Postgraduates":"Academicians",iconSize:"text-lg",tooltipPosition:"top"})]})]},e.id)}),T&&c&&s.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50",onClick:()=>N(!1),children:s.jsxs("div",{className:"bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg relative max-h-[80vh] overflow-y-auto",onClick:e=>e.stopPropagation(),children:[H?s.jsxs("div",{className:"flex flex-col items-center justify-center py-10",children:[s.jsxs("svg",{className:"animate-spin h-8 w-8 text-blue-500 mb-4",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[s.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),s.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"})]}),s.jsx("p",{className:"text-gray-600",children:"Loading profile information..."})]}):s.jsxs(s.Fragment,{children:[s.jsx("h3",{className:"text-xl font-bold mb-4 text-gray-800 ",children:c.full_name}),s.jsx("hr",{className:"border-t border-gray-800 mb-4"}),s.jsxs("div",{className:"space-y-6",children:[s.jsxs("div",{children:[s.jsx("h4",{className:"text-lg font-semibold text-gray-800 mb-2",children:"Short Bio"}),s.jsx("p",{className:"text-gray-600 whitespace-pre-line",children:c.bio||"Not Provided"})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"text-lg font-semibold text-gray-800 mb-2",children:h&&!i?"Field of Research":"Research Interest"}),s.jsx("div",{className:"",children:(()=>{let e=[];if(h&&!i?e=c.field_of_research||[]:e=c.research_preference||[],Array.isArray(e)&&e.length>0){const r=e[0],t=x.find(a=>`${a.field_of_research_id}-${a.research_area_id}-${a.niche_domain_id}`===r);if(t)return s.jsxs("p",{className:"text-gray-600",children:[t.field_of_research_name," - ",t.research_area_name," - ",t.niche_domain_name]})}return s.jsx("p",{className:"text-gray-600",children:"Not Provided"})})()})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"text-lg font-semibold text-gray-800 mb-2",children:"Skills"}),s.jsx("div",{className:"flex flex-wrap gap-1",children:Array.isArray(c.skills)&&c.skills.length>0?c.skills.map(e=>{const r=(Array.isArray(f)?f:[]).find(t=>t.id===e);return r?s.jsx("span",{className:"bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded",children:M(r.name)},e):null}):s.jsx("p",{className:"text-gray-600",children:"No skills listed"})})]}),s.jsxs("div",{children:[s.jsx("h4",{className:"text-lg font-semibold text-gray-800 mb-2",children:"Connect via"}),s.jsx("div",{className:"flex items-center space-x-4",children:s.jsx("a",{href:c.linkedin,target:"_blank",rel:"noopener noreferrer",className:"text-gray-500 text-lg hover:text-blue-800",title:"LinkedIn",children:s.jsx(I,{})})})]})]})]}),s.jsx("div",{className:"mt-6 text-center",children:s.jsx("button",{onClick:()=>N(!1),className:"px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200",children:"Close"})})]})})]}),s.jsx("div",{className:"flex justify-center mt-6 space-x-2",children:Array.from({length:K},(e,r)=>s.jsx("button",{onClick:()=>ee(r+1),className:`px-4 py-2 border rounded ${j===r+1?"bg-blue-500 text-white":"bg-white text-gray-700"}`,children:r+1},r))})]}),G&&C&&s.jsx(ce,{academician:C,onClose:()=>$(!1),onSuccess:re})]})};export{ye as P};
