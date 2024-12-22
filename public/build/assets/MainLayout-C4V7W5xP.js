import{q as b,r as x,j as e,a as r,Y as h}from"./app-Bu0hZnGC.js";import{d as m,e as u,f as g,g as j,h as p,i as f,j as N,k as y}from"./index-CnfXvRUl.js";const v=({isOpen:s,toggleSidebar:t,isPostgraduate:c})=>{b().props.auth.user;const[a,o]=x.useState({networking:!1,journal:!1,grant:!1,project:!1,event:!1,survey:!1,workspace:!1,profile:!1}),l=n=>{o(d=>({...d,[n]:!d[n]}))};return e.jsxs("div",{className:`bg-white h-full fixed z-10 transition-all duration-300 ${s?"w-64":"w-20"}`,children:[e.jsx("button",{onClick:t,className:"absolute top-4 right-[-14px] w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center",children:s?"<":">"}),e.jsxs("div",{className:"p-4 h-full overflow-auto",children:[e.jsx("div",{className:"flex items-center mb-6",children:e.jsx("a",{href:"/",className:"flex items-center space-x-2",children:e.jsx("h2",{className:`ml-2 text-lg text-blue-600 font-semibold ${!s&&"hidden"}`,children:"Nexscholar"})})}),e.jsxs("nav",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!s&&"hidden"}`,children:"Main"}),e.jsxs(r,{href:route("dashboard"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(m,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Dashboard"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!s&&"hidden"}`,children:"Networking"}),e.jsxs("button",{onClick:()=>l("networking"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(u,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Networking"}),s&&e.jsx("span",{className:"ml-auto",children:a.networking?"-":"+"})]}),a.networking&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(r,{href:"/postgraduates",className:"block py-2 hover:bg-gray-100 rounded",children:"Postgraduate"}),e.jsx(r,{href:"/undergraduates",className:"block py-2 hover:bg-gray-100 rounded",children:"Undergraduate"}),e.jsx(r,{href:"/academicians",className:"block py-2 hover:bg-gray-100 rounded",children:"Academician"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!s&&"hidden"}`,children:"Features"}),e.jsxs("button",{onClick:()=>l("grant"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(g,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Grant"}),s&&e.jsx("span",{className:"ml-auto",children:a.grant?"-":"+"})]}),a.grant&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(r,{href:"/grant",className:"block py-2 hover:bg-gray-100 rounded",children:"View Grant"}),!c&&e.jsx(r,{href:route("post-grants.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Grants"})]}),e.jsxs("button",{onClick:()=>l("project"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(j,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Project"}),s&&e.jsx("span",{className:"ml-auto",children:a.project?"-":"+"})]}),a.project&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(r,{href:"/project",className:"block py-2 hover:bg-gray-100 rounded",children:" View Project"}),!c&&e.jsx(r,{href:route("post-projects.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Projects"})]}),e.jsxs("button",{onClick:()=>l("event"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(p,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Event"}),s&&e.jsx("span",{className:"ml-auto",children:a.event?"-":"+"})]}),a.event&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(r,{href:"/event",className:"block py-2 hover:bg-gray-100 rounded",children:"View Event"}),!c&&e.jsx(r,{href:route("post-events.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Event"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:`text-gray-500 uppercase text-xs font-bold ${!s&&"hidden"}`,children:"Setting"}),e.jsxs("div",{children:[e.jsxs("button",{onClick:()=>l("profile"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(f,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Profile"}),s&&e.jsx("span",{className:"ml-auto",children:a.profile?"-":"+"})]}),a.profile&&e.jsxs("div",{className:`${!s&&"hidden"} ml-6`,children:[e.jsx(r,{href:route("profile.edit"),className:"block py-2 hover:bg-gray-100 rounded",children:"My Account"}),e.jsx(r,{href:route("role.edit"),className:"block py-2 hover:bg-gray-100 rounded",children:"Profile"})]})]}),e.jsxs(r,{href:route("logout"),method:"post",as:"button",className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(N,{className:"text-gray-600"}),e.jsx("span",{className:`ml-2 ${!s&&"hidden"}`,children:"Log Out"})]})]})]})]})]})},k=({isPostgraduate:s})=>{const[t,c]=x.useState(!1),[a,o]=x.useState({networking:!1,grant:!1,project:!1,event:!1,survey:!1,profile:!1}),l=()=>{c(!t)},n=d=>{o(i=>({...i,[d]:!i[d]}))};return e.jsxs(e.Fragment,{children:[e.jsx("button",{className:"fixed top-4 right-4 z-50 bg-blue-600 text-white p-2 rounded-md shadow-md md:hidden",onClick:l,children:t?"✕":"☰"}),e.jsx("div",{className:`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-40 transform transition-transform duration-300 ${t?"translate-x-0":"-translate-x-full"}`,children:e.jsxs("div",{className:"p-4 h-full overflow-auto",children:[e.jsx("div",{className:"flex items-center mb-6",children:e.jsx("a",{href:"/",className:"flex items-center space-x-2",children:e.jsx("h2",{className:"text-lg text-blue-600 font-semibold",children:"NexScholar"})})}),e.jsxs("nav",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Main"}),e.jsxs(r,{href:route("dashboard"),className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(m,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Dashboard"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Networking"}),e.jsxs("button",{onClick:()=>n("networking"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(u,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Networking"}),e.jsx("span",{className:"ml-auto",children:a.networking?"-":"+"})]}),a.networking&&e.jsxs("div",{className:"ml-6",children:[e.jsx(r,{href:"/postgraduates",className:"block py-2 hover:bg-gray-100 rounded",children:"Postgraduate"}),e.jsx(r,{href:"/academicians",className:"block py-2 hover:bg-gray-100 rounded",children:"Academician"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Features"}),e.jsxs("button",{onClick:()=>n("grant"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(g,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Grant"}),e.jsx("span",{className:"ml-auto",children:a.grant?"-":"+"})]}),a.grant&&e.jsxs("div",{className:"ml-6",children:[e.jsx(r,{href:"/grant",className:"block py-2 hover:bg-gray-100 rounded",children:"View Grant"}),!s&&e.jsx(r,{href:route("post-grants.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage Grants"})]}),e.jsxs("button",{onClick:()=>n("project"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(j,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Project"}),e.jsx("span",{className:"ml-auto",children:a.project?"-":"+"})]}),a.project&&e.jsxs("div",{className:"ml-6",children:[e.jsx(r,{href:"/project",className:"block py-2 hover:bg-gray-100 rounded",children:"View project"}),!s&&e.jsx(r,{href:route("post-projects.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage project"})]}),e.jsxs("button",{onClick:()=>n("event"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(p,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Event"}),e.jsx("span",{className:"ml-auto",children:a.event?"-":"+"})]}),a.event&&e.jsxs("div",{className:"ml-6",children:[e.jsx(r,{href:"/event",className:"block py-2 hover:bg-gray-100 rounded",children:"View event"}),!s&&e.jsx(r,{href:route("post-events.index"),className:"block py-2 hover:bg-gray-100 rounded",children:"Manage event"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Survey"}),e.jsxs("button",{onClick:()=>n("survey"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(y,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Survey"}),e.jsx("span",{className:"ml-auto",children:a.survey?"-":"+"})]}),a.survey&&e.jsxs("div",{className:"ml-6",children:[e.jsx(r,{href:"/survey/free",className:"block py-2 hover:bg-gray-100 rounded",children:"Free Survey"}),e.jsx(r,{href:"/survey/with-token",className:"block py-2 hover:bg-gray-100 rounded",children:"Survey With Token"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-gray-500 uppercase text-xs font-bold",children:"Settings"}),e.jsxs("button",{onClick:()=>n("profile"),className:"flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(f,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Profile"}),e.jsx("span",{className:"ml-auto",children:a.profile?"-":"+"})]}),a.profile&&e.jsxs("div",{className:"ml-6",children:[e.jsx(r,{href:route("profile.edit"),className:"block py-2 hover:bg-gray-100 rounded",children:"General Account Setting"}),e.jsx(r,{href:route("role.edit"),className:"block py-2 hover:bg-gray-100 rounded",children:"Personal Information"})]})]}),e.jsxs(r,{href:route("logout"),method:"post",as:"button",className:"flex items-center py-2 px-4 hover:bg-gray-100 rounded",children:[e.jsx(N,{className:"text-gray-600"}),e.jsx("span",{className:"ml-2",children:"Log Out"})]})]})]})}),t&&e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden",onClick:l})]})},w=({profilePicture:s})=>e.jsx("nav",{className:"border-b border-gray-200 px-4 py-3 shadow-sm",children:e.jsxs("div",{className:"flex items-center justify-between mx-auto",children:[e.jsxs("div",{className:"flex items-center space-x-6",children:[e.jsx(r,{href:route("profile.edit"),className:"text-gray-700 hover:text-blue-600 font-medium",children:"My Account"}),e.jsx(r,{href:route("role.edit"),className:"text-gray-700 hover:text-blue-600 font-medium",children:"Profile"})]}),e.jsx("div",{className:"flex items-center space-x-4"})]})}),M=({children:s,title:t,isPostgraduate:c})=>{const[a,o]=x.useState(!1),[l,n]=x.useState(!1),d=()=>{o(!a)};return x.useEffect(()=>{const i=()=>{window.innerWidth>=1024?(n(!0),o(!0)):(n(!1),o(!1))};return i(),window.addEventListener("resize",i),()=>window.removeEventListener("resize",i)},[]),e.jsxs("div",{className:"flex min-h-screen bg-gray-100",children:[l&&e.jsx(v,{isOpen:a,toggleSidebar:d,isPostgraduate:c}),!l&&e.jsx(k,{isOpen:a,toggleSidebar:d,isPostgraduate:c}),l?e.jsxs("div",{className:`flex-1 p-6 transition-all duration-300 ${a?"ml-64":"ml-20"}`,children:[e.jsx(w,{}),e.jsx(h,{title:t}),e.jsxs("div",{className:"p-4 bg-white rounded-lg shadow",children:[e.jsx("h1",{className:"text-2xl font-semibold mb-4",children:t}),s]})]}):e.jsxs("div",{className:`flex-1 p-6 transition-all duration-300 ${a?"ml-64":"ml-0"}`,children:[e.jsx(h,{title:t}),e.jsxs("div",{className:"p-4 bg-white rounded-lg shadow",children:[e.jsx("h1",{className:"text-2xl font-semibold mb-4",children:t}),s]})]})]})};export{M};
