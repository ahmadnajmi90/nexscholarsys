import{r as u,q as H,j as e,b as o,Y as B}from"./app-CFe6YF8m.js";import{O as F,I as R,p as M,P as I,l as re,Q as T,M as W,R as q,S as Z,T as Y,U as X,V as J,W as le}from"./index-PS_vVtmW.js";import{u as K}from"./useRoles-NsC1w0jO.js";import{t as ne}from"./analytics-BQ374C1C.js";/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oe=s=>s.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),Q=(...s)=>s.filter((a,r,l)=>!!a&&a.trim()!==""&&l.indexOf(a)===r).join(" ").trim();/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var ie={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ce=u.forwardRef(({color:s="currentColor",size:a=24,strokeWidth:r=2,absoluteStrokeWidth:l,className:c="",children:t,iconNode:i,...n},m)=>u.createElement("svg",{ref:m,...ie,width:a,height:a,stroke:s,strokeWidth:l?Number(r)*24/Number(a):r,className:Q("lucide",c),...n},[...i.map(([x,d])=>u.createElement(x,d)),...Array.isArray(t)?t:[t]]));/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=(s,a)=>{const r=u.forwardRef(({className:l,...c},t)=>u.createElement(ce,{ref:t,iconNode:a,className:Q(`lucide-${oe(s)}`,l),...c}));return r.displayName=`${s}`,r};/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const de=[["path",{d:"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",key:"jecpp"}],["rect",{width:"20",height:"14",x:"2",y:"6",rx:"2",key:"i6l2r4"}]],me=A("Briefcase",de);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const he=[["path",{d:"M11 14h1v4",key:"fy54vd"}],["path",{d:"M16 2v4",key:"4m81vk"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M8 2v4",key:"1cmpym"}],["rect",{x:"3",y:"4",width:"18",height:"18",rx:"2",key:"12vinp"}]],xe=A("Calendar1",he);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ue=[["path",{d:"M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3",key:"12ixgl"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",key:"u0c8gj"}],["path",{d:"M7 16.5 8 22l-3-1-3 1 1-5.5",key:"5gm2nr"}]],pe=A("FileBadge",ue);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ge=[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"1d0kgt"}]],fe=A("House",ge);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ye=[["rect",{width:"7",height:"7",x:"3",y:"3",rx:"1",key:"1g98yp"}],["rect",{width:"7",height:"7",x:"14",y:"3",rx:"1",key:"6d4xhi"}],["rect",{width:"7",height:"7",x:"14",y:"14",rx:"1",key:"nxv5o0"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1",key:"1bb6yr"}]],O=A("LayoutGrid",ye);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const be=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]],je=A("User",be),ve=({isOpen:s,toggleSidebar:a})=>{const{isAdmin:r,isPostgraduate:l,isUndergraduate:c,isFacultyAdmin:t,isAcademician:i,canPostEvents:n,canPostProjects:m,canPostGrants:x,canCreateFacultyAdmin:d,canAssignAbilities:p}=K();H().props.auth.user;const[h,g]=u.useState({networking:!1,journal:!1,grant:!1,project:!1,event:!1,survey:!1,workspace:!1,profile:!1}),y=b=>{g(P=>({...P,[b]:!P[b]}))};return e.jsxs("div",{className:`bg-white h-full fixed z-10 transition-all duration-300 ${s?"w-64":"w-20"}`,children:[e.jsx("button",{onClick:a,className:"absolute top-4 right-[-14px] w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center",children:s?"<":">"}),e.jsxs("div",{className:"p-4 h-full overflow-auto",children:[e.jsx("div",{className:"flex items-center mb-6",children:e.jsx("a",{href:"/",className:"flex items-center space-x-2",children:e.jsx("h2",{className:`ml-2 text-lg text-blue-600 font-semibold ${!s&&"hidden"}`,children:"Nexscholar"})})}),e.jsxs("nav",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!s&&"hidden"}`,children:"Main"}),e.jsxs(o,{href:route("dashboard"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(F,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Dashboard"})]})]}),t&&e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!s&&"hidden"}`,children:"Faculty Admin"}),e.jsxs(o,{href:route("faculty-admin.academicians"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(R,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Verify Academicians"})]}),e.jsxs(o,{href:route("faculty-admin.directory"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(M,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Academicians Directory"})]})]}),r&&e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold mt-5",children:"Admin"}),e.jsxs("div",{className:`group relative ${s?"":"w-12"}`,children:[e.jsxs(o,{href:route("roles.index"),className:"flex items-center p-2 hover:bg-gray-100 rounded",children:[e.jsx(I,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Roles & Permissions"})]}),e.jsxs(o,{href:route("faculty-admins.index"),className:"flex items-center p-2 hover:bg-gray-100 rounded",children:[e.jsx(re,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Faculty Admin"})]}),e.jsxs(o,{href:route("admin.profiles.index"),className:"flex items-center p-2 hover:bg-gray-100 rounded",children:[e.jsx(M,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Profile Management"})]}),!s&&e.jsxs("div",{className:"hidden group-hover:block absolute left-full top-0 ml-2 bg-white shadow-md rounded p-2 whitespace-nowrap z-10",children:[e.jsx("div",{className:"py-1",children:"Roles & Permissions"}),e.jsx("div",{className:"py-1",children:"Faculty Admin"}),e.jsx("div",{className:"py-1",children:"Profile Management"})]})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!s&&"hidden"}`,children:"Features"}),e.jsxs(o,{href:route("ai.matching.index"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(T,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"AI Matching"})]}),e.jsxs(o,{href:route("bookmarks.index"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(W,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"My Bookmarks"})]}),e.jsxs(o,{href:route("project-hub.index"),className:`flex items-center py-2 px-4 hover:bg-gray-100 rounded ${route().current("project-hub.index")||route().current().startsWith("project-hub.")?"bg-blue-50 text-blue-600":""}`,children:[e.jsx(O,{className:"w-5 h-5 text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Project Hub"})]}),e.jsxs("button",{onClick:()=>y("networking"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(M,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Networking"}),s&&e.jsx("span",{className:"ml-auto",children:h.networking?"-":"+"})]}),h.networking&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(o,{href:"/postgraduates",className:"block py-2 hover:bg-gray-100 rounded",children:"Postgraduate"}),e.jsx(o,{href:"/undergraduates",className:"block py-2 hover:bg-gray-100 rounded",children:"Undergraduate"}),e.jsx(o,{href:"/academicians",className:"block py-2 hover:bg-gray-100 rounded",children:"Academician"}),e.jsx(o,{href:"/universities",className:"block py-2 hover:bg-gray-100 rounded",children:"University"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!s&&"hidden"}`,children:"Manage"}),e.jsxs("button",{onClick:()=>y("grant"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(q,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Grant"}),s&&e.jsx("span",{className:"ml-auto",children:h.grant?"-":"+"})]}),h.grant&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(o,{href:"/grants",className:"block py-2 hover:bg-gray-100 rounded",children:"View Grant"}),x&&e.jsx(o,{href:route("post-grants.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Grants"})]}),e.jsxs("button",{onClick:()=>y("project"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(Z,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Project"}),s&&e.jsx("span",{className:"ml-auto",children:h.project?"-":"+"})]}),h.project&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(o,{href:"/projects",className:"block py-2 hover:bg-gray-100 rounded",children:" View Project"}),m&&e.jsx(o,{href:route("post-projects.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Projects"})]}),e.jsxs("button",{onClick:()=>y("event"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(Y,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Event"}),s&&e.jsx("span",{className:"ml-auto",children:h.event?"-":"+"})]}),h.event&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(o,{href:"/events",className:"block py-2 hover:bg-gray-100 rounded",children:"View Event"}),n&&e.jsx(o,{href:route("post-events.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Event"})]}),e.jsxs("button",{onClick:()=>y("post"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(X,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Post"}),s&&e.jsx("span",{className:"ml-auto",children:h.post?"-":"+"})]}),h.post&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(o,{href:"/posts",className:"block py-2 hover:bg-gray-100 rounded",children:"View Post"}),e.jsx(o,{href:route("create-posts.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Post"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!s&&"hidden"}`,children:"Setting"}),e.jsxs("div",{children:[e.jsxs("button",{onClick:()=>y("profile"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(J,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Profile"}),s&&e.jsx("span",{className:"ml-auto",children:h.profile?"-":"+"})]}),h.profile&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(o,{href:route("profile.edit"),className:"block py-2 hover:bg-gray-100 rounded",children:"General Account Setting"}),e.jsx(o,{href:route("role.edit"),className:"block py-2 hover:bg-gray-100 rounded",children:"Personal Information"})]})]}),e.jsxs(o,{href:route("logout"),method:"post",as:"button",className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(I,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Log Out"})]})]})]})]})]})},Ne=()=>{const{isAdmin:s,isPostgraduate:a,isUndergraduate:r,isFacultyAdmin:l,isAcademician:c,canPostEvents:t,canPostProjects:i,canPostGrants:n,canCreateFacultyAdmin:m,canAssignAbilities:x}=K(),[d,p]=u.useState(!1),[h,g]=u.useState({networking:!1,grant:!1,project:!1,event:!1,survey:!1,profile:!1,admin:!1}),y=()=>{p(!d)},b=P=>{g(V=>({...V,[P]:!V[P]}))};return e.jsxs(e.Fragment,{children:[e.jsx("button",{className:"fixed top-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-md shadow-md lg:hidden",onClick:y,children:d?"✕":"☰"}),e.jsx("div",{className:`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-40 transform transition-transform duration-300 ${d?"translate-x-0":"-translate-x-full"} lg:translate-x-0`,children:e.jsxs("div",{className:"p-4 h-full overflow-auto",children:[e.jsx("div",{className:"flex items-center mb-6",children:e.jsx("a",{href:"/",className:"flex items-center space-x-2",children:e.jsx("h2",{className:"text-lg text-blue-600 font-semibold",children:"NexScholar"})})}),e.jsxs("nav",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Main"}),e.jsxs(o,{href:route("dashboard"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(F,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Dashboard"})]})]}),l&&e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Faculty Admin"}),e.jsxs(o,{href:route("faculty-admin.academicians"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(R,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Verify Academicians"})]}),e.jsxs(o,{href:route("faculty-admin.directory"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(M,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Academicians Directory"})]})]}),s&&e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Admin Features"}),e.jsxs(o,{href:route("faculty-admins.index"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(F,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Create Faculty Admin"})]}),e.jsxs(o,{href:route("roles.index"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(F,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Assign Abilities"})]})]}),s&&e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Admin"}),e.jsxs("button",{onClick:()=>b("admin"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(I,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Admin Tools"}),e.jsx("span",{className:"ml-auto",children:h.admin?"-":"+"})]}),h.admin&&e.jsxs("div",{className:"ml-6",children:[e.jsx(o,{href:route("roles.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Roles & Permissions"}),e.jsx(o,{href:route("faculty-admins.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Faculty Admin"}),e.jsx(o,{href:route("admin.profiles.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Profile Management"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Features"}),e.jsxs(o,{href:route("ai.matching.index"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(T,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"AI Matching"})]}),e.jsxs(o,{href:route("bookmarks.index"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(W,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"My Bookmarks"})]}),e.jsxs(o,{href:route("project-hub.index"),className:`flex items-center py-2 px-4 hover:bg-gray-100 rounded ${route().current("project-hub.index")||route().current().startsWith("project-hub.")?"bg-blue-50 text-blue-600":""}`,children:[e.jsx(O,{className:"w-5 h-5 text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Project Hub"})]}),e.jsxs("button",{onClick:()=>b("networking"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(M,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Networking"}),e.jsx("span",{className:"ml-auto",children:h.networking?"-":"+"})]}),h.networking&&e.jsxs("div",{className:"ml-6",children:[e.jsx(o,{href:"/postgraduates",className:"block py-2 hover:bg-gray-100 rounded",children:"Postgraduate"}),e.jsx(o,{href:"/undergraduates",className:"block py-2 hover:bg-gray-100 rounded",children:"Undergraduate"}),e.jsx(o,{href:"/academicians",className:"block py-2 hover:bg-gray-100 rounded",children:"Academician"}),e.jsx(o,{href:"/universities",className:"block py-2 hover:bg-gray-100 rounded",children:"University"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Manage"}),e.jsxs("button",{onClick:()=>b("grant"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(q,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Grant"}),e.jsx("span",{className:"ml-auto",children:h.grant?"-":"+"})]}),h.grant&&e.jsxs("div",{className:"ml-6",children:[e.jsx(o,{href:"/grants",className:"block py-2 hover:bg-gray-100 rounded",children:"View Grant"}),n&&e.jsx(o,{href:route("post-grants.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Grants"})]}),e.jsxs("button",{onClick:()=>b("project"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(Z,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Project"}),e.jsx("span",{className:"ml-auto",children:h.project?"-":"+"})]}),h.project&&e.jsxs("div",{className:"ml-6",children:[e.jsx(o,{href:"/projects",className:"block py-2 hover:bg-gray-100 rounded",children:"View project"}),i&&e.jsx(o,{href:route("post-projects.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage project"})]}),e.jsxs("button",{onClick:()=>b("event"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(Y,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Event"}),e.jsx("span",{className:"ml-auto",children:h.event?"-":"+"})]}),h.event&&e.jsxs("div",{className:"ml-6",children:[e.jsx(o,{href:"/events",className:"block py-2 hover:bg-gray-100 rounded",children:"View event"}),t&&e.jsx(o,{href:route("post-events.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage event"})]}),e.jsxs("button",{onClick:()=>b("post"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(X,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Post"}),e.jsx("span",{className:"ml-auto",children:h.post?"-":"+"})]}),h.post&&e.jsxs("div",{className:"ml-6",children:[e.jsx(o,{href:"/posts",className:"block py-2 hover:bg-gray-100 rounded",children:"View post"}),e.jsx(o,{href:route("create-posts.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage post"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Survey"}),e.jsxs("button",{onClick:()=>b("survey"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(le,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Survey"}),e.jsx("span",{className:"ml-auto",children:h.survey?"-":"+"})]}),h.survey&&e.jsx("div",{className:"ml-6",children:e.jsx("a",{href:"https://docs.google.com/forms/d/e/1FAIpQLSdPX9CXPOAZLedNsqA9iyMs5ZkAOACol4_wBVN2LPdxbnsJeg/viewform",className:"block py-2 hover:bg-gray-100 rounded",target:"_blank",rel:"noopener noreferrer",children:"Free Survey"})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Settings"}),e.jsxs("button",{onClick:()=>b("profile"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(J,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Profile"}),e.jsx("span",{className:"ml-auto",children:h.profile?"-":"+"})]}),h.profile&&e.jsxs("div",{className:"ml-6",children:[e.jsx(o,{href:route("profile.edit"),className:"block py-2 hover:bg-gray-100 rounded",children:"General Account Setting"}),e.jsx(o,{href:route("role.edit"),className:"block py-2 hover:bg-gray-100 rounded",children:"Personal Information"})]})]}),e.jsxs(o,{href:route("logout"),method:"post",as:"button",className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(I,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Log Out"})]})]})]})}),d&&e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden",onClick:y})]})},we=({profilePicture:s})=>e.jsx("nav",{className:"border-b border-gray-200 px-4 py-3 shadow-sm",children:e.jsxs("div",{className:"flex items-center justify-between mx-auto",children:[e.jsxs("div",{className:"flex items-center space-x-6",children:[e.jsx(o,{href:route("profile.edit"),className:"text-gray-700 hover:text-blue-600 font-medium",children:"My Account"}),e.jsx(o,{href:route("role.edit"),className:"text-gray-700 hover:text-blue-600 font-medium",children:"Profile"})]}),e.jsx("div",{className:"flex items-center space-x-4"})]})});let ke={data:""},$e=s=>typeof window=="object"?((s?s.querySelector("#_goober"):window._goober)||Object.assign((s||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:s||ke,Ae=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,Pe=/\/\*[^]*?\*\/|  +/g,G=/\n+/g,N=(s,a)=>{let r="",l="",c="";for(let t in s){let i=s[t];t[0]=="@"?t[1]=="i"?r=t+" "+i+";":l+=t[1]=="f"?N(i,t):t+"{"+N(i,t[1]=="k"?"":a)+"}":typeof i=="object"?l+=N(i,a?a.replace(/([^,])+/g,n=>t.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,m=>/&/.test(m)?m.replace(/&/g,n):n?n+" "+m:m)):t):i!=null&&(t=/^--/.test(t)?t:t.replace(/[A-Z]/g,"-$&").toLowerCase(),c+=N.p?N.p(t,i):t+":"+i+";")}return r+(a&&c?a+"{"+c+"}":c)+l},j={},ee=s=>{if(typeof s=="object"){let a="";for(let r in s)a+=r+ee(s[r]);return a}return s},Me=(s,a,r,l,c)=>{let t=ee(s),i=j[t]||(j[t]=(m=>{let x=0,d=11;for(;x<m.length;)d=101*d+m.charCodeAt(x++)>>>0;return"go"+d})(t));if(!j[i]){let m=t!==s?s:(x=>{let d,p,h=[{}];for(;d=Ae.exec(x.replace(Pe,""));)d[4]?h.shift():d[3]?(p=d[3].replace(G," ").trim(),h.unshift(h[0][p]=h[0][p]||{})):h[0][d[1]]=d[2].replace(G," ").trim();return h[0]})(s);j[i]=N(c?{["@keyframes "+i]:m}:m,r?"":"."+i)}let n=r&&j.g?j.g:null;return r&&(j.g=j[i]),((m,x,d,p)=>{p?x.data=x.data.replace(p,m):x.data.indexOf(m)===-1&&(x.data=d?m+x.data:x.data+m)})(j[i],a,l,n),i},Ce=(s,a,r)=>s.reduce((l,c,t)=>{let i=a[t];if(i&&i.call){let n=i(r),m=n&&n.props&&n.props.className||/^go/.test(n)&&n;i=m?"."+m:n&&typeof n=="object"?n.props?"":N(n,""):n===!1?"":n}return l+c+(i??"")},"");function _(s){let a=this||{},r=s.call?s(a.p):s;return Me(r.unshift?r.raw?Ce(r,[].slice.call(arguments,1),a.p):r.reduce((l,c)=>Object.assign(l,c&&c.call?c(a.p):c),{}):r,$e(a.target),a.g,a.o,a.k)}let se,U,z;_.bind({g:1});let v=_.bind({k:1});function Ee(s,a,r,l){N.p=a,se=s,U=r,z=l}function w(s,a){let r=this||{};return function(){let l=arguments;function c(t,i){let n=Object.assign({},t),m=n.className||c.className;r.p=Object.assign({theme:U&&U()},n),r.o=/ *go\d+/.test(m),n.className=_.apply(r,l)+(m?" "+m:"");let x=s;return s[0]&&(x=n.as||s,delete n.as),z&&x[0]&&z(n),se(x,n)}return c}}var Se=s=>typeof s=="function",L=(s,a)=>Se(s)?s(a):s,Fe=(()=>{let s=0;return()=>(++s).toString()})(),ae=(()=>{let s;return()=>{if(s===void 0&&typeof window<"u"){let a=matchMedia("(prefers-reduced-motion: reduce)");s=!a||a.matches}return s}})(),De=20,te=(s,a)=>{switch(a.type){case 0:return{...s,toasts:[a.toast,...s.toasts].slice(0,De)};case 1:return{...s,toasts:s.toasts.map(t=>t.id===a.toast.id?{...t,...a.toast}:t)};case 2:let{toast:r}=a;return te(s,{type:s.toasts.find(t=>t.id===r.id)?1:0,toast:r});case 3:let{toastId:l}=a;return{...s,toasts:s.toasts.map(t=>t.id===l||l===void 0?{...t,dismissed:!0,visible:!1}:t)};case 4:return a.toastId===void 0?{...s,toasts:[]}:{...s,toasts:s.toasts.filter(t=>t.id!==a.toastId)};case 5:return{...s,pausedAt:a.time};case 6:let c=a.time-(s.pausedAt||0);return{...s,pausedAt:void 0,toasts:s.toasts.map(t=>({...t,pauseDuration:t.pauseDuration+c}))}}},D=[],k={toasts:[],pausedAt:void 0},$=s=>{k=te(k,s),D.forEach(a=>{a(k)})},Ie={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},Le=(s={})=>{let[a,r]=u.useState(k),l=u.useRef(k);u.useEffect(()=>(l.current!==k&&r(k),D.push(r),()=>{let t=D.indexOf(r);t>-1&&D.splice(t,1)}),[]);let c=a.toasts.map(t=>{var i,n,m;return{...s,...s[t.type],...t,removeDelay:t.removeDelay||((i=s[t.type])==null?void 0:i.removeDelay)||(s==null?void 0:s.removeDelay),duration:t.duration||((n=s[t.type])==null?void 0:n.duration)||(s==null?void 0:s.duration)||Ie[t.type],style:{...s.style,...(m=s[t.type])==null?void 0:m.style,...t.style}}});return{...a,toasts:c}},_e=(s,a="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:a,ariaProps:{role:"status","aria-live":"polite"},message:s,pauseDuration:0,...r,id:(r==null?void 0:r.id)||Fe()}),E=s=>(a,r)=>{let l=_e(a,s,r);return $({type:2,toast:l}),l.id},f=(s,a)=>E("blank")(s,a);f.error=E("error");f.success=E("success");f.loading=E("loading");f.custom=E("custom");f.dismiss=s=>{$({type:3,toastId:s})};f.remove=s=>$({type:4,toastId:s});f.promise=(s,a,r)=>{let l=f.loading(a.loading,{...r,...r==null?void 0:r.loading});return typeof s=="function"&&(s=s()),s.then(c=>{let t=a.success?L(a.success,c):void 0;return t?f.success(t,{id:l,...r,...r==null?void 0:r.success}):f.dismiss(l),c}).catch(c=>{let t=a.error?L(a.error,c):void 0;t?f.error(t,{id:l,...r,...r==null?void 0:r.error}):f.dismiss(l)}),s};var Ue=(s,a)=>{$({type:1,toast:{id:s,height:a}})},ze=()=>{$({type:5,time:Date.now()})},C=new Map,Ve=1e3,Be=(s,a=Ve)=>{if(C.has(s))return;let r=setTimeout(()=>{C.delete(s),$({type:4,toastId:s})},a);C.set(s,r)},Ge=s=>{let{toasts:a,pausedAt:r}=Le(s);u.useEffect(()=>{if(r)return;let t=Date.now(),i=a.map(n=>{if(n.duration===1/0)return;let m=(n.duration||0)+n.pauseDuration-(t-n.createdAt);if(m<0){n.visible&&f.dismiss(n.id);return}return setTimeout(()=>f.dismiss(n.id),m)});return()=>{i.forEach(n=>n&&clearTimeout(n))}},[a,r]);let l=u.useCallback(()=>{r&&$({type:6,time:Date.now()})},[r]),c=u.useCallback((t,i)=>{let{reverseOrder:n=!1,gutter:m=8,defaultPosition:x}=i||{},d=a.filter(g=>(g.position||x)===(t.position||x)&&g.height),p=d.findIndex(g=>g.id===t.id),h=d.filter((g,y)=>y<p&&g.visible).length;return d.filter(g=>g.visible).slice(...n?[h+1]:[0,h]).reduce((g,y)=>g+(y.height||0)+m,0)},[a]);return u.useEffect(()=>{a.forEach(t=>{if(t.dismissed)Be(t.id,t.removeDelay);else{let i=C.get(t.id);i&&(clearTimeout(i),C.delete(t.id))}})},[a]),{toasts:a,handlers:{updateHeight:Ue,startPause:ze,endPause:l,calculateOffset:c}}},He=v`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,Re=v`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Te=v`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,We=w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${s=>s.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${He} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${Re} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${s=>s.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${Te} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,qe=v`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,Ze=w("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${s=>s.secondary||"#e0e0e0"};
  border-right-color: ${s=>s.primary||"#616161"};
  animation: ${qe} 1s linear infinite;
`,Ye=v`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Xe=v`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,Je=w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${s=>s.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Ye} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Xe} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${s=>s.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Ke=w("div")`
  position: absolute;
`,Qe=w("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Oe=v`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,es=w("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Oe} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,ss=({toast:s})=>{let{icon:a,type:r,iconTheme:l}=s;return a!==void 0?typeof a=="string"?u.createElement(es,null,a):a:r==="blank"?null:u.createElement(Qe,null,u.createElement(Ze,{...l}),r!=="loading"&&u.createElement(Ke,null,r==="error"?u.createElement(We,{...l}):u.createElement(Je,{...l})))},as=s=>`
0% {transform: translate3d(0,${s*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,ts=s=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${s*-150}%,-1px) scale(.6); opacity:0;}
`,rs="0%{opacity:0;} 100%{opacity:1;}",ls="0%{opacity:1;} 100%{opacity:0;}",ns=w("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,os=w("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,is=(s,a)=>{let r=s.includes("top")?1:-1,[l,c]=ae()?[rs,ls]:[as(r),ts(r)];return{animation:a?`${v(l)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${v(c)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},cs=u.memo(({toast:s,position:a,style:r,children:l})=>{let c=s.height?is(s.position||a||"top-center",s.visible):{opacity:0},t=u.createElement(ss,{toast:s}),i=u.createElement(os,{...s.ariaProps},L(s.message,s));return u.createElement(ns,{className:s.className,style:{...c,...r,...s.style}},typeof l=="function"?l({icon:t,message:i}):u.createElement(u.Fragment,null,t,i))});Ee(u.createElement);var ds=({id:s,className:a,style:r,onHeightUpdate:l,children:c})=>{let t=u.useCallback(i=>{if(i){let n=()=>{let m=i.getBoundingClientRect().height;l(s,m)};n(),new MutationObserver(n).observe(i,{subtree:!0,childList:!0,characterData:!0})}},[s,l]);return u.createElement("div",{ref:t,className:a,style:r},c)},ms=(s,a)=>{let r=s.includes("top"),l=r?{top:0}:{bottom:0},c=s.includes("center")?{justifyContent:"center"}:s.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:ae()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${a*(r?1:-1)}px)`,...l,...c}},hs=_`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,S=16,xs=({reverseOrder:s,position:a="top-center",toastOptions:r,gutter:l,children:c,containerStyle:t,containerClassName:i})=>{let{toasts:n,handlers:m}=Ge(r);return u.createElement("div",{id:"_rht_toaster",style:{position:"fixed",zIndex:9999,top:S,left:S,right:S,bottom:S,pointerEvents:"none",...t},className:i,onMouseEnter:m.startPause,onMouseLeave:m.endPause},n.map(x=>{let d=x.position||a,p=m.calculateOffset(x,{reverseOrder:s,gutter:l,defaultPosition:a}),h=ms(d,p);return u.createElement(ds,{id:x.id,key:x.id,onHeightUpdate:m.updateHeight,className:x.visible?hs:"",style:h},x.type==="custom"?L(x.message,x):c?c(x):u.createElement(cs,{toast:x,position:d}))}))},ys=f;const bs=({children:s,title:a,TopMenuOpen:r})=>{const[l,c]=u.useState(!1),[t,i]=u.useState(!1),{url:n}=H(),m=()=>{const d=!l;c(d),localStorage.setItem("isSidebarOpen",d)};u.useEffect(()=>{setTimeout(()=>{let d=a;if(d===void 0&&(d=document.title,d==="Nexscholar"||d.endsWith("- Nexscholar"))){const p=n.split("/").filter(Boolean);p.length>0&&(d=p[p.length-1].split("-").map(g=>g.charAt(0).toUpperCase()+g.slice(1)).join(" "))}console.log(`MainLayout tracking: ${d||"Unknown"} at ${n}`),ne(n,d)},250)},[n,a]),u.useEffect(()=>{const d=()=>{i(window.innerWidth>=1024),window.innerWidth>=1024?c(!0):c(!1)};return d(),window.addEventListener("resize",d),()=>window.removeEventListener("resize",d)},[]),u.useEffect(()=>{const d=localStorage.getItem("isSidebarOpen");d!==null&&c(d==="true")},[]);const x=d=>n.startsWith(d);return e.jsxs("div",{className:"flex min-h-screen bg-gray-100",children:[e.jsx(xs,{position:"top-right",toastOptions:{duration:3e3,style:{background:"#363636",color:"#fff"},success:{duration:3e3,style:{background:"#22c55e",color:"#fff"}},error:{duration:4e3,style:{background:"#ef4444",color:"#fff"}}}}),t&&e.jsx(ve,{isOpen:l,toggleSidebar:m}),!t&&e.jsx(Ne,{isOpen:l,toggleSidebar:m}),t?e.jsxs("div",{className:`flex-1 p-6 transition-all duration-300 ${l?"ml-64":"ml-20"}`,children:[r&&e.jsx(we,{}),e.jsx(B,{title:a}),e.jsxs("div",{className:"p-4 bg-white rounded-lg shadow",children:[e.jsx("h1",{className:"text-2xl font-semibold mb-4 pt-2 pl-2",children:a}),s]})]}):e.jsxs("div",{children:[e.jsx(B,{title:a}),e.jsx("div",{className:"pb-20",children:s}),e.jsx("div",{className:"fixed bottom-0 w-full bg-white border-t border-gray-200 rounded-t-3xl shadow-lg",children:e.jsxs("div",{className:"flex justify-around items-center relative py-3",children:[e.jsxs(o,{href:"/events",className:`flex flex-col items-center ${x("/event")?"text-blue-500":"text-gray-500"}`,children:[e.jsx(xe,{className:"w-6 h-6 stroke-current"}),e.jsx("span",{className:"text-xs font-medium",children:"Event"})]}),e.jsxs(o,{href:"/projects",className:`flex flex-col items-center ${x("/project")?"text-blue-500":"text-gray-500"}`,children:[e.jsx(me,{className:"w-6 h-6 stroke-current"}),e.jsx("span",{className:"text-xs font-medium",children:"Project"})]}),e.jsx("div",{className:"absolute -top-6 w-14 h-14 flex items-center justify-center bg-blue-500 rounded-full shadow-lg border-4 border-white",children:e.jsx(o,{href:"/dashboard",children:e.jsx(fe,{className:"w-7 h-7 stroke-white stroke-[1.5]"})})}),e.jsxs(o,{href:"/grants",className:`flex flex-col items-center ${x("/grant")?"text-blue-500":"text-gray-500"}`,children:[e.jsx(pe,{className:"w-6 h-6 stroke-current"}),e.jsx("span",{className:"text-xs font-medium",children:"Grant"})]}),e.jsxs(o,{href:"/role",className:`flex flex-col items-center ${x("/role")?"text-blue-500":"text-gray-500"}`,children:[e.jsx(je,{className:"w-6 h-6 stroke-current"}),e.jsx("span",{className:"text-xs font-medium",children:"Profile"})]})]})})]})]})};export{O as L,bs as M,je as U,ys as V,A as c};
