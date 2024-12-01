import{r as a,j as e}from"./app-TDCK3Dw0.js";import{F as E,a as I,b as M,c as B}from"./index-BCI782Or.js";const $=({profilesData:g,supervisorAvailabilityKey:r,universitiesList:p,isPostgraduateList:b,users:y})=>{var v;const[n,N]=a.useState(""),[o,_]=a.useState(""),[d,w]=a.useState(""),[c,i]=a.useState(1),u=8,[S,x]=a.useState(!1),[t,k]=a.useState(null),A=s=>{k(s),x(!0)},C=[...new Set(g.flatMap(s=>s.field_of_study||[]))],f=g.filter(s=>{var j;const l=n===""||(s.field_of_study||[]).includes(n),m=o===""||s.university===parseInt(o),L=d===""||((j=s[r])==null?void 0:j.toString())===d;return l&&m&&L}),P=Math.ceil(f.length/u),F=f.slice((c-1)*u,c*u),U=s=>{i(s)},h=s=>{const l=p.find(m=>m.id===s);return l?l.short_name:"Unknown University"};return e.jsxs("div",{className:"min-h-screen p-4 sm:p-6",children:[e.jsxs("div",{className:"flex flex-wrap justify-center gap-4 mb-6",children:[e.jsxs("select",{className:"p-2 border border-gray-300 rounded w-full sm:w-auto",value:n,onChange:s=>{N(s.target.value),i(1)},children:[e.jsx("option",{value:"",children:"All Field of Study"}),C.map(s=>e.jsx("option",{value:s,children:s},s))]}),e.jsxs("select",{className:"p-2 border border-gray-300 rounded w-full sm:w-auto",value:o,onChange:s=>{_(s.target.value),i(1)},children:[e.jsx("option",{value:"",children:"All Universities"}),p.map(s=>e.jsx("option",{value:s.id,children:s.short_name},s.id))]}),e.jsxs("select",{className:"p-2 border border-gray-300 rounded w-full sm:w-auto",value:d,onChange:s=>{w(s.target.value),i(1)},children:[e.jsx("option",{value:"",children:"All Supervisor Availability"}),r==="availability_as_supervisor"?e.jsxs(e.Fragment,{children:[e.jsx("option",{value:"1",children:"Available as Supervisor"}),e.jsx("option",{value:"0",children:"Not Available as Supervisor"})]}):e.jsxs(e.Fragment,{children:[e.jsx("option",{value:"1",children:"Looking for a Supervisor"}),e.jsx("option",{value:"0",children:"Not Looking for a Supervisor"})]})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6",children:[F.map(s=>e.jsxs("div",{className:"bg-white shadow-md rounded-lg overflow-hidden relative",children:[e.jsx("div",{className:"absolute top-2 left-2 bg-blue-500 text-white text-[10px]  font-semibold px-2.5 py-0.5  rounded-full",children:h(s.university)}),!b&&s.verified===1&&e.jsxs("div",{className:"relative group",children:[e.jsx("span",{className:"absolute top-2 right-2 whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] text-purple-700 cursor-pointer",children:"Verified"}),e.jsxs("div",{className:"absolute top-8 right-0 hidden group-hover:flex items-center bg-gray-800 text-white text-xs rounded px-3 py-2 shadow-lg z-10",children:["This account is verified by ",h(s.university)]})]}),e.jsx("div",{className:"h-32",children:e.jsx("img",{src:`https://picsum.photos/seed/${s.id}/500/150`,alt:"Banner",className:"object-cover w-full h-full"})}),e.jsx("div",{className:"flex justify-center -mt-12",children:e.jsx("div",{className:"relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg",children:e.jsx("img",{src:s.profile_picture!==null?`/storage/${s.profile_picture}`:"/storage/profile_pictures/default.jpg",alt:"Profile",className:"w-full h-full object-cover"})})}),e.jsxs("div",{className:"text-center mt-4",children:[e.jsx("h2",{className:"text-lg font-semibold",children:s.full_name}),e.jsx("p",{className:"text-gray-500 text-sm",children:Array.isArray(s.field_of_study)&&s.field_of_study.length>0?s.field_of_study[0]:s.field_of_study&&s.field_of_study.length>0?s.field_of_study:"No Field of Study"}),e.jsx("p",{className:"text-gray-500 text-sm",children:s.current_position}),e.jsx("button",{onClick:()=>A(s),className:"mt-2 bg-blue-500 text-white text-[10px] px-2 font-semibold py-1 rounded-full hover:bg-blue-600",children:"Quick Info"})]}),e.jsxs("div",{className:"flex justify-around items-center mt-6 py-4 border-t px-10",children:[e.jsx(E,{className:"text-gray-500 text-sm cursor-pointer hover:text-blue-700",title:"Copy Email",onClick:()=>handleCopyEmail(s.email)}),e.jsx("a",{href:s.google_scholar,target:"_blank",rel:"noopener noreferrer",className:"text-gray-500 text-sm hover:text-red-700",title:"Google Scholar",children:e.jsx(I,{})}),e.jsx("a",{href:s.website,target:"_blank",rel:"noopener noreferrer",className:"text-gray-500 text-sm hover:text-green-700",title:"Website",children:e.jsx(M,{})}),e.jsx("a",{href:s.linkedin,target:"_blank",rel:"noopener noreferrer",className:"text-gray-500 text-sm hover:text-blue-800",title:"LinkedIn",children:e.jsx(B,{})})]})]},s.id)),S&&t&&e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50",children:e.jsxs("div",{className:"bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg relative",children:[e.jsx("button",{onClick:()=>x(!1),className:"absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none","aria-label":"Close",children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",className:"w-6 h-6",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})}),e.jsx("h3",{className:"text-xl font-bold mb-4 text-gray-800 text-center",children:t.full_name}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"University:"})," ",h(t.university)]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Bio:"})," ",t.bio||"No bio available."]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Fields of Study:"})," ",Array.isArray(t.field_of_study)?t.field_of_study.join(", "):t.field_of_study||"No fields of study"]}),e.jsxs("p",{className:"text-gray-600",children:[r=="availability_as_supervisor"?e.jsx("span",{className:"font-semibold",children:"Available as supervisor:"}):e.jsx("span",{className:"font-semibold",children:"Looking for a supervisor:"}),t[r]===1?" Yes":" No"]}),e.jsxs("p",{className:"text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:"Email:"})," ",((v=y.find(s=>s.unique_id===(t.academician_id||t.postgraduate_id)))==null?void 0:v.email)||"No email provided"]})]}),e.jsx("div",{className:"mt-6 text-center",children:e.jsx("button",{onClick:()=>x(!1),className:"px-6 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition duration-200",children:"Close"})})]})})]}),e.jsx("div",{className:"flex justify-center mt-6 space-x-2",children:Array.from({length:P},(s,l)=>e.jsx("button",{onClick:()=>U(l+1),className:`px-4 py-2 border rounded ${c===l+1?"bg-blue-500 text-white":"bg-white text-gray-700"}`,children:l+1},l))})]})};export{$ as P};
