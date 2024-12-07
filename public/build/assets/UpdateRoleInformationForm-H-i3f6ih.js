import{q as g,W as E,r as v,j as e}from"./app-B8hMwTQy.js";import{T as d,I as a}from"./TextInput-BUkyM7uL.js";import{I as n}from"./InputLabel-DLAAkzE4.js";import{P as D}from"./PrimaryButton-otR8zsSV.js";import{z as I}from"./transition-CO8qlwGQ.js";function T({isPostgraduate:M,isAcademician:L,universities:j,faculties:b,className:_=""}){const l=g().props.academician,s=g().props.postgraduate,{data:r,setData:t,post:x,errors:o,processing:y,recentlySuccessful:N}=E({phone_number:(l==null?void 0:l.phone_number)||(s==null?void 0:s.phone_number)||"",full_name:(l==null?void 0:l.full_name)||(s==null?void 0:s.full_name)||"",profile_picture:(l==null?void 0:l.profile_picture)||(s==null?void 0:s.profile_picture)||"",field_of_study:(l==null?void 0:l.field_of_study)||(s==null?void 0:s.field_of_study)||"",highest_degree:(l==null?void 0:l.highest_degree)||(s==null?void 0:s.highest_degree)||"",field_of_research:typeof(l==null?void 0:l.field_of_research)=="string"?JSON.parse(l==null?void 0:l.field_of_research):(l==null?void 0:l.field_of_research)||(typeof(s==null?void 0:s.field_of_research)=="string"?JSON.parse(s==null?void 0:s.field_of_research):(s==null?void 0:s.field_of_research)||[]),niche_domain:typeof(l==null?void 0:l.niche_domain)=="string"?JSON.parse(l==null?void 0:l.niche_domain):(l==null?void 0:l.niche_domain)||(typeof(s==null?void 0:s.niche_domain)=="string"?JSON.parse(s==null?void 0:s.niche_domain):(s==null?void 0:s.niche_domain)||[]),website:(l==null?void 0:l.website)||(s==null?void 0:s.website)||"",linkedin:(l==null?void 0:l.linkedin)||(s==null?void 0:s.linkedin)||"",google_scholar:(l==null?void 0:l.google_scholar)||(s==null?void 0:s.google_scholar)||"",researchgate:(l==null?void 0:l.researchgate)||(s==null?void 0:s.researchgate)||"",orcid:(l==null?void 0:l.orcid)||(s==null?void 0:s.orcid)||"",bio:(l==null?void 0:l.bio)||(s==null?void 0:s.bio)||"",current_position:(l==null?void 0:l.current_position)||"",department:(l==null?void 0:l.department)||"",availability_as_supervisor:(l==null?void 0:l.availability_as_supervisor)||!1,availability_for_collaboration:(l==null?void 0:l.availability_for_collaboration)||!1,faculty:(s==null?void 0:s.faculty)||"",supervisorAvailability:(s==null?void 0:s.supervisorAvailability)||!1,university:(s==null?void 0:s.university)||"",grantAvailability:(s==null?void 0:s.grantAvailability)||!1}),S=i=>{if(i.preventDefault(),!r.profile_picture){alert("Please select a profile picture.");return}const c=new FormData;c.append("profile_picture",r.profile_picture),x(route("role.updateProfilePicture"),{data:c,headers:{"Content-Type":"multipart/form-data"},onSuccess:()=>{alert("Profile picture updated successfully."),f()},onError:u=>{console.error("Error updating profile picture:",u),alert("Failed to update the profile picture. Please try again.")}})},w=i=>{i.preventDefault();const c=new FormData;Object.keys(r).forEach(u=>{u!=="profile_picture"&&(Array.isArray(r[u])?c.append(u,JSON.stringify(r[u])):c.append(u,r[u]))}),x(route("role.update"),{data:c,headers:{"Content-Type":"multipart/form-data"},onSuccess:()=>{alert("Profile updated successfully.")},onError:u=>{console.error("Error updating profile:",u),alert("Failed to update the profile. Please try again.")}})},[C,p]=v.useState(!1),P=()=>p(!0),f=()=>p(!1),[h,A]=v.useState(r.university),k=b.filter(i=>i.university_id===parseInt(h)),[m,F]=v.useState("profiles");return e.jsxs("div",{className:"pb-8",children:[e.jsxs("div",{className:"w-full h-66 bg-cover bg-center mt-4",style:{backgroundImage:`url('https://picsum.photos/seed/${(l==null?void 0:l.id)||(s==null?void 0:s.id)}/500/150')`},children:[e.jsx("div",{}),e.jsxs("div",{className:"flex flex-col items-center -mt-16 relative",children:[e.jsxs("div",{className:"relative",children:[e.jsx("img",{src:`/storage/${r.profile_picture||"default-profile.jpg"}`,alt:"Profile",className:"w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"}),e.jsx("button",{onClick:P,className:"absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full shadow-lg text-white hover:bg-blue-600","aria-label":"Edit Profile Picture",children:"✏️"})]}),e.jsxs("div",{className:"text-center mt-8",children:[e.jsx("h1",{className:"text-2xl font-semibold text-gray-800 uppercase",children:r.full_name}),e.jsx("p",{className:"text-gray-500",children:r.highest_degree}),e.jsx("p",{className:"text-gray-500",children:r.current_position})]})]})]}),C&&e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50",children:e.jsxs("div",{className:"bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg",children:[e.jsx("h2",{className:"text-xl font-semibold text-gray-800 mb-4",children:"Update Profile Picture"}),e.jsxs("form",{onSubmit:S,children:[e.jsx("input",{type:"file",accept:"image/*",className:"block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100",onChange:i=>t("profile_picture",i.target.files[0])}),e.jsxs("div",{className:"mt-4 flex justify-end",children:[e.jsx("button",{type:"submit",className:"px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2",children:"Save"}),e.jsx("button",{type:"button",onClick:f,className:"px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400",children:"Cancel"})]})]})]})}),e.jsx("div",{className:"bg-white border-b border-gray-200",children:e.jsx("div",{className:"max-w-6xl mx-auto flex space-x-8 px-4 sm:px-6",children:["Profiles","Projects","Works","Teams","Network","Activity","More"].map(i=>e.jsx("button",{className:`py-4 px-3 font-medium text-sm ${m.toLowerCase()===i.toLowerCase()?"border-b-2 border-blue-500 text-blue-600":"text-gray-500 hover:text-gray-700"}`,onClick:()=>F(i.toLowerCase()),children:i},i))})}),e.jsxs("div",{className:"w-full px-4 py-8",children:[m==="profiles"&&e.jsxs("section",{className:_,children:[e.jsxs("header",{children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900",children:"Personal Information"}),e.jsx("p",{className:"mt-1 text-sm text-gray-600",children:"Update your personal information."})]}),e.jsxs("form",{onSubmit:w,className:"mt-6 space-y-6",children:[e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6 w-full",children:[e.jsxs("div",{className:"w-full",children:[e.jsx(n,{htmlFor:"full_name",value:"Full Name",required:!0}),e.jsx(d,{id:"full_name",className:"mt-1 block w-full",value:r.full_name,onChange:i=>t("full_name",i.target.value),required:!0,isFocused:!0,autoComplete:"full_name"}),e.jsx(a,{className:"mt-2",message:o.full_name})]}),e.jsxs("div",{className:"w-full",children:[e.jsx(n,{htmlFor:"phone_number",value:"Phone Number",required:!0}),e.jsx(d,{id:"phone_number",className:"mt-1 block w-full",value:r.phone_number,onChange:i=>t("phone_number",i.target.value),autoComplete:"tel"}),e.jsx(a,{className:"mt-2",message:o.phone_number})]})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6 w-full",children:[e.jsxs("div",{className:"w-full",children:[e.jsx(n,{htmlFor:"highest_degree",value:"Highest Degree",required:!0}),e.jsxs("select",{id:"highest_degree",className:"mt-1 block w-full border rounded-md p-2",value:r.highest_degree||"",onChange:i=>t("highest_degree",i.target.value),children:[e.jsx("option",{value:"",hidden:!0,children:"Select your Highest Degree"}),e.jsx("option",{value:"Certificate",children:"Certificate"}),e.jsx("option",{value:"Diploma",children:"Diploma"}),e.jsx("option",{value:"Bachelor's Degree",children:"Bachelor's Degree"}),e.jsx("option",{value:"Master's Degree",children:"Master's Degree"}),e.jsx("option",{value:"Ph.D.",children:"Ph.D."}),e.jsx("option",{value:"Postdoctoral",children:"Postdoctoral"})]}),e.jsx(a,{className:"mt-2",message:o.highest_degree})]}),e.jsxs("div",{children:[e.jsx(n,{htmlFor:"field_of_study",value:"Field of Study",required:!0}),e.jsx(d,{id:"field_of_study",className:"mt-1 block w-full",value:r.field_of_study,onChange:i=>t("field_of_study",i.target.value)}),e.jsx(a,{className:"mt-2",message:o.field_of_study})]})]}),e.jsx("div",{className:"grid grid-cols-1 lg:grid-cols-1 gap-6 w-full",children:e.jsxs("div",{className:"w-full",children:[e.jsx(n,{htmlFor:"bio",value:"Bio"}),e.jsx("textarea",{id:"bio",className:"mt-1 block w-full",value:r.bio,onChange:i=>t("bio",i.target.value),rows:4}),e.jsx(a,{className:"mt-2",message:o.bio})]})}),e.jsx("div",{className:"grid grid-cols-1 lg:grid-cols-1 gap-6 w-full",children:e.jsxs("div",{className:"w-full",children:[e.jsx(n,{htmlFor:"field_of_research",value:"Field of Research"}),e.jsxs("select",{id:"field_of_research",className:"mt-1 block w-full border rounded-md p-2",value:r.field_of_research,onChange:i=>t("field_of_research",Array.from(i.target.selectedOptions,c=>c.value)),multiple:!0,children:[e.jsx("option",{value:"Agricultural Sciences",children:"Agricultural Sciences"}),e.jsx("option",{value:"Astronomy and Astrophysics",children:"Astronomy and Astrophysics"}),e.jsx("option",{value:"Biological Sciences",children:"Biological Sciences"}),e.jsx("option",{value:"Business and Management",children:"Business and Management"}),e.jsx("option",{value:"Chemical Sciences",children:"Chemical Sciences"}),e.jsx("option",{value:"Civil Engineering",children:"Civil Engineering"}),e.jsx("option",{value:"Computer Science",children:"Computer Science"}),e.jsx("option",{value:"Creative Arts and Writing",children:"Creative Arts and Writing"}),e.jsx("option",{value:"Earth Sciences",children:"Earth Sciences"}),e.jsx("option",{value:"Economics",children:"Economics"}),e.jsx("option",{value:"Education",children:"Education"}),e.jsx("option",{value:"Electrical and Electronic Engineering",children:"Electrical and Electronic Engineering"}),e.jsx("option",{value:"Environmental Sciences",children:"Environmental Sciences"}),e.jsx("option",{value:"Health Sciences",children:"Health Sciences"}),e.jsx("option",{value:"History",children:"History"}),e.jsx("option",{value:"Humanities and Social Sciences",children:"Humanities and Social Sciences"}),e.jsx("option",{value:"Law and Legal Studies",children:"Law and Legal Studies"}),e.jsx("option",{value:"Library and Information Science",children:"Library and Information Science"}),e.jsx("option",{value:"Materials Engineering",children:"Materials Engineering"}),e.jsx("option",{value:"Mathematics",children:"Mathematics"}),e.jsx("option",{value:"Mechanical Engineering",children:"Mechanical Engineering"}),e.jsx("option",{value:"Medical and Health Sciences",children:"Medical and Health Sciences"}),e.jsx("option",{value:"Philosophy and Religious Studies",children:"Philosophy and Religious Studies"}),e.jsx("option",{value:"Physical Sciences",children:"Physical Sciences"}),e.jsx("option",{value:"Political Science",children:"Political Science"}),e.jsx("option",{value:"Psychology",children:"Psychology"}),e.jsx("option",{value:"Sociology",children:"Sociology"}),e.jsx("option",{value:"Space Sciences",children:"Space Sciences"}),e.jsx("option",{value:"Statistics",children:"Statistics"}),e.jsx("option",{value:"Veterinary Sciences",children:"Veterinary Sciences"})]}),e.jsx(a,{className:"mt-2",message:o.field_of_research})]})}),l&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6 w-full",children:[e.jsxs("div",{className:"w-full",children:[e.jsx(n,{htmlFor:"current_position",value:"Current Position",required:!0}),e.jsxs("select",{id:"current_position",className:"mt-1 block w-full border rounded-md p-2",value:r.current_position,onChange:i=>t("current_position",i.target.value),children:[e.jsx("option",{value:"",children:"Select Position"})," ",e.jsx("option",{value:"Lecturer",children:"Lecturer"}),e.jsx("option",{value:"Senior Lecturer",children:"Senior Lecturer"}),e.jsx("option",{value:"Assoc. Prof.",children:"Associate Professor"}),e.jsx("option",{value:"Professor",children:"Professor"}),e.jsx("option",{value:"Postdoctoral Researcher",children:"Postdoctoral Researcher"}),e.jsx("option",{value:"Researcher",children:"Researcher"})]}),e.jsx(a,{className:"mt-2",message:o.current_position})]}),e.jsxs("div",{children:[e.jsx(n,{htmlFor:"department",value:"Department",required:!0}),e.jsx(d,{id:"department",className:"mt-1 block w-full",value:r.department,onChange:i=>t("department",i.target.value)}),e.jsx(a,{className:"mt-2",message:o.department})]})]}),e.jsxs("div",{children:[e.jsx(n,{htmlFor:"availability_as_supervisor",value:"Availability as Supervisor",required:!0}),e.jsxs("select",{id:"availability_as_supervisor",className:"mt-1 block w-full border rounded-md p-2",value:r.availability_as_supervisor,onChange:i=>t("availability_as_supervisor",i.target.value==="true"),children:[e.jsx("option",{value:"true",children:"Available"}),e.jsx("option",{value:"false",children:"Not Available"})]}),e.jsx(a,{className:"mt-2",message:o.availability_as_supervisor})]})]}),s&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{children:[e.jsx(n,{htmlFor:"university",value:"University",required:!0}),e.jsxs("select",{id:"university",className:"mt-1 block w-full border rounded-md p-2",value:h||"",onChange:i=>{const c=i.target.value;A(c),t("university",c)},children:[e.jsx("option",{value:"",hidden:!0,children:"Select your University"}),j.map(i=>e.jsx("option",{value:i.id,children:i.full_name},i.id))]}),e.jsx(a,{className:"mt-2",message:o.university})]}),h&&e.jsxs("div",{children:[e.jsx(n,{htmlFor:"faculty",value:"Faculty",required:!0}),e.jsxs("select",{id:"faculty",className:"mt-1 block w-full border rounded-md p-2",value:r.faculty||"",onChange:i=>t("faculty",i.target.value),children:[e.jsx("option",{value:"",hidden:!0,children:"Select your Faculty"}),k.map(i=>e.jsx("option",{value:i.id,children:i.name},i.id))]}),e.jsx(a,{className:"mt-2",message:o.faculty})]}),e.jsxs("div",{children:[e.jsx(n,{htmlFor:"supervisorAvailability",value:"Supervisor Availability",required:!0}),e.jsxs("select",{id:"supervisorAvailability",className:"mt-1 block w-full border rounded-md p-2",value:r.supervisorAvailability,onChange:i=>t("supervisorAvailability",i.target.value==="true"),children:[e.jsx("option",{value:"true",children:"Available"}),e.jsx("option",{value:"false",children:"Not Available"})]}),e.jsx(a,{className:"mt-2",message:o.supervisorAvailability})]}),e.jsxs("div",{children:[e.jsx(n,{htmlFor:"grantAvailability",value:"Grant Availability",required:!0}),e.jsxs("select",{id:"grantAvailability",className:"mt-1 block w-full border rounded-md p-2",value:r.grantAvailability,onChange:i=>t("grantAvailability",i.target.value==="true"),children:[e.jsx("option",{value:"true",children:"Available"}),e.jsx("option",{value:"false",children:"Not Available"})]}),e.jsx(a,{className:"mt-2",message:o.grantAvailability})]})]}),e.jsxs("div",{children:[e.jsx(n,{htmlFor:"website",value:"Website"}),e.jsx(d,{id:"website",className:"mt-1 block w-full",value:r.website,onChange:i=>t("website",i.target.value),autoComplete:"url"}),e.jsx(a,{className:"mt-2",message:o.website})]}),e.jsxs("div",{children:[e.jsx(n,{htmlFor:"linkedin",value:"LinkedIn"}),e.jsx(d,{id:"linkedin",className:"mt-1 block w-full",value:r.linkedin,onChange:i=>t("linkedin",i.target.value),autoComplete:"url"}),e.jsx(a,{className:"mt-2",message:o.linkedin})]}),e.jsxs("div",{children:[e.jsx(n,{htmlFor:"google_scholar",value:"Google Scholar"}),e.jsx(d,{id:"google_scholar",className:"mt-1 block w-full",value:r.google_scholar,onChange:i=>t("google_scholar",i.target.value),autoComplete:"url"}),e.jsx(a,{className:"mt-2",message:o.google_scholar})]}),e.jsxs("div",{children:[e.jsx(n,{htmlFor:"researchgate",value:"ResearchGate"}),e.jsx(d,{id:"researchgate",className:"mt-1 block w-full",value:r.researchgate,onChange:i=>t("researchgate",i.target.value),autoComplete:"url"}),e.jsx(a,{className:"mt-2",message:o.researchgate})]}),e.jsxs("div",{children:[e.jsx(n,{htmlFor:"orcid",value:"ORCID"}),e.jsx(d,{id:"orcid",className:"mt-1 block w-full",value:r.orcid,onChange:i=>t("orcid",i.target.value)}),e.jsx(a,{className:"mt-2",message:o.orcid})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(D,{disabled:y,children:"Save"}),e.jsx(I,{show:N,enter:"transition ease-in-out",enterFrom:"opacity-0",leave:"transition ease-in-out",leaveTo:"opacity-0",children:e.jsx("p",{className:"text-sm text-gray-600",children:"Saved."})})]})]})]}),m==="projects"&&e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"})]})]})}export{T as default};