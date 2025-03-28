import{q as j,W as f,r as p,j as e,a as b}from"./app-Bwu-bara.js";import{M as v}from"./MainLayout-WwMCgBYJ.js";import{R as N}from"./quill.snow-B-KDMglX.js";import{u as y}from"./useRoles-cSkxEsk_.js";import"./index-DRKyvpEV.js";import"./analytics-18rYXD_U.js";function w({tags:c,setTags:l}){const[r,i]=p.useState(""),d=t=>{if(t.key==="Enter"||t.key===","){t.preventDefault();const o=r.trim();o&&!c.includes(o)&&l([...c,o]),i("")}else t.key==="Backspace"&&!r.length&&c.length&&l(c.slice(0,c.length-1))},m=t=>{l(c.filter((o,x)=>x!==t))};return e.jsxs("div",{className:"flex flex-wrap items-center border rounded-lg p-2",children:[c.map((t,o)=>e.jsxs("div",{className:"bg-blue-200 text-blue-800 rounded-full px-3 py-1 m-1 flex items-center",children:[e.jsx("span",{children:t}),e.jsx("button",{type:"button",onClick:()=>m(o),className:"ml-2 text-sm text-blue-800",children:"×"})]},o)),e.jsx("input",{type:"text",value:r,onChange:t=>i(t.target.value),onKeyDown:d,className:"flex-grow outline-none p-1",placeholder:"Type a tag and press enter"})]})}function T(){const{auth:c,post:l}=j().props;y();const{data:r,setData:i,post:d,processing:m,errors:t}=f({title:l.title||"",url:l.url||"",content:l.content||"",category:l.category||"",tags:l.tags||[],images:null,featured_image:null,attachment:null,status:l.status||"published"}),o=s=>{i("tags",s)},[x,S]=p.useState([]);function g(s){s.preventDefault();const n=new FormData;Object.keys(r).forEach(a=>{a==="tags"?n.append(a,JSON.stringify(r[a])):a==="images"&&Array.isArray(r[a])?r[a].forEach((u,h)=>{n.append(`images[${h}]`,u)}):(r[a]instanceof File,n.append(a,r[a]))}),x.forEach(a=>{n.append("delete_images[]",a)}),d(route("create-posts.update",l.id),{data:n,headers:{"Content-Type":"multipart/form-data"},preserveScroll:!0,onSuccess:()=>{alert("Post updated successfully.")},onError:a=>{console.error("Error updating Post:",a),alert("Failed to update the Post. Please check the form for errors.")}})}return e.jsx(v,{children:e.jsx("div",{className:"p-4",children:e.jsxs("form",{onSubmit:g,className:"bg-white p-6 rounded-lg max-w-7xl mx-auto space-y-6",children:[e.jsx("h1",{className:"text-xl font-bold text-gray-700 text-center",children:"Edit Post"}),Object.keys(t).length>0&&e.jsxs("div",{className:"bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative",role:"alert",children:[e.jsx("strong",{className:"font-bold",children:"Please fix the following errors:"}),e.jsx("ul",{className:"mt-2 list-disc list-inside",children:Object.entries(t).map(([s,n])=>e.jsx("li",{children:s==="images"?Object.entries(n).map(([a,u])=>e.jsxs("span",{children:["Image ",parseInt(a)+1,": ",u]},a)):n},s))})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-10 gap-4 lg:gap-8",children:[e.jsxs("div",{className:"lg:col-span-7",children:[e.jsxs("label",{className:"block text-gray-700 font-medium",children:["Post Title",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("input",{type:"text",value:r.title,onChange:s=>i("title",s.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",placeholder:"Enter Post Title"}),t.title&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.title})]}),e.jsxs("div",{className:"lg:col-span-3",children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Category"}),e.jsxs("select",{id:"category",name:"category",value:r.category,onChange:s=>i("category",s.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 text-sm",children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select Category"}),e.jsx("option",{value:"General Discussion",children:"General Discussion"}),e.jsx("option",{value:"Academic Research",children:"Academic Research"}),e.jsx("option",{value:"Student Life",children:"Student Life"}),e.jsx("option",{value:"Career Opportunities",children:"Career Opportunities"}),e.jsx("option",{value:"News",children:"News"}),e.jsx("option",{value:"Startup",children:"Startup"}),e.jsx("option",{value:"Technology",children:"Technology"}),e.jsx("option",{value:"Research Methodology",children:"Research Methodology"}),e.jsx("option",{value:"Research Paradigm",children:"Research Paradigm"}),e.jsx("option",{value:"Science & Technology",children:"Science & Technology"}),e.jsx("option",{value:"Social Science",children:"Social Science"}),e.jsx("option",{value:"Community",children:"Community"}),e.jsx("option",{value:"Award",children:"Award"}),e.jsx("option",{value:"Achievement",children:"Achievement"}),e.jsx("option",{value:"Business",children:"Business"}),e.jsx("option",{value:"Economy",children:"Economy"}),e.jsx("option",{value:"Health",children:"Health"}),e.jsx("option",{value:"Science",children:"Science"}),e.jsx("option",{value:"Sport",children:"Sport"}),e.jsx("option",{value:"Corporate Social Responsibility",children:"Corporate Social Responsibility"}),e.jsx("option",{value:"Knowledge Transfer Program",children:"Knowledge Transfer Program"})]}),t.category&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.category})]})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-10 gap-4 lg:gap-8",children:[e.jsxs("div",{className:"lg:col-span-7",children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Post URL"}),e.jsx("input",{type:"url",value:r.url,disabled:!0,onChange:s=>i("url",s.target.value),className:"mt-1 w-full rounded-lg border-gray-200 p-4 bg-gray-100 text-sm cursor-not-allowed",placeholder:"Auto-generated from title"}),t.url&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.url})]}),e.jsxs("div",{className:"lg:col-span-3",children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Tags"}),e.jsx(w,{tags:r.tags,setTags:o}),t.tags&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.tags})]})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-10 gap-4 lg:gap-8",children:[e.jsxs("div",{className:"lg:col-span-7",children:[e.jsxs("label",{className:"block text-gray-700 font-medium",children:["Content ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx("div",{className:"mt-1 w-full rounded-lg border border-gray-200",style:{height:"300px",overflowY:"auto"},children:e.jsx(N,{theme:"snow",value:r.content,onChange:s=>i("content",s),placeholder:"Enter content",style:{height:"300px",maxHeight:"300px"}})}),t.content&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.content})]}),e.jsxs("div",{className:"lg:col-span-3 flex flex-col space-y-4 lg:space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Upload Images (Multiple Allowed)"}),e.jsx("p",{className:"text-sm text-gray-500",children:"(Upload new images will delete all existed images)"}),e.jsx("input",{type:"file",accept:"image/*",multiple:!0,onChange:s=>{const n=Array.from(s.target.files);i("images",n)},className:"mt-1 w-full rounded-lg border-gray-200 p-2 text-sm"}),l.images&&e.jsxs("div",{className:"mt-2",children:[e.jsx("p",{className:"text-sm font-medium",children:"Current Images:"}),e.jsx("div",{className:"flex flex-wrap gap-2",children:JSON.parse(l.images).map((s,n)=>e.jsxs("a",{href:`/storage/${s}`,target:"_blank",rel:"noopener noreferrer",className:"text-blue-500 underline",children:["Image ",n+1]},n))})]}),t.images&&e.jsx("div",{className:"mt-1",children:Object.entries(t.images).map(([s,n])=>e.jsxs("p",{className:"text-red-500 text-xs",children:["Image ",parseInt(s)+1,": ",n]},s))})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Upload Featured Image"}),e.jsx("input",{type:"file",accept:"image/*",onChange:s=>i("featured_image",s.target.files[0]),className:"mt-1 w-full rounded-lg border-gray-200 p-2 text-sm"}),l.featured_image&&e.jsxs("div",{className:"mt-2",children:[e.jsx("p",{className:"text-sm font-medium",children:"Current Featured Image:"}),e.jsx("a",{href:`/storage/${l.featured_image}`,target:"_blank",rel:"noopener noreferrer",className:"text-blue-500 underline",children:"View Featured Image"})]}),t.featured_image&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.featured_image})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-gray-700 font-medium",children:"Upload Attachment"}),e.jsx("input",{type:"file",onChange:s=>i("attachment",s.target.files[0]),className:"mt-1 w-full rounded-lg border-gray-200 p-2 text-sm"}),l.attachment&&e.jsxs("div",{className:"mt-2",children:[e.jsx("p",{className:"text-sm font-medium",children:"Current Attachment:"}),e.jsx("a",{href:`/storage/${l.attachment}`,target:"_blank",rel:"noopener noreferrer",className:"text-blue-500 underline",children:"View Attachment"})]}),t.attachment&&e.jsx("p",{className:"text-red-500 text-xs mt-1",children:t.attachment})]})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row gap-4 sm:space-x-4",children:[e.jsx("button",{type:"submit",disabled:m,className:"w-full sm:w-auto inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600",children:"Update"}),e.jsx(b,{href:route("create-posts.index"),className:"w-full sm:w-auto inline-block rounded-lg bg-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-400 text-center",children:"Cancel"})]})]})})})}export{T as default};
