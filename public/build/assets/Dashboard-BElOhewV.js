import{j as e,r as f,a as E}from"./app-dY7ktI29.js";import{M as O}from"./MainLayout-Cc4e7bIL.js";import{P as W}from"./ProfileCard-BFjqk8gH.js";import{u as $}from"./useRoles-92gy4plo.js";import{d as L,e as G,f as C,a as p,g as F,h as R,i as z,b as I,c as M}from"./index-w0cEGzDt.js";import{z as D}from"./transition-Cas48zkC.js";import"./analytics-B60H_cQS.js";import"./FilterDropdown-1XqdxLoE.js";import"./react-select.esm-581I6rm_.js";const B=()=>{const c=[{label:"Give Feedback",icon:e.jsx("img",{src:"/images/feedback.png",alt:"Feedback",style:{width:"30px",height:"30px"}}),link:"https://forms.gle/CQnJJxd8tfSrL2RE7"},{label:"Find Academician",icon:e.jsx("img",{src:"/images/academician.png",alt:"Academician",style:{width:"30px",height:"30px"}}),link:"/academicians"},{label:"Find Postgraduate",icon:e.jsx("img",{src:"/images/postgraduate.png",alt:"Postgraduate",style:{width:"30px",height:"30px"}}),link:"/postgraduates"},{label:"ChatGPT",icon:e.jsx("img",{src:"/images/chatgpt.png",alt:"ChatGPT",style:{width:"30px",height:"30px"}}),link:"https://chatgpt.com/"},{label:"Scispaces",icon:e.jsx("img",{src:"/images/scispaces.png",alt:"Scispaces",style:{width:"30px",height:"30px"}}),link:"https://typeset.io/"},{label:"Canva",icon:e.jsx("img",{src:"/images/canva.png",alt:"Canva",style:{width:"30px",height:"30px"}}),link:"https://www.canva.com/"},{label:"Mendeley",icon:e.jsx("img",{src:"/images/mendeley.png",alt:"Mendeley",style:{width:"30px",height:"30px"}}),link:"https://www.mendeley.com/"},{label:"Zotero",icon:e.jsx("img",{src:"/images/zotero.png",alt:"Zotero",style:{width:"30px",height:"30px"}}),link:"https://www.zotero.org/"},{label:"Scimago",icon:e.jsx("img",{src:"/images/scimago.png",alt:"Scimago",style:{width:"30px",height:"30px"}}),link:"https://www.scimagojr.com/"},{label:"Scopus",icon:e.jsx("img",{src:"/images/scopus.png",alt:"Scopus",style:{width:"30px",height:"30px"}}),link:"https://www.scopus.com/sources.uri?zone=TopNavBar&origin=searchbasic"}];return e.jsxs("div",{className:"md:mx-0 md:auto",children:[e.jsx("h2",{className:"text-2xl font-semibold mb-4 mt-4",children:"QuickLinks"}),e.jsx("div",{className:"grid grid-cols-3 md:grid-cols-3 lg:grid-cols-9 gap-4",children:c.map((l,a)=>e.jsx("div",{className:"flex flex-col items-center justify-center bg-white shadow-md rounded-lg hover:bg-gray-100 transition p-4",style:{width:"100%",height:"137px"},children:l.link?e.jsxs("a",{href:l.link,target:"_blank",rel:"noopener noreferrer",className:"flex flex-col items-center",children:[e.jsx("div",{className:"mb-2",children:l.icon}),e.jsx("p",{className:"text-sm font-medium text-gray-700 text-center",children:l.label})]}):e.jsxs("button",{className:"flex flex-col items-center",children:[e.jsx("div",{className:"mb-2",children:l.icon}),e.jsx("p",{className:"text-sm font-medium text-gray-700 text-center",children:l.label})]})},a))})]})},X=({events:c=[]})=>{const[l,a]=f.useState(1),x=5,o=Math.ceil(c.length/x),u=c.slice((l-1)*x,l*x),j=()=>{l>1&&a(l-1)},b=()=>{l<o&&a(l+1)};return e.jsxs("div",{className:"bg-white shadow-md rounded-lg p-4 h-full",children:[e.jsx("h2",{className:"text-base font-bold mb-3",children:"Upcoming Events"}),e.jsx("ul",{className:"space-y-2",children:u.map((n,s)=>e.jsxs("li",{className:"flex items-center justify-between p-2 rounded-lg bg-gray-50 shadow hover:shadow-md transition-all",children:[e.jsxs("div",{className:"flex items-start space-x-2",children:[e.jsx("img",{src:"https://flagcdn.com/w40/my.png",alt:"Malaysia Flag",className:"w-6 h-4 mt-1 ml-2"}),e.jsxs("div",{children:[e.jsx("p",{className:"font-medium text-gray-800 truncate pr-2 w-32",title:n.event_name,children:n.event_name}),e.jsx("p",{className:"text-xs text-gray-600",children:new Date(n.start_date).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})})]})]}),e.jsx(E,{href:route("events.show",n.url),className:"bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-700 text-xs",children:"→"})]},s))}),e.jsxs("div",{className:"flex justify-between items-center mt-3",children:[e.jsx("button",{onClick:j,disabled:l===1,className:`px-3 py-1 text-xs font-medium rounded-lg ${l===1?"bg-gray-300 text-gray-500 cursor-not-allowed":"bg-blue-600 text-white hover:bg-blue-700"}`,children:"Prev"}),e.jsxs("p",{className:"text-xs",children:["Page ",l," of ",o]}),e.jsx("button",{onClick:b,disabled:l===o,className:`px-3 py-1 text-xs font-medium rounded-lg ${l===o?"bg-gray-300 text-gray-500 cursor-not-allowed":"bg-blue-600 text-white hover:bg-blue-700"}`,children:"Next"})]})]})},w=({items:c=[],timer:l=7e3,renderItem:a,fadeDuration:x=300,className:o="",label:u,seoPrefix:j="/events/",label_color:b})=>{const[n,s]=f.useState(0),[i,t]=f.useState(!0),h=f.useRef(null),g=f.useRef(null);f.useEffect(()=>{if(!c.length)return;const m=setInterval(()=>{t(!1),setTimeout(()=>{s(v=>(v+1)%c.length),t(!0)},x)},l);return()=>clearInterval(m)},[c,l,x]);const N=m=>{t(!1),setTimeout(()=>{s(m),t(!0)},x)},d=m=>{h.current=m},y=m=>{if(g.current=m,h.current===null||g.current===null)return;const v=h.current-g.current;v>50?(t(!1),setTimeout(()=>{s(S=>(S+1)%c.length),t(!0)},x)):v<-50&&(t(!1),setTimeout(()=>{s(S=>S===0?c.length-1:S-1),t(!0)},x)),h.current=null,g.current=null},_=m=>{d(m.touches[0].clientX)},P=m=>{},k=m=>{y(m.changedTouches[0].clientX)},T=m=>{d(m.clientX)},U=m=>{y(m.clientX)},r=()=>{const m=c[n];m&&m.url&&(window.location.href=`${j}${m.url}`)};return e.jsxs("div",{className:`relative h-full ${o}`,onTouchStart:_,onTouchMove:P,onTouchEnd:k,onTouchCancel:k,onMouseDown:T,onMouseUp:U,children:[u&&e.jsx("div",{className:`absolute top-2 left-3 ${b} text-white px-2 py-1 text-xs font-bold rounded z-10`,children:u}),c.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("div",{onClick:r,className:`cursor-pointer transform h-full transition-opacity duration-${x} ${i?"opacity-100":"opacity-0"}`,children:a(c[n],n)},c[n].id),e.jsx("div",{className:"absolute bottom-2 right-2 flex space-x-2",children:c.map((m,v)=>e.jsx("button",{onClick:()=>N(v),className:`w-2 h-2 rounded-full ${v===n?"bg-indigo-500":"bg-gray-300"}`},v))})]})]})},H=({totalUsers:c,topViewedAcademicians:l,analyticsData:a})=>{const[x,o]=f.useState(!!a),u=()=>a?e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",children:[e.jsxs("div",{className:"bg-white shadow rounded-lg p-6 flex justify-between items-center",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-sm font-semibold text-gray-500",children:"ACTIVE USERS NOW"}),e.jsx("p",{className:"text-3xl font-bold",children:a.activeUsers||0})]}),e.jsx("div",{className:"bg-blue-100 p-3 rounded-full",children:e.jsx(L,{className:"text-blue-500 text-xl"})})]}),e.jsxs("div",{className:"bg-white shadow rounded-lg p-6 flex justify-between items-center",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-sm font-semibold text-gray-500",children:"AVG. SESSION"}),e.jsxs("p",{className:"text-3xl font-bold",children:[a.avgSessionDuration||0,"s"]})]}),e.jsx("div",{className:"bg-green-100 p-3 rounded-full",children:e.jsx(G,{className:"text-green-500 text-xl"})})]}),e.jsxs("div",{className:"bg-white shadow rounded-lg p-6 flex justify-between items-center",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-sm font-semibold text-gray-500",children:"REGISTERED USERS"}),e.jsx("p",{className:"text-3xl font-bold",children:c})]}),e.jsx("div",{className:"bg-purple-100 p-3 rounded-full",children:e.jsx(C,{className:"text-purple-500 text-xl"})})]}),e.jsxs("div",{className:"bg-white shadow rounded-lg p-6 flex justify-between items-center",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-sm font-semibold text-gray-500",children:"TOP PROFILE VIEWS"}),e.jsx("p",{className:"text-3xl font-bold",children:l&&l.length>0?l[0].total_views:0})]}),e.jsx("div",{className:"bg-yellow-100 p-3 rounded-full",children:e.jsx(p,{className:"text-yellow-500 text-xl"})})]})]}):e.jsx("div",{className:"bg-red-50 text-red-500 p-4 rounded-lg",children:e.jsx("p",{children:"Unable to load Google Analytics data. Please check your configuration."})}),j=({academicians:s})=>e.jsxs("div",{className:"bg-white shadow rounded-lg p-6",children:[e.jsxs("div",{className:"flex justify-between items-center mb-4",children:[e.jsx("h2",{className:"text-lg font-semibold",children:"Top Viewed Academicians"}),e.jsx(F,{className:"text-indigo-500"})]}),e.jsx("div",{className:"space-y-3 max-h-[350px] overflow-y-auto",children:s&&s.length>0?s.map((i,t)=>e.jsxs("div",{className:"flex items-center justify-between border-b pb-2",children:[e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3",children:e.jsx("span",{className:"text-indigo-500 font-bold",children:t+1})}),e.jsx("div",{className:"w-8 h-8 rounded-full bg-cover bg-center mr-2",style:{backgroundImage:`url(${encodeURI(i.profile_picture?`/storage/${i.profile_picture}`:"/storage/profile_pictures/default.jpg")})`}}),e.jsxs("div",{children:[e.jsx("p",{className:"font-medium text-sm truncate max-w-[150px]",title:i.full_name||"Unknown",children:i.full_name||"Unknown"}),e.jsx("p",{className:"text-xs text-gray-500 truncate max-w-[150px]",title:i.current_position||"No position",children:i.current_position||"No position"})]})]}),e.jsxs("div",{className:"flex items-center",children:[e.jsx(p,{className:"w-3 h-3 text-indigo-500 mr-1"}),e.jsx("span",{className:"text-sm font-medium",children:i.total_views})]})]},i.id)):e.jsx("p",{className:"text-sm text-gray-500",children:"No view data available"})})]}),b=({pages:s})=>e.jsxs("div",{className:"bg-white shadow rounded-lg p-6 h-full",children:[e.jsxs("div",{className:"flex justify-between items-center mb-4",children:[e.jsx("h2",{className:"text-lg font-semibold",children:"Top Pages"}),e.jsx(R,{className:"text-indigo-500"})]}),s&&s.length>0?e.jsx("div",{className:"space-y-3",children:s.map((i,t)=>e.jsxs("div",{className:"border-b pb-2",children:[e.jsxs("div",{className:"flex items-center mb-1",children:[e.jsx("div",{className:"flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-2",children:e.jsx("span",{className:"text-indigo-500 font-bold text-xs",children:t+1})}),e.jsx("p",{className:"font-medium text-sm truncate max-w-[400px]",title:i.title,children:i.title||"Untitled Page"})]}),e.jsxs("div",{className:"flex justify-between text-xs pl-8",children:[e.jsx("span",{className:"text-gray-500",children:i.path}),e.jsxs("div",{className:"flex items-center",children:[e.jsx(p,{className:"w-3 h-3 text-indigo-500 mr-1"}),e.jsx("span",{className:"font-medium",children:i.views})]})]})]},t))}):e.jsx("div",{className:"flex items-center justify-center h-[280px] bg-gray-50 rounded-lg",children:e.jsx("p",{className:"text-sm text-gray-500",children:"No page view data available"})})]}),n=({pageViewsData:s})=>{const i=s&&s.length>0?Math.max(...s.map(t=>t.views)):100;return e.jsxs("div",{className:"bg-white shadow rounded-lg p-6 h-full",children:[e.jsxs("div",{className:"flex justify-between items-center mb-4",children:[e.jsx("h2",{className:"text-lg font-semibold",children:"Page Views (Last 30 Days)"}),e.jsx(z,{className:"text-indigo-500"})]}),s&&s.length>0?e.jsx("div",{className:"h-[280px] flex items-end space-x-1",children:s.map((t,h)=>{const g=h%5===0,N=t.views/i*100+"%";return e.jsxs("div",{className:"flex flex-col items-center flex-1",children:[e.jsx("div",{className:"w-full bg-indigo-100 hover:bg-indigo-200 transition-all rounded-t",style:{height:N},title:`${t.date}: ${t.views} views`}),g&&e.jsxs("div",{className:"text-xs text-gray-500 mt-1 rotate-45 origin-left whitespace-nowrap",children:[t.date.substring(5)," "]})]},h)})}):e.jsx("div",{className:"flex items-center justify-center h-[280px] bg-gray-50 rounded-lg",children:e.jsx("p",{className:"text-sm text-gray-500",children:"No page view data available"})})]})};return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsx("h1",{className:"text-2xl font-bold",children:"Admin Dashboard"}),e.jsx("div",{className:"text-sm text-gray-500",children:x?e.jsx("span",{className:"text-green-500",children:"✓ Google Analytics connected"}):e.jsx("span",{className:"text-yellow-500",children:"⟳ Loading analytics..."})})]}),u(),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6",children:[e.jsx("div",{className:"lg:col-span-1",children:e.jsx(j,{academicians:l})}),e.jsx("div",{className:"lg:col-span-2",children:e.jsxs("div",{className:"grid grid-cols-1 gap-4",children:[e.jsx(n,{pageViewsData:(a==null?void 0:a.pageViewsOverTime)||[]}),e.jsx(b,{pages:(a==null?void 0:a.topPages)||[]})]})})]})]})},Q=({totalUsers:c,onlineUsers:l,posts:a,events:x,projects:o,grants:u,academicians:j,universities:b,faculties:n,users:s,researchOptions:i,profileIncompleteAlert:t,topViewedAcademicians:h,analyticsData:g})=>{const{isAdmin:N,isFacultyAdmin:d}=$(),[y,_]=f.useState(!1);f.useEffect(()=>{t!=null&&t.show&&_(!0)},[t]);const P=r=>e.jsxs("div",{className:"block relative p-5 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end",style:{backgroundImage:`url(${encodeURI(r.featured_image?`/storage/${r.featured_image}`:"/storage/default.jpg")})`,backgroundSize:"cover",backgroundPosition:"center"},children:[e.jsx("div",{className:"absolute inset-0 bg-black opacity-40"}),e.jsxs("div",{className:"relative z-10 text-white pr-10",children:[e.jsx("h2",{className:"text-4xl font-bold truncate",title:r.title,children:r.title||"Untitled Post"}),r.content&&e.jsx("div",{className:"text-sm line-clamp-2 mb-2",dangerouslySetInnerHTML:{__html:r.content}}),e.jsxs("div",{className:"flex items-center mt-1 space-x-2",children:[e.jsx("p",{className:"text-xs",children:new Date(r.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsxs("div",{className:"flex items-center text-xs",children:[e.jsx(p,{className:"w-4 h-4"}),e.jsx("span",{className:"ml-1",children:r.total_views})]}),e.jsxs("div",{className:"flex items-center text-xs",children:[e.jsx(I,{className:"w-4 h-4 text-red-500"}),e.jsx("span",{className:"ml-1",children:r.total_likes})]}),e.jsxs("div",{className:"flex items-center text-xs",children:[e.jsx(M,{className:"w-4 h-4"}),e.jsx("span",{className:"ml-1",children:r.total_shares})]})]})]})]})]}),k=r=>e.jsxs("div",{className:"block relative p-3 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end",style:{backgroundImage:`url(${encodeURI(r.image?`/storage/${r.image}`:"/storage/default.jpg")})`,backgroundSize:"cover",backgroundPosition:"center"},children:[e.jsx("div",{className:"absolute inset-0 bg-black opacity-40"}),e.jsxs("div",{className:"relative z-10 text-white",children:[e.jsx("h3",{className:"text-lg font-bold truncate",title:r.event_name,children:r.event_name||"Untitled Event"}),e.jsx("p",{className:"text-xs",children:new Date(r.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})})]})]}),T=r=>e.jsxs("div",{className:"block relative p-3 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end",style:{backgroundImage:`url(${encodeURI(r.image?`/storage/${r.image}`:"/storage/default.jpg")})`,backgroundSize:"cover",backgroundPosition:"center"},children:[e.jsx("div",{className:"absolute inset-0 bg-black opacity-40"}),e.jsxs("div",{className:"relative z-10 text-white",children:[e.jsx("h3",{className:"text-lg font-bold truncate",title:r.title,children:r.title||"Untitled Project"}),e.jsx("p",{className:"text-xs",children:new Date(r.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})})]})]}),U=r=>e.jsxs("div",{className:"relative p-3 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end",style:{backgroundImage:`url(${encodeURI(r.image?`/storage/${r.image}`:"/storage/default.jpg")})`,backgroundSize:"cover",backgroundPosition:"center"},children:[e.jsx("div",{className:"absolute inset-0 bg-black opacity-40"}),e.jsxs("div",{className:"relative z-10 text-white",children:[e.jsx("h3",{className:"text-lg font-bold truncate",title:r.title,children:r.title||"Untitled Grant"}),e.jsx("p",{className:"text-xs",children:new Date(r.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})})]})]});return e.jsxs("div",{className:"p-6 md:py-0 md:px-2 min-h-screen",children:[e.jsx(D,{show:y&&(t==null?void 0:t.show),enter:"transition-opacity duration-300",enterFrom:"opacity-0",enterTo:"opacity-100",leave:"transition-opacity duration-200",leaveFrom:"opacity-100",leaveTo:"opacity-0",children:e.jsxs("div",{className:"p-4 mb-4 text-sm text-yellow-800 bg-yellow-100 rounded-lg flex items-center justify-between",role:"alert",children:[e.jsx("div",{className:"flex items-center",children:t==null?void 0:t.message}),e.jsxs(E,{href:route("role.edit"),className:"ml-4 px-4 py-2 bg-white text-yellow-800 border border-yellow-800 rounded-md hover:bg-yellow-50 transition-colors duration-200 flex items-center",children:["Update Now",e.jsx("span",{className:"ml-2 w-2 h-2 bg-red-500 rounded-full"})]})]})}),N&&e.jsx("div",{className:"mb-8",children:e.jsx(H,{totalUsers:c,topViewedAcademicians:h,analyticsData:g})}),d&&e.jsx(W,{profilesData:j,supervisorAvailabilityKey:"availability_as_supervisor",universitiesList:b,faculties:n,isPostgraduateList:!1,isFacultyAdminDashboard:!0,users:s,researchOptions:i}),!N&&e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl font-bold mb-6",children:"Dashboard"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-10 gap-6 mb-[10rem] h-[300px]",children:[e.jsx("div",{className:"md:col-span-4 h-full",children:e.jsx(w,{items:a.slice(0,5),timer:7e3,fadeDuration:300,renderItem:P,label:"Post",seoPrefix:"/posts/",label_color:"bg-blue-500"})}),e.jsxs("div",{className:"md:col-span-3 h-full flex flex-col gap-4",children:[e.jsxs("div",{className:"grid grid-cols-2 gap-4 h-1/2",children:[e.jsx(w,{items:x.slice(0,5),timer:8e3,fadeDuration:300,renderItem:k,label:"Event",seoPrefix:"/events/",label_color:"bg-red-500"}),e.jsx(w,{items:o.slice(0,5),timer:9e3,fadeDuration:300,renderItem:T,label:"Project",seoPrefix:"/projects/",label_color:"bg-orange-500"})]}),e.jsx("div",{className:"h-1/2",children:e.jsx(w,{items:u.slice(0,5),timer:1e4,fadeDuration:300,renderItem:U,label:"Grant",seoPrefix:"/grants/",label_color:"bg-green-700"})})]}),e.jsx("div",{className:"md:col-span-3 h-full",children:e.jsx(X,{events:x})})]})]}),!N&&e.jsx("div",{className:"grid grid-cols-1 gap-4",children:e.jsx(B,{})})]})},V=({totalUsers:c,topViewedAcademicians:l,analyticsData:a})=>{const x=!!a,o=({academicians:n})=>e.jsxs("div",{className:"bg-white shadow rounded-lg p-4 mb-4",children:[e.jsxs("div",{className:"flex justify-between items-center mb-3",children:[e.jsx("h2",{className:"text-base font-semibold",children:"Top Viewed Academicians"}),e.jsx(F,{className:"text-indigo-500"})]}),e.jsx("div",{className:"space-y-2 max-h-[200px] overflow-y-auto",children:n&&n.length>0?n.slice(0,5).map((s,i)=>e.jsxs("div",{className:"flex items-center justify-between border-b pb-2",children:[e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-2",children:e.jsx("span",{className:"text-indigo-500 font-bold text-xs",children:i+1})}),e.jsx("div",{className:"w-6 h-6 rounded-full bg-cover bg-center mr-2",style:{backgroundImage:`url(${encodeURI(s.profile_picture?`/storage/${s.profile_picture}`:"/storage/profile_pictures/default.jpg")})`}}),e.jsxs("div",{children:[e.jsx("p",{className:"font-medium text-xs truncate max-w-[120px]",title:s.full_name||"Unknown",children:s.full_name||"Unknown"}),e.jsx("p",{className:"text-xs text-gray-500 truncate max-w-[120px]",title:s.current_position||"No position",children:s.current_position||"No position"})]})]}),e.jsxs("div",{className:"flex items-center",children:[e.jsx(p,{className:"w-3 h-3 text-indigo-500 mr-1"}),e.jsx("span",{className:"text-xs font-medium",children:s.total_views})]})]},s.id)):e.jsx("p",{className:"text-xs text-gray-500",children:"No view data available"})})]}),u=({pageViewsData:n})=>{const s=n&&n.length>0?Math.max(...n.map(i=>i.views)):100;return e.jsxs("div",{className:"bg-white shadow rounded-lg p-4 mb-4",children:[e.jsxs("div",{className:"flex justify-between items-center mb-3",children:[e.jsx("h2",{className:"text-base font-semibold",children:"Page Views (30 Days)"}),e.jsx(z,{className:"text-indigo-500"})]}),n&&n.length>0?e.jsx("div",{className:"h-[150px] flex items-end space-x-[1px]",children:n.slice(-15).map((i,t)=>{const h=t%3===0,g=i.views/s*100+"%";return e.jsxs("div",{className:"flex flex-col items-center flex-1",children:[e.jsx("div",{className:"w-full bg-indigo-100 hover:bg-indigo-200 transition-all rounded-t",style:{height:g},title:`${i.date}: ${i.views} views`}),h&&e.jsxs("div",{className:"text-[8px] text-gray-500 mt-1 rotate-45 origin-left whitespace-nowrap",children:[i.date.substring(5)," "]})]},t)})}):e.jsx("div",{className:"flex items-center justify-center h-[150px] bg-gray-50 rounded-lg",children:e.jsx("p",{className:"text-xs text-gray-500",children:"No page view data available"})})]})},j=()=>a?e.jsxs("div",{className:"grid grid-cols-2 gap-3 mb-4",children:[e.jsxs("div",{className:"bg-white shadow rounded-lg p-3 flex justify-between items-center",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-xs font-semibold text-gray-500",children:"ACTIVE USERS"}),e.jsx("p",{className:"text-xl font-bold",children:a.activeUsers||0})]}),e.jsx("div",{className:"bg-blue-100 p-2 rounded-full",children:e.jsx(L,{className:"text-blue-500 text-sm"})})]}),e.jsxs("div",{className:"bg-white shadow rounded-lg p-3 flex justify-between items-center",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-xs font-semibold text-gray-500",children:"AVG. SESSION"}),e.jsxs("p",{className:"text-xl font-bold",children:[a.avgSessionDuration||0,"s"]})]}),e.jsx("div",{className:"bg-green-100 p-2 rounded-full",children:e.jsx(G,{className:"text-green-500 text-sm"})})]}),e.jsxs("div",{className:"bg-white shadow rounded-lg p-3 flex justify-between items-center",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-xs font-semibold text-gray-500",children:"USERS"}),e.jsx("p",{className:"text-xl font-bold",children:c})]}),e.jsx("div",{className:"bg-purple-100 p-2 rounded-full",children:e.jsx(C,{className:"text-purple-500 text-sm"})})]}),e.jsxs("div",{className:"bg-white shadow rounded-lg p-3 flex justify-between items-center",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-xs font-semibold text-gray-500",children:"TOP VIEWS"}),e.jsx("p",{className:"text-xl font-bold",children:l&&l.length>0?l[0].total_views:0})]}),e.jsx("div",{className:"bg-yellow-100 p-2 rounded-full",children:e.jsx(p,{className:"text-yellow-500 text-sm"})})]})]}):e.jsx("div",{className:"bg-red-50 text-red-500 p-3 rounded-lg text-xs mb-4",children:e.jsx("p",{children:"Unable to load analytics data. Check configuration."})}),b=({pages:n})=>e.jsxs("div",{className:"bg-white shadow rounded-lg p-4 mb-4",children:[e.jsxs("div",{className:"flex justify-between items-center mb-3",children:[e.jsx("h2",{className:"text-base font-semibold",children:"Top Pages"}),e.jsx(R,{className:"text-indigo-500"})]}),n&&n.length>0?e.jsx("div",{className:"space-y-2",children:n.slice(0,3).map((s,i)=>e.jsxs("div",{className:"border-b pb-2",children:[e.jsxs("div",{className:"flex items-center mb-1",children:[e.jsx("div",{className:"flex-shrink-0 w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center mr-2",children:e.jsx("span",{className:"text-indigo-500 font-bold text-xs",children:i+1})}),e.jsx("p",{className:"font-medium text-xs truncate max-w-[250px]",title:s.title,children:s.title||"Untitled Page"})]}),e.jsxs("div",{className:"flex justify-between text-xs pl-7",children:[e.jsx("span",{className:"text-gray-500 truncate max-w-[200px]",children:s.path}),e.jsxs("div",{className:"flex items-center",children:[e.jsx(p,{className:"w-2.5 h-2.5 text-indigo-500 mr-1"}),e.jsx("span",{className:"font-medium",children:s.views})]})]})]},i))}):e.jsx("div",{className:"flex items-center justify-center h-[100px] bg-gray-50 rounded-lg",children:e.jsx("p",{className:"text-xs text-gray-500",children:"No page view data available"})})]});return e.jsxs("div",{className:"mb-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-3",children:[e.jsx("h1",{className:"text-xl font-bold",children:"Admin Dashboard"}),e.jsx("div",{className:"text-xs text-gray-500",children:x?e.jsx("span",{className:"text-green-500",children:"✓ GA connected"}):e.jsx("span",{className:"text-yellow-500",children:"⟳ Loading..."})})]}),j(),e.jsx(u,{pageViewsData:(a==null?void 0:a.pageViewsOverTime)||[]}),e.jsx(b,{pages:(a==null?void 0:a.topPages)||[]}),e.jsx(o,{academicians:l})]})},J=({posts:c,events:l,grants:a,users:x,profileIncompleteAlert:o,totalUsers:u,topViewedAcademicians:j,analyticsData:b})=>{const n=new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"}),[s,i]=f.useState(!1);f.useEffect(()=>{o!=null&&o.show&&i(!0)},[o]);const{isAdmin:t}=$(),h=d=>e.jsxs("div",{className:"block relative p-5 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end",style:{backgroundImage:`url(${encodeURI(d.featured_image?`/storage/${d.featured_image}`:"/storage/default.jpg")})`,backgroundSize:"cover",backgroundPosition:"center"},children:[e.jsx("div",{className:"absolute inset-0 bg-black opacity-40"}),e.jsxs("div",{className:"relative z-10 text-white pr-10",children:[e.jsx("h2",{className:"text-4xl font-bold truncate",title:d.title,children:d.title||"Untitled Post"}),d.content&&e.jsx("div",{className:"text-sm line-clamp-2 mb-2",dangerouslySetInnerHTML:{__html:d.content}}),e.jsxs("div",{className:"flex items-center mt-1 space-x-2",children:[e.jsx("p",{className:"text-xs",children:new Date(d.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsxs("div",{className:"flex items-center text-xs",children:[e.jsx(p,{className:"w-4 h-4"}),e.jsx("span",{className:"ml-1",children:d.total_views})]}),e.jsxs("div",{className:"flex items-center text-xs",children:[e.jsx(I,{className:"w-4 h-4 text-red-500"}),e.jsx("span",{className:"ml-1",children:d.total_likes})]}),e.jsxs("div",{className:"flex items-center text-xs",children:[e.jsx(M,{className:"w-4 h-4"}),e.jsx("span",{className:"ml-1",children:d.total_shares})]})]})]})]})]}),g=d=>e.jsxs("div",{className:"block relative p-3 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end",style:{backgroundImage:`url(${encodeURI(d.image?`/storage/${d.image}`:"/storage/default.jpg")})`,backgroundSize:"cover",backgroundPosition:"center"},children:[e.jsx("div",{className:"absolute inset-0 bg-black opacity-40"}),e.jsxs("div",{className:"relative z-10 text-white",children:[e.jsx("h3",{className:"text-lg font-bold truncate",title:d.event_name,children:d.event_name||"Untitled Event"}),e.jsx("p",{className:"text-xs",children:new Date(d.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})})]})]}),N=d=>e.jsxs("div",{className:"relative p-3 transform transition-opacity duration-500 rounded-2xl overflow-hidden h-full flex flex-col justify-end",style:{backgroundImage:`url(${encodeURI(d.image?`/storage/${d.image}`:"/storage/default.jpg")})`,backgroundSize:"cover",backgroundPosition:"center"},children:[e.jsx("div",{className:"absolute inset-0 bg-black opacity-40"}),e.jsxs("div",{className:"relative z-10 text-white",children:[e.jsx("h3",{className:"text-lg font-bold truncate",title:d.title,children:d.title||"Untitled Grant"}),e.jsx("p",{className:"text-xs",children:new Date(d.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})})]})]});return e.jsx("div",{className:"w-screen bg-gray-200 flex items-center justify-center",children:e.jsx("div",{className:"bg-white text-gray-800 shadow-lg overflow-hidden relative flex flex-col",style:{width:"500px",maxWidth:"100%"},children:e.jsxs("div",{className:"bg-white w-full px-5 pt-6 pb-4 overflow-y-auto",children:[e.jsx(D,{show:s&&(o==null?void 0:o.show),enter:"transition-all duration-300 ease-in-out",enterFrom:"opacity-0 -translate-y-4",enterTo:"opacity-100 translate-y-0",leave:"transition-all duration-200",leaveFrom:"opacity-100 translate-y-0",leaveTo:"opacity-0 -translate-y-4",children:e.jsxs("div",{className:"p-4 mb-4 text-sm text-yellow-800 bg-yellow-100 rounded-lg",role:"alert",children:[e.jsx("div",{className:"flex items-center mb-2",children:o==null?void 0:o.message}),e.jsxs(E,{href:route("role.edit"),className:"mt-2 inline-flex items-center px-4 py-2 bg-white text-yellow-800 border border-yellow-800 rounded-md hover:bg-yellow-50 transition-colors duration-200",children:["Update Now",e.jsx("span",{className:"ml-2 w-2 h-2 bg-red-500 rounded-full"})]})]})}),t&&e.jsx("div",{className:"mb-5",children:e.jsx(V,{totalUsers:u,topViewedAcademicians:j,analyticsData:b})}),!t&&e.jsxs("div",{className:"mb-3",children:[e.jsx("h1",{className:"text-3xl font-bold",children:"Today"}),e.jsx("p",{className:"text-sm text-gray-500 uppercase font-bold",children:n})]}),!t&&e.jsxs("div",{className:"mb-5",children:[e.jsx("div",{className:"mb-4 h-[280px]",children:e.jsx(w,{items:c.slice(0,5),timer:7e3,fadeDuration:300,renderItem:h,label:"Post",seoPrefix:"/posts/",label_color:"bg-blue-500"})}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsx("div",{className:"h-[160px]",children:e.jsx(w,{items:l.slice(0,5),timer:8e3,fadeDuration:300,renderItem:g,label:"Event",seoPrefix:"/events/",label_color:"bg-red-500"})}),e.jsx("div",{className:"h-[160px]",children:e.jsx(w,{items:a.slice(0,5),timer:9e3,fadeDuration:300,renderItem:N,label:"Grant",seoPrefix:"/grants/",label_color:"bg-green-700"})})]})]}),!t&&e.jsx("div",{className:"mb-4",children:e.jsx(B,{})})]})})})},Z=()=>{const[c,l]=f.useState(!1);return f.useEffect(()=>{const a=()=>{l(window.innerWidth>=1024)};return a(),window.addEventListener("resize",a),()=>window.removeEventListener("resize",a)},[]),c},ie=({totalUsers:c,onlineUsers:l,clicksByType:a,events:x,posts:o,projects:u,grants:j,academicians:b,universities:n,faculties:s,users:i,researchOptions:t,profileIncompleteAlert:h,topViewedAcademicians:g,analyticsData:N})=>{$();const d=Z();return e.jsx(O,{children:d?e.jsx(Q,{totalUsers:c,onlineUsers:l,clicksByType:a,events:x,posts:o,projects:u,grants:j,academicians:b,universities:n,faculties:s,users:i,researchOptions:t,profileIncompleteAlert:h,topViewedAcademicians:g,analyticsData:N}):e.jsx(J,{events:x,users:i,grants:j,profileIncompleteAlert:h,posts:o,totalUsers:c,topViewedAcademicians:g,analyticsData:N})})};export{ie as default};
