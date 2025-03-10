import{q as w,r as o,j as e,a as s,Y as k}from"./app-OyJITDQ0.js";import{c as u,d as $,e as A,f as M,g as C,h as P,i as S,j as F,k as G}from"./index-BDflseub.js";import{u as E}from"./useRoles-CSvMmOe-.js";const U=({isOpen:a,toggleSidebar:l})=>{const{isAdmin:d,isPostgraduate:n,isUndergraduate:i,isFacultyAdmin:c,isAcademician:p,canPostEvents:g,canPostProjects:j,canPostGrants:h,canCreateFacultyAdmin:t,canAssignAbilities:b}=E();w().props.auth.user;const[r,N]=o.useState({networking:!1,journal:!1,grant:!1,project:!1,event:!1,survey:!1,workspace:!1,profile:!1}),m=x=>{N(f=>({...f,[x]:!f[x]}))};return e.jsxs("div",{className:`bg-white h-full fixed z-10 transition-all duration-300 ${a?"w-64":"w-20"}`,children:[e.jsx("button",{onClick:l,className:"absolute top-4 right-[-14px] w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center",children:a?"<":">"}),e.jsxs("div",{className:"p-4 h-full overflow-auto",children:[e.jsx("div",{className:"flex items-center mb-6",children:e.jsx("a",{href:"/",className:"flex items-center space-x-2",children:e.jsx("h2",{className:`ml-2 text-lg text-blue-600 font-semibold ${!a&&"hidden"}`,children:"Nexscholar"})})}),e.jsxs("nav",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!a&&"hidden"}`,children:"Main"}),e.jsxs(s,{href:route("dashboard"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(u,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!a&&"hidden"}`,children:"Dashboard"})]}),c&&e.jsxs(s,{href:route("faculty-admin.academicians"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(u,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!a&&"hidden"}`,children:"Verify Academicians"})]})]}),d&&e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!a&&"hidden"}`,children:"Admin Features"}),e.jsxs(s,{href:route("faculty-admins.index"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(u,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!a&&"hidden"}`,children:"Create Faculty Admin"})]}),e.jsxs(s,{href:route("roles.index"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(u,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!a&&"hidden"}`,children:"Assign Abilities"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!a&&"hidden"}`,children:"Networking"}),e.jsxs("button",{onClick:()=>m("networking"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx($,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!a&&"hidden"}`,children:"Networking"}),a&&e.jsx("span",{className:"ml-auto",children:r.networking?"-":"+"})]}),r.networking&&e.jsxs("div",{className:`${!a&&"hidden"} ml-6`,children:[e.jsx(s,{href:"/postgraduates",className:"block py-2 hover:bg-gray-100 rounded",children:"Postgraduate"}),e.jsx(s,{href:"/undergraduates",className:"block py-2 hover:bg-gray-100 rounded",children:"Undergraduate"}),e.jsx(s,{href:"/academicians",className:"block py-2 hover:bg-gray-100 rounded",children:"Academician"}),e.jsx(s,{href:"/universities",className:"block py-2 hover:bg-gray-100 rounded",children:"University"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!a&&"hidden"}`,children:"Features"}),e.jsxs("button",{onClick:()=>m("grant"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(A,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!a&&"hidden"}`,children:"Grant"}),a&&e.jsx("span",{className:"ml-auto",children:r.grant?"-":"+"})]}),r.grant&&e.jsxs("div",{className:`${!a&&"hidden"} ml-6`,children:[e.jsx(s,{href:"/grants",className:"block py-2 hover:bg-gray-100 rounded",children:"View Grant"}),h&&e.jsx(s,{href:route("post-grants.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Grants"})]}),e.jsxs("button",{onClick:()=>m("project"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(M,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!a&&"hidden"}`,children:"Project"}),a&&e.jsx("span",{className:"ml-auto",children:r.project?"-":"+"})]}),r.project&&e.jsxs("div",{className:`${!a&&"hidden"} ml-6`,children:[e.jsx(s,{href:"/projects",className:"block py-2 hover:bg-gray-100 rounded",children:" View Project"}),j&&e.jsx(s,{href:route("post-projects.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Projects"})]}),e.jsxs("button",{onClick:()=>m("event"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(C,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!a&&"hidden"}`,children:"Event"}),a&&e.jsx("span",{className:"ml-auto",children:r.event?"-":"+"})]}),r.event&&e.jsxs("div",{className:`${!a&&"hidden"} ml-6`,children:[e.jsx(s,{href:"/events",className:"block py-2 hover:bg-gray-100 rounded",children:"View Event"}),g&&e.jsx(s,{href:route("post-events.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Event"})]}),e.jsxs("button",{onClick:()=>m("post"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(P,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!a&&"hidden"}`,children:"Post"}),a&&e.jsx("span",{className:"ml-auto",children:r.post?"-":"+"})]}),r.post&&e.jsxs("div",{className:`${!a&&"hidden"} ml-6`,children:[e.jsx(s,{href:"/posts",className:"block py-2 hover:bg-gray-100 rounded",children:"View Post"}),e.jsx(s,{href:route("create-posts.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Post"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!a&&"hidden"}`,children:"Setting"}),e.jsxs("div",{children:[e.jsxs("button",{onClick:()=>m("profile"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(S,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!a&&"hidden"}`,children:"Profile"}),a&&e.jsx("span",{className:"ml-auto",children:r.profile?"-":"+"})]}),r.profile&&e.jsxs("div",{className:`${!a&&"hidden"} ml-6`,children:[e.jsx(s,{href:route("profile.edit"),className:"block py-2 hover:bg-gray-100 rounded",children:"My Account"}),e.jsx(s,{href:route("role.edit"),className:"block py-2 hover:bg-gray-100 rounded",children:"Profile"})]})]}),e.jsxs(s,{href:route("logout"),method:"post",as:"button",className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(F,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!a&&"hidden"}`,children:"Log Out"})]})]})]})]})]})},_=()=>{const{isAdmin:a,isPostgraduate:l,isUndergraduate:d,isFacultyAdmin:n,isAcademician:i,canPostEvents:c,canPostProjects:p,canPostGrants:g,canCreateFacultyAdmin:j,canAssignAbilities:h}=E(),[t,b]=o.useState(!1),[r,N]=o.useState({networking:!1,grant:!1,project:!1,event:!1,survey:!1,profile:!1}),m=()=>{b(!t)},x=f=>{N(v=>({...v,[f]:!v[f]}))};return e.jsxs(e.Fragment,{children:[e.jsx("button",{className:"fixed top-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-md shadow-md lg:hidden",onClick:m,children:t?"✕":"☰"}),e.jsx("div",{className:`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-40 transform transition-transform duration-300 ${t?"translate-x-0":"-translate-x-full"} lg:translate-x-0`,children:e.jsxs("div",{className:"p-4 h-full overflow-auto",children:[e.jsx("div",{className:"flex items-center mb-6",children:e.jsx("a",{href:"/",className:"flex items-center space-x-2",children:e.jsx("h2",{className:"text-lg text-blue-600 font-semibold",children:"NexScholar"})})}),e.jsxs("nav",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Main"}),e.jsxs(s,{href:route("dashboard"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(u,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Dashboard"})]}),n&&e.jsxs(s,{href:route("faculty-admin.academicians"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(u,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Verify Academicians"})]})]}),a&&e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Admin Features"}),e.jsxs(s,{href:route("faculty-admins.index"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(u,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Create Faculty Admin"})]}),e.jsxs(s,{href:route("roles.index"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(u,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Assign Abilities"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Networking"}),e.jsxs("button",{onClick:()=>x("networking"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx($,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Networking"}),e.jsx("span",{className:"ml-auto",children:r.networking?"-":"+"})]}),r.networking&&e.jsxs("div",{className:"ml-6",children:[e.jsx(s,{href:"/postgraduates",className:"block py-2 hover:bg-gray-100 rounded",children:"Postgraduate"}),e.jsx(s,{href:"/undergraduates",className:"block py-2 hover:bg-gray-100 rounded",children:"Undergraduate"}),e.jsx(s,{href:"/academicians",className:"block py-2 hover:bg-gray-100 rounded",children:"Academician"}),e.jsx(s,{href:"/universities",className:"block py-2 hover:bg-gray-100 rounded",children:"University"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Features"}),e.jsxs("button",{onClick:()=>x("grant"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(A,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Grant"}),e.jsx("span",{className:"ml-auto",children:r.grant?"-":"+"})]}),r.grant&&e.jsxs("div",{className:"ml-6",children:[e.jsx(s,{href:"/grants",className:"block py-2 hover:bg-gray-100 rounded",children:"View Grant"}),g&&e.jsx(s,{href:route("post-grants.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Grants"})]}),e.jsxs("button",{onClick:()=>x("project"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(M,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Project"}),e.jsx("span",{className:"ml-auto",children:r.project?"-":"+"})]}),r.project&&e.jsxs("div",{className:"ml-6",children:[e.jsx(s,{href:"/projects",className:"block py-2 hover:bg-gray-100 rounded",children:"View project"}),p&&e.jsx(s,{href:route("post-projects.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage project"})]}),e.jsxs("button",{onClick:()=>x("event"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(C,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Event"}),e.jsx("span",{className:"ml-auto",children:r.event?"-":"+"})]}),r.event&&e.jsxs("div",{className:"ml-6",children:[e.jsx(s,{href:"/events",className:"block py-2 hover:bg-gray-100 rounded",children:"View event"}),c&&e.jsx(s,{href:route("post-events.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage event"})]}),e.jsxs("button",{onClick:()=>x("post"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(P,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Post"}),e.jsx("span",{className:"ml-auto",children:r.post?"-":"+"})]}),r.post&&e.jsxs("div",{className:"ml-6",children:[e.jsx(s,{href:"/posts",className:"block py-2 hover:bg-gray-100 rounded",children:"View post"}),e.jsx(s,{href:route("create-posts.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage post"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Survey"}),e.jsxs("button",{onClick:()=>x("survey"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(G,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Survey"}),e.jsx("span",{className:"ml-auto",children:r.survey?"-":"+"})]}),r.survey&&e.jsxs("div",{className:"ml-6",children:[e.jsx(s,{href:"/survey/free",className:"block py-2 hover:bg-gray-100 rounded",children:"Free Survey"}),e.jsx(s,{href:"/survey/with-token",className:"block py-2 hover:bg-gray-100 rounded",children:"Survey With Token"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Settings"}),e.jsxs("button",{onClick:()=>x("profile"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(S,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Profile"}),e.jsx("span",{className:"ml-auto",children:r.profile?"-":"+"})]}),r.profile&&e.jsxs("div",{className:"ml-6",children:[e.jsx(s,{href:route("profile.edit"),className:"block py-2 hover:bg-gray-100 rounded",children:"General Account Setting"}),e.jsx(s,{href:route("role.edit"),className:"block py-2 hover:bg-gray-100 rounded",children:"Personal Information"})]})]}),e.jsxs(s,{href:route("logout"),method:"post",as:"button",className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(F,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Log Out"})]})]})]})}),t&&e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden",onClick:m})]})},L=({profilePicture:a})=>e.jsx("nav",{className:"border-b border-gray-200 px-4 py-3 shadow-sm",children:e.jsxs("div",{className:"flex items-center justify-between mx-auto",children:[e.jsxs("div",{className:"flex items-center space-x-6",children:[e.jsx(s,{href:route("profile.edit"),className:"text-gray-700 hover:text-blue-600 font-medium",children:"My Account"}),e.jsx(s,{href:route("role.edit"),className:"text-gray-700 hover:text-blue-600 font-medium",children:"Profile"})]}),e.jsx("div",{className:"flex items-center space-x-4"})]})});/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=a=>a.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),V=(...a)=>a.filter((l,d,n)=>!!l&&l.trim()!==""&&n.indexOf(l)===d).join(" ").trim();/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var z={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=o.forwardRef(({color:a="currentColor",size:l=24,strokeWidth:d=2,absoluteStrokeWidth:n,className:i="",children:c,iconNode:p,...g},j)=>o.createElement("svg",{ref:j,...z,width:l,height:l,stroke:a,strokeWidth:n?Number(d)*24/Number(l):d,className:V("lucide",i),...g},[...p.map(([h,t])=>o.createElement(h,t)),...Array.isArray(c)?c:[c]]));/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=(a,l)=>{const d=o.forwardRef(({className:n,...i},c)=>o.createElement(B,{ref:c,iconNode:l,className:V(`lucide-${I(a)}`,n),...i}));return d.displayName=`${a}`,d};/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=[["path",{d:"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",key:"jecpp"}],["rect",{width:"20",height:"14",x:"2",y:"6",rx:"2",key:"i6l2r4"}]],R=y("Briefcase",H);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=[["path",{d:"M11 14h1v4",key:"fy54vd"}],["path",{d:"M16 2v4",key:"4m81vk"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M8 2v4",key:"1cmpym"}],["rect",{x:"3",y:"4",width:"18",height:"18",rx:"2",key:"12vinp"}]],D=y("Calendar1",W);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=[["path",{d:"M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3",key:"12ixgl"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",key:"u0c8gj"}],["path",{d:"M7 16.5 8 22l-3-1-3 1 1-5.5",key:"5gm2nr"}]],q=y("FileBadge",T);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"1d0kgt"}]],K=y("House",Z);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]],J=y("User",Y),ee=({children:a,title:l,TopMenuOpen:d})=>{const[n,i]=o.useState(!1),[c,p]=o.useState(!1),{url:g}=w(),j=()=>{const t=!n;i(t),localStorage.setItem("isSidebarOpen",t)};o.useEffect(()=>{const t=()=>{p(window.innerWidth>=1024),window.innerWidth>=1024?i(!0):i(!1)};return t(),window.addEventListener("resize",t),()=>window.removeEventListener("resize",t)},[]),o.useEffect(()=>{const t=localStorage.getItem("isSidebarOpen");t!==null&&i(t==="true")},[]);const h=t=>g.startsWith(t);return e.jsxs("div",{className:"flex min-h-screen bg-gray-100",children:[c&&e.jsx(U,{isOpen:n,toggleSidebar:j}),!c&&e.jsx(_,{isOpen:n,toggleSidebar:j}),c?e.jsxs("div",{className:`flex-1 p-6 transition-all duration-300 ${n?"ml-64":"ml-20"}`,children:[d&&e.jsx(L,{}),e.jsx(k,{title:l}),e.jsxs("div",{className:"p-4 bg-white rounded-lg shadow",children:[e.jsx("h1",{className:"text-2xl font-semibold mb-4 pt-2 pl-2",children:l}),a]})]}):e.jsxs("div",{children:[e.jsx(k,{title:l}),e.jsx("div",{className:"pb-20",children:a}),e.jsx("div",{className:"fixed bottom-0 w-full bg-white border-t border-gray-200 rounded-t-3xl shadow-lg",children:e.jsxs("div",{className:"flex justify-around items-center relative py-3",children:[e.jsxs(s,{href:"/events",className:`flex flex-col items-center ${h("/event")?"text-blue-500":"text-gray-500"}`,children:[e.jsx(D,{className:"w-6 h-6 stroke-current"}),e.jsx("span",{className:"text-xs font-medium",children:"Event"})]}),e.jsxs(s,{href:"/projects",className:`flex flex-col items-center ${h("/project")?"text-blue-500":"text-gray-500"}`,children:[e.jsx(R,{className:"w-6 h-6 stroke-current"}),e.jsx("span",{className:"text-xs font-medium",children:"Project"})]}),e.jsx("div",{className:"absolute -top-6 w-14 h-14 flex items-center justify-center bg-blue-500 rounded-full shadow-lg border-4 border-white",children:e.jsx(s,{href:"/dashboard",children:e.jsx(K,{className:"w-7 h-7 stroke-white stroke-[1.5]"})})}),e.jsxs(s,{href:"/grants",className:`flex flex-col items-center ${h("/grant")?"text-blue-500":"text-gray-500"}`,children:[e.jsx(q,{className:"w-6 h-6 stroke-current"}),e.jsx("span",{className:"text-xs font-medium",children:"Grant"})]}),e.jsxs(s,{href:"/profile",className:`flex flex-col items-center ${h("/profile")?"text-blue-500":"text-gray-500"}`,children:[e.jsx(J,{className:"w-6 h-6 stroke-current"}),e.jsx("span",{className:"text-xs font-medium",children:"Profile"})]})]})})]})]})};export{ee as M};
