import{j as e,r as j,a as E}from"./app-B8prKcRU.js";import{M as G}from"./MainLayout-DD4M4n_2.js";import{P as L}from"./ProfileCard-CMRd8AW7.js";import{u as I}from"./useRoles-eAsCfk_9.js";import{a as P,b as D,c as S}from"./index-Cf3U2bbz.js";import"./FilterDropdown-ieDjk1Em.js";import"./react-select.esm-DldCUatH.js";const $=()=>{const l=[{label:"Give Feedback",icon:e.jsx("img",{src:"/images/feedback.png",alt:"Feedback",style:{width:"30px",height:"30px"}}),link:"https://forms.gle/CQnJJxd8tfSrL2RE7"},{label:"Find Academician",icon:e.jsx("img",{src:"/images/academician.png",alt:"Academician",style:{width:"30px",height:"30px"}}),link:"/academicians"},{label:"Find Postgraduate",icon:e.jsx("img",{src:"/images/postgraduate.png",alt:"Postgraduate",style:{width:"30px",height:"30px"}}),link:"/postgraduates"},{label:"ChatGPT",icon:e.jsx("img",{src:"/images/chatgpt.png",alt:"ChatGPT",style:{width:"30px",height:"30px"}}),link:"https://chatgpt.com/"},{label:"Scispaces",icon:e.jsx("img",{src:"/images/scispaces.png",alt:"Scispaces",style:{width:"30px",height:"30px"}}),link:"https://typeset.io/"},{label:"Canva",icon:e.jsx("img",{src:"/images/canva.png",alt:"Canva",style:{width:"30px",height:"30px"}}),link:"https://www.canva.com/"},{label:"Mendeley",icon:e.jsx("img",{src:"/images/mendeley.png",alt:"Mendeley",style:{width:"30px",height:"30px"}}),link:"https://www.mendeley.com/"},{label:"Zotero",icon:e.jsx("img",{src:"/images/zotero.png",alt:"Zotero",style:{width:"30px",height:"30px"}}),link:"https://www.zotero.org/"},{label:"Scimago",icon:e.jsx("img",{src:"/images/scimago.png",alt:"Scimago",style:{width:"30px",height:"30px"}}),link:"https://www.scimagojr.com/"},{label:"Scopus",icon:e.jsx("img",{src:"/images/scopus.png",alt:"Scopus",style:{width:"30px",height:"30px"}}),link:"https://www.scopus.com/sources.uri?zone=TopNavBar&origin=searchbasic"}];return e.jsxs("div",{className:"md:mx-0 md:auto",children:[e.jsx("h2",{className:"text-2xl font-semibold mb-4 mt-4",children:"QuickLinks"}),e.jsx("div",{className:"grid grid-cols-3 md:grid-cols-3 lg:grid-cols-9 gap-4",children:l.map((t,r)=>e.jsx("div",{className:"flex flex-col items-center justify-center bg-white shadow-md rounded-lg hover:bg-gray-100 transition p-4",style:{width:"100%",height:"137px"},children:t.link?e.jsxs("a",{href:t.link,target:"_blank",rel:"noopener noreferrer",className:"flex flex-col items-center",children:[e.jsx("div",{className:"mb-2",children:t.icon}),e.jsx("p",{className:"text-sm font-medium text-gray-700 text-center",children:t.label})]}):e.jsxs("button",{className:"flex flex-col items-center",children:[e.jsx("div",{className:"mb-2",children:t.icon}),e.jsx("p",{className:"text-sm font-medium text-gray-700 text-center",children:t.label})]})},r))})]})},C=({events:l=[]})=>{const[t,r]=j.useState(1),i=5,c=Math.ceil(l.length/i),o=l.slice((t-1)*i,t*i),m=()=>{t>1&&r(t-1)},h=()=>{t<c&&r(t+1)};return e.jsxs("div",{className:"bg-white shadow-md rounded-lg p-4 h-full",children:[e.jsx("h2",{className:"text-base font-bold mb-3",children:"Upcoming Events"}),e.jsx("ul",{className:"space-y-2",children:o.map((s,x)=>e.jsxs("li",{className:"flex items-center justify-between p-2 rounded-lg bg-gray-50 shadow hover:shadow-md transition-all",children:[e.jsxs("div",{className:"flex items-start space-x-2",children:[e.jsx("img",{src:"https://flagcdn.com/w40/my.png",alt:"Malaysia Flag",className:"w-6 h-4 mt-1 ml-2"}),e.jsxs("div",{children:[e.jsx("p",{className:"font-medium text-gray-800 truncate pr-2 w-32",title:s.event_name,children:s.event_name}),e.jsxs("p",{className:"text-xs text-gray-600",children:[s.start_date_time,"   ",s.location]})]})]}),e.jsx(E,{href:route("events.show",s.url),className:"bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-700 text-xs",children:"→"})]},x))}),e.jsxs("div",{className:"flex justify-between items-center mt-3",children:[e.jsx("button",{onClick:m,disabled:t===1,className:`px-3 py-1 text-xs font-medium rounded-lg ${t===1?"bg-gray-300 text-gray-500 cursor-not-allowed":"bg-blue-600 text-white hover:bg-blue-700"}`,children:"Prev"}),e.jsxs("p",{className:"text-xs",children:["Page ",t," of ",c]}),e.jsx("button",{onClick:h,disabled:t===c,className:`px-3 py-1 text-xs font-medium rounded-lg ${t===c?"bg-gray-300 text-gray-500 cursor-not-allowed":"bg-blue-600 text-white hover:bg-blue-700"}`,children:"Next"})]})]})},R=({totalUsers:l})=>e.jsxs("div",{className:"bg-white shadow rounded-lg p-6",children:[e.jsx("h2",{className:"text-lg font-semibold",children:"Total Registered Users"}),e.jsx("p",{className:"text-3xl font-bold",children:l})]}),M=({onlineUsers:l})=>e.jsxs("div",{className:"bg-white shadow rounded-lg p-6",children:[e.jsx("h2",{className:"text-lg font-semibold",children:"Online Users"}),e.jsx("p",{className:"text-3xl font-bold",children:l})]}),F=({clicksByType:l})=>e.jsxs("div",{className:"bg-white shadow rounded-lg p-6",children:[e.jsx("h2",{className:"text-lg font-semibold mb-4",children:"Clicks by Type"}),["grant","event","project"].map(t=>{const r=l.filter(i=>i.entity_type===t);return r.length===0?null:e.jsxs("div",{className:"mb-4",children:[e.jsx("h3",{className:"text-md font-bold text-gray-800 capitalize",children:t==="grant"?"Grant":t==="event"?"Event":"Project"}),e.jsx("ul",{className:"mt-2",children:r.map((i,c)=>e.jsxs("li",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:i.entity_name})," -"," ",e.jsxs("span",{className:"text-blue-500",children:[i.total_clicks," clicks"]})]},c))})]},t)})]}),f=({items:l=[],timer:t=7e3,renderItem:r,fadeDuration:i=300,className:c="",label:o,seoPrefix:m="/events/",label_color:h})=>{const[s,x]=j.useState(0),[b,d]=j.useState(!0),g=j.useRef(null),p=j.useRef(null);j.useEffect(()=>{if(!l.length)return;const n=setInterval(()=>{d(!1),setTimeout(()=>{x(u=>(u+1)%l.length),d(!0)},i)},t);return()=>clearInterval(n)},[l,t,i]);const w=n=>{d(!1),setTimeout(()=>{x(n),d(!0)},i)},v=n=>{g.current=n},N=n=>{if(p.current=n,g.current===null||p.current===null)return;const u=g.current-p.current;u>50?(d(!1),setTimeout(()=>{x(y=>(y+1)%l.length),d(!0)},i)):u<-50&&(d(!1),setTimeout(()=>{x(y=>y===0?l.length-1:y-1),d(!0)},i)),g.current=null,p.current=null},k=n=>{v(n.touches[0].clientX)},a=n=>{},_=n=>{N(n.changedTouches[0].clientX)},z=n=>{v(n.clientX)},U=n=>{N(n.clientX)},T=()=>{const n=l[s];n&&n.url&&(window.location.href=`${m}${n.url}`)};return e.jsxs("div",{className:`relative h-full ${c}`,onTouchStart:k,onTouchMove:a,onTouchEnd:_,onTouchCancel:_,onMouseDown:z,onMouseUp:U,children:[o&&e.jsx("div",{className:`absolute top-2 left-3 ${h} text-white px-2 py-1 text-xs font-bold rounded z-10`,children:o}),l.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("div",{onClick:T,className:`cursor-pointer transform h-full transition-opacity duration-${i} ${b?"opacity-100":"opacity-0"}`,children:r(l[s],s)},l[s].id),e.jsx("div",{className:"absolute bottom-2 right-2 flex space-x-2",children:l.map((n,u)=>e.jsx("button",{onClick:()=>w(u),className:`w-2 h-2 rounded-full ${u===s?"bg-indigo-500":"bg-gray-300"}`},u))})]})]})},B=({totalUsers:l,onlineUsers:t,clicksByType:r,posts:i,events:c,projects:o,grants:m,academicians:h,universities:s,faculties:x,users:b,researchOptions:d})=>{const{isAdmin:g,isFacultyAdmin:p}=I(),w=a=>e.jsxs("div",{className:"block relative p-5 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end",style:{backgroundImage:`url(${encodeURI(a.featured_image?`/storage/${a.featured_image}`:"/storage/default.jpg")})`,backgroundSize:"cover",backgroundPosition:"center"},children:[e.jsx("div",{className:"absolute inset-0 bg-black opacity-40"}),e.jsxs("div",{className:"relative z-10 text-white pr-10",children:[e.jsx("h2",{className:"text-4xl font-bold truncate",title:a.title,children:a.title||"Untitled Post"}),a.content&&e.jsx("div",{className:"text-sm line-clamp-2 mb-2",dangerouslySetInnerHTML:{__html:a.content}}),e.jsxs("div",{className:"flex items-center mt-1 space-x-2",children:[e.jsx("p",{className:"text-xs",children:new Date(a.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsxs("div",{className:"flex items-center text-xs",children:[e.jsx(P,{className:"w-4 h-4"}),e.jsx("span",{className:"ml-1",children:a.total_views})]}),e.jsxs("div",{className:"flex items-center text-xs",children:[e.jsx(D,{className:"w-4 h-4 text-red-500"}),e.jsx("span",{className:"ml-1",children:a.total_likes})]}),e.jsxs("div",{className:"flex items-center text-xs",children:[e.jsx(S,{className:"w-4 h-4"}),e.jsx("span",{className:"ml-1",children:a.total_shares})]})]})]})]})]}),v=a=>e.jsxs("div",{className:"block relative p-3 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end",style:{backgroundImage:`url(${encodeURI(a.image?`/storage/${a.image}`:"/storage/default.jpg")})`,backgroundSize:"cover",backgroundPosition:"center"},children:[e.jsx("div",{className:"absolute inset-0 bg-black opacity-40"}),e.jsxs("div",{className:"relative z-10 text-white",children:[e.jsx("h3",{className:"text-lg font-bold truncate",title:a.event_name,children:a.event_name||"Untitled Event"}),e.jsx("p",{className:"text-xs",children:new Date(a.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})})]})]}),N=a=>e.jsxs("div",{className:"block relative p-3 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end",style:{backgroundImage:`url(${encodeURI(a.image?`/storage/${a.image}`:"/storage/default.jpg")})`,backgroundSize:"cover",backgroundPosition:"center"},children:[e.jsx("div",{className:"absolute inset-0 bg-black opacity-40"}),e.jsxs("div",{className:"relative z-10 text-white",children:[e.jsx("h3",{className:"text-lg font-bold truncate",title:a.title,children:a.title||"Untitled Project"}),e.jsx("p",{className:"text-xs",children:new Date(a.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})})]})]}),k=a=>e.jsxs("div",{className:"relative p-3 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end",style:{backgroundImage:`url(${encodeURI(a.image?`/storage/${a.image}`:"/storage/default.jpg")})`,backgroundSize:"cover",backgroundPosition:"center"},children:[e.jsx("div",{className:"absolute inset-0 bg-black opacity-40"}),e.jsxs("div",{className:"relative z-10 text-white",children:[e.jsx("h3",{className:"text-lg font-bold truncate",title:a.title,children:a.title||"Untitled Grant"}),e.jsx("p",{className:"text-xs",children:new Date(a.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})})]})]});return e.jsxs("div",{className:"p-6 md:py-0 md:px-2 min-h-screen",children:[g&&e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4 mb-6",children:[e.jsx(R,{totalUsers:l}),e.jsx(M,{onlineUsers:t}),e.jsx(F,{clicksByType:r})]}),p&&e.jsx(L,{profilesData:h,supervisorAvailabilityKey:"availability_as_supervisor",universitiesList:s,faculties:x,isPostgraduateList:!1,isFacultyAdminDashboard:!0,users:b,researchOptions:d}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-10 gap-6 mb-[10rem] h-[300px]",children:[e.jsx("div",{className:"md:col-span-4 h-full",children:e.jsx(f,{items:i.slice(0,5),timer:7e3,fadeDuration:300,renderItem:w,label:"Post",seoPrefix:"/posts/",label_color:"bg-blue-500"})}),e.jsxs("div",{className:"md:col-span-3 h-full flex flex-col gap-4",children:[e.jsxs("div",{className:"grid grid-cols-2 gap-4 h-1/2",children:[e.jsx(f,{items:c.slice(0,5),timer:8e3,fadeDuration:300,renderItem:v,label:"Event",seoPrefix:"/events/",label_color:"bg-red-500"}),e.jsx(f,{items:o.slice(0,5),timer:9e3,fadeDuration:300,renderItem:N,label:"Project",seoPrefix:"/projects/",label_color:"bg-orange-500"})]}),e.jsx("div",{className:"h-1/2",children:e.jsx(f,{items:m.slice(0,5),timer:1e4,fadeDuration:300,renderItem:k,label:"Grant",seoPrefix:"/grants/",label_color:"bg-green-700"})})]}),e.jsx("div",{className:"md:col-span-3 h-full",children:e.jsx(C,{events:c})})]}),e.jsx("div",{className:"grid grid-cols-1 gap-4",children:e.jsx($,{})})]})},A=({posts:l,events:t,grants:r,users:i})=>{const c=new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"}),o=s=>e.jsxs("div",{className:"block relative p-5 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end",style:{backgroundImage:`url(${encodeURI(s.featured_image?`/storage/${s.featured_image}`:"/storage/default.jpg")})`,backgroundSize:"cover",backgroundPosition:"center"},children:[e.jsx("div",{className:"absolute inset-0 bg-black opacity-40"}),e.jsxs("div",{className:"relative z-10 text-white pr-10",children:[e.jsx("h2",{className:"text-4xl font-bold truncate",title:s.title,children:s.title||"Untitled Post"}),s.content&&e.jsx("div",{className:"text-sm line-clamp-2 mb-2",dangerouslySetInnerHTML:{__html:s.content}}),e.jsxs("div",{className:"flex items-center mt-1 space-x-2",children:[e.jsx("p",{className:"text-xs",children:new Date(s.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsxs("div",{className:"flex items-center text-xs",children:[e.jsx(P,{className:"w-4 h-4"}),e.jsx("span",{className:"ml-1",children:s.total_views})]}),e.jsxs("div",{className:"flex items-center text-xs",children:[e.jsx(D,{className:"w-4 h-4 text-red-500"}),e.jsx("span",{className:"ml-1",children:s.total_likes})]}),e.jsxs("div",{className:"flex items-center text-xs",children:[e.jsx(S,{className:"w-4 h-4"}),e.jsx("span",{className:"ml-1",children:s.total_shares})]})]})]})]})]}),m=s=>e.jsxs("div",{className:"block relative p-3 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end",style:{backgroundImage:`url(${encodeURI(s.image?`/storage/${s.image}`:"/storage/default.jpg")})`,backgroundSize:"cover",backgroundPosition:"center"},children:[e.jsx("div",{className:"absolute inset-0 bg-black opacity-40"}),e.jsxs("div",{className:"relative z-10 text-white",children:[e.jsx("h3",{className:"text-lg font-bold truncate",title:s.event_name,children:s.event_name||"Untitled Event"}),e.jsx("p",{className:"text-xs",children:new Date(s.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})})]})]}),h=s=>e.jsxs("div",{className:"relative p-3 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end",style:{backgroundImage:`url(${encodeURI(s.image?`/storage/${s.image}`:"/storage/default.jpg")})`,backgroundSize:"cover",backgroundPosition:"center"},children:[e.jsx("div",{className:"absolute inset-0 bg-black opacity-40"}),e.jsxs("div",{className:"relative z-10 text-white",children:[e.jsx("h3",{className:"text-lg font-bold truncate",title:s.title,children:s.title||"Untitled Grant"}),e.jsx("p",{className:"text-xs",children:new Date(s.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})})]})]});return e.jsx("div",{className:"w-screen bg-gray-200 flex items-center justify-center",children:e.jsx("div",{className:"bg-white text-gray-800 shadow-lg overflow-hidden relative flex flex-col",style:{width:"500px",maxWidth:"100%"},children:e.jsxs("div",{className:"bg-white w-full px-5 pt-6 pb-4 overflow-y-auto",children:[e.jsxs("div",{className:"mb-3",children:[e.jsx("h1",{className:"text-3xl font-bold",children:"Today"}),e.jsx("p",{className:"text-sm text-gray-500 uppercase font-bold",children:c})]}),e.jsxs("div",{className:"mb-5",children:[e.jsx("div",{className:"mb-4 h-[280px]",children:e.jsx(f,{items:l.slice(0,5),timer:7e3,fadeDuration:300,renderItem:o,label:"Post",seoPrefix:"/posts/",label_color:"bg-blue-500"})}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsx("div",{className:"h-[160px]",children:e.jsx(f,{items:t.slice(0,5),timer:8e3,fadeDuration:300,renderItem:m,label:"Event",seoPrefix:"/events/",label_color:"bg-red-500"})}),e.jsx("div",{className:"h-[160px]",children:e.jsx(f,{items:r.slice(0,5),timer:9e3,fadeDuration:300,renderItem:h,label:"Grant",seoPrefix:"/grants/",label_color:"bg-green-700"})})]})]}),e.jsx("div",{className:"mb-4",children:e.jsx($,{})})]})})})},X=()=>{const[l,t]=j.useState(!1);return j.useEffect(()=>{const r=()=>{t(window.innerWidth>=1024)};return r(),window.addEventListener("resize",r),()=>window.removeEventListener("resize",r)},[]),l},K=({totalUsers:l,onlineUsers:t,clicksByType:r,events:i,posts:c,projects:o,grants:m,academicians:h,universities:s,faculties:x,users:b,researchOptions:d})=>{I();const g=X();return e.jsx(G,{title:"Dashboard",children:g?e.jsx(B,{totalUsers:l,onlineUsers:t,clicksByType:r,events:i,posts:c,projects:o,grants:m,academicians:h,universities:s,faculties:x,users:b,researchOptions:d}):e.jsx(A,{events:i,users:b,grants:m,posts:c})})};export{K as default};
