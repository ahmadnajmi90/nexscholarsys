import{j as e,r as u,a as n}from"./app-BhS0diZf.js";import{v as g,k as b,w as j,x as f,y as p,z as N}from"./index-Cj-RAQUO.js";function m({item:s,auth:o,type:t}){const a=t==="event"?s.event_name:s.title,c=t==="post"?s.content:s.description,l=t==="post"?s.featured_image:s.image,i=()=>t==="event"?route("welcome.events.show",s.url):t==="project"?route("welcome.projects.show",s.url):t==="grant"?route("welcome.grants.show",s.url):t==="post"?route("welcome.posts.show",s.url):"#",x=()=>{window.location.href=i()};return e.jsxs("div",{className:"bg-white rounded-lg shadow-md overflow-hidden text-center pb-8",children:[e.jsx("img",{src:l?`/storage/${l}`:"/storage/default.jpg",alt:a,className:"w-full h-auto md:h-48 object-cover"}),e.jsxs("div",{className:"p-6",children:[e.jsx("h2",{className:"text-lg font-semibold text-gray-800 truncate",title:a,children:a}),e.jsx("p",{className:"text-gray-600 mt-4 h-12 text-center font-extralight",style:{maxWidth:"100%",overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"},dangerouslySetInnerHTML:{__html:c||"No content available."}})]}),e.jsx("div",{className:"px-4",children:e.jsx("button",{onClick:x,className:"inline-block rounded-full border border-gray-300 px-7 py-2 text-base font-medium text-body-color transition hover:border-primary hover:bg-primary hover:text-dark",children:"View Details"})})]})}function d({items:s,auth:o,title:t,type:a}){const[c,l]=u.useState(0),i=s.slice(0,5),x=()=>{l(r=>r===0?i.length-1:r-1)},h=()=>{l(r=>r===i.length-1?0:r+1)};return e.jsx("section",{className:"py-16 bg-white",children:e.jsxs("div",{className:"container mx-auto px-6",children:[e.jsxs("div",{className:"relative flex justify-center items-center mb-8",children:[e.jsx("h2",{className:"text-3xl font-bold text-blue-600",children:t}),e.jsx(n,{href:a==="event"?route("events.index"):a==="project"?route("projects.index"):a==="post"?route("posts.index"):route("grants.index"),className:"absolute right-0 px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition",children:"See More"})]}),e.jsx("div",{className:"hidden md:grid md:grid-cols-5 gap-4",children:i.map(r=>e.jsx(m,{item:r,auth:o,type:a},r.id))}),e.jsxs("div",{className:"md:hidden relative",children:[e.jsx("div",{className:"flex justify-center",children:e.jsx(m,{item:i[c],auth:o,type:a})}),e.jsx("button",{onClick:x,className:"absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-3xl",children:"<"}),e.jsx("button",{onClick:h,className:"absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-3xl",children:">"})]})]})})}const y=({auth:s,posts:o,events:t,projects:a,grants:c})=>{const l=new Date().getFullYear();return e.jsxs("div",{children:[e.jsx("header",{className:"w-full bg-white shadow-md",children:e.jsxs("div",{className:"container mx-auto flex justify-between items-center py-4 px-6",children:[e.jsx("div",{className:"text-blue-600 text-lg font-bold",children:"Nexscholar"}),e.jsx("div",{className:"flex items-center space-x-4",children:s.user?e.jsx(e.Fragment,{children:e.jsx(n,{href:route("dashboard"),className:"rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-blue-500",children:"Dashboard"})}):e.jsxs(e.Fragment,{children:[e.jsx(n,{href:route("login"),className:"rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-blue-500",children:"Log in"}),e.jsx(n,{href:route("register"),className:"rounded-md px-3 py-2 bg-blue-600 text-white transition hover:bg-blue-700 focus:outline-none focus:ring focus-visible:ring-blue-500",children:"Register"})]})})]})}),e.jsx("section",{className:"bg-cover bg-center min-h-screen flex flex-col items-center justify-center text-center px-6",style:{backgroundImage:"linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/background.png')"},children:e.jsxs("div",{className:"container mx-auto",children:[e.jsx("h1",{className:"text-5xl font-bold text-white leading-tight",children:"NexScholar: Empowering Research and Innovation"}),e.jsx("p",{className:"text-white mt-6 max-w-2xl mx-auto",children:"NexScholar helps academics and researchers thrive by simplifying their work and fostering collaboration. Build your academic solutions with ease and efficiency."}),e.jsxs("div",{className:"mt-8 flex justify-center space-x-4",children:[e.jsx(n,{href:route("register"),className:"px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring focus-visible:ring-blue-500",children:"Get Started"}),e.jsx("a",{href:"#",className:"px-8 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-blue-600",children:"Learn More"})]})]})}),e.jsx("section",{id:"collaborators",className:"py-12 bg-gray-100",children:e.jsx("div",{className:"container mx-auto px-6 max-w-screen-xl text-center",children:e.jsxs("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center items-center",children:[e.jsx("img",{src:"/images/utm.png",alt:"Collaborator 1",className:"h-12"}),e.jsx("img",{src:"/images/md-pdti.png",alt:"Collaborator 2",className:"h-12"}),e.jsx("img",{src:"/images/mtdc.png",alt:"Collaborator 3",className:"h-12"}),e.jsx("img",{src:"/images/madict.png",alt:"Collaborator 4",className:"h-12"})]})})}),e.jsx("section",{id:"about-nexscholar",className:"py-16 bg-gray-50",children:e.jsxs("div",{className:"container mx-auto px-6 max-w-screen-lg flex flex-col md:flex-row items-center",children:[e.jsx("div",{className:"md:w-1/2 flex justify-center md:justify-end",children:e.jsx("img",{src:"/images/pic1.png",alt:"NexScholar Collaboration",className:"rounded-lg shadow-lg w-3/4 md:w-full"})}),e.jsxs("div",{className:"md:w-1/2 mt-8 md:mt-0 md:pl-8",children:[e.jsx("h2",{className:"text-3xl font-bold text-blue-600 mb-4",children:"About Us"}),e.jsx("h3",{className:"text-4xl font-bold text-gray-800 leading-tight mb-6",children:"NexScholar: Empowering Research & Innovation"}),e.jsx("p",{className:"text-gray-700 leading-relaxed text-justify",children:"NexScholar is an innovative platform designed to bridge the gap between researchers, academics, industries, and institutions. Our mission is to empower research and innovation by providing seamless tools for collaboration, project management, AI-powered insights, and networking opportunities. NexScholar aims to create an ecosystem where knowledge and resources are easily accessible, fostering groundbreaking discoveries and impactful solutions."})]})]})}),e.jsx("section",{id:"services",className:"py-16 bg-white text-center",children:e.jsxs("div",{className:"container mx-auto px-6 max-w-screen-xl",children:[e.jsx("h2",{className:"text-3xl font-bold text-blue-600",children:"Nexscholar Features"}),e.jsx("p",{className:"text-gray-700 mt-4 max-w-3xl mx-auto",children:"NexScholar offers comprehensive tools to support researchers, academics, and institutions in achieving their goals effectively."}),e.jsxs("div",{className:"mt-12 grid grid-cols-1 md:grid-cols-3 gap-8",children:[e.jsxs("div",{className:"bg-white p-8 rounded-lg shadow-lg",children:[e.jsx("div",{className:"flex justify-center mb-6",children:e.jsx(g,{className:"text-blue-600 text-4xl"})}),e.jsx("h3",{className:"text-xl font-semibold text-blue-600",children:"AI-Powered Search"}),e.jsx("p",{className:"text-gray-700 mt-2",children:"Find supervisors, grants, and collaboration opportunities efficiently with AI-based recommendations."})]}),e.jsxs("div",{className:"bg-white p-8 rounded-lg shadow-lg",children:[e.jsx("div",{className:"flex justify-center mb-6",children:e.jsx(b,{className:"text-blue-600 text-4xl"})}),e.jsx("h3",{className:"text-xl font-semibold text-blue-600",children:"Networking Hub"}),e.jsx("p",{className:"text-gray-700 mt-2",children:"Connect with researchers, students, and industries to foster meaningful collaborations and partnerships."})]}),e.jsxs("div",{className:"bg-white p-8 rounded-lg shadow-lg",children:[e.jsx("div",{className:"flex justify-center mb-6",children:e.jsx(j,{className:"text-blue-600 text-4xl"})}),e.jsx("h3",{className:"text-xl font-semibold text-blue-600",children:"Research Management"}),e.jsx("p",{className:"text-gray-700 mt-2",children:"Organize and manage your research projects with built-in tools for timelines, milestones, and collaboration."})]}),e.jsxs("div",{className:"bg-white p-8 rounded-lg shadow-lg",children:[e.jsx("div",{className:"flex justify-center mb-6",children:e.jsx(f,{className:"text-blue-600 text-4xl"})}),e.jsx("h3",{className:"text-xl font-semibold text-blue-600",children:"Data Analytics"}),e.jsx("p",{className:"text-gray-700 mt-2",children:"Access in-depth analytics to monitor research trends, publications, and institutional performance."})]}),e.jsxs("div",{className:"bg-white p-8 rounded-lg shadow-lg",children:[e.jsx("div",{className:"flex justify-center mb-6",children:e.jsx(p,{className:"text-blue-600 text-4xl"})}),e.jsx("h3",{className:"text-xl font-semibold text-blue-600",children:"University Integration"}),e.jsx("p",{className:"text-gray-700 mt-2",children:"Seamlessly integrate with universities for student progress tracking and academic resource management."})]}),e.jsxs("div",{className:"bg-white p-8 rounded-lg shadow-lg",children:[e.jsx("div",{className:"flex justify-center mb-6",children:e.jsx(N,{className:"text-blue-600 text-4xl"})}),e.jsx("h3",{className:"text-xl font-semibold text-blue-600",children:"Discussion Forums"}),e.jsx("p",{className:"text-gray-700 mt-2",children:"Engage in topic-specific forums to exchange ideas, get feedback, and discuss research developments."})]})]})]})}),e.jsx("section",{id:"cta-video",className:"py-16 bg-blue-600 text-center text-white",children:e.jsxs("div",{className:"container mx-auto px-6",children:[e.jsx("h2",{className:"text-3xl font-bold",children:"Join NexScholar Today!"}),e.jsx("p",{className:"mt-4 max-w-2xl mx-auto",children:"Take your research to the next level with NexScholar. Connect with like-minded individuals, access valuable resources, and grow your network."}),e.jsx("div",{className:"mt-8",children:e.jsx(n,{href:route("register"),className:"px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50",children:"Get Started"})})]})}),e.jsx(d,{items:o,auth:s,title:"Posts",type:"post"}),e.jsx(d,{items:t,auth:s,title:"Events",type:"event"}),e.jsx(d,{items:a,auth:s,title:"Projects",type:"project"}),e.jsx(d,{items:c,auth:s,title:"Grants",type:"grant"}),e.jsx("footer",{className:"bg-gray-100 text-center py-4 mt-6",children:e.jsxs("p",{className:"text-sm text-gray-700",children:["NexScholar © ",l,". All Rights Reserved."]})})]})};export{y as default};
