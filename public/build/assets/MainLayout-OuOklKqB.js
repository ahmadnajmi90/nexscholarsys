import{q as F,r as o,j as e,a as s,Y as v}from"./app-iSEIWsyv.js";import{d as c,e as k,f as w,g as A,h as S,i as P,j as $,k as M}from"./index-Cckze7f5.js";import{u as C}from"./useRoles-Bg2eUcx0.js";const E=({isOpen:a,toggleSidebar:x})=>{const{isAdmin:d,isPostgraduate:i,isUndergraduate:m,isFacultyAdmin:h,isAcademician:u,canPostEvents:l,canPostProjects:f,canPostGrants:y,canCreateFacultyAdmin:g,canAssignAbilities:N}=C();F().props.auth.user;const[r,p]=o.useState({networking:!1,journal:!1,grant:!1,project:!1,event:!1,survey:!1,workspace:!1,profile:!1}),n=t=>{p(j=>({...j,[t]:!j[t]}))};return e.jsxs("div",{className:`bg-white h-full fixed z-10 transition-all duration-300 ${a?"w-64":"w-20"}`,children:[e.jsx("button",{onClick:x,className:"absolute top-4 right-[-14px] w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center",children:a?"<":">"}),e.jsxs("div",{className:"p-4 h-full overflow-auto",children:[e.jsx("div",{className:"flex items-center mb-6",children:e.jsx("a",{href:"/",className:"flex items-center space-x-2",children:e.jsx("h2",{className:`ml-2 text-lg text-blue-600 font-semibold ${!a&&"hidden"}`,children:"Nexscholar"})})}),e.jsxs("nav",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!a&&"hidden"}`,children:"Main"}),e.jsxs(s,{href:route("dashboard"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(c,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!a&&"hidden"}`,children:"Dashboard"})]}),h&&e.jsxs(s,{href:route("faculty-admin.academicians"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(c,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!a&&"hidden"}`,children:"Verify Academicians"})]})]}),d&&e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!a&&"hidden"}`,children:"Admin Features"}),e.jsxs(s,{href:route("faculty-admins.index"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(c,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!a&&"hidden"}`,children:"Create Faculty Admin"})]}),e.jsxs(s,{href:route("roles.index"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(c,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!a&&"hidden"}`,children:"Assign Abilities"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!a&&"hidden"}`,children:"Networking"}),e.jsxs("button",{onClick:()=>n("networking"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(k,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!a&&"hidden"}`,children:"Networking"}),a&&e.jsx("span",{className:"ml-auto",children:r.networking?"-":"+"})]}),r.networking&&e.jsxs("div",{className:`${!a&&"hidden"} ml-6`,children:[e.jsx(s,{href:"/postgraduates",className:"block py-2 hover:bg-gray-100 rounded",children:"Postgraduate"}),e.jsx(s,{href:"/undergraduates",className:"block py-2 hover:bg-gray-100 rounded",children:"Undergraduate"}),e.jsx(s,{href:"/academicians",className:"block py-2 hover:bg-gray-100 rounded",children:"Academician"}),e.jsx(s,{href:"/universities",className:"block py-2 hover:bg-gray-100 rounded",children:"University"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!a&&"hidden"}`,children:"Features"}),e.jsxs("button",{onClick:()=>n("grant"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(w,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!a&&"hidden"}`,children:"Grant"}),a&&e.jsx("span",{className:"ml-auto",children:r.grant?"-":"+"})]}),r.grant&&e.jsxs("div",{className:`${!a&&"hidden"} ml-6`,children:[e.jsx(s,{href:"/grant",className:"block py-2 hover:bg-gray-100 rounded",children:"View Grant"}),y&&e.jsx(s,{href:route("post-grants.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Grants"})]}),e.jsxs("button",{onClick:()=>n("project"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(A,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!a&&"hidden"}`,children:"Project"}),a&&e.jsx("span",{className:"ml-auto",children:r.project?"-":"+"})]}),r.project&&e.jsxs("div",{className:`${!a&&"hidden"} ml-6`,children:[e.jsx(s,{href:"/project",className:"block py-2 hover:bg-gray-100 rounded",children:" View Project"}),f&&e.jsx(s,{href:route("post-projects.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Projects"})]}),e.jsxs("button",{onClick:()=>n("event"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(S,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!a&&"hidden"}`,children:"Event"}),a&&e.jsx("span",{className:"ml-auto",children:r.event?"-":"+"})]}),r.event&&e.jsxs("div",{className:`${!a&&"hidden"} ml-6`,children:[e.jsx(s,{href:"/event",className:"block py-2 hover:bg-gray-100 rounded",children:"View Event"}),l&&e.jsx(s,{href:route("post-events.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Event"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!a&&"hidden"}`,children:"Setting"}),e.jsxs("div",{children:[e.jsxs("button",{onClick:()=>n("profile"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(P,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!a&&"hidden"}`,children:"Profile"}),a&&e.jsx("span",{className:"ml-auto",children:r.profile?"-":"+"})]}),r.profile&&e.jsxs("div",{className:`${!a&&"hidden"} ml-6`,children:[e.jsx(s,{href:route("profile.edit"),className:"block py-2 hover:bg-gray-100 rounded",children:"My Account"}),e.jsx(s,{href:route("role.edit"),className:"block py-2 hover:bg-gray-100 rounded",children:"Profile"})]})]}),e.jsxs(s,{href:route("logout"),method:"post",as:"button",className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx($,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!a&&"hidden"}`,children:"Log Out"})]})]})]})]})]})},G=({})=>{const{isAdmin:a,isPostgraduate:x,isUndergraduate:d,isFacultyAdmin:i,isAcademician:m,canPostEvents:h,canPostProjects:u,canPostGrants:l,canCreateFacultyAdmin:f,canAssignAbilities:y}=C(),[g,N]=o.useState(!1),[r,p]=o.useState({networking:!1,grant:!1,project:!1,event:!1,survey:!1,profile:!1}),n=()=>{N(!g)},t=j=>{p(b=>({...b,[j]:!b[j]}))};return e.jsxs(e.Fragment,{children:[e.jsx("button",{className:"fixed top-4 right-4 z-50 bg-blue-600 text-white p-2 rounded-md shadow-md md:hidden",onClick:n,children:g?"✕":"☰"}),e.jsx("div",{className:`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-40 transform transition-transform duration-300 ${g?"translate-x-0":"-translate-x-full"}`,children:e.jsxs("div",{className:"p-4 h-full overflow-auto",children:[e.jsx("div",{className:"flex items-center mb-6",children:e.jsx("a",{href:"/",className:"flex items-center space-x-2",children:e.jsx("h2",{className:"text-lg text-blue-600 font-semibold",children:"NexScholar"})})}),e.jsxs("nav",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Main"}),e.jsxs(s,{href:route("dashboard"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(c,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Dashboard"})]}),i&&e.jsxs(s,{href:route("faculty-admin.academicians"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(c,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Verify Academicians"})]})]}),a&&e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Admin Features"}),e.jsxs(s,{href:route("faculty-admins.index"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(c,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Create Faculty Admin"})]}),e.jsxs(s,{href:route("roles.index"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(c,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Assign Abilities"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Networking"}),e.jsxs("button",{onClick:()=>t("networking"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(k,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Networking"}),e.jsx("span",{className:"ml-auto",children:r.networking?"-":"+"})]}),r.networking&&e.jsxs("div",{className:"ml-6",children:[e.jsx(s,{href:"/postgraduates",className:"block py-2 hover:bg-gray-100 rounded",children:"Postgraduate"}),e.jsx(s,{href:"/undergraduates",className:"block py-2 hover:bg-gray-100 rounded",children:"Postgraduate"}),e.jsx(s,{href:"/academicians",className:"block py-2 hover:bg-gray-100 rounded",children:"Academician"}),e.jsx(s,{href:"/universities",className:"block py-2 hover:bg-gray-100 rounded",children:"University"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Features"}),e.jsxs("button",{onClick:()=>t("grant"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(w,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Grant"}),e.jsx("span",{className:"ml-auto",children:r.grant?"-":"+"})]}),r.grant&&e.jsxs("div",{className:"ml-6",children:[e.jsx(s,{href:"/grant",className:"block py-2 hover:bg-gray-100 rounded",children:"View Grant"}),l&&e.jsx(s,{href:route("post-grants.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Grants"})]}),e.jsxs("button",{onClick:()=>t("project"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(A,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Project"}),e.jsx("span",{className:"ml-auto",children:r.project?"-":"+"})]}),r.project&&e.jsxs("div",{className:"ml-6",children:[e.jsx(s,{href:"/project",className:"block py-2 hover:bg-gray-100 rounded",children:"View project"}),u&&e.jsx(s,{href:route("post-projects.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage project"})]}),e.jsxs("button",{onClick:()=>t("event"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(S,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Event"}),e.jsx("span",{className:"ml-auto",children:r.event?"-":"+"})]}),r.event&&e.jsxs("div",{className:"ml-6",children:[e.jsx(s,{href:"/event",className:"block py-2 hover:bg-gray-100 rounded",children:"View event"}),h&&e.jsx(s,{href:route("post-events.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage event"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Survey"}),e.jsxs("button",{onClick:()=>t("survey"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(M,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Survey"}),e.jsx("span",{className:"ml-auto",children:r.survey?"-":"+"})]}),r.survey&&e.jsxs("div",{className:"ml-6",children:[e.jsx(s,{href:"/survey/free",className:"block py-2 hover:bg-gray-100 rounded",children:"Free Survey"}),e.jsx(s,{href:"/survey/with-token",className:"block py-2 hover:bg-gray-100 rounded",children:"Survey With Token"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Settings"}),e.jsxs("button",{onClick:()=>t("profile"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(P,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Profile"}),e.jsx("span",{className:"ml-auto",children:r.profile?"-":"+"})]}),r.profile&&e.jsxs("div",{className:"ml-6",children:[e.jsx(s,{href:route("profile.edit"),className:"block py-2 hover:bg-gray-100 rounded",children:"General Account Setting"}),e.jsx(s,{href:route("role.edit"),className:"block py-2 hover:bg-gray-100 rounded",children:"Personal Information"})]})]}),e.jsxs(s,{href:route("logout"),method:"post",as:"button",className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx($,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Log Out"})]})]})]})}),g&&e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden",onClick:n})]})},V=({profilePicture:a})=>e.jsx("nav",{className:"border-b border-gray-200 px-4 py-3 shadow-sm",children:e.jsxs("div",{className:"flex items-center justify-between mx-auto",children:[e.jsxs("div",{className:"flex items-center space-x-6",children:[e.jsx(s,{href:route("profile.edit"),className:"text-gray-700 hover:text-blue-600 font-medium",children:"My Account"}),e.jsx(s,{href:route("role.edit"),className:"text-gray-700 hover:text-blue-600 font-medium",children:"Profile"})]}),e.jsx("div",{className:"flex items-center space-x-4"})]})}),L=({children:a,title:x})=>{const[d,i]=o.useState(!1),[m,h]=o.useState(!1),u=()=>{const l=!d;i(l),localStorage.setItem("isSidebarOpen",l)};return o.useEffect(()=>{const l=()=>{window.innerWidth>=1024?(h(!0),i(!0)):(h(!1),i(!1))};return l(),window.addEventListener("resize",l),()=>window.removeEventListener("resize",l)},[]),o.useEffect(()=>{const l=localStorage.getItem("isSidebarOpen");l!==null&&i(l==="true")},[]),e.jsxs("div",{className:"flex min-h-screen bg-gray-100",children:[m&&e.jsx(E,{isOpen:d,toggleSidebar:u}),!m&&e.jsx(G,{isOpen:d,toggleSidebar:u}),m?e.jsxs("div",{className:`flex-1 p-6 transition-all duration-300 ${d?"ml-64":"ml-20"}`,children:[e.jsx(V,{}),e.jsx(v,{title:x}),e.jsxs("div",{className:"p-4 bg-white rounded-lg shadow",children:[e.jsx("h1",{className:"text-2xl font-semibold mb-4 pt-2 pl-2",children:x}),a]})]}):e.jsxs("div",{children:[e.jsx(v,{title:x}),a]})]})};export{L as M};
