import{q as x,r as i,j as e,a,Y as m}from"./app-Bdl7mgw_.js";import{d as j,e as h,f as u,g,h as N,i as y,j as b,k as f,l as p,m as v,n as k}from"./index-ARINsVOh.js";const w=({isOpen:s,toggleSidebar:d,isPostgraduate:n})=>{x().props.auth.user;const[r,c]=i.useState({networking:!1,journal:!1,grant:!1,project:!1,event:!1,survey:!1,workspace:!1,profile:!1}),l=t=>{c(o=>({...o,[t]:!o[t]}))};return e.jsxs("div",{className:`bg-white h-full fixed z-10 transition-all duration-300 ${s?"w-64":"w-20"}`,children:[e.jsx("button",{onClick:d,className:"absolute top-4 right-[-14px] w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center",children:s?"<":">"}),e.jsxs("div",{className:"p-4 h-full overflow-auto",children:[e.jsx("div",{className:"flex items-center mb-6",children:e.jsx("h2",{className:`ml-2 text-lg font-semibold ${!s&&"hidden"}`,children:"Nexscholar"})}),e.jsxs("nav",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!s&&"hidden"}`,children:"Main"}),e.jsxs(a,{href:route("dashboard"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(j,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Dashboard"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!s&&"hidden"}`,children:"Networking"}),e.jsxs("button",{onClick:()=>l("networking"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(h,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Networking"}),s&&e.jsx("span",{className:"ml-auto",children:r.networking?"-":"+"})]}),r.networking&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(a,{href:"/postgraduates",className:"block py-2 hover:bg-gray-100 rounded",children:"Postgraduate"}),e.jsx(a,{href:"/academicians",className:"block py-2 hover:bg-gray-100 rounded",children:"Academician"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!s&&"hidden"}`,children:"Features"}),e.jsxs("button",{onClick:()=>l("grant"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(u,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Grant"}),s&&e.jsx("span",{className:"ml-auto",children:r.grant?"-":"+"})]}),r.grant&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(a,{href:"/grant",className:"block py-2 hover:bg-gray-100 rounded",children:"View Grant"}),!n&&e.jsx(a,{href:route("post-grants.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Grants"})]}),e.jsxs("button",{onClick:()=>l("project"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(g,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Project"}),s&&e.jsx("span",{className:"ml-auto",children:r.project?"-":"+"})]}),r.project&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(a,{href:"/project",className:"block py-2 hover:bg-gray-100 rounded",children:" View Project"}),!n&&e.jsx(a,{href:route("post-projects.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Projects"})]}),e.jsxs("button",{onClick:()=>l("event"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(N,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Event"}),s&&e.jsx("span",{className:"ml-auto",children:r.event?"-":"+"})]}),r.event&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(a,{href:"/event",className:"block py-2 hover:bg-gray-100 rounded",children:"View Event"}),!n&&e.jsx(a,{href:route("post-events.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Event"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:`text-blue-500 uppercase text-xs font-bold ${!s&&"hidden"}`,children:"Features In Development "}),e.jsxs("button",{onClick:()=>l("workspace"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(y,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Workspace"}),s&&e.jsx("span",{className:"ml-auto",children:r.workspace?"-":"+"})]}),r.workspace&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(a,{href:"#",className:"block py-2 hover:bg-gray-100 rounded",children:"View Board"}),e.jsx(a,{href:"#",className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Board"}),e.jsx(a,{href:"#",className:"block py-2 hover:bg-gray-100 rounded",children:"Members"})]}),e.jsxs("button",{onClick:()=>l("journal"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(b,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Journal Database"}),s&&e.jsx("span",{className:"ml-auto",children:r.journal?"-":"+"})]}),r.journal&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(a,{href:"#",className:"block py-2 hover:bg-gray-100 rounded",children:"Discontinued Journal"}),e.jsx(a,{href:"#",className:"block py-2 hover:bg-gray-100 rounded",children:"Predator Journal"})]}),e.jsxs("button",{onClick:()=>l("survey"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(f,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Survey"}),s&&e.jsx("span",{className:"ml-auto",children:r.survey?"-":"+"})]}),r.survey&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(a,{href:"#",className:"block py-2 hover:bg-gray-100 rounded",children:"Survey (Free)"}),e.jsx(a,{href:"#",className:"block py-2 hover:bg-gray-100 rounded",children:"Survey (With Token)"})]}),e.jsx(a,{href:"#",className:"flex items-center justify-between py-2 px-4 hover:bg-gray-100 rounded",children:e.jsxs("div",{className:"flex items-center",children:[e.jsx(p,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Newsfeed"})]})}),e.jsx(a,{href:"#",className:"flex items-center justify-between py-2 px-4 hover:bg-gray-100 rounded",children:e.jsxs("div",{className:"flex items-center",children:[e.jsx(h,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Forums"})]})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!s&&"hidden"}`,children:"Setting"}),e.jsxs("div",{children:[e.jsxs("button",{onClick:()=>l("profile"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(v,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Profile"}),s&&e.jsx("span",{className:"ml-auto",children:r.profile?"-":"+"})]}),r.profile&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(a,{href:route("profile.edit"),className:"block py-2 hover:bg-gray-100 rounded",children:"General Account Setting"}),e.jsx(a,{href:route("role.edit"),className:"block py-2 hover:bg-gray-100 rounded",children:"Personal Information"})]})]}),e.jsxs(a,{href:route("logout"),method:"post",as:"button",className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(k,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Log Out"})]})]})]})]})]})},C=({children:s,title:d,isPostgraduate:n})=>{const[r,c]=i.useState(!0),l=()=>{c(!r)};return e.jsxs("div",{className:"flex min-h-screen bg-gray-100",children:[e.jsx(w,{isOpen:r,toggleSidebar:l,isPostgraduate:n}),e.jsxs("div",{className:`flex-1 p-6 transition-all duration-300 ${r?"ml-64":"ml-20"}`,children:[e.jsx(m,{title:d}),e.jsxs("div",{className:"p-4 bg-white rounded-lg shadow",children:[e.jsx("h1",{className:"text-2xl font-semibold mb-4",children:d}),s]})]})]})};export{C as M};