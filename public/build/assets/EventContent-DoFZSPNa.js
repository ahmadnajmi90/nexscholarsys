import{r,j as e,a as c,b as j}from"./app-DikJv5gO.js";import{e as g,a as v,b as A,f as B,c as I,g as O,h as T,i as U,j as G}from"./index-3-Iofj4O.js";import{u as M}from"./useRoles-Du-nPZAJ.js";function V({event:s,previous:h,next:x,academicians:f,researchOptions:b,isWelcome:w,auth:_}){M();const[N,y]=r.useState(s.total_likes||0),[z,k]=r.useState(s.total_shares||0),[L,C]=r.useState(s.liked||!1),[u,l]=r.useState(!1),d=r.useRef(null);r.useEffect(()=>{const a=t=>{d.current&&!d.current.contains(t.target)&&l(!1)};return document.addEventListener("mousedown",a),()=>document.removeEventListener("mousedown",a)},[]);const n=f&&f.find(a=>a.academician_id===s.author_id)||null,p=()=>{if(!s.field_of_research)return null;const t=(Array.isArray(s.field_of_research)?s.field_of_research:[s.field_of_research]).map($=>{const o=b.find(m=>`${m.field_of_research_id}-${m.research_area_id}-${m.niche_domain_id}`===$);return o?`${o.field_of_research_name} - ${o.research_area_name} - ${o.niche_domain_name}`:null}).filter(Boolean);return t.length?t.join(", "):null},S=()=>{if(!_){window.location.href=route("login");return}j.post(route("events.toggleLike",s.url)).then(a=>{y(a.data.total_likes),C(a.data.liked)}).catch(a=>console.error(a))},i=a=>{a(),j.post(route("events.share",s.url)).then(t=>{k(t.data.total_shares)}).catch(t=>console.error(t))},D=()=>{const a=`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;window.open(a,"_blank","width=600,height=400")},E=()=>{const a=`https://wa.me/?text=${encodeURIComponent(window.location.href)}`;window.open(a,"_blank")},F=()=>{const a=`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;window.open(a,"_blank","width=600,height=400")},R=()=>{navigator.clipboard.writeText(window.location.href).then(()=>{alert("Link copied to clipboard")})};return e.jsx("div",{className:"px-10 md:px-16",children:e.jsxs("div",{className:"max-w-8xl mx-auto py-6",children:[w?e.jsx("div",{className:"absolute top-[6.2rem] left-2 md:top-[6.1rem] md:left-[1rem] z-10",children:e.jsx(c,{onClick:()=>window.history.back(),className:"flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600",children:e.jsx(g,{className:"text-lg md:text-xl"})})}):e.jsx("div",{className:"absolute top-[1.8rem] left-2 md:top-[5.5rem] md:left-[19.5rem] z-10",children:e.jsx(c,{onClick:()=>window.history.back(),className:"flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600",children:e.jsx(g,{className:"text-lg md:text-xl"})})}),s.event_name&&e.jsx("h1",{className:"text-2xl md:text-3xl font-bold mb-4 text-left",children:s.event_name}),n?e.jsxs("div",{className:"flex items-center gap-4 mb-4",children:[e.jsx("img",{src:`/storage/${n.profile_picture}`,alt:n.full_name,className:"w-12 h-12 rounded-full object-cover shadow-md bg-gray-200 border-2 border-white"}),e.jsxs("div",{children:[e.jsx("div",{className:"text-lg font-semibold",children:n.full_name}),e.jsx("div",{className:"text-gray-500",children:s.created_at?new Date(s.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"}):""})]})]}):e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx("img",{src:"/storage/Admin.jpg",alt:"Admin",className:"w-12 h-12 rounded-full object-cover shadow-md border-2 border-white"}),e.jsxs("div",{children:[e.jsx("div",{className:"text-lg font-semibold",children:"Admin"}),e.jsx("div",{className:"text-gray-500",children:s.created_at?new Date(s.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"}):""})]})]}),e.jsxs("div",{className:"my-4",children:[e.jsx("hr",{}),e.jsxs("div",{className:"flex flex-wrap items-center space-x-4 py-2",children:[e.jsxs("div",{className:"flex items-center",children:[e.jsx(v,{className:"w-6 h-6 text-gray-600"}),e.jsx("span",{className:"ml-2 text-gray-600",children:s.total_views})]}),e.jsxs("button",{onClick:S,className:"flex items-center",children:[L?e.jsx(A,{className:"w-6 h-6 text-red-600"}):e.jsx(B,{className:"w-6 h-6 text-gray-600"}),e.jsx("span",{className:"ml-2 text-gray-600",children:N})]}),e.jsxs("div",{className:"relative",ref:d,children:[e.jsx("button",{onClick:()=>l(!u),className:"flex items-center",children:e.jsx(I,{className:"w-6 h-6 text-gray-600"})}),u&&e.jsxs("div",{className:"absolute left-0 mt-2 w-40 bg-white shadow-lg rounded z-10",children:[e.jsxs("button",{onClick:()=>{i(R),l(!1)},className:"block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center",children:[e.jsx(O,{className:"w-5 h-5 inline mr-2 text-gray-600"}),"Copy Link"]}),e.jsx("hr",{className:"my-1"}),e.jsxs("button",{onClick:()=>{i(D),l(!1)},className:"block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center",children:[e.jsx(T,{className:"w-5 h-5 inline mr-2 text-blue-600"}),"Facebook"]}),e.jsxs("button",{onClick:()=>{i(E),l(!1)},className:"block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center",children:[e.jsx(U,{className:"w-5 h-5 inline mr-2 text-green-600"}),"WhatsApp"]}),e.jsxs("button",{onClick:()=>{i(F),l(!1)},className:"block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center",children:[e.jsx(G,{className:"w-5 h-5 inline mr-2 text-blue-700"}),"LinkedIn"]})]})]})]}),e.jsx("hr",{})]}),s.image&&e.jsx("img",{src:`/storage/${s.image}`,alt:"Banner",className:"w-full h-auto md:h-64 object-cover mb-4"}),s.description&&e.jsxs("div",{className:"mb-4",children:[e.jsx("h2",{className:"text-xl font-bold mb-2",children:"Description"}),e.jsx("div",{className:"mb-4 text-gray-700 prose w-full text-justify max-w-none break-words",dangerouslySetInnerHTML:{__html:s.description}})]}),e.jsxs("div",{className:"mb-4 space-y-2",children:[s.event_type&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Event Type:"})," ",s.event_type]}),s.event_mode&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Event Mode:"})," ",s.event_mode]}),s.event_theme&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Event Theme:"})," ",s.event_theme]}),s.start_date&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Start Date:"})," ",new Date(s.start_date).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})]}),s.end_date&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"End Date:"})," ",new Date(s.end_date).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})]}),s.start_time&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Start Time:"})," ",s.start_time]}),s.end_time&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"End Time:"})," ",s.end_time]}),s.registration_deadline&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Registration Deadline:"})," ",new Date(s.registration_deadline).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})]}),s.registration_url&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Registration:"}),e.jsx("a",{href:s.registration_url,target:"_blank",rel:"noopener noreferrer",className:"ml-2 text-blue-500 underline",children:"Register"})]}),s.contact_email&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Contact Email:"})," ",s.contact_email]}),s.venue&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Venue:"})," ",s.venue]}),s.city&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"City:"})," ",s.city]}),s.country&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Country:"})," ",s.country]}),s.field_of_research&&p()&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Field of Research:"})," ",p()]})]}),e.jsxs("div",{className:"max-w-3xl mx-auto py-6 flex justify-between",children:[h?e.jsx(c,{href:route("events.show",h.url),className:"px-4 py-2 bg-gray-200 rounded hover:bg-gray-300",children:"Previous"}):e.jsx("span",{}),x?e.jsx(c,{href:route("events.show",x.url),className:"px-4 py-2 bg-gray-200 rounded hover:bg-gray-300",children:"Next"}):e.jsx("span",{})]})]})})}export{V as default};
