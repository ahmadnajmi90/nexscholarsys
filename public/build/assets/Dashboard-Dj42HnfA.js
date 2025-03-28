import{j as e,r as m,a as D}from"./app-Bwu-bara.js";import{M as C}from"./MainLayout-WwMCgBYJ.js";import{P as F}from"./ProfileCard-hbw7DX4X.js";import{u as T}from"./useRoles-cSkxEsk_.js";import{a as z,b as U,c as $}from"./index-DRKyvpEV.js";import{z as E}from"./transition-BykFG0kD.js";import"./analytics-18rYXD_U.js";import"./FilterDropdown-ye_m56ZQ.js";import"./react-select.esm-DUV37WqO.js";const G=()=>{const l=[{label:"Give Feedback",icon:e.jsx("img",{src:"/images/feedback.png",alt:"Feedback",style:{width:"30px",height:"30px"}}),link:"https://forms.gle/CQnJJxd8tfSrL2RE7"},{label:"Find Academician",icon:e.jsx("img",{src:"/images/academician.png",alt:"Academician",style:{width:"30px",height:"30px"}}),link:"/academicians"},{label:"Find Postgraduate",icon:e.jsx("img",{src:"/images/postgraduate.png",alt:"Postgraduate",style:{width:"30px",height:"30px"}}),link:"/postgraduates"},{label:"ChatGPT",icon:e.jsx("img",{src:"/images/chatgpt.png",alt:"ChatGPT",style:{width:"30px",height:"30px"}}),link:"https://chatgpt.com/"},{label:"Scispaces",icon:e.jsx("img",{src:"/images/scispaces.png",alt:"Scispaces",style:{width:"30px",height:"30px"}}),link:"https://typeset.io/"},{label:"Canva",icon:e.jsx("img",{src:"/images/canva.png",alt:"Canva",style:{width:"30px",height:"30px"}}),link:"https://www.canva.com/"},{label:"Mendeley",icon:e.jsx("img",{src:"/images/mendeley.png",alt:"Mendeley",style:{width:"30px",height:"30px"}}),link:"https://www.mendeley.com/"},{label:"Zotero",icon:e.jsx("img",{src:"/images/zotero.png",alt:"Zotero",style:{width:"30px",height:"30px"}}),link:"https://www.zotero.org/"},{label:"Scimago",icon:e.jsx("img",{src:"/images/scimago.png",alt:"Scimago",style:{width:"30px",height:"30px"}}),link:"https://www.scimagojr.com/"},{label:"Scopus",icon:e.jsx("img",{src:"/images/scopus.png",alt:"Scopus",style:{width:"30px",height:"30px"}}),link:"https://www.scopus.com/sources.uri?zone=TopNavBar&origin=searchbasic"}];return e.jsxs("div",{className:"md:mx-0 md:auto",children:[e.jsx("h2",{className:"text-2xl font-semibold mb-4 mt-4",children:"QuickLinks"}),e.jsx("div",{className:"grid grid-cols-3 md:grid-cols-3 lg:grid-cols-9 gap-4",children:l.map((t,c)=>e.jsx("div",{className:"flex flex-col items-center justify-center bg-white shadow-md rounded-lg hover:bg-gray-100 transition p-4",style:{width:"100%",height:"137px"},children:t.link?e.jsxs("a",{href:t.link,target:"_blank",rel:"noopener noreferrer",className:"flex flex-col items-center",children:[e.jsx("div",{className:"mb-2",children:t.icon}),e.jsx("p",{className:"text-sm font-medium text-gray-700 text-center",children:t.label})]}):e.jsxs("button",{className:"flex flex-col items-center",children:[e.jsx("div",{className:"mb-2",children:t.icon}),e.jsx("p",{className:"text-sm font-medium text-gray-700 text-center",children:t.label})]})},c))})]})},R=({events:l=[]})=>{const[t,c]=m.useState(1),n=5,i=Math.ceil(l.length/n),h=l.slice((t-1)*n,t*n),g=()=>{t>1&&c(t-1)},u=()=>{t<i&&c(t+1)};return e.jsxs("div",{className:"bg-white shadow-md rounded-lg p-4 h-full",children:[e.jsx("h2",{className:"text-base font-bold mb-3",children:"Upcoming Events"}),e.jsx("ul",{className:"space-y-2",children:h.map((o,x)=>e.jsxs("li",{className:"flex items-center justify-between p-2 rounded-lg bg-gray-50 shadow hover:shadow-md transition-all",children:[e.jsxs("div",{className:"flex items-start space-x-2",children:[e.jsx("img",{src:"https://flagcdn.com/w40/my.png",alt:"Malaysia Flag",className:"w-6 h-4 mt-1 ml-2"}),e.jsxs("div",{children:[e.jsx("p",{className:"font-medium text-gray-800 truncate pr-2 w-32",title:o.event_name,children:o.event_name}),e.jsx("p",{className:"text-xs text-gray-600",children:new Date(o.start_date).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})})]})]}),e.jsx(D,{href:route("events.show",o.url),className:"bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-700 text-xs",children:"→"})]},x))}),e.jsxs("div",{className:"flex justify-between items-center mt-3",children:[e.jsx("button",{onClick:g,disabled:t===1,className:`px-3 py-1 text-xs font-medium rounded-lg ${t===1?"bg-gray-300 text-gray-500 cursor-not-allowed":"bg-blue-600 text-white hover:bg-blue-700"}`,children:"Prev"}),e.jsxs("p",{className:"text-xs",children:["Page ",t," of ",i]}),e.jsx("button",{onClick:u,disabled:t===i,className:`px-3 py-1 text-xs font-medium rounded-lg ${t===i?"bg-gray-300 text-gray-500 cursor-not-allowed":"bg-blue-600 text-white hover:bg-blue-700"}`,children:"Next"})]})]})},M=({totalUsers:l})=>e.jsxs("div",{className:"bg-white shadow rounded-lg p-6",children:[e.jsx("h2",{className:"text-lg font-semibold",children:"Total Registered Users"}),e.jsx("p",{className:"text-3xl font-bold",children:l})]}),B=({onlineUsers:l})=>e.jsxs("div",{className:"bg-white shadow rounded-lg p-6",children:[e.jsx("h2",{className:"text-lg font-semibold",children:"Online Users"}),e.jsx("p",{className:"text-3xl font-bold",children:l})]}),I=({clicksByType:l})=>e.jsxs("div",{className:"bg-white shadow rounded-lg p-6",children:[e.jsx("h2",{className:"text-lg font-semibold mb-4",children:"Clicks by Type"}),["grant","event","project"].map(t=>{const c=l.filter(n=>n.entity_type===t);return c.length===0?null:e.jsxs("div",{className:"mb-4",children:[e.jsx("h3",{className:"text-md font-bold text-gray-800 capitalize",children:t==="grant"?"Grant":t==="event"?"Event":"Project"}),e.jsx("ul",{className:"mt-2",children:c.map((n,i)=>e.jsxs("li",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:n.entity_name})," -"," ",e.jsxs("span",{className:"text-blue-500",children:[n.total_clicks," clicks"]})]},i))})]},t)})]}),v=({items:l=[],timer:t=7e3,renderItem:c,fadeDuration:n=300,className:i="",label:h,seoPrefix:g="/events/",label_color:u})=>{const[o,x]=m.useState(0),[j,s]=m.useState(!0),d=m.useRef(null),b=m.useRef(null);m.useEffect(()=>{if(!l.length)return;const r=setInterval(()=>{s(!1),setTimeout(()=>{x(f=>(f+1)%l.length),s(!0)},n)},t);return()=>clearInterval(r)},[l,t,n]);const k=r=>{s(!1),setTimeout(()=>{x(r),s(!0)},n)},y=r=>{d.current=r},N=r=>{if(b.current=r,d.current===null||b.current===null)return;const f=d.current-b.current;f>50?(s(!1),setTimeout(()=>{x(p=>(p+1)%l.length),s(!0)},n)):f<-50&&(s(!1),setTimeout(()=>{x(p=>p===0?l.length-1:p-1),s(!0)},n)),d.current=null,b.current=null},_=r=>{y(r.touches[0].clientX)},P=r=>{},w=r=>{N(r.changedTouches[0].clientX)},S=r=>{y(r.clientX)},a=r=>{N(r.clientX)},L=()=>{const r=l[o];r&&r.url&&(window.location.href=`${g}${r.url}`)};return e.jsxs("div",{className:`relative h-full ${i}`,onTouchStart:_,onTouchMove:P,onTouchEnd:w,onTouchCancel:w,onMouseDown:S,onMouseUp:a,children:[h&&e.jsx("div",{className:`absolute top-2 left-3 ${u} text-white px-2 py-1 text-xs font-bold rounded z-10`,children:h}),l.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("div",{onClick:L,className:`cursor-pointer transform h-full transition-opacity duration-${n} ${j?"opacity-100":"opacity-0"}`,children:c(l[o],o)},l[o].id),e.jsx("div",{className:"absolute bottom-2 right-2 flex space-x-2",children:l.map((r,f)=>e.jsx("button",{onClick:()=>k(f),className:`w-2 h-2 rounded-full ${f===o?"bg-indigo-500":"bg-gray-300"}`},f))})]})]})},X=({totalUsers:l,onlineUsers:t,clicksByType:c,posts:n,events:i,projects:h,grants:g,academicians:u,universities:o,faculties:x,users:j,researchOptions:s,profileIncompleteAlert:d})=>{const{isAdmin:b,isFacultyAdmin:k}=T(),[y,N]=m.useState(!1);m.useEffect(()=>{d!=null&&d.show&&N(!0)},[d]);const _=a=>e.jsxs("div",{className:"block relative p-5 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end",style:{backgroundImage:`url(${encodeURI(a.featured_image?`/storage/${a.featured_image}`:"/storage/default.jpg")})`,backgroundSize:"cover",backgroundPosition:"center"},children:[e.jsx("div",{className:"absolute inset-0 bg-black opacity-40"}),e.jsxs("div",{className:"relative z-10 text-white pr-10",children:[e.jsx("h2",{className:"text-4xl font-bold truncate",title:a.title,children:a.title||"Untitled Post"}),a.content&&e.jsx("div",{className:"text-sm line-clamp-2 mb-2",dangerouslySetInnerHTML:{__html:a.content}}),e.jsxs("div",{className:"flex items-center mt-1 space-x-2",children:[e.jsx("p",{className:"text-xs",children:new Date(a.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsxs("div",{className:"flex items-center text-xs",children:[e.jsx(z,{className:"w-4 h-4"}),e.jsx("span",{className:"ml-1",children:a.total_views})]}),e.jsxs("div",{className:"flex items-center text-xs",children:[e.jsx(U,{className:"w-4 h-4 text-red-500"}),e.jsx("span",{className:"ml-1",children:a.total_likes})]}),e.jsxs("div",{className:"flex items-center text-xs",children:[e.jsx($,{className:"w-4 h-4"}),e.jsx("span",{className:"ml-1",children:a.total_shares})]})]})]})]})]}),P=a=>e.jsxs("div",{className:"block relative p-3 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end",style:{backgroundImage:`url(${encodeURI(a.image?`/storage/${a.image}`:"/storage/default.jpg")})`,backgroundSize:"cover",backgroundPosition:"center"},children:[e.jsx("div",{className:"absolute inset-0 bg-black opacity-40"}),e.jsxs("div",{className:"relative z-10 text-white",children:[e.jsx("h3",{className:"text-lg font-bold truncate",title:a.event_name,children:a.event_name||"Untitled Event"}),e.jsx("p",{className:"text-xs",children:new Date(a.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})})]})]}),w=a=>e.jsxs("div",{className:"block relative p-3 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end",style:{backgroundImage:`url(${encodeURI(a.image?`/storage/${a.image}`:"/storage/default.jpg")})`,backgroundSize:"cover",backgroundPosition:"center"},children:[e.jsx("div",{className:"absolute inset-0 bg-black opacity-40"}),e.jsxs("div",{className:"relative z-10 text-white",children:[e.jsx("h3",{className:"text-lg font-bold truncate",title:a.title,children:a.title||"Untitled Project"}),e.jsx("p",{className:"text-xs",children:new Date(a.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})})]})]}),S=a=>e.jsxs("div",{className:"relative p-3 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end",style:{backgroundImage:`url(${encodeURI(a.image?`/storage/${a.image}`:"/storage/default.jpg")})`,backgroundSize:"cover",backgroundPosition:"center"},children:[e.jsx("div",{className:"absolute inset-0 bg-black opacity-40"}),e.jsxs("div",{className:"relative z-10 text-white",children:[e.jsx("h3",{className:"text-lg font-bold truncate",title:a.title,children:a.title||"Untitled Grant"}),e.jsx("p",{className:"text-xs",children:new Date(a.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})})]})]});return e.jsxs("div",{className:"p-6 md:py-0 md:px-2 min-h-screen",children:[e.jsx(E,{show:y&&(d==null?void 0:d.show),enter:"transition-opacity duration-300",enterFrom:"opacity-0",enterTo:"opacity-100",leave:"transition-opacity duration-200",leaveFrom:"opacity-100",leaveTo:"opacity-0",children:e.jsxs("div",{className:"p-4 mb-4 text-sm text-yellow-800 bg-yellow-100 rounded-lg flex items-center justify-between",role:"alert",children:[e.jsx("div",{className:"flex items-center",children:d==null?void 0:d.message}),e.jsxs(D,{href:route("role.edit"),className:"ml-4 px-4 py-2 bg-white text-yellow-800 border border-yellow-800 rounded-md hover:bg-yellow-50 transition-colors duration-200 flex items-center",children:["Update Now",e.jsx("span",{className:"ml-2 w-2 h-2 bg-red-500 rounded-full"})]})]})}),b&&e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4 mb-6",children:[e.jsx(M,{totalUsers:l}),e.jsx(B,{onlineUsers:t}),e.jsx(I,{clicksByType:c})]}),k&&e.jsx(F,{profilesData:u,supervisorAvailabilityKey:"availability_as_supervisor",universitiesList:o,faculties:x,isPostgraduateList:!1,isFacultyAdminDashboard:!0,users:j,researchOptions:s}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-10 gap-6 mb-[10rem] h-[300px]",children:[e.jsx("div",{className:"md:col-span-4 h-full",children:e.jsx(v,{items:n.slice(0,5),timer:7e3,fadeDuration:300,renderItem:_,label:"Post",seoPrefix:"/posts/",label_color:"bg-blue-500"})}),e.jsxs("div",{className:"md:col-span-3 h-full flex flex-col gap-4",children:[e.jsxs("div",{className:"grid grid-cols-2 gap-4 h-1/2",children:[e.jsx(v,{items:i.slice(0,5),timer:8e3,fadeDuration:300,renderItem:P,label:"Event",seoPrefix:"/events/",label_color:"bg-red-500"}),e.jsx(v,{items:h.slice(0,5),timer:9e3,fadeDuration:300,renderItem:w,label:"Project",seoPrefix:"/projects/",label_color:"bg-orange-500"})]}),e.jsx("div",{className:"h-1/2",children:e.jsx(v,{items:g.slice(0,5),timer:1e4,fadeDuration:300,renderItem:S,label:"Grant",seoPrefix:"/grants/",label_color:"bg-green-700"})})]}),e.jsx("div",{className:"md:col-span-3 h-full",children:e.jsx(R,{events:i})})]}),e.jsx("div",{className:"grid grid-cols-1 gap-4",children:e.jsx(G,{})})]})},H=({posts:l,events:t,grants:c,users:n,profileIncompleteAlert:i})=>{const h=new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"}),[g,u]=m.useState(!1);m.useEffect(()=>{i!=null&&i.show&&u(!0)},[i]);const o=s=>e.jsxs("div",{className:"block relative p-5 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end",style:{backgroundImage:`url(${encodeURI(s.featured_image?`/storage/${s.featured_image}`:"/storage/default.jpg")})`,backgroundSize:"cover",backgroundPosition:"center"},children:[e.jsx("div",{className:"absolute inset-0 bg-black opacity-40"}),e.jsxs("div",{className:"relative z-10 text-white pr-10",children:[e.jsx("h2",{className:"text-4xl font-bold truncate",title:s.title,children:s.title||"Untitled Post"}),s.content&&e.jsx("div",{className:"text-sm line-clamp-2 mb-2",dangerouslySetInnerHTML:{__html:s.content}}),e.jsxs("div",{className:"flex items-center mt-1 space-x-2",children:[e.jsx("p",{className:"text-xs",children:new Date(s.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsxs("div",{className:"flex items-center text-xs",children:[e.jsx(z,{className:"w-4 h-4"}),e.jsx("span",{className:"ml-1",children:s.total_views})]}),e.jsxs("div",{className:"flex items-center text-xs",children:[e.jsx(U,{className:"w-4 h-4 text-red-500"}),e.jsx("span",{className:"ml-1",children:s.total_likes})]}),e.jsxs("div",{className:"flex items-center text-xs",children:[e.jsx($,{className:"w-4 h-4"}),e.jsx("span",{className:"ml-1",children:s.total_shares})]})]})]})]})]}),x=s=>e.jsxs("div",{className:"block relative p-3 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end",style:{backgroundImage:`url(${encodeURI(s.image?`/storage/${s.image}`:"/storage/default.jpg")})`,backgroundSize:"cover",backgroundPosition:"center"},children:[e.jsx("div",{className:"absolute inset-0 bg-black opacity-40"}),e.jsxs("div",{className:"relative z-10 text-white",children:[e.jsx("h3",{className:"text-lg font-bold truncate",title:s.event_name,children:s.event_name||"Untitled Event"}),e.jsx("p",{className:"text-xs",children:new Date(s.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})})]})]}),j=s=>e.jsxs("div",{className:"relative p-3 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end",style:{backgroundImage:`url(${encodeURI(s.image?`/storage/${s.image}`:"/storage/default.jpg")})`,backgroundSize:"cover",backgroundPosition:"center"},children:[e.jsx("div",{className:"absolute inset-0 bg-black opacity-40"}),e.jsxs("div",{className:"relative z-10 text-white",children:[e.jsx("h3",{className:"text-lg font-bold truncate",title:s.title,children:s.title||"Untitled Grant"}),e.jsx("p",{className:"text-xs",children:new Date(s.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})})]})]});return e.jsx("div",{className:"w-screen bg-gray-200 flex items-center justify-center",children:e.jsx("div",{className:"bg-white text-gray-800 shadow-lg overflow-hidden relative flex flex-col",style:{width:"500px",maxWidth:"100%"},children:e.jsxs("div",{className:"bg-white w-full px-5 pt-6 pb-4 overflow-y-auto",children:[e.jsx(E,{show:g&&(i==null?void 0:i.show),enter:"transition-all duration-300 ease-in-out",enterFrom:"opacity-0 -translate-y-4",enterTo:"opacity-100 translate-y-0",leave:"transition-all duration-200",leaveFrom:"opacity-100 translate-y-0",leaveTo:"opacity-0 -translate-y-4",children:e.jsxs("div",{className:"p-4 mb-4 text-sm text-yellow-800 bg-yellow-100 rounded-lg",role:"alert",children:[e.jsx("div",{className:"flex items-center mb-2",children:i==null?void 0:i.message}),e.jsxs(D,{href:route("role.edit"),className:"mt-2 inline-flex items-center px-4 py-2 bg-white text-yellow-800 border border-yellow-800 rounded-md hover:bg-yellow-50 transition-colors duration-200",children:["Update Now",e.jsx("span",{className:"ml-2 w-2 h-2 bg-red-500 rounded-full"})]})]})}),e.jsxs("div",{className:"mb-3",children:[e.jsx("h1",{className:"text-3xl font-bold",children:"Today"}),e.jsx("p",{className:"text-sm text-gray-500 uppercase font-bold",children:h})]}),e.jsxs("div",{className:"mb-5",children:[e.jsx("div",{className:"mb-4 h-[280px]",children:e.jsx(v,{items:l.slice(0,5),timer:7e3,fadeDuration:300,renderItem:o,label:"Post",seoPrefix:"/posts/",label_color:"bg-blue-500"})}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsx("div",{className:"h-[160px]",children:e.jsx(v,{items:t.slice(0,5),timer:8e3,fadeDuration:300,renderItem:x,label:"Event",seoPrefix:"/events/",label_color:"bg-red-500"})}),e.jsx("div",{className:"h-[160px]",children:e.jsx(v,{items:c.slice(0,5),timer:9e3,fadeDuration:300,renderItem:j,label:"Grant",seoPrefix:"/grants/",label_color:"bg-green-700"})})]})]}),e.jsx("div",{className:"mb-4",children:e.jsx(G,{})})]})})})},Q=()=>{const[l,t]=m.useState(!1);return m.useEffect(()=>{const c=()=>{t(window.innerWidth>=1024)};return c(),window.addEventListener("resize",c),()=>window.removeEventListener("resize",c)},[]),l},ee=({totalUsers:l,onlineUsers:t,clicksByType:c,events:n,posts:i,projects:h,grants:g,academicians:u,universities:o,faculties:x,users:j,researchOptions:s,profileIncompleteAlert:d})=>{T();const b=Q();return e.jsx(C,{title:"Dashboard",children:b?e.jsx(X,{totalUsers:l,onlineUsers:t,clicksByType:c,events:n,posts:i,projects:h,grants:g,academicians:u,universities:o,faculties:x,users:j,researchOptions:s,profileIncompleteAlert:d}):e.jsx(H,{events:n,users:j,grants:g,profileIncompleteAlert:d,posts:i})})};export{ee as default};
