import{q as b,r as x,j as e,a,Y as m}from"./app-BTDn7nRG.js";import{d as u,e as h,f as j,g,h as p,i as v,j as k,k as f,l as w,m as N,n as y}from"./index-DZP0hQ9L.js";const $=({isOpen:s,toggleSidebar:c,isPostgraduate:t})=>{b().props.auth.user;const[r,o]=x.useState({networking:!1,journal:!1,grant:!1,project:!1,event:!1,survey:!1,workspace:!1,profile:!1}),l=n=>{o(d=>({...d,[n]:!d[n]}))};return e.jsxs("div",{className:`bg-white h-full fixed z-10 transition-all duration-300 ${s?"w-64":"w-20"}`,children:[e.jsx("button",{onClick:c,className:"absolute top-4 right-[-14px] w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center",children:s?"<":">"}),e.jsxs("div",{className:"p-4 h-full overflow-auto",children:[e.jsx("div",{className:"flex items-center mb-6",children:e.jsx("a",{href:"/",className:"flex items-center space-x-2",children:e.jsx("h2",{className:`ml-2 text-lg text-blue-600 font-semibold ${!s&&"hidden"}`,children:"Nexscholar"})})}),e.jsxs("nav",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!s&&"hidden"}`,children:"Main"}),e.jsxs(a,{href:route("dashboard"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(u,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Dashboard"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!s&&"hidden"}`,children:"Networking"}),e.jsxs("button",{onClick:()=>l("networking"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(h,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Networking"}),s&&e.jsx("span",{className:"ml-auto",children:r.networking?"-":"+"})]}),r.networking&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(a,{href:"/postgraduates",className:"block py-2 hover:bg-gray-100 rounded",children:"Postgraduate"}),e.jsx(a,{href:"/academicians",className:"block py-2 hover:bg-gray-100 rounded",children:"Academician"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!s&&"hidden"}`,children:"Features"}),e.jsxs("button",{onClick:()=>l("grant"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(j,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Grant"}),s&&e.jsx("span",{className:"ml-auto",children:r.grant?"-":"+"})]}),r.grant&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(a,{href:"/grant",className:"block py-2 hover:bg-gray-100 rounded",children:"View Grant"}),!t&&e.jsx(a,{href:route("post-grants.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Grants"})]}),e.jsxs("button",{onClick:()=>l("project"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(g,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Project"}),s&&e.jsx("span",{className:"ml-auto",children:r.project?"-":"+"})]}),r.project&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(a,{href:"/project",className:"block py-2 hover:bg-gray-100 rounded",children:" View Project"}),!t&&e.jsx(a,{href:route("post-projects.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Projects"})]}),e.jsxs("button",{onClick:()=>l("event"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(p,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Event"}),s&&e.jsx("span",{className:"ml-auto",children:r.event?"-":"+"})]}),r.event&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(a,{href:"/event",className:"block py-2 hover:bg-gray-100 rounded",children:"View Event"}),!t&&e.jsx(a,{href:route("post-events.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Event"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:`text-blue-500 uppercase text-xs font-bold ${!s&&"hidden"}`,children:"Features In Development "}),e.jsxs("button",{onClick:()=>l("workspace"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(v,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Workspace"}),s&&e.jsx("span",{className:"ml-auto",children:r.workspace?"-":"+"})]}),r.workspace&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(a,{href:"#",className:"block py-2 hover:bg-gray-100 rounded",children:"View Board"}),e.jsx(a,{href:"#",className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Board"}),e.jsx(a,{href:"#",className:"block py-2 hover:bg-gray-100 rounded",children:"Members"})]}),e.jsxs("button",{onClick:()=>l("journal"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(k,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Journal Database"}),s&&e.jsx("span",{className:"ml-auto",children:r.journal?"-":"+"})]}),r.journal&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(a,{href:"#",className:"block py-2 hover:bg-gray-100 rounded",children:"Discontinued Journal"}),e.jsx(a,{href:"#",className:"block py-2 hover:bg-gray-100 rounded",children:"Predator Journal"})]}),e.jsxs("button",{onClick:()=>l("survey"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(f,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Survey"}),s&&e.jsx("span",{className:"ml-auto",children:r.survey?"-":"+"})]}),r.survey&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(a,{href:"#",className:"block py-2 hover:bg-gray-100 rounded",children:"Survey (Free)"}),e.jsx(a,{href:"#",className:"block py-2 hover:bg-gray-100 rounded",children:"Survey (With Token)"})]}),e.jsx(a,{href:"#",className:"flex items-center justify-between py-2 px-4 hover:bg-gray-100 rounded",children:e.jsxs("div",{className:"flex items-center",children:[e.jsx(w,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Newsfeed"})]})}),e.jsx(a,{href:"#",className:"flex items-center justify-between py-2 px-4 hover:bg-gray-100 rounded",children:e.jsxs("div",{className:"flex items-center",children:[e.jsx(h,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Forums"})]})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!s&&"hidden"}`,children:"Setting"}),e.jsxs("div",{children:[e.jsxs("button",{onClick:()=>l("profile"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(N,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Profile"}),s&&e.jsx("span",{className:"ml-auto",children:r.profile?"-":"+"})]}),r.profile&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(a,{href:route("profile.edit"),className:"block py-2 hover:bg-gray-100 rounded",children:"My Account"}),e.jsx(a,{href:route("role.edit"),className:"block py-2 hover:bg-gray-100 rounded",children:"Profile"})]})]}),e.jsxs(a,{href:route("logout"),method:"post",as:"button",className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(y,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Log Out"})]})]})]})]})]})},S=({isPostgraduate:s})=>{const[c,t]=x.useState(!1),[r,o]=x.useState({networking:!1,grant:!1,project:!1,event:!1,survey:!1,profile:!1}),l=()=>{t(!c)},n=d=>{o(i=>({...i,[d]:!i[d]}))};return e.jsxs(e.Fragment,{children:[e.jsx("button",{className:"fixed top-4 right-4 z-50 bg-blue-600 text-white p-2 rounded-md shadow-md md:hidden",onClick:l,children:c?"✕":"☰"}),e.jsx("div",{className:`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-40 transform transition-transform duration-300 ${c?"translate-x-0":"-translate-x-full"}`,children:e.jsxs("div",{className:"p-4 h-full overflow-auto",children:[e.jsx("div",{className:"flex items-center mb-6",children:e.jsx("a",{href:"/",className:"flex items-center space-x-2",children:e.jsx("h2",{className:"text-lg text-blue-600 font-semibold",children:"NexScholar"})})}),e.jsxs("nav",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Main"}),e.jsxs(a,{href:route("dashboard"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(u,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Dashboard"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Networking"}),e.jsxs("button",{onClick:()=>n("networking"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(h,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Networking"}),e.jsx("span",{className:"ml-auto",children:r.networking?"-":"+"})]}),r.networking&&e.jsxs("div",{className:"ml-6",children:[e.jsx(a,{href:"/postgraduates",className:"block py-2 hover:bg-gray-100 rounded",children:"Postgraduate"}),e.jsx(a,{href:"/academicians",className:"block py-2 hover:bg-gray-100 rounded",children:"Academician"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Features"}),e.jsxs("button",{onClick:()=>n("grant"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(j,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Grant"}),e.jsx("span",{className:"ml-auto",children:r.grant?"-":"+"})]}),r.grant&&e.jsxs("div",{className:"ml-6",children:[e.jsx(a,{href:"/grant",className:"block py-2 hover:bg-gray-100 rounded",children:"View Grant"}),!s&&e.jsx(a,{href:route("post-grants.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Grants"})]}),e.jsxs("button",{onClick:()=>n("project"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(g,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Project"}),e.jsx("span",{className:"ml-auto",children:r.project?"-":"+"})]}),r.project&&e.jsxs("div",{className:"ml-6",children:[e.jsx(a,{href:"/project",className:"block py-2 hover:bg-gray-100 rounded",children:"View project"}),!s&&e.jsx(a,{href:route("post-projects.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage project"})]}),e.jsxs("button",{onClick:()=>n("event"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(p,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Event"}),e.jsx("span",{className:"ml-auto",children:r.event?"-":"+"})]}),r.event&&e.jsxs("div",{className:"ml-6",children:[e.jsx(a,{href:"/event",className:"block py-2 hover:bg-gray-100 rounded",children:"View event"}),!s&&e.jsx(a,{href:route("post-events.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage event"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Survey"}),e.jsxs("button",{onClick:()=>n("survey"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(f,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Survey"}),e.jsx("span",{className:"ml-auto",children:r.survey?"-":"+"})]}),r.survey&&e.jsxs("div",{className:"ml-6",children:[e.jsx(a,{href:"/survey/free",className:"block py-2 hover:bg-gray-100 rounded",children:"Free Survey"}),e.jsx(a,{href:"/survey/with-token",className:"block py-2 hover:bg-gray-100 rounded",children:"Survey With Token"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Settings"}),e.jsxs("button",{onClick:()=>n("profile"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(N,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Profile"}),e.jsx("span",{className:"ml-auto",children:r.profile?"-":"+"})]}),r.profile&&e.jsxs("div",{className:"ml-6",children:[e.jsx(a,{href:route("profile.edit"),className:"block py-2 hover:bg-gray-100 rounded",children:"General Account Setting"}),e.jsx(a,{href:route("role.edit"),className:"block py-2 hover:bg-gray-100 rounded",children:"Personal Information"})]})]}),e.jsxs(a,{href:route("logout"),method:"post",as:"button",className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(y,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Log Out"})]})]})]})}),c&&e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden",onClick:l})]})},C=({profilePicture:s})=>e.jsx("nav",{className:"border-b border-gray-200 px-4 py-3 shadow-sm",children:e.jsxs("div",{className:"flex items-center justify-between mx-auto",children:[e.jsxs("div",{className:"flex items-center space-x-6",children:[e.jsx(a,{href:route("profile.edit"),className:"text-gray-700 hover:text-blue-600 font-medium",children:"My Account"}),e.jsx(a,{href:route("role.edit"),className:"text-gray-700 hover:text-blue-600 font-medium",children:"Profile"})]}),e.jsx("div",{className:"flex items-center space-x-4"})]})}),E=({children:s,title:c,isPostgraduate:t})=>{const[r,o]=x.useState(!1),[l,n]=x.useState(!1),d=()=>{o(!r)};return x.useEffect(()=>{const i=()=>{window.innerWidth>=1024?(n(!0),o(!0)):(n(!1),o(!1))};return i(),window.addEventListener("resize",i),()=>window.removeEventListener("resize",i)},[]),e.jsxs("div",{className:"flex min-h-screen bg-gray-100",children:[l&&e.jsx($,{isOpen:r,toggleSidebar:d,isPostgraduate:t}),!l&&e.jsx(S,{isOpen:r,toggleSidebar:d,isPostgraduate:t}),l?e.jsxs("div",{className:`flex-1 p-6 transition-all duration-300 ${r?"ml-64":"ml-20"}`,children:[e.jsx(m,{title:c}),e.jsx(C,{}),e.jsxs("div",{className:"p-4 bg-white rounded-lg shadow",children:[e.jsx("h1",{className:"text-2xl font-semibold mb-4",children:c}),s]})]}):e.jsxs("div",{className:`flex-1 p-6 transition-all duration-300 ${r?"ml-64":"ml-0"}`,children:[e.jsx(m,{title:c}),e.jsxs("div",{className:"p-4 bg-white rounded-lg shadow",children:[e.jsx("h1",{className:"text-2xl font-semibold mb-4",children:c}),s]})]})]})};export{E as M};
