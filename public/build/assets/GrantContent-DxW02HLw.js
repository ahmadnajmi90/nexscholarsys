import{r as l,j as e,a as o,b as p}from"./app-D4cRrIDG.js";import{e as u,a as S,b as D,f as A,c as F,g as E,h as G,i as R,j as B}from"./index-_WqnglCq.js";import{u as U}from"./useRoles-r5hWJVbH.js";function M({grant:s,previous:d,next:m,academicians:h,auth:j,isWelcome:b}){U();const[f,w]=l.useState(s.total_likes||0),[I,y]=l.useState(s.total_shares||0),[N,g]=l.useState(s.liked||!1),[x,a]=l.useState(!1),c=l.useRef(null);l.useEffect(()=>{const t=n=>{c.current&&!c.current.contains(n.target)&&a(!1)};return document.addEventListener("mousedown",t),()=>document.removeEventListener("mousedown",t)},[]);const r=h&&h.find(t=>t.academician_id===s.author_id)||null,k=()=>{if(!j){window.location.href=route("login");return}p.post(route("grants.toggleLike",s.url)).then(t=>{w(t.data.total_likes),g(t.data.liked)}).catch(t=>console.error(t))},i=t=>{t(),p.post(route("grants.share",s.url)).then(n=>{y(n.data.total_shares)}).catch(n=>console.error(n))},v=()=>{const t=route("welcome.grants.show",s.url);window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(t)}`,"_blank","width=600,height=400")},_=()=>{const t=route("welcome.grants.show",s.url);window.open(`https://wa.me/?text=${encodeURIComponent(t)}`,"_blank")},L=()=>{const t=route("welcome.grants.show",s.url);window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(t)}`,"_blank","width=600,height=400")},C=()=>{const t=route("welcome.grants.show",s.url);navigator.clipboard.writeText(t).then(()=>{alert("Link copied to clipboard")})};return e.jsx("div",{className:"px-10 md:px-16",children:e.jsxs("div",{className:"max-w-8xl mx-auto py-6",children:[b?e.jsx("div",{className:"absolute top-[6.2rem] left-2 md:top-[6.1rem] md:left-[1rem] z-10",children:e.jsx(o,{onClick:()=>window.history.back(),className:"flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600",children:e.jsx(u,{className:"text-lg md:text-xl"})})}):e.jsx("div",{className:"absolute top-[1.8rem] left-2 md:top-[5.5rem] md:left-[19.5rem] z-10",children:e.jsx(o,{onClick:()=>window.history.back(),className:"flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600",children:e.jsx(u,{className:"text-lg md:text-xl"})})}),s.title&&e.jsx("h1",{className:"text-2xl md:text-3xl font-bold mb-4 text-left",children:s.title}),r?e.jsxs("div",{className:"flex items-center gap-4 mb-4",children:[e.jsx("img",{src:`/storage/${r.profile_picture}`,alt:r.full_name,className:"w-12 h-12 rounded-full object-cover shadow-md bg-gray-200 border-2 border-white"}),e.jsxs("div",{children:[e.jsx("div",{className:"text-lg font-semibold",children:r.full_name}),s.created_at&&e.jsx("div",{className:"text-gray-500",children:new Date(s.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})})]})]}):e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx("img",{src:"/storage/Admin.jpg",alt:"Admin",className:"w-12 h-12 rounded-full object-cover shadow-md border-2 border-white"}),e.jsxs("div",{children:[e.jsx("div",{className:"text-lg font-semibold",children:"Admin"}),s.created_at&&e.jsx("div",{className:"text-gray-500",children:new Date(s.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})})]})]}),e.jsxs("div",{className:"my-4",children:[e.jsx("hr",{}),e.jsxs("div",{className:"flex flex-wrap items-center space-x-4 py-2",children:[e.jsxs("div",{className:"flex items-center",children:[e.jsx(S,{className:"w-6 h-6 text-gray-600"}),e.jsx("span",{className:"ml-2 text-gray-600",children:s.total_views})]}),e.jsxs("button",{onClick:k,className:"flex items-center",children:[N?e.jsx(D,{className:"w-6 h-6 text-red-600"}):e.jsx(A,{className:"w-6 h-6 text-gray-600"}),e.jsx("span",{className:"ml-2 text-gray-600",children:f})]}),e.jsxs("div",{className:"relative",ref:c,children:[e.jsx("button",{onClick:()=>a(!x),className:"flex items-center",children:e.jsx(F,{className:"w-6 h-6 text-gray-600"})}),x&&e.jsxs("div",{className:"absolute left-0 mt-2 w-40 bg-white shadow-lg rounded z-10",children:[e.jsxs("button",{onClick:()=>{i(C),a(!1)},className:"block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center",children:[e.jsx(E,{className:"w-5 h-5 inline mr-2 text-gray-600"}),"Copy Link"]}),e.jsx("hr",{className:"my-1"}),e.jsxs("button",{onClick:()=>{i(v),a(!1)},className:"block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center",children:[e.jsx(G,{className:"w-5 h-5 inline mr-2 text-blue-600"}),"Facebook"]}),e.jsxs("button",{onClick:()=>{i(_),a(!1)},className:"block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center",children:[e.jsx(R,{className:"w-5 h-5 inline mr-2 text-green-600"}),"WhatsApp"]}),e.jsxs("button",{onClick:()=>{i(L),a(!1)},className:"block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center",children:[e.jsx(B,{className:"w-5 h-5 inline mr-2 text-blue-700"}),"LinkedIn"]})]})]})]}),e.jsx("hr",{})]}),s.image&&e.jsx("img",{src:`/storage/${s.image}`,alt:"Banner",className:"w-full h-auto md:h-64 object-cover mb-4"}),s.description&&e.jsxs("div",{className:"mb-4",children:[e.jsx("h2",{className:"text-xl font-bold mb-2",children:"Description"}),e.jsx("div",{className:"mb-4 text-gray-700 prose w-full text-justify max-w-none break-words",dangerouslySetInnerHTML:{__html:s.description}})]}),e.jsxs("div",{className:"mb-4 space-y-2",children:[s.start_date&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Start Date:"})," ",new Date(s.start_date).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})]}),s.end_date&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"End Date:"})," ",new Date(s.end_date).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})]}),s.application_deadline&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Application Deadline:"})," ",new Date(s.application_deadline).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})]}),s.grant_type&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Grant Type:"})," ",s.grant_type]}),s.cycle&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Cycle:"})," ",s.cycle]}),s.sponsored_by&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Sponsored By:"})," ",s.sponsored_by]}),s.email&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Email:"})," ",s.email]}),s.website&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Website:"}),e.jsx("a",{href:s.website,target:"_blank",rel:"noopener noreferrer",className:"ml-2 text-blue-500 underline",children:"Website"})]}),s.country&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Country:"})," ",s.country]}),s.grant_theme&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Grant Themes:"})," ",Array.isArray(s.grant_theme)?s.grant_theme.join(", "):s.grant_theme]})]}),s.attachment&&e.jsx("div",{className:"mb-2",children:e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Attachment:"})," ",e.jsx("a",{href:`/storage/${s.attachment}`,target:"_blank",rel:"noopener noreferrer",className:"text-blue-500 underline",children:"View Attachment"})]})}),e.jsxs("div",{className:"max-w-3xl mx-auto py-6 flex justify-between",children:[d?e.jsx(o,{href:route("grants.show",d.url),className:"px-4 py-2 bg-gray-200 rounded hover:bg-gray-300",children:"Previous"}):e.jsx("span",{}),m?e.jsx(o,{href:route("grants.show",m.url),className:"px-4 py-2 bg-gray-200 rounded hover:bg-gray-300",children:"Next"}):e.jsx("span",{})]})]})})}export{M as default};
