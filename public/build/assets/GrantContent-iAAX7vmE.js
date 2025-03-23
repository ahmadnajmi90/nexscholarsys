import{r as l,j as e,a as n,b as j}from"./app-bAKhYWrJ.js";import{e as f,a as b,b as w,f as I,c as N,g as R,h as U,i as B,j as E}from"./index-Cu_Vc-Oe.js";import{u as $}from"./useRoles-D5L1HMhp.js";function H({grant:s,previous:m,next:h,academicians:x,auth:g,isWelcome:p,relatedGrants:o}){$();const[y,v]=l.useState(s.total_likes||0),[O,k]=l.useState(s.total_shares||0),[_,L]=l.useState(s.liked||!1),[u,a]=l.useState(!1),d=l.useRef(null);l.useEffect(()=>{const t=i=>{d.current&&!d.current.contains(i.target)&&a(!1)};return document.addEventListener("mousedown",t),()=>document.removeEventListener("mousedown",t)},[]);const c=x&&x.find(t=>t.academician_id===s.author_id)||null,S=()=>{if(!g){window.location.href=route("login");return}j.post(route("grants.toggleLike",s.url)).then(t=>{v(t.data.total_likes),L(t.data.liked)}).catch(t=>console.error(t))},r=t=>{t(),j.post(route("grants.share",s.url)).then(i=>{k(i.data.total_shares)}).catch(i=>console.error(i))},D=()=>{const t=route("welcome.grants.show",s.url);window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(t)}`,"_blank","width=600,height=400")},C=()=>{const t=route("welcome.grants.show",s.url);window.open(`https://wa.me/?text=${encodeURIComponent(t)}`,"_blank")},A=()=>{const t=route("welcome.grants.show",s.url);window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(t)}`,"_blank","width=600,height=400")},F=()=>{const t=route("welcome.grants.show",s.url);navigator.clipboard.writeText(t).then(()=>{alert("Link copied to clipboard")})};return e.jsx("div",{className:"px-10 md:px-16",children:e.jsxs("div",{className:"max-w-8xl mx-auto py-6",children:[p?e.jsx("div",{className:"absolute top-[6.2rem] left-2 md:top-[6.1rem] md:left-[1rem] z-10",children:e.jsx(n,{onClick:()=>window.history.back(),className:"flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600",children:e.jsx(f,{className:"text-lg md:text-xl"})})}):e.jsx("div",{className:"absolute top-[1.8rem] left-2 md:top-[5.5rem] md:left-[19.5rem] z-10",children:e.jsx(n,{onClick:()=>window.history.back(),className:"flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600",children:e.jsx(f,{className:"text-lg md:text-xl"})})}),s.title&&e.jsx("h1",{className:"text-2xl md:text-3xl font-bold mb-4 text-left",children:s.title}),c?e.jsxs("div",{className:"flex items-center gap-4 mb-4",children:[e.jsx("img",{src:`/storage/${c.profile_picture}`,alt:c.full_name,className:"w-12 h-12 rounded-full object-cover shadow-md bg-gray-200 border-2 border-white"}),e.jsxs("div",{children:[e.jsx("div",{className:"text-lg font-semibold",children:c.full_name}),s.created_at&&e.jsx("div",{className:"text-gray-500",children:new Date(s.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})})]})]}):e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx("img",{src:"/storage/Admin.jpg",alt:"Admin",className:"w-12 h-12 rounded-full object-cover shadow-md border-2 border-white"}),e.jsxs("div",{children:[e.jsx("div",{className:"text-lg font-semibold",children:"Admin"}),s.created_at&&e.jsx("div",{className:"text-gray-500",children:new Date(s.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})})]})]}),e.jsxs("div",{className:"my-4",children:[e.jsx("hr",{}),e.jsxs("div",{className:"flex flex-wrap items-center space-x-4 py-2",children:[e.jsxs("div",{className:"flex items-center",children:[e.jsx(b,{className:"w-6 h-6 text-gray-600"}),e.jsx("span",{className:"ml-2 text-gray-600",children:s.total_views})]}),e.jsxs("button",{onClick:S,className:"flex items-center",children:[_?e.jsx(w,{className:"w-6 h-6 text-red-600"}):e.jsx(I,{className:"w-6 h-6 text-gray-600"}),e.jsx("span",{className:"ml-2 text-gray-600",children:y})]}),e.jsxs("div",{className:"relative",ref:d,children:[e.jsx("button",{onClick:()=>a(!u),className:"flex items-center",children:e.jsx(N,{className:"w-6 h-6 text-gray-600"})}),u&&e.jsxs("div",{className:"absolute left-0 mt-2 w-40 bg-white shadow-lg rounded z-10",children:[e.jsxs("button",{onClick:()=>{r(F),a(!1)},className:"block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center",children:[e.jsx(R,{className:"w-5 h-5 inline mr-2 text-gray-600"}),"Copy Link"]}),e.jsx("hr",{className:"my-1"}),e.jsxs("button",{onClick:()=>{r(D),a(!1)},className:"block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center",children:[e.jsx(U,{className:"w-5 h-5 inline mr-2 text-blue-600"}),"Facebook"]}),e.jsxs("button",{onClick:()=>{r(C),a(!1)},className:"block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center",children:[e.jsx(B,{className:"w-5 h-5 inline mr-2 text-green-600"}),"WhatsApp"]}),e.jsxs("button",{onClick:()=>{r(A),a(!1)},className:"block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center",children:[e.jsx(E,{className:"w-5 h-5 inline mr-2 text-blue-700"}),"LinkedIn"]})]})]})]}),e.jsx("hr",{})]}),s.image&&e.jsx("img",{src:`/storage/${s.image}`,alt:"Banner",className:"w-full h-auto md:h-64 object-cover mb-4"}),s.description&&e.jsxs("div",{className:"mb-4",children:[e.jsx("h2",{className:"text-xl font-bold mb-2",children:"Description"}),e.jsx("div",{className:"mb-4 text-gray-700 prose w-full text-justify max-w-none break-words",dangerouslySetInnerHTML:{__html:s.description}})]}),e.jsxs("div",{className:"mb-4 space-y-2",children:[s.start_date&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Start Date:"})," ",new Date(s.start_date).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})]}),s.end_date&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"End Date:"})," ",new Date(s.end_date).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})]}),s.application_deadline&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Application Deadline:"})," ",new Date(s.application_deadline).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})]}),s.grant_type&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Grant Type:"})," ",s.grant_type]}),s.cycle&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Cycle:"})," ",s.cycle]}),s.sponsored_by&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Sponsored By:"})," ",s.sponsored_by]}),s.email&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Email:"})," ",s.email]}),s.website&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Website:"}),e.jsx("a",{href:s.website,target:"_blank",rel:"noopener noreferrer",className:"ml-2 text-blue-500 underline",children:"Website"})]}),s.country&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Country:"})," ",s.country]}),s.grant_theme&&e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Grant Themes:"})," ",Array.isArray(s.grant_theme)?s.grant_theme.join(", "):s.grant_theme]})]}),s.attachment&&e.jsx("div",{className:"mb-2",children:e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Attachment:"})," ",e.jsx("a",{href:`/storage/${s.attachment}`,target:"_blank",rel:"noopener noreferrer",className:"text-blue-500 underline",children:"View Attachment"})]})}),e.jsx("hr",{className:"my-6 border-gray-200"}),o&&o.length>0&&e.jsxs("div",{className:"mt-8",children:[e.jsx("h2",{className:"text-2xl font-bold mb-6",children:"Other Grants"}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",children:o.map(t=>e.jsxs(n,{href:p?route("welcome.grants.show",t.url):route("grants.show",t.url),className:"block relative p-5 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-[300px] flex flex-col justify-end hover:opacity-90",style:{backgroundImage:`url(${encodeURI(t.image?`/storage/${t.image}`:"/storage/default.jpg")})`,backgroundSize:"cover",backgroundPosition:"center"},children:[e.jsx("div",{className:"absolute inset-0 bg-black opacity-40"}),e.jsxs("div",{className:"relative z-10 text-white pr-10",children:[e.jsx("h2",{className:"text-2xl font-bold truncate",title:t.title,children:t.title||"Untitled Grant"}),t.description&&e.jsx("div",{className:"text-sm line-clamp-2 mb-2",dangerouslySetInnerHTML:{__html:t.description}}),e.jsxs("div",{className:"flex items-center mt-1 space-x-2",children:[e.jsxs("p",{className:"text-xs",children:["Deadline: ",new Date(t.application_deadline).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsxs("div",{className:"flex items-center text-xs",children:[e.jsx(b,{className:"w-4 h-4"}),e.jsx("span",{className:"ml-1",children:t.total_views||0})]}),e.jsxs("div",{className:"flex items-center text-xs",children:[e.jsx(w,{className:"w-4 h-4 text-red-500"}),e.jsx("span",{className:"ml-1",children:t.total_likes||0})]}),e.jsxs("div",{className:"flex items-center text-xs",children:[e.jsx(N,{className:"w-4 h-4"}),e.jsx("span",{className:"ml-1",children:t.total_shares||0})]})]})]})]})]},t.id))})]}),e.jsxs("div",{className:"max-w-3xl mx-auto py-6 flex justify-between",children:[m?e.jsx(n,{href:route("grants.show",m.url),className:"px-4 py-2 bg-gray-200 rounded hover:bg-gray-300",children:"Previous"}):e.jsx("span",{}),h?e.jsx(n,{href:route("grants.show",h.url),className:"px-4 py-2 bg-gray-200 rounded hover:bg-gray-300",children:"Next"}):e.jsx("span",{})]})]})})}export{H as default};
